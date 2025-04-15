//abp.ui.block();

function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

        do {
            present = amount.indexOf(".", present);
            if (present !== -1) {
                count++;
                present++;
            }
        }
        while (present !== -1);
        if (present === -1 && amount.length === 0 && event.keyCode === 46) {
            event.keyCode = 0;
            return false;
        }

        if (count >= 1 && event.keyCode === 46) {

            event.keyCode = 0;
            return false;
        }
        if (count === 1) {
            var lastdigits = amount.substring(amount.indexOf(".") + 1, amount.length);
            if (lastdigits.length >= 2) {
                event.keyCode = 0;
                return false;
            }
        }
        return true;
    }
    else {
        event.keyCode = 0;
        return false;
    }
}

$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
//abp.ui.block();

(function ($) {
    var _pricingTypeService = abp.services.app.pricingTypeService;
    var _productPriceService = abp.services.app.productPriceService;
    var _productService = abp.services.app.productService;
    var _companyService = abp.services.app.companyService;
    var _commonService = abp.services.app.commonService;
    var _clientService = abp.services.app.clientService;
    var _accountService = abp.services.app.accountService;
    var _salesOrderService = abp.services.app.salesOrderService;
    var _rfqService = abp.services.app.rFQService;
    var _cpersonService = abp.services.app.contactPersonService;
    var _leadService = abp.services.app.leadService;
    var _cashVoucherservice = abp.services.app.cashVoucherService;
    var _employeeService = abp.services.app.employeeService;
    var _vendorService = abp.services.app.vendorService;

    var _$form = $('form[name=CashVoucherForm]');
    var _$itemsTable = $('#ItemsTable');
    function getcompanies() {
        var companies = $('#Companies');
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].isDefault === true) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    getseriestype(result.items[i].id);
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
        });
    }

    $('#PartyType').change(function (e) {
        $sel = $(this).children("option:selected").html(); //.val();
        if ($sel.toUpperCase() === "Clients".toUpperCase()) {
            $("#PartyClient").show();
            $("#PartyEmployee").hide();
            $("#PartyVendor").hide();

            $("#PartyClient").attr("required");
            $("#PartyEmployee").removeAttr("required");
            $("#PartyVendor").removeAttr("required");
        }
        else if ($sel.toUpperCase() === "Employees".toUpperCase()) {
            $("#PartyEmployee").show();
            $("#PartyClient").hide();
            $("#PartyVendor").hide();

            $("#PartyEmployee").attr("required");
            $("#PartyClient").removeAttr("required");
            $("#PartyVendor").removeAttr("required");
        }
        else {
            $("#PartyVendor").show();
            $("#PartyClient").hide();
            $("#PartyEmployee").hide();

            $("#PartyVendor").attr("required");
            $("#PartyClient").removeAttr("required");
            $("#PartyEmployee").removeAttr("required");
        }

    });

    $('#EType').change(function (e) {
        $sel = $(this).children("option:selected").val();
        if ($sel.toUpperCase() === "Clients".toUpperCase()) {
            $("#EPartyClient").show();
            $("#EPartyEmployee").hide();
            $("#EPartyVendor").hide();

            $("#EPartyClient").attr("required");
            $("#EPartyEmployee").removeAttr("required");
            $("#EPartyVendor").removeAttr("required");
        }
        else if ($sel.toUpperCase() === "Employees".toUpperCase()) {
            $("#EPartyEmployee").show();
            $("#EPartyClient").hide();
            $("#EPartyVendor").hide();

            $("#EPartyEmployee").attr("required");
            $("#EPartyClient").removeAttr("required");
            $("#EPartyVendor").removeAttr("required");
        }
        else {
            $("#EPartyVendor").show();
            $("#EPartyClient").hide();
            $("#EPartyEmployee").hide();

            $("#PartyVendor").attr("required");
            $("#PartyClient").removeAttr("required");
            $("#PartyEmployee").removeAttr("required");
        }

    });

    function pageload(type) {
        $sel = $('#PartyType').children("option:selected").html(); //.val();
        if ($sel.toUpperCase() === "Clients".toUpperCase()) {
            $("#PartyClient").show();
            $("#PartyEmployee").hide();
            $("#PartyVendor").hide();

            $("#PartyClient").attr("required");
            $("#PartyEmployee").removeAttr("required");
            $("#PartyVendor").removeAttr("required");
        }
        else if ($sel.toUpperCase() === "Employees".toUpperCase()) {
            $("#PartyEmployee").show();
            $("#PartyClient").hide();
            $("#PartyVendor").hide();

            $("#PartyEmployee").attr("required");
            $("#PartyClient").removeAttr("required");
            $("#PartyVendor").removeAttr("required");
        }
        else {
            $("#PartyVendor").show();
            $("#PartyClient").hide();
            $("#PartyEmployee").hide();

            $("#PartyVendor").attr("required");
            $("#PartyClient").removeAttr("required");
            $("#PartyEmployee").removeAttr("required");
        }


        //$sel1 = $('#EType').val();
        //if ($sel1.toUpperCase() === "Clients".toUpperCase()) {
        //    $("#EPartyClient").show();
        //    $("#EPartyEmployee").hide();
        //    $("#EPartyVendor").hide();

        //    $("#EPartyClient").attr("required");
        //    $("#EPartyEmployee").removeAttr("required");
        //    $("#EPartyVendor").removeAttr("required");
        //}
        //else if ($sel1.toUpperCase() === "Employees".toUpperCase()) {
        //    $("#EPartyEmployee").show();
        //    $("#EPartyClient").hide();
        //    $("#EPartyVendor").hide();

        //    $("#EPartyEmployee").attr("required");
        //    $("#EPartyClient").removeAttr("required");
        //    $("#EPartyVendor").removeAttr("required");
        //}
        //else {
        //    $("#EPartyVendor").show();
        //    $("#EPartyClient").hide();
        //    $("#EPartyEmployee").hide();

        //    $("#PartyVendor").attr("required");
        //    $("#PartyClient").removeAttr("required");
        //    $("#PartyEmployee").removeAttr("required");
        //}
    }
    pageload();

    getcompanies();
    $('#Companies').on('change', function (e) {
        getseriestype($('#Companies').val());
    });
    function getseriestype(companyid) {
        var series = $('#Series');
        series.empty();
        _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: '112', companyId: companyid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
            }
            series.selectpicker('refresh');
        });
    }

    //compnay Autocomplete
    var getclients = function (request, response) {
        _companyService.getCompanies({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getclient() {
        var $clientid = $('#ClientId').val();
        _companyService.getCompany({ id: $clientid }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectclient = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item ? ui.item.value : "");
        $("#ClientName").val(ui.item ? ui.item.label : "");
        getclient();
        return false;
    };
    var focusclient = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item.value);
        $("#ClientName").val(ui.item.label);
    };
    var changeclient = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item ? ui.item.value : "");
        $("#ClientName").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#ClientName").autocomplete({
        source: getclients,
        select: selectclient,
        focus: focusclient,
        minLength: 2,
        delay: 100,
        change: changeclient
    });
    //Client Autocomplete

    //Party Client Autocomplete
    var getclients1 = function (request, response) {
        _clientService.getClients({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getclient1() {
        var $partyId = $('#PartyId').val();
        _clientService.getClientDetails({ id: $partyId }).done(function (result) {
            $('#PartyCode').val(result[0].code);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectclient1 = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item ? ui.item.value : "");
        $("#PartyClient").val(ui.item ? ui.item.label : "");
        getclient1();
        return false;
    };
    var focusclient1 = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item.value);
        $("#PartyClient").val(ui.item.label);
    };
    var changeclient1 = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item ? ui.item.value : "");
        $("#PartyClient").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#PartyClient').val('');
            //$('#Phone').val('');
            //$('#Taxno').val('');
            //$('#Email').val('');
            //$('#Address').val('');
        }
    };
    $("#PartyClient").autocomplete({
        source: getclients1,
        select: selectclient1,
        focus: focusclient1,
        minLength: 2,
        delay: 100,
        change: changeclient1
    });
    //Party Autocomplete

    //Vendor Autocomplete
    var getvendors = function (request, response) {
        _vendorService.getVendors({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getvendor() {
        var $vendorid = $('#PartyId').val();
        _vendorService.getVendors({ id: $vendorid }).done(function (result) {
            $('#PartyCode').val("0");
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectvendor = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item ? ui.item.value : "");
        $("#PartyVendor").val(ui.item ? ui.item.label : "");
        getvendor();
        return false;
    };
    var focusvendor = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item.value);
        $("#PartyVendor").val(ui.item.label);
    };
    var changevendor = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item ? ui.item.value : "");
        $("#PartyVendor").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            //$('#Telno').val('');
            //$('#Phone').val('');
            //$('#Taxno').val('');
            //$('#Email').val('');
            //$('#Address').val('');
        }
    };
    $("#PartyVendor").autocomplete({
        source: getvendors,
        select: selectvendor,
        focus: focusvendor,
        minLength: 2,
        delay: 100,
        change: changevendor
    });

    //Party Employee Autocomplete
    var getemployees = function (request, response) {
        _employeeService.getAllSalescordinator({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.completeName,
                    value: el.id
                };
            }));
        });
    };
    function getemployee() {
        $id = $("#PartyId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            //$('#AssignedToEmail').val(result.email);
            $('#PartyCode').val(result.employeeCode);
        });
    };
    var selectemployee = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item ? ui.item.value : "");
        $("#PartyEmployee").val(ui.item ? ui.item.label : "");
        getemployee();
        return false;
    };
    var focusemployee = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item.value);
        $("#PartyEmployee").val(ui.item.label);
    };
    var changeemployee = function (event, ui) {
        event.preventDefault();
        $("#PartyId").val(ui.item ? ui.item.value : "");
        $("#PartyEmployee").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#PartyEmployee').val('');
        }
    };
    $("#PartyEmployee").autocomplete({
        source: getemployees,
        select: selectemployee,
        focus: focusemployee,
        minLength: 2,
        delay: 100,
        change: changeemployee
    });
    //Party Employee Autocomplete


    //Account Autocomplete
    var getAccounts = function (request, response) {
        _accountService.getAccountByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getAccount() {
        var $accountid = $('#AccountId').val();
        _accountService.getAccount({ id: $accountid }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectAccount = function (event, ui) {
        event.preventDefault();
        $("#AccountId").val(ui.item ? ui.item.value : "");
        $("#Account").val(ui.item ? ui.item.label : "");

        getAccount();
        return false;
    };
    var focusAccount = function (event, ui) {
        event.preventDefault();
        $("#AccountId").val(ui.item.value);
        $("#Account").val(ui.item.label);
    };
    var changeAccount = function (event, ui) {
        event.preventDefault();
        $("#AccountId").val(ui.item ? ui.item.value : "");
        $("#Account").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#Account").autocomplete({
        source: getAccounts,
        select: selectAccount,
        focus: focusAccount,
        minLength: 2,
        delay: 100,
        change: changeAccount
    });
    //Account Autocomplete

    //Edit Account Autocomplete
    var EgetAccounts = function (request, response) {
        _accountService.getAccountByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function EgetAccount() {
        var $accountid = $('#EAccountId').val();
        _accountService.getAccount({ id: $accountid }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var EselectAccount = function (event, ui) {
        event.preventDefault();
        $("#EAccountId").val(ui.item ? ui.item.value : "");
        $("#EAccount").val(ui.item ? ui.item.label : "");

        EgetAccount();
        return false;
    };
    var EfocusAccount = function (event, ui) {
        event.preventDefault();
        $("#EAccountId").val(ui.item.value);
        $("#EAccount").val(ui.item.label);
    };
    var EchangeAccount = function (event, ui) {
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
        source: EgetAccounts,
        select: EselectAccount,
        focus: EfocusAccount,
        minLength: 2,
        delay: 100,
        change: EchangeAccount
    });
    //Account Autocomplete

    //Edit Party Employee Autocomplete
    var getemployeesE = function (request, response) {
        _employeeService.getAllSalescordinator({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.completeName,
                    value: el.id
                };
            }));
        });
    };
    function getemployeeE() {
        $id = $("#EPartyId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#EPartyCode').val(result.employeeCode);
        });
    };
    var selectemployeeE = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item ? ui.item.value : "");
        $("#EPartyEmployee").val(ui.item ? ui.item.label : "");
        getemployeeE();
        return false;
    };
    var focusemployeeE = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item.value);
        //$("#EAssignedTo").val(ui.item.label);
    };
    var changeemployeeE = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item ? ui.item.value : "");
        $("#EPartyEmployee").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#AssignedToEmail').val('');
        //}
    };
    $("#EPartyEmployee").autocomplete({
        source: getemployeesE,
        select: selectemployeeE,
        focus: focusemployeeE,
        minLength: 2,
        delay: 100,
        change: changeemployeeE
    });
    //Party Employee Autocomplete

    //Edit Party client Autocomplete
    var getclients2 = function (request, response) {
        _clientService.getClients({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getclient2() {
        var $ePartyId = $('#EPartyId').val();
        _clientService.getClientDetails({ id: $ePartyId }).done(function (result) {
            $('#EPartyCode').val(result[0].code);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectclient2 = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item ? ui.item.value : "");
        $("#EPartyClient").val(ui.item ? ui.item.label : "");
        getclient2();
        return false;
    };
    var focusclient2 = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item.value);
        $("#EPartyClient").val(ui.item.label);
    };
    var changeclient2 = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item ? ui.item.value : "");
        $("#EPartyClient").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#EPartyClient").autocomplete({
        source: getclients2,
        select: selectclient2,
        focus: focusclient2,
        minLength: 2,
        delay: 100,
        change: changeclient2
    });
    //Edit Party Autocomplete


    //Edit PArty Vendor Autocomplete
    //Vendor Autocomplete
    var getvendors2 = function (request, response) {
        _vendorService.getVendors({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getvendor2() {
        var $vendorid2 = $('#EPartyId').val();
        _vendorService.getVendors({ id: $vendorid2 }).done(function (result) {
            $('#EPartyCode').val("0");
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectvendor2 = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item ? ui.item.value : "");
        $("#EPartyVendor").val(ui.item ? ui.item.label : "");
        getvendor2();
        return false;
    };
    var focusvendor2 = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item.value);
        $("#EPartyVendor").val(ui.item.label);
    };
    var changevendor2 = function (event, ui) {
        event.preventDefault();
        $("#EPartyId").val(ui.item ? ui.item.value : "");
        $("#EPartyVendor").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            //$('#Telno').val('');
            //$('#Phone').val('');
            //$('#Taxno').val('');
            //$('#Email').val('');
            //$('#Address').val('');
        }
    };
    $("#EPartyVendor").autocomplete({
        source: getvendors2,
        select: selectvendor2,
        focus: focusvendor2,
        minLength: 2,
        delay: 100,
        change: changevendor2
    });

    //Edit Party Vendor Autocomplete

    function getAll() {
        dataTable.ajax.reload();
    }

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [6, 7, 8, 9, 10, 11, 12, 13]
        },
        {
            render: $.fn.dataTable.render.number(',', '.', 2),
            className: 'text-right',
            targets: [3, 4]
        },
        {
            orderable: false,
            targets: [0, 1, 2, 5]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
        {
            //className: 'text-center',
            //targets: [2]
        }
        ]
    });

    function addnewitem() {
        var $accountid = $('#AccountId').val();
        var $accountName = $('#Account').val();
        var $partyId = 0; //$('#PartyId').val();
        var $partytype = ""; //$('#Type').val();
        var $partyName = "";
        var $partyCode = ""; // $('#PartyCode').val();

        //$sel = $('#Type').val();
        //if ($sel === "Clients") {
        //    var $partyClient = $('#PartyClient').val();
        //    $partyName = $partyClient;
        //}
        //else if ($sel === "Employees") {
        //    var $partyEmployee = $('#PartyEmployee').val();
        //    $partyName = $partyEmployee;
        //}
        //else {
        //    var $partyVendor = $('#PartyVendor').val();
        //    $partyName = $partyVendor;
        //}

        //alert($partyName);

        var $debit = $('#Debit').val();
        var $credit = $('#Credit').val();
        //if ($accountid === '' || $partyId === '') {
        //    return;
        //}

        if ($accountid === '') {
            abp.notify.error('Select Account.', 'Warning');
            return;
        }

        if ($partyId === '') {
            //abp.notify.error('Select Party.', 'Warning');
            //return;
            //$("#PartyId").val("0");
            //$("#PartyCode").val("0");
            $partyId = 0;
            $partyCode = 0;
        }

        var disc1 = 0;
        var disc2 = 0;
        if ($debit !== "") {
            disc1 = parseFloat($debit.replace(/,/g, ''));
        }
        if ($credit !== "") {
            disc2 = parseFloat($credit.replace(/,/g, ''));
        }

        //var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
        //var totaldiscount = discount * quantity;
        //var lessprice = price - discount;
        //var total = disc1 * quantity;

        var datacount = dataTable.rows().count();
        var itemno = datacount + 1;
        var $rowid = "id_row_" + itemno;
        var $row2 = "2_row_" + itemno;
        var $row3 = "3_row_" + itemno;
        var $row4 = "4_row_" + itemno;
        var $row5 = "5_row_" + itemno;
        var $row6 = "6_row_" + itemno;
        dataTable.row.add([itemno,
            '<small><label name="' + $row2 + '" class="text-muted">' + $accountName + '</label></small>',
            '<small><label name="' + $row3 + '" class="text-muted">' + $partyName + '</label></small>',
            disc1,
            disc2,
            '<a id="edit-item" class="edit-item" title="edit" href="#"  data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $accountid + '" data-accountname="' + $accountName + '" data-partyid="' + $partyId + '" data-partyname="' + $partyName + '" data-debit="' + disc1 + '" data-credit="' + disc2 + '" data-partytype="' + $partytype + '"  data-partycode="' + $partyCode + '"  ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            $accountid, $accountName, $partyId, $partyName, parseInt(disc1), parseInt(disc2), $partytype, $partyCode
        ]).draw();



        $('#AccountId').val("");
        $('#Account').val("");
        //$('#PartyId').val("");
        //$('#PartyClient').val("");
        //$('#PartyEmployee').val("");
        //$('#PartyVendor').val("");
        //$('#Type').val("");
        computeTotal();

        $('#Debit').val("");
        $('#Credit').val("");
        abp.notify.success('New Item Added.(' + $accountName + ')', 'Success');

    };

    $('#AddItemButton').click(function (e) {
        e.preventDefault();
        addnewitem();
    });

    _$itemsTable.on('click', 'a.edit-item', function (e) {
        e.preventDefault();
        var $itemno = $(this).attr("data-itemno");
        var $accountid = $(this).attr("data-id");
        var $accountname = $(this).attr("data-accountname");
        var $partyId = $(this).attr("data-partyid");
        var $partyname = $(this).attr("data-partyname");
        var $partytype = $(this).attr("data-partytype");
        var $debit = $(this).attr("data-debit");
        var $credit = $(this).attr("data-credit");
        var $partyCode = $(this).attr("data-partycode");
        //alert($itemno);
        //var discountvalue = parseFloat($disctotal) / parseFloat($qty);
        //var origprice = discountvalue + parseFloat($price);
        $('#EIndexNo').text($itemno);
        $('#EAccountId').val($accountid);
        $('#EAccount').val($accountname);
        $('#EPartyId').val($partyId);
        $('#EPartyCode').val($partyCode);
        $('#EParty').val($partyname);
        if ($partytype === "Clients") {
            $('#EType').val($partytype);
            //$("#EType").children("option:selected").val($partytype);
            $('#EPartyClient').val($partyname);
            //pageload();
            $('#EType').selectpicker('refresh');

        }
        else if ($partytype === "Employees") {
            $('#EType').val($partytype);
            $('#EPartyEmployee').val($partyname);
            $('#EType').selectpicker('refresh');
            //pageload();
        }
        else {
            $('#EType').val($partytype);
            $('#EPartyVendor').val($partyname);
            $('#EType').selectpicker('refresh');
            //pageload();
        }

        pageload();
        //var EType1 = $('#EType');
        //EType1.append('<option>Clients1</option>');
        //EType1.append('<option>Employees1</option>');
        //EType1.append('<option>Vendors1</option>');
        //EType1.selectpicker('refresh');


        $('#EDebit').val($debit);
        $('#ECredit').val($credit);
        //if ($disc1 !== '' || $disc2 !== '' || $disc3 !== '') {
        //    $('#accordioneditdiscount .collapse').collapse('show');
        //}
        //$('#EDiscount1').val($disc1);
        //$('#EDiscount2').val($disc2);
        //$('#EDiscount3').val($disc3);

        //$('#EDiscountType1').val($dtype1);
        //$('#EDiscountType2').val($dtype2);
        //$('#EDiscountType3').val($dtype3);

        //editclickedgetproduct();
        //editgetproductunits($unitid);
        //$('#EProductCode').val($reference);
        //$('#EGroupName').val($groupname);
        //$('#EPrice').val(currencyFormat(origprice));



    });

    $('#UpdatetemButton').click(function (e) {
        e.preventDefault();
        var $indexno = parseInt($('#EIndexNo').text()) - 1;
        var $accountid = $('#EAccountId').val();
        var $accountname = $('#EAccount').val();
        var $partyId = 0; //$('#EPartyId').val();
        var $partyCode = ""; //$('#EPartyCode').val();
        //var $partyname = $('#EParty').val();
        var $partyname = "";

        //$sel = $('#EType').val();
        //if ($sel === "Clients") {
        //    var $partyClient = $('#EPartyClient').val();
        //    $partyname = $partyClient;
        //}
        //else if ($sel === "Employees") {
        //    var $partyEmployee = $('#EPartyEmployee').val();
        //    $partyname = $partyEmployee;
        //}
        //else {
        //    var $partyVendor = $('#EPartyVendor').val();
        //    $partyname = $partyVendor;
        //}

        //alert($partyname);

        var $debit = $('#EDebit').val();
        var $credit = $('#ECredit').val();
        var $parttype = ''; // $('#EType').val();
        //var $disc1 = $('#EDiscount1').val();
        //var $disc2 = $('#EDiscount2').val();
        //var $disc3 = $('#EDiscount3').val();
        //var $dtype1 = $('#EDiscountType1').val();
        //var $dtype2 = $('#EDiscountType2').val();
        //var $dtype3 = $('#EDiscountType3').val();

        //if ($accountid === '' || $partyId === '') { return; }
        if ($accountid === '') {
            abp.notify.error('Select Account.', 'Warning');
            return;
        }

        if ($partyId === '') {
            //$('#EPartyClient').val('')
            //$('#EPartyEmployee').val('')
            //$('#EPartyVendor').val('')
            //abp.notify.error('Select Party.', 'Warning');

            $partyId = 0;
            $partyCode = 0;
            //return;
        }

        //if ($partyCode === '') {
        //    $('#EPartyClient').val('')
        //    $('#EPartyEmployee').val('')
        //    $('#EPartyVendor').val('')
        //    abp.notify.error('Select Party.', 'Warning');
        //    return;
        //}

        //var price = parseFloat($price.replace(/,/g, ''));
        //var quantity = parseFloat($quantity);

        var disc1 = 0;
        var disc2 = 0;
        if ($debit !== "") {
            disc1 = parseFloat($debit.replace(/,/g, ''));
        }
        if ($credit !== "") {
            disc2 = parseFloat($credit.replace(/,/g, ''));
        }

        //var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
        //var totaldiscount = discount * quantity;
        //var lessprice = price - discount;
        //var total = lessprice * quantity;

        var table = _$itemsTable.DataTable();
        var temp = table.row($indexno).data();
        temp[1] = '<small><span class="text-muted">' + $accountname + '</span></small>';
        temp[2] = '<small><span class="text-muted">' + $partyname + '</span></small>';
        temp[3] = disc1;
        temp[4] = disc2;
        temp[5] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $accountid + '" data-accountname="' + $accountname + '" data-partyid="' + $partyId + '" data-partyname="' + $partyname + '" data-debit="' + disc1 + '" data-credit="' + disc2 + '" data-partytype="' + $parttype + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        temp[6] = $accountid;
        temp[7] = $accountname;
        temp[8] = $partyId;
        temp[9] = $partyname;
        temp[10] = parseInt(disc1);
        temp[11] = parseInt(disc2);
        temp[12] = $parttype;
        temp[13] = $partyCode;
        $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
        $('#ItemEditModal').modal('hide');
        computeTotal();
    });
    function rearrange() {
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {
            var temp = table.row(i).data();
            var itemno = i + 1;


            var $accountid = f[i][6];
            var $accountName = f[i][7];
            var $partyId = f[i][8];
            var $partyName = f[i][9];
            var $debit = f[i][10];
            var $credit = f[i][11];
            var $partytype = f[i][12];
            var $partyCode = f[i][13];

            temp[0] = itemno;
            temp[5] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $accountid + '" data-accountname="' + $accountName + '" data-partyid="' + $partyId + '" data-partyname="' + $partyName + '" data-debit="' + $debit + '" data-credit="' + $credit + '" data-partytype="' + $partytype + '" data-partycode="' + $partyCode + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
        }
    }

    _$itemsTable.on('click', 'a.delete-item', function (e) {
        e.preventDefault();
        $this = $(this);
        var dtRow = $this.parents('tr');
        var table = _$itemsTable.DataTable();
        table.row(dtRow[0].rowIndex - 1).remove().draw(false);
        computeTotal();
        rearrange();
    });

    function computeTotal() {
        var debittotal = 0;
        var credittotal = 0;
        var grandtotal = 0;
        //var discounttotal = 0;
        //var chargestotal = 0;
        //var taxrate = 0;
        //var tax = 0;
        //var taxcode = 101;
        //var nettotal = 0;
        dataTable.column(10).data()
            .each(function (value, index) {
                var $debittotal = parseFloat(value);
                debittotal = debittotal + $debittotal;
            });
        dataTable.column(11).data()
            .each(function (value, index) {
                var $credittotal = parseFloat(value);
                credittotal = credittotal + $credittotal;
            });

        //dataTableCharges.column(4).data()
        //    .each(function (value, index) {
        //        var $chargestotal = parseFloat(value);
        //        chargestotal = chargestotal + $chargestotal;
        //    });

        //var $taxtypeid = $('#TaxTypes').val();

        //taxcode = $("#TaxTypes option:selected").data('code');
        //taxrate = $("#TaxTypes option:selected").data('rate');

        //if (taxcode === 101) {
        //    nettotal = grandtotal / taxrate;
        //    tax = nettotal * (taxrate - 1);
        //}
        //else if (taxcode === 104) {
        //    nettotal = grandtotal;
        //    tax = nettotal * (taxrate - 1);
        //    grandtotal = nettotal * taxrate;
        //}
        //else {
        //    nettotal = grandtotal;
        //    tax = 0;
        //}



        //var newgrandtotal = grandtotal + chargestotal;

        var newdebittotal = debittotal;
        var newcredittotal = credittotal;

        //$('#DiscountTotal').val(currencyFormat(discounttotal));
        //$('#NetTotal').val(currencyFormat(nettotal));
        //$('#Tax').val(currencyFormat(tax));
        //$('#Total').val(currencyFormat(grandtotal));
        //$('#ChargesTotal').val(currencyFormat(chargestotal));
        //$('#GrandTotal').val(currencyFormat(newgrandtotal));
        $('#DebitTotal').val(currencyFormat(newdebittotal));
        $('#CreditTotal').val(currencyFormat(newcredittotal));
        //$('#DebitTotal').val(newdebittotal);
        //$('#CreditTotal').val(newcredittotal);
    }

    //function validate() {

    //    var $debittotal = $('#DebitTotal').val();
    //    var $credittotal = $('#CreditTotal').val();

    //    var disc1 = 0;
    //    var disc2 = 0;
    //    if ($debittotal !== "") {
    //        disc1 = parseFloat($debittotal.replace(/,/g, ''));
    //    }
    //    if ($credittotal !== "") {
    //        disc2 = parseFloat($credittotal.replace(/,/g, ''));
    //    }

    //    if ($debittotal !== $credittotal) {
    //        return;
    //    }
    //}

    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();

        if (formdata.DebitTotal !== formdata.CreditTotal) {
            abp.notify.warn('Entries not balance.', 'Warning');
            return;
        }

        //$("#PartyClient").removeAttr("required");
        //remove.removeAttr('required', 'required');


        var viewData = {
            cashVoucher: {
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": $("#Series option:selected").html(),
                "code": "0",
                "transactionTime": formdata.TransactionTime,
                "partyId": formdata.PartyId,
                "partyType": $('#PartyType').children("option:selected").html(),
                "partyCode": formdata.PartyType,
                "projectId": "1",
                "statusid": "1",
                "notes": formdata.Notes,
                //Marc
                "paymentAmount": formdata.PaidAmount,
                //Marc
                "checkName": formdata.CheckName,
                //Marc
                "checkNumber": formdata.CheckNumber,
                "checkDate": formdata.CheckDate
            },
            cashVoucherItems: []
        };
        disabled.attr('disabled', 'disabled');

        //sales order items
        var tableitem = _$itemsTable.DataTable();
        var form_data = tableitem.rows().data();
        var f = form_data;

        //jsonObj = [];
        for (var i = 0; f.length > i; i++) {

            item = {};
            item["CashVoucherId"] = formdata.SeriesTypeId;
            item["AccountId"] = f[i][6];
            item["Debit"] = f[i][10];
            item["Credit"] = f[i][11];
            item["BaseTypeId"] = "1";
            item["Description"] = "0";
            item["CenterTypeId"] = "1";
            item["PartyId"] = formdata.PartyId;
            item["PartyCode"] = formdata.PartyType;
            item["PartyType"] = $('#PartyType').children("option:selected").html();


            viewData.cashVoucherItems.push(item);
            //jsonObj.push(item);
        }

        //var salesorderinput = JSON.stringify(viewData);
        var rfqinput = JSON.stringify(viewData);
        abp.message.confirm(
            'New Cash Voucher will be created.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_salesOrderService.createSalesOrder(viewData).done(function () {
                    _cashVoucherservice.createCashVoucher(viewData).done(function () {
                        abp.notify.success('Cash Voucher created', 'Success');

                        var url = 'Index';
                        setTimeout(function () {
                            window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                        }, 2000);
                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });
                }
            }
        );
    }

    $('#SaveButton').click(function (e) {
        e.preventDefault();
        save();
    });

})(jQuery);

