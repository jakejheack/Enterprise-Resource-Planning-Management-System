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

    var _$form = $('form[name=RfpForm]');
    var _$itemsTable = $('#ItemsTable');

    function getcompanies() {
        var companies = $('#Companies');
        abp.ui.block($('#Companies'));
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

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        },
        {
            orderable: false,
            targets: [0, 1, 2, 3, 4, 5, 6]
        },
        {
            render: $.fn.dataTable.render.number(',', '.', 2),
            className: 'text-right',
            targets: [3, 4, 5]
        },
        {
            className: 'text-center',
            targets: [2]
        }
            //    ,
            //{
            //    data: null,
            //    className: "text-center",
            //    "render": function () {
            //        return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            //    },
            //    targets: [6]
            //}
        ]
    });

    function getRFP() {
        var $id = $('#Id').val();
        //abp.ui.setBusy(_$form);
        _rfpService.getRFP({ id: $id }).done(function (result) {
            //alert(result.code);
            $('#Prefix').val(result.prefix);
            //$('#Code').val(result.code);
            $('#Series').val(result.seriesTypeId);
            $('#RefNo').val(result.code);
            var rtransactiontime = new Date(result.transactionTime);
            var tt = getFormattedDate(rtransactiontime);
            $('#TransactionTime').val(tt);
            $('#Company').val(result.company);
            $('#RequestId').val(result.requestId);
            $('#RequestCode').val(result.requestCode);
            $('#ClientId').val(result.clientId);
            $('#ClientName').val(result.client);
            $('#Notes').val(result.notes);
            $('#TaxType').val(result.taxTypeId);
            $('#SubTotal').val(result.subTotal);

            $('#NetTotal').val(result.netTotal);
            $('#Tax').val(result.tax);
            $('#Total').val(result.grandTotal);
            $('#StatusBadge').text(result.status);
            //alert(result.statusId);
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
            gettaxtype(result.taxTypeId);
            getpaymentterm(result.paymentTermId);
            //computeTotal();
            getRFPItems($id);

        });


    };

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

                var sqiprice = parseFloat($sqiprice);
                var sqiquantity = parseFloat($sqiquantity);

                var sqidisc1 = 0;
                var sqidisc2 = 0;
                var sqidisc3 = 0;
                if ($sqidisc1 !== "") {
                    sqidisc1 = parseFloat($sqidisc1);
                }
                if ($sqidisc2 !== "") {
                    sqidisc2 = parseFloat($sqidisc2);
                }
                if ($sqidisc3 !== "") {
                    sqidisc3 = parseFloat($sqidisc3);
                }

                var sqidiscount = priceDiscount(sqiprice, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3));
                var sqitotaldiscount = $sqidisctotal;
                var sqilessprice = sqiprice - sqidiscount;
                var sqitotal = sqilessprice * sqiquantity;
                var sqidatacount = dataTable.rows().count();
                var sqiitemno = sqidatacount + 1;
                $('#DiscountTotal').val(sqitotaldiscount);
                dataTable.row.add([sqiitemno,
                    '<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
                    '<label class="text-muted">' + $sqiquantity + '</label>|<label class="text-muted">' + $sqiunit + '</label>',
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
        });
    };

    getRFP();

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


})(jQuery);

