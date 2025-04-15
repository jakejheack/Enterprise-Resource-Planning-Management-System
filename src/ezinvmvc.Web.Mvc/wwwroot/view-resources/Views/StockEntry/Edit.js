abp.ui.block();

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
        var _clientService = abp.services.app.clientService;
        var _cpersonService = abp.services.app.contactPersonService;
        var _productPriceService = abp.services.app.productPriceService;
        var _productService = abp.services.app.productService;
        var _companyService = abp.services.app.companyService;
        var _commonService = abp.services.app.commonService;
        var _stockEntryService = abp.services.app.stockEntryService;
        var _vendorService = abp.services.app.vendorService;
        var _warehouseService = abp.services.app.warehouseService;
        var _$form = $('form[name=MainForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');
        var _$itemsTablePrintActual = $('#ItemsTablePrintActual');

        $("#ProductImage").hide();
        $("#EProductImage").hide();
        $('#divTable').hide();

        //MARC 09/01/2021
        $("#divDestinationWarehouse").hide();
        $("#divClient").hide();
        //$("#divDR").hide();
        //$("#divDRTD").hide();
        $("#divDRAC").hide();

        $("#StockEntryForm").validate({
            errorPlacement: function (error, element) {

                //check if element has class "kt_selectpicker"
                if (element.attr("class").indexOf("selectpicker") != -1) {
                    //get main div
                    var mpar = $(element).closest("div.bootstrap-select");
                    //insert after .dropdown-toggle div
                    error.insertAfter($('.dropdown-toggle', mpar));

                } else {
                    //for rest of the elements, show error in same way.
                    error.insertAfter(element);
                }
            }
        });
        

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

        function getparent() {
            var $id = $('#Id').val();
            _stockEntryService.getStockEntry({ id: $id }).done(function (result) {
                if (result === null) {
                    window.location.href = abp.appPath + 'StockEntry/Index';
                }
                $('#Prefix').val(result.prefix);
                //MARC 09/10/2021
                if ($('#Prefix').val() === 'AR') {
                    console.log($('#Prefix').val());
                    //$("#divDRTD").show();
                    $("#divDRAC").show();
                    $("#PrintMenuButton").show();
                }
                else {
                    //$("#divDRTD").hide();
                    $("#divDRAC").hide();
                    $("#PrintMenuButton").hide();
                }
                //END
                $('#Code').val(result.code);
                $('#SeriesTypeId').val(result.seriesTypeId);
                var qtransactiontime = new Date(result.transactionTime);
                $('#TransactionTime').val(getFormattedDate(qtransactiontime));
                var time = qtransactiontime.getHours() + ":" + qtransactiontime.getMinutes() + ":" + qtransactiontime.getSeconds();
                $('#Time').val(time);
                $('#StatusId').val(result.statusId);
                $('#Notes').val(result.notes);

                //MARC  09/13/2021
                //var transportreceipttime = new Date(result.transportReceiptTime);
                //$('#TransportReceiptTime').val(getFormattedDate(transportreceipttime));
                $('#ContactPerson').val(result.contactPerson);
                //$('#TransportReceiptNo').val(result.transportReceiptNo);
                //$('#VehicleNo').val(result.vehicleNo);
                //$('#DriverName').val(result.driverName);
                //$('#Distance').val(result.distance);
                $('#ContactNo').val(result.contactNo);
                $('#DeliveryAddress').val(result.deliveryAddress);
                $('#DrNumber').val(result.drNumber);
                //END

                $('#StatusBadge').text(result.status);
                switch (result.statusId) {
                    case 1: //Draft
                        $('#StatusBadge').addClass('badge badge-warning');
                        if ($('#SaveButton').length) {
                            $('#SaveButton').removeAttr('hidden');
                        }
                        if ($('#SubmitButton').length) {
                            $('#SubmitButton').removeAttr('hidden');
                        }
                        break;
                    case 2: //Released
                        $('#StatusBadge').addClass('badge badge-success');
                        if ($('#SaveButton').length) {
                            $('#SaveButton').removeAttr('hidden');
                        }
                        if ($('#ReceivedButton').length) {
                            $('#ReceivedButton').removeAttr('hidden');
                        }
                        if ($('#ActionButton').length) {
                            $('#ActionButton').removeAttr('hidden');
                        }
                        $('#EProductCode').prop('readonly', true);
                        $('#EProductName').prop('readonly', true);
                        $('#EPerDescription').prop('readonly', true);
                        $('#accordion').hide();
                        break;
                    case 3: // Completed
                        $('#StatusBadge').addClass('badge badge-primary');
                        $('#EProductCode').prop('readonly', true);
                        $('#EProductName').prop('readonly', true);
                        $('#EPerDescription').prop('readonly', true);
                        $('#EPrice').prop('readonly', true);
                        $('#EQuantity').prop('readonly', true);
                        $('#accordion').hide();
                        break;
                    case 4: // Cancelled
                        $('#StatusBadge').addClass('badge badge-danger');
                        break;
                    default:
                        $('#StatusBadge').addClass('badge badge-secondary');
                }
                switch (result.entryTypeId) {
                    case 1:
                        $('#SourceWarehouseLabel').text("Target Warehouse");
                        $("#divDestinationWarehouse").hide();
                        //$("#divClient").show();

                        break;
                    case 2:
                        $('#SourceWarehouseLabel').text("Target Warehouse");
                        $("#divDestinationWarehouse").hide();
                        //$("#divClient").show();

                        break;
                    case 3:
                        $('#SourceWarehouseLabel').text("Source Warehouse");
                        $("#divDestinationWarehouse").show();
                        //$("#divClient").hide();

                        break;
                    default:
                        $('#SourceWarehouseLabel').text("Source Warehouse");
                        $("#divDestinationWarehouse").show();

                }
                getcompanies(result.companyId);
                getentrytype(result.entryTypeId);
                getsources(result.defaultSourceId);

                $('#EntryTypes').val(result.entryTypeId);

                console.log(result.inventoryTypeId);
                getinventorytypeload(result.entryTypeId, result.inventoryTypeId);

                console.log($('#InventoryTypes').val());
                if (result.entryTypeId === '3') {
                    getdestinations(result.defaultDestinationId);
                }
                else {
                    getclient1(result.defaultDestinationId);
                }
                entrytypechange(result.entryTypeId.toString(), result.inventoryTypeId.toString());

                inventorytypechange(result.inventoryTypeId.toString());

                gettransporters(result.transporterId);
                gettransportmode(result.transportModeId);
                getvehicletype(result.vehicleTypeId);

                getitems($id);
                computeTotal();
            });
        }
        getparent();
        function getitems(id) {
            _stockEntryService.getStockEntryItemByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $seiid = result.items[i].id;
                    var $seiproductid = result.items[i].productId;
                    var $seiproductcode = result.items[i].productCode;
                    var $seiproductname = result.items[i].productName;
                    var $seiproductdescription = result.items[i].productDescription;
                    var $seiunitid = result.items[i].unitId;
                    var $seiunit = result.items[i].unit;
                    var $seiquantity = result.items[i].qty;
                    var $seiquantityrel = result.items[i].qtyRel;
                    var $seiprice = result.items[i].unitPrice;
                    var $seitotal = result.items[i].total;
                    var $seiimagename = result.items[i].imageName;
                    var $seiperdescription = result.items[i].description;

                    var seiprice = parseFloat($seiprice);
                    var seiquantity = parseFloat($seiquantity);
                    var seitotal = parseFloat($seitotal);
                    var seidatacount = dataTable.rows().count();
                    var seiitemno = seidatacount + 1;

                    dataTable.row.add([seiitemno,
                        '<a href="#" class="btn-link">' + $seiproductcode + '</a><br /><small><span class="text-muted">' + $seiproductname + '</span></small>',
                        '<span class="text-muted">' + $seiquantity + '</span>|<span class="text-muted">' + $seiunit + '</span>',
                        seiprice,
                        seitotal,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + seiitemno + '"  data-id="' + $seiproductid + '" data-unitid="' + $seiunitid + '" data-perdesc="' + $seiperdescription + '" data-qty="' + seiquantity + '" data-price="' + seiprice + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $seiproductid, $seiperdescription, $seiquantity, $seiunitid, $seiid, $seiquantityrel
                    ]).draw();

                    if ($seiimagename !== '' && $seiimagename !== null) {
                        //dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $seiproductcode + '</span><br/><img src="' + abp.appPath + 'products/' + $seiproductid + '/' + $seiimagename + '" style="height: 150px; width: 150px;"/>',
                        //'<span class="font-weight-bold">' + $seiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $seiproductdescription + '</span>',
                        //'<span class="text-muted">' + $seiquantity + '</span>',
                        //    seiprice,
                        //    seitotal]).draw();
                        dataTablePrintActual.row.add(['<span class="text-muted">' + $seiquantity + '</span>',
                            '<span class="text-muted">' + $seiunit + '</span>',
                            '<span class="font-weight-bold">' + $seiproductname + '</span>','<span class="text-muted" style="white-space: pre-wrap;">' + $seiproductdescription + '</span>']).draw();
                    }
                }
                computeTotal();
                abp.ui.unblock();
            });
        };
        function getcompanies(id) {
            var selectoptions = $('#Companies');
            selectoptions.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        selectoptions.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                        $('#CompanyAddress').val(result.items[i].companyAddress);
                    }
                    else {
                        selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                selectoptions.selectpicker('refresh');
            });
        }
        function getentrytype(id) {
            var selectoptions = $('#EntryTypes');
            selectoptions.empty();
            _commonService.getEntryTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    if (id === result.items[i].id) {
                        selectoptions.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                selectoptions.selectpicker('refresh');
            });
        }
        function getsources(id) {
            var selectoptions = $('#DefaultSources');
            selectoptions.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        selectoptions.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                selectoptions.selectpicker('refresh');
            });
        }
        function getdestinations(id) {
            var selectoptions = $('#DefaultDestinations');
            selectoptions.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        selectoptions.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                selectoptions.selectpicker('refresh');
            });
        }
        function getinventorytypeload(entrytypecode, inventorytypeid) {
            console.log(inventorytypeid);
            var selectoptions = $('#InventoryTypes');
            selectoptions.empty();
            _commonService.getInventoryTypesFiltered({ id: 0, name: '', entryTypeCode: entrytypecode }).done(function (result) {
                if (result.items.length > 1) {
                    selectoptions.append('<option value=0 >-- Select --</option>');
                }
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].id === inventorytypeid) {
                        selectoptions.append('<option selected value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                    else {
                        selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                selectoptions.selectpicker('refresh');
                //$('#InventoryTypes').val(inventorytypeid);
            });
        }
        function getinventorytype(entrytypecode) {
            var selectoptions = $('#InventoryTypes');
            selectoptions.empty();
            _commonService.getInventoryTypesFiltered({ id: 0, name: '', entryTypeCode: entrytypecode }).done(function (result) {
                if (result.items.length > 1) {
                    selectoptions.append('<option value=0 >-- Select --</option>');
                }
                for (var i = 0; i < result.items.length; i++) {
                    selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptions.selectpicker('refresh');
            });
        }

        //MARC 09/01/2021
        $('#EntryTypes').on('change', function (e) {
            getinventorytype($('#EntryTypes').val());
        });

        //MARC 09/01/2021
        $('#InventoryTypes').on('change', function (e) {
            var $inventorytypeid = $('#InventoryTypes').val();
            $("#divClient").hide();
            //$("#divDR").hide();
            inventorytypechange($inventorytypeid);
        });

        function inventorytypechange($entrytypeid, $inventorytypeid) {
            if ($inventorytypeid == '5' || $inventorytypeid == '7') {
                $("#divClient").show();
            }
            //if ($inventorytypeid == '8') {
            //    $("#divDR").show();
            //}
            if ($inventorytypeid == '1' || $inventorytypeid == '2') {
                $("#divClient").show();
            }
        }
        function getclient1(id) {
            console.log(id);
            if (id > 0) {
                _clientService.getClientDetails({ id: id }).done(function (result) {
                    console.log(result[0]);
                    $('#ClientId').val(result[0].id);
                    $('#ClientName').val(result[0].name);
                });
            }
        };
        //abp.ui.unblock();

        //Item Autocomplete
        var getproducts = function (request, response) {
            _productService.getProductByName({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name + ' ' + el.code,
                        value: el.id
                    };
                }));
            });
        };
        function getproduct() {
            var $productid = $('#ProductId').val();
            _productService.getProduct({ id: $productid }).done(function (result) {
                $('#ProductCode').val(result.code);
                $('#ProductName').val(result.name);
                $('#PerDescription').val(result.description);
                if (result.imageName !== null && result.imageName !== '') {
                    $("#ProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
                    $("#ProductImage").show();
                }
                else {
                    $("#ProductImage").hide();
                }
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
            $("#Price").val("0.00");
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
        function getproductstock() {
            $("#Stocks").val("0");
            var warehouseid = $('#DefaultSources').val();
            var $productid = $('#ProductId').val();
            _stockEntryService.getStockSummary({ filter: warehouseid + '|' + $productid + '||' }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var stocks = currencyFormat(result.items[i].qty);
                    $("#Stocks").val(result.items[i].qty ? stocks : "0");
                }
            });
        }

        var selectproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            //$("#ProductName").val(ui.item ? ui.item.label : "");
            getproduct();
            getproductunits();
            getproductprice();
            getproductstock();
            return false;
        };
        var focusproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item.value);
            //$("#ProductName").val(ui.item.label);
            //$("#PerDescription").val(ui.item.label);
            getproduct();
            getproductunits();
            getproductprice();
            getproductstock();
        };
        var changeproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            //$("#ProductName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#ProductCode").val("");
                $("#ProductName").val("");
                $("#Quantity").val("");
                $("#Price").val("");
                $("#PerDescription").val("");
                var units = $('#Units');
                units.empty();
                units.selectpicker('refresh');
                $("#ProductImage").hide();
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

        //Edit Item Autocomplete
        var editgetproducts = function (request, response) {
            _productService.getProductByName({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name + ' ' + el.code,
                        value: el.id
                    };
                }));
            });
        };
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
        //function gettaxtype(id) {
        //    var taxtypes = $('#TaxTypes');
        //    taxtypes.empty();
        //    _commonService.getTaxTypes().done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            if (id === result.items[i].id) {
        //                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
        //            }
        //            else {
        //                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
        //            }

        //        }
        //        taxtypes.selectpicker('refresh');
        //    });
        //}
        function editgetproductunits(unitid) {
            var units = $('#EUnits');
            var $productid = $('#EProductId').val();
            units.empty();
            _productService.getProductUnits({
                id: $productid
            }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (unitid === result.items[i].id) {
                        units.append('<option value=' + result.items[i].unitId + ' selected>' + result.items[i].unit + '</option>');
                    }
                    else {
                        units.append('<option value=' + result.items[i].unitId + '>' + result.items[i].unit + '</option>');
                    }
                }
                units.selectpicker('refresh');
            });
        }
        function editgetproductprice() {
            $("#EPrice").val("0.00");
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
        function editgetproductstock() {
            $("#EStocks").val("0");
            var warehouseid = $('#DefaultSources').val();
            var $productid = $('#EProductId').val();
            _stockEntryService.getStockSummary({ filter: warehouseid + '|' + $productid + '||' }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var stocks = currencyFormat(result.items[i].qty);
                    $("#EStocks").val(result.items[i].qty ? stocks : "0");
                }
            });
        }
        var editselectproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item ? ui.item.value : "");
            //$("#EProductName").val(ui.item ? ui.item.label : "");
            editgetproduct();
            editgetproductunits(0);
            editgetproductprice();
            editgetproductstock();
            return false;
        };
        var editfocusproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item.value);
            //$("#EProductName").val(ui.item.label);
            //$("#PerDescription").val(ui.item.label);
            editgetproduct();
            editgetproductunits(0);
            editgetproductprice();
            editgetproductstock();
        };
        var editchangeproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item ? ui.item.value : "");
            //$("#EProductName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#EProductName").val("");
                $("#EProductName").val("");
                $("#EProductCode").val("");
                $("#EQuantity").val("");
                $("#EPrice").val("");
                $("#EPerDescription").val("");
                var units = $('#Units');
                units.empty();
                units.selectpicker('refresh');
                $("#EProductImage").hide();
            }
        };
        $("#EProductName").autocomplete({
            source: editgetproducts,
            select: editselectproduct,
            focus: editfocusproduct,
            minLength: 2,
            delay: 100,
            change: editchangeproduct
        });
        $('#EUnits').on('change', function (e) {
            editgetproductprice();
        });
        //Edit Item Autocomplete

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
                getcontactpersonperclient();
            });
        }
        function getcontactpersonperclient() {
            var $clientid = $('#ClientId').val();
            _cpersonService.getContactPersonsFiltered({ id: 0, reference: "Client", referenceId: $clientid, filter: "" }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sqcid = result.items[i].id;
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    $('#ContactPerson').val(result.items[i].fullName);
                    $('#ContactNo').val(result.items[i].mobileNo);
                }
            });
        }
        var selectclient = function (event, ui) {
            event.preventDefault();
            $("#ClientId").val(ui.item ? ui.item.value : "0");
            $("#ClientName").val(ui.item ? ui.item.label : "");
            getclient();
            return false;
        };
        var focusclient = function (event, ui) {
            event.preventDefault();
            $("#ClientId").val(ui.item.value);
            $("#ClientName").val(ui.item.label);
            //getProducts();
        };
        var changeclient = function (event, ui) {
            event.preventDefault();
            $("#ClientId").val(ui.item ? ui.item.value : "0");
            $("#ClientName").val(ui.item ? ui.item.label : "");
            //getProducts();
            if (ui.item === null) {
                $('#ClientId').val('0');
                $('#ClientName').val('');

                //$('#Address').val('');
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

        //Datatable Add
        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [3, 4, 6, 7, 8, 9, 10, 11]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [3, 4]
            },
            {
                className: 'text-center',
                targets: [0, 2]
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
                targets: [6, 7, 8, 9]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [3, 4]
            },
            {
                className: 'text-center',
                targets: [0, 2]
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
                //    targets: [0, 1, 2, 4]
                //},
                //{
                //    visible: false,
                //    targets:[3]
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

        function addnewitem() {
            var $stocks = $('#Stocks').val();
            var $productid = $('#ProductId').val();
            var $productcode = $('#ProductCode').val();
            var $productname = $('#ProductName').val();
            var $unitid = $('#Units').val();
            var $unit = $("#Units option:selected").html();
            var $quantity = $('#Quantity').val();
            var $price = $('#Price').val();
            var $perdescription = $('#PerDescription').val();

            if ($('#DefaultSources').val() === '0') {
                abp.notify.error('Select your Source Warehouse.', 'Warning');
                return;
            }
            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $stocks === '') { return; }

            var stocks = parseFloat($stocks);
            var quantity = parseFloat($quantity);
            var quantityadded = getAddQuantity($productid, -1);
            if ($('#EntryTypes').val() === '1' || $('#EntryTypes').val() === '3') {
                if (quantity + quantityadded > stocks) {
                    abp.notify.error('Not enough stocks.', 'Warning');
                    return;
                }
            }

            var price = parseFloat($price.replace(/,/g, ''));

            var total = price * quantity;
            var datacount = dataTable.rows().count();
            var itemno = datacount + 1;
            dataTable.row.add([itemno,
                '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
                '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
                price,
                total,
                '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + price + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                $productid, $perdescription, $quantity, $unitid, 0, $quantity
            ]).draw();
            computeTotal();
            $('#ProductId').val("");
            $('#ProductCode').val("");
            $('#ProductName').val("");
            $('#Units').empty();
            $('#Units').selectpicker('refresh');
            $('#Quantity').val("");
            $('#Price').val("");
            $('#PerDescription').val("");
            $('#Stocks').val("");
            $("#ProductImage").hide();
            abp.notify.success('Item #' + itemno + ' added!', 'Success');
        }
        function getAddQuantity(productId, indexNo) {
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            var retval = 0;
            for (var i = 0; f.length > i; i++) {
                var itemid = f[i][6];
                var itemqty = parseFloat(f[i][8]);
                if (parseInt(productId) === itemid && indexNo !== i) {
                    retval = retval + itemqty;
                }
            }
            return retval;
        }
        //function verifystocks(productId, indexNo) {
        //    var table = _$itemsTable.DataTable();
        //    var form_data = table.rows().data();
        //    var f = form_data;
        //    var retval = 0;
        //    for (var i = 0; f.length > i; i++) {
        //        var itemid = f[i][6];
        //        var itemqty = parseFloat(f[i][8]);
        //        if (parseInt(productId) === itemid && indexNo !== i) {
        //            retval = retval + itemqty;
        //        }
        //    }
        //    return retval;
        //}
        function computeTotal() {
            var grandtotal = 0;
            dataTable.column(8).data()
                .each(function (value, index) {
                    var $grandtotal = parseFloat(value);
                    grandtotal = grandtotal + $grandtotal;
                });
            $('#GrandTotal').val(currencyFormat(grandtotal));
        }
        function update() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();


            if (formdata.EntryTypeId === '0') {
                abp.notify.warn('Select your Entry Type.', 'Warning');
                return;
            }
            if (formdata.DefaultSourceId === '0') {
                abp.notify.warn('Select your Source Warehouse.', 'Warning');
                return;
            }

            if (formdata.EntryTypeId === '1' || formdata.EntryTypeId === '2') {
                formdata.DefaultDestinationId = formdata.DefaultSourceId;
            }
            if (formdata.EntryTypeId === '3') {
                if (formdata.DefaultDestinationId === '0') {
                    abp.notify.warn('Select your Destination Warehouse.', 'Warning');
                    return;
                }
                if (formdata.DefaultDestinationId === formdata.DefaultSourceId) {
                    abp.notify.warn('Select different Destination Warehouse.', 'Warning');
                    return;
                }
            }

            //items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            if (f.length === 0) {
                abp.notify.warn('Add your item first.', 'Warning');
                return;
            }

            var $entrytypeid = $('#EntryTypes').val();
            var $clientId = $('#ClientId').val();
            var DefaultDestinationId = "";
            if ($entrytypeid === '3') {
                DefaultDestinationId = formdata.DefaultDestinationId;
            }
            else {
                DefaultDestinationId = $clientId;
            }
          
            var viewData = {
                stockentry: {
                    "id": formdata.Id,
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": formdata.Prefix,
                    "code": formdata.Code,
                    "transactionTime": formdata.TransactionTime + ' ' + formdata.Time,
                    "entryTypeId": formdata.EntryTypeId,
                    "inventoryTypeId": formdata.InventoryTypeId,
                    "defaultSourceId": formdata.DefaultSourceId,
                    //"defaultDestinationId": formdata.DefaultDestinationId,
                    "defaultDestinationId": DefaultDestinationId,

                    //MARC 09/13/2021
                    "contactPerson": formdata.ContactPerson,
                    "contactNo": formdata.ContactNo,
                    "deliveryAddress": formdata.DeliveryAddress,
                    "transporterId": '0', // formdata.TransporterId,
                    "transportModeId": '0', //formdata.TransportModeId,
                    "transportReceiptNo": formdata.TransportReceiptNo,
                    "transportReceiptTime": formdata.TransportReceiptTime,
                    "vehicleTypeId": '0', //formdata.VehicleTypeId,
                    "vehicleNo": formdata.VehicleNo,
                    "driverName": formdata.DriverName,
                    "distance": formdata.Distance,
                    "drNumber": formdata.DrNumber,
                    //END

                    "notes": formdata.Notes,
                    "statusId": formdata.StatusId,
                },
                stockentryitem: []
            };
            disabled.attr('disabled', 'disabled');

            for (var i = 0; f.length > i; i++) {
                item = {};
                item["Id"] = f[i][10];
                item["StockEntryId"] = "0";
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022
                item["ProductId"] = f[i][6];
                item["Description"] = f[i][7];
                item["QtyRel"] = f[i][11];
                item["Qty"] = f[i][8];
                item["UnitId"] = f[i][9];
                item["UnitPrice"] = f[i][3];
                item["Total"] = f[i][4];
                viewData.stockentryitem.push(item);
            }
            var tabledeleted = _$itemsTableDeleted.DataTable();
            var form_deleteddata = tabledeleted.rows().data();
            var g = form_deleteddata;

            for (var j = 0; g.length > j; j++) {
                item = {};
                item["Id"] = g[j][10];
                item["StockEntryId"] = "0";
                item["ProductId"] = g[j][6];
                item["Description"] = g[j][7];
                item["QtyRel"] = g[j][11];
                item["Qty"] = g[j][8];
                item["UnitId"] = g[j][9];
                item["UnitPrice"] = g[j][3];
                item["Total"] = g[j][4];
                item["IsDeleted"] = 1;
                viewData.stockentryitem.push(item);
            }

            var mess = "";
            if (formdata.StatusId === '1') {
                mess = "Stock entry will be updated."
            }
            else {
                mess = "Stock entry will be finalized."
            }

            abp.message.confirm(
                mess,
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _stockEntryService.updateStockEntry(viewData).done(function (result) {
                            abp.message.success('Stock Entry updated', 'Success');
                            //var url = 'Index';
                            //setTimeout(function () {
                            //    window.location.href = url;
                            //}, 2000);
                            location.reload(true);
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }
        $('#EntryTypes').on('change', function (e) {
            //e.preventDefault();
            //$("#Stocks").val("");
            //$("#ProductCode").val("");
            //$("#ProductName").val("");
            //$("#Quantity").val("");
            //$("#Price").val("");
            //$("#PerDescription").val("");
            //var units = $('#Units');
            //units.empty();
            //units.selectpicker('refresh');
            //$("#ProductImage").hide();
            //$("#EStocks").val("");
            //$("#EProductCode").val("");
            //$("#EProductName").val("");
            //$("#EQuantity").val("");
            //$("#EPrice").val("");
            //$("#EPerDescription").val("");
            //var eunits = $('#EUnits');
            //eunits.empty();
            //eunits.selectpicker('refresh');
            //$("#EProductImage").hide();
            //_$itemsTable.dataTable().fnClearTable();
            //_$itemsTable.dataTable().fnDraw();
            //computeTotal();

            //var $entrytypeid = $('#EntryTypes').val();
            //if ($entrytypeid === '1') {
            //    $('#SourceWarehouseLabel').text("Target Warehouse");
            //    $("#divDestinationWarehouse").hide();
            //    $("#divClient").show();
            //}
            //else if ($entrytypeid === '2') {
            //    $('#SourceWarehouseLabel').text("Target Warehouse");
            //    $("#divDestinationWarehouse").hide();
            //    $("#divClient").show();

            //}
            //else if ($entrytypeid === '3') {
            //    $('#SourceWarehouseLabel').text("Source Warehouse");
            //    $("#divDestinationWarehouse").show();
            //    $("#divClient").hide();

            //}
            //else {
            //    $('#SourceWarehouseLabel').text("Source Warehouse");
            //    $("#divDestinationWarehouse").show();
            //}
            var $entrytypeid = $('#EntryTypes').val();
            var $inventorytypeid = $('#InventoryTypes').val();
            entrytypechange($entrytypeid, $inventorytypeid);

        });

        function entrytypechange($entrytypeid, $inventorytypeid) {
            console.log('entrytypechange ' + $entrytypeid);
            if ($entrytypeid === '1') {
                $('#SourceWarehouseLabel').text("Target Warehouse");
                console.log('1 hide destination');
                $("#divDestinationWarehouse").hide();
                //MARC 09/01/2021
                $("#divClient").hide();
                //$("#divDR").hide();
                if ($inventorytypeid == '1' || $inventorytypeid == '2') {
                    $("#divClient").show();
                }
                //END MARC 09/01/2021
            }
            else if ($entrytypeid === '2') {
                $('#SourceWarehouseLabel').text("Target Warehouse");
                console.log('2 hide destination');
                $("#divDestinationWarehouse").hide();
                //MARC 09/01/2021
                $("#divClient").hide();
                //$("#divDR").hide();
                if ($inventorytypeid == '5' || $inventorytypeid == '7') {
                    $("#divClient").show();
                }
                //if ($inventorytypeid == '8') {
                //    $("#divDR").show();
                //}
                //END MARC 09/01/2021
            }
            else if ($entrytypeid === '3') {
                $('#SourceWarehouseLabel').text("Source Warehouse");
                console.log('3 show destination');
                $("#divDestinationWarehouse").show();
                $("#divClient").hide();
                //$("#divDR").hide();
            }
            else {
                $('#SourceWarehouseLabel').text("Source Warehouse");
                console.log('else show destination');
                $("#divDestinationWarehouse").show();
                $("#divClient").hide();
                //$("#divDR").hide();

            }
        }

        $('#DefaultSources').on('change', function (e) {
            //e.preventDefault();
            //$("#Stocks").val("");
            //$("#ProductCode").val("");
            //$("#ProductName").val("");
            //$("#Quantity").val("");
            //$("#Price").val("");
            //$("#PerDescription").val("");
            //var units = $('#Units');
            //units.empty();
            //units.selectpicker('refresh');
            //$("#ProductImage").hide();
            //$("#EStocks").val("");
            //$("#EProductCode").val("");
            //$("#EProductName").val("");
            //$("#EQuantity").val("");
            //$("#EPrice").val("");
            //$("#EPerDescription").val("");
            //var eunits = $('#EUnits');
            //eunits.empty();
            //eunits.selectpicker('refresh');
            //$("#EProductImage").hide();
            //_$itemsTable.dataTable().fnClearTable();
            //_$itemsTable.dataTable().fnDraw();
            //computeTotal();
        });
        $('#SaveButton').click(function (e) {
            e.preventDefault();
            update();
        });
        $('#SubmitButton').click(function (e) {
            e.preventDefault();
            var $entrytypeid = $('#EntryTypes').val();
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

            $('#Time').val(time);
            if ($entrytypeid === '1' || $entrytypeid === '2') {
                $('#StatusId').val(3);
            }
            else if ($entrytypeid === '3') {
                $('#StatusId').val(2);
            }
            update();
        });
        $('#ReceivedButton').click(function (e) {
            e.preventDefault();
            var $entrytypeid = $('#EntryTypes').val();
            $('#StatusId').val(3);
            update();
        });

        _$itemsTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$itemsTable.DataTable();
            deleteitem(dtRow[0].rowIndex - 1);
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            rearrange();
            computeTotal();
            abp.notify.warn('Item #' + dtRow[0].rowIndex + ' deleted!', 'Warning');

        });

        function deleteitem(indexno) {
            var dtable = _$itemsTable.DataTable();
            var dform_data = dtable.rows().data();
            var f = dform_data;
            for (var i = 0; f.length > i; i++) {
                if (indexno === i) {
                    dataTableDeleted.row.add([0,
                        '',
                        '',
                        f[i][3],
                        f[i][4],
                        '',
                        f[i][6], f[i][7], f[i][8], f[i][9], f[i][10], f[i][11]
                    ]).draw();
                }
            }
        }

        _$itemsTable.on('click', 'a.edit-item', function (e) {
            e.preventDefault();
            var $itemno = $(this).attr("data-itemno");
            var $productid = $(this).attr("data-id");
            var $qty = $(this).attr("data-qty");
            var $unitid = $(this).attr("data-unitid");
            var $perdescription = $(this).attr("data-perdesc");
            var $price = $(this).attr("data-price");
            $('#EProductId').val($productid);
            $('#EIndexNo').text($itemno);
            editgetproduct();
            editgetproductunits($unitid);
            editgetproductstock();
            $('#EQuantity').val($qty);
            $('#EPrice').val($price);
            $('#EPerDescription').val($perdescription);
        });

        // Delete product unit record
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            addnewitem();
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
            var $perdescription = $('#EPerDescription').val();
            var $stocks = $('#EStocks').val();

            if ($('#EntryTypes').val() === '0') {
                abp.notify.error('Select your Transaction Type.', 'Warning');
                return;
            }
            if ($('#DefaultSources').val() === '0') {
                abp.notify.error('Select your Source Warehouse.', 'Warning');
                return;
            }

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $stocks === '') {
                $('#ItemEditModal').modal('hide'); return;
            }
            var stocks = parseFloat($stocks);
            var quantity = parseFloat($quantity);
            var quantityadded = getAddQuantity($productid, $indexno);
            if ($('#EntryTypes').val() === '1' || $('#EntryTypes').val() === '3') {
                if (quantity + quantityadded > stocks) {
                    abp.notify.error('Not enough stocks.', 'Warning');
                    return;
                }
            }

            var price = parseFloat($price.replace(/,/g, ''));
            var total = price * quantity;

            var table = _$itemsTable.DataTable();
            var temp = table.row($indexno).data();
            temp[1] = '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>';
            temp[2] = '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>';
            temp[3] = price;
            temp[4] = total;
            temp[5] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + price + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[6] = $productid;
            temp[7] = $perdescription;
            temp[8] = $quantity;
            temp[9] = $unitid;
            $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
            $('#ItemEditModal').modal('hide');
            computeTotal();
            abp.notify.info('Item #' + $('#EIndexNo').text() + ' updated!', 'Info');
        });
        //Datatable Add

        function rearrange() {
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            for (var i = 0; f.length > i; i++) {
                var temp = table.row(i).data();
                var itemno = i + 1;

                var $productid = f[i][6];
                var $unitid = f[i][9];
                var $perdescription = f[i][7];
                var $quantity = f[i][8];
                var $price = f[i][3];

                temp[0] = itemno;
                temp[5] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }
        }

        //Print
        function printPreviewActual() {
            var trackingNo = $('#TransportReceiptNo').val();
            var deliverycode = $('#Code').val();
            //var quotationcode = $('#SalesOrderCode').val();
            //var refNo = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            //var clienttelephone = $('#ClientTelephone').val();
            //var clientproject = $('#Project').val();
            //var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            var contactNo = $('#ContactNo').val();

            //var salesagent = $('#SalesAgent').val();
            //var salesagentmobile = $('#ContactNo').val();
            //var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#DeliveryAddress').val();
            var transdate = $('input[name="TransactionTime"]').val();
            var subtotal = $('#Total').val();
            //var nettotal = $('#NetTotal').val();
            //var discounttotal = $('#DiscountTotal').val();
            //var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");
            //var termname = $("#ContactPersons option:selected").html();
            //var termsandconditions = $('#TermsAndConditions').val();

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
            win.document.write('<td class="text-right"></td>');
            win.document.write('<td class="text-right"></td>');
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


            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
            win.document.write('<td class="font-weight-bold text-right">' + grandtotal + '</td>');
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
            win.document.write('<td><br/>' + notes + '</td>');
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

        function printPreviewActual2() {
            var trackingNo = $('#TransportReceiptNo').val();
            var deliverycode = $('#Code').val();
            //var quotationcode = $('#SalesOrderCode').val();
            //var refNo = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            //var clienttelephone = $('#ClientTelephone').val();
            //var clientproject = $('#Project').val();
            //var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            var contactNo = $('#ContactNo').val();

            //var salesagent = $('#SalesAgent').val();
            //var salesagentmobile = $('#ContactNo').val();
            //var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#DeliveryAddress').val();
            var transdate = $('input[name="TransactionTime"]').val();
            var subtotal = $('#Total').val();
            //var nettotal = $('#NetTotal').val();
            //var discounttotal = $('#DiscountTotal').val();
            //var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");

            var inventoryType = $('#InventoryTypes option:selected').text();

            //var win = window.open('');
            var printContents = '';
            var newWin = window.open("../view-resources/Views/Print/DeliveryPrint.html");

            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //printContents += '<html><head><title>' + deliverycode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>';
            printContents += '<div id="content" class="container_12 clearfix">';
            printContents += '<div id="content-main" class="grid_12">';

            //Header
            printContents += '<div class="row">';
            printContents += '<div class="col-lg-12">';

            //Client
            printContents += '<table class="" width="100%">';

            printContents += '<thead>';
            printContents += '<tr>';
            printContents += '<th width="15%"></th>';
            printContents += '<th width="45%"></th>';
            printContents += '<th width="15%"></th>';
            printContents += '<th width="25%"></th>';
            printContents += '</tr>';
            printContents += '</thead>';

            printContents += '<tbody>';

            printContents += '<tr>';
            printContents += '<td class="text-right"></td>';
            printContents += '<td class="font-weight-bold">' + clientname + '</td>';
            printContents += '<td class="text-right"></td>';
            printContents += '<td class="text-right">' + transdate + '</td>';
            printContents += '</tr>';

            printContents += '</tbody>';

            printContents += '</table >';
            //end client

            //adress
            printContents += '<table class="" width="100%">';

            printContents += '<thead>';
            printContents += '<tr>';
            printContents += '<th width="10%"></th>';
            printContents += '<th width="90%"></th>';
            printContents += '</tr>';
            printContents += '</thead>';

            printContents += '<tbody>';

            printContents += '<tr>';
            printContents += '<td scope="row"></td>';
            printContents += '<td class="font-weight-bold">' + clientaddress + '</td>';
            printContents += '</tr>';

            printContents += '</tbody>';

            printContents += '</table >';
            //end address

            //refNo
            printContents += '<table class="" width="100%">';

            printContents += '<thead>';
            printContents += '<tr>';
            printContents += '<th width="20%"></th>';
            printContents += '<th width="40%"></th>';
            printContents += '<th width="40%"></th>';
            printContents += '</tr>';
            printContents += '</thead>';

            printContents += '<tbody>';

            printContents += '<tr>';
            printContents += '<td></td>';
            printContents += '<td class="text-right">' + inventoryType + '</td>';
            printContents += '<td class="text-right"></td>';
            printContents += '</tr>';


            printContents += '</tbody>';

            printContents += '</table >';
            //end refNo

            printContents += '</div>';
            printContents += '</div>';
            //end header

            printContents += '<div class="row">';
            printContents += '<br />';
            printContents += '</div>';

            printContents += '<div class="row">';
            printContents += '<br />';
            printContents += '</div>';

            printContents += '<div class="row">';
            printContents += '<br />';
            printContents += '</div>';

            //Mid
            printContents += '<div class="row">';
            printContents += '<div class="col-lg-12">';
            printContents += '<table class="" width="100%">';

            printContents += '<thead>';
            printContents += '<tr>';
            printContents += '<th width="100%"></th>';
            printContents += '</tr>';
            printContents += '</thead>';

            printContents += '<tr>';
            printContents += '<td scope="row" class="text-center font-weight-bold"><center>ACTUAL DELIVERY</center></td>';
            printContents += '</tr>';

            printContents += '</tbody>';
            printContents += '</table >';
            printContents += '</div>';
            printContents += '</div>';
            //End Mid

            // Body
            printContents += '<div class="row">';
            printContents += '<div class="col-lg-12">';
            printContents += divToPrint.outerHTML;
            printContents += '</div>';
            printContents += '</div>';
            // Body

            printContents += '<div class="row">';
            printContents += '<br />';
            printContents += '</div>';

            printContents += '<div class="row">';
            printContents += '<br />';
            printContents += '</div>';

            // Footer
            printContents += '<div class="row">';
            printContents += '<div class="col-lg-12">';
            printContents += '<table class="" width="100%">';

            printContents += '<thead>';
            printContents += '<tr>';
            printContents += '<th width="100%"></th>';
            printContents += '</tr>';
            printContents += '</thead>';

            printContents += '<tr>';
            printContents += '<td scope="row" class="text-center font-weight-bold"><center>*** Nothing follows ***</center></td>';
            printContents += '</tr>';

            printContents += '</tbody>';
            printContents += '</table >';
            printContents += '</div>';
            printContents += '</div>';
            //end footer

            newWin.newDiv = printContents;
            console.log(newWin.newDiv);
            //newWin.init();
        }

        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual3();
        });
        function printPreviewActual3() {
            var trackingNo = $('#TransportReceiptNo').val();
            var deliverycode = $('#Code').val();
            //var quotationcode = $('#SalesOrderCode').val();
            //var refNo = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            //var clienttelephone = $('#ClientTelephone').val();
            //var clientproject = $('#Project').val();
            //var requestcode = $('#QuotationCode').val();
            var notes = $('#Notes').val();
            var contactNo = $('#ContactNo').val();

            //var salesagent = $('#SalesAgent').val();
            //var salesagentmobile = $('#ContactNo').val();
            //var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#DeliveryAddress').val();
            var transdate = $('input[name="TransactionTime"]').val();
            var subtotal = $('#Total').val();
            //var nettotal = $('#NetTotal').val();
            //var discounttotal = $('#DiscountTotal').val();
            //var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");

            var inventoryType = $('#InventoryTypes option:selected').text();

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
                    </style>
                </head> <body>`;
            printContents += '<div class="page-header">';
            printContents += '<table border="0" style="width:100%">';
            printContents += '<tr>';
            printContents += '<td style="height: 160px;">&nbsp;</td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td>';
            printContents += '<table border="0" style="width:100%">';
            printContents += '<tr>';
            printContents += '<td style="height: 28px;width:72%;">' + clientname + '</td>';
            printContents += '<td style="height: 28px;">' + transdate + '</td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="height: 28px;">' + clientaddress + '</td>';
            //TIN
            //printContents += '<td style="height: 28px;">TIN 4</td>';
            printContents += '<td style="height: 28px;"></td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="height: 28px;">' + inventoryType + '</td>';
            //printContents += '<td style="height: 28px;">' + clientOrderNo + '</td>';
            printContents += '<td style="height: 28px;"></td>';
            printContents += '</tr>';
            printContents += '</table>';

            printContents += '</td>';
            printContents += '</tr>';
            printContents += '</table>';
            printContents += '</div>';

            printContents += '<div class="page-footer">';
            printContents += '<table border="0" style="width:100%">';
            printContents += '<tr>';
            printContents += '<td>';
            printContents += '<table border="0" style="width:100%">';
            printContents += '<tr>';
            printContents += '<td style="width: 63%;">&nbsp;</td>';
            printContents += '<td>' + notes + '</td>';
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

        }

    });
})();
