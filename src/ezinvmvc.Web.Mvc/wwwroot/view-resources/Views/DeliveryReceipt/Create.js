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
        var _deliveryReceiptService = abp.services.app.deliveryReceiptService;
        var _vendorService = abp.services.app.vendorService;
        var _warehouseService = abp.services.app.warehouseService;
        var _stockEntryService = abp.services.app.stockEntryService;
        var _salesOrderService = abp.services.app.salesOrderService;

        var _$form = $('form[name=DeliveryReceiptForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');
        var _$chargesTable = $('#ChargesTable');
        var _$chargesTableDeleted = $('#ChargesTableDeleted');

        $("#ProductImage").hide();
        $("#EProductImage").hide();

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
        getcompanies();
        gettransporters();
        gettransportmode();
        getvehicletype();
        getwarehouses();

        $('#Companies').on('change', function (e) {
            getseriestype($('#Companies').val());
        });
        $('#Series').on('change', function (e) {
            getnextseries($('#Series').val());
        });
        function getseriestype(companyid) {
            var series = $('#Series');
            series.empty();
            _commonService.getSeriesTypesByTransId({ id: 0, transactionCode: 102, companyId: companyid }).done(function (result) {
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
        function gettransporters() {
            var transporters = $('#Transporter');
            transporters.empty();
            _vendorService.getVendors({ filter: null + '|' + 1 }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    transporters.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                transporters.selectpicker('refresh');
            });
        }
        function gettransportmode() {
            var transportmode = $('#TransportMode');
            transportmode.empty();
            _commonService.getTransportModes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                 
                        transportmode.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
              
                }
                transportmode.selectpicker('refresh');
            });
        }
        function getvehicletype() {
            var vehicletype = $('#VehicleType');
            vehicletype.empty();
            _commonService.getVehicleTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                  
                        vehicletype.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                  
                }
                vehicletype.selectpicker('refresh');
            });
        }
        function getwarehouses() {
            var selectoptionsources = $('#DefaultSources');
            selectoptionsources.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptionsources.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                //selectoptionsources.selectpicker('refresh');
            });
        }
        function getwarehousestext(id, source) {
            var selectoptionsources = $('#TargetWarehouse');
            //selectoptionsources.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        selectoptionsources.val(result.items[i].name + ' (' + source + ')');
                    }
                }
            });
        }
        //Sales Order Autocomplete
        var getsalesordercodes = function (request, response) {
            console.log(request);
            _salesOrderService.getSalesOrders({ filter: request.term + '|' + null + '|' + 3 + '|' + null + '|' + null }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code +" - "+ el.client,
                        value: el.id
                    };
                }));
            });
        };
        var selectsalesorder = function (event, ui) {
            event.preventDefault();
            clear();
            $("#SalesOrderId").val(ui.item ? ui.item.value : "");
            $("#SalesOrderCode").val(ui.item ? ui.item.label : "");
            getsalesorder();
        };
        var focussalesorder = function (event, ui) {
            event.preventDefault();
            $("#SalesOrderId").val(ui.item ? ui.item.value : "");
            $("#SalesOrderCode").val(ui.item ? ui.item.label : "");
        };
        var changesalesorder = function (event, ui) {
            event.preventDefault();
            $("#SalesOrderId").val(ui.item ? ui.item.value : "");
            $("#SalesOrderCode").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                clear();
            }
        };
        $("#SalesOrderCode").autocomplete({
            source: getsalesordercodes,
            select: selectsalesorder,
            focus: focussalesorder,
            minLength: 2,
            delay: 100,
            change: changesalesorder
        });
     
        //Sales Order Autocomplete
        function clear() {
            dataTable.clear().draw();
            dataTableCharges.clear().draw();
            $('#ClientId').val(0);
            $('#ClientName').val("");
            $('#SalesAgentId').val(0);
            $('#SalesAgent').val("");
            $('#ContactPerson').val("");
            $('#ContactNo').val("");
            $('#DeliveryAddress').val("");
            $('#TransportReceiptNo').val("");
            $('#VehicleNo').val("");
            $('#DriverName').val("");
            $('#Distance').val(0);
            computeTotal();
        }
        function getsalesorder() {
            var $id = $('#SalesOrderId').val();
            abp.ui.block();
            _salesOrderService.getSalesOrder({ id: $id }).done(function (result) {

                var $Contactno = result.contactNo;
                console.log($Contactno);
                if ($Contactno != "") {
                    $('#ContactNo').val(result.contactNo);
                }
                else {
                    $('#ContactNo').val("00");
                }
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#SalesAgent').val(result.salesAgent);
                $('#DefaultSourceId').val(result.defaultDestinationId);
                $('#ContactPerson').val(result.contactPerson);
                //$('#ContactNo').val(result.contactNo);
                $('#DeliveryAddress').val(result.deliveryAddress);
                var sonettotal = currencyFormat(result.netTotal);
                var sootherdiscount = currencyFormat(result.otherDiscount);
                var soothercharges = currencyFormat(result.otherCharges);
                var sosubtotal = currencyFormat(result.subTotal);
                var sotax = currencyFormat(result.tax);
                var sograndtotal = currencyFormat(result.grandTotal);
                var rdeadlines = new Date(result.deliveryTime);
                var dline = getFormattedDate(rdeadlines);
                $('#DeliveryTime').val(dline);


                $('#Companies').val(result.companyId);
                $('#OrderTypes').val(result.orderTypeId);
                $('#PricingTypes').val(result.pricingTypeId);
                $('#TaxTypes').val(result.taxTypeId);

                //getcompany(result.companyId);
                getordertype(result.orderTypeId);
                gettaxtype(result.taxTypeId);
                getpricingtype(result.pricingTypeId);
                getwarehousestext(result.defaultSourceId, result.code)

                dataTable.clear().draw();
                dataTableCharges.clear().draw();
                getsalesorderitems($id);
                getsalesordercharges($id);
                computeTotal();
                abp.ui.unblock();
            });
        }
        function computeTotal() {
            var qtytotal = 0;
            var grandtotal = 0;
            var discounttotal = 0;
            var chargestotal = 0;
            var taxrate = 0;
            var tax = 0;
            var taxcode = 101;
            var nettotal = 0;
            dataTable.column(9).data()
                .each(function (value, index) {
                    var $qtytotal = parseFloat(value);
                    qtytotal = qtytotal + $qtytotal;
                });
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
            dataTableCharges.column(4).data()
                .each(function (value, index) {
                    var $chargestotal = parseFloat(value);
                    chargestotal = chargestotal + $chargestotal;
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
            var newgrandtotal = grandtotal + chargestotal;
            $('#QuantityTotal').val(currencyFormat(qtytotal));
            $('#DiscountTotal').val(currencyFormat(discounttotal));
            $('#NetTotal').val(currencyFormat(nettotal));
            $('#Tax').val(currencyFormat(tax));
            $('#Total').val(currencyFormat(grandtotal));
            $('#ChargesTotal').val(currencyFormat(chargestotal));
            $('#GrandTotal').val(currencyFormat(newgrandtotal));
        }
        function getsalesorderitems(id) {
            _salesOrderService.getSalesOrderItemsByParentId({ id: id }).done(function (result) {
                var qtytotal = 0;
                var discounttotal = 0;
                var nettotal = 0;
                var tax = 0;
                var grandtotal = 0;
                var chargestotal = 0;
                var newgrandtotal = 0;
                for (var i = 0; i < result.items.length; i++) {
                    var $statusid = $('#StatusId').val();
                    var $soiid = result.items[i].id;
                    var $soiproductid = result.items[i].productId;
                    var $soiproductcode = result.items[i].productCode;
                    var $soiproductname = result.items[i].productName;
                    var $soiunitid = result.items[i].unitId;
                    var $soiunit = result.items[i].unit;
                    var $soiquantity = result.items[i].orderQty;
                    var $soideliveryqty = result.items[i].deliveryQty;
                    var $soireturnqty = result.items[i].returnQty;
                    var $soiprice = result.items[i].unitPrice;

                    var $soidisc1 = result.items[i].disc1;
                    var $soidisc2 = result.items[i].disc2;
                    var $soidisc3 = result.items[i].disc3;
                    var $soidtype1 = result.items[i].discType1;
                    var $soidtype2 = result.items[i].discType2;
                    var $soidtype3 = result.items[i].discType3;
                    var $soiperdescription = result.items[i].description;
                    var $soireference = result.items[i].reference;
                    var $soitotaldiscount = result.items[i].discTotal;
                    var $soicolor = result.items[i].color;

                    var soiprice = parseFloat($soiprice);
                    var soidiscount = parseFloat($soitotaldiscount) / parseFloat($soiquantity);
                    var soiquantity = (parseFloat($soiquantity) - parseFloat($soideliveryqty)) + parseFloat($soireturnqty);


                    var soidisc1 = 0;
                    var soidisc2 = 0;
                    var soidisc3 = 0;
                    if ($soidisc1 !== "") {
                        soidisc1 = parseFloat($soidisc1);
                    }
                    if ($soidisc2 !== "") {
                        soidisc2 = parseFloat($soidisc2);
                    }
                    if ($soidisc3 !== "") {
                        soidisc3 = parseFloat($soidisc3);
                    }
                    var soitotaldiscount = soidiscount * soiquantity;
                    var soitotal = soiprice * soiquantity;
                    var soidatacount = dataTable.rows().count();

                    qtytotal = qtytotal + soiquantity;
                    discounttotal = discounttotal + soitotaldiscount;
                    grandtotal = grandtotal + soitotal;
                 

                    var soiitemno = soidatacount + 1;
                    if (soiquantity > 0) {
                        dataTable.row.add([soiitemno,
                            '<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + ' ' + $soicolor + ' </label></small>',
                            '<label class="text-muted">' + soiquantity + '</label>&nbsp;|&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                            soiprice,
                            soitotaldiscount,
                            soitotal,
                            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-orderqty="' + $soiquantity + '" data-qty="' + soiquantity + '" data-deliveryqty="' + $soideliveryqty + '" data-price="' + soiprice + '" data-disc1="' + soidisc1 + '" data-disc2="' + soidisc2 + '" data-disc3="' + soidisc3 + '" data-dtype1="' + parseInt($soidtype1) + '" data-dtype2="' + parseInt($soidtype2) + '" data-dtype3="' + parseInt($soidtype3) + '" data-groupname="" data-reference="' + $soiproductcode + '" data-disctotal="' + soitotaldiscount + '" data-soiid = "' + $soiid + '" data-color="' + $soicolor + '" ><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                            $soiproductid, $soiperdescription, soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soireference, $soiid, $soiquantity, $soideliveryqty, $soicolor
                        ]).draw();
                        computeTotal();
                    }
                }
             
            });
        }
        function getsalesordercharges(id) {
            _salesOrderService.getSalesOrderChargesByParentId({ id: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    var $sqcid = result.items[i].id;
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    var $sqcchargetype = result.items[i].chargeType;
                    var $sqcrate = result.items[i].rate;
                    var $sqcamount = result.items[i].amount;
                    var $sqctotal = result.items[i].total;
                    var $sqcdeliveryrate = result.items[i].deliveryRate;

                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;

                    var socnewrate = parseFloat($sqcrate) - parseFloat($sqcdeliveryrate);

                    if (socnewrate > 0) {
                        dataTableCharges.row.add([sqcitemno,
                            $sqcchargetype,
                            socnewrate,
                            $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcid]).draw();
                        computeTotal();
                    }
                }
            });
        }
        function getcompany(id) {
            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
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
        function getordertype(id) {

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
        function gettaxtype(id) {
            var taxtypes = $('#TaxTypes');
            taxtypes.empty();
            _commonService.getTaxTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                        computeTotal();
                    }
                    else {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }

                }
                taxtypes.selectpicker('refresh');
            });
        }
      
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
                },
                targets: [5]
            }
            ]
        });
        var dataTableChargesDeleted = _$chargesTableDeleted.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [6]
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
                    return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                },
                targets: [5]
            }
            ]
        });
        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 6,]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [3, 4, 5]
            },
            {
                className: 'text-center',
                targets: [2, 6]
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
                targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
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
            var $groupname = $('#GroupName').val();

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
            dataTable.row.add([itemno,
                '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
                '<span class="text-muted">' + $quantity + '</span>&nbsp;<span class="text-muted">' + $unit + '</span>',
                lessprice,
                totaldiscount,
                total,
                '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $productcode, 0
            ]).draw();
            computeTotal();
            $('#ProductId').val("");
            $('#ProductCode').val("");
            $('#ProductName').val("");
            $('#Units').empty();
            $('#Discount1').val("");
            $('#Discount2').val("");
            $('#Discount3').val("");
            $('#Quantity').val("");
            $('#Price').val("");
            $('#PerDescription').val("");
            $('#GroupName').val("");
            $("#ProductImage").hide();
            abp.notify.success('Item #' + itemno + ' added!', 'Success');
        }      
        
        function addnewcharge() {
            var $chargetypeid = $('#ChargeTypes').val();
            var $chargetype = $("#ChargeTypes option:selected").html();
            var $chargerate = $('#ChargeRate').val();
            var $chargeamount = $('#ChargeAmount').val();

            if ($chargerate === '' || $chargeamount === '' || $chargetypeid === '') { return; }

            var datacount = dataTableCharges.rows().count();
            var itemno = datacount + 1;

            var chargerate = parseFloat($chargerate);
            var chargeamount = parseFloat($chargeamount.replace(/,/g, ''));
            var total = chargerate * chargeamount;

            dataTableCharges.row.add([itemno,
                $chargetype,
                chargerate,
                chargeamount, total, '', $chargetypeid, 0]).draw();
            computeTotal();
            $('#ChargeRate').val("");
            $('#ChargeAmount').val("");

            abp.notify.success('Charge #' + itemno + ' added!', 'Success');
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
                var $id = f[i][18];
                var $orderqty = f[i][19];
                var $deliveryqty = f[i][20];
                var $color = f[i][21];
                var totaldiscount = f[i][4];
                temp[0] = itemno;
                temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-orderqty="' + $orderqty + '" data-qty="' + $quantity + '" data-deliveryqty="' + $deliveryqty + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '" data-soiid="' + $id + '" data-color="' + $color + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }
        }
        function save() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();
            var $updatedsoid = $('#Id').val();
            var viewData = {
                deliveryreceipt: {
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "code": 0,
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "salesOrderId": formdata.SalesOrderId,
                    "orderTypeId": formdata.OrderTypeId,
                    "pricingTypeId": formdata.PricingTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "defaultSourceId": formdata.DefaultSourceId,
                    "contactPerson": formdata.ContactPerson,
                    "contactNo": formdata.ContactNo,
                    "deliveryAddress": formdata.DeliveryAddress,
                    "notes": formdata.Notes,
                    "statusId": 1,
                    "taxTypeId": formdata.TaxTypeId,
                    "transporterId": formdata.TransporterId,
                    "transportModeId": formdata.TransportModeId,
                    "transportReceiptNo": formdata.TransportReceiptNo,
                    "transportReceiptTime": formdata.DeliveryTime,
                    "vehicleTypeId": formdata.VehicleTypeId,
                    "vehicleNo": formdata.VehicleNo,
                    "driverName": formdata.DriverName,
                    "distance": formdata.Distance,
                    "subTotal": formdata.Total,
                    "otherDiscount": formdata.DiscountTotal,
                    "otherCharges": formdata.ChargesTotal,
                    "netTotal": formdata.NetTotal,
                    "taxRate": $("#TaxTypes option:selected").data('rate'),
                    "tax": formdata.Tax,
                    "grandTotal": formdata.GrandTotal,
                    "isMoveOrderStatus": formdata.IsMoveOrderStatus,
                },
                deliveryreceiptitem: [],
                deliveryreceiptcharge: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            for (var i = 0; f.length > i; i++) {

                item = {};
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022

                item["SalesOrderItemId"] = f[i][18];
                item["DeliveryReceiptId"] = "0";
                item["ProductId"] = f[i][7];
                item["Description"] = f[i][8];
                item["Qty"] = f[i][9];
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
                item["Reference"] = f[i][17];
                item["Color"] = f[i][21];
                viewData.deliveryreceiptitem.push(item);
            }

            //charges
            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {

                charge = {};
                charge["SalesOrderChargeId"] = h[k][7];
                charge["DeliveryReceiptId"] = "0";
                charge["ChargeTypeId"] = h[k][6];
                charge["Rate"] = h[k][2];
                charge["Amount"] = h[k][3];
                charge["Total"] = h[k][4];
                viewData.deliveryreceiptcharge.push(charge);
            }

            if (f.length <= 0) {
                abp.notify.error('Invalid transaction', 'Error');
            }
            else {
                abp.message.confirm(
                    'New delivery receipt will be created.',
                    'Are you sure?',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            abp.ui.setBusy(_$form);
                            _deliveryReceiptService.createDeliveryReceipt(viewData).done(function (res) {
                                if (res === null || res === "0") { return; }
                                abp.message.success('Delivery receipt created', 'Success');
                                //window.location.href = abp.appPath + 'DeliveryReceipt/Edit?id=' + result;
                                if (res.notif.id > 0) {
                                    srConnection.invoke('sendNotification', res.deliveryReceipt.code, res.deliveryReceipt.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                                }
                                setTimeout(function () {
                                    window.location.href = abp.appPath + 'DeliveryReceipt/Edit?id=' + res.deliveryReceipt.id;
                                }, 2000);
                            }).always(function () {
                                abp.ui.clearBusy(_$form);
                            });
                        }
                    }
                );
            }
        }

        $('#SaveButton').click(function (e) {
            e.preventDefault();
            save();
        });
        function editgetproduct() {
            var $productid = $('#EProductId').val();
            _productService.getProduct({ id: $productid }).done(function (result) {
                $('#EProductCode').val(result.code);
                $('#EProductName').val(result.name);
                $('#EPerDescription').val(result.description);
                if (result.imageName !== null && result.imageName !== '') {
                    $("#EProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
                    $("#EProductImage").show();
                }
                else {
                    $("#EProductImage").hide();
                }
            });
        }
        function editgetproductunits() {
            var units = $('#EUnits');
            var $productid = $('#EProductId').val();
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
        function editgetproductprice() {
            $("#EPrice").val("");
            var $unitid = $('#EUnits').val();
            var $pricingtypeid = $('#EPricingTypes').val();
            var $productid = $('#EProductId').val();
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
                    $("#EPrice").val(result.items[i].unitPrice ? price : "");
                }
            });
        }
        function getproductstock() {
            $("#EStocks").val("0");
            var warehouseid = $('#DefaultSourceId').val();//$('#DefaultSources').val();
            var $productid = $('#EProductId').val();
            _stockEntryService.getStockSummary({ filter: warehouseid + '|' + $productid + '||' }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var stocks = currencyFormat(result.items[i].qty);
                    $("#EStocks").val(result.items[i].qty ? stocks : "0");
                }
            });
        }
        _$itemsTable.on('click', 'a.edit-item', function (e) {
            e.preventDefault();
            abp.ui.block();
            var $itemno = $(this).attr("data-itemno");
            var $productid = $(this).attr("data-id");
            var $qty = $(this).attr("data-qty");
            var $orderqty = $(this).attr("data-orderqty");
            var $deliveryqty = $(this).attr("data-deliveryqty");
            var $unitid = $(this).attr("data-unitid");
            var $perdescription = $(this).attr("data-perdesc");
            var $price = $(this).attr("data-price");
            var $disc1 = $(this).attr("data-disc1");
            var $disc2 = $(this).attr("data-disc2");
            var $disc3 = $(this).attr("data-disc3");
            var $dtype1 = $(this).attr("data-dtype1");
            var $dtype2 = $(this).attr("data-dtype2");
            var $dtype3 = $(this).attr("data-dtype3");
            var $disctotal = $(this).attr("data-disctotal");
            var $reference = $(this).attr("data-reference");
            var $groupname = $(this).attr("data-groupname");
            var $colors = $(this).attr("data-color");
            var $soiid = $(this).attr("data-soiid");
            var discountvalue = parseFloat($disctotal) / parseFloat($qty);
            var origprice = discountvalue + parseFloat($price);
            console.log('edit button - ' + $soiid);
            $('#EProductId').val($productid);
            $('#EIndexNo').text($itemno);
            $('#EQuantity').val($qty);
            $('#EOrderQuantity').val($orderqty);
            $('#EDeliverQuantity').val($deliveryqty);

            $('#Color').val($colors);
            $('#EPerDescription').val($perdescription);
            if ($disc1 !== '' || $disc2 !== '' || $disc3 !== '') {
                $('#accordioneditdiscount .collapse').collapse('show');
            }
            $('#EDiscount1').val($disc1);
            $('#EDiscount2').val($disc2);
            $('#EDiscount3').val($disc3);

            $('#EDiscountType1').val($dtype1);
            $('#EDiscountType2').val($dtype2);
            $('#EDiscountType3').val($dtype3);

            editgetproduct();
            editgetproductunits($unitid);
            getproductstock();
            $('#EProductCode').val($reference);
            $('#EGroupName').val($groupname);
            $('#ESoid').val($soiid);
            $('#EPrice').val(currencyFormat(origprice));
            abp.ui.unblock();
        });
        $('#UpdatetemButton').click(function (e) {
            e.preventDefault();
            var $indexno = parseInt($('#EIndexNo').text()) - 1;
            var $productid = $('#EProductId').val();
            var $productcode = $('#EProductCode').val();
            var $productname = $('#EProductName').val();
            var $unitid = $('#EUnits').val();
            var $unit = $("#EUnits option:selected").html();
            var $quantity = $('#EQuantity').val();
            var $orderqty = $('#EOrderQuantity').val();
            var $deliveryqty = $('#EDeliverQuantity').val();
            var $price = $('#EPrice').val();

            var $disc1 = $('#EDiscount1').val();
            var $disc2 = $('#EDiscount2').val();
            var $disc3 = $('#EDiscount3').val();
            var $dtype1 = $('#EDiscountType1').val();
            var $dtype2 = $('#EDiscountType2').val();
            var $dtype3 = $('#EDiscountType3').val();
            var $perdescription = $('#EPerDescription').val();
            var $groupname = $('#EGroupName').val();
            var $EColor = $('#Color').val();
            var $ESOID = $('#ESoid').val();

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $perdescription === '') { return; }

            var price = parseFloat($price.replace(/,/g, ''));
            var quantity = parseFloat($quantity);
            var balance = parseFloat($orderqty) - parseFloat($deliveryqty) - parseFloat($quantity);
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
            console.log('update button - ' + $ESOID);
            var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;

            var table = _$itemsTable.DataTable();
            var temp = table.row($indexno).data();
            temp[1] = '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $EColor + '</span></small>';
            temp[2] = '<span class="text-muted">' + $quantity + '</span>&nbsp;|&nbsp;<span class="text-muted">' + $unit + '</span>';
            temp[3] = lessprice;
            temp[4] = totaldiscount;
            temp[5] = total;
            
            //temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '" data-color="' + $EColor + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-orderqty="' + $orderqty + '" data-qty="' + $quantity + '" data-deliveryqty="' + $deliveryqty + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '" data-color="' + $EColor + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[7] = $productid;
            temp[8] = $perdescription;
            temp[9] = $quantity;
            temp[10] = $unitid;
            temp[11] = disc1;
            temp[12] = parseInt($dtype1);
            temp[13] = disc2;
            temp[14] = parseInt($dtype2);
            temp[15] = disc3;
            temp[16] = parseInt($dtype3);
            temp[17] = $productcode;
            temp[18] = $ESOID;
            temp[19] = $orderqty;
            temp[20] = $deliveryqty;
            temp[21] = $EColor;
            $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
            $('#ItemEditModal').modal('hide');
            computeTotal();
            if (balance > 0) {
                $('#IsMoveOrderStatus').val(0);
            }
        });
        function deleteitem(indexno) {
            var dtable = _$itemsTable.DataTable();
            var dform_data = dtable.rows().data();
            var f = dform_data;

            for (var i = 0; f.length > i; i++) {
                if (indexno === i) {
                    dataTableDeleted.row.add([0,
                        '<a href="#" class="btn-link">' + f[i][7] + '</a><br /><small><label class="text-muted">' + f[i][8] + '</label></small>',
                        '<label class="text-muted">' + f[i][9] + '</label>|<label class="text-muted">' + f[i][10] + '</label>',
                        f[i][3],
                        f[i][4],
                        f[i][5],
                        '',
                        f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], parseInt(f[i][12]), f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17], f[i][18]]).draw();
                }
            }
        }
        function deletecharge(indexno) {
            var dtable = _$chargesTable.DataTable();
            var dform_data = dtable.rows().data();
            var f = dform_data;

            for (var i = 0; f.length > i; i++) {
                if (indexno === i) {
                    dataTableChargesDeleted.row.add([0,
                        f[i][1],
                        f[i][2],
                        f[i][3], f[i][4], '', f[i][6], f[i][7]]).draw();
                }
            }
        }
        _$itemsTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);

            var dtRow = $this.parents('tr');
            var table = _$itemsTable.DataTable();
            deleteitem(dtRow[0].rowIndex - 1);
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            $('#IsMoveOrderStatus').val(0);
            computeTotal();
            rearrange();
        });
        // Delete product unit record

        $('#TaxTypes').on('change', function (e) {
            computeTotal();
        });
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            addnewitem();
        });
        $('#AddChargeButton').click(function (e) {
            e.preventDefault();
            addnewcharge();
        });
        _$chargesTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$chargesTable.DataTable();
            deletecharge(dtRow[0].rowIndex - 1);
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        //Datatable Add
        $("#Color").keyup(function (event) {
            this.value = this.value.toUpperCase();
        });

        function isValid(str) {
            return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }
    });
})();