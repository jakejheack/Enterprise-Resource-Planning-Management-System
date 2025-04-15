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

(function () {
    $(function () {

        var _pricingTypeService = abp.services.app.pricingTypeService;
        var _productPriceService = abp.services.app.productPriceService;
        var _productService = abp.services.app.productService;
        var _companyService = abp.services.app.companyService;
        var _commonService = abp.services.app.commonService;
        var _clientService = abp.services.app.clientService;
        var _salesOrderService = abp.services.app.salesOrderService;
        var _contactPersonService = abp.services.app.contactPersonService;
        var _salesInvoiceService = abp.services.app.salesInvoiceService;

        var _$form = $('form[name=SalesOrderForm]');
        var _$chargesTable = $('#ChargesTable');
        var _$chargesTable2 = $('#ChargesTable2');
        var _$itemsTable = $('#ItemsTable');
        var _$ledgerTable = $('#LedgerTable');
        var _$itemsTablePrintActual = $('#ItemsTablePrintActual');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');

        $('#OtherTerms').hide();
        $('#divTable').hide();
        $('#Editaccordion').hide();

        getinvoice();
        function getinvoice() {
            $("#SubmitButton").attr("hidden", true);
            $("#CancelButton").attr("hidden", true);
            abp.ui.setBusy(_$form);
            var $id = $('#Id').val();
            _salesInvoiceService.getSalesInvoice({ id: $id }).done(function (result) {
                $('#Code').val(result.code);
                $('#Prefix').val(result.prefix);
                $('#SeriesTypeId').val(result.seriesTypeId);
                $('#Companies').val(result.companyId);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#TaxNo').val(result.taxNo);
                $('#BusinessStyle').val(result.businessStyle);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#SalesAgent').val(result.salesAgent);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#ClientOrderNo').val(result.clientOrderNo);
                $('#Notes').val(result.notes);
                $('#LotDescription').val(result.lotDescription);
                $('#TaxNo').val(result.taxNo);
                $('#BusinessStyle').val(result.businessStyle);
                var sonettotal = currencyFormat(result.netTotal);
                var sootherdiscount = currencyFormat(result.otherDiscount);
                var soothercharges = currencyFormat(result.otherCharges);
                var sosubtotal = currencyFormat(result.subTotal);
                var sotax = currencyFormat(result.tax);
                var sograndtotal = currencyFormat(result.grandTotal);
                var sotransactiontime = new Date(result.transactionTime);
                console.log(sotransactiontime);
                console.log(getFormattedDate(sotransactiontime));
                $('#TransactionTime').val(getFormattedDate(sotransactiontime));
                $('#DiscountTotal').val(sootherdiscount);
                $('#NetTotal').val(sonettotal);
                $('#Tax').val(sotax);
                $('#Total').val(sosubtotal);
                $('#ChargesTotal').val(soothercharges);
                $('#GrandTotal').val(sograndtotal);
                $('#StatusBadge').text(result.status);
                $('#SalesAccountId').text(result.cashAccountId);
                $('#TaxAccountId').text(result.taxAccountId);
                $('#ReceivableAccountId').text(result.receivableAccountId);

                //MULTIPLE SI
                //balance
                $('#BalDiscountTotal').val(currencyFormat(result.billDiscountBalance));
                $('#BalNetTotal').val(currencyFormat(result.billNetBalance));
                $('#BalTax').val(currencyFormat(result.billTaxBalance));
                $('#BalTotal').val(currencyFormat(result.billSubBalance));
                //hidden balance
                $('#BdDiscountTotal').val(currencyFormat(result.billDiscountBalance));
                $('#BdNetTotal').val(currencyFormat(result.billNetBalance));
                $('#BdTax').val(currencyFormat(result.billTaxBalance));
                $('#BdTotal').val(currencyFormat(result.billSubBalance));

                $('#BilledAmount').val(currencyFormat(result.billedSubTotal));
                $('#UnbilledAmount').val(currencyFormat(result.billSubBalance));
                $('#BalanceAmount').val(currencyFormat(result.billSubBalance));
                $('#BdBalance').val(currencyFormat(result.billSubBalance));

                //billing amount
                $('#Percentage').val(currencyFormat(result.percentage));
                $('#BillDiscountTotal').val(currencyFormat(result.billOtherDiscount));
                $('#BillNetTotal').val(currencyFormat(result.billNetTotal));
                $('#BillTax').val(currencyFormat(result.billTax));
                $('#BillTotal').val(currencyFormat(result.billSubTotal));
                $('#BillChargesTotal').val(currencyFormat(result.billOtherCharges));
                $('#BillGrandTotal').val(currencyFormat(result.billGrandTotal));
                //MULTIPLE SI

                switch (result.statusId) {
                    case 1:
                        $('#StatusBadge').addClass('badge badge-secondary');
                        if ($('#SaveButton').length) {
                            $('#SaveButton').removeAttr('hidden');
                        }
                        if ($('#SubmitButton').length) {
                            $('#SubmitButton').removeAttr('hidden');
                        }
                        if ($("#CancelButton").length) {
                            $("#CancelButton").removeAttr("hidden");
                        }
                        break;
                    case 2:
                        $('#StatusBadge').addClass('badge badge-warning');
                        if ($('#ActionButton').length) {
                            $('#ActionButton').removeAttr('hidden');
                        }
                        if ($("#CancelButton").length) {
                            $("#CancelButton").removeAttr("hidden");
                        }
                        break;
                    case 3:
                        $('#StatusBadge').addClass('badge badge-success');
                        //if ($('#SubmitButton').length) {
                        //    $('#SubmitButton').removeAttr('hidden');
                        //}
                        break;
                    case 4:
                        $('#StatusBadge').addClass('badge badge-primary');
                        break;
                    case 5:
                        $('#StatusBadge').addClass('badge badge-danger');
                        //$('#StatusBadge').addClass('badge badge-info');
                        break;
                    case 6:
                        $('#StatusBadge').addClass('badge badge-warning');
                        break;
                    default:
                        $('#StatusBadge').addClass('badge badge-secondary');
                }

                $('#OtherTerms').val(result.otherTerms);

                var hideterms = $("#OtherTerms").val();
                if (hideterms != "") {
                    $("#OtherTerms").show();
                }
                else {
                    $("#OtherTerms").hide();
                }

                $("#OtherTerms").prop("disabled", true);

                getsalesorder(result.salesOrderId);
                getqcompanies(result.companyId);
                getqordertype(result.orderTypeId);
                getqtaxtype(result.taxTypeId);
                getqpricingtype(result.pricingTypeId);
                getqdeliverytype(result.deliveryTypeId);
                getqpaymentterm(result.paymentTermId);
                getqwarrantytype(result.warrantyTypeId);
                getclient();
                dataTable.clear().draw();
                getinvoiceitems($id);
                getinvoicecharges($id);
                $('#PricingTypes').prop('disabled', 'disabled');
                $('#OrderTypes').prop('disabled', 'disabled');
                $('#Companies').prop('disabled', 'disabled');
                $('#Series').prop('disabled', 'disabled');
            });
        };
        function getinvoiceitems(id) {
            _salesInvoiceService.getSalesInvoiceItemsByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $sqiid = result.items[i].id;
                    var $sqiproductid = result.items[i].productId;

                    var $sqiproductcode = result.items[i].productCode;
                    var $sqiproductname = result.items[i].productName;
                    var $sqiproductdescription = result.items[i].productDescription;
                    var $sqiunitid = result.items[i].unitId;
                    var $sqiunit = result.items[i].unit;
                    var $sqiquantity = result.items[i].orderQty;
                    var $sqiprice = result.items[i].unitPrice;
                    var $sqiimagename = result.items[i].imageName;

                    var $sqidisc1 = result.items[i].disc1;
                    var $sqidisc2 = result.items[i].disc2;
                    var $sqidisc3 = result.items[i].disc3;
                    var $sqidtype1 = result.items[i].discType1;
                    var $sqidtype2 = result.items[i].discType2;
                    var $sqidtype3 = result.items[i].discType3;
                    var $sqiperdescription = result.items[i].description;
                    var $sqidisctotal = result.items[i].discTotal;
                    var $sqitotal = result.items[i].total;
                    var sqiprice = parseFloat($sqiprice);
                    var sqiquantity = parseFloat($sqiquantity);
                    var sqitotaldiscount = parseFloat($sqidisctotal);
                    var sqitotal = parseFloat($sqitotal);
                    var $sqcolor = result.items[i].color;


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
                    var $expenseid = result.items[i].expenseAccountId;
                    var $inventoryid = result.items[i].inventoryAccountId;
                    var $incomeid = result.items[i].incomeAccountId;

                    $('#expenseid').val($expenseid);
                    $('#inventoryid').val($inventoryid);
                    $('#incomeid').val($incomeid);

                    var sqidatacount = dataTable.rows().count();
                    var sqiitemno = sqidatacount + 1;

                    dataTable.row.add([sqiitemno,
                        '<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + ' ' + $sqcolor + '</label></small>',
                        '<label class="text-muted">' + $sqiquantity + '</label>|<label class="text-muted">' + $sqiunit + '</label>',
                        sqiprice,
                        sqitotaldiscount,
                        sqitotal,
                        '',
                        $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $expenseid, $inventoryid, $incomeid, $sqiid, $sqcolor
                    ]).draw();

                    //if ($sqiimagename !== '' && $sqiimagename !== null) {
                    dataTablePrintActual.row.add(['<span class="">' + $sqiquantity + '</span>',
                    '<span class="">' + $sqiunit + '</span>',
                    //'<span class="">' + $sqiproductcode + '</span><br/>',
                    '<span class="">' + $sqiproductname + '</span>', //<br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiperdescription + '</span>',

                    '<span class=" text-right">' + currencyFormat(sqiprice) + '</span>',
                    '<span class=" text-right">' + currencyFormat(sqitotal) + '</span>']).draw();
                    //}
                }
            });
        }
        function getinvoicecharges(id) {
            _$chargesTable.DataTable().rows().remove().draw(false);
            _$chargesTable2.DataTable().rows().remove().draw(false);
            _salesInvoiceService.getSalesInvoiceChargesByParentId({ id: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sqccid = result.items[i].id;
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    var $sqcchargetype = result.items[i].chargeType;
                    var $sqcrate = result.items[i].rate;
                    var $sqcamount = result.items[i].amount;
                    var $sqctotal = result.items[i].total;
                    var $sqcrevenueaccountid = result.items[i].revenueAccountId;
                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;
                    dataTableCharges.row.add([sqcitemno,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcrevenueaccountid, $sqccid]).draw();

                    //MULTIPLE SI
                    var sqcdatacount2 = dataTableCharges2.rows().count();
                    var sqcitemno2 = sqcdatacount2 + 1;
                    var $billed = result.items[i].billedTotal;
                    var $bill = result.items[i].billTotal;
                    var $balance = result.items[i].balance;
                    var $newbal = result.items[i].balance - result.items[i].billTotal;
                    var strid = 'row-' + i + '-allocated';
                    var strid2 = 'row-' + i + '-balance';
                    dataTableCharges2.row.add([sqcitemno2,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcrevenueaccountid,
                        $billed, //billed
                        $balance, //unbilled
                        '<input id="' + strid2 + '" data-indexno=' + i + ' data-balance=' + $balance + '  onkeypress="return decimalOnly(this.id);" disabled class="balance form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($newbal) + '" >', //balance
                        '<input id="' + strid + '" data-indexno=' + i + ' data-balance=' + $balance + '  onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($bill) + '" >', //allocated
                        $bill,
                        $sqccid
                    ]).draw();
                    //MULTIPLE SI
                }
                abp.ui.clearBusy(_$form);
            }).always(function () {
                computeTotalBill();
            });
        };
        function getsalesorder(id) {
            _salesOrderService.getSalesOrder({ id: id }).done(function (result) {
                $('#SalesOrderId').val(id);
                $('#SalesOrderCode').val(result.code);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#SalesAgent').val(result.salesAgent);
            });
        };
        //function getcompanies() {
        //    var companies = $('#Companies');
        //    companies.empty();
        //    _companyService.getCompanies().done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            if (result.items[i].isDefault === true) {
        //                companies.append('<option value=' + result.items[i].id + ' data-bankaccountid=' + result.items[i].bankAccountId + ' data-cashaccountid=' + result.items[i].cashAccountId + ' data-payableaccountid=' + result.items[i].payableAccountId + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-taxaccountid=' + result.items[i].taxAccountId + ' selected>' + result.items[i].name + '</option>');
        //                $('#CashAccountId').val(result.items[i].cashAccountId);
        //                $('#BankAccountId').val(result.items[i].bankAccountId);
        //                $('#TaxAccountId').val(result.items[i].taxAccountId);
        //                $('#ReceivableAccountId').val(result.items[i].receivableAccountId);
        //                $('#CompanyAddress').val(result.items[i].companyAddress);
        //                getseriestype(result.items[i].id);
        //            }
        //            else {
        //                companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
        //            }
        //        }
        //        companies.selectpicker('refresh');
        //    });
        //}
        //getcompanies();
        //$('#Companies').on('change', function (e) {
        //    var bankaccountid = $("#Companies option:selected").data('bankaccountid');
        //    var cashaccountid = $("#Companies option:selected").data('cashaccountid');
        //    var payableaccountid = $("#Companies option:selected").data('payableaccountid');
        //    var receivableaccountid = $("#Companies option:selected").data('receivableaccountid');
        //    var taxaccountid = $("#Companies option:selected").data('taxaccountid');
        //    $('#SalesAccountId').val(cashaccountid);
        //    $('#BankAccountId').val(bankaccountid);
        //    $('#TaxAccountId').val(taxaccountid);
        //    $('#ReceivableAccountId').val(receivableaccountid);
        //    getseriestype($('#Companies').val());
        //});
        //$('#Series').on('change', function (e) {
        //    getnextseries($('#Series').val());
        //});
        function getseriestype(companyid) {
            var series = $('#Series');
            series.empty();
            _commonService.getSeriesTypesByTransId({ id: 0, transactionCode: 103, companyId: companyid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
                    if (i === 0) {
                        getnextseries(result.items[i].id);
                    }
                }
                series.selectpicker('refresh');
            });
        }
        function getnextseries(seriesid) {
            _commonService.getNextSeriesCode({ id: seriesid, transactionCode: 0, companyId: 0 }).done(function (result) {
                $('#SeriesCode').val(result);
            });
        }
        function getordertype() {

            var ordertypes = $('#OrderTypes');
            ordertypes.empty();
            _commonService.getOrderTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    ordertypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                ordertypes.selectpicker('refresh');
            });
        }
        function getpricingtype() {
            var pricingtypes = $('#PricingTypes');
            pricingtypes.empty();
            _pricingTypeService.getPricingTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    pricingtypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                pricingtypes.selectpicker('refresh');
            });
        }
        function getpaymentterm() {
            var paymentterms = $('#PaymentTerms');
            paymentterms.empty();
            _commonService.getPaymentTerms().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    paymentterms.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                paymentterms.selectpicker('refresh');
            });
        }
        function gettaxtype() {
            var taxtypes = $('#TaxTypes');
            taxtypes.empty();
            _commonService.getTaxTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].type == 1) {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }
                }
                taxtypes.selectpicker('refresh');
            });
        }
        function getdeliverytype() {
            var deliverytypes = $('#DeliveryTypes');
            deliverytypes.empty();
            _commonService.getDeliveryTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    deliverytypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                deliverytypes.selectpicker('refresh');
            });
        }
        function getwarrantytype() {
            var warrantytypes = $('#WarrantyTypes');
            warrantytypes.empty();
            _commonService.getWarrantyTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    warrantytypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                warrantytypes.selectpicker('refresh');
            });
        }
        //getordertype();
        //getpricingtype();
        //getpaymentterm();
        //gettaxtype();
        //getwarrantytype();
        //getdeliverytype();

        //Client Autocomplete
        var getclients = function (request, response) {
            _clientService.getClients({ filter: request.term }).done(function (result) {
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
            _clientService.getClient({ id: $clientid }).done(function (result) {
                $('#ClientAddress').val(result.address);
                $('#DeliveryAddress').val(result.address);
                $('#ClientEmail').val(result.email);
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
            if (ui.item === null) {
                $('#ClientAddress').val("");
                $('#ClientEmail').val("");
            }
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

        //Item Autocomplete
        var getproducts = function (request, response) {
            _productService.getProductByName({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getproduct() {
            var $productid = $('#ProductId').val();
            _productService.getProduct({ id: $productid }).done(function (result) {
                $('#ProductCode').val(result.code);
            });
        }
        function getproductunits() {
            var units = $('#Units');
            var $productid = $('#ProductId').val();
            units.empty();
            _productService.getProductUnits({
                id: $productid
            }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    units.append('<option value=' + result.items[i].unitId + '>' + result.items[i].unit + '</option>');
                }
                units.selectpicker('refresh');
            });
        }
        function getproductprice() {
            var $unitid = $('#Units').val();
            var $pricingtypeid = $('#PricingTypes').val();
            var $productid = $('#ProductId').val();
            if ($unitid === null) {
                $unitid = 0;
            }
            if ($pricingtypeid === null) {
                $pricingtypeid = 0;
            }
            _productPriceService.getProductPrices({
                productId: $productid, pricingTypeId: $pricingtypeid, unitId: $unitid
            }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var price = currencyFormat(result.items[i].unitPrice);
                    $("#Price").val(result.items[i].unitPrice ? price : "");
                }
            });
        }
        var selectproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            $("#ProductName").val(ui.item ? ui.item.label : "");
            $("#PerDescription").val(ui.item ? ui.item.label : "");
            getproduct();
            getproductunits();
            getproductprice();
            return false;
        };
        var focusproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item.value);
            $("#ProductName").val(ui.item.label);
            $("#PerDescription").val(ui.item.label);
        };
        var changeproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            $("#ProductName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#ProductCode").val("");
                $("#Quantity").val("");
                $("#Price").val("");
                $("#PerDescription").val("");
                var units = $('#Units');
                units.empty();
                units.selectpicker('refresh');
            }
        };
        $("#ProductName").autocomplete({
            source: getproducts,
            select: selectproduct,
            focus: focusproduct,
            minLength: 2,
            delay: 100,
            change: changeproduct
        });
        $('#Units').on('change', function (e) {
            getproductprice();
        });
        //Item Autocomplete

        //Quotation Autocomplete
        var dataTableLedger = _$ledgerTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [5, 6]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3]
            }
            ]
        });
        var dataTableCharges = _$chargesTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [6, 7, 8]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3, 4]
            },
            {
                data: null,
                className: "text-center",
                "render": function () {
                    return '';
                    //return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                },
                targets: [5]
            }
            ]
        });

        //MULTIPLE SI
        var dataTableCharges2 = _$chargesTable2.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [2, 3, 6, 7, 12, 13]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3, 4, 8, 9]
            },
            {
                data: null,
                className: "text-center",
                "render": function () {
                    return '';
                    //return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                },
                targets: [5]
            }
            ]
        });
        //MULTIPLE SI

        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
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
            },
            {
                data: null,
                className: "text-center",
                "render": function () {
                    return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                },
                targets: [6]
            }
            ]
        });

        var dataTableDeleted = _$itemsTableDeleted.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
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
            },
            {
                data: null,
                className: "text-center",
                "render": function () {
                    return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                },
                targets: [6]
            }
            ]
        });

        var dataTablePrintActual = _$itemsTablePrintActual.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4]
                },
                {
                    //render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right si-number',
                    targets: [0, 3, 4]
                },
                {
                    className: 'text-center',
                    targets: [2]
                }
            ]
        });
        function getqpricingtype(id) {

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
        function getqtaxtype(id) {
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
        function getqcompanies(id) {

            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        companies.append('<option value=' + result.items[i].id + ' data-bankaccountid=' + result.items[i].bankAccountId + ' data-cashaccountid=' + result.items[i].cashAccountId + ' data-payableaccountid=' + result.items[i].payableAccountId + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-taxaccountid=' + result.items[i].taxAccountId + ' selected>' + result.items[i].name + '</option>');
                        //$('#SalesAccountId').val(result.items[i].cashAccountId);
                        //$('#BankAccountId').val(result.items[i].bankAccountId);
                        //$('#TaxAccountId').val(result.items[i].taxAccountId);
                        //$('#ReceivableAccountId').val(result.items[i].receivableAccountId);
                        //$('#CompanyAddress').val(result.items[i].companyAddress);
                        //companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        //companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                        companies.append('<option value=' + result.items[i].id + ' data-bankaccountid=' + result.items[i].bankAccountId + ' data-cashaccountid=' + result.items[i].cashAccountId + ' data-payableaccountid=' + result.items[i].payableAccountId + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-taxaccountid=' + result.items[i].taxAccountId + ' >' + result.items[i].name + '</option>');
                    }
                }
                companies.selectpicker('refresh');
            });
        }
        function getqordertype(id) {

            var ordertypes = $('#OrderTypes');
            ordertypes.empty();
            _commonService.getOrderTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        ordertypes.append('<option value=' + result.items[i].id + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-receivableaccountentry=' + result.items[i].receivableAccountEntry + ' data-salesaccountid=' + result.items[i].salesAccountId + ' data-salesaccountentry=' + result.items[i].salesAccountEntry + ' data-discountaccountid=' + result.items[i].salesDiscountAccountId + ' data-discountaccountentry=' + result.items[i].salesDiscountAccountEntry + ' data-returnaccountid=' + result.items[i].salesReturnAccountId + ' data-returnaccountentry=' + result.items[i].salesReturnAccountEntry + ' data-taxaccountid=' + result.items[i].taxAccountId + ' data-taxaccountentry=' + result.items[i].taxAccountEntry + ' selected>' + result.items[i].name + '</option>');
                        $('#SalesAccountId').val(result.items[i].salesAccountId);
                        $('#DiscountAccountId').val(result.items[i].salesDiscountAccountId);
                        $('#ReturnAccountId').val(result.items[i].salesReturnAccountId);
                        $('#TaxAccountId').val(result.items[i].taxAccountId);
                        $('#ReceivableAccountId').val(result.items[i].receivableAccountId);

                        $('#SalesAccountEntry').val(result.items[i].salesAccountEntry);
                        $('#DiscountAccountEntry').val(result.items[i].salesDiscountAccountEntry);
                        $('#ReturnAccountEntry').val(result.items[i].salesReturnAccountEntry);
                        $('#TaxAccountEntry').val(result.items[i].taxAccountEntry);
                        $('#ReceivableAccountEntry').val(result.items[i].receivableAccountEntry);
                    }
                    else {
                        ordertypes.append('<option value=' + result.items[i].id + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-receivableaccountentry=' + result.items[i].receivableAccountEntry + ' data-salesaccountid=' + result.items[i].salesAccountId + ' data-salesaccountentry=' + result.items[i].salesAccountEntry + ' data-discountaccountid=' + result.items[i].salesDiscountAccountId + ' data-discountaccountentry=' + result.items[i].salesDiscountAccountEntry + ' data-returnaccountid=' + result.items[i].salesReturnAccountId + ' data-returnaccountentry=' + result.items[i].salesReturnAccountEntry + ' data-taxaccountid=' + result.items[i].taxAccountId + ' data-taxaccountentry=' + result.items[i].taxAccountEntry + '>' + result.items[i].name + '</option>');
                    }
                }
                ordertypes.selectpicker('refresh');
            });
        }

        $('#OrderTypes').on('change', function (e) {
            var salesaccountid = $("#OrderTypes option:selected").data('salesaccountid');
            var discountaccountid = $("#OrderTypes option:selected").data('discountaccountid');
            var returnaccountid = $("#OrderTypes option:selected").data('returnaccountid');
            var receivableaccountid = $("#OrderTypes option:selected").data('receivableaccountid');
            var taxaccountid = $("#OrderTypes option:selected").data('taxaccountid');
            $('#SalesAccountId').val(salesaccountid);
            $('#DiscountAccountId').val(discountaccountid);
            $('#ReturnAccountId').val(returnaccountid);
            $('#TaxAccountId').val(taxaccountid);
            $('#ReceivableAccountId').val(receivableaccountid);

            var salesentry = $("#OrderTypes option:selected").data('salesaccountentry');
            var discountentry = $("#OrderTypes option:selected").data('discountaccountentry');
            var returnentry = $("#OrderTypes option:selected").data('returnaccountentry');
            var receivableentry = $("#OrderTypes option:selected").data('receivableaccountentry');
            var taxentry = $("#OrderTypes option:selected").data('taxaccountentry');

            $('#SalesAccountEntry').val(salesentry);
            $('#DiscountAccountEntry').val(discountentry);
            $('#ReturnAccountEntry').val(returnentry);
            $('#TaxAccountEntry').val(taxentry);
            $('#ReceivableAccountEntry').val(receivableentry);
        });

        function getqdeliverytype(id) {
            var deliverytypes = $('#DeliveryTypes');
            deliverytypes.empty();
            _commonService.getDeliveryTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }

                }
                deliverytypes.selectpicker('refresh');
            });
        }
        function getqpaymentterm(id) {
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
        function getqwarrantytype(id) {
            var warrantytypes = $('#WarrantyTypes');
            warrantytypes.empty();
            //multiselect
            var ids = id.split(',');
            _commonService.getWarrantyTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //multiselect
                    //if (id === result.items[i].id) {
                    //    warrantytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                    //}
                    //else {
                    //    warrantytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    //}
                    if (ids.includes(String(result.items[i].id))) {
                        warrantytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        warrantytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }
                }
                warrantytypes.selectpicker('refresh');
            });
        }
        var getquotationcodes = function (request, response) {
            _salesOrderService.getSalesOrders({
                filter: null + '|' + request + '|' + '2,3' + '|' + null + '|' + null
            }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code,
                        value: el.id
                    };
                }));
            });
        };
        var selectquotation = function (event, ui) {
            event.preventDefault();
            $("#SalesOrderId").val(ui.item ? ui.item.value : "");
            $("#SalesOrderCode").val(ui.item ? ui.item.label : "");
            getquotation();
            return false;
        };
        var focusquotation = function (event, ui) {
            event.preventDefault();
            $("#SalesOrderId").val(ui.item ? ui.item.value : "");
            $("#SalesOrderCode").val(ui.item ? ui.item.label : "");
        };
        var changequotation = function (event, ui) {
            event.preventDefault();
            $("#SalesOrderId").val(ui.item ? ui.item.value : "");
            $("#SalesOrderCode").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //}
        };
        $("#SalesOrderCode").autocomplete({
            source: getquotationcodes,
            select: selectquotation,
            focus: focusquotation,
            minLength: 2,
            delay: 100,
            change: changequotation
        });
        //Quotation Autocomplete

        //Datatable Add


        function addnewitem() {

            var $productid = $('#ProductId').val();
            var $productcode = $('#ProductCode').val();
            var $productname = $('#ProductName').val();
            var $unitid = $('#Units').val();
            var $unit = $("#Units option:selected").html();
            var $quantity = $('#Quantity').val();
            var $price = $('#Price').val();

            var $disc1 = $('#Discount1').val();
            var $disc2 = $('#Discount2').val();
            var $disc3 = $('#Discount3').val();
            var $dtype1 = $('#DiscountType1').val();
            var $dtype2 = $('#DiscountType2').val();
            var $dtype3 = $('#DiscountType3').val();
            var $perdescription = $('#PerDescription').val();
            var $Color = $('#Color').val();

            var $expenseid = $('#expenseid').val();
            var $inventoryid = $('#inventoryid').val();
            var $incomeid = $('#incomeid').val();

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '') { return; }

            var price = parseFloat($price.replace(/,/g, ''));
            var quantity = parseFloat($quantity);

            var disc1 = 0;
            var disc2 = 0;
            var disc3 = 0;
            if ($disc1 !== "") {
                disc1 = parseFloat($disc1.replace(/,/g, ''));
            }
            if ($disc2 !== "") {
                disc2 = parseFloat($disc2.replace(/,/g, ''));
            }
            if ($disc3 !== "") {
                disc3 = parseFloat($disc3.replace(/,/g, ''));
            }

            var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;
            var datacount = dataTable.rows().count();
            var itemno = datacount + 1;
            var $rowid = "id_row_" + itemno;
            var $rowcode = "code_row_" + itemno;
            var $rowname = "name_row_" + itemno;
            var $rowquantity = "quantity_row_" + itemno;
            var $rowunit = "unit_row_" + itemno;
            dataTable.row.add([itemno,
                '<a href="#" name="' + $rowcode + '" class="btn-link">' + $productcode + '</a><br /><small><label name="' + $rowname + '" class="text-muted">' + $perdescription + ' ' + $Color + '</label></small>',
                '<label name="' + $rowquantity + '" class="text-muted">' + $quantity + '</label>|<label name="' + $rowunit + '" class="text-muted">' + $unit + '</label>',
                lessprice,
                totaldiscount,
                total,
                '',
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $expenseid, $inventoryid, $incomeid, 0, $Color
            ]).draw();

            computeTotal();

            $('#Discount1').val("");
            $('#Discount2').val("");
            $('#Discount3').val("");
            $('#Quantity').val("");
        }

        function computeTotal() {
            var grandtotal = 0;
            var discounttotal = 0;
            var chargestotal = $('#ChargesTotal').val();
            var taxrate = 0;
            var tax = 0;
            var taxcode = 101;
            var nettotal = 0;
            dataTable.column(5).data()
                .each(function (value, index) {
                    var $grandtotal = parseFloat(value);
                    grandtotal = grandtotal + $grandtotal;
                });
            dataTable.column(4).data()
                .each(function (value, index) {
                    var $discounttotal = parseFloat(value);
                    discounttotal = discounttotal + $discounttotal;
                });

            var $taxtypeid = $('#TaxTypes').val();

            taxcode = $("#TaxTypes option:selected").data('code');
            taxrate = $("#TaxTypes option:selected").data('rate');

            if (taxcode === 101) {
                nettotal = grandtotal / taxrate;
                tax = nettotal * (taxrate - 1);
            }
            else if (taxcode === 104) {
                nettotal = grandtotal;
                tax = nettotal * (taxrate - 1);
                grandtotal = nettotal * taxrate;
            }
            else {
                nettotal = grandtotal;
                tax = 0;
            }
            var newgrandtotal = grandtotal + parseFloat(chargestotal);

            $('#DiscountTotal').val(currencyFormat(discounttotal));
            $('#NetTotal').val(currencyFormat(nettotal));
            $('#Tax').val(currencyFormat(tax));
            $('#Total').val(currencyFormat(grandtotal));
            //$('#ChargesTotal').val(currencyFormat(chargestotal));
            $('#GrandTotal').val(currencyFormat(newgrandtotal));
            rearrange();
        }

        function rearrange() {
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            for (var i = 0; f.length > i; i++) {
                var temp = table.row(i).data();
                var itemno = i + 1;

                var $productid = f[i][7];
                var $unitid = f[i][10];
                var $perdescription = f[i][8];
                var $quantity = f[i][9];
                var $price = f[i][3];
                var disc1 = f[i][11];
                var disc2 = f[i][13];
                var disc3 = f[i][15];
                var $dtype1 = f[i][12];
                var $dtype2 = f[i][14];
                var $dtype3 = f[i][16];
                var $productcode = f[i][17];
                var totaldiscount = f[i][4];
                var $invtoryAccountId = f[i][18];
                var $incomeAccountId = f[i][19];
                var $id = f[i][20];
                var $color = f[i][21];

                temp[0] = itemno;
                temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }
        }

        function deleteitem(indexno) {
            var dtable = _$itemsTable.DataTable();
            var dform_data = dtable.rows().data();
            var f = dform_data;

            for (var i = 0; f.length > i; i++) {
                if (indexno === i) {
                    dataTableDeleted.row.add([0,
                        f[i][1],
                        f[i][2],
                        f[i][3],
                        f[i][4],
                        f[i][5],
                        '',
                        f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], parseInt(f[i][12]), f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17], f[i][18], f[i][19], f[i][20], f[i][21]
                    ]).draw();
                }
            }
        }

        function generateLedger() {
            //MULTIPLE SI
            //var otherdiscount = parseFloat($('#DiscountTotal').val().replace(/,/g, ''));
            //var nettotal = parseFloat($('#NetTotal').val().replace(/,/g, ''));
            //var tax = parseFloat($('#Tax').val().replace(/,/g, ''));
            //var total = parseFloat($('#Total').val().replace(/,/g, ''));
            //var chargetotal = parseFloat($('#ChargesTotal').val().replace(/,/g, ''));
            //var grandtotal = parseFloat($('#GrandTotal').val().replace(/,/g, ''));
            var otherdiscount = parseFloat($('#BillDiscountTotal').val().replace(/,/g, ''));
            var nettotal = parseFloat($('#BillNetTotal').val().replace(/,/g, ''));
            var tax = parseFloat($('#BillTax').val().replace(/,/g, ''));
            var total = parseFloat($('#BillTotal').val().replace(/,/g, ''));
            var chargetotal = parseFloat($('#BillChargesTotal').val().replace(/,/g, ''));
            var grandtotal = parseFloat($('#BillGrandTotal').val().replace(/,/g, ''));
            //MULTIPLE SI

            var salesid = $('#SalesAccountId').val();
            var discountid = $('#DiscountAccountId').val();
            var returnid = $('#ReturnAccountId').val();
            var taxid = $('#TaxAccountId').val();
            var receivableid = $('#ReceivableAccountId').val();

            var salesentry = $('#SalesAccountEntry').val() + '';
            var discountentry = $('#DiscountAccountEntry').val() + '';
            var returnentry = $('#ReturnAccountEntry').val() + '';
            var taxentry = $('#TaxAccountEntry').val() + '';
            var receivableentry = $('#ReceivableAccountEntry').val() + '';

            var clientid = $('#ClientId').val();
            var client = $('#ClientName').val();

            dataTableLedger.clear().draw();

            var ctr = 1;
            //dataTableLedger.row.add([ctr,
            //    receivableid,
            //    grandtotal,
            //    0,
            //    client,
            //    receivableid,
            //    clientid]).draw();//AR
            //ctr++;
            //dataTableLedger.row.add([ctr,
            //    taxid,
            //    0,
            //    tax,
            //    '',
            //    taxid,
            //    0]).draw();//Tax
            //ctr++;

            //AR
            if (receivableid > 0 && grandtotal > 0) {
                dataTableLedger.row.add([ctr,
                    receivableid,
                    receivableentry === '1' ? grandtotal : 0,
                    receivableentry === '2' ? grandtotal : 0,
                    client,
                    receivableid,
                    clientid]).draw();
                ctr++;
            }
            //AR

            //Sales
            if (salesid > 0 && nettotal > 0) {
                dataTableLedger.row.add([ctr,
                    salesid,
                    salesentry === '1' ? nettotal : 0,
                    salesentry === '2' ? nettotal : 0,
                    '',
                    salesid,
                    0]).draw();//Tax
                ctr++;
            }
            //Sales

            //Tax
            if (taxid > 0 && tax > 0) {
                dataTableLedger.row.add([ctr,
                    taxid,
                    taxentry === '1' ? tax : 0,
                    taxentry === '2' ? tax : 0,
                    '',
                    taxid,
                    0]).draw();//Tax
                ctr++;
            }
            //Tax

            //var table = _$itemsTable.DataTable();
            //var form_data = table.rows().data();
            //var f = form_data;

            //for (var i = 0; f.length > i; i++) {
            //    var snettotal = 0;
            //    var stax = 0;
            //    var subtotal = f[i][5];
            //    var expenseid = f[i][17];
            //    var inventoryid = f[i][18];
            //    var incomeid = f[i][19];

            //    var taxcode = $("#TaxTypes option:selected").data('code');
            //    var taxrate = $("#TaxTypes option:selected").data('rate');

            //    if (taxcode === 101) {
            //        snettotal = subtotal / taxrate;
            //        stax = nettotal * (taxrate - 1);
            //    }
            //    else if (taxcode === 104) {
            //        snettotal = subtotal;
            //        stax = snettotal * (taxrate - 1);
            //        subtotal = snettotal * taxrate;
            //    }
            //    else {
            //        snettotal = subtotal;
            //        stax = 0;
            //    }

            //    if (incomeid > 0 && subtotal > 0) {

            //        var retindex = getledgerdup(incomeid);
            //        if (retindex === 0) {
            //            dataTableLedger.row.add([ctr,
            //                incomeid,
            //                0,
            //                snettotal,
            //                '',
            //                incomeid,
            //                0]).draw();//Income
            //            ctr++;
            //        }
            //        else {
            //            var table2 = _$ledgerTable.DataTable();
            //            var temp2 = table2.row(retindex).data();
            //            var temp2value = temp2[3];
            //            //var ccredit = parseFloat(temp2value);
            //            var ccredit = parseFloat(temp2value.replace(/,/g, ''));
            //            var newcredit = ccredit + snettotal;
            //            temp2[3] = newcredit;
            //            $('#LedgerTable').dataTable().fnUpdate(temp2, retindex, undefined, false);
            //        }
            //    }
            //}

            //MULTIPLE SI
            //var tablecharges = _$chargesTable.DataTable();
            var tablecharges = _$chargesTable2.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {
                var revenueid = h[k][7];
                //MULTIPLE SI
                //var totalamount = h[k][4];
                var totalamount = h[k][12];

                if (revenueid > 0 && totalamount > 0) {
                    //dataTableLedger.row.add([ctr,
                    //    revenueid,
                    //    0,
                    //    totalamount,
                    //    '',
                    //    revenueid,
                    //    0]).draw();//Income
                    //ctr++;

                    var retindex = getledgerdup(revenueid);
                    if (retindex === 0) {
                        dataTableLedger.row.add([ctr,
                            revenueid,
                            0,
                            totalamount,
                            '',
                            revenueid,
                            0]).draw();//Income
                        ctr++;
                    }
                    else {
                        var table2 = _$ledgerTable.DataTable();
                        var temp2 = table2.row(retindex).data();
                        var temp2value = temp2[3];
                        //var ccredit = parseFloat(temp2value);
                        var ccredit = parseFloat(temp2value.toString().replace(/,/g, ''));
                        var newcredit = ccredit + parseFloat(totalamount.replace(/,/g, ''));
                        temp2[3] = newcredit;
                        $('#LedgerTable').dataTable().fnUpdate(temp2, retindex, undefined, false);
                    }
                }
            }
        }

        function generateReverseLedger() {
            //MULTIPLE SI
            var otherdiscount = parseFloat($('#BillDiscountTotal').val().replace(/,/g, ''));
            var nettotal = parseFloat($('#BillNetTotal').val().replace(/,/g, ''));
            var tax = parseFloat($('#BillTax').val().replace(/,/g, ''));
            var total = parseFloat($('#BillTotal').val().replace(/,/g, ''));
            var chargetotal = parseFloat($('#BillChargesTotal').val().replace(/,/g, ''));
            var grandtotal = parseFloat($('#BillGrandTotal').val().replace(/,/g, ''));
            //MULTIPLE SI

            var salesid = $('#SalesAccountId').val();
            var discountid = $('#DiscountAccountId').val();
            var returnid = $('#ReturnAccountId').val();
            var taxid = $('#TaxAccountId').val();
            var receivableid = $('#ReceivableAccountId').val();

            var salesentry = $('#SalesAccountEntry').val() + '';
            var discountentry = $('#DiscountAccountEntry').val() + '';
            var returnentry = $('#ReturnAccountEntry').val() + '';
            var taxentry = $('#TaxAccountEntry').val() + '';
            var receivableentry = $('#ReceivableAccountEntry').val() + '';

            var clientid = $('#ClientId').val();
            var client = $('#ClientName').val();

            dataTableLedger.clear().draw();

            var ctr = 1;

            //AR
            if (receivableid > 0 && grandtotal > 0) {
                dataTableLedger.row.add([ctr,
                    receivableid,
                    receivableentry === '2' ? grandtotal : 0,
                    receivableentry === '1' ? grandtotal : 0,
                    client,
                    receivableid,
                    clientid]).draw();
                ctr++;
            }
            //AR

            //Sales
            if (salesid > 0 && nettotal > 0) {
                dataTableLedger.row.add([ctr,
                    salesid,
                    salesentry === '2' ? nettotal : 0,
                    salesentry === '1' ? nettotal : 0,
                    '',
                    salesid,
                    0]).draw();//Tax
                ctr++;
            }
            //Sales

            //Tax
            if (taxid > 0 && tax > 0) {
                dataTableLedger.row.add([ctr,
                    taxid,
                    taxentry === '2' ? tax : 0,
                    taxentry === '1' ? tax : 0,
                    '',
                    taxid,
                    0]).draw();//Tax
                ctr++;
            }
            //Tax

            //MULTIPLE SI
            //var tablecharges = _$chargesTable.DataTable();
            var tablecharges = _$chargesTable2.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {
                var revenueid = h[k][7];
                //MULTIPLE SI
                //var totalamount = h[k][4];
                var totalamount = h[k][12];

                if (revenueid > 0 && totalamount > 0) {

                    var retindex = getledgerdup(revenueid);
                    if (retindex === 0) {
                        dataTableLedger.row.add([ctr,
                            revenueid,
                            totalamount,
                            0,
                            '',
                            revenueid,
                            0]).draw();//Income
                        ctr++;
                    }
                    else {
                        var table2 = _$ledgerTable.DataTable();
                        var temp2 = table2.row(retindex).data();
                        var temp2value = temp2[2];
                        //var ccredit = parseFloat(temp2value);
                        var ddebit = parseFloat(temp2value.toString().replace(/,/g, ''));
                        var newdebit = ddebit + parseFloat(totalamount.replace(/,/g, ''));
                        temp2[2] = newdebit;
                        $('#LedgerTable').dataTable().fnUpdate(temp2, retindex, undefined, false);
                    }
                }
            }
        }

        function getledgerdup(accountid) {
            var tableledger = _$ledgerTable.DataTable();
            var form_dataledgers = tableledger.rows().data();
            var h = form_dataledgers;
            for (var k = 0; h.length > k; k++) {
                var revenueid = h[k][5];
                if (revenueid === accountid) {
                    return k;
                }
            }
            return 0;
        }

        function save(statusid) {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            if (statusid === '2') {
                generateLedger();
            }
            else if (statusid == '5') {
                generateReverseLedger();
            }

            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var viewData = {
                salesinvoice: {
                    "id": formdata.Id,
                    "code": formdata.Code,
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": formdata.Prefix,
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "clientOrderNo": formdata.ClientOrderNo,
                    "salesOrderId": formdata.SalesOrderId,
                    "orderTypeId": formdata.OrderTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "notes": formdata.Notes,
                    //"statusId": 2,
                    "statusId": statusid,
                    "taxTypeId": formdata.TaxTypeId,
                    "paymentTermId": formdata.PaymentTermId,
                    "deliveryTypeId": formdata.DeliveryTypeId,
                    //MARC multiselect 08262022
                    //"warrantyTypeId": formdata.WarrantyTypeId,
                    "warrantyTypeId": String($("#WarrantyTypes").val()),
                    //END MARC multiselect 08262022
                    "subTotal": formdata.Total,
                    "otherDiscount": formdata.DiscountTotal,
                    "otherCharges": formdata.ChargesTotal,
                    "netTotal": formdata.NetTotal,
                    "taxRate": $("#TaxTypes option:selected").data('rate'),
                    "tax": formdata.Tax,
                    "grandTotal": formdata.GrandTotal,
                    "taxAccountId": formdata.TaxAccountId,
                    "receivableAccountId": formdata.ReceivableAccountId,
                    "cashAccountId": formdata.SalesAccountId,
                    "otherTerms": formdata.OtherTerms
                    //MULTIPLE SI
                    , "lotDescription": formdata.LotDescription
                    , "taxNo": formdata.TaxNo
                    , "businessStyle": formdata.BusinessStyle
                    , "percentage": formdata.Percentage,
                    "billOtherDiscount": formdata.BillDiscountTotal,
                    "billSubTotal": formdata.BillTotal,
                    "billNetTotal": formdata.BillNetTotal,
                    "billTax": formdata.BillTax,
                    "billOtherCharges": formdata.BillChargesTotal,
                    "billGrandTotal": formdata.BillGrandTotal
                },
                salesinvoiceitems: [],
                salesinvoicecharges: [],
                generalledger: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            //jsonObj = [];
            for (var i = 0; f.length > i; i++) {
                item = {};
                item["Id"] = f[i][20];
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022
                item["SalesInvoiceId"] = "0";
                item["ProductId"] = f[i][7];
                item["Description"] = f[i][8];
                item["OrderQty"] = f[i][9];
                item["UnitId"] = f[i][10];
                item["UnitPrice"] = f[i][3];
                item["Disc1"] = f[i][11];
                item["DiscType1"] = f[i][12];
                item["Disc2"] = f[i][13];
                item["DiscType2"] = f[i][14];
                item["Disc3"] = f[i][15];
                item["DiscType3"] = f[i][16];
                item["DiscTotal"] = f[i][4];
                item["Total"] = f[i][5];
                item["ExpenseAccountId"] = f[i][17];
                item["InventoryAccountId"] = f[i][18];
                item["IncomeAccountId"] = f[i][19];
                item["Color"] = f[i][21];
                viewData.salesinvoiceitems.push(item);
            }

            //sales order items
            var tabledeleted = _$itemsTableDeleted.DataTable();
            var form_deleteddata = tabledeleted.rows().data();
            var g = form_deleteddata;
            //jsonObj = [];
            for (var j = 0; g.length > j; j++) {
                item = {};
                item["Id"] = g[j][20];
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = g[j][0];
                //MARC IndexNo for arrangement fix 09132022
                item["SalesInvoiceId"] = "0";
                item["ProductId"] = g[j][7];
                item["Description"] = g[j][8];
                item["OrderQty"] = g[j][9];
                item["UnitId"] = g[j][10];
                item["UnitPrice"] = g[j][3];
                item["Disc1"] = g[j][11];
                item["DiscType1"] = g[j][12];
                item["Disc2"] = g[j][13];
                item["DiscType2"] = g[j][14];
                item["Disc3"] = g[j][15];
                item["DiscType3"] = g[j][16];
                item["DiscTotal"] = g[j][4];
                item["Total"] = g[j][5];
                item["ExpenseAccountId"] = g[j][17];
                item["InventoryAccountId"] = g[j][18];
                item["IncomeAccountId"] = g[j][19];
                item["Color"] = g[j][21];
                item["IsDeleted"] = 1;
                viewData.salesinvoiceitems.push(item);
            }

            //charges
            //MULTIPLE SI
            //var tablecharges = _$chargesTable.DataTable();
            var tablecharges = _$chargesTable2.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;
            for (var k = 0; h.length > k; k++) {

                charge = {};
                charge["SalesInvoiceId"] = "0";
                charge["ChargeTypeId"] = h[k][6];
                charge["Rate"] = h[k][2];
                charge["Amount"] = h[k][3];
                charge["Total"] = h[k][4];
                charge["RevenueAccountId"] = h[k][7];
                //MULTIPLE SI
                charge["BillTotal"] = h[k][12];
                charge["Id"] = h[k][13];//h[k][8];
                viewData.salesinvoicecharges.push(charge);
            }
            //ledger
            var tableledgers = _$ledgerTable.DataTable();
            var form_dataledger = tableledgers.rows().data();
            var x = form_dataledger;

            for (var y = 0; x.length > y; y++) {
                var debit = parseFloat(x[y][2]);
                var credit = parseFloat(x[y][3]);
                ledger = {};
                ledger["TransactionTypeId"] = "0";
                ledger["TransactionId"] = formdata.Id;
                ledger["TransactionCode"] = formdata.Code;
                ledger["TransactionTime"] = formdata.TransactionTime;
                ledger["AccountId"] = x[y][5];
                ledger["Debit"] = x[y][2];
                ledger["Credit"] = x[y][3];
                if (debit > 0) {
                    ledger["BaseTypeId"] = "1";
                }
                else {
                    ledger["BaseTypeId"] = "2";
                }

                ledger["Description"] = "";
                ledger["CenterTypeId"] = "1";
                //ledger["PartyId"] = x[y][6];
                //party id default client for now
                ledger["PartyId"] = formdata.ClientId;
                ledger["ProjectId"] = "0";
                var partyid = x[y][6];
                //if (partyid > 0) {
                //party name and code default transaction client for now
                ledger["PartyName"] = formdata.Client; //x[y][4];
                ledger["PartyCode"] = "105";
                //}
                //else {
                //    ledger["PartyName"] = x[y][4];//"";
                //    ledger["PartyCode"] = "105";
                //}
                ledger["CompanyId"] = formdata.CompanyId;
                viewData.generalledger.push(ledger);
            }

            abp.message.confirm(
                'Sales Invoice will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _salesInvoiceService.updateSalesInvoice(viewData).done(function (result) {
                            if (result === null || result === "0") { return; }
                            abp.message.success('Sales invoice updated', 'Success');
                            getinvoice();
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        $('#PaymentTerms').on('change', function (e) {
            if ($('#PaymentTerms option:selected').text() == "Others") {
                $("#OtherTerms").prop("disabled", false);
                $("#OtherTerms").show();
            }
            else {
                $('#OtherTerms').val("");
                $("#OtherTerms").prop("disabled", true);
                $("#OtherTerms").hide();
            }
        });

        $('#SaveButton').click(function (e) {
            e.preventDefault();
            save('1');
        });

        $('#SubmitButton').click(function (e) {
            e.preventDefault();
            save('2');
        });

        $('#CancelButton').click(function (e) {
            e.preventDefault();
            save('5');
        });

        _$itemsTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$itemsTable.DataTable();
            deleteitem(dtRow[0].rowIndex - 1);
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        // Delete product unit record

        $('#TaxTypes').on('change', function (e) {
            computeTotal();
        });
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            addnewitem();
        });
        //Datatable Add

        //MULTIPLE SI
        $("#Percentage").on('change', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computePercentage(this.value);
        });

        $("#Percentage").on('blur', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computePercentage(this.value);
        });

        function computePercentage(val) {
            val = parseFloat(val.replace(/,/g, ''));
            if (val >= 0) {
                if (val > 100) {
                    val = 100;
                }
                $('#Percentage').val(val);
                var per = val / 100;// parseFloat(this.value.replace(/,/g, '')) / 100;
                var disc = $('#DiscountTotal').val() + '';
                var bdisc = per * parseFloat(disc.replace(/,/g, ''));
                var net = $('#NetTotal').val() + '';
                var bnet = per * parseFloat(net.replace(/,/g, ''));
                var tax = $('#Tax').val() + '';
                var btax = per * parseFloat(tax.replace(/,/g, ''));
                var tot = $('#Total').val() + '';
                var btot = per * parseFloat(tot.replace(/,/g, ''));
                $('#BillDiscountTotal').val(currencyFormat(bdisc));
                $('#BillNetTotal').val(currencyFormat(bnet));
                $('#BillTax').val(currencyFormat(btax));
                $('#BillTotal').val(currencyFormat(btot));

                dataTableCharges2.column(4).data()
                    .each(function (value, index) {
                        var alloc = value + '';
                        var $allocated = parseFloat(alloc.replace(/,/g, ''));

                        var table = _$chargesTable2.DataTable();
                        var temp = table.row(index).data();
                        var unbilled = temp[9] + '';
                        var $unbilled = parseFloat(unbilled.replace(/,/g, ''));

                        var allocatedTotal = per * $allocated;
                        console.log('compute percentage more than ' + allocatedTotal);
                        var strid = '#row-' + index + '-allocated';
                        var strid2 = '#row-' + index + '-balance';
                        var balance = allocatedTotal - $allocated;
                        if (allocatedTotal > $unbilled) {
                            allocatedTotal = $unbilled;
                            balance = allocatedTotal - $unbilled;
                        }
                        else {
                            balance = $unbilled - allocatedTotal;
                        }
                        $(strid).val(currencyFormat(allocatedTotal));
                        $(strid2).val(currencyFormat(balance));

                        temp[10] = '<input id="' + strid2 + '" data-indexno=' + index + ' data-balance=' + $unbilled + ' onkeypress="return decimalOnly(this.id);" disabled class="balance form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat(balance) + '" >';
                        temp[11] = '<input id="' + strid + '" data-indexno=' + index + ' data-balance=' + $unbilled + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat(allocatedTotal) + '" >';
                        temp[12] = allocatedTotal;
                        _$chargesTable2.dataTable().fnUpdate(temp, index, undefined, false);
                        //allocatedTotal = allocatedTotal + $allocated;
                        console.log('allocated ' + index + ' ' + allocatedTotal);
                        console.log('balance ' + index + ' ' + balance);
                    });
                computeTotalBill();
            }
        }

        _$chargesTable2.on('change', '.allocated', function (e) {
            e.preventDefault();
            var $sibalance = '' + $(this).attr("data-balance");

            $sibalance = parseFloat($sibalance.replace(/,/g, ''));

            //var $unallocated = $('#UnAllocatedTotal').val();
            //if ($unallocated === '') {
            //    $unallocated = 0;
            //}
            //else {
            //    $unallocated = parseFloat($unallocated.replace(/,/g, ''));
            //}

            var $amount = $(this).val();
            var $balance = 0;
            var $indexno = $(this).attr("data-indexno");
            var strid = 'row-' + $indexno + '-allocated';
            var strid2 = 'row-' + $indexno + '-balance';
            if ($amount === '') {
                $amount = 0;
            }
            else {
                $amount = parseFloat($amount.replace(/,/g, ''));
            }

            if ($amount > $sibalance) {
                $amount = $sibalance;
                $balance = $amount - $sibalance;
            }
            else {
                $balance = $sibalance - $amount;
                console.log('else ' + $balance)
            }

            //if ($amount > $unallocated) {
            //    $amount = $unallocated;
            //}

            //$bala

            var table = _$chargesTable2.DataTable();
            var temp = table.row($indexno).data();
            temp[10] = '<input id="' + strid2 + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" disabled class="balance form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($balance) + '" >';
            temp[11] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($amount) + '" >';
            temp[12] = $amount;
            _$chargesTable2.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeTotalBill();
        });

        $("#BillDiscountTotal").on('change', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computeTotalBill();
        });

        $("#BillDiscountTotal").on('blur', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computeTotalBill();
        });

        $("#BillTax").on('change', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computeTotalBill();
        });

        $("#BillTax").on('blur', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computeTotalBill();
        });

        $("#BillNetTotal").on('change', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computeTotalBill();
        });

        $("#BillNetTotal").on('blur', function (event) {
            //this.value = this.value.toUpperCase();
            //console.log(decimalOnly(this));
            computeTotalBill();
        });

        function computeTotalBill() {
            console.log('computetotalbill');
            var grandtotal = parseFloat($('#BillTotal').val().replace(/,/g, ''));
            var discounttotal = parseFloat($('#BillDiscountTotal').val().replace(/,/g, ''));
            var chargestotal = 0; //$('#ChargesTotal').val();
            var taxrate = 0;
            var tax = parseFloat($('#BillTax').val().replace(/,/g, ''));
            var taxcode = 101;
            var nettotal = parseFloat($('#BillNetTotal').val().replace(/,/g, ''));

            var btotal = parseFloat($('#BalTotal').val().replace(/,/g, ''));
            var bdisc = parseFloat($('#BalDiscountTotal').val().replace(/,/g, ''));
            var bcharge = 0; //$('#ChargesTotal').val();
            var btax = parseFloat($('#BalTax').val().replace(/,/g, ''));
            var bnettotal = parseFloat($('#BalNetTotal').val().replace(/,/g, ''));

            var sototal = parseFloat($('#BdTotal').val().replace(/,/g, ''));
            var sodisc = parseFloat($('#BdDiscountTotal').val().replace(/,/g, ''));
            var socharge = 0; //$('#ChargesTotal').val();
            var sotax = parseFloat($('#BdTax').val().replace(/,/g, ''));
            var sonettotal = parseFloat($('#BdNetTotal').val().replace(/,/g, ''));

            //disc
            if (discounttotal > sodisc) {
                discounttotal = sodisc;
                bdisc = discounttotal - sodisc;
            }
            else {
                bdisc = sodisc - discounttotal;
            }
            //tax
            if (tax > sotax) {
                tax = sotax;
                btax = tax - sotax;
            }
            else {
                btax = sotax - tax;
            }
            //net
            if (nettotal > sonettotal) {
                nettotal = sonettotal;
                bnettotal = nettotal - sonettotal;
            }
            else {
                bnettotal = sonettotal - nettotal;
            }
            //sub
            if (grandtotal > sototal) {
                grandtotal = sototal;
                btotal = grandtotal - sototal;
            }
            else {
                btotal = sototal - grandtotal;
            }

            dataTableCharges2.column(12).data()
                .each(function (value, index) {
                    var $chargestotal = parseFloat(value);
                    chargestotal = chargestotal + $chargestotal;
                });

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
            grandtotal = nettotal + tax;
            var newgrandtotal = grandtotal + chargestotal;
            console.log('computebill ' + newgrandtotal);

            $('#BalDiscountTotal').val(currencyFormat(bdisc));
            $('#BalNetTotal').val(currencyFormat(bnettotal));
            $('#BalTax').val(currencyFormat(btax));
            $('#BalTotal').val(currencyFormat(btotal));

            $('#BillDiscountTotal').val(currencyFormat(discounttotal));
            $('#BillNetTotal').val(currencyFormat(nettotal));
            $('#BillTax').val(currencyFormat(tax));
            $('#BillTotal').val(currencyFormat(grandtotal));
            $('#BillChargesTotal').val(currencyFormat(chargestotal));
            $('#BillGrandTotal').val(currencyFormat(newgrandtotal));
        }
        //MULTIPLE SI

        //Print
        function printPreviewActual(asLot) {
            var trackingNo = $('#TransportReceiptNo').val();
            var code = $('#Code').val();
            //var quotationcode = $('#SalesOrderCode').val();
            var refNo = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var tin = $('#TaxNo').val();
            var bsstyle = $('#BusinessStyle').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            notes = notes.length > 0 ? '***' + notes + '***' : notes;
            var lotdesc = $('#LotDescription').val();
            var contactNo = $('#ContactNo').val();
            var pono = $('#ClientOrderNo').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentmobile = $('#ContactNo').val();
            var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#ClientAddress').val();
            var transdate = $('#TransactionTime').val();
            var subtotal = $('#Total').val();
            var bsubtotal = $('#BillTotal').val();
            var nettotal = $('#NetTotal').val();
            var discounttotal = $('#DiscountTotal').val();
            var bdiscounttotal = $('#BillDiscountTotal').val();
            var tax = $('#Tax').val();
            var btax = $('#BillTax').val();
            var grandtotal = $('#GrandTotal').val();

            var $taxTypes = $('#TaxTypes').val();
            var bgrandtotal = $('#BillGrandTotal').val();
            var bnettotal = $('#BillNetTotal').val();


            var pctg = $('#Percentage').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");
            var termname = $("#ContactPersons option:selected").html();
            var termsandconditions = $('#TermsAndConditions').val();

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //win.document.write('<html><head><title>' + code + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            //win.document.write('<html><head><title>' + code + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="print" asp-append-version="true" /><style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } html, body, table { font-family:"Consolas"; font-size: 20px; } table .address { font-size:16px; } #content-main { height: 11in; margin: 0; margin-top:2in; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } .xfooter {width: 100%; position: absolute; height:5.5in; bottom: 0; margin-left:15px;  }</style></head><body>');
            win.document.write('<html><head><title>' + code + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'fonts/roboto/roboto.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><style></style></head><body style="font-family:fake_receiptregular" >');

            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row" hidden>');
            win.document.write('<div  class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 350px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:11px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="12%"></th>');
            win.document.write('<th width="35%"></th>');
            win.document.write('<th width="18%"></th>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="20%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');
            win.document.write('<tr>');
            win.document.write('<td style="color:white">&nbsp;</td>');//To
            win.document.write('<td colspan=2 class=">&nbsp;</td>');
            //win.document.write('<td class="text-right">' + code + '</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td colspan=2 class="">' + clientname + '</td>');
            win.document.write('<td class="text-right" style="font-color:white">&nbsp;</td>'); //Ref</td>');
            win.document.write('<td class="text-right ">' + transdate + '</td>');//' + refNo + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td></td>');
            win.document.write('<td colspan=2 class=" address">' + clientaddress + '</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td></td>');
            win.document.write('<td style="font-size:19px;">' + bsstyle + '</td>');
            win.document.write('<td class=" text-left si-number" style="font-size:18!important;">' + tin + '</td>'); //updated by wilson pina liitan ni sir John
            win.document.write('<td class="">&nbsp;</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=5><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td></td>');
            win.document.write('<td class="si-number">' + pono + '</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=5><br/></td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td>Delivery Address</td>');
            //win.document.write('<td class="text-mute" style="font-size:11px;">' + clientaddress + '</td>');
            ////win.document.write('<td class="text-right">TEL No</td>');
            ////win.document.write('<td class="text-right">' + clienttelephone + '</td>');
            //win.document.write('</tr>');


            win.document.write('</tbody>');

            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');


            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row" class="text-center "><br/></td>');
            //win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center "><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center "><br/></td>');
            win.document.write('</tr>');

            if (parseFloat(pctg) < 100) {
                win.document.write('<tr>');
                //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td scope="row" class=" text-center"><span class="si-number">' + parseFloat(pctg).toFixed(2) + '</span>% PARTIAL PAYMENT</td>');
                //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                //win.document.write('<td class=" text-right">&nbsp;</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr>');
                //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td scope="row" class=" text-center">FULL PAYMENT</td>');
                //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                //win.document.write('<td class=" text-right">&nbsp;</td>');
                win.document.write('</tr>');
            }

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            // Header

            // Body
            if (asLot === 0) {
                win.document.write(divToPrint.outerHTML);
            }
            else {
                win.document.write('<table class="display table dt-responsive nowrap" width="100%" > ');

                win.document.write('<thead>');
                win.document.write('<tr>');
                win.document.write('<th width="10%">QTY</th>');
                win.document.write('<th width="10%">UNIT</th>');
                win.document.write('<th class="text-center" width="45%">DESCRIPTION</th>');
                win.document.write('<th class="text-right" width="15%">UNIT PRICE</th>');
                win.document.write('<th class="text-right" width="20%">TOTAL</th>');
                win.document.write('</tr>');
                win.document.write('</thead>');

                win.document.write('<tr>');
                win.document.write('<td><span class="">1</span></td>');
                win.document.write('<td><span class="">Lot</span></td>');
                win.document.write('<td class=" text-center"><span class="">' + lotdesc + '</span></td>');
                win.document.write('<td class=" text-right si-number">' + nettotal + '</td>');
                win.document.write('<td class=" text-right si-number">' + nettotal + '</td>');
                win.document.write('</tr>');

                win.document.write('</tbody>');
                win.document.write('</table >');
            }
            // Body

            //var tablecharges = _$chargesTable.DataTable();
            var tablecharges = _$chargesTable2.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            var $taxtypeid = $('#TaxTypes').val();

            taxcode = $("#TaxTypes option:selected").data('code');
            taxrate = $("#TaxTypes option:selected").data('rate');
            var ratepercent = (taxrate - 1) * 100;

            var baltotal = parseFloat($('#BalTotal').val().replace(/,/g, ''));
            var cbal = 0;
            var billedtotal = parseFloat($('#BilledAmount').val().replace(/,/g, ''));

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="350%" style="width: 350px;"></th>');
            win.document.write('<th width="15%" style="width: 15px;"></th>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center "><br/></td>');
            win.document.write('</tr>');
            //if (taxcode === 101) {

            if (parseFloat(tax) > 0) {
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center"><span class="si-number">' + ratepercent.toFixed(0) + '</span>% VAT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right si-number">' + tax + '</td>');
                win.document.write('</tr>');
            }
            // }
            //else if (taxcode === 104) {
            //win.document.write('<tr>');
            //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
            //win.document.write('<td class=" text-center">LESS' + ratepercent.toFixed(0) + '% VAT</td>');
            //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
            //win.document.write('<td class=" text-right">' + tax + '</td>');
            //}

            //for (var k = 0; h.length > k; k++) {
            //    var sqiprice = parseFloat(h[k][4]);
            //    //var sqiprice = parseFloat(h[k][12]);
            //    console.log($('#row-'+k+'-balance').val());
            //    cbal += parseFloat($('#row-' + k + '-balance').val().replace(/,/g, ''));
            //    win.document.write('<tr>');
            //    win.document.write('<td colspan=2 class=" text-right"></td>');
            //    win.document.write('<td class=" text-center text-danger">' + h[k][1] + '</td>');
            //    win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
            //    win.document.write('<td class=" text-right text-danger">' + currencyFormat(sqiprice) + '</td>');
            //    win.document.write('</tr>');
            //}
            if (h.length > 0) {
                var charges = 0;
                for (var k = 0; h.length > k; k++) {
                    var sqiprice = parseFloat(h[k][4]);
                    //var sqiprice = parseFloat(h[k][12]);
                    console.log($('#row-' + k + '-balance').val());
                    cbal += parseFloat($('#row-' + k + '-balance').val().replace(/,/g, ''));

                    charges += sqiprice;
                }
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right"></td>');
                win.document.write('<td class=" text-center text-danger">Other Charges</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right text-danger si-number">' + currencyFormat(charges) + '</td>');
                win.document.write('</tr>');
            }
            baltotal += cbal;

            if (grandtotal === bgrandtotal) {
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center">GRAND NET AMOUNT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');//VAT
                win.document.write('<td class=" text-right si-number">' + grandtotal + '</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center">TOTAL AMOUNT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right si-number">' + grandtotal + '</td>');
                win.document.write('</tr>');
                if (baltotal > 0) {
                    win.document.write('<tr>');
                    win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                    win.document.write('<td class=" text-center">' + 'BALANCE' + '</td>');
                    win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                    win.document.write('<td class=" text-right si-number">' + currencyFormat(baltotal) + '</td>');
                    win.document.write('</tr>');
                }
                //else {
                if (billedtotal > 0) {
                    win.document.write('<tr>');
                    win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                    win.document.write('<td class=" text-center">' + 'LESS PREV BILLING' + '</td>');
                    win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                    win.document.write('<td class=" text-right si-number">' + currencyFormat(billedtotal) + '</td>');
                    win.document.write('</tr>');
                }
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center">GRAND NET AMOUNT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right si-number">' + bgrandtotal + '</td>');
                win.document.write('</tr>');
                //}
            }

            win.document.write('<tr>');
            win.document.write('<td colspan=5 class=" text-center">*******************************************************************</td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=5 class=" text-center" style="font-family: Times New Roman;">Times New Roman</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=5 class=" text-center" style="font-family: Sans-Serif;">Sans-Serif</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=5 class=" text-center" style="font-family: Helvetica;">Helvetica</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=5 class=" text-center" style="font-family: Roboto;">Roboto</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=5 class=" text-center" style="font-family: fake_receiptregular;">Fake Receipt</td>');
            //win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            // Footer


            //TOTAL
            win.document.write('<div class="xfooter">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="200%" style="width: 200px;"></th>');
            win.document.write('<th width="10%" style="width: 10px;"></th>');
            win.document.write('<th width="10%" style="width: 10px;"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr style="height: 45px;">');
            win.document.write('<td colspan=5 class=" text-center">' + notes + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr style="height: 40px;">');
            win.document.write('<td colspan=3 class=" text-right"></td>');
            win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');//TOTAL SALES

            if ($taxTypes != 3) {
                win.document.write('<td class=" text-right si-number">' + bgrandtotal + '</td>');//update by wilson pag zero rated this must be hide  as of sir John
            }
            else {
                win.document.write('<td class=" text-right si-number"></td>');//update by wilson pag zero rated this must be hide as of sir John
            }

            win.document.write('</tr>');

            win.document.write('<tr style="height: 40px;">');
            win.document.write('<td colspan=3 class=" text-right"></td>');
            win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>'); //VAT
            if (parseFloat(btax.replace(/,/g, ''))) {
                win.document.write('<td class=" text-right si-number">' + btax + '</td>');
            }
            else {
                win.document.write('<td class=" text-right">&nbsp;</td>');
            }
            win.document.write('</tr>');

            win.document.write('<tr style="height: 38px;">');
            win.document.write('<td colspan=3 class=" text-right si-number">' + bnettotal + '</td>');
            win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>'); //NET OF VAT
            if ($taxTypes != 3) {
                win.document.write('<td class=" text-right si-number">' + bnettotal + '</td>');//update by wilson pag zero rated this must be hide  as of sir John
            }
            else {
                win.document.write('<td class=" text-right si-number"></td>');//update by wilson pag zero rated this must be hide as of sir John
            }
            win.document.write('</tr>');

            win.document.write('<tr style="height: 37px;">');
            win.document.write('<td colspan=5 class=" text-right">&nbsp;</td>');
            win.document.write('</tr>');

            if (h.length > 0) {
                var charges = 0;
                for (var k = 0; h.length > k; k++) {
                    //if (k === 0) {
                    //    win.document.write('<tr>');
                    //    win.document.write('<td colspan=3 class=" text-right"></td>');
                    //    win.document.write('<td class=" text-right"></td>');
                    //    win.document.write('<td class=" text-right">' + bsubtotal + '</td>');
                    //    win.document.write('</tr>');
                    //}
                    //var sqiprice = parseFloat(h[k][4]);
                    var sqiprice = parseFloat(h[k][12]);

                    //win.document.write('<tr style="height: 45px;">');
                    //win.document.write('<td colspan=3 class=" text-right"></td>');
                    //win.document.write('<td class=" text-right text-danger">' + h[k][1] + '</td>');
                    //win.document.write('<td class=" text-right text-danger">' + currencyFormat(sqiprice) + '</td>');
                    //win.document.write('</tr>');
                    charges += sqiprice;
                }

                win.document.write('<tr style="height: 38px;">');
                win.document.write('<td colspan=3 class=" text-right"></td>');
                win.document.write('<td class=" text-right text-danger">Other Charges</td>');
                win.document.write('<td class=" text-right text-danger si-number">' + currencyFormat(charges) + '</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr style="height: 37px;">');
                win.document.write('<td colspan=5 class=" text-right">&nbsp;</td>');
                win.document.write('</tr>');
            }

            win.document.write('<tr style="height: 38px;">');
            if (parseFloat(btax.replace(/,/g, ''))) {
                win.document.write('<td colspan=3 class=" text-right si-number">' + btax + '</td>');
            }
            else {
                win.document.write('<td colspan=3 class=" text-right">&nbsp;</td>');
            }
            win.document.write('<td colspan=2 class=" text-right">&nbsp;</td>');
            win.document.write('</tr>');

            win.document.write('<tr style="height: 37px;">');
            win.document.write('<td colspan=3 class=" text-right"></td>');
            win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');//TOTAL AMOUNT DUE
            win.document.write('<td class=" text-right si-number" style="border-top:solid; border-bottom:solid">' + bgrandtotal + '</td>');
            win.document.write('</tr>');

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

        //Print SOA
        function printPreviewSOA(asLot) {
            var trackingNo = $('#TransportReceiptNo').val();
            var code = $('#Code').val();
            //var quotationcode = $('#SalesOrderCode').val();
            var refNo = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var tin = $('#TaxNo').val();
            var bsstyle = $('#BusinessStyle').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            notes = notes.length > 0 ? '***' + notes + '***' : notes;
            var lotdesc = $('#LotDescription').val();
            var contactNo = $('#ContactNo').val();
            var pono = $('#ClientOrderNo').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentmobile = $('#ContactNo').val();
            var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#DeliveryAddress').val();
            var transdate = $('#TransactionTime').val();
            var subtotal = $('#Total').val();
            var bsubtotal = $('#BillTotal').val();
            var nettotal = $('#NetTotal').val();
            var bnettotal = $('#BillNetTotal').val();
            var discounttotal = $('#DiscountTotal').val();
            var bdiscounttotal = $('#BillDiscountTotal').val();
            var tax = $('#Tax').val();
            var btax = $('#BillTax').val();
            var grandtotal = $('#GrandTotal').val();
            var bgrandtotal = $('#BillGrandTotal').val();
            var pctg = $('#Percentage').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");
            var termname = $("#ContactPersons option:selected").html();
            var termsandconditions = $('#TermsAndConditions').val();

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //win.document.write('<html><head><title>' + code + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            //win.document.write('<html><head><title>' + code + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } @media print { html, body, table { font-family: "Consolas"; font-size: 20px; } table .address { font-size: 16px;} } html, body, table { font-family: "Consolas"; font-size: 20px; } table .address { font-size: 16px;} #content-main { height: 11in; margin: 0; margin-top:3.25in; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } .xfooter {width: 100%; position: absolute; height:3in; bottom: 0; margin-left:15px; }</style></head><body>');
            win.document.write('<html><head><title>' + code + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'fonts/roboto/roboto.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/soa.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><style></style></head><body style="font-family:fake_receiptregular">');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row" hidden>');
            win.document.write('<div  class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 350px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:11px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="35%"></th>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="20%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');
            win.document.write('<tr>');
            win.document.write('<td style="color:white">&nbsp;</td>');//To
            win.document.write('<td colspan=2 class="">&nbsp;</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');//' + code + '
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td colspan=2 class="">' + clientname + '</td>');
            win.document.write('<td class="text-right" style="font-color:white">&nbsp;</td>'); //Ref</td>');//Date
            win.document.write('<td class="text-right">' + transdate + '</td>');//' + refNo + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td></td>');
            win.document.write('<td colspan=2 class=" address">' + clientaddress + '</td>');
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('<td class="text-right si-number">' + pono + '</td>');
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
            win.document.write('<th width="35%"></th>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="50%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td colspan=5 class="text-right"><br /></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=2 class=" si-number" style="padding-left:220px;">' + bgrandtotal + '</td>');
            win.document.write('<td style="color:white">&nbsp;</td>');//To
            win.document.write('<td class="text-right">&nbsp;</td>');
            win.document.write('<td class="text-right"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=5 class="text-right"><br /></td>');
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
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center ">&nbsp;</td>');
            win.document.write('</tr>');

            if (parseFloat(pctg) < 100) {
                win.document.write('<tr>');
                //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td scope="row" class=" text-center"><span class="si-number">' + parseFloat(pctg).toFixed(2) + '</span>% PARTIAL PAYMENT</td>');
                //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                //win.document.write('<td class=" text-right">&nbsp;</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr>');
                //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td scope="row" class=" text-center">FULL PAYMENT</td>');
                //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                //win.document.write('<td class=" text-right">&nbsp;</td>');
                win.document.write('</tr>');
            }

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            // Header

            // Body
            if (asLot === 0) {
                win.document.write(divToPrint.outerHTML);
            }
            else {
                win.document.write('<table class="display table dt-responsive nowrap" width="100%">');

                win.document.write('<thead>');
                win.document.write('<tr>');
                win.document.write('<th width="10%">QTY</th>');
                win.document.write('<th width="10%">UNIT</th>');
                win.document.write('<th class="text-center" width="45%">DESCRIPTION</th>');
                win.document.write('<th class="text-right" width="15%">UNIT PRICE</th>');
                win.document.write('<th class="text-right" width="20%">TOTAL</th>');
                win.document.write('</tr>');
                win.document.write('</thead>');

                win.document.write('<tr>');
                win.document.write('<td><span class="si-number">1</span></td>');
                win.document.write('<td><span class="">Lot</span></td>');
                win.document.write('<td class=" text-center"><span >' + lotdesc + '</span></td>');
                win.document.write('<td class=" text-right si-number">' + nettotal + '</td>');
                win.document.write('<td class=" text-right si-number">' + nettotal + '</td>');
                win.document.write('</tr>');

                win.document.write('</tbody>');
                win.document.write('</table >');
            }
            // Body

            //var tablecharges = _$chargesTable.DataTable();
            var tablecharges = _$chargesTable2.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            var $taxtypeid = $('#TaxTypes').val();

            taxcode = $("#TaxTypes option:selected").data('code');
            taxrate = $("#TaxTypes option:selected").data('rate');
            var ratepercent = (taxrate - 1) * 100;

            var baltotal = parseFloat($('#BalTotal').val().replace(/,/g, ''));
            var cbal = 0;
            var billedtotal = parseFloat($('#BilledAmount').val().replace(/,/g, ''));

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="200%" style="width: 350px;"></th>');
            win.document.write('<th width="10%" style="width: 15px;"></th>');
            win.document.write('<th width="10%" style="width: 15px;"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center "><br/></td>');
            win.document.write('</tr>');
            //if (taxcode === 101) {
           

            if (parseFloat(tax) > 0) {
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center"><span class="si-number">' + ratepercent.toFixed(0) + '</span>% VAT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right si-number">' + tax + '</td>');
                win.document.write('</tr>');
            }
            //win.document.write('<tr>');
            //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
            //win.document.write('<td class=" text-center">' + ratepercent.toFixed(0) + '% VAT</td>');
            //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
            //win.document.write('<td class=" text-right">' + tax + '</td>');
            //win.document.write('</tr>');
            // }
            //else if (taxcode === 104) {
            //win.document.write('<tr>');
            //win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
            //win.document.write('<td class=" text-center">LESS' + ratepercent.toFixed(0) + '% VAT</td>');
            //win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
            //win.document.write('<td class=" text-right">' + tax + '</td>');
            //}
            if (h.length > 0) {
                var charges = 0;
                for (var k = 0; h.length > k; k++) {
                    var sqiprice = parseFloat(h[k][4]);
                    //var sqiprice = parseFloat(h[k][12]);
                    console.log($('#row-' + k + '-balance').val());
                    cbal += parseFloat($('#row-' + k + '-balance').val().replace(/,/g, ''));

                    charges += sqiprice;
                }
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right"></td>');
                win.document.write('<td class=" text-center text-danger">Other Charges</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right text-danger si-number">' + currencyFormat(charges) + '</td>');
                win.document.write('</tr>');
            }
            baltotal += cbal;

            if (grandtotal === bgrandtotal) {
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center">GRAND NET AMOUNT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');//VAT
                win.document.write('<td class=" text-right si-number">' + grandtotal + '</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center">TOTAL AMOUNT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right si-number">' + grandtotal + '</td>');
                win.document.write('</tr>');
                if (baltotal > 0) {
                    win.document.write('<tr>');
                    win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                    win.document.write('<td class=" text-center">' + 'BALANCE' + '</td>');
                    win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                    win.document.write('<td class=" text-right si-number">' + currencyFormat(baltotal) + '</td>');
                    win.document.write('</tr>');
                }
                //else {
                if (billedtotal > 0) {
                    win.document.write('<tr>');
                    win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                    win.document.write('<td class=" text-center">' + 'LESS PREV BILLING' + '</td>');
                    win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                    win.document.write('<td class=" text-right si-number">' + currencyFormat(billedtotal) + '</td>');
                    win.document.write('</tr>');
                }
                win.document.write('<tr>');
                win.document.write('<td colspan=2 class=" text-right" style="color:white"></td>');
                win.document.write('<td class=" text-center">GRAND NET AMOUNT</td>');
                win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');
                win.document.write('<td class=" text-right si-number">' + bgrandtotal + '</td>');
                win.document.write('</tr>');
                //}
            }

            win.document.write('<tr>');
            win.document.write('<td colspan=5 class=" text-center">*******************************************************************</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            // Footer


            //TOTAL
            win.document.write('<div class="xfooter">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="5%" style="width: 5px;"></th>');
            win.document.write('<th width="200%" style="width: 200px;"></th>');
            win.document.write('<th width="10%" style="width: 10px;"></th>');
            win.document.write('<th width="10%" style="width: 10px;"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            //win.document.write('<td class=" text-right"></td>');
            win.document.write('<td colspan=5 class=" text-center" style="font-size:20px">' + notes + '</td>');
            //win.document.write('<td class=" text-right"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=3 class=" text-right"></td>');
            win.document.write('<td class=" text-right" >&nbsp;</td>');//NET
            win.document.write('<td class=" text-right si-number">' + bnettotal + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=3 class=" text-right"></td>');
            win.document.write('<td class=" text-right">&nbsp;</td>'); //VAT
            if (parseFloat(btax.replace(/,/g, '')) > 0) {
                win.document.write('<td class=" text-right si-number">' + btax + '</td>');
            }
            else {
                win.document.write('<td class=" text-right">&nbsp;</td>');
            }
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=3 class=" text-right"></td>');
            //win.document.write('<td class=" text-right">TOTAL SALES</td>');
            //win.document.write('<td class=" text-right">' + grandtotal + '</td>');
            //win.document.write('</tr>');

            //var tablecharges = _$chargesTable.DataTable();
            //var tablecharges = _$chargesTable2.DataTable();
            //var form_datacharges = tablecharges.rows().data();
            //var h = form_datacharges;

            if (h.length > 0) {
                var charges = 0;
                for (var k = 0; h.length > k; k++) {
                    //if (k === 0) {
                    //    win.document.write('<tr>');
                    //    win.document.write('<td colspan=3 class=" text-right"></td>');
                    //    win.document.write('<td class=" text-right">Subtotal</td>');
                    //    win.document.write('<td class=" text-right">' + bsubtotal + '</td>');
                    //    win.document.write('</tr>');
                    //}
                    //var sqiprice = parseFloat(h[k][4]);
                    var sqiprice = parseFloat(h[k][12]);
                    charges += sqiprice;
                }

                win.document.write('<tr>');
                win.document.write('<td colspan=3 class=" text-right"></td>');
                win.document.write('<td class=" text-right text-danger">Other Charges</td>');
                win.document.write('<td class=" text-right text-danger si-number">' + currencyFormat(charges) + '</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr>');
                win.document.write('<td colspan=3 class=" text-right"></td>');
                win.document.write('<td class=" text-right text-danger">&nbsp;</td>');
                win.document.write('<td class=" text-right text-danger">&nbsp;</td>');
                win.document.write('</tr>');
            }

            var bamt = parseFloat(bgrandtotal.replace(/,/g, "")); //- tcredit;
            var b = Math.floor(bamt);
            var bdec = (bamt - b) * 100;
            b = Math.round(bdec) / 100 >= 1 ? b + Math.floor(Math.round(bdec) / 100) : b;
            bdec = Math.round(bdec) / 100 >= 1 ? ((Math.round(bdec) / 100) - Math.floor(bdec)) * 100 : bdec;

            //num.value = b.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00");

            var words = toWords(b) + "and " + (Math.floor(Math.round(bdec)).toString() > 0 ? Math.floor(Math.round(bdec)).toString() < 10 ? "0" + Math.floor(Math.round(bdec)).toString() : Math.floor(Math.round(bdec)).toString() : "00") + "/100 PESOS ONLY";

            win.document.write('<tr>');
            win.document.write('<td >&nbsp;</td>');
            win.document.write('<td colspan=3 class=" text-right">' + words + '</td>');
            win.document.write('<td >&nbsp;</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=5 class=" text-right"><br/></td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td colspan=3 class=" text-right">' + tax + '</td>');
            //win.document.write('<td colspan=2 class=" text-right">&nbsp;</td>');
            //win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan=3 class=" text-right"></td>');
            win.document.write('<td class=" text-right" style="color:white">&nbsp;</td>');//TOTAL AMOUNT DUE
            win.document.write('<td class=" text-right si-number" style="border-top:solid; border-bottom:solid">' + bgrandtotal + '</td>');
            win.document.write('</tr>');

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

        $('#PrintButton').click(function (e) {
            e.preventDefault();
            printPreviewActual(0);
        });

        $('#PrintSOAButton').click(function (e) {
            e.preventDefault();
            printPreviewSOA(0);
        });

        $('#PrintButton2').click(function (e) {
            e.preventDefault();
            printPreviewActual(1);
        });

        $('#PrintSOAButton2').click(function (e) {
            e.preventDefault();
            printPreviewSOA(1);
        });
    });
})();



