// Vendors
(function ($) {

    var _$table = $('#VendorsTable');
    var _$table2 = $('#VendorsTable2');
    var _service = abp.services.app.vendorService;
    var _$modal = $('#VendorCreateModal');
    var _$form = _$modal.find('form');

    var _permissions = {
        create: abp.auth.hasPermission('Master.Vendors.Create'),
        edit: abp.auth.hasPermission('Master.Vendors.Edit'),
        'delete': abp.auth.hasPermission('Master.Vendors.Delete')
    };

    var dataTable = _$table.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _service.getVendors,
            inputFilter: function () {
                var $s = $('#SearchFilter').val();
                return {
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
                data: "name"
            },
            {
                targets: 2,
                data: "email"
            }
            ,
            {
                targets: 3,
                data: "phone"
            },
            {
                targets: 4,
                data: "city"
            },
            {
                targets: 5,
                data: "country"
            },
            {
                orderable: false,
                targets: 6,
                class: "text-center",
                data: { id: "id", name: "name" },
                "render": function (data) {
                    //return '<a id="edit-vendor" title="edit" href="#" class="edit-vendor" data-vendor-id="' + data.id + '" data-toggle="modal" data-target="#VendorEditModal" ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-vendor" title="delete" href="#" class="delete-vendor" data-vendor-id="' + data.id + '" data-vendor-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                    var edit = '<a id="edit-vendor" title="edit" href="#" class="edit-vendor" data-vendor-id="' + data.id + '" data-toggle="modal" data-target="#VendorEditModal" ><i class="fa fa-pencil-square-o"></i></a>';
                    var del = '<a id="delete-vendor" title="delete" href="#" class="delete-vendor" data-vendor-id="' + data.id + '" data-vendor-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    if (abp.auth.isGranted("Master.Vendors.Edit")) {
                        ret += edit;
                    }
                    if (abp.auth.isGranted("Master.Vendors.Delete")) {
                        ret += (ret.trim().length > 0 ? '|' + del : del);
                    }
                    return ret;
                }
            }
        ]
    });

    var dataTable2 = _$table2.DataTable({
        paging: false,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _service.getVendors,
            inputFilter: function () {
                var $s = $('#SearchFilter').val();
                return {
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
                data: "name"
            },
            {
                targets: 2,
                data: "email"
            }
            ,
            {
                targets: 3,
                data: "phone"
            },
            {
                targets: 4,
                data: "city"
            },
            {
                targets: 5,
                data: "country"
            }
        ]
    });

    function getAll() {
        dataTable.ajax.reload();
        dataTable2.ajax.reload();
    }

    $('#SearchButton').click(function (e) {
        e.preventDefault();
        getAll();
    });

    $('#SearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        getAll();
    });

    $('#SearchFilter').focus();

    // Save record
    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var vendor = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        abp.ui.setBusy(_$modal);
        _service.createVendor(vendor).done(function () {
            _$form.trigger("reset");
            _$modal.modal('hide');
            getAll();
        }).always(function () {
            abp.ui.clearBusy(_$modal);
        });
    }

    _$form.find('button[type="submit"]').click(function (e) {
        e.preventDefault();
        save();
    });

    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });

    _$form.find('select').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });
    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });

    // Edit record
    _$table.on('click', 'a.edit-vendor', function (e) {
        var id = $(this).attr("data-vendor-id");
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Vendors/EditModal?id=' + id,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#VendorEditModal div.modal-content').html(content);
                $('select').selectpicker();
            },
            error: function (e) { }
        });
    });

    // Delete record
    _$table.on('click', 'a.delete-vendor', function (e) {
        var id = $(this).attr("data-vendor-id");
        var name = $(this).attr("data-vendor-name");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteVendorConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    _service.deleteVendor({
                        id: id
                    }).done(function () {
                        getAll();
                    });
                }
            }
        );
    });

    $('#ExportToExcelButton').click(function (e) {
        e.preventDefault();
        tableToExcel('VendorsTable2', 'Vendors', 'Vendors.xls');
    });

    function tableToExcel(table, name, filename) {
        let uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(decodeURIComponent(encodeURIComponent(s.replace(/[\u00A0-\u2666]/g, function (c) {
                    return '&#' + c.charCodeAt(0) + ';';
                }).replace(/[\u{0080}-\u{FFFF}]/gu, ""))))
            }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

        if (!table.nodeType) table = document.getElementById(table);
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

        var link = document.createElement('a');
        link.download = filename;
        link.href = uri + base64(format(template, ctx));
        link.click();
    }

    //$('#ExportToExcelButton').click(function (e) {
    //    e.preventDefault();

    //    _service.getVendorsToExcel({})
    //        .done(function (result) {
    //            app.downloadTempFile(result);
    //        });
    //});

    $('#ExportButton').click(function () {
        _service
            .getVendorsToExcel({})
            .done(function (result) {
                app.downloadTempFile(result);
            });
    });
}) (jQuery);

