
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

        var _$table = $('#OrderTypeTable');
        var _service = abp.services.app.companyService
        var _employeeService = abp.services.app.employeeService;
        var _commonService = abp.services.app.commonService;
        var _accountService = abp.services.app.accountService;

        var _$modal = $('#OrderTypeCreateModal');
        var _$modalEdit = $('#OrderTypeEditModal');
        var _$form = $('form[name=OrderTypeCreateForm]');
        var _$formEdit = $('form[name=OrderTypeEditForm]');


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
            var currency = $('#CurrencyId');
            var currencyE = $('#CurrencyIdE');
            currency.empty();
            currencyE.empty();
            _commonService.getCurrencies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    currency.append('<option value=' + result.items[i].id + ' data-sign=' + result.items[i].sign + '>' + result.items[i].name + '</option>');
                    currencyE.append('<option value=' + result.items[i].id + ' data-sign=' + result.items[i].sign + '>' + result.items[i].name + '</option>');
                }
                currency.selectpicker('refresh');
                currencyE.selectpicker('refresh');
                getAll();
            });
        }
        //gettaxtype();
        //gettaxtypeE();
        getCurrencytype();

        //Sales Account Autocomplete
        var getAccountsSales = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountSales() {
            var $accountidSales = $('#SalesAccountId').val();
            _accountService.getAccount({ id: $accountidSales }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountSales = function (event, ui) {
            event.preventDefault();
            $("#SalesAccountId").val(ui.item ? ui.item.value : "");
            $("#SalesAccount").val(ui.item ? ui.item.label : "");

            getAccountSales();
            return false;
        };
        var focusAccountSales = function (event, ui) {
            event.preventDefault();
            $("#SalesAccountId").val(ui.item.value);
            $("#SalesAccount").val(ui.item.label);
        };
        var changeAccountSales = function (event, ui) {
            event.preventDefault();
            $("#SalesAccountId").val(ui.item ? ui.item.value : "");
            $("#SalesAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#SalesAccount").autocomplete({
            source: getAccountsSales,
            select: selectAccountSales,
            focus: focusAccountSales,
            minLength: 2,
            delay: 100,
            change: changeAccountSales
        });
        //Sales Account Autocomplete

        //Edit Sales Account Autocomplete
        var getAccountsSalesE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountSalesE() {
            var $accountidSalesE = $('#SalesAccountIdE').val();
            _accountService.getAccount({ id: $accountidSalesE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountSalesE = function (event, ui) {
            event.preventDefault();
            $("#SalesAccountIdE").val(ui.item ? ui.item.value : "");
            $("#SalesAccountE").val(ui.item ? ui.item.label : "");

            getAccountSalesE();
            return false;
        };
        var focusAccountSalesE = function (event, ui) {
            event.preventDefault();
            $("#SalesAccountIdE").val(ui.item.value);
            $("#SalesAccountE").val(ui.item.label);
        };
        var changeAccountSalesE = function (event, ui) {
            event.preventDefault();
            $("#SalesAccountIdE").val(ui.item ? ui.item.value : "");
            $("#SalesAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#SalesAccountE").autocomplete({
            source: getAccountsSalesE,
            select: selectAccountSalesE,
            focus: focusAccountSalesE,
            minLength: 2,
            delay: 100,
            change: changeAccountSalesE
        });
        //Edit Sales Account Autocomplete

        //SalesReturn Account Autocomplete
        var getAccountsSalesReturn = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountSalesReturn() {
            var $accountidSalesReturn = $('#SalesReturnAccountId').val();
            _accountService.getAccount({ id: $accountidSalesReturn }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountSalesReturn = function (event, ui) {
            event.preventDefault();
            $("#SalesReturnAccountId").val(ui.item ? ui.item.value : "");
            $("#SalesReturnAccount").val(ui.item ? ui.item.label : "");

            getAccountSalesReturn();
            return false;
        };
        var focusAccountSalesReturn = function (event, ui) {
            event.preventDefault();
            $("#SalesReturnAccountId").val(ui.item.value);
            $("#SalesReturnAccount").val(ui.item.label);
        };
        var changeAccountSalesReturn = function (event, ui) {
            event.preventDefault();
            $("#SalesReturnAccountId").val(ui.item ? ui.item.value : "");
            $("#SalesReturnAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#SalesReturnAccount").autocomplete({
            source: getAccountsSalesReturn,
            select: selectAccountSalesReturn,
            focus: focusAccountSalesReturn,
            minLength: 2,
            delay: 100,
            change: changeAccountSalesReturn
        });
        //SalesReturn Account Autocomplete

        //EDit SalesReturn Account Autocomplete
        var getAccountsSalesReturnE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountSalesReturnE() {
            var $accountidSalesReturnE = $('#SalesReturnAccountIdE').val();
            _accountService.getAccount({ id: $accountidSalesReturnE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountSalesReturnE = function (event, ui) {
            event.preventDefault();
            $("#SalesReturnAccountIdE").val(ui.item ? ui.item.value : "");
            $("#SalesReturnAccountE").val(ui.item ? ui.item.label : "");

            getAccountSalesReturnE();
            return false;
        };
        var focusAccountSalesReturnE = function (event, ui) {
            event.preventDefault();
            $("#SalesReturnAccountIdE").val(ui.item.value);
            $("#SalesReturnAccountE").val(ui.item.label);
        };
        var changeAccountSalesReturnE = function (event, ui) {
            event.preventDefault();
            $("#SalesReturnAccountIdE").val(ui.item ? ui.item.value : "");
            $("#SalesReturnAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#SalesReturnAccountE").autocomplete({
            source: getAccountsSalesReturnE,
            select: selectAccountSalesReturnE,
            focus: focusAccountSalesReturnE,
            minLength: 2,
            delay: 100,
            change: changeAccountSalesReturnE
        });
        //Edit SalesReturn Account Autocomplete

        //SalesDiscount Account Autocomplete
        var getAccountsSalesDiscount = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountSalesDiscount() {
            var $accountidSalesDiscount = $('#SalesDiscountAccountId').val();
            _accountService.getAccount({ id: $accountidSalesDiscount }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountSalesDiscount = function (event, ui) {
            event.preventDefault();
            $("#SalesDiscountAccountId").val(ui.item ? ui.item.value : "");
            $("#SalesDiscountAccount").val(ui.item ? ui.item.label : "");

            getAccountSalesDiscount();
            return false;
        };
        var focusAccountSalesDiscount = function (event, ui) {
            event.preventDefault();
            $("#SalesDiscountAccountId").val(ui.item.value);
            $("#SalesDiscountAccount").val(ui.item.label);
        };
        var changeAccountSalesDiscount = function (event, ui) {
            event.preventDefault();
            $("#SalesDiscountAccountId").val(ui.item ? ui.item.value : "");
            $("#SalesDiscountAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#SalesDiscountAccount").autocomplete({
            source: getAccountsSalesDiscount,
            select: selectAccountSalesDiscount,
            focus: focusAccountSalesDiscount,
            minLength: 2,
            delay: 100,
            change: changeAccountSalesDiscount
        });
        //SalesDiscount Account Autocomplete

        //Edit SalesDiscount Account Autocomplete
        var getAccountsSalesDiscountE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountSalesDiscountE() {
            var $accountidSalesDiscountE = $('#SalesDiscountAccountIdE').val();
            _accountService.getAccount({ id: $accountidSalesDiscountE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountSalesDiscountE = function (event, ui) {
            event.preventDefault();
            $("#SalesDiscountAccountIdE").val(ui.item ? ui.item.value : "");
            $("#SalesDiscountAccountE").val(ui.item ? ui.item.label : "");

            getAccountSalesDiscountE();
            return false;
        };
        var focusAccountSalesDiscountE = function (event, ui) {
            event.preventDefault();
            $("#SalesDiscountAccountIdE").val(ui.item.value);
            $("#SalesDiscountAccountE").val(ui.item.label);
        };
        var changeAccountSalesDiscountE = function (event, ui) {
            event.preventDefault();
            $("#SalesDiscountAccountIdE").val(ui.item ? ui.item.value : "");
            $("#SalesDiscountAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#SalesDiscountAccountE").autocomplete({
            source: getAccountsSalesDiscountE,
            select: selectAccountSalesDiscountE,
            focus: focusAccountSalesDiscountE,
            minLength: 2,
            delay: 100,
            change: changeAccountSalesDiscountE
        });
        //Edit SalesDiscount Account Autocomplete

        //Tax Account Autocomplete
        var getAccountsTax = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountTax() {
            var $accountidTax = $('#TaxAccountId').val();
            _accountService.getAccount({ id: $accountidTax }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountTax = function (event, ui) {
            event.preventDefault();
            $("#TaxAccountId").val(ui.item ? ui.item.value : "");
            $("#TaxAccount").val(ui.item ? ui.item.label : "");

            getAccountTax();
            return false;
        };
        var focusAccountTax = function (event, ui) {
            event.preventDefault();
            $("#TaxAccountId").val(ui.item.value);
            $("#TaxAccount").val(ui.item.label);
        };
        var changeAccountTax = function (event, ui) {
            event.preventDefault();
            $("#TaxAccountId").val(ui.item ? ui.item.value : "");
            $("#TaxAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#TaxAccount").autocomplete({
            source: getAccountsTax,
            select: selectAccountTax,
            focus: focusAccountTax,
            minLength: 2,
            delay: 100,
            change: changeAccountTax
        });
        //Tax Account Autocomplete

        //Edit Tax Account Autocomplete
        var getAccountsTaxE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountTaxE() {
            var $accountidTaxE = $('#TaxAccountIdE').val();
            _accountService.getAccount({ id: $accountidTaxE }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountTaxE = function (event, ui) {
            event.preventDefault();
            $("#TaxAccountIdE").val(ui.item ? ui.item.value : "");
            $("#TaxAccountE").val(ui.item ? ui.item.label : "");

            getAccountTaxE();
            return false;
        };
        var focusAccountTaxE = function (event, ui) {
            event.preventDefault();
            $("#TaxAccountIdE").val(ui.item.value);
            $("#TaxAccountE").val(ui.item.label);
        };
        var changeAccountTaxE = function (event, ui) {
            event.preventDefault();
            $("#TaxAccountIdE").val(ui.item ? ui.item.value : "");
            $("#TaxAccountE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#TaxAccountE").autocomplete({
            source: getAccountsTaxE,
            select: selectAccountTaxE,
            focus: focusAccountTaxE,
            minLength: 2,
            delay: 100,
            change: changeAccountTaxE
        });
        //Edit Tax Account Autocomplete

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
                ajaxFunction: _commonService.getOrderTypes
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
                    data: "name"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "currency"
                },
                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-ordertype" title="edit" href="#" class="edit-ordertype" data-ordertype-id="' + data.id + '" data-toggle="modal" data-target="#OrderTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-ordertype" title="delete" href="#" class="delete-ordertype" data-ordertype-id="' + data.id + '" data-ordertype-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-ordertype" title="edit" href="#" class="edit-ordertype" data-ordertype-id="' + data.id + '" data-toggle="modal" data-target="#OrderTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        //var del = '<a id="delete-ordertype" title="delete" href="#" class="delete-ordertype" data-ordertype-id="' + data.id + '" data-ordertype-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.OrderType.Edit")) {
                            ret += edit;
                        }
                        //if (abp.auth.isGranted("Pages.OrderType.Delete")) {
                        //    ret += (ret.trim().length > 0 ? '|' + del : del);
                        //}
                        return ret;
                    }
                }
            ]
        });

        function getCurrency(id) {

            var cl = $('#CurrencyIdE > option').length;
            if (cl > 0) {
                var sel = $('#CurrencyIdE');
                sel.val(id);
                sel.selectpicker('refresh');
                return $("#CurrencyIdE option:selected").text();
            }
            else {
                return '';
            }
        }

        function getAll() {
            dataTable.ajax.reload();
        }
        //getAll();

        // Edit record
        $('#OrderTypeTable').on('click', 'a.edit-ordertype', function (e) {
            var ordertypeId = $(this).attr("data-ordertype-id");
            $('#Id').val(ordertypeId);
            getOrderType(ordertypeId);
        });

        // Delete record
        _$table.on('click', 'a.delete-ordertype', function (e) {
            var id = $(this).attr("data-ordertype-id");
            var name = $(this).attr("data-ordertype-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteOrderTypeConfirmation', 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _commonService.deleteOrderType({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });

        //Load Record
        function getOrderType(id) {
            _commonService.getOrderType({ id: id }).done(function (result) {
                $('#Id').val(result.id);
                $('#NameE').val(result.name);
                //$('#descriptionE').val(result.description);

                $('#CurrencyIdE').val(result.currencyId);
                $('#CurrencyIdE').selectpicker('refresh');

                $('#ReceivableAccountIdE').val(result.receivableAccountId);
                $('#SalesAccountIdE').val(result.salesAccountId);
                $('#SalesReturnAccountIdE').val(result.salesReturnAccountId);
                $('#SalesDiscountAccountIdE').val(result.salesDiscountAccountId);
                $('#TaxAccountIdE').val(result.taxAccountId);

                $('#ReceivableAccountEntryE').val(result.receivableAccountEntry);
                $('#ReceivableAccountEntryE').selectpicker('refresh');
                $('#SalesAccountEntryE').val(result.salesAccountEntry);
                $('#SalesAccountEntryE').selectpicker('refresh');
                $('#SalesReturnAccountEntryE').val(result.salesReturnAccountEntry);
                $('#SalesReturnAccountEntryE').selectpicker('refresh');
                $('#SalesDiscountAccountEntryE').val(result.salesDiscountAccountEntry);
                $('#SalesDiscountAccountEntryE').selectpicker('refresh');
                $('#TaxAccountEntryE').val(result.taxAccountEntry);
                $('#TaxAccountEntryE').selectpicker('refresh');
                getAccountLoad(result.salesAccountId, result.salesDiscountAccountId, result.salesReturnAccountId, result.taxAccountId, result.receivableAccountId);
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
            console.log(create);
            abp.message.confirm(
                'New OrderType will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modal);
                        _commonService.createOrderType(create).done(function () {
                            abp.notify.success('OrderType created', 'Success');
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
                    "id": formdata.Id,
                    "name": formdata.NameE,
                    "currencyId": formdata.CurrencyIdE,
                    "receivableAccountId": formdata.ReceivableAccountIdE,
                    "receivableAccountEntry": formdata.ReceivableAccountEntryE,
                    "salesAccountId": formdata.SalesAccountIdE,
                    "salesAccountEntry": formdata.SalesAccountEntryE,
                    "salesDiscountAccountId": formdata.SalesDiscountAccountIdE,
                    "salesDiscountAccountEntry": formdata.SalesDiscountAccountEntryE,
                    "salesReturnAccountId": formdata.SalesReturnAccountIdE,
                    "salesReturnAccountEntry": formdata.SalesReturnAccountEntryE,
                    "taxAccountId": formdata.TaxAccountIdE,
                    "taxAccountEntry": formdata.TaxAccountEntryE
            };
            disabled.attr('disabled', 'disabled');
            console.log(viewData);
            abp.message.confirm(
                'New ordertype will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _commonService.updateOrderType(viewData).done(function () {
                            abp.notify.success('OrderType has been successfully updated', 'Success');
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

        function getAccountLoad(salesId, discountId, returnId, taxId, recId) {

            _accountService.getAccount({ id: salesId }).done(function (result) {
                $('#SalesAccountE').val(result.name);
            });

            _accountService.getAccount({ id: discountId }).done(function (result) {
                $('#SalesDiscountAccountE').val(result.name);
            });

            _accountService.getAccount({ id: returnId }).done(function (result) {
                $('#SalesReturnAccountE').val(result.name);
            });

            _accountService.getAccount({ id: taxId }).done(function (result) {
                $('#TaxAccountE').val(result.name);
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
