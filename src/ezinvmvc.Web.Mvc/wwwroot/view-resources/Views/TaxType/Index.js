
(function () {
    $(function () {

        var _$table = $('#TaxTypeTable');
        var _service = abp.services.app.taxTypeServices
        var _accountService = abp.services.app.accountService;

        var _$formCreate = $('form[name=TaxTypeCreateForm]');
        var _$formEdit = $('form[name=TaxTypeEditForm]');
        var _$modalCreate = $('#TaxTypeCreateModal');
        var _$modalEdit = $('#TaxTypeEditModal');


        //Account Autocomplete
        var getAccountsCash = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountCash() {
            var $accountidCash = $('#LiabilityAccountId').val();
            _accountService.getAccount({ id: $accountidCash }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountCash = function (event, ui) {
            event.preventDefault();
            $("#LiabilityAccountId").val(ui.item ? ui.item.value : "");
            $("#LiabilityAccount").val(ui.item ? ui.item.label : "");

            getAccountCash();
            return false;
        };
        var focusAccountCash = function (event, ui) {
            event.preventDefault();
            $("#LiabilityAccountId").val(ui.item.value);
            $("#LiabilityAccount").val(ui.item.label);
        };
        var changeAccountCash = function (event, ui) {
            event.preventDefault();
            $("#LiabilityAccountId").val(ui.item ? ui.item.value : "");
            $("#LiabilityAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#LiabilityAccount").autocomplete({
            source: getAccountsCash,
            select: selectAccountCash,
            focus: focusAccountCash,
            minLength: 2,
            delay: 100,
            change: changeAccountCash
        });
        //Account Autocomplete

        //Account Autocomplete
        var getAccountsCashE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountCashE() {
            var $accountidCash = $('#EAccountId').val();
            _accountService.getAccount({ id: $accountidCash }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#EAccountId").val(ui.item ? ui.item.value : "");
            $("#EAccount").val(ui.item ? ui.item.label : "");

            getAccountCashE();
            return false;
        };
        var focusAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#EAccountId").val(ui.item.value);
            $("#EAccount").val(ui.item.label);
        };
        var changeAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#EAccountId").val(ui.item ? ui.item.value : "");
            $("#EAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#EAccount").autocomplete({
            source: getAccountsCashE,
            select: selectAccountCashE,
            focus: focusAccountCashE,
            minLength: 2,
            delay: 100,
            change: changeAccountCashE
        });
        //Account Autocomplete

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getTaxtTypelist
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
                    orderable: false,
                    targets: 1,
                    data: "code"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "name"
                },
                {
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: 3,
                    data: "rate"
                },
                {
                    orderable: false,
                    targets: 4,
                    data: "accountname"
                },
                {
                    orderable: false,
                    targets: 5,
                    data: { type: "type" },
                    render: function (data) {
                        var ret = "";
                        if (data.type == 1) {
                            ret = "VAT";
                        }
                        else {
                            ret = "EWT";
                        }
                        return ret;
                    }
                },
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-taxttpye" title="edit" href="#" class="edit-taxttpye" data-taxttpye-id="' + data.id + '" data-toggle="modal" data-target="#TaxTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-company" title="delete" href="#" class="delete-taxttpye" data-taxttpye-id="' + data.id + '" data-taxttpye-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-taxtype" title="edit" href="#" class="edit-taxtype" data-taxtype-id="' + data.id + '" data-toggle="modal" data-target="#TaxTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-taxtype" title="delete" href="#" class="delete-taxtype" data-taxtype-id="' + data.id + '" data-taxtype-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Tax.Type.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Pages.Tax.Type.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });



        function getAll() {
            dataTable.ajax.reload();
        }
        getAll();

        // Edit record
        $('#TaxTypeTable').on('click', 'a.edit-taxtype', function (e) {
            var taxtypeId = $(this).attr("data-taxtype-id");
            $('#Id').val(taxtypeId);
            getTaxType(taxtypeId);
        });

        // Delete record
        _$table.on('click', 'a.delete-taxtype', function (e) {
            var id = $(this).attr("data-taxtype-id");
            //var name = $(this).attr("data-company-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteTaxTypeConfirmation', 'ezinvmvc'), ''),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deleteTaxtType({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });

        function getTaxType(id) {
            _service.getTaxtType({ id: id }).done(function (result) {
                $('#Ecode').val(result.code);
                $('#Ename').val(result.name);
                $('#ERate').val(result.rate);
                $('#EAccountId').val(result.liabilityAccountId);
                $('#EType').val(result.type);
                $('#EType').selectpicker('refresh');
                getAccountLoad(result.liabilityAccountId);
            });
        };

        function getAccountLoad(accountid) {

            _accountService.getAccount({ id: accountid }).done(function (result) {
                $('#EAccount').val(result.name);
               
            });

        };

        _$formCreate.find('button[type="submit"]').click(function (e) {
            e.preventDefault();
           
            if (!_$formCreate.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var create = _$formCreate.serializeFormToObject(); //serializeFormToObject is defined in main.js

            abp.message.confirm(
                'New Tax Type will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalCreate);
                        _service.createTaxtType(create).done(function () {
                            abp.notify.success('Tax Type created', 'Success');
                            _$modalCreate.modal('hide');
                            getAll();
                        }).always(function () {
                            abp.ui.clearBusy(_$modalCreate);
                        });
                    }
                }
            );


        });

        function update() {
            if (!_$formEdit.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var disabled = _$formEdit.find(':input:disabled').removeAttr('disabled');
            var formdata = _$formEdit.serializeFormToObject();
           
            var viewData = {
                taxtype: {
                    "id": formdata.Id,
                    "code": formdata.Ecode,
                    "name": formdata.EName,
                    "rate": formdata.ERate,
                    "type": formdata.EType,
                    "liabilityaccountid": formdata.EAccountId,
                   
                }
            };
            disabled.attr('disabled', 'disabled');

            abp.message.confirm(
                'New TaxType will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _service.updateTaxtType(viewData).done(function () {
                            abp.notify.success('TaxType has been successfully updated', 'Success');
                            _$modalEdit.modal('hide');
                            getAll();
                        }).always(function () {
                            abp.ui.clearBusy(_$modalEdit);
                        });

                    }
                }
            );
        }

        $('#update').click(function (e) {
            e.preventDefault();
            update();
        });

    });
})();
