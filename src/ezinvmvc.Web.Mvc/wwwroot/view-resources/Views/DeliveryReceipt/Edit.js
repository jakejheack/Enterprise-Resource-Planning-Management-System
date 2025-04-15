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
        var _$deliveredTable = $('#DeliveredItemsTable');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');
        var _$chargesTable = $('#ChargesTable');
        var _$chargesTableDeleted = $('#ChargesTableDeleted');
        var _$itemsTablePrintActual = $('#ItemsTablePrintActual');

        $("#ProductImage").hide();
        $("#EProductImage").hide();
        $('#divTable').hide();
        abp.ui.block();
        getdeliveryreceipt();
        function getdeliveryreceipt() {
            var $id = $('#Id').val();
            _deliveryReceiptService.getDeliveryReceipt({ id: $id }).done(function (result) {
                //$('#Id').val(result.id);
                $('#Prefix').val(result.prefix);
                $('#Series').val(result.seriesTypeId);
                $('#SeriesCode').val(result.code);
                $('#SalesOrderId').val(result.salesOrderId);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#SalesAgent').val(result.agent);
                var transactiontime = new Date(result.transactionTime);
                var transportreceipttime = new Date(result.transportReceiptTime);
                $('#TransactionTime').val(getFormattedDate(transactiontime));
                $('#TransportReceiptTime').val(getFormattedDate(transportreceipttime));
                $('#ContactPerson').val(result.contactPerson);
                $('#TransportReceiptNo').val(result.transportReceiptNo);
                $('#VehicleNo').val(result.vehicleNo);
                $('#DriverName').val(result.driverName);
                $('#Distance').val(result.distance);
                $('#ContactNo').val(result.contactNo);
                $('#DeliveryAddress').val(result.deliveryAddress);
                $('#Notes').val(result.notes);
                $('#StatusBadge').text(result.status);
                $('#StatusId').val(result.statusId);
                $('#DrNumber').val(result.drNumber);

                switch (result.statusId) {
                    case 1:
                        $('#StatusBadge').addClass('badge badge-secondary');
                        if ($('#SaveButton').length) {
                            $('#SaveButton').removeAttr('hidden');
                        }
                        if ($('#SubmitButton').length) {
                            $('#SubmitButton').removeAttr('hidden');
                        }
                        $("#TransactionTime").attr("disabled", false);
                        $("#ClientName").attr("disabled", false);
                        $("#SalesAgent").attr("disabled", false);
                        $("#OrderTypes").attr("disabled", false);
                        $("#ClientOrderNo").attr("disabled", false);
                        //$("#PricingTypes").attr("disabled", false);
                        $("#DeliveryTime").attr("disabled", false);
                        $("#TransactionTime").attr("disabled", false);
                        $("#AddItemButton").attr("disabled", false);
                        break;
                    case 2:
                        $('#StatusBadge').addClass('badge badge-success');
                        //if ($('#SubmitButton').length) {
                        //    $('#SubmitButton').removeAttr('hidden');
                        //}
                        break;
                    case 3:
                        $('#StatusBadge').addClass('badge badge-danger');
                        //if ($('#SubmitButton').length) {
                        //    $('#SubmitButton').removeAttr('hidden');
                        //}
                        break;
                    case 4:
                        $('#StatusBadge').addClass('badge badge-primary');
                        break;
                    case 5:
                        $('#StatusBadge').addClass('badge badge-info');
                        break;
                    case 6:
                        $('#StatusBadge').addClass('badge badge-warning');
                        break;
                    default:
                        $('#StatusBadge').addClass('badge badge-secondary');
                }

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

                getsalesorder();
                getcompany(result.companyId);
                gettaxtype(result.taxTypeId);
                getpricingtype(result.pricingTypeId);
                //getwarehouses(result.defaultSourceId);
                gettransporters(result.transporterId);
                gettransportmode(result.transportModeId);
                getvehicletype(result.vehicleTypeId);
                getdeliveryreceiptitems($id);
                getdeliveryreceiptcharges($id);
            });
        }
        function getsalesorder() {
            var $id = $('#SalesOrderId').val();
            abp.ui.block();
            _salesOrderService.getSalesOrder({ id: $id }).done(function (result) {
                $('#SalesOrderCode').val(result.code);
                $('#DefaultSourceId').val(result.defaultDestinationId);
                $('#ClientOrderNo').val(result.clientOrderNo);
                getwarehousestext(result.defaultSourceId, result.code);
            });
        }
        function getwarehousestext(id, source) {
            var selectoptionsources = $('#TargetWarehouse');
            //selectoptionsources.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        selectoptionsources.val(result.items[i].name + ' (' + source + ')');
                        //$('#DefaultSourceId').val(id);
                    }
                }
            });
        }
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
        function gettransporters(id) {
            var transporters = $('#Transporter');
            transporters.empty();
            _vendorService.getVendors({ filter: null + '|' + 1 }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        transporters.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        transporters.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                transporters.selectpicker('refresh');
            });
        }
        function gettransportmode(id) {
            var transportmode = $('#TransportMode');
            transportmode.empty();
            _commonService.getTransportModes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        transportmode.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        transportmode.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }

                }
                transportmode.selectpicker('refresh');
            });
        }
        function getvehicletype(id) {
            var vehicletype = $('#VehicleType');
            vehicletype.empty();
            _commonService.getVehicleTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        vehicletype.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        vehicletype.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                vehicletype.selectpicker('refresh');
            });
        }
        function getwarehouses(id) {
            var selectoptionsources = $('#DefaultSources');
            selectoptionsources.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    if (id === result.items[i].id) {
                        selectoptionsources.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        selectoptionsources.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }

                }
                selectoptionsources.selectpicker('refresh');
            });
        }
        function getcompany(id) {
            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                        $('#CompanyAddress').val(result.items[i].companyAddress);
                    }
                    else {
                        companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                companies.selectpicker('refresh');
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
                    }
                    else {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }

                }
                taxtypes.selectpicker('refresh');
            });
        }

        function getdeliveryreceiptitems(id) {
            _deliveryReceiptService.getDeliveryReceiptItemsByParentId({ id: id }).done(function (result) {
                var qtytotal = 0;
                for (var i = 0; i < result.items.length; i++) {
                    var $statusid = $('#StatusId').val();
                    var $soiid = result.items[i].id;
                    var $soireferenceid = result.items[i].salesOrderItemId;
                    var $soiproductid = result.items[i].productId;
                    var $soiproductcode = result.items[i].productCode;
                    var $soiproductname = result.items[i].productName;
                    var $soiunitid = result.items[i].unitId;
                    var $soiunit = result.items[i].unit;
                    var $soiquantity = result.items[i].qty;
                    var $soidquantity = result.items[i].deliveredQty;
                    var $soiprice = result.items[i].unitPrice;

                    var $sqiproductdescription = result.items[i].description;
                    var $sqiimagename = result.items[i].imageName;

                    var $soidisc1 = result.items[i].disc1;
                    var $soidisc2 = result.items[i].disc2;
                    var $soidisc3 = result.items[i].disc3;
                    var $soidtype1 = result.items[i].discType1;
                    var $soidtype2 = result.items[i].discType2;
                    var $soidtype3 = result.items[i].discType3;
                    var $soiperdescription = result.items[i].description;
                    var $soireference = result.items[i].reference;
                    var $socolor = result.items[i].color;

                    var soiprice = parseFloat($soiprice);
                    var soiquantity = parseFloat($soiquantity);
                    qtytotal = qtytotal + soiquantity;

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

                    var soidiscount = priceDiscount(soiprice, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3));
                    var soitotaldiscount = soidiscount * soiquantity;
                    var soilessprice = soiprice - soidiscount;
                    var soitotal = soilessprice * soiquantity;
                    var soidatacount = dataTable.rows().count();
                    var soiitemno = soidatacount + 1;

                    if ($statusid === '1') {
                        dataTable.row.add([soiitemno,
                            '<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + ' ' + $socolor+'</label></small>',
                            '<label class="text-muted">' + $soiquantity + '</label>&nbsp;|&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                            soiprice,
                            soitotaldiscount,
                            soitotal,
                            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-price="' + soilessprice + '" data-disc1="' + soidisc1 + '" data-disc2="' + soidisc2 + '" data-disc3="' + soidisc3 + '" data-dtype1="' + parseInt($soidtype1) + '" data-dtype2="' + parseInt($soidtype2) + '" data-dtype3="' + parseInt($soidtype3) + '" data-groupname="" data-reference="' + $soiproductcode + '" data-disctotal="' + soitotaldiscount + '" data-color="' + $socolor + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                            $soiproductid, $soiperdescription, $soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soireference, $soiid, $soireferenceid, $socolor
                        ]).draw();

                        dataTable2.row.add([soiitemno,
                            '<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + ' ' + $socolor +'</label></small>',
                            '<label class="text-muted">' + $soiquantity + '</label>&nbsp;|&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                            '<input id="item' + soiitemno + '" class="deliveredqty' + soiitemno + ' form-control text-right" type=number value=' + $soiquantity + ' min=0 max=' + $soiquantity + ' oninput="if (this.value > ' + $soiquantity + ' || this.value < 0) { this.value = ' + $soiquantity + ' }"  />',
                            $soiproductid, $soiunitid, $soiid, $soireferenceid
                        ]).draw();
                    }
                    else if ($statusid === '2') {
                        var $delivered = '';
                        if ($soidquantity === $soiquantity) {
                            $delivered = '<label class="text-success">' + $soidquantity + '</label>&nbsp;<label class="text-success">' + $soiunit + '</label>'
                        }
                        else {
                            $delivered = '<label class="text-success">' + $soidquantity + '</label>&nbsp;<label class="text-success">' + $soiunit + '</label>&nbsp;|&nbsp;<label class="text-danger">(' + $soiquantity + '</label>&nbsp;<label class="text-danger">' + $soiunit + ')</label>'
                        }
                        dataTable.row.add([soiitemno,
                            '<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + ' ' + $socolor +'</label></small>',
                            $delivered,
                            soiprice,
                            soitotaldiscount,
                            soitotal,
                            '',
                            $soiproductid, $soiperdescription, $soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soireference, $soiid, $soireferenceid, $socolor
                        ]).draw();

                        dataTable2.row.add([soiitemno,
                            '<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + ' ' + $socolor +'</label></small>',
                            '<label class="text-muted">' + $soiquantity + '</label>&nbsp;|&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                            '<input id="item' + soiitemno + '" class="deliveredqty' + soiitemno + ' form-control text-right" type=number value=' + $soiquantity + ' min=0 max=' + $soiquantity + ' oninput="if (this.value > ' + $soiquantity + ' || this.value < 0) { this.value = ' + $soiquantity + ' }"  />',
                            $soiproductid, $soiunitid, $soiid, $soireferenceid
                        ]).draw();
                    }

                    //if ($sqiimagename !== '' && $sqiimagename !== null) {
                        //dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $soiproductcode + '</span><br/><img src="' + abp.appPath + 'products/' + $soiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                        //'<span class="font-weight-bold">' + $soiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                        //'<span class="text-muted">' + $soiquantity + '</span>',
                        //    soiprice,
                        //    soitotal]).draw();
                    //}
                    //else {
                        dataTablePrintActual.row.add(['<span class="text-muted">' + $soiquantity + '</span>',
                            '<span class="text-muted">' + $soiunit + '</span>',
                            '<span class="text-muted">' + $soiproductcode + '</span>',
                            '<span class="font-weight-bold">' + $soiproductname + ' ' + $socolor + '</span>']).draw();
                    //}
                    console.log($sqiproductdescription.replace(/(\r\n|\n|\r)/gm, " "));
                }
                $('#QuantityTotal').val(currencyFormat(qtytotal));
            });
        }

        function validateDelivered(input, min, max) {
            if (input.value > max) {
                alert('Max value is ' + max)
                input.value = max;
            }
            if (input.value < min) {
                alert('Min value is ' + min)
                input.value = min;
            }
        }

        function getdeliveryreceiptcharges(id) {
            _deliveryReceiptService.getDeliveryReceiptChargesByParentId({ id: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    var $sqcid = result.items[i].id;
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    var $sqcchargetype = result.items[i].chargeType;
                    var $sqcrate = result.items[i].rate;
                    var $sqcamount = result.items[i].amount;
                    var $sqctotal = result.items[i].total;
                    var $sqcreferenceid = result.items[i].salesOrderChargeId;

                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;

                    dataTableCharges.row.add([sqcitemno,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcid, $sqcreferenceid]).draw();
                }
                abp.ui.unblock();
            });
        }

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
                targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 6]
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
                targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 6]
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
        var dataTablePrintActual = _$itemsTablePrintActual.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                //{
                //    orderable: false,
                //    targets: [0, 1, 2, 3, 4]
                //},
                //{
                //    visible: false,
                //    render: $.fn.dataTable.render.number(',', '.', 2),
                //    className: 'text-right',
                //    targets: [3, 4]
                //},
                //{
                //    className: 'text-center',
                //    targets: [2]
                //}
                {
                    orderable: false,
                    targets: [0, 1, 2, 3]
                },
                {
                    className: 'text-center',
                    targets: [3]
                }
            ]
        });

        //MARC 09/08/2021
        var dataTable2 = _$deliveredTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [4, 5, 6, 7]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3]
            },
            {
                className: 'text-center',
                targets: [2]
            }
            ]
        });
        //END

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
                var totaldiscount = f[i][4];

                temp[0] = itemno;
                temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
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
                    "id": formdata.Id,
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": formdata.Prefix,
                    "code": formdata.SeriesCode,
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "salesOrderId": formdata.SalesOrderId,
                    "pricingTypeId": formdata.PricingTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "defaultSourceId": formdata.DefaultSourceId,
                    "contactPerson": formdata.ContactPerson,
                    "contactNo": formdata.ContactNo,
                    "deliveryAddress": formdata.DeliveryAddress,
                    "notes": formdata.Notes,
                    "statusId": formdata.StatusId,
                    "taxTypeId": formdata.TaxTypeId,
                    "orderTypeId": "1",
                    "transporterId": formdata.TransporterId,
                    "transportModeId": formdata.TransportModeId,
                    "transportReceiptNo": formdata.TransportReceiptNo,
                    "transportReceiptTime": formdata.TransportReceiptTime,
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
                    "drNumber": formdata.DrNumber
                },
                deliveryreceiptitem: [],
                deliveryreceiptcharge: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$itemsTable.DataTable();
            var table2 = _$deliveredTable.DataTable();
            var form_data = table.rows().data();
            var form_data2 = table.rows().data();
            var f = form_data;
            var f2 = form_data2;

            for (var i = 0; f.length > i; i++) {

                item = {};
                item["DeliveryReceiptId"] = "0";
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022

                item["SalesOrderItemId"] = f[i][19];
                item["Id"] = f[i][18];
                item["ProductId"] = f[i][7];
                item["Description"] = f[i][8];
                item["Qty"] = f[i][9];
                console.log(formdata.StatusId);
                if ($("#StatusId").val() === '2') {
                    console.log($('.deliveredqty' + (i + 1)).html(f2[i][3]).val());
                    item["DeliveredQty"] = $('.deliveredqty' + (i + 1)).html(f2[i][3]).val();
                }
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
                item["Color"] = f[i][20];
                viewData.deliveryreceiptitem.push(item);
            }
            
            var tabledeleted = _$itemsTableDeleted.DataTable();
            var form_deleteddata = tabledeleted.rows().data();
            var g = form_deleteddata;

            for (var j = 0; g.length > j; j++) {

                item = {};
                item["IndexNo"] = g[j][0];
                //MARC IndexNo for arrangement fix 09132022

                item["SalesOrderItemId"] = g[j][19];
                item["Id"] = g[j][18];
                item["ProductId"] = g[j][7];
                item["Description"] = g[j][8];
                item["Qty"] = g[j][9];
                console.log(formdata.StatusId);
                if ($("#StatusId").val() === '2') {
                    console.log($('.deliveredqty' + (i + 1)).html(f2[j][3]).val());
                    item["DeliveredQty"] = $('.deliveredqty' + (i + 1)).html(f2[j][3]).val();
                }
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
                item["Reference"] = g[j][17];
                item["Color"] = g[j][20];
                item["IsDeleted"] = 1;
                viewData.deliveryreceiptitem.push(item);
            }

            //charges
            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {

                charge = {};
                charge["DeliveryReceiptId"] = "0";
                charge["SalesOrderChargeId"] = h[k][8];
                charge["Id"] = h[k][7];
                charge["ChargeTypeId"] = h[k][6];
                charge["Rate"] = h[k][2];
                charge["Amount"] = h[k][3];
                charge["Total"] = h[k][4];
                viewData.deliveryreceiptcharge.push(charge);
            }

            //var tablechargesdeleted = _$chargesTableDeleted.DataTable();
            //var form_datachargesdeleted = tablechargesdeleted.rows().data();
            //var l = form_datachargesdeleted;

            //for (var m = 0; l.length > m; m++) {

            //    charge = {};
            //    charge["Id"] = l[m][7];
            //    charge["QuotationId"] = "0";
            //    charge["ChargeTypeId"] = l[m][6];
            //    charge["Rate"] = l[m][2];
            //    charge["Amount"] = l[m][3];
            //    charge["Total"] = l[m][4];
            //    charge["IsDeleted"] = 1;
            //    viewData.salesordercharges.push(charge);
            //}
            var mes = "";
            if (formdata.StatusId === '1') {
                mes = "Delivery receipt will be updated.";
            }
            else if (formdata.StatusId === '2') {
                mes = "Delivery receipt will be submitted.";
            }
            console.log(formdata.StatusId);
            abp.message.confirm(
                mes,
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        if (formdata.StatusId === '2') {
                            _deliveryReceiptService.updateDeliveryReceipt(viewData).done(function (res) {
                                if (res.notif.id > 0) {
                                    srConnection.invoke('sendNotification', res.deliveryReceipt.code, res.deliveryReceipt.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                                }
                                _deliveryReceiptService.updateSalesOrderDeliveryStatus(viewData).done(function (res2) {
                                    abp.message.success('Delivery receipt submitted', 'Success');
                                    if (res2.notif.id > 0) {
                                        srConnection.invoke('sendNotification', res2.deliveryReceipt.salesOrderCode, res2.deliveryReceipt.salesOrderId, res2.notif.userIds, abp.session.userId, '', res2.notif.message); // Send a message to the server
                                    }
                                    setTimeout(function () {
                                        location.reload(true);
                                    }, 2000);
                                });
                            }).always(function () {
                                abp.ui.clearBusy(_$form);
                            });
                        }
                        else {
                            _deliveryReceiptService.updateDeliveryReceipt(viewData).done(function (res) {
                                abp.message.success('Delivery receipt updated', 'Success');
                                if (res.notif.id > 0) {
                                    srConnection.invoke('sendNotification', res.deliveryReceipt.code, res.deliveryReceipt.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                                }
                                setTimeout(function () {
                                    location.reload(true);
                                    //window.location.href = abp.appPath + 'DeliveryReceipt/Edit?id=' + res.deliveryReceipt.id;
                                }, 2000);
                            }).always(function () {
                                abp.ui.clearBusy(_$form);
                            });
                        }
                    }
                }
            );
        }

        $('#SaveButton').click(function (e) {
            e.preventDefault();
            save();
        });
        $('#SubmitButton').click(function (e) {
            e.preventDefault();
            //MARC 09/08/2021
            //$('#StatusId').val(2);
            //save();
            //END

            //MARC 09/08/2021

            $('#DeliveredModal').modal('show');

            //END
        });

        //MARC 09/08/2021
        $('#DeliveredButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(2);
            save();

            //sales order items
            //var table = _$itemsTable.DataTable();
            //var table2 = _$deliveredTable.DataTable();
            //var form_data = table.rows().data();
            //var form_data2 = table2.rows().data();
            //var f = form_data;
            //var f2 = form_data2;

            //for (var i = 0; f.length > i; i++) {

            //    item = {};
            //    item["DeliveryReceiptId"] = "0";
            //    item["SalesOrderItemId"] = f[i][19];
            //    item["Id"] = f[i][18];
            //    item["ProductId"] = f[i][7];
            //    item["Description"] = f[i][8];
            //    item["Qty"] = f[i][9];
            //    if ($('#StatusId').val() === '2') {
            //        console.log(f2[i][0]);
            //        console.log(f2[i][1]);
            //        console.log(f2[i][2]);
            //        console.log($('.deliveredqty' + (i + 1)).html(f2[i][3]).val());
            //        console.log(f2[i][3]);
            //        console.log(f2[i][4]);
            //        console.log(f2[i][5]);
            //        console.log(f2[i][6]);
            //        console.log(f2[i][7]);
            //        item["DeliveredQty"] = f2[i][3];
            //    }
            //    item["UnitId"] = f[i][10];
            //    item["UnitPrice"] = f[i][3];
            //    item["Disc1"] = f[i][11];
            //    item["DiscType1"] = f[i][12];
            //    item["Disc2"] = f[i][13];
            //    item["DiscType2"] = f[i][14];
            //    item["Disc3"] = f[i][15];
            //    item["DiscType3"] = f[i][16];
            //    item["DiscTotal"] = f[i][4];
            //    item["Total"] = f[i][5];
            //    item["Reference"] = f[i][17];
                //viewData.deliveryreceiptitem.push(item);
            //}
        });
        //END

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
            var warehouseid = $('#DefaultSourceId').val(); //$('#DefaultSources').val()
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
            var $itemno = $(this).attr("data-itemno");
            var $productid = $(this).attr("data-id");
            var $qty = $(this).attr("data-qty");
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
            var $socolor = $(this).attr("data-color");
            var discountvalue = parseFloat($disctotal) / parseFloat($qty);
            var origprice = discountvalue + parseFloat($price);

            $('#EColor').val($socolor);
            $('#EProductId').val($productid);
            $('#EIndexNo').text($itemno);
            $('#EQuantity').val($qty);
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
            $('#EPrice').val(currencyFormat(origprice));
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
            var $price = $('#EPrice').val();

            var $disc1 = $('#EDiscount1').val();
            var $disc2 = $('#EDiscount2').val();
            var $disc3 = $('#EDiscount3').val();
            var $dtype1 = $('#EDiscountType1').val();
            var $dtype2 = $('#EDiscountType2').val();
            var $dtype3 = $('#EDiscountType3').val();
            var $perdescription = $('#EPerDescription').val();
            var $groupname = $('#EGroupName').val();
            var $EColor = $('#EColor').val();

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $perdescription === '') { return; }

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

            var table = _$itemsTable.DataTable();
            var temp = table.row($indexno).data();
            temp[1] = '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $EColor + '</span></small>';
            temp[2] = '<span class="text-muted">' + $quantity + '</span>&nbsp;<span class="text-muted">' + $unit + '</span>';
            temp[3] = lessprice;
            temp[4] = totaldiscount;
            temp[5] = total;
            temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
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
            temp[20] = $EColor;
            $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
            $('#ItemEditModal').modal('hide');
            computeTotal();
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
                        f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], parseInt(f[i][12]), f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17], f[i][18], f[i][19], f[i][20]]).draw();
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


        //Print
        function printPreviewActual() {
            var trackingNo = $('#TransportReceiptNo').val();
            var deliverycode = $('#SeriesCode').val();
            //var quotationcode = $('#SalesOrderCode').val();
            var refNo = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            var contactNo = $('#ContactNo').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentmobile = $('#ContactNo').val();
            var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#DeliveryAddress').val();
            var transdate = $('#TransactionTime').val();
            var subtotal = $('#Total').val();
            var nettotal = $('#NetTotal').val();
            var discounttotal = $('#DiscountTotal').val();
            var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var qtotal = $('#QuantityTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");
            var termname = $("#ContactPersons option:selected").html();
            var termsandconditions = $('#TermsAndConditions').val();

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            win.document.write('<html><head><title>' + deliverycode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row">');
            win.document.write('<div  class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 350px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:11px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style = "font-size:12px;">');

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
            win.document.write('<td>To</td>');
            win.document.write('<td class="font-weight-bold">' + clientname + '</td>');
            win.document.write('<td class="text-right">Code</td>');
            win.document.write('<td class="text-right">' + deliverycode + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">Contact Person</td>');
            win.document.write('<td class="font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('<td class="text-right">Ref</td>');
            win.document.write('<td class="text-right">' + refNo + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>Contact No.</td>');
            win.document.write('<td>' + contactNo + '</td>');

            win.document.write('<td class="text-right">Date</td>');
            win.document.write('<td class="text-right">' + transdate + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>Delivery Address</td>');
            win.document.write('<td class="text-mute" style="font-size:11px;">' + clientaddress + '</td>');
            //win.document.write('<td class="text-right">TEL No</td>');
            //win.document.write('<td class="text-right">' + clienttelephone + '</td>');
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
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px">Delivery Receipt</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            // Header

            // Body
            win.document.write(divToPrint.outerHTML);
            // Body

            // Footer


            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:12px">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="75%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">DISCOUNT</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + discounttotal + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
            //win.document.write('</tr>');

            //var tablecharges = _$chargesTable.DataTable();
            //var form_datacharges = tablecharges.rows().data();
            //var h = form_datacharges;

            //for (var k = 0; h.length > k; k++) {
            //    if (k === 0) {
            //        win.document.write('<tr>');
            //        win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
            //        win.document.write('<td class="font-weight-bold text-right">' + subtotal + '</td>');
            //        win.document.write('</tr>');
            //    }
            //    var sqiprice = parseFloat(h[k][4]);

            //    win.document.write('<tr>');
            //    win.document.write('<td class="font-weight-bold text-right text-danger">' + h[k][1] + '</td>');
            //    win.document.write('<td class="font-weight-bold text-right text-danger">' + currencyFormat(sqiprice) + '</td>');
            //    win.document.write('</tr>');
            //}


            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
            win.document.write('<td class="font-weight-bold text-right">' + qtotal + '</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');


            //TERM

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');

            win.document.write('<table class="" width="100%" style="font-size:12px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="30%"></th>');
            win.document.write('<th width="70%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            //win.document.write('<tbody>');
            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold">TERMS AND CONDITIONS:</td>');
            //win.document.write('<td class="text-left"></td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">1. VALIDITY</td>');
            //win.document.write('<td class="text-left">14 Working day(s)</td>');
            //win.document.write('</tr>');

            //var $paymentterms = $("#PaymentTerms option:selected").html();
            //var $deliverytypes = $("#DeliveryTypes option:selected").html();
            //var $taxtypes = $("#TaxTypes option:selected").html();
            //var $warrantytypes = $("#WarrantyTypes option:selected").html();

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">2. TERMS</td>');
            //win.document.write('<td class="text-left">' + $paymentterms + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">3. DELIVERY</td>');
            //win.document.write('<td class="text-left">' + $deliverytypes + ' upom receipt of confirmation and completion of all approved materials whatever comes later .</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">4. PRICE</td>');
            //win.document.write('<td class="text-left">' + $taxtypes + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">5. WARRANTY</td>');
            //win.document.write('<td class="text-left">' + $warrantytypes + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">6. QUOTATION DOES NOT INCLUDE</td>');
            //win.document.write('<td class="text-left text-danger">Other Charges</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row"></td>');
            //win.document.write('<td class="text-left text-danger">Permits, Elevator Fee</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row"></td>');
            //win.document.write('<td class="text-left text-danger">Non Standard Fabric</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row"></td>');
            //win.document.write('<td class="text-left text-danger">Mobilization Charges outside Metro Manila</td>');
            //win.document.write('</tr>');

            //win.document.write('</tbody>');
            //win.document.write('</table >');

            //win.document.write('</div>');
            //win.document.write('</div>');

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:12px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="60%"></th>');
            win.document.write('<th width="40%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            //win.document.write('<tr>');
            ////win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity bt signing on the space provided below, after which the sames quotaion shall become an official contract.</td>');
            //win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity bt signing on the space provided below.</td>');
            //win.document.write('<td class="text-left"></td>');
            //win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            //Notes

            //Signatory

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="75%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');


            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/>' + notes +'</td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');


            win.document.write('<tr>');
            win.document.write('<td></td>');
            win.document.write('<td class="text-left">Conforme:</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            //win.document.write('<td scope="row"><span  class="font-weight-bold">' + companyname + '</span><br/>' + companyaddress +'</td>');
            //win.document.write('<td class="font-weight-bold" scope="row">Transport Receipt No:<br/>' + trackingNo + '</td>');
            win.document.write('<td class="font-weight-bold" scope="row"><br/></td>');
            win.document.write('<td class="text-left font-weight-bold">' + clientname + '</td>');
            win.document.write('</tr>');


            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold" scope="row"></td>');
            win.document.write('<td class="text-left font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row">Account Specialist</td>');
            //win.document.write('<td class="text-left" style="font-size:11px">Signature overprinted name/ date</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row" style="font-size:11px">' + salesagentmobile + '</td>');
            //win.document.write('<td class="text-left"></td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td scope="row" style="font-size:11px">' + salesagentemail + '</td>');
            //win.document.write('<td class="text-left"></td>');
            //win.document.write('</tr>');

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

            //win.document.write('<tr>');
            //win.document.write('<td class="text-left">Noted:</td>');
            //win.document.write('<td scope="row" style="font-size:11px">' + notes + '</td>');
            //win.document.write('</tr>');

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

            //win.document.write('<tr>');
            //win.document.write('<td class="text-left font-weight-bold">Nick Balin</td>');
            //win.document.write('<td scope="row" style="font-size:11px"></td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="text-left">Business Development Manager</td>');
            //win.document.write('<td scope="row" style="font-size:11px"></td>');
            //win.document.write('</tr>');

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

        //Print
        function printPreviewActual2() {
            var trackingNo = $('#TransportReceiptNo').val();
            var deliverycode = $('#SeriesCode').val();
            //var quotationcode = $('#SalesOrderCode').val();
            var refNo = $('#SalesOrderCode').val();
            var clientOrderNo = $('#ClientOrderNo').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            var contactNo = $('#ContactNo').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentmobile = $('#ContactNo').val();
            var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#DeliveryAddress').val();
            var transdate = $('#TransactionTime').val();
            var subtotal = $('#Total').val();
            var nettotal = $('#NetTotal').val();
            var discounttotal = $('#DiscountTotal').val();
            var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var qtotal = $('#QuantityTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");
            var termname = $("#ContactPersons option:selected").html();
            var termsandconditions = $('#TermsAndConditions').val();

            //NEW
            var win = window.open('');
            var printContents = ` <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        /* Styles go here */
                        .page-header,
                        .page-header-space 
                        {
                            height: 260px;
                        }
            
                        .page-footer,
                        .page-footer-space 
                        {
                            height: 260px;
                        }
            
                        .page-footer 
                        {
                            position: fixed;
                            bottom: 0mm;
                            width: 100%;
                            height: 280px;
                            background-color: rgb(233 233 233 / 12%);
                            padding-left: 50px;
                        }
            
                        .page-header 
                        {
                            position: fixed;
                            top: 0mm;
                            width: 100%;
                            height: 265px;
                            background-color: rgb(233 233 233 / 12%);
                            padding-left: 95px;
                        }
            
                        .page {
                        page-break-after: auto;
                        padding - left: 5px;
                        margin-top: 20px;
                        }
            
                        @page {
                            margin - bottom: 10mm
                        }
            
                        @media print 
                        {
                            thead {
                            display: table-header-group;
                            /*margin-top: 900px;*/
                        }
        
                        tfoot {
                            display: table-footer-group;
                        }
        
                        button {
                            display: none;
                        }
        
                        body {
                            overflow: visible;
                            font-size: medium;
                            page-break-after: always;
                            margin-top: 20px;
                            }   
                        }
        
                        table2, th2, td2 {
                            border: 1px solid #000;
                        }          
                    </style>`;                
                printContents += '<link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" />';
            printContents += '</head><body style="font-family:fake_receiptregular">';
                printContents += '<div class="page-header">';
                printContents += '<table border="0" style="width:100%">';
                printContents += '<tr>';
                printContents += '<td style="height: 180px;">&nbsp;</td>';
                printContents += '</tr>';
                printContents += '<tr>';
                printContents += '<td>';
                printContents += '<table border="0" style="width:100%">';
                printContents += '<tr>';
            printContents += '<td style="height: 28px; width:67%; font-size:16px; font-family:fake_receiptregular;">' + clientname + '</td>';
            printContents += '<td style="height: 28px; font-size:18px; font-family:fake_receiptregular;">' + transdate + '</td>';
                printContents += '</tr>';
                printContents += '<tr>';
            printContents += '<td style="height: 28px; font-size:15px; font-family:fake_receiptregular;">' + clientaddress + '</td>';
                //TIN
                //printContents += '<td style="height: 28px;">TIN 4</td>';
                printContents += '<td style="height: 28px;"></td>';
                printContents += '</tr>';
                printContents += '<tr>';
            printContents += '<td style="height: 28px; font-size:18px; font-family:fake_receiptregular;">' + refNo + '</td>';
            printContents += '<td style="height: 28px; font-size:16px; font-family:fake_receiptregular;">' + clientOrderNo + '</td>';
                printContents += '</tr>';
                printContents += '</table>';

                printContents += '</td>';
                printContents += '</tr>';
                printContents += '</table>';
                printContents += '</div>';

                printContents += '<div class="page-footer">';
                printContents += '<table border="0" style="width:90%">';
                printContents += '<tr>';
                printContents += '<td>';
                printContents += '<table border="0" style="width:100%">';
                printContents += '<tr>';
            printContents += '<td style="width: 73%; font-size:15px; font-family:fake_receiptregular; vertical-align: top;"> CP-' + clientcontactperson + ' / ' + contactNo + ' </td>';
            printContents += '<td style="font-size:15px; font-family:fake_receiptregular; vertical-align: bottom;">' + notes + '</td>';
                printContents += '</tr>';

                printContents += '</table>';
                printContents += '</td>';
                printContents += '</tr>';
                printContents += '<tr>';
                printContents += '<td style="height: 70px;">&nbsp;</td>';
                printContents += '</tr>';
                printContents += '</table>';
                printContents += '</div>';

                printContents += '<table style="width:100%">';
                printContents += '<thead style="height: 250px;">';
                printContents += '<tr>';
                printContents += '<td>';
                printContents += '<div class="page-header-space"></div>';
                printContents += '</td>';
                printContents += '</tr>';
                printContents += '</thead>';
                printContents += '<tbody>';
                printContents += '<tr>';
                printContents += '<td>';
                printContents += '<div class="page">';
                ///print start
                printContents += divToPrint.outerHTML;
                ///print end
                printContents += '</div>';
                printContents += '</td>';
                printContents += '</tr>';
                printContents += '</tbody>';
                printContents += '<tfoot style="height: 260px;">';
                printContents += '<tr>';
                printContents += '<td>';
                printContents += '<div class="page-footer-space"></div>';
                printContents += '</td>';
                printContents += '</tr>';
                printContents += '</tfoot>';
                printContents += '</table>';
                printContents += '</body></html>';
            
            
                win.document.write(printContents);
            //END NEW

            ////START
            //var printContents = '';
            //var newWin = window.open("../view-resources/Views/Print/DRPrint.html");
            //printContents += '<div id="content" class="container_12 clearfix">';
            //printContents += '<div id="content-main" class="grid_12">';
            
            ////Header
            //printContents += '<div class="row">';
            //printContents += '<div class="col-lg-12" style="font-size: 13px">';

            ////Client
            //printContents += '<table class="" width="100%" >';

            //printContents += '<thead>';
            //printContents += '<tr>';
            //printContents += '<th width="15%"></th>';
            //printContents += '<th width="45%"></th>';
            //printContents += '<th width="15%"></th>';
            //printContents += '<th width="25%"></th>';
            //printContents += '</tr>';
            //printContents += '</thead>';

            //printContents += '<tbody>';

            //printContents += '<tr>';
            //printContents += '<td class="text-right"></td>';
            //printContents += '<td class="font-weight-bold">' + clientname + '</td>';
            //printContents += '<td class="text-right"></td>';
            //printContents += '<td class="text-right">' + transdate + '</td>';
            //printContents += '</tr>';
            
            //printContents += '</tbody>';

            //printContents += '</table >';
            ////end client

            ////adress
            //printContents += '<table class="" width="100%">';

            //printContents += '<thead>';
            //printContents += '<tr>';
            //printContents += '<th width="10%"></th>';
            //printContents += '<th width="90%"></th>';
            //printContents += '</tr>';
            //printContents += '</thead>';

            //printContents += '<tbody>';

            //printContents += '<tr>';
            //printContents += '<td scope="row"></td>';
            //printContents += '<td class="font-weight-bold">' + clientaddress + '</td>';
            //printContents += '</tr>';

            //printContents += '</tbody>';

            //printContents += '</table >';
            ////end address

            ////refNo
            //printContents += '<table class="" width="100%">';

            //printContents += '<thead>';
            //printContents += '<tr>';
            //printContents += '<th width="20%"></th>';
            //printContents += '<th width="40%"></th>';
            //printContents += '<th width="40%"></th>';
            //printContents += '</tr>';
            //printContents += '</thead>';

            //printContents += '<tbody>';

            //printContents += '<tr>';
            //printContents += '<td></td>';
            //printContents += '<td class="text-right">' + refNo + '</td>';
            //printContents += '<td class="text-right">' + clientOrderNo + '</td>';
            //printContents += '</tr>';


            //printContents += '</tbody>';

            //printContents += '</table >';
            ////end refNo

            //printContents += '</div>';
            //printContents += '</div>';
            ////end header

            //printContents += '<div class="row">';
            //printContents += '<br />';
            //printContents += '</div>';

            ////Mid
            //printContents += '<div class="row">';
            //printContents += '<div class="col-lg-12">';
            //printContents += '<table class="" width="100%">';

            //printContents += '<thead>';
            //printContents += '<tr>';
            //printContents += '<th width="100%"></th>';
            //printContents += '</tr>';
            //printContents += '</thead>';

            //printContents += '<tr>';
            //printContents += '<td scope="row" class="text-center font-weight-bold"><center>ACTUAL DELIVERY</center></td>';
            //printContents += '</tr>';

            //printContents += '</tbody>';
            //printContents += '</table >';
            //printContents += '</div>';
            //printContents += '</div>';
            ////End Mid

            //// Body
            //printContents += '<div class="row">';
            //printContents += '<div class="col-lg-12">';
            //printContents += divToPrint.outerHTML;
            //printContents += '</div>';
            //printContents += '</div>';
            //// Body

            //printContents += '<div class="row">';
            //printContents += '<br />';
            //printContents += '</div>';

            //printContents += '<div class="row">';
            //printContents += '<br />';
            //printContents += '</div>';

            //// Footer
            //printContents += '<div class="row">';
            //printContents += '<div class="col-lg-12">';
            //printContents += '<table class="" width="100%">';

            //printContents += '<thead>';
            //printContents += '<tr>';
            //printContents += '<th width="100%"></th>';
            //printContents += '</tr>';
            //printContents += '</thead>';

            //printContents += '<tr>';
            //printContents += '<td scope="row" class="text-center font-weight-bold"><center>*** Nothing follows ***</center></td>';
            //printContents += '</tr>';

            //printContents += '</tbody>';
            //printContents += '</table >';
            //printContents += '</div>';
            //printContents += '</div>';
            ////end footer
            //newWin.newDiv = printContents;
            ////END
            //console.log(newWin.newDiv);
            //newWin.init();
        }

        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual2();
        });

        //Datatable Add
        $("#EColor").keyup(function (event) {
            this.value = this.value.toUpperCase();
        });

        function isValid(str) {
            return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }
    });
})();