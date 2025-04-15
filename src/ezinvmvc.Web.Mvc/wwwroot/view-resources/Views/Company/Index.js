
$(".date-picker").datepicker("update", new Date());
var $month = (new Date().getMonth() + 1);
var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
$("#DateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
(function () {
    $(function () {

        var _$table = $('#CompanyTable');
        var _service = abp.services.app.companyService
        var _employeeService = abp.services.app.employeeService;
        var _commonService = abp.services.app.commonService;
        var _accountService = abp.services.app.accountService;

        var _$modal = $('#CompanyCreateModal');
        var _$modalEdit = $('#CompanyEditModal');
        var _$form = $('form[name=CompanyCreateForm]');
        var _$formEdit = $('form[name=CompanyEditForm]');


        function gettaxtype() {
            var taxtypes = $('#TaxAccountId');
            taxtypes.empty();
            _commonService.getTaxTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                }
                taxtypes.selectpicker('refresh');
            });
        }
        function gettaxtypeE() {
            var taxtypes = $('#TaxAccountIdE');
            taxtypes.empty();
            _commonService.getTaxTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                }
                taxtypes.selectpicker('refresh');
            });
        }
        function getCurrencytype() {
            var taxtypes = $('#CurrencyId');
            taxtypes.empty();
            _commonService.getTaxTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                }
                taxtypes.selectpicker('refresh');
            });
        }
        gettaxtype();
        gettaxtypeE();
        //getCurrencytype();

        //Deposit Account Autocomplete
        var getAccountsDeposit = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountDeposit() {
            var $accountidDeposit = $('#DepositAccountId').val();
            _accountService.getAccount({ id: $accountidDeposit }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountDeposit = function (event, ui) {
            event.preventDefault();
            $("#DepositAccountId").val(ui.item ? ui.item.value : "");
            $("#DepositAccount").val(ui.item ? ui.item.label : "");

            getAccountDeposit();
            return false;
        };
        var focusAccountDeposit = function (event, ui) {
            event.preventDefault();
            $("#DepositAccountId").val(ui.item.value);
            $("#DepositAccount").val(ui.item.label);
        };
        var changeAccountDeposit = function (event, ui) {
            event.preventDefault();
            $("#DepositAccountId").val(ui.item ? ui.item.value : "");
            $("#DepositAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#DepositAccount").autocomplete({
            source: getAccountsDeposit,
            select: selectAccountDeposit,
            focus: focusAccountDeposit,
            minLength: 2,
            delay: 100,
            change: changeAccountDeposit
        });
        //Deposit Account Autocomplete

        //Edit Deposit Account Autocomplete
        var getAccountsDepositE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountDepositE() {
            var $accountidDepositE = $('#DepositAccountIdE').val();
            _accountService.getAccount({ id: $accountidDepositE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountDepositE = function (event, ui) {
            event.preventDefault();
            $("#DepositAccountIdE").val(ui.item ? ui.item.value : "");
            $("#DepositAccountE").val(ui.item ? ui.item.label : "");

            getAccountDepositE();
            return false;
        };
        var focusAccountDepositE = function (event, ui) {
            event.preventDefault();
            $("#DepositAccountIdE").val(ui.item.value);
            $("#DepositAccountE").val(ui.item.label);
        };
        var changeAccountDepositE = function (event, ui) {
            event.preventDefault();
            $("#DepositAccountIdE").val(ui.item ? ui.item.value : "");
            $("#DepositAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#DepositAccountE").autocomplete({
            source: getAccountsDepositE,
            select: selectAccountDepositE,
            focus: focusAccountDepositE,
            minLength: 2,
            delay: 100,
            change: changeAccountDepositE
        });
        //Edit Deposit Account Autocomplete

        //Cash Account Autocomplete
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
            var $accountidCash = $('#CashAccountId').val();
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
            $("#CashAccountId").val(ui.item ? ui.item.value : "");
            $("#CashAccount").val(ui.item ? ui.item.label : "");

            getAccountCash();
            return false;
        };
        var focusAccountCash = function (event, ui) {
            event.preventDefault();
            $("#CashAccountId").val(ui.item.value);
            $("#CashAccount").val(ui.item.label);
        };
        var changeAccountCash = function (event, ui) {
            event.preventDefault();
            $("#CashAccountId").val(ui.item ? ui.item.value : "");
            $("#CashAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#CashAccount").autocomplete({
            source: getAccountsCash,
            select: selectAccountCash,
            focus: focusAccountCash,
            minLength: 2,
            delay: 100,
            change: changeAccountCash
        });
        //Cash Account Autocomplete

        //EDit Cash Account Autocomplete
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
            var $accountidCashE = $('#CashAccountIdE').val();
            _accountService.getAccount({ id: $accountidCashE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#CashAccountIdE").val(ui.item ? ui.item.value : "");
            $("#CashAccountE").val(ui.item ? ui.item.label : "");

            getAccountCashE();
            return false;
        };
        var focusAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#CashAccountIdE").val(ui.item.value);
            $("#CashAccountE").val(ui.item.label);
        };
        var changeAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#CashAccountIdE").val(ui.item ? ui.item.value : "");
            $("#CashAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#CashAccountE").autocomplete({
            source: getAccountsCashE,
            select: selectAccountCashE,
            focus: focusAccountCashE,
            minLength: 2,
            delay: 100,
            change: changeAccountCashE
        });
        //Edit Cash Account Autocomplete

        //Bank Account Autocomplete
        var getAccountsBank = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountBank() {
            var $accountidBank = $('#BankAccountId').val();
            _accountService.getAccount({ id: $accountidBank }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountBank = function (event, ui) {
            event.preventDefault();
            $("#BankAccountId").val(ui.item ? ui.item.value : "");
            $("#BankAccount").val(ui.item ? ui.item.label : "");

            getAccountBank();
            return false;
        };
        var focusAccountBank = function (event, ui) {
            event.preventDefault();
            $("#BankAccountId").val(ui.item.value);
            $("#BankAccount").val(ui.item.label);
        };
        var changeAccountBank = function (event, ui) {
            event.preventDefault();
            $("#BankAccountId").val(ui.item ? ui.item.value : "");
            $("#BankAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#BankAccount").autocomplete({
            source: getAccountsBank,
            select: selectAccountBank,
            focus: focusAccountBank,
            minLength: 2,
            delay: 100,
            change: changeAccountBank
        });
        //Bank Account Autocomplete

        //Edit Bank Account Autocomplete
        var getAccountsBankE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountBankE() {
            var $accountidBankE = $('#BankAccountIdE').val();
            _accountService.getAccount({ id: $accountidBankE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountBankE = function (event, ui) {
            event.preventDefault();
            $("#BankAccountIdE").val(ui.item ? ui.item.value : "");
            $("#BankAccountE").val(ui.item ? ui.item.label : "");

            getAccountBankE();
            return false;
        };
        var focusAccountBankE = function (event, ui) {
            event.preventDefault();
            $("#BankAccountIdE").val(ui.item.value);
            $("#BankAccountE").val(ui.item.label);
        };
        var changeAccountBankE = function (event, ui) {
            event.preventDefault();
            $("#BankAccountIdE").val(ui.item ? ui.item.value : "");
            $("#BankAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#BankAccountE").autocomplete({
            source: getAccountsBankE,
            select: selectAccountBankE,
            focus: focusAccountBankE,
            minLength: 2,
            delay: 100,
            change: changeAccountBankE
        });
        //Edit Bank Account Autocomplete

        //Payable Account Autocomplete
        var getAccountsPayable = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountPayable() {
            var $accountidPayable = $('#PayableAccountId').val();
            _accountService.getAccount({ id: $accountidPayable }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountPayable = function (event, ui) {
            event.preventDefault();
            $("#PayableAccountId").val(ui.item ? ui.item.value : "");
            $("#PayableAccount").val(ui.item ? ui.item.label : "");

            getAccountPayable();
            return false;
        };
        var focusAccountPayable = function (event, ui) {
            event.preventDefault();
            $("#PayableAccountId").val(ui.item.value);
            $("#PayableAccount").val(ui.item.label);
        };
        var changeAccountPayable = function (event, ui) {
            event.preventDefault();
            $("#PayableAccountId").val(ui.item ? ui.item.value : "");
            $("#PayableAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#PayableAccount").autocomplete({
            source: getAccountsPayable,
            select: selectAccountPayable,
            focus: focusAccountPayable,
            minLength: 2,
            delay: 100,
            change: changeAccountPayable
        });
        //Payable Account Autocomplete

        //Edit Payable Account Autocomplete
        var getAccountsPayableE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountPayableE() {
            var $accountidPayableE = $('#PayableAccountIdE').val();
            _accountService.getAccount({ id: $accountidPayableE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountPayableE = function (event, ui) {
            event.preventDefault();
            $("#PayableAccountIdE").val(ui.item ? ui.item.value : "");
            $("#PayableAccountE").val(ui.item ? ui.item.label : "");

            getAccountPayableE();
            return false;
        };
        var focusAccountPayableE = function (event, ui) {
            event.preventDefault();
            $("#PayableAccountIdE").val(ui.item.value);
            $("#PayableAccountE").val(ui.item.label);
        };
        var changeAccountPayableE = function (event, ui) {
            event.preventDefault();
            $("#PayableAccountIdE").val(ui.item ? ui.item.value : "");
            $("#PayableAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#PayableAccountE").autocomplete({
            source: getAccountsPayableE,
            select: selectAccountPayableE,
            focus: focusAccountPayableE,
            minLength: 2,
            delay: 100,
            change: changeAccountPayableE
        });
        //Edit Payable Account Autocomplete

        //Receivable Account Autocomplete
        var getAccountsReceivable = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountReceivable() {
            var $accountidReceivable = $('#ReceivableAccountId').val();
            _accountService.getAccount({ id: $accountidReceivable }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountReceivable = function (event, ui) {
            event.preventDefault();
            $("#ReceivableAccountId").val(ui.item ? ui.item.value : "");
            $("#ReceivableAccount").val(ui.item ? ui.item.label : "");

            getAccountReceivable();
            return false;
        };
        var focusAccountReceivable = function (event, ui) {
            event.preventDefault();
            $("#ReceivableAccountId").val(ui.item.value);
            $("#ReceivableAccount").val(ui.item.label);
        };
        var changeAccountReceivable = function (event, ui) {
            event.preventDefault();
            $("#ReceivableAccountId").val(ui.item ? ui.item.value : "");
            $("#ReceivableAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#ReceivableAccount").autocomplete({
            source: getAccountsReceivable,
            select: selectAccountReceivable,
            focus: focusAccountReceivable,
            minLength: 2,
            delay: 100,
            change: changeAccountReceivable
        });
        //Receivable Account Autocomplete

        //Edit Receivable Account Autocomplete
        var getAccountsReceivableE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountReceivableE() {
            var $accountidReceivableE = $('#ReceivableAccountIdE').val();
            _accountService.getAccount({ id: $accountidReceivableE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountReceivableE = function (event, ui) {
            event.preventDefault();
            $("#ReceivableAccountIdE").val(ui.item ? ui.item.value : "");
            $("#ReceivableAccountE").val(ui.item ? ui.item.label : "");

            getAccountReceivableE();
            return false;
        };
        var focusAccountReceivableE = function (event, ui) {
            event.preventDefault();
            $("#ReceivableAccountIdE").val(ui.item.value);
            $("#ReceivableAccountE").val(ui.item.label);
        };
        var changeAccountReceivableE = function (event, ui) {
            event.preventDefault();
            $("#ReceivableAccountIdE").val(ui.item ? ui.item.value : "");
            $("#ReceivableAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#ReceivableAccountE").autocomplete({
            source: getAccountsReceivableE,
            select: selectAccountReceivableE,
            focus: focusAccountReceivableE,
            minLength: 2,
            delay: 100,
            change: changeAccountReceivableE
        });
        //Edit Receivable Account Autocomplete

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getCompanies
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
                    data: "abbr"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "name"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "isDefault"
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-company" title="edit" href="#" class="edit-company" data-company-id="' + data.id + '" data-toggle="modal" data-target="#CompanyEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-company" title="delete" href="#" class="delete-company" data-company-id="' + data.id + '" data-company-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-company" title="edit" href="#" class="edit-company" data-company-id="' + data.id + '" data-toggle="modal" data-target="#CompanyEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-company" title="delete" href="#" class="delete-company" data-company-id="' + data.id + '" data-company-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Company.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Pages.Company.Delete")) {
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
        $('#CompanyTable').on('click', 'a.edit-company', function (e) {
            var companyId = $(this).attr("data-company-id");
            $('#Id').val(companyId);
            getCompany(companyId);
        });

        // Delete record
        _$table.on('click', 'a.delete-company', function (e) {
            var id = $(this).attr("data-company-id");
            var name = $(this).attr("data-company-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteCompanyConfirmation', 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deleteCompany({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });

        //Load Record
        function getCompany(id) {
            _service.getCompany({ id: id }).done(function (result) {
                $('#abbrE').val(result.abbr);
                $('#nameE').val(result.name);
                $('#descriptionE').val(result.description);
                $('#CompanyAddressE').val(result.companyAddress);
                $('#TaxAccountIdE').val(result.taxAccountId);
                $('#TaxAccountIdE').selectpicker('refresh');
                $('input[type=checkbox][name=IsMainE]').prop('checked', result.isDefault);

                $('#CurrencyIdE').val(result.currencyId);
                $('#CurrencyIdE').selectpicker('refresh');

                $('#DepositAccountIdE').val(result.depositAccountId);
                $('#CashAccountIdE').val(result.cashAccountId);
                $('#BankAccountIdE').val(result.bankAccountId);
                $('#PayableAccountIdE').val(result.payableAccountId);
                $('#ReceivableAccountIdE').val(result.receivableAccountId);
                getAccountLoad(result.depositAccountId, result.cashAccountId, result.bankAccountId, result.payableAccountId, result.receivableAccountId);
            });
        };
        _$form.find('button[type="submit"]').click(function (e) {
            e.preventDefault();
            if ($('[name="IsMain"]:checked').length > 0)
                $('[name="IsMain"]:hidden').val(true);

            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var create = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

            abp.message.confirm(
                'New Company will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modal);
                        _service.createCompany(create).done(function () {
                            abp.notify.success('Company created', 'Success');
                            _$modal.modal('hide');
                            getAll();
                        }).always(function () {
                            abp.ui.clearBusy(_$modal);
                        });
                    }
                }
            );

           
        });

        function update() {
            if (!_$formEdit.valid()) {
                return;
            }

            var disabled = _$formEdit.find(':input:disabled').removeAttr('disabled');
            var formdata = _$formEdit.serializeFormToObject();
            var isDefault = "";
            if (formdata.IsMainE === 'on') {
                isDefault = true;
            }
            else {
                isDefault = false;

            }

            //alert(isDefault);
            var viewData = {
                company: {
                    "id": formdata.Id,
                    "abbr": formdata.AbbrE,
                    "name": formdata.NameE,
                    "description": formdata.DescriptionE,
                    "companyAddress": formdata.CompanyAddressE,
                    "isDefault": isDefault,
                    //"isDefault": "false",
                    "currencyId": formdata.CurrencyIdE,
                    "cashAccountId": formdata.CashAccountIdE,
                    "bankAccountId": formdata.BankAccountIdE,
                    "payableAccountId": formdata.PayableAccountIdE,
                    "receivableAccountId": formdata.ReceivableAccountIdE,
                    "taxAccountId": formdata.TaxAccountIdE,
                    "depositAccountId": formdata.DepositAccountIdE,
                }
            };
            disabled.attr('disabled', 'disabled');

            abp.message.confirm(
                'New company will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _service.updateCompany(viewData).done(function () {
                            abp.notify.success('Company has been successfully updated', 'Success');
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

        function getAccountLoad(depositId, cashId, bankId, payableId, recId) {

            _accountService.getAccount({ id: depositId }).done(function (result) {
                $('#DepositAccountE').val(result.name);
            });

            _accountService.getAccount({ id: cashId }).done(function (result) {
                $('#CashAccountE').val(result.name);
            });

            _accountService.getAccount({ id: bankId }).done(function (result) {
                $('#BankAccountE').val(result.name);
            });

            _accountService.getAccount({ id: payableId }).done(function (result) {
                $('#PayableAccountE').val(result.name);
            });

            _accountService.getAccount({ id: recId }).done(function (result) {
                $('#ReceivableAccountE').val(result.name);
            });
        };



        //_$formEdit.find('button[type="submit"]').click(function (e) {
        //    e.preventDefault();
        //    if ($('[name="IsMain"]:checked').length > 0)
        //        $('[name="IsMain"]:hidden').val(true);

        //    if (!_$formEdit.valid()) {
        //        return;
        //    }

        //    var edit = _$formEdit.serializeFormToObject(); //serializeFormToObject is defined in main.js

        //    //var id = edit.id;
        //    alert(edit.abbrE);

        //    abp.ui.setBusy(_$modal);
        //    _service.updateCompany(edit).done(function () {
        //        _$modal.modal('hide');
        //        getAll();
        //    }).always(function () {
        //        abp.ui.clearBusy(_$modal);
        //    });
        //});



    });
})();
