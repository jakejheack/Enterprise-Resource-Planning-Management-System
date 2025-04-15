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
    var _$glTable = $('#GLTable');
    var _$glTempTable = $('#GLTempTable');

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
        _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: 110, companyId: companyid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
            }
            series.selectpicker('refresh');
        });
    }

    function getpaymentload(id) {
        var paymentterms = $('#Paymentmode');
        paymentterms.empty();
        _commonService.getPaymentModes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].id === id) {
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
    }

    function getPatmentLoad() {
        $('#AccountId').val("1");
        $('#Account').val("Petty Cash Fund");
    }
    getPatmentLoad();

    $('#PaidAmount').on('change', function (e) {
        var unlocated = 0;
        var paidamt = $('#PaidAmount').val() + '';
        unlocated = parseFloat(paidamt.replace(/,/g, ''));
        $('#TotalBalance').val(currencyFormat(unlocated));
    });

    $('#Paymentmode').change(function (e) {
        $sel = $(this).children("option:selected").val();
        if ($sel.toUpperCase() === "1".toUpperCase()) {
            $('#AccountId').val("1");
            $('#Account').val("Petty Cash Fund");

        }
        else if ($sel.toUpperCase() === "2".toUpperCase()) {
            $('#AccountId').val("2");
            $('#Account').val("CIB - Bank 1");
        }
        else if ($sel.toUpperCase() === "3".toUpperCase()) {
            $('#AccountId').val("3");
            $('#Account').val("CIB - Bank 1");
        }
        else if ($sel.toUpperCase() === "4".toUpperCase()) {
            $('#AccountId').val("4");
            $('#Account').val("Creditable Withholding Tax");
        }
        else {
            $('#AccountId').val("4");
            $('#Account').val("Creditable Withholding Tax");
        }

    });

    function gettaxtype(id) {
        var taxtypes = $('#TaxTypes');
        taxtypes.empty();
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (id === result.items[i].id) {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                }
                else {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
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

    function getCV() {
        var $id = $('#Id').val();
        //abp.ui.setBusy(_$form);
        _cvService.getCV({ id: $id }).done(function (result) {
            $('#Prefix').val(result.prefix);
            //$('#Code').val(result.code);
            $('#Series').val(result.seriesTypeId);
            $('#RefNo').val(result.code);
            var rtransactiontime = new Date(result.transactionTime);
            var tt = getFormattedDate(rtransactiontime);
            $('#TransactionTime').val(tt);
            $('#Company').val(result.company);
            $('#RequestId').val(result.requestId);
            //$('#RequestCode').val(result.code);
            //$('#Request').val(result.code);
            $('#ClientId').val(result.clientId);
            $('#ClientName').val(result.client);
            $('#StatusId').val(result.statusId);
            $('#Notes').val(result.notes);
            console.log(result);
            //Marc
            $('#CheckName').val(result.checkName);
            //Marc
            $('#CheckNumber').val(result.checkNumber);
            console.log(result.checkDate);
            var cDate = new Date(result.checkDate);
            var cd = getFormattedDate(cDate);
            $('#CheckDate').val(cd);
            getewt(result.ewtTypeId);
            //$('#EWTTypes').val(result.taxTypeId);
            console.log('getcv ' + result.ewtAmount);
            $('#EWT').val(result.ewtAmount);
            $('#PaidAmount').val(currencyFormat(result.paymentAmount));
            var unlocated = 0;
            var paidamt = result.grandTotal + '';
            unlocated = parseFloat(paidamt.replace(/,/g, ''));
            $('#TotalBalanceActual').val(currencyFormat(unlocated));

            loadPage(result.statusId);

            //$('#Notes').val(result.notes);
            //$('#TaxType').val(result.taxTypeId);
            //$('#SubTotal').val(result.subTotal);


            //$('#NetTotal').val(result.netTotal);
            //$('#Tax').val(result.tax);
            var unlocated = 0;
            var paidamt = result.grandTotal + '';
            unlocated = parseFloat(paidamt.replace(/,/g, ''));
            //$('#TotalBalance').val(currencyFormat(unlocated));
            //$('#PaidAmount').val(result.paymentAmount);

            getpaymentload(result.paymentModeId);

            $('#StatusBadge').text(result.status);
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
            //gettaxtype(result.taxTypeId);
            //getpaymentterm(result.paymentTermId);
            //loadPage(result.statusId);
            ////computeTotal();
            //getRFPItems($id);
            getRFPItems(result.requestId);
            //gettaxtype(result.taxTypeId);
        });


    };

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
                var $transcode = $('#RefNo').val();
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

    getCV();



    function loadPage(id) {
        if (id == '1') {
            $('#SaveButton').removeAttr('hidden');
            $('#PostButton').removeAttr('hidden');
        }

        if (id == '2') {
            $('#SaveButton').removeAttr('hidden');
        }

    }

    function getewt(id) {
        var taxtypes = $('#EWTTypes');
        taxtypes.empty();
        taxtypes.append('<option value="0">None</option>');
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {

                if (result.items[i].type == 2) {
                    if (id === result.items[i].id) {
                        //if (id === result.items[i].id) {
                        //    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                        //}
                        //else {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-accountid =' + result.items[i].liabilityAccountId + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                        //}
                    }
                    else {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-accountid =' + result.items[i].liabilityAccountId + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }
                }
            }
            taxtypes.selectpicker('refresh');
        });
    }

    function getRFP(id) {
        //var $id = $('#Id').val();
        //abp.ui.setBusy(_$form);
        _rfpService.getRFP({ id: id }).done(function (result) {
            $('#RequestCode').val(result.code);
            $('#Request').val(result.code + " - " + result.client);
            $('#TaxType').val(result.taxTypeId);
            gettaxtype(result.taxTypeId);
            $('#SubTotal').val(currencyFormat(result.subTotal));
            $('#NetTotal').val(currencyFormat(result.netTotal));
            $('#Tax').val(currencyFormat(result.tax));
            $('#TotalId').val(result.grandTotal);
            $('#Total').val(currencyFormat(result.grandTotal));
            console.log($('#TotalId').val());
            getpricingtype(result.pricingTypeId);
            getpaymentterm(result.paymentTermId);
            //computeTotal();
            //getRFPItems($id);

            getPaymentPaid(id);
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
                var sqitotaldiscount = sqidiscount * sqiquantity;
                var sqilessprice = sqiprice - sqidiscount;
                var sqitotal = sqilessprice * sqiquantity;
                var sqidatacount = dataTable.rows().count();
                var sqiitemno = sqidatacount + 1;
                $('#DiscountTotal').val(sqitotaldiscount);
                dataTable.row.add([sqiitemno,
                    //'<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
                    '<a href="#" class="btn-link">' + $sqiproductname + '</a><br /><small><label class="text-muted">' + $sqiperdescription + '</label></small>',

                    '<label class="text-muted" hidden>' + $sqiquantity + '</label><label class="text-muted" hidden>' + $sqiunit + '</label>',
                    sqiprice,
                    sqitotaldiscount,
                    sqitotal,
                    '',
                    $sqiproductid, $sqiproductname, $sqiperdescription, $sqiquantity, $sqiunitid, sqiprice, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), sqitotaldiscount, sqitotal, $sqiid

                ]).draw();



                //dataTablePrint.row.add(['<label class="font-weight-bold">' + $sqiproductcode + '</label><br/><img src="' + abp.appPath + 'products/' + $sqiproductcode + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                //'<label class="font-weight-bold">' + $sqiproductname + '</label><br/><label class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</label>',
                //'<label class="text-muted">' + $sqiquantity + '</label>',
                //    sqiprice,
                //    sqitotaldiscount,
                //    sqitotal]).draw();
            }


            getRFP(id);
        }).always(function () { //computeTotal(); 
        });
    }

    function getPaymentPaid(id) {
        _$paidTable.DataTable().rows().remove().draw(false);
        var cvid = $('#Id').val();
        //$('#divPaid').removeAttr('hidden');
        _cvService.getCVByParentId({ id: id }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                //if (cvid != result.items[i].id) {
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
                //}
            }
        }).always(function () {
            computeTotal();
            glDataTable.ajax.reload();
        });


    };


    // Request Autocomplete
    //var getrfps = function (request, response) {
    //    _rfpService.autocomplete({ filter: request.term }).done(function (result) {
    //        response($.map(result.items, function (el) {
    //            return {
    //                label: el.code,
    //                value: el.id
    //            };
    //        }));
    //    });
    //};
    //function getrfp() {
    //    var $requestid = $('#RequestId').val();
    //    _rfpService.getRFP({ id: $requestid }).done(function (result) {
    //        $('#RequestCode').val(result.code);
    //        $('#ClientId').val(result.clientId);
    //        $('#RequestCode').val(result.code);
    //        $('#Request').val(result.client);


    //    });
    //};
    //var selectrfp = function (event, ui) {
    //    event.preventDefault();
    //    $("#RequestId").val(ui.item ? ui.item.value : "");
    //    $("#Request").val(ui.item ? ui.item.label : "");
    //    getrfp();
    //    return false;
    //};
    //var focusrfp = function (event, ui) {
    //    event.preventDefault();
    //    $("#RequestId").val(ui.item.value);
    //    $("#Request").val(ui.item.label);
    //};
    //var changerfp = function (event, ui) {
    //    event.preventDefault();
    //    $("#RequestId").val(ui.item ? ui.item.value : "");
    //    $("#Request").val(ui.item ? ui.item.label : "");
    //    if (ui.item === null) {
    //        $('#RequestId').val('');
    //        $('#RequestCode').val('');
    //        $('#ClientId').val('');
    //        $('#ClientName').val('');

    //    }
    //};
    //$("#Request").autocomplete({
    //    source: getrfps,
    //    select: selectrfp,
    //    focus: focusrfp,
    //    minLength: 2,
    //    delay: 100,
    //    change: changerfp
    //});
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
            targets: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
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
        columnDefs: [{
            "visible": false,
            //targets: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        },
        {
            orderable: false,
            targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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

    function computeTotal() {
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

        //dataTablePaid.column(4).data()
        dataTablePaid.column(3).data()
            .each(function (value, index) {
                var val = value + '';
                var $bal = parseFloat(val.replace(/,/g, ''));
                bal = bal + $bal;
            });


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

        var inputtotalamt = $('#TotalId').val() + '';
        console.log(inputtotalamt);
        console.log('TotalId ' + $('#TotalId').val());
        var totalamt = parseFloat(inputtotalamt.replace(/,/g, ''));
        console.log(bal);
        var newgrandtotal = totalamt - bal;
        console.log(newgrandtotal);


        //$('#DiscountTotal').val(currencyFormat(discounttotal));
        //$('#NetTotal').val(currencyFormat(nettotal));
        //$('#Tax').val(currencyFormat(tax));
        //$('#Total').val(currencyFormat(grandtotal));
        //$('#ChargesTotal').val(currencyFormat(chargestotal));
        $('#TotalAmountPaid').val(currencyFormat(newgrandtotal));
        $('#TotalBalance').val(currencyFormat(bal));

    }

    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();

        //if (formdata.DebitTotal !== formdata.CreditTotal) {
        //    abp.notify.warn('Entry type not balance.', 'Warning');
        //    return;
        //}

        var viewData = {
            cv: {
                "id": formdata.Id,
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": formdata.Prefix,
                "code": formdata.RequestCode,
                "transactionTime": formdata.TransactionTime,
                "requestId": formdata.RequestId,
                "clientId": formdata.ClientId,
                "paymentModeId": "1",
                "grandTotal": formdata.TotalBalance,
                "paymentAccountId": formdata.AccountId,
                "depositAccountId": "1",
                "referenceTypeId": "1",
                "statusId": formdata.StatusId,
                "referenceId": formdata.RequestId,
                "referenceCode": "1",
            },
            cvd: []
        };
        disabled.attr('disabled', 'disabled');

        ////sales order items
        //var tableitem = _$itemsTable.DataTable();
        //var form_data = tableitem.rows().data();
        //var f = form_data;

        ////jsonObj = [];
        //for (var i = 0; f.length > i; i++) {
        //    item = {};
        //    item["requestId"] = formdata.SeriesTypeId;
        //    item["collectionId"] = "1";
        //    item["salesInvoiceId"] = "1";
        //    item["appliedTime"] = formdata.TransactionTime;
        //    item["amount"] = formdata.TotalBalance;
        //    item["againstAccountId"] = formdata.AccountId;
        //    item["isFullyPaid"] = "false";

        //    viewData.cvd.push(item);
        //    //jsonObj.push(item);
        //}

        abp.message.confirm(
            'New CV will be updated.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_salesOrderService.createSalesOrder(viewData).done(function () {
                    _cvService.updateCV(viewData).done(function () {
                        abp.notify.success('Check Voucher Updated', 'Success');

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
        $('#StatusId').val("1");
        save();
    });

    $('#PostButton').click(function (e) {
        e.preventDefault();
        $('#StatusId').val("2");
        save();
    });

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
            generatetempledger();
        }
    });

    function generatetempledger() {
        //AP
        var generalledger = [];
        var formdata = _$form.serializeFormToObject();
        var debit = formdata.TotalBalance;
        ledger = {};
        ledger["TransactionTypeId"] = "0";
        ledger["TransactionId"] = formdata.Id;
        ledger["TransactionCode"] = formdata.RequestCode;
        ledger["TransactionTime"] = formdata.TransactionTime;
        ledger["AccountId"] = formdata.AccountsId;
        ledger["Debit"] = formdata.TotalBalanceActual;
        ledger["Credit"] = '0';
        if (formdata.TotalBalance > 0) {
            ledger["BaseTypeId"] = "1";
        }
        else {
            ledger["BaseTypeId"] = "2";
        }

        ledger["Description"] = "";
        ledger["CenterTypeId"] = "1";
        ledger["PartyId"] = formdata.ClientId;
        ledger["ProjectId"] = "0";
        var partyid = formdata.ClientId;
        if (partyid > 0) {
            ledger["PartyName"] = formdata.ClientName;
            ledger["PartyCode"] = "200";
        }
        else {
            ledger["PartyName"] = "";
            ledger["PartyCode"] = "0";
        }
        ledger["CompanyId"] = formdata.CompanyId;
        generalledger.push(ledger);
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
        //ledger["Credit"] = formdata.TotalBalance;
        ledger["Credit"] = formdata.PaidAmount;
        if (formdata.TotalBalance > 0) {
            ledger["BaseTypeId"] = "2";
        }
        else {
            ledger["BaseTypeId"] = "1";
        }

        ledger["Description"] = "";
        ledger["CenterTypeId"] = "1";
        ledger["PartyId"] = formdata.ClientId;
        ledger["ProjectId"] = "0";
        var partyid = formdata.ClientId;
        if (partyid > 0) {
            ledger["PartyName"] = formdata.ClientName;
            ledger["PartyCode"] = "200";
        }
        else {
            ledger["PartyName"] = "";
            ledger["PartyCode"] = "0";
        }
        ledger["CompanyId"] = formdata.CompanyId;
        generalledger.push(ledger);
        //Payment

        //EWT
        var ewttype = $('#EWTTypes').val();
        var ewtamount = $('#EWT').val();
        var eaccountid = $("#EWTTypes option:selected").data('accountid');
        if (ewttype > 0 && ewtamount > 0)
            var debit = formdata.TotalBalance;
        ledger = {};
        ledger["TransactionTypeId"] = "0";
        ledger["TransactionId"] = formdata.Id;
        ledger["TransactionCode"] = formdata.RequestCode;
        ledger["TransactionTime"] = formdata.TransactionTime;
        ledger["AccountId"] = eaccountid;
        ledger["Debit"] = '0';
        //ledger["Credit"] = formdata.TotalBalance;
        ledger["Credit"] = ewtamount;
        if (formdata.TotalBalance > 0) {
            ledger["BaseTypeId"] = "2";
        }
        else {
            ledger["BaseTypeId"] = "1";
        }

        ledger["Description"] = "";
        ledger["CenterTypeId"] = "1";
        ledger["PartyId"] = formdata.ClientId;
        ledger["ProjectId"] = "0";
        var partyid = formdata.ClientId;
        if (partyid > 0) {
            ledger["PartyName"] = formdata.ClientName;
            ledger["PartyCode"] = "200";
        }
        else {
            ledger["PartyName"] = "";
            ledger["PartyCode"] = "0";
        }
        ledger["CompanyId"] = formdata.CompanyId;
        generalledger.push(ledger);

        glTempDataTable.clear().draw();

        _accountService.getAccounts({ filter: 'null|null|null|null|null', forExport: true }).done(function (result) {
            var totaldebit = 0, totalcredit = 0;
            for (var h = 0; h < generalledger.length; h++) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].id == generalledger[h]["AccountId"]) {
                        var itemno = h + 1;
                        var accid = result.items[i].id;
                        var debit = parseFloat(generalledger[h]["Debit"].replace(/,/g, ''));
                        var acc = result.items[i].name;
                        var credit = parseFloat(generalledger[h]["Credit"].replace(/,/g, ''));
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

    function printPreview() {
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

    function printPreview2() {
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

})(jQuery);

