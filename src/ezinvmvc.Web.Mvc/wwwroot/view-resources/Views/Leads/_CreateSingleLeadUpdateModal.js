$('#datetimepicker7').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker8').datetimepicker({
    focusOnShow: true
});

$('.selectpicker').selectpicker();
(function ($) {
    
    var _service = abp.services.app.leadUpdateService;
    var _employeeService = abp.services.app.employeeService;

    var _permissions = {
        create: abp.auth.hasPermission('CRM.Leads.Create'),
        edit: abp.auth.hasPermission('CRM.Leads.Edit'),
        'delete': abp.auth.hasPermission('CRM.Leads.Delete')
    };
    
    var _$modal = $('#LeadUpdateCreateModal');
    var _$form = $('form[name=LeadUpdateCreateForm]');
    
    //Handle save button click
    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        save();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });

    function checkDate(date) {
        //var text = '02/28/2011';
        var comp = date.split('/');
        var m = parseInt(comp[0], 10);
        var d = parseInt(comp[1], 10);
        var y = parseInt(comp[2], 10);
        var date = new Date(y, m - 1, d);
        if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
            //alert('Valid date');
            return true;
        } else {
            //alert('Invalid date');
            return false;
        }
    }

    _$form.validate({
        // Specify validation rules
        rules: {
            LeadSourceId: {
                min: 1
            },
            LeadTaskId: {
                min: 1
            }
        },

        //specify custom messages
        messages: {
            LeadSourceId: {
                min: "This field is required."
            },
            LeadTaskId: {
                min: "This field is required."
            }
        },

        // specify error placement
        errorPlacement: function (error, element) {

            if (element.attr("class").indexOf("selectpicker") != -1) {
                // $(".dropdown-toggle").text(error);
                var mpar = $(element).closest("div.bootstrap-select");
                error.insertAfter($('.dropdown-toggle', mpar));

            } else {
                error.insertAfter(element);
            }
        }

    });

    function save() {
        var err = false;
        var ldate = $("#LeadUpdateDate").val();
        var ndate = $("#NextContactDateTime").val();

        if (!checkDate(ldate)) {
            $("#LeadUpdateDate").val('');
            $("#errDate").show();
            err = true;
        }
        else {
            $("#errDate").hide();
        }

        if (ndate.trim().length <= 0) {
            $("#NextContactDateTime").val('');
            $("#errNDate").show();
            err = true;
        }
        else {
            $("#errNDate").hide();
        }

        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }

        if (err) {
            return;
        }
        var leadupdate = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$modal);
        _service.createLeadUpdate(leadupdate).done(function (res) {
            console.log(res.notifs.length);
            if (res.notifs.length > 0) {
                for (var i = 0; i < res.notifs.length; i++) {
                    if (res.notifs[i].id > 0) {
                        srConnection.invoke('sendNotification', res.leadUpdate.code, res.leadUpdate.id, res.notifs[i].userIds, abp.session.userId, '', res.notifs[i].message); // Send a message to the server
                    }
                }
            }
            $("#LeadUpdateId").val(res.leadUpdate.id);
            clearEntries();
            _$modal.modal('hide');
            //location.reload(true);
        }).always(function () {
            abp.ui.clearBusy(_$modal);
        });
    }

    function clearEntries() {

    }

    //$.AdminBSB.input.activate(_$form);
    //$.AdminBSB.select.activate(_$form);

    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });

    //Employee Autocomplete
    var getemployees = function (request, response) {
        _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.completeName,
                    value: el.id
                };
            }));
        });
    };
    function getemployee() {
        $id = $("#AssignedToId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#AssignedToEmail').val(result.email);
        });
    };
    var selectemployee = function (event, ui) {
        event.preventDefault();
        $("#AssignedToId").val(ui.item ? ui.item.value : "");
        $("#AssignedTo").val(ui.item ? ui.item.label : "");
        getemployee();
        return false;
    };
    var focusemployee = function (event, ui) {
        event.preventDefault();
        $("#AssignedToId").val(ui.item.value);
        $("#AssignedTo").val(ui.item.label);
    };
    var changeemployee = function (event, ui) {
        event.preventDefault();
        $("#AssignedToId").val(ui.item ? ui.item.value : "");
        $("#AssignedTo").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#AssignedToEmail').val('');
        }
    };
    $("#AssignedTo").autocomplete({
        source: getemployees,
        select: selectemployee,
        focus: focusemployee,
        minLength: 2,
        delay: 100,
        change: changeemployee
    });
    //Employee Autocomplete
})(jQuery);