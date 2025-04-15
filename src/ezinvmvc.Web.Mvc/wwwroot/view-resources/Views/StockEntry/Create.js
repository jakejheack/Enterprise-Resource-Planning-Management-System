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
        var _drService = abp.services.app.deliveryReceiptService;
        var _$form = $('form[name=StockEntryForm]');
        var _$itemsTable = $('#ItemsTable');
        $("#ProductImage").hide();
        $("#EProductImage").hide();

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


        //function getseriestype(companyid) {
        //    var series = $('#Series');
        //    series.empty();
        //    _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: 107, companyId: companyid }).done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
        //        }
        //        series.selectpicker('refresh');
        //    });
        //}
        function getseriestype(companyid) {
            var series = $('#Series');
            series.empty();
            series.append('<option value="" >-- Select --</option>');
            _commonService.getSeriesTypesFilteredCross({ id: 8, id2: 16, transactionCode: 0, companyId: companyid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
                }
                series.selectpicker('refresh');
            });
        }

        $('#Series').on('change', function (e) {
            var sel = $('#Series').find("option:selected").text()
            console.log(sel);
            if (sel === 'AR') {
                //$("#divDRTD").show();
                $("#divDRAC").show();

                //$("#Transporter").prop('required', true);
                //$("#TransportReceiptNo").prop('required', true);
                //$("#TransportReceiptNo").prop('required', true);
                //$('input[name="Transporter"]').prop('required', true);
                //$("#VehicleNo").prop('required', true);
                //$("#VehicleType").prop('required', true); 
                //$("#DriverName").prop('required', true);
                //$("#Distance").prop('required', true);
                //$("#ContactPerson").prop('required', true);
                //$("#ContactNo").prop('required', true);
                //$("#DeliveryAddress").prop('required', true);
                //$("#DriverName").prop('required', true);

            }
            else {
                //$("#divDRTD").hide();
                $("#divDRAC").hide();

                //$("#Transporter").prop('required', false);
                //$("#TransportReceiptNo").prop('required', false);
                //$("#TransportReceiptNo").prop('required', false);
                //$('input[name="Transporter"]').prop('required', false);
                //$("#VehicleNo").prop('required', false);
                //$("#VehicleType").prop('required', false);
                //$("#DriverName").prop('required', false);
                //$("#Distance").prop('required', false);
                //$("#ContactPerson").prop('required', false);
                //$("#ContactNo").prop('required', false);
                //$("#DeliveryAddress").prop('required', false);
                //$("#DriverName").prop('required', false);

                //$("#Transporter").val('');
                //$("#TransportReceiptNo").val('');
                //$("#TransportReceiptNo").val('');
                //$('input[name="Transporter"]').val('');
                //$("#VehicleNo").val('');
                //$("#VehicleType").val('');
                //$("#DriverName").val('');
                //$("#Distance").val('');
                //$("#ContactPerson").val('');
                //$("#ContactNo").val('');
                //$("#DeliveryAddress").val('');
                //$("#DriverName").val('');
            }
        });

        function getentrytype() {
            var selectoptions = $('#EntryTypes');
            selectoptions.empty();
            selectoptions.append('<option value="" >-- Select --</option>');
            _commonService.getEntryTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //if (i == 0) {
                    //    selectoptions.append('<option value=' + result.items[i].id + ' data - code=' + result.items[i].code + ' >' + result.items[i].name + '</option>');
                    //}
                    //else {
                        selectoptions.append('<option value=' + result.items[i].id + ' data - code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    //}
                }
                //selectoptions.selectedIndex = 0;
                selectoptions.selectpicker('refresh');
                //getinventorytype($('#EntryTypes').val());
            });
            //console.log($('#EntryTypes').val());
        }
        getentrytype();

        function getinventorytype(entrytypecode) {
            var series = $('#InventoryTypes');
            series.empty();
            _commonService.getInventoryTypesFiltered({ id: 0, name: '', entryTypeCode: entrytypecode }).done(function (result) {
                if (result.items.length > 1) {
                    series.append('<option value="" >-- Select --</option>');
                }
                for (var i = 0; i < result.items.length; i++) {
                    series.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                //series.val(1)
                series.selectpicker('refresh');
            });
        }
        $('#EntryTypes').on('change', function (e) {
            getinventorytype($('#EntryTypes').val());
        });

            //MARC 09/01/2021
        $('#InventoryTypes').on('change', function (e) {
            var $inventorytypeid = $('#InventoryTypes').val()
            $("#divClient").hide();
            //$("#divDR").hide();
            if ($inventorytypeid == '5' || $inventorytypeid == '7') {
                $("#divClient").show();
            }
            //if ($inventorytypeid == '8') {
            //    $("#divDR").show();
            //}
            if ($inventorytypeid == '1' || $inventorytypeid == '2') {
                $("#divClient").show();
            }
        });
            //END MARC 09/01/2021

        function getwarehouses() {
            var selectoptionsources = $('#DefaultSources');
            var selectoptiondistinations = $('#DefaultDestinations');
            selectoptionsources.empty();
            selectoptiondistinations.empty();

            selectoptionsources.append('<option value="">-- Select --</option>');
            selectoptiondistinations.append('<option value="">-- Select --</option>');

            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptionsources.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    selectoptiondistinations.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptionsources.selectpicker('refresh');
                selectoptiondistinations.selectpicker('refresh');
                abp.ui.unblock();
            });
        }
        getwarehouses();
        //abp.ui.unblock();


        function gettransporters() {
            var transporters = $('#Transporter');
            transporters.empty();
            transporters.append('<option value="" >-- Select --</option>');
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
            transportmode.append('<option value="" >-- Select --</option>');
            _commonService.getTransportModes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    transportmode.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');

                }
                transportmode.selectpicker('refresh');
            });
        }
        function getvehicletype() {
            var vehicletype = $('#VehicleType');
            vehicletype.empty();
            vehicletype.append('<option value="" >-- Select --</option>');
            _commonService.getVehicleTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    vehicletype.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');

                }
                vehicletype.selectpicker('refresh');
            });
        }
        gettransporters();
        gettransportmode();
        getvehicletype();

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
                $("#ProductName").val(result.name);
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
                    $("#Price").val(result.items[i].unitPrice ? price : "0.00");
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
                $("#Stocks").val("");
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
            var warehouseid = $('#DefaultSources').val();
            $("#EStocks").val("0");
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
            ////$("#EProductName").val(ui.item.label);
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
                $("#EStocks").val("");
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
                    $('#ContactPersonId').val(result.items[i].id);
                    console.log(result.items[i].fullName);
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

        //DR Autocomplete MARC 09/01/2021
        //var getdrs = function (request, response) {
        //    var $filter = 'null|null|2,3|null|null|null|' + request.term;
        //    _drService.getDeliveryReceipts({ filter: $filter }).done(function (result) {
        //        response($.map(result.items, function (el) {
        //            return {
        //                label: el.code + ' - ' + el.client,
        //                value: el.id
        //            };
        //        }));
        //    });
        //};

        //function getdr() {
        //    var $drid = $('#DeliveryId').val();
        //    console.log($drid);
        //    //fill items
        //    _drService.getDeliveryReceiptItemsByParentId({ id: $drid }).done(function (result) {
        //        var qtytotal = 0;
        //        for (var i = 0; i < result.items.length; i++) {
        //           // var $statusid = $('#StatusId').val();
        //            var $soiid = result.items[i].id;
        //            var $soireferenceid = result.items[i].salesOrderItemId;
        //            var $soiproductid = result.items[i].productId;
        //            var $soiproductcode = result.items[i].productCode;
        //            var $soiproductname = result.items[i].productName;
        //            var $soiunitid = result.items[i].unitId;
        //            var $soiunit = result.items[i].unit;
        //            var $soiquantity = result.items[i].qty;
        //            var $soiprice = result.items[i].unitPrice;

        //            var $sqiproductdescription = result.items[i].description;
        //            var $sqiimagename = result.items[i].imageName;


        //            var $soidisc1 = result.items[i].disc1;
        //            var $soidisc2 = result.items[i].disc2;
        //            var $soidisc3 = result.items[i].disc3;
        //            var $soidtype1 = result.items[i].discType1;
        //            var $soidtype2 = result.items[i].discType2;
        //            var $soidtype3 = result.items[i].discType3;
        //            var $soiperdescription = result.items[i].description;
        //            var $soireference = result.items[i].reference;

        //            var soiprice = parseFloat($soiprice);
        //            var soiquantity = parseFloat($soiquantity);
        //            qtytotal = qtytotal + soiquantity;

        //            var soidisc1 = 0;
        //            var soidisc2 = 0;
        //            var soidisc3 = 0;
        //            if ($soidisc1 !== "") {
        //                soidisc1 = parseFloat($soidisc1);
        //            }
        //            if ($soidisc2 !== "") {
        //                soidisc2 = parseFloat($soidisc2);
        //            }
        //            if ($soidisc3 !== "") {
        //                soidisc3 = parseFloat($soidisc3);
        //            }

        //            var soidiscount = priceDiscount(soiprice, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3));
        //            var soitotaldiscount = soidiscount * soiquantity;
        //            var soilessprice = soiprice - soidiscount;
        //            var soitotal = soilessprice * soiquantity;
        //            var soidatacount = dataTable.rows().count();
        //            var soiitemno = soidatacount + 1;

        //            dataTable.row.add([soiitemno,
        //                '<a href="#" class="btn-link">' + $soiproductcode + '</a><br /><small><label class="text-muted">' + $soiproductname + '</label></small>',
        //                '<span class="text-muted">' + $soiquantity + '</span>|<span class="text-muted">' + $soiunit + '</span>',
        //                soiprice,
        //                soitotal,
        //                '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-price="' + soilessprice + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
        //                $soiproductid, $soiperdescription, $soiquantity, $soiunitid
        //            ]).draw();

        //            computeTotal();
        //            //dataTable.row.add([itemno,
        //            //    '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
        //            //    '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
        //            //    price,
        //            //    total,
        //            //    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + price + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
        //            //    $productid, $perdescription, $quantity, $unitid
        //            //]).draw();
        //        }
        //    });
        //};
        //var selectdr = function (event, ui) {
        //    event.preventDefault();
        //    $("#DeliveryId").val(ui.item ? ui.item.value : "");
        //    $("#DRClientName").val(ui.item ? ui.item.label : "");
        //    getdr();
        //    return false;
        //};
        //var focusdr = function (event, ui) {
        //    event.preventDefault();
        //    $("#DeliveryId").val(ui.item.value);
        //    $("#DRClientName").val(ui.item.label);
        //    //getProducts();
        //};
        //var changedr = function (event, ui) {
        //    event.preventDefault();
        //    $("#DeliveryId").val(ui.item ? ui.item.value : "");
        //    $("#DRClientName").val(ui.item ? ui.item.label : "");
        //    //getProducts();
        //    if (ui.item === null) {
        //        $('#DeliveryId').val('');
        //        $('#DRClientName').val('');

        //        //$('#Address').val('');
        //    }
        //};
        //$("#DRClientName").autocomplete({
        //    source: getdrs,
        //    select: selectdr,
        //    focus: focusdr,
        //    minLength: 2,
        //    delay: 100,
        //    change: changedr
        //});
        //DR Autocomplete


        //Other Charges

        //Datatable Add
        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [3, 4, 6, 7, 8, 9]
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
                className: 'text-right',
                targets: [2, 5]
            },
            {
                className: 'text-center',
                targets: [0]
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
                $productid, $perdescription, $quantity, $unitid
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
            $("#ProductImage").hide();
            $('#Stocks').val("");
            abp.notify.success('Item #' + itemno + ' added!', 'Success');
        }
        function computeTotal() {
            var grandtotal = 0;
            dataTable.column(8).data()
                .each(function (value, index) {
                    var $grandtotal = parseFloat(value);
                    grandtotal = grandtotal + $grandtotal;
                });
            $('#GrandTotal').val(currencyFormat(grandtotal));
        }
        function currencyFormat(num) {
            return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        }

        function save() {
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
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            var viewData = {
                stockentry: {
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "code": "0",
                    "transactionTime": formdata.TransactionTime + ' ' + time,
                    "entryTypeId": formdata.EntryTypeId,
                    "inventoryTypeId": formdata.InventoryTypeId,
                    "defaultSourceId": formdata.DefaultSourceId,
                    //"defaultDestinationId": formdata.DefaultDestinationId,
                    "defaultDestinationId": DefaultDestinationId,

                    //MARC 09/13/2021
                    "contactPerson": formdata.ContactPerson,
                    "contactNo": formdata.ContactNo,
                    "deliveryAddress": formdata.DeliveryAddress,
                    "transporterId": '0', //formdata.TransporterId,
                    "transportModeId": '0', //formdata.TransportModeId,
                    "transportReceiptNo": formdata.TransportReceiptNo,
                    "transportReceiptTime": formdata.TransportReceiptTime,
                    "vehicleTypeId": '0', //formdata.VehicleTypeId,
                    "vehicleNo": formdata.VehicleNo,
                    "driverName": formdata.DriverName,
                    "distance": formdata.Distance,
                    //END

                    "notes": formdata.Notes,
                    "statusId": "1"
                },
                stockentryitem: []
            };
            disabled.attr('disabled', 'disabled');

            for (var i = 0; f.length > i; i++) {
                item = {};
                item["StockEntryId"] = "0";
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022
                item["ProductId"] = f[i][6];
                item["Description"] = f[i][7];
                item["QtyRel"] = f[i][8];
                item["Qty"] = f[i][8];
                item["UnitId"] = f[i][9];
                item["UnitPrice"] = f[i][3];
                item["Total"] = f[i][4];
                viewData.stockentryitem.push(item);
            }

            abp.message.confirm(
                'New stock entry will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _stockEntryService.createStockEntry(viewData).done(function (result) {
                            abp.message.success('Stock Entry created', 'Success');
                            window.location.href = abp.appPath + 'StockEntry/Edit?id=' + result;
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        $('#EntryTypes').on('change', function (e) {
            //e.preventDefault();
            //_$itemsTable.dataTable().clear();

            $("#Stocks").val("");
            $("#ProductCode").val("");
            $("#ProductName").val("");
            $("#Quantity").val("");
            $("#Price").val("");
            $("#PerDescription").val("");
            var units = $('#Units');
            units.empty();
            units.selectpicker('refresh');
            $("#ProductImage").hide();

            $("#EStocks").val("");
            $("#EProductCode").val("");
            $("#EProductName").val("");
            $("#EQuantity").val("");
            $("#EPrice").val("");
            $("#EPerDescription").val("");
            var eunits = $('#EUnits');
            eunits.empty();
            eunits.selectpicker('refresh');
            $("#EProductImage").hide();

            _$itemsTable.dataTable().fnClearTable();
            _$itemsTable.dataTable().fnDraw();
            computeTotal();
            var $entrytypeid = $('#EntryTypes').val();
            var $inventorytypeid = $('#InventoryTypes').val();
            if ($entrytypeid === '1') {
                $('#SourceWarehouseLabel').text("Target Warehouse");
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
                $("#divDestinationWarehouse").show();
                $("#divClient").hide();
                //$("#divDR").hide();
            }
            else {
                $('#SourceWarehouseLabel').text("Source Warehouse");
                $("#divDestinationWarehouse").show();
                $("#divClient").hide();
                //$("#divDR").hide();

            }

        });
        $('#DefaultSources').on('change', function (e) {
            //e.preventDefault();
            $("#Stocks").val("");
            $("#ProductCode").val("");
            $("#ProductName").val("");
            $("#Quantity").val("");
            $("#Price").val("");
            $("#PerDescription").val("");
            var units = $('#Units');
            units.empty();
            units.selectpicker('refresh');
            $("#ProductImage").hide();
            $("#EStocks").val("");
            $("#EProductCode").val("");
            $("#EProductName").val("");
            $("#EQuantity").val("");
            $("#EPrice").val("");
            $("#EPerDescription").val("");
            var eunits = $('#EUnits');
            eunits.empty();
            eunits.selectpicker('refresh');
            $("#EProductImage").hide();
            _$itemsTable.dataTable().fnClearTable();
            _$itemsTable.dataTable().fnDraw();
            computeTotal();
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
            rearrange();
            computeTotal();
            abp.notify.warn('Item #' + dtRow[0].rowIndex + ' deleted!', 'Warning');

        });
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
        function getAddQuantity(productId, indexNo) {
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            var retval = 0;
            for (var i = 0; f.length > i; i++) {
                var itemid = f[i][6];
                var itemqty = parseFloat(f[i][8]);
                if (productId === itemid && indexNo !== i) {
                    retval = retval + itemqty;
                }
            }
            return retval;
        }
        // Delete product unit record
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            addnewitem();
        });
        $('#UpdatetemButton').click(function (e) {
            e.preventDefault();
            var $stocks = $('#EStocks').val();
            var $indexno = parseInt($('#EIndexNo').text()) - 1;
            var $productid = $('#EProductId').val();
            var $productcode = $('#EProductCode').val();
            var $productname = $('#EProductName').val();
            var $unitid = $('#EUnits').val();
            var $unit = $("#EUnits option:selected").html();
            var $quantity = $('#EQuantity').val();
            var $price = $('#EPrice').val();
            var $perdescription = $('#EPerDescription').val();

            if ($('#EntryTypes').val() === '0') {
                abp.notify.error('Select your Transaction Type.', 'Warning');
                return;
            }
            if ($('#DefaultSources').val() === '0') {
                abp.notify.error('Select your Source Warehouse.', 'Warning');
                return;
            }

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $stocks === '') { $('#ItemEditModal').modal('hide'); return; }

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
    });
})();
