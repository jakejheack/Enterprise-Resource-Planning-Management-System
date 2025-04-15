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
    var _journalEntryservice = abp.services.app.journalEntryService
    var _employeeService = abp.services.app.employeeService;
    var _quotationService = abp.services.app.quotationService;
    var _rfpService = abp.services.app.rFPService;
    var _cvService = abp.services.app.cVService;


    var _$form = $('form[name=CVForm]');
    var _$itemsTable = $('#ItemsTable');
    var _$paidTable = $('#PaidTable');

    function getcompanies() {
        var companies = $('#Companies');
        abp.ui.block($('#Companies'));
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].isDefault === true) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    getseriestype(result.items[i].id);
                    $('#AccountsId').val(result.items[i].payableAccountId);
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
        });
        abp.ui.unblock('#Companies');
    }
    getcompanies();
    $('#Companies').on('change', function (e) {
        getseriestype($('#Companies').val());
    });

    function getseriestype(companyid) {
        var series = $('#Series');
        series.empty();
        _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: 111, companyId: companyid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
            }
            series.selectpicker('refresh');
        });

    }

    function getpaymentload() {
        var paymentterms = $('#Paymentmode');
        paymentterms.empty();
        _commonService.getPaymentModes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (i === 0) {
                    paymentterms.append('<option value=' + result.items[i].id + ' data-accountid =' + result.items[i].defaultAccountId + ' selected>' + result.items[i].name + '</option>');
                    $('#PaymentAccountId').val(result.items[i].defaultAccountId);
                    console.log(result.items[i].defaultAccountId);
                }
                else {
                    paymentterms.append('<option value=' + result.items[i].id + ' data-accountid =' + result.items[i].defaultAccountId + '>' + result.items[i].name + '</option>');
                }

            }
            paymentterms.selectpicker('refresh');
        });

        getPatmentLoadnext();
    }

    function getPatmentLoadnext() {
        $('#AccountId').val("1");
        $('#Account').val("Petty Cash Fund");
    }
    getpaymentload();



    $('#PaidAmount').on('change', function (e) {

        computeTotal('etext');



    });

    $('#EWT').on('change', function (e) {

        computeTotal('etext');



    });


    $('#Paymentmode').change(function (e) {
        //$sel = $(this).children("option:selected").val();
        //if ($sel.toUpperCase() === "1".toUpperCase()) {
        //    $('#AccountId').val("1");
        //    $('#Account').val("Petty Cash Fund");

        //}
        //else if ($sel.toUpperCase() === "2".toUpperCase()) {
        //    $('#AccountId').val("2");
        //    $('#Account').val("CIB - Bank 1");
        //}
        //else if ($sel.toUpperCase() === "3".toUpperCase()) {
        //    $('#AccountId').val("3");
        //    $('#Account').val("CIB - Bank 1");
        //}
        //else if ($sel.toUpperCase() === "4".toUpperCase()) {
        //    $('#AccountId').val("4");
        //    $('#Account').val("Creditable Withholding Tax");
        //}
        //else {
        //    $('#AccountId').val("4");
        //    $('#Account').val("Creditable Withholding Tax");
        //}
        var paccountid = $("#Paymentmode option:selected").data('accountid');
        $('#PaymentAccountId').val(paccountid);
    });

    getewt();

    function getewt() {
        var taxtypes = $('#EWTTypes');
        taxtypes.empty();
        taxtypes.append('<option value="0">None</option>');
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].type == 2) {
                    //if (id === result.items[i].id) {
                    //    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                    //}
                    //else {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-accountid =' + result.items[i].liabilityAccountId + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    //}
                }
            }
            taxtypes.selectpicker('refresh');
        });
    }

    $('#EWTTypes').change(function (e) {
        e.preventDefault();
        computeTotal('esel');
    });

    function gettaxtype(id) {
        var taxtypes = $('#TaxTypes');
        taxtypes.empty();
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].type == 1) {
                    if (id === result.items[i].id) {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }
                }
            }
            taxtypes.selectpicker('refresh');
        });
    }
    function getpricingtype(id) {

        var pricingtypes = $('#PricingTypes');
        pricingtypes.empty();
        _pricingTypeService.getPricingTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (id === result.items[i].id) {
                    pricingtypes.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                }
                else {
                    pricingtypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            pricingtypes.selectpicker('refresh');
        });
    }


    function getRFPItems(id) {
        _$itemsTable.DataTable().rows().remove().draw(false);
        _rfpService.getRFPItemByParentId({ id: id }).done(function (result) {

            for (var i = 0; i < result.items.length; i++) {
                var $sqiid = result.items[i].id;
                var $sqiproductid = result.items[i].productId;
                var $sqiproductcode = result.items[i].productCode;
                var $sqiproductname = result.items[i].productName;
                var $sqiproductdescription = result.items[i].productDescription;
                var $sqiunitid = result.items[i].unitId;
                var $sqiunit = result.items[i].unit;
                var $sqiquantity = result.items[i].qty;
                var $sqiprice = result.items[i].unitPrice;
                var $sqidisctotal = result.items[i].discTotal;
                var $sqitotal = result.items[i].total;
                var $sqigroupname = result.items[i].groupName;
                var $sqiimagename = result.items[i].imageName;
                var $sqireference = result.items[i].reference;

                var $sqidisc1 = result.items[i].disc1;
                var $sqidisc2 = result.items[i].disc2;
                var $sqidisc3 = result.items[i].disc3;
                var $sqidtype1 = result.items[i].discType1;
                var $sqidtype2 = result.items[i].discType2;
                var $sqidtype3 = result.items[i].discType3;
                var $sqiperdescription = result.items[i].description;

                var sqiprice = parseFloat(($sqiprice + '').replace(/,/g, ''));
                var sqiquantity = parseFloat(($sqiquantity + '').replace(/,/g, ''));

                var sqidisc1 = 0;
                var sqidisc2 = 0;
                var sqidisc3 = 0;
                if ($sqidisc1 !== "") {
                    sqidisc1 = parseFloat(($sqidisc1 + '').replace(/,/g, ''));
                }
                if ($sqidisc2 !== "") {
                    sqidisc2 = parseFloat(($sqidisc2 + '').replace(/,/g, ''));
                }
                if ($sqidisc3 !== "") {
                    sqidisc3 = parseFloat(($sqidisc3 + '').replace(/,/g, ''));
                }

                var sqidiscount = priceDiscount(sqiprice, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3));
                var sqitotaldiscount = $sqidisctotal;
                var sqilessprice = sqiprice - sqidiscount;
                var sqitotal = sqilessprice * sqiquantity;
                var sqitotalfinal = sqitotal + sqitotaldiscount;
                var sqidatacount = dataTable.rows().count();
                var sqiitemno = sqidatacount + 1;
                $('#DiscountTotal').val(sqitotaldiscount);
                dataTable.row.add([sqiitemno,
                    //'<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
                    '<a href="#" class="btn-link">' + $sqiproductname + '</a><br /><small><label class="text-muted">' + $sqiperdescription + '</label></small>',
                    '<label class="text-muted" hidden>' + $sqiquantity + '</label><label class="text-muted" hidden>' + $sqiunit + '</label>',
                    sqiprice,
                    sqitotaldiscount,
                    $sqitotal,
                    '',
                    $sqiproductid, $sqiproductname, $sqiperdescription, $sqiquantity, $sqiunitid, sqiprice, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), sqitotaldiscount, $sqitotal, $sqiid

                ]).draw();


                //dataTablePrint.row.add(['<label class="font-weight-bold">' + $sqiproductcode + '</label><br/><img src="' + abp.appPath + 'products/' + $sqiproductcode + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                //'<label class="font-weight-bold">' + $sqiproductname + '</label><br/><label class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</label>',
                //'<label class="text-muted">' + $sqiquantity + '</label>',
                //    sqiprice,
                //    sqitotaldiscount,
                //    sqitotal]).draw();
            }

        });
    };

    function getPaymentPaid(id) {
        _$paidTable.DataTable().rows().remove().draw(false);
        //$('#divPaid').removeAttr('hidden');
        _cvService.getCVByParentId({ id: id }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                var datacount = dataTablePaid.rows().count();
                var itemno = datacount + 1;
                var code = result.items[i].code;
                var transactionTime = result.items[i].transactionTime;
                var mode = result.items[i].paymentMode;
                var amount = result.items[i].grandTotal;
                var ref = result.items[i].checkNumber;
                var checkdate = result.items[i].checkDate;
                var pamount = result.items[i].paymentAmount;

                var ewt = result.items[i].ewtTypeId;
                var etxt = '';
                if (ewt > 0) {
                    etxt = result.items[i].ewtType;
                }
                else {
                    etxt = 'None';
                }
                var eamount = result.items[i].ewtAmount;
                console.log(result.items[i]);
                var tt = new Date(transactionTime);
                var date = getFormattedDate(tt);
                var cd = new Date(checkdate);
                var cdate = getFormattedDate(cd);
                dataTablePaid.row.add([itemno,
                    code,
                    date,
                    amount,
                    mode,
                    ref,
                    cdate,
                    pamount,
                    etxt,
                    eamount
                ]).draw();
            }
            computeTotal('etext');
            //alert(datacount);
            //if (datacount > "0") {
            //    $('#divPaid').removeAttr('hidden');

            //}
            //else {
            //    $('#divPaid').attr('id', 'hidden');
            //}
        });


    };

    function getpaymentterm(id) {
        var paymentterms = $('#PaymentTerms');
        paymentterms.empty();
        _commonService.getPaymentTerms().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (id === result.items[i].id) {
                    paymentterms.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                }
                else {
                    paymentterms.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                }

            }
            paymentterms.selectpicker('refresh');
        });
    }

    // Request Autocomplete
    var getrfps = function (request, response) {
        _rfpService.autocomplete({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.code + ' - ' + el.client,
                    value: el.id
                };
            }));
        });
    };

    function getrfp() {
        var $requestid = $('#RequestId').val();
        _rfpService.getRFP({ id: $requestid }).done(function (result) {
            $('#RequestCode').val(result.code);
            $('#ClientId').val(result.clientId);
            $('#ClientName').val(result.client);
            $('#Notes').val(result.code + ' - ' + result.notes);
            $('#TaxType').val(result.taxTypeId);
            $('#SubTotal').val(currencyFormat(result.subTotal));
            $('#NetTotal').val(currencyFormat(result.netTotal));
            $('#Tax').val(currencyFormat(result.tax));
            $('#TotalId').val(result.grandTotal);
            $('#Total').val(currencyFormat(result.grandTotal));
            getRFPItems($requestid);
            getPaymentPaid($requestid);
            gettaxtype(result.taxTypeId);
            getpricingtype(result.pricingTypeId);
            getpaymentterm(result.paymentTermId);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
            computeTotal('etext');
        });
    };

    var selectrfp = function (event, ui) {
        event.preventDefault();
        $("#RequestId").val(ui.item ? ui.item.value : "");
        $("#Request").val(ui.item ? ui.item.label : "");
        getrfp();
        return false;
    };
    var focusrfp = function (event, ui) {
        event.preventDefault();
        $("#RequestId").val(ui.item.value);
        $("#Request").val(ui.item.label);

    };
    var changerfp = function (event, ui) {
        event.preventDefault();
        $("#RequestId").val(ui.item ? ui.item.value : "");
        $("#Request").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#RequestId').val('');
            $('#RequestCode').val('');
            $('#ClientId').val('');
            $('#ClientName').val('');
            $('#divPaid').attr('id', 'hidden');


        }
    };
    $("#Request").autocomplete({
        source: getrfps,
        select: selectrfp,
        focus: focusrfp,
        minLength: 2,
        delay: 100,
        change: changerfp
    });
    //Request Autocomplete

    function getAll() {
        dataTable.ajax.reload();
    }

    function getload() {
        dataTablePaid.ajax.reload();
    }

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        },
        {
            orderable: false,
            targets: [0, 1, 2, 3, 4, 5]
        },
        {
            render: $.fn.dataTable.render.number(',', '.', 2),
            className: 'text-right',
            targets: [3, 4, 5, 6, 7]
        },
        //{
        //    targets: 2,
        //    data: "creationTime",
        //    render: function (data) {
        //        var tt = new Date(data);
        //        return getFormattedDate(tt);
        //    }
        //},
        {
            //data: null,
            className: "text-right",
            "render": function () {
                return '<input id="Allocated" class="form-control" type="text" name="Allocated">';
            },
            targets: [7]
        }
        ]
    });

    var dataTablePaid = _$paidTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            {
                "visible": true,
                targets: [8, 9]
            },
            //{
            //    targets: 2,
            //    data: "transactionTime",
            //    render: function (data) {
            //        var tt = new Date(data);
            //        return getFormattedDate(tt);
            //    }
            //},
            {
                orderable: false,
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [3, 7, 9]
            }

        ]
    });


    function computeTotal(from) {
        var grandtotal1 = 0;
        var grandtotal = 0;
        var bal = 0;
        var discounttotal = 0;
        var chargestotal = 0;
        var taxrate = 0;
        var tax = 0;
        var taxcode = 101;
        var nettotal = 0;
        dataTable.column(5).data()
            .each(function (value, index) {
                var val = value + '';
                var $grandtotal = parseFloat(val.replace(/,/g, ''));
                grandtotal = grandtotal + $grandtotal;
            });

        dataTablePaid.column(3).data()
            .each(function (value, index) {
                var val = value + '';
                var $bal = parseFloat(val.replace(/,/g, ''));
                bal = bal + $bal;
            });

        //dataTablePaid.column(9).data()
        //    .each(function (value, index) {
        //        var val = value + '';
        //        var $bal = parseFloat(val.replace(/,/g, ''));
        //        bal = bal + $bal;
        //    });


        //dataTable.column(4).data()
        //    .each(function (value, index) {
        //        var $discounttotal = parseFloat(value);
        //        discounttotal = discounttotal + $discounttotal;
        //    });

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

        //ewt

        var inputAmtPaid = $('#PaidAmount').val() + '';
        var inputtotalamt = $('#TotalId').val() + '';
        var inputnettotal = $('#NetTotal').val() + '';
        var totalamt = parseFloat(inputtotalamt.replace(/,/g, ''));
        var amtpaid = parseFloat(inputAmtPaid.replace(/,/g, ''));
        var netamt = parseFloat(inputnettotal.replace(/,/g, ''));

        var unlocated = 0;
        var paidamt = $('#PaidAmount').val() + '';
        unlocated = parseFloat(paidamt.replace(/,/g, ''));

        console.log(inputnettotal);
        var ewtnm = 0, et = 0, e = 0, edec = 0, eamount = 0;
        var isNeg = false;

        var $ewttypeid = $('#EWTTypes').val();

        ewtcode = $("#EWTTypes option:selected").data('code');
        ewtrate = $("#EWTTypes option:selected").data('rate');

        if (from === 'esel') {
            if (ewtrate > 0) {
                ewtnm = netamt * (ewtrate - 1);
                console.log('netamt - ' + netamt);
                console.log('ewtrate - ' + (ewtrate / 100));
                et = (ewtnm + "").replace(/,/g, "");
                e = Math.floor(parseFloat(et));
                edec = (parseFloat(et) - e) * 100;
                e = Math.round(edec) / 100 >= 1 ? e + Math.floor(Math.round(edec) / 100) : e;
                edec = Math.round(edec) / 100 >= 1 ? ((Math.round(edec) / 100) - Math.floor(edec)) * 100 : edec;
                eamount = e.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + (Math.floor(Math.round(edec)).toString() > 0 ? Math.floor(Math.round(edec)).toString() < 10 ? "0" + Math.floor(Math.round(edec)).toString() : Math.floor(Math.round(edec)).toString() : "00");
                eamount = isNeg ? parseFloat(eamount) != 0 ? "-" + eamount : eamount : eamount;

            }
        }
        else if (from == 'etext') {
            eamount = $('#EWT').val();
        }
        $('#EWT').val(eamount);
        var ewtamt = $('#EWT').val() + '';
        ewt = parseFloat(ewtamt.replace(/,/g, ''));
        if (ewt > 0) {
            unlocated += ewt;
        }
        $('#GrandTotal').val(currencyFormat(unlocated));
        $('#TotalBalance').val(currencyFormat(unlocated));

        var newgrandtotal = totalamt - bal;
        var newgrandtotal1 = newgrandtotal - unlocated; //amtpaid;
        //alert(newgrandtotal1);
        //$('#DiscountTotal').val(currencyFormat(discounttotal));
        //$('#NetTotal').val(currencyFormat(nettotal));
        //$('#Tax').val(currencyFormat(tax));
        //$('#Total').val(currencyFormat(grandtotal));
        //$('#ChargesTotal').val(currencyFormat(chargestotal));



        if (inputAmtPaid === '') {
            $('#TotalAmountPaid').val(currencyFormat(newgrandtotal));
            if (newgrandtotal === 0) {
                $('#IsFullyPaid').val("true");
                //alert(newgrandtotal + 'true - noinputes');
                //alert('true');
            }
            else {
                $('#IsFullyPaid').val("false");
                //alert(newgrandtotal + 'false - noinputes');
                //alert('false');
            }


        }
        else {
            $('#TotalAmountPaid').val(currencyFormat(newgrandtotal1));
            //alert(newgrandtotal1);
            //$('#IsFullyPaid').val("true");
            if (newgrandtotal1 === 0) {
                $('#IsFullyPaid').val("true");
                //alert(newgrandtotal1 + 'true - inputes');

                //alert('true');
            }
            else {
                $('#IsFullyPaid').val("false");
                //alert(newgrandtotal1 + 'false - inputes');
                //alert('false');
            }

        }

        //var bal = $('#TotalAmountPaid').val();
        //var unlo = (currencyFormat(grandtotal));



        //if (newgrandtotal === 0) {
        //    $('#IsFullyPaid').val("true");
        //}
        //else {
        //    $('#IsFullyPaid').val("false");
        //}


    }

    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }

        var balance = $('#TotalAmountPaid').val();
        if (balance < 0) {
            abp.message.warn('Payment must not be greater than balance.', 'Ooops! Record not saved.');
            return;
        }

        var grandtotal = 0;
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();

        //if (formdata.DebitTotal !== formdata.CreditTotal) {
        //    abp.notify.warn('Entry type not balance.', 'Warning');
        //    return;
        //}

        var viewData = {
            cv: {
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": $("#Series option:selected").html(),
                "code": "0",
                "transactionTime": formdata.TransactionTime,
                "requestId": formdata.RequestId,
                "clientId": formdata.ClientId,
                "notes": formdata.Notes,
                "paymentModeId": formdata.Paymentmode, //"1",
                //Marc
                "paymentAmount": formdata.PaidAmount,
                "ewtTypeId": formdata.EWTTypes,
                "ewtAmount": formdata.EWT,
                //Marc
                "grandTotal": formdata.TotalBalance,
                //Marc
                "checkName": formdata.CheckName,
                //Marc
                "checkNumber": formdata.CheckNumber,
                "checkDate": formdata.CheckDate,
                "paymentAccountId": formdata.PaymentAccountId,
                "depositAccountId": formdata.AccountsId,
                "referenceTypeId": "1",
                "statusId": "1",
                "referenceId": formdata.RequestId,
                "referenceCode": "1",
                "isFullyPaid": formdata.IsFullyPaid,
            },
            cvd: [],
            generalledger: []
        };
        disabled.attr('disabled', 'disabled');

        //sales order items
        var tableitem = _$itemsTable.DataTable();
        var form_data = tableitem.rows().data();
        var f = form_data;

        //jsonObj = [];
        for (var i = 0; f.length > i; i++) {
            item = {};
            item["requestId"] = formdata.SeriesTypeId;
            item["collectionId"] = "1";
            item["salesInvoiceId"] = formdata.RequestId,
                item["checkNumber"] = formdata.CheckNumber,
                item["checkDate"] = formdata.CheckDate,
                item["appliedTime"] = formdata.TransactionTime;
            item["amount"] = formdata.TotalBalance;
            item["againstAccountId"] = formdata.AccountId;
            item["isFullyPaid"] = formdata.IsFullyPaid;

            viewData.cvd.push(item);
            //jsonObj.push(item);
        }

        //var tableledgers = _$itemsTable.DataTable();
        var form_dataledger = tableitem.rows().data();
        var x = form_dataledger;

        //for (var y = 0; x.length > y; y++) {
        //    //var debit = parseFloat(x[y][2]);
        //    //var credit = parseFloat(x[y][3]);
        //    var debit = formdata.TotalBalance;
        //    ledger = {};
        //    ledger["TransactionTypeId"] = "0";
        //    ledger["TransactionId"] = formdata.Id;
        //    ledger["TransactionCode"] = formdata.RequestCode;
        //    ledger["TransactionTime"] = formdata.TransactionTime;
        //    ledger["AccountId"] = formdata.AccountsId;
        //    ledger["Debit"] = formdata.TotalBalance;
        //    ledger["Credit"] = formdata.TotalBalance;
        //    if (debit > 0) {
        //        ledger["BaseTypeId"] = "1";
        //    }
        //    else {
        //        ledger["BaseTypeId"] = "2";
        //    }

        //    ledger["Description"] = "";
        //    ledger["CenterTypeId"] = "1";
        //    ledger["PartyId"] = "3";
        //    ledger["ProjectId"] = "0";
        //    var partyid = "3";
        //    if (partyid > 0) {
        //        ledger["PartyName"] = formdata.ClientName;
        //        ledger["PartyCode"] = "105";
        //    }
        //    else {
        //        ledger["PartyName"] = "";
        //        ledger["PartyCode"] = "0";
        //    }
        //    ledger["CompanyId"] = formdata.CompanyId;
        //    viewData.generalledger.push(ledger);
        //}

        //generateledger

        //AP
        var debit = formdata.TotalBalance;
        ledger = {};
        ledger["TransactionTypeId"] = "0";
        ledger["TransactionId"] = formdata.Id;
        ledger["TransactionCode"] = formdata.RequestCode;
        ledger["TransactionTime"] = formdata.TransactionTime;
        ledger["AccountId"] = formdata.AccountsId;
        ledger["Debit"] = formdata.TotalBalance;
        ledger["Credit"] = '0';
        if (formdata.TotalBalance > 0) {
            ledger["BaseTypeId"] = "1";
        }
        else {
            ledger["BaseTypeId"] = "2";
        }

        ledger["Description"] = "";
        ledger["CenterTypeId"] = "1";
        ledger["PartyId"] = "3";
        ledger["ProjectId"] = "0";
        var partyid = "3";
        if (partyid > 0) {
            ledger["PartyName"] = formdata.ClientName;
            ledger["PartyCode"] = "105";
        }
        else {
            ledger["PartyName"] = "";
            ledger["PartyCode"] = "0";
        }
        ledger["CompanyId"] = formdata.CompanyId;
        viewData.generalledger.push(ledger);
        //AP

        //Payment
        var debit = formdata.TotalBalance;
        ledger = {};
        ledger["TransactionTypeId"] = "0";
        ledger["TransactionId"] = formdata.Id;
        ledger["TransactionCode"] = formdata.RequestCode;
        ledger["TransactionTime"] = formdata.TransactionTime;
        ledger["AccountId"] = formdata.PaymentAccountId;
        ledger["Debit"] = '0';
        ledger["Credit"] = formdata.TotalBalance;
        if (formdata.TotalBalance > 0) {
            ledger["BaseTypeId"] = "2";
        }
        else {
            ledger["BaseTypeId"] = "1";
        }

        ledger["Description"] = "";
        ledger["CenterTypeId"] = "1";
        ledger["PartyId"] = "3";
        ledger["ProjectId"] = "0";
        var partyid = "3";
        if (partyid > 0) {
            ledger["PartyName"] = formdata.ClientName;
            ledger["PartyCode"] = "105";
        }
        else {
            ledger["PartyName"] = "";
            ledger["PartyCode"] = "0";
        }
        ledger["CompanyId"] = formdata.CompanyId;
        viewData.generalledger.push(ledger);
        //Payment

        abp.message.confirm(
            'New CV will be created.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_salesOrderService.createSalesOrder(viewData).done(function () {
                    _cvService.createCV(viewData).done(function () {
                        abp.notify.success('Check Voucher created', 'Success');

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

