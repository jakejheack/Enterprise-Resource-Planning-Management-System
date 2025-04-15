$('#cpdatetimepicker').datetimepicker({
    focusOnShow: true,
    format: 'L'
});
$(".selectpicker").selectpicker();

(function ($) {

    var _docService = abp.services.app.documentService;
    var _$modal = $('#DocumentModal');
    var _$form = $('form[name=DocumentForm]');
    var _$table = $('#DocumentsTable');

    var dataTable = _$table.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _docService.getDocumentsFiltered,
            inputFilter: function () {
                var $c = $('#ReferenceId').val();
                var $r = $('#Reference').val();
                var $s = '';
                return {
                    id: 0,
                    reference: $r,
                    referenceId: $c,
                    filter: $s
                };
            }
        },
        columnDefs: [
            {
                className: 'control responsive',
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                targets: 1,
                data: "fileName"
            },
            {
                targets: 2,
                data: "fileExtension"
            }
            ,
            {
                targets: 3,
                data: "description"
            },
            {
                targets: 4,
                data: "referenceName"
            },
            {
                targets: 5,
                data: "creationTime",
                render: function (data) {
                    var tt = new Date(data);
                    var ret = getFormattedDate(tt);
                    if (ret === "01/01/1900") {
                        return 'n/a';
                    }
                    else {
                        return ret;
                    }
                }
            },
            {
                orderable: false,
                targets: 6,
                class: "text-center",
                data: { id: "id", fileName: "fileName", fileExtension: "fileExtension", filePath: "filePath" },
                "render": function (data) {
                    return '<a id="download-doc" title="edit" href="#" class="download-doc" data-doc-id="' + data.id + '" data-doc-filename="' + data.fileName + '" data-doc-fileextension="' + data.fileExtension + '" data-doc-filepath="' + data.filePath + '"><i class="fa fa-download"></i></a>|<a id="delete-cperson" title="delete" href="#" class="delete-cperson" data-doc-id="' + data.id + '" data-doc-name="' + data.fileName + '"><i class="fa fa-trash"></i></a>';
                }
            }
        ]
    });

    function docGetAll() {
        dataTable.ajax.reload();
    }

    docGetAll();

    _$table.on('click', 'a.download-doc', function (e) {
        var id = $(this).attr("data-doc-id");
        var name = $(this).attr("data-doc-filename");
        var extension = $(this).attr("data-doc-fileextension");
        var path = $(this).attr("data-doc-filepath");
        var cname = $('#ClientName').val();
        e.preventDefault();
        var filepath = path + '\\' + name + '.' + extension;
        //location.href = filepath;

        var link = document.createElement('a');
        link.href = filepath;
        link.download = filepath.substr(filepath.lastIndexOf('/') + 1);
        link.click();
    });

    $('#fileinput').on('change', function () {
        var x = document.getElementById("fileinput");
        $("#btnStartUploadfile").show();
        $("#btnclose").show();
        var txt = "";
        if ('files' in x) {
            if (x.files.length == 0) {
                txt = "Select one or more files.";
            } else {
                for (var i = 0; i < x.files.length; i++) {
                    txt += "<br><strong>" + (i + 1) + ". file</strong><br>";
                    var file = x.files[i];
                    if ('name' in file) {
                        txt += "name: " + file.name + " / size: " + file.size + " bytes <br>";
                    }
                }
            }
        }
        else {
            if (x.value == "") {
                txt += "Select one or more files.";
            } else {
                txt += "The files property is not supported by your browser!";
                txt += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
            }
        }
        document.getElementById("demo").innerHTML = txt;
    });

    function saveFile() {
        
        var doc = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        var ref = doc.Reference;
        var refid = doc.ReferenceId;
        var desc = doc.Description;

        abp.message.confirm(
            'New file will be uploaded.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    $.ajax({
                        url: abp.appPath + 'Documents/UploadFile?reference=' + $c + '&referenceid=' + $oc,
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            var docu = {
                                "referenceId": refid,
                                "reference": ref,
                                "description": desc,
                                "fileName": res.fileName,
                                "fileExtension": res.fileExtension,
                                "filePath": res.filePath
                            };
                            _docService.CreateDocument(docu).done(function () {
                                abp.message.success('File Uploaded', 'Success');
                                docGetAll();
                            }).always(function () {
                                abp.ui.clearBusy(_$form);
                            });
                        },
                        error: function (e) { }
                    });
                }
            }
        );
    }

    $('#UploadButton').click(function (e) {
        e.preventDefault();
        saveFile();
    });

    ////Handle save button click
    //_$form.closest('div.modal-content').find(".save-button").click(function (e) {
    //    e.preventDefault();
    //    save();
    //});

    ////Handle enter key
    //_$form.find('input').on('keypress', function (e) {
    //    if (e.which === 13) {
    //        e.preventDefault();
    //        save();
    //    }
    //});

    //$.AdminBSB.input.activate(_$form);

    _$modal.on('shown.bs.modal', function () {
        //_$form.find('input[type=text]:first').focus();
        docGetAll();
    });
})(jQuery);

