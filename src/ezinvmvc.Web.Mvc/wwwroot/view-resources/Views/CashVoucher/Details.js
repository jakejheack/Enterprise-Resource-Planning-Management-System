function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

        //if (amount.indexOf(".", present) || amount.indexOf(".", present + 1));
        //{}
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

(function ($) {

    var _$table = $('#ItemsTable');
    var _service = abp.services.app.cashVoucherService;
    var _companyService = abp.services.app.companyService;
    var _employeeService = abp.services.app.employeeService;
    var _accountService = abp.services.app.accountService;

    var _$form = $('form[name=CashVoucherForm]');
    var _$glTable = $('#GLTable');
    var _$glTempTable = $('#GLTempTable');

    function getcompanies(id) {
        var companies = $('#Companies');
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (id === result.items[i].id) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    //getseriestype(result.items[i].id);
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
        }).always(function () {
            glDataTable.ajax.reload();
        });;
    }

    var glDataTable = _$glTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        "footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api();
            var p = api.column(2).data().reduce(function (a, b) {
                return a + b;
            }, 0)
            $(api.column(2).footer()).html(currencyFormat(p));
            var p2 = api.column(3).data().reduce(function (a, b) {
                return a + b;
            }, 0)
            $(api.column(3).footer()).html(currencyFormat(p2));
        },
        listAction: {
            ajaxFunction: _accountService.getGeneralLedgers,
            inputFilter: function () {
                var $companyid = 'null';
                var $datefrom = 'null';
                var $dateto = 'null';
                var $accountid = 'null';
                var $transcode = $('#SeriesTypeId').val();
                var $projectid = 'null';
                var $partycode = 'null';
                var $partyid = 'null';

                if ($companyid === '') {
                    $companyid = 'null';
                }
                if ($accountid === '') {
                    $accountid = 'null';
                }
                if ($transcode === '') {
                    $transcode = 'null';
                }
                if ($partyid === '') {
                    $partyid = 'null';
                    $partycode = 'null';
                }
                return {
                    filter: $companyid + '|' + $datefrom + '|' + $dateto + '|' + $accountid + '|' + $transcode + '|' + $projectid + '|' + $partycode + '|' + $partyid,
                    maxResultCount: 29
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
                targets: 0,
                visible: false
            },
            {
                targets: 1,
                data: { account: "account", debit: "debit" },
                "render": function (data) {
                    var debit = data.debit;
                    var acc = data.account;
                    var tab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    if (debit <= 0) {
                        acc = tab + acc;
                    }
                    return acc;
                }
            },
            {
                render: function (data) {
                    var ret = currencyFormat(data);
                    if (data <= 0) {
                        ret = '';
                    }
                    return ret;
                },
                className: 'text-right cv-number',
                data: "debit",
                targets: 2
            },
            {
                //render: $.fn.dataTable.render.number(',', '.', 2),
                render: function (data) {
                    var ret = currencyFormat(data);
                    if (data <= 0) {
                        ret = '';
                    }
                    return ret;
                },
                className: 'text-right cv-number',
                data: "credit",
                targets: 3
            },
            {
                "visible": false,
                targets: 4,
                data: "id"
            },
            {
                "visible": false,
                targets: 5,
                data: "accountId"
            }
        ]
    });

    var glTempDataTable = _$glTempTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [
            {
                "visible": false,
                targets: [0, 4, 5]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5]
            },
            {
                className: 'text-right cv-number',
                targets: [2, 3]
            }
        ]
    });

    var dataTable = _$table.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        {
            render: $.fn.dataTable.render.number(',', '.', 2),
            className: 'text-right',
            targets: [3, 4]
        },
        {
            orderable: false,
            targets: [0, 1, 2, 3, 4]
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

    function getCashVoucher() {
        var $id = $('#Id').val();
        //abp.ui.setBusy(_$form);
        _service.getCashVoucher({ id: $id }).done(function (result) {
            //$('#Id').val(result.id);
            //$('#Prefix').val(result.prefix);
            $('#PartyType').val(result.partyCode);
            $('#PartyType').selectpicker('refresh');
            $('#PartyCode').val(result.partyCode);
            $('#PartyId').val(result.partyId);
            $("#PartyName").val(result.name);
            var $sel = result.partyType;
            if ($sel.toUpperCase() === "Clients".toUpperCase()) {
                $("#PartyClient").show();
                $("#PartyEmployee").hide();
                $("#PartyVendor").hide();

                $("#PartyClient").attr("required");
                $("#PartyEmployee").removeAttr("required");
                $("#PartyVendor").removeAttr("required");
                $("#PartyClient").val(result.name);
            }
            else if ($sel.toUpperCase() === "Employees".toUpperCase()) {
                $("#PartyEmployee").show();
                $("#PartyClient").hide();
                $("#PartyVendor").hide();

                $("#PartyEmployee").attr("required");
                $("#PartyClient").removeAttr("required");
                $("#PartyVendor").removeAttr("required");
                $("#PartyEmployee").val(result.name);
            }
            else {
                $("#PartyVendor").show();
                $("#PartyClient").hide();
                $("#PartyEmployee").hide();

                $("#PartyVendor").attr("required");
                $("#PartyClient").removeAttr("required");
                $("#PartyEmployee").removeAttr("required");
                $("#PartyVendor").val(result.name);
            }
            $('#PartyId').val(result.partyId);
            //$('#PartyName').val(result.name);
            $('#SeriesTypeId').val(result.code);
            var rtransactiontime = new Date(result.transactionTime);
            var tt = getFormattedDate(rtransactiontime);
            $('#TransactionTime').val(tt);
            $('#ClientName').val(result.company);
            $('#Notes').val(result.notes);

            //MARC
            $('#PaidAmount').val(currencyFormat(result.paymentAmount));
            //Marc
            $('#CheckName').val(result.checkName);
            //Marc
            $('#CheckNumber').val(result.checkNumber);
            var cDate = new Date(result.checkDate);
            var cd = getFormattedDate(cDate);
            $('#CheckDate').val(cd);

            //$('#DebitTotal').val();
            //$('#CreditTotal').val();
            loadPage(result.statusId);

            var debittotal = result.totaldebit;
            var credittotal = result.totaldebit;
            $('#DebitTotal').val(currencyFormat(debittotal));
            $('#CreditTotal').val(currencyFormat(credittotal));

            $('#StatusBadge').text(result.status);
            $('#StatusId').val(result.statusId);

            //alert(result.statusid);

            switch (result.statusId) {
                case 1:
                    $('#StatusBadge').addClass('badge badge-secondary');
                    break;
                case 2:
                    $('#StatusBadge').addClass('badge badge-success');

                    break;
                case 3:
                    $('#StatusBadge').addClass('badge badge-danger');

                    break;
                case 4:
                    $('#StatusBadge').addClass('badge badge-primary');
                    break;
                default:
                    $('#StatusBadge').addClass('badge badge-secondary');
            }

            getCashVoucherItem($id);
            getcompanies(result.companyId);


        });


    };

    function loadPage(id) {

        if (id == '2') {
            //$('#SaveButton').removeAttr('hidden');
            $('#btnPrint').removeAttr('hidden');
        }

    }

    function getCashVoucherItem(id) {
        _$table.DataTable().rows().remove().draw(false);
        _service.getCashVoucherItemByParentId({ id: id }).done(function (result) {

            for (var i = 0; i < result.items.length; i++) {
                var $itemId = result.items[i].id;
                var $accountid = result.items[i].accountId;
                var $accountName = result.items[i].accountName;
                var $partyId = result.items[i].partyId;
                var $partyName = result.items[i].name;
                var debit = result.items[i].debit;
                var credit = result.items[i].credit;
                var partytype = result.items[i].partyType;
                var partycode = result.items[i].partyCode;

                var newdebit = 0;
                var newcredit = 0;

                if (debit !== "") {
                    newdebit = parseFloat(debit);
                }
                if (credit !== "") {
                    newcredit = parseFloat(credit);
                }

                var datacount = dataTable.rows().count();
                var itemno = datacount + 1;

                //dataTable.row.add([itemno,
                //    '<small><label class="text-muted">' + $accountName + '</label></small>',
                //    '<small><label class="text-muted">' + $partyName + '</label></small>',
                //    newdebit,
                //    newcredit
                //]).draw();

                dataTable.row.add([itemno,
                    '<small><label class="text-muted">' + $accountName + '</label></small>',
                    '<small><label class="text-muted">' + $partyName + '</label></small>',
                    newdebit,
                    newcredit,
                    '<a id="edit-item" class="edit-item" title="edit" href="#"  data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $accountid + '" data-accountname="' + $accountName + '" data-partyid="' + $partyId + '" data-partyname="' + $partyName + '" data-debit="' + newdebit + '" data-credit="' + newcredit + '" data-partytype="' + partytype + '"  data-partycode="' + partycode + '"  data-itemid="' + $itemId + '"  ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                    $accountid, $accountName, $partyId, $partyName, parseInt(newdebit), parseInt(newcredit), partytype, partycode, $itemId
                ]).draw();

            }
        });
    };
    getCashVoucher();



    $('#btnPrint').click(function (e) {
        e.preventDefault();

        $('#PrintModal').modal('show');
    });

    //SC Autocomplete
    var getscs = function (request, response) {
        _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    //label: el.completeName,
                    label: el.firstName + ' ' + el.lastName,
                    value: el.id
                };
            }));
        });
    };
    function getsc() {
        $id = $("#SalesCoordinatorId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#SalesCoordinatorEmail').val(result.email);
            $('#SalesCoordinatorContactNum').val(result.cellNo);
            $("#SalesCoordinator").val(result.firstName + ' ' + result.lastName);
        });
    };
    var selectsc = function (event, ui) {
        event.preventDefault();
        $("#SalesCoordinatorId").val(ui.item ? ui.item.value : "");
        $("#SalesCoordinator").val(ui.item ? ui.item.label : "");
        getsc();
        return false;
    };
    var focussc = function (event, ui) {
        event.preventDefault();
        $("#SalesCoordinatorId").val(ui.item.value);
        $("#SalesCoordinator").val(ui.item.label);
    };
    var changesc = function (event, ui) {
        event.preventDefault();
        $("#SalesCoordinatorId").val(ui.item ? ui.item.value : "");
        $("#SalesCoordinator").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#SalesCoordinatorEmail').val('');
            $('#SalesCoordinatorContactNum').val('');
        }
    };
    $("#SalesCoordinator").autocomplete({
        //source: getsc,
        source: getscs,
        select: selectsc,
        focus: focussc,
        minLength: 2,
        delay: 100,
        change: changesc
    });
    //SC Autocomplete

    //IDG Autocomplete
    var getidgs = function (request, response) {
        _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    //label: el.completeName,
                    label: el.firstName + ' ' + el.lastName,
                    value: el.id
                };
            }));
        });
    };
    function getidg() {
        $id = $("#IDGId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#IDGEmail').val(result.email);
            $('#IDGContactNum').val(result.cellNo);
            $("#IDG").val(result.firstName + ' ' + result.lastName);
        });
    };
    var selectidg = function (event, ui) {
        event.preventDefault();
        $("#IDGId").val(ui.item ? ui.item.value : "");
        $("#IDG").val(ui.item ? ui.item.label : "");
        getidg();
        return false;
    };
    var focusidg = function (event, ui) {
        event.preventDefault();
        $("#IDGId").val(ui.item.value);
        $("#IDG").val(ui.item.label);
    };
    var changeidg = function (event, ui) {
        event.preventDefault();
        $("#IDGId").val(ui.item ? ui.item.value : "");
        $("#IDG").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#IDGEmail').val('');
            $('#IDGContactNum').val('');
        }
    };
    $("#IDG").autocomplete({
        source: getidgs,
        select: selectidg,
        focus: focusidg,
        minLength: 2,
        delay: 100,
        change: changeidg
    });
    //IDG Autocomplete

    //SSM Autocomplete
    var getssms = function (request, response) {
        _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    //label: el.completeName,
                    label: el.firstName + ' ' + el.lastName,
                    value: el.id
                };
            }));
        });
    };
    function getssm() {
        $id = $("#SCManagerId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#SCManagerEmail').val(result.email);
            $('#SCManagerContactNum').val(result.cellNo);
            $("#SCManager").val(result.firstName + ' ' + result.lastName);
        });
    };
    var selectssm = function (event, ui) {
        event.preventDefault();
        $("#SCManagerId").val(ui.item ? ui.item.value : "");
        $("#SCManager").val(ui.item ? ui.item.label : "");
        getssm();
        return false;
    };
    var focusssm = function (event, ui) {
        event.preventDefault();
        $("#SCManagerId").val(ui.item.value);
        $("#SCManager").val(ui.item.label);
    };
    var changessm = function (event, ui) {
        event.preventDefault();
        $("#SCManagerId").val(ui.item ? ui.item.value : "");
        $("#SCManager").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#SCManagerEmail').val('');
            $('#SCManagerContactNum').val('');
        }
    };
    $("#SCManager").autocomplete({
        source: getssms,
        select: selectssm,
        focus: focusssm,
        minLength: 2,
        delay: 100,
        change: changessm
    });
    //SSM Autocomplete

    $('#PrintButton').click(function (e) {
        e.preventDefault();
        if (parseFloat($('#StatusId').val().replace(/,/g, '')) > 1) {
            printPreview2();
        }
        else {
            console.log("generatetemp");
            generatetempledger();
        }
    });

    function printPreview() {
        var quotationcode = $('#Code').val();
        var companyname = $("#Companies option:selected").html();
        var clientcontactperson = $("#ContactPerson").val();
        var clientcontactpersonpos = $("#ContactPersonPosition").val();
        //var clientcontactperson = $("#ContactPersons option:selected").html();
        var clientname = $('#PartyName').val();
        var clienttelephone = $('#ClientTelephone').val();
        var clientproject = $('#Project').val();
        var clientemail = $('#ClientEmail').val();
        var requestcode = $('#RequestCode').val();
        var notes = $('#Notes').val();

        var salesagent = $('#SalesAgent').val();
        var salesagentmobile = $('#SalesAgentMobile').val();
        var salesagentemail = $('#SalesAgentEmail').val();
        var salesagentpos = $('#SalesAgentPosition').val();

        var managerid = $('#ManagerId').val();
        var manager = $('#Manager').val();
        var managerpos = $('#ManagerPosition').val();
        var managermobile = $('#ManagerMobile').val();
        var manageremail = $('#ManagerEmail').val();

        var checknumber = $('#CheckNumber').val();
        var checkdate = $('#CheckDate').val();
        var notes = $('#Notes').val();

        var companyaddress = $('#CompanyAddress').text();
        var clientaddress = $('#ClientAddress').val();
        var transdate = $('#TransactionTime').val();
        var subtotal = $('#DebitTotal').val(); //$('#Total').val();
        var nettotal = $('#NetTotal').val();
        var tax = $('#Tax').val();
        var grandtotal = $('#TotalBalance').val();
        var divToPrint = document.getElementById("GLTable");
        var termname = $("#ContactPersons option:selected").html();
        var termsandconditions = $('#TermsAndConditions').val();
        var $OtherTerms = $("#OtherTerms").val();
        var $PackageCost = $("#PackageCost").val();

        var win = window.open('');
        //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
        //win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath +'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
        win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } @media print { .xfooter {width: 100%; position: absolute; height:3in; bottom: 0;  } } </style></head><body>');
        win.document.write('<div id="content" class="container_12 clearfix">');
        win.document.write('<div id="content-main" class="grid_12">');

        // Header
        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
        win.document.write('</div>');

        //win.document.write('<div class="row">');
        //win.document.write('<br />');
        //win.document.write('</div>');

        var bamt = parseFloat(subtotal.replace(/,/g, "")); //- tcredit;
        var b = Math.floor(bamt);
        var bdec = (bamt - b) * 100;
        b = Math.round(bdec) / 100 >= 1 ? b + Math.floor(Math.round(bdec) / 100) : b;
        bdec = Math.round(bdec) / 100 >= 1 ? ((Math.round(bdec) / 100) - Math.floor(bdec)) * 100 : bdec;

        //num.value = b.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00");

        var words = toWords(b) + "and " + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00") + "/100 PESOS ONLY";


        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="100%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:24px">CASH VOUCHER</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%" style = "font-size:16px;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="45%"></th>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tbody>');
        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td class="font-weight-bold">&nbsp;</td>');
        win.document.write('<td class="text-right">VOUCHER NO.:</td>');
        win.document.write('<td class="text-right font-weight-bold">' + quotationcode + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td class="font-weight-bold">&nbsp;</td>');
        win.document.write('<td class="text-right">DATE</td>');
        win.document.write('<td class="text-right font-weight-bold">' + transdate + '</td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');

        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');


        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%" style = "font-size:16px;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="45%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tbody>');
        win.document.write('<tr>');
        win.document.write('<td>TO</td>');
        win.document.write('<td colspan=3 class="font-weight-bold" style="font-size: 28px;">' + clientname + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row">CHECK NO.:</td>');
        win.document.write('<td class="text-mute font-weight-bold" style="font-size:15px;">' + checknumber + '</td>');
        win.document.write('<td class="text-right">AMOUNT</td>');
        win.document.write('<td class="text-right font-weight-bold">' + subtotal + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>DATE:</td>');
        win.document.write('<td class="font-weight-bold">' + checkdate + '</td>');
        win.document.write('<td colspan=3 class="text-right font-weight-bold">' + words + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>PARTICULARS:</td>');
        win.document.write('<td colspan=3 class="font-weight-bold">' + notes + '</td>');
        win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td>PROJECT</td>');
        //win.document.write('<td>' + clientproject + '</td>');
        //win.document.write('<td class="text-right" style="vertical-align:top;">TEL No</td>');
        //win.document.write('<td class="text-right" style="vertical-align:top;">' + clienttelephone + '</td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td>EMAIL ADDRESS</td>');
        //win.document.write('<td>' + clientemail + '</td>');
        //win.document.write('<td class="text-right"></td>');
        //win.document.write('<td class="text-right"></td>');
        //win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4><br /></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4><br /></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');

        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        // Header

        // Footer

        //TOTAL

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        // Body
        win.document.write(divToPrint.outerHTML);
        // Body
        win.document.write('</div>');
        win.document.write('</div>');

        //Notes

        //Signatory

        win.document.write('<div class="row xfooter">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');
        win.document.write('<tbody>');

        win.document.write('<tr>');
        win.document.write('<td colspan=3  style="border-top: 2px solid"></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td class="text-left">Prepared by:</td>');
        win.document.write('<td class="text-left">Checked by:</td>');
        win.document.write('<td class="text-left">Approved by:</td>');
        win.document.write('</tr>');

        var $sc = $("#SalesCoordinator").val();
        $sc = $sc.trim().length <= 0 ? '-' : $sc;
        var $idg = $("#IDG").val();
        $idg = $idg.trim().length <= 0 ? '-' : $idg;
        var $scmanager = $("#SCManager").val();
        $scmanager = $scmanager.trim().length <= 0 ? '-' : $scmanager;

        win.document.write('<tr>');
        win.document.write('<td class="text-center font-weight-bold">' + $sc + '</td>');
        win.document.write('<td class="text-center font-weight-bold">' + $idg + '</td>');
        win.document.write('<td class="text-center font-weight-bold">' + $scmanager + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr >');
        win.document.write('<td colspan=3 class="text-left" style="border-top: 2px solid">Received by:</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');

        win.document.write('<table class="" width="100%" style="margin:0 auto;border-collapse: separate;border-spacing:50px 0;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');
        win.document.write('<tbody>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td class="text-center" style="border-top: 2px solid;">Name in Print</td>');
        win.document.write('<td class="text-center" style="border-top: 2px solid;">Signature</td>');
        win.document.write('<td class="text-center" style="border-top: 2px solid;">Date</td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');

        win.document.write('</div>');
        win.document.write('</div>');

        // Note

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="10%"></th>');
        win.document.write('<th width="90%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');
        //
        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="75%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        // Footer

        win.document.write('</div>');
        win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath + 'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
        //win.print();
        //window.print();
    }

    function generatetempledger() {
        //AP
        var generalledger = [];
        var formdata = _$form.serializeFormToObject();
        var tableledgers = _$table.DataTable();
        var form_dataledger = tableledgers.rows().data();
        var x = form_dataledger;
        console.log(x.length);
        for (var y = 0; x.length > y; y++) {
            var debit = parseFloat(x[y][2]);
            var credit = parseFloat(x[y][3]);
            ledger = {};
            ledger["TransactionTypeId"] = "0";
            ledger["TransactionId"] = formdata.Id;
            ledger["TransactionCode"] = formdata.Code;
            ledger["TransactionTime"] = formdata.TransactionTime;
            ledger["AccountId"] = x[y][6];
            ledger["Debit"] = x[y][10];
            ledger["Credit"] = x[y][11];
            if (debit > 0) {
                ledger["BaseTypeId"] = "1";
            }
            else {
                ledger["BaseTypeId"] = "2";
            }

            ledger["Description"] = "";
            ledger["CenterTypeId"] = "1";
            ledger["PartyId"] = formdata.PartyId;
            ledger["ProjectId"] = "0";
            var partyid = formdata.PartyId;
            if (partyid > 0) {
                ledger["PartyName"] = formdata.PartyName;
                ledger["PartyCode"] = formdata.PartyType;
            }
            else {
                ledger["PartyName"] = "";
                ledger["PartyCode"] = "0";
            }
            ledger["CompanyId"] = formdata.CompanyId;
            generalledger.push(ledger);
        }
        //Payment

        //EWT
        //var ewttype = $('#EWTTypes').val();
        //var ewtamount = $('#EWT').val();
        //var eaccountid = $("#EWTTypes option:selected").data('accountid');
        //if (ewttype > 0 && ewtamount > 0)
        //    var debit = formdata.TotalBalance;
        //ledger = {};
        //ledger["TransactionTypeId"] = "0";
        //ledger["TransactionId"] = formdata.Id;
        //ledger["TransactionCode"] = formdata.RequestCode;
        //ledger["TransactionTime"] = formdata.TransactionTime;
        //ledger["AccountId"] = eaccountid;
        //ledger["Debit"] = '0';
        ////ledger["Credit"] = formdata.TotalBalance;
        //ledger["Credit"] = ewtamount;
        //if (formdata.TotalBalance > 0) {
        //    ledger["BaseTypeId"] = "2";
        //}
        //else {
        //    ledger["BaseTypeId"] = "1";
        //}

        //ledger["Description"] = "";
        //ledger["CenterTypeId"] = "1";
        //ledger["PartyId"] = formdata.ClientId;
        //ledger["ProjectId"] = "0";
        //var partyid = formdata.ClientId;
        //if (partyid > 0) {
        //    ledger["PartyName"] = formdata.ClientName;
        //    ledger["PartyCode"] = "200";
        //}
        //else {
        //    ledger["PartyName"] = "";
        //    ledger["PartyCode"] = "0";
        //}
        //ledger["CompanyId"] = formdata.CompanyId;
        //generalledger.push(ledger);

        console.log(generalledger);

        glTempDataTable.clear().draw();

        _accountService.getAccounts({ filter: 'null|null|null|null|null', forExport: true }).done(function (result) {
            var totaldebit = 0, totalcredit = 0;
            for (var h = 0; h < generalledger.length; h++) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].id == generalledger[h]["AccountId"]) {
                        var itemno = h + 1;
                        var accid = result.items[i].id;
                        var debit = parseFloat((generalledger[h]["Debit"] + '').replace(/,/g, ''));
                        var acc = result.items[i].name;
                        var credit = parseFloat((generalledger[h]["Credit"] + '').replace(/,/g, ''));
                        var newdebit = "", newcredit = "";
                        var tab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                        if (debit <= 0) {
                            acc = tab + acc;
                            newcredit = currencyFormat(credit);
                            newdebit = "";
                        }
                        else {
                            newdebit = currencyFormat(debit);
                            newcredit = "";
                        }
                        totaldebit += debit;
                        totalcredit += credit;

                        glTempDataTable.row.add([itemno,
                            acc,
                            newdebit,
                            newcredit,
                            0, accid
                        ]).draw();
                    }
                }
            }

            glTempDataTable.row.add([0,
                '',
                currencyFormat(totaldebit),
                currencyFormat(totalcredit),
                0, 0
            ]).draw();
        }).always(function () {
            printPreview2();
        });
        //generateledger


    }

    function printPreview2() {
        var quotationcode = $('#SeriesTypeId').val();
        var companyname = $("#Companies option:selected").html();
        var clientcontactperson = $("#ContactPerson").val();
        var clientcontactpersonpos = $("#ContactPersonPosition").val();
        //var clientcontactperson = $("#ContactPersons option:selected").html();
        var clientname = $('#ClientName').val();
        var clienttelephone = $('#ClientTelephone').val();
        var clientproject = $('#Project').val();
        var clientemail = $('#ClientEmail').val();
        var requestcode = $('#RequestCode').val();
        var notes = $('#Notes').val();

        var salesagent = $('#SalesAgent').val();
        var salesagentmobile = $('#SalesAgentMobile').val();
        var salesagentemail = $('#SalesAgentEmail').val();
        var salesagentpos = $('#SalesAgentPosition').val();

        var managerid = $('#ManagerId').val();
        var manager = $('#Manager').val();
        var managerpos = $('#ManagerPosition').val();
        var managermobile = $('#ManagerMobile').val();
        var manageremail = $('#ManagerEmail').val();

        var checknumber = $('#CheckNumber').val();
        var checkdate = $('#CheckDate').val();
        var notes = $('#Notes').val();

        var companyaddress = $('#CompanyAddress').text();
        var clientaddress = $('#ClientAddress').val();
        var transdate = $('#TransactionTime').val();
        var subtotal = $('#PaidAmount').val(); //$('#Total').val();
        var nettotal = $('#NetTotal').val();
        var tax = $('#Tax').val();
        var grandtotal = $('#TotalBalance').val();
        var divToPrint = document.getElementById("GLTable");
        var divToPrint2 = document.getElementById("GLTempTable");
        var termname = $("#ContactPersons option:selected").html();
        var termsandconditions = $('#TermsAndConditions').val();
        var $OtherTerms = $("#OtherTerms").val();
        var $PackageCost = $("#PackageCost").val();

        var win = window.open('');
        //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
        //win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath +'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
        win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; padding: 0; margin-top:1.5in } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; font-weight: normal !important; } .table thead { font-weight: normal !important; font-family: "fake_receiptregular" !important; font-size: 20px !important; } .cv-number { font-family: "Lucida Sans Unicode" !important; font-size: 24px !important; } .xfooter {width: 100%; position: absolute; height:3in; bottom: 0; } html, body, table { font-size: 22px; } </style></head><body style="font-family:fake_receiptregular">');
        win.document.write('<div id="content" class="container_12 clearfix">');
        win.document.write('<div id="content-main" class="grid_12">');

        // Header
        //win.document.write('<div class="row">');
        //win.document.write('<div class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
        //win.document.write('</div>');

        //win.document.write('<div class="row">');
        //win.document.write('<br />');
        //win.document.write('</div>');

        var bamt = parseFloat(subtotal.replace(/,/g, "")); //- tcredit;
        var b = Math.floor(bamt);
        var bdec = (bamt - b) * 100;
        b = Math.round(bdec) / 100 >= 1 ? b + Math.floor(Math.round(bdec) / 100) : b;
        bdec = Math.round(bdec) / 100 >= 1 ? ((Math.round(bdec) / 100) - Math.floor(bdec)) * 100 : bdec;

        //num.value = b.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00");

        var words = toWords(b) + "and " + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00") + "/100 PESOS ONLY";


        //win.document.write('<div class="row">');
        //win.document.write('<div class="col-lg-12">');
        //win.document.write('<table class="" width="100%">');

        //win.document.write('<thead>');
        //win.document.write('<tr>');
        //win.document.write('<th width="100%"></th>');
        //win.document.write('</tr>');
        //win.document.write('</thead>');

        //win.document.write('<tr>');
        //win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:24px">CHECK VOUCHER</td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        //win.document.write('</tr>');

        //win.document.write('</tbody>');
        //win.document.write('</table >');
        //win.document.write('</div>');
        //win.document.write('</div>');

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="45%"></th>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tbody>');
        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td class="text-right">&nbsp;</td>');//VOUCHER NO.:
        win.document.write('<td class="text-right cv-number" style="font-size:26px !important">' + quotationcode + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td class="text-right">&nbsp;</td>');//DATE
        win.document.write('<td class="text-right cv-number">' + transdate + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center"><br/></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');

        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');


        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="45%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tbody>');
        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');//TO
        win.document.write('<td colspan=3 style="font-size: 26px;">' + clientname + '</td>');
        win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        //win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row">&nbsp;</td>');//CHECK NO.:
        win.document.write('<td class="cv-number">' + checknumber + '</td>');
        win.document.write('<td class="text-right">&nbsp;</td>');//AMOUNT
        win.document.write('<td class="text-right cv-number">' + subtotal + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');//DATE:
        win.document.write('<td class="cv-number">' + checkdate + '</td>');
        win.document.write('<td colspan=3 class="text-right">' + words + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');//PARTICULARS:
        win.document.write('<td colspan=3>' + notes + '</td>');
        win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td>PROJECT</td>');
        //win.document.write('<td>' + clientproject + '</td>');
        //win.document.write('<td class="text-right" style="vertical-align:top;">TEL No</td>');
        //win.document.write('<td class="text-right" style="vertical-align:top;">' + clienttelephone + '</td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td>EMAIL ADDRESS</td>');
        //win.document.write('<td>' + clientemail + '</td>');
        //win.document.write('<td class="text-right"></td>');
        //win.document.write('<td class="text-right"></td>');
        //win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4><br /></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4><br /></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');

        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        // Header

        // Footer

        //TOTAL

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        // Body
        console.log(parseFloat($('#StatusId').val().replace(/,/g, '')));
        if (parseFloat($('#StatusId').val().replace(/,/g, '')) > 1) {
            win.document.write(divToPrint.outerHTML);
        }
        else {
            win.document.write(divToPrint2.outerHTML);
        }
        // Body
        win.document.write('</div>');
        win.document.write('</div>');

        //Notes

        //Signatory

        win.document.write('<div class="row xfooter">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');
        win.document.write('<tbody>');

        win.document.write('<tr>');
        win.document.write('<td colspan=3></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td class="text-left">&nbsp;</td>');//Prepared by:
        win.document.write('<td class="text-left">&nbsp;</td>');//Checked by:
        win.document.write('<td class="text-left">&nbsp;</td>');//Approved by:
        win.document.write('</tr>');

        var $sc = $("#SalesCoordinator").val();
        $sc = $sc.trim().length <= 0 ? '-' : $sc;
        var $idg = $("#IDG").val();
        $idg = $idg.trim().length <= 0 ? '-' : $idg;
        var $scmanager = $("#SCManager").val();
        $scmanager = $scmanager.trim().length <= 0 ? '-' : $scmanager;

        win.document.write('<tr>');
        win.document.write('<td class="text-center">' + $sc + '</td>');
        win.document.write('<td class="text-center">' + $idg + '</td>');
        win.document.write('<td class="text-center">' + $scmanager + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr >');
        win.document.write('<td colspan=3 class="text-left"></td>');//Received by:
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');

        win.document.write('<table class="" width="100%" style="margin:0 auto;border-collapse: separate;border-spacing:50px 0;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');
        win.document.write('<tbody>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td class="text-center">&nbsp;</td>');//Name in Print
        win.document.write('<td class="text-center">&nbsp;</td>');//Signature
        win.document.write('<td class="text-center">&nbsp;</td>');//Date
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');

        win.document.write('</div>');
        win.document.write('</div>');

        // Note

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="10%"></th>');
        win.document.write('<th width="90%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');
        //
        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="75%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        // Footer

        win.document.write('</div>');
        win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath + 'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
        //win.print();
        //window.print();
    }

    function printCheck() {
        var quotationcode = $('#RefNo').val();
        var companyname = $("#Companies option:selected").html();
        var clientcontactperson = $("#ContactPerson").val();
        var clientcontactpersonpos = $("#ContactPersonPosition").val();
        //var clientcontactperson = $("#ContactPersons option:selected").html();
        var clientname = $('#ClientName').val();
        var clienttelephone = $('#ClientTelephone').val();
        var clientproject = $('#Project').val();
        var clientemail = $('#ClientEmail').val();
        var requestcode = $('#RequestCode').val();
        var notes = $('#Notes').val();

        var salesagent = $('#SalesAgent').val();
        var salesagentmobile = $('#SalesAgentMobile').val();
        var salesagentemail = $('#SalesAgentEmail').val();
        var salesagentpos = $('#SalesAgentPosition').val();

        var managerid = $('#ManagerId').val();
        var manager = $('#Manager').val();
        var managerpos = $('#ManagerPosition').val();
        var managermobile = $('#ManagerMobile').val();
        var manageremail = $('#ManagerEmail').val();

        var checknumber = $('#CheckNumber').val();
        var checkdate = $('#CheckDate').val();
        var notes = $('#Notes').val();

        var companyaddress = $('#CompanyAddress').text();
        var clientaddress = $('#ClientAddress').val();
        var transdate = $('#TransactionTime').val();
        var subtotal = $('#PaidAmount').val(); //$('#Total').val();
        var nettotal = $('#NetTotal').val();
        var tax = $('#Tax').val();
        var grandtotal = $('#TotalBalance').val();
        var divToPrint = document.getElementById("GLTable");
        var termname = $("#ContactPersons option:selected").html();
        var termsandconditions = $('#TermsAndConditions').val();
        var $OtherTerms = $("#OtherTerms").val();
        var $PackageCost = $("#PackageCost").val();

        var win = window.open('');
        //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
        //win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath +'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
        win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } @media print { .xfooter {width: 100%; position: absolute; height:3in; bottom: 0;  } } </style></head><body>');
        win.document.write('<div id="content" class="container_12 clearfix">');
        win.document.write('<div id="content-main" class="grid_12">');

        // Header
        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
        win.document.write('</div>');

        //win.document.write('<div class="row">');
        //win.document.write('<br />');
        //win.document.write('</div>');

        var bamt = parseFloat(subtotal.replace(/,/g, "")); //- tcredit;
        var b = Math.floor(bamt);
        var bdec = (bamt - b) * 100;
        b = Math.round(bdec) / 100 >= 1 ? b + Math.floor(Math.round(bdec) / 100) : b;
        bdec = Math.round(bdec) / 100 >= 1 ? ((Math.round(bdec) / 100) - Math.floor(bdec)) * 100 : bdec;

        //num.value = b.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00");

        var words = toWords(b) + "and " + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00") + "/100 PESOS ONLY";


        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="100%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:24px">CHECK VOUCHER</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%" style = "font-size:16px;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="45%"></th>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tbody>');
        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td class="font-weight-bold">&nbsp;</td>');
        win.document.write('<td class="text-right">VOUCHER NO.:</td>');
        win.document.write('<td class="text-right font-weight-bold">' + quotationcode + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>&nbsp;</td>');
        win.document.write('<td class="font-weight-bold">&nbsp;</td>');
        win.document.write('<td class="text-right">DATE</td>');
        win.document.write('<td class="text-right font-weight-bold">' + transdate + '</td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');

        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');


        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%" style = "font-size:16px;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('<th width="15%"></th>');
        win.document.write('<th width="45%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('<tbody>');
        win.document.write('<tr>');
        win.document.write('<td>TO</td>');
        win.document.write('<td colspan=3 class="font-weight-bold" style="font-size: 28px;">' + clientname + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td scope="row">CHECK NO.:</td>');
        win.document.write('<td class="text-mute font-weight-bold" style="font-size:15px;">' + checknumber + '</td>');
        win.document.write('<td class="text-right">AMOUNT</td>');
        win.document.write('<td class="text-right font-weight-bold">' + subtotal + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>DATE:</td>');
        win.document.write('<td class="font-weight-bold">' + checkdate + '</td>');
        win.document.write('<td colspan=3 class="text-right font-weight-bold">' + words + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4 class="font-weight-bold" style="font-size: 32px;"><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>PARTICULARS:</td>');
        win.document.write('<td colspan=3 class="font-weight-bold">' + notes + '</td>');
        win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td>PROJECT</td>');
        //win.document.write('<td>' + clientproject + '</td>');
        //win.document.write('<td class="text-right" style="vertical-align:top;">TEL No</td>');
        //win.document.write('<td class="text-right" style="vertical-align:top;">' + clienttelephone + '</td>');
        //win.document.write('</tr>');

        //win.document.write('<tr>');
        //win.document.write('<td>EMAIL ADDRESS</td>');
        //win.document.write('<td>' + clientemail + '</td>');
        //win.document.write('<td class="text-right"></td>');
        //win.document.write('<td class="text-right"></td>');
        //win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4><br /></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td colspan=4><br /></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');

        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        // Header

        // Footer

        //TOTAL

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        // Body
        win.document.write(divToPrint.outerHTML);
        // Body
        win.document.write('</div>');
        win.document.write('</div>');

        //Notes

        //Signatory

        win.document.write('<div class="row xfooter">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');
        win.document.write('<tbody>');

        win.document.write('<tr>');
        win.document.write('<td colspan=3  style="border-top: 2px solid"></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td class="text-left">Prepared by:</td>');
        win.document.write('<td class="text-left">Checked by:</td>');
        win.document.write('<td class="text-left">Approved by:</td>');
        win.document.write('</tr>');

        var $sc = $("#SalesCoordinator").val();
        $sc = $sc.trim().length <= 0 ? '-' : $sc;
        var $idg = $("#IDG").val();
        $idg = $idg.trim().length <= 0 ? '-' : $idg;
        var $scmanager = $("#SCManager").val();
        $scmanager = $scmanager.trim().length <= 0 ? '-' : $scmanager;

        win.document.write('<tr>');
        win.document.write('<td class="text-center font-weight-bold">' + $sc + '</td>');
        win.document.write('<td class="text-center font-weight-bold">' + $idg + '</td>');
        win.document.write('<td class="text-center font-weight-bold">' + $scmanager + '</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr >');
        win.document.write('<td colspan=3 class="text-left" style="border-top: 2px solid">Received by:</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');

        win.document.write('<table class="" width="100%" style="margin:0 auto;border-collapse: separate;border-spacing:50px 0;">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('<th width="33%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');
        win.document.write('<tbody>');

        win.document.write('<tr>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('<td><br/></td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td class="text-center" style="border-top: 2px solid;">Name in Print</td>');
        win.document.write('<td class="text-center" style="border-top: 2px solid;">Signature</td>');
        win.document.write('<td class="text-center" style="border-top: 2px solid;">Date</td>');
        win.document.write('</tr>');

        win.document.write('</tbody>');
        win.document.write('</table >');

        win.document.write('</div>');
        win.document.write('</div>');

        // Note

        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="10%"></th>');
        win.document.write('<th width="90%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');
        //
        win.document.write('<div class="row">');
        win.document.write('<div class="col-lg-12">');
        win.document.write('<table class="" width="100%">');

        win.document.write('<thead>');
        win.document.write('<tr>');
        win.document.write('<th width="75%"></th>');
        win.document.write('<th width="25%"></th>');
        win.document.write('</tr>');
        win.document.write('</thead>');

        win.document.write('</tbody>');
        win.document.write('</table >');
        win.document.write('</div>');
        win.document.write('</div>');

        // Footer

        win.document.write('</div>');
        win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath + 'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
        //win.print();
        //window.print();
    }


})(jQuery);




