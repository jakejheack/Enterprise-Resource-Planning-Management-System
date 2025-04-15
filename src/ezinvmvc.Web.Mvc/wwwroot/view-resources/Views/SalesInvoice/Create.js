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
        $('#OtherTerms').hide();
        function getcompanies() {
            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault === true) {
                        companies.append('<option value=' + result.items[i].id + ' data-bankaccountid=' + result.items[i].bankAccountId + ' data-cashaccountid=' + result.items[i].cashAccountId + ' data-payableaccountid=' + result.items[i].payableAccountId + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-taxaccountid=' + result.items[i].taxAccountId + ' selected>' + result.items[i].name + '</option>');
                        $('#CashAccountId').val(result.items[i].cashAccountId);
                        $('#BankAccountId').val(result.items[i].bankAccountId);
                        $('#TaxAccountId').val(result.items[i].taxAccountId);
                        $('#ReceivableAccountId').val(result.items[i].receivableAccountId);
                        getseriestype(result.items[i].id);
                    }
                    else {
                        companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                companies.selectpicker('refresh');
            });
        }
        getcompanies();
        $('#Companies').on('change', function (e) {
            var bankaccountid = $("#Companies option:selected").data('bankaccountid');
            var cashaccountid = $("#Companies option:selected").data('cashaccountid');
            var payableaccountid = $("#Companies option:selected").data('payableaccountid');
            var receivableaccountid = $("#Companies option:selected").data('receivableaccountid');
            var taxaccountid = $("#Companies option:selected").data('taxaccountid');
            $('#CashAccountId').val(cashaccountid);
            $('#BankAccountId').val(bankaccountid);
            $('#TaxAccountId').val(taxaccountid);
            $('#ReceivableAccountId').val(receivableaccountid);
            getseriestype($('#Companies').val());
        });

        $('#Series').on('change', function (e) {
            getnextseries($('#Series').val());
        });
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
        getordertype();
        getpricingtype();
        getpaymentterm();
        gettaxtype();
        getwarrantytype();
        getdeliverytype();

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
                //$('#ClientAddress').val(result.completeAddress);
                //$('#DeliveryAddress').val(result.address);
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
        var dataTableCharges = _$chargesTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [6, 7]
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
                targets: [2, 3, 6, 7, 12]
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
                targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 5]
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

        function getquotation() {
            abp.ui.setBusy(_$form);
            var $id = $('#SalesOrderId').val();
            _salesOrderService.getSalesOrder({ id: $id }).done(function (result) {
                //console.log(result);
                $('#Companies').val(result.companyId);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#TaxNo').val(result.taxNo);
                $('#BusinessStyle').val(result.businessStyle);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#SalesAgent').val(result.salesAgent);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#ClientOrderNo').val(result.clientOrderNo);
                $('#OtherTerms').val(result.otherTerms);

                var hideterms = $("#OtherTerms").val();
                if (hideterms != "") {
                    $("#OtherTerms").show();
                }
                else {
                    $("#OtherTerms").hide();
                }

                $("#OtherTerms").prop("disabled", true);

                var sonettotal = currencyFormat(result.netTotal);
                var sootherdiscount = currencyFormat(result.otherDiscount);
                var soothercharges = currencyFormat(result.otherCharges);
                var sosubtotal = currencyFormat(result.subTotal);
                var sotax = currencyFormat(result.tax);
                var sograndtotal = currencyFormat(result.grandTotal);
                $('#DiscountTotal').val(sootherdiscount);
                $('#NetTotal').val(sonettotal);
                $('#Tax').val(sotax);
                $('#Total').val(sosubtotal);
                $('#ChargesTotal').val(soothercharges);
                $('#GrandTotal').val(sograndtotal);
                $('#StatusBadge').text(result.status);
                $('#ClientAddress').val(result.billingAddress);
                $('#DeliveryAddress').val(result.deliveryAddress);

                $('#BilledAmount').val(currencyFormat(result.billSubTotal));
                //var unbill = result.grandtotal - result.billGrandTotal;
                $('#UnbilledAmount').val(currencyFormat(result.billSubBalance));
                $('#BalanceAmount').val(currencyFormat(result.billSubBalance));
                $('#BdBalance').val(currencyFormat(result.billSubBalance));

                var bdisc = result.otherDiscount - result.billOtherDiscount;
                var btax = result.tax - result.billTax;
                var bnettotal = result.netTotal - result.billNetTotal;
                var btotal = result.subTotal - result.billSubTotal;
                
                $('#BdDiscountTotal').val(currencyFormat(bdisc));
                $('#BdTax').val(currencyFormat(btax));
                $('#BdNetTotal').val(currencyFormat(bnettotal));
                $('#BdTotal').val(currencyFormat(btotal));

                $('#BalDiscountTotal').val(currencyFormat(bdisc));
                $('#BalTax').val(currencyFormat(btax));
                $('#BalNetTotal').val(currencyFormat(bnettotal));
                $('#BalTotal').val(currencyFormat(btotal));

                getqcompanies(result.companyId);
                getqordertype(result.orderTypeId);
                getqtaxtype(result.taxTypeId);
                getqpricingtype(result.pricingTypeId);

                getqdeliverytype(result.deliveryTypeId);
                getqpaymentterm(result.paymentTermId);
                getqwarrantytype(result.warrantyTypeId);

                getclient();
                dataTable.clear().draw();
                getquotationitems($id);
                getsalesordercharges($id);
                //getSiBillingAddress();
                $('#PricingTypes').prop('disabled', 'disabled');
                $('#OrderTypes').prop('disabled', 'disabled');
                $('#Companies').prop('disabled', 'disabled');
            });
        };
        function getquotationitems(id) {
            _salesOrderService.getSalesOrderItemsByParentId({ id: id }).done(function (result) {

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
                    var $sqiColor = result.items[i].color;

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
                        '<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + ' ' + $sqiColor + '</label></small>',
                        '<label class="text-muted">' + $sqiquantity + '</label>|<label class="text-muted">' + $sqiunit + '</label>',
                        sqiprice,
                        sqitotaldiscount,
                        sqitotal,
                        '',
                        $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $expenseid, $inventoryid, $incomeid, $sqiColor
                    ]).draw();
                }
            });
        }
        function getsalesordercharges(id) {
            _$chargesTable.DataTable().rows().remove().draw(false);
            _$chargesTable2.DataTable().rows().remove().draw(false);
            _salesOrderService.getSalesOrderChargesByParentId({ id: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    var $sqcchargetype = result.items[i].chargeType;
                    var $sqcrate = result.items[i].rate;
                    var $sqcamount = result.items[i].amount;
                    var $sqctotal = result.items[i].total;
                    var $sqcrevenueaccountid= result.items[i].revenueAccountId;
                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;
                    dataTableCharges.row.add([sqcitemno,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcrevenueaccountid]).draw();

                    //MULTIPLE SI
                    var sqcdatacount2 = dataTableCharges2.rows().count();
                    var sqcitemno2 = sqcdatacount2 + 1;
                    var $billed = result.items[i].billTotal;
                    var $balance = result.items[i].balance;
                    var strid = 'row-' + i + '-allocated';
                    var strid2 = 'row-' + i + '-balance';
                    dataTableCharges2.row.add([sqcitemno2,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcrevenueaccountid,
                        $billed, //billed
                        $balance, //unbilled
                        '<input id="' + strid2 + '" data-indexno=' + i + ' data-balance=' + $balance + '  onkeypress="return decimalOnly(this.id);" disabled class="balance form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($balance) + '" >', //balance
                        '<input id="' + strid + '" data-indexno=' + i + ' data-balance=' + $balance + '  onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="0" >', //allocated
                        0
                    ]).draw();
                    //MULTIPLE SI
                }

                computePercentage($('#Percentage').val());
                abp.ui.clearBusy(_$form);
            });
        };
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
                        companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
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
                        ordertypes.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        ordertypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                ordertypes.selectpicker('refresh');
            });
        }
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
        
        //Sales Order Autocomplete
        var getquotationcodes = function (request, response) {
            _salesOrderService.getSalesOrders({
                //filter: null + '|' + request + '|' + '3,4' + '|' + null + '|' + null
                filter: request.term + '|' + null + '|' + '2,3,4,5' + '|' + null + '|' + null
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
        //Sales Order Autocomplete

        //Datatable Add
        

        function addnewitem() {

            var $productid = $('#ProductId').val();
            var $productcode = $('#ProductCode').val();
            var $productname = $('#ProductName').val();
            var $unitid = $('#Units').val();
            var $unit = $("#Units option:selected").html();
            var $quantity = $('#Quantity').val();
            var $price = $('#Price').val();
            var $Color = $('#Color').val();

            var $disc1 = $('#Discount1').val();
            var $disc2 = $('#Discount2').val();
            var $disc3 = $('#Discount3').val();
            var $dtype1 = $('#DiscountType1').val();
            var $dtype2 = $('#DiscountType2').val();
            var $dtype3 = $('#DiscountType3').val();
            var $perdescription = $('#PerDescription').val();

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
                '<label name="' + $rowquantity + '" class="text-muted">' + $quantity + '</label>|<label name="' + $rowunit+'" class="text-muted">' + $unit + '</label>',
                lessprice,
                totaldiscount,
                total,
                '',
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $expenseid, $inventoryid, $incomeid, $Color
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
            //dataTableCharges.column(4).data()
            //    .each(function (value, index) {
            //        var $chargestotal = parseFloat(value);
            //        chargestotal = chargestotal + $chargestotal;
            //    });

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
        }

        function save() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var viewData = {
                salesinvoice: {
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "code": "0",
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "clientOrderNo": formdata.ClientOrderNo,
                    "salesOrderId": formdata.SalesOrderId,
                    "orderTypeId": formdata.OrderTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "notes": formdata.Notes,
                    "statusId": 1,
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
                    "cashAccountId": formdata.CashAccountId,
                    "otherTerms": formdata.OtherTerms
                    //MULTIPLE SI
                    , "lotDescription": formdata.LotDescription
                    , "taxNo": formdata.TaxNo
                    ,"businessStyle": formdata.BusinessStyle
                    ,"percentage": formdata.Percentage,
                    "billOtherDiscount": formdata.BillDiscountTotal,
                    "billSubTotal": formdata.BillTotal,
                    "billNetTotal": formdata.BillNetTotal,
                    "billTax": formdata.BillTax,
                    "billOtherCharges": formdata.BillChargesTotal,
                    "billGrandTotal": formdata.BillGrandTotal
                },
                salesinvoiceitems: [],
                salesinvoicecharges: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            //jsonObj = [];
            for (var i = 0; f.length > i; i++) {

                item = {};
                item["SalesInvoiceId"] = "0";
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022
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
                item["Color"] = f[i][20];
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
                viewData.salesinvoicecharges.push(charge);
            }

            abp.message.confirm(
                'New sales order will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _salesInvoiceService.createSalesInvoice(viewData).done(function (result) {
                            console.log(result);
                            if (result === null || result === "0") { return; }
                            abp.message.success('Sales invoice created', 'Success');
                            window.location.href = abp.appPath + 'SalesInvoice/Edit?id=' + result;
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
            save();
        });

        _$itemsTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$itemsTable.DataTable();
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
        $("#Color").keyup(function (event) {
            this.value = this.value.toUpperCase();
        });

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

        function isValid(str) {
            return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }
    });
})();



