
(function () {
    $(function () {

        var _$table = $('#PaymentModeTable');
        var _service = abp.services.app.commonService;
        var _accountService = abp.services.app.accountService;

        var _$formCreate = $('form[name=PaymentModeCreateForm]');
        var _$formEdit = $('form[name=PaymentModeEditForm]');
        var _$modalCreate = $('#PaymentModeCreateModal');
        var _$modalEdit = $('#PaymentModeEditModal');

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getChargeTypes
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
                    targets: 3,
                    data: "revenueAccount"
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-warrantyttpye" title="edit" href="#" class="edit-warrantyttpye" data-warrantyttpye-id="' + data.id + '" data-toggle="modal" data-target="#PaymentModeEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-company" title="delete" href="#" class="delete-warrantyttpye" data-warrantyttpye-id="' + data.id + '" data-warrantyttpye-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-paymentmode" title="edit" href="#" class="edit-paymentmode" data-paymentmode-id="' + data.id + '" data-toggle="modal" data-target="#PaymentModeEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        //var del = '<a id="delete-paymentmode" title="delete" href="#" class="delete-paymentmode" data-paymentmode-id="' + data.id + '" data-paymentmode-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.ChargeType.Edit")) {
                            ret += edit;
                        }
                        //if (abp.auth.isGranted("Pages.PaymentMode.Delete")) {
                        //    ret += (ret.trim().length > 0 ? '|' + del : del);
                        //}
                        return ret;
                    }
                }
            ]
        });

        //Account Autocomplete
        var getAccountsDefault = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountDefault() {
            var $accountidDefault = $('#DefaultAccountId').val();
            _accountService.getAccount({ id: $accountidDefault }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountDefault = function (event, ui) {
            event.preventDefault();
            $("#DefaultAccountId").val(ui.item ? ui.item.value : "");
            $("#DefaultAccount").val(ui.item ? ui.item.label : "");

            getAccountDefault();
            return false;
        };
        var focusAccountDefault = function (event, ui) {
            event.preventDefault();
            $("#DefaultAccountId").val(ui.item.value);
            $("#DefaultAccount").val(ui.item.label);
        };
        var changeAccountDefault = function (event, ui) {
            event.preventDefault();
            $("#DefaultAccountId").val(ui.item ? ui.item.value : "");
            $("#DefaultAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#DefaultAccount").autocomplete({
            source: getAccountsDefault,
            select: selectAccountDefault,
            focus: focusAccountDefault,
            minLength: 2,
            delay: 100,
            change: changeAccountDefault
        });
        //Account Autocomplete

        //Account Autocomplete
        var getAccountsDefaultE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountDefaultE() {
            var $accountidDefault = $('#DefaultAccountIdE').val();
            _accountService.getAccount({ id: $accountidDefault }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountDefaultE = function (event, ui) {
            event.preventDefault();
            $("#DefaultAccountIdE").val(ui.item ? ui.item.value : "");
            $("#DefaultAccountE").val(ui.item ? ui.item.label : "");

            getAccountDefaultE();
            return false;
        };
        var focusAccountDefaultE = function (event, ui) {
            event.preventDefault();
            $("#DefaultAccountIdE").val(ui.item.value);
            $("#DefaultAccountE").val(ui.item.label);
        };
        var changeAccountDefaultE = function (event, ui) {
            event.preventDefault();
            $("#DefaultAccountIdE").val(ui.item ? ui.item.value : "");
            $("#DefaultAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#DefaultAccountE").autocomplete({
            source: getAccountsDefaultE,
            select: selectAccountDefaultE,
            focus: focusAccountDefaultE,
            minLength: 2,
            delay: 100,
            change: changeAccountDefaultE
        });
        //Account Autocomplete

        function getAll() {
            dataTable.ajax.reload();
        }
        getAll();

        // Edit record
        _$table.on('click', 'a.edit-paymentmode', function (e) {
            var paymentmodeId = $(this).attr("data-paymentmode-id");
            $('#Id').val(paymentmodeId);
            getPaymentMode(paymentmodeId);
        });

        // Delete record
        _$table.on('click', 'a.delete-paymentmode', function (e) {
            var id = $(this).attr("data-paymentmode-id");
            //var name = $(this).attr("data-company-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeletePaymentModeConfirmation', 'ezinvmvc'), ''),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deleteWarrantytType({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });
        
        function getAccountDefaultLoad(id) {
            _accountService.getAccount({ id: id }).done(function (result) {
                $('#DefaultAccountE').val(result.name);
            });
        };

        function getPaymentMode(id) {
            _service.getChargeType({ id: id }).done(function (result) {
                $('#NameE').val(result.name);
                $('#CodeE').val(result.code);
                //$('#Ename').val(result.name);
                $('#DefaultAccountIdE').val(result.revenueAccountId);
                var dAcctId = $('#DefaultAccountIdE').val();
                getAccountDefaultLoad(dAcctId);

            });
        };

        _$formCreate.find('button[type="submit"]').click(function (e) {
            e.preventDefault();

            if (!_$formCreate.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var create = _$formCreate.serializeFormToObject(); //serializeFormToObject is defined in main.js
            var formdata = _$formCreate.serializeFormToObject();
            //var isTax = "";
            //if (formdata.IsTaxE === 'on') {
            //    isTax = true;
            //}
            //else {
            //    isTax = false;

            //}

            var viewData = {
                "code": formdata.Code,
                "name": formdata.Name,
                "revenueAccountId": formdata.DefaultAccountId
            };
            abp.message.confirm(
                'Charge Type Mode will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalCreate);
                        _service.createChargeType(viewData).done(function () {
                            abp.notify.success('Charge Type created', 'Success');
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
            //var isTax = "";
            //if (formdata.IsTaxE === 'on') {
            //    isTax = true;
            //}
            //else {
            //    isTax = false;

            //}

            var viewData = {
                "id": formdata.Id,
                "code": formdata.CodeE,
                "name": formdata.NameE,
                "revenueAccountId": formdata.DefaultAccountIdE
            };
            disabled.attr('disabled', 'disabled');

            abp.message.confirm(
                'Charge Type will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _service.updateChargeType(viewData).done(function () {
                            abp.notify.success('Charge Type has been successfully updated', 'Success');
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
