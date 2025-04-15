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
$('#datetimepicker1').datetimepicker({
    format: 'MM/YYYY',
    useCurrent:false,
    defaultDate: new Date()
});
var sobatchdate = new Date();
$('#BatchDate').val(getFormattedDateMY(sobatchdate));
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
        var _quotationService = abp.services.app.quotationService;
        var _employeeService = abp.services.app.employeeService;
        var _cpersonService = abp.services.app.contactPersonService;
        var _warehouseService = abp.services.app.warehouseService;
        var _stockEntryService = abp.services.app.stockEntryService;

        var _$form = $('form[name=SalesOrderForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$chargesTable = $('#ChargesTable');
       
        $("#ProductImage").hide();
        $('#OtherTerms').hide();
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
        $('#Companies').on('change', function (e) {
            getseriestype($('#Companies').val());
        });
        function getseriestype(companyid) {
            var series = $('#Series');
            series.empty();
            _commonService.getSeriesTypesByTransId({ id: 0, transactionCode: 101, companyId: companyid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
                }
                series.selectpicker('refresh');
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
        //function getdeliverytype() {
        //    var deliverytypes = $('#DeliveryTypes');
        //    deliverytypes.empty();
        //    _commonService.getDeliveryTypes().done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            deliverytypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
        //        }
        //        deliverytypes.selectpicker('refresh');
        //    });
        //}

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
        function getchargetype() {
            var chargetypes = $('#ChargeTypes');
            chargetypes.empty();
            _commonService.getChargeTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    chargetypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                chargetypes.selectpicker('refresh');
                abp.ui.unblock();
            });
        }
        function getwarehouses() {
            var selectoptionsources = $('#DefaultSources');
            selectoptionsources.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptionsources.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptionsources.selectpicker('refresh');
            });
        }
        getordertype();
        getpricingtype();
        getpaymentterm();
        gettaxtype();
        getwarrantytype();
        //getdeliverytype();
        getchargetype();
        getwarehouses();
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
            //generateTermsAndConditions();
        });
        //Client Autocomplete
        var getclients = function (request, response) {
            _clientService.getClients({ filter: request.term + '|4' }).done(function (result) {
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
        //Sales Agent Autocomplete
        var getagents = function (request, response) {
            _employeeService.getAgents({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        var selectagent = function (event, ui) {
            event.preventDefault();
            $("#SalesAgentId").val(ui.item ? ui.item.value : 0);
            $("#SalesAgent").val(ui.item ? ui.item.label : "");
            return false;
        };
        var focusagent = function (event, ui) {
            event.preventDefault();
            $("#SalesAgentId").val(ui.item.value);
            $("#SalesAgent").val(ui.item.label);
        };
        var changeagent = function (event, ui) {
            event.preventDefault();
            $("#SalesAgentId").val(ui.item ? ui.item.value : 0);
            $("#SalesAgent").val(ui.item ? ui.item.label : "");
        };
        $("#SalesAgent").autocomplete({
            source: getagents,
            select: selectagent,
            focus: focusagent,
            minLength: 2,
            delay: 100,
            change: changeagent
        });
        //Sales Agent Autocomplete
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
                $('#PerDescription').val(result.description);
                $('#ProductName').val(result.name);
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
            //$("#PerDescription").val(ui.item ? ui.item.label : "");
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
            $("#ProductName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#ProductCode").val("");
                $("#Quantity").val("");
                $("#Price").val("");
                $("#PerDescription").val("");
                $("#ProductName").val("");
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
            $("#EProductName").val(ui.item ? ui.item.label : "");
            $("#EPrice").val("");
            editgetproduct();
            editgetproductunits();
            editgetproductprice();
            editgetproductstock();
            return false;
        };
        var editfocusproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item.value);
            //$("#EProductName").val(ui.item.label);
            editgetproduct();
            editgetproductunits();
            editgetproductprice();
            editgetproductstock();
        };
        var editchangeproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item ? ui.item.value : "");
            //$("#EProductName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#EProductCode").val("");
                $("#EQuantity").val("");
                $("#EPrice").val("");
                $("#EPerDescription").val("");
                var units = $('#EUnits');
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
        //Quotation Autocomplete

        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17,18]
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
            ]
        });
        function getquotation() {
            abp.ui.setBusy(_$form);
            var $id = $('#QuotationId').val();
            _quotationService.getQuotation({ id: $id }).done(function (result) {
                $('#Companies').val(result.companyId);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#SalesAgent').val(result.agent);
                $('#SalesAgentId').val(result.salesAgentId);
                var sonettotal = currencyFormat(result.netTotal);
                var sootherdiscount = currencyFormat(result.otherDiscount);
                var soothercharges = currencyFormat(result.otherCharges);
                var sosubtotal = currencyFormat(result.subTotal);
                var sotax = currencyFormat(result.tax);
                var sograndtotal = currencyFormat(result.grandTotal);
                var reqId = result.requestId;
                //console.log(reqId);
                $('#rfqid').val(reqId);
                $('#DiscountTotal').val(sootherdiscount);
                $('#NetTotal').val(sonettotal);
                $('#Tax').val(sotax);
                $('#Total').val(sosubtotal);
                $('#ChargesTotal').val(soothercharges);
                $('#GrandTotal').val(sograndtotal);
                $('#StatusBadge').text(result.status);
                var rdeadlines = new Date(result.deadlines);
                var dline = getFormattedDate(rdeadlines);
                $('#Deadlines').val(dline);

                $('#OtherTerms').val(result.otherTerms);

                var hideterms = $("#OtherTerms").val();
                if (hideterms != "") {
                    $("#OtherTerms").show();
                }
                else {
                    $("#OtherTerms").hide();
                }

                $("#OtherTerms").prop("disabled", true);

                getqcompanies(result.companyId);
                getqordertype(result.orderTypeId);
                getqtaxtype(result.taxTypeId);
                getqpricingtype(result.pricingTypeId);

                getqdeliverytype(result.deliveryTypeId);
                getqpaymentterm(result.paymentTermId);
                getqwarrantytype(result.warrantyTypeId);

                //getdeliverytype(result.deliveryTypeId);
                getclient();
                dataTableCharges.clear().draw();
                dataTable.clear().draw();
                getquotationitems($id);
                getquotationcharges($id);
                //getcontactpersons(result.contactPersonId);
                getclientDelAddress();
            });
        };
        function getclientDelAddress() {
            var $rfqid = $('#rfqid').val();
            _clientService.getBillingAddress({ id: $rfqid }).done(function (result) {
                $('#ClientAddress').val(result.code);
                $('#DeliveryAddress').val(result.completeAddress);
            });
        }
        function getquotationitems(id) {
            _quotationService.getQuotationItemsByParentId({ id: id }).done(function (result) {

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
                    var $sqcolor = result.items[i].color;

                    var sqiprice = parseFloat($sqiprice);
                    var sqiquantity = parseFloat($sqiquantity);
                    var sqitotaldiscount = parseFloat($sqidisctotal);
                    var sqitotal = parseFloat($sqitotal);

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

                    var sqidatacount = dataTable.rows().count();
                    var sqiitemno = sqidatacount + 1;

                    dataTable.row.add([sqiitemno,
                        '<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + ' ' + $sqcolor + '</label></small>',
                        '<label class="text-muted">' + $sqiquantity + '</label>|<label class="text-muted">' + $sqiunit + '</label>',
                        sqiprice,
                        sqitotaldiscount,
                        sqitotal,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + sqiitemno + '"  data-id="' + $sqiproductid + '" data-unitid="' + $sqiunitid + '" data-perdesc="' + $sqiproductdescription + '" data-qty="' + $sqiquantity + '" data-price="' + sqiprice + '" data-disc1="' + sqidisc1 + '" data-disc2="' + sqidisc2 + '" data-disc3="' + sqidisc3 + '" data-dtype1="' + parseInt($sqidtype1) + '" data-dtype2="' + parseInt($sqidtype2) + '" data-dtype3="' + parseInt($sqidtype3) + '" data-groupname="' + $sqiproductcode + '" data-reference="' + $sqiproductcode + '" data-disctotal="' + sqitotaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $sqiproductcode, $sqcolor
                    ]).draw();
                }
                abp.ui.clearBusy(_$form);
            });
        }
        function getquotationcharges(id) {
            _quotationService.getQuotationChargesByParentId({ id: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sqcid = result.items[i].id;
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    var $sqcchargetype = result.items[i].chargeType;
                    var $sqcrate = result.items[i].rate;
                    var $sqcamount = result.items[i].amount;
                    var $sqctotal = result.items[i].total;

                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;

                    dataTableCharges.row.add([sqcitemno,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcid]).draw();
                }
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
                    //console.log(result.items[i]);
                    if (id === result.items[i].id) {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' data-days=' + result.items[i].noOfDays + ' selected>' + result.items[i].name + '</option>');
                        $('#NoOfDays').val(result.items[i].noOfDays);
                       
                    }
                    else {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '  data-days=' + result.items[i].noOfDays + ' >' + result.items[i].name + '</option>');
                    }

                }
                deliverytypes.selectpicker('refresh');
                computedeliverydate();
            });
        }
        $('#DeliveryTypes').on('change', function (e) {
            var ddays = $("#DeliveryTypes option:selected").data('days');
            $('#NoOfDays').val(ddays);
            computedeliverydate();
        });
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
            var ids = id.split(',');
            _commonService.getWarrantyTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //if (id === result.items[i].id) {
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
            _quotationService.getQuotations({ filter: request.term + '|' + null + '|' + 6 + '|' + null + '|' + null }).done(function (result) {
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
            $("#QuotationId").val(ui.item ? ui.item.value : "");
            $("#QuotationCode").val(ui.item ? ui.item.label : "");
            getquotation();
            return false;
        };
        var focusquotation = function (event, ui) {
            event.preventDefault();
            $("#QuotationId").val(ui.item ? ui.item.value : "");
            $("#QuotationCode").val(ui.item ? ui.item.label : "");
        };
        var changequotation = function (event, ui) {
            event.preventDefault();
            $("#QuotationId").val(ui.item ? ui.item.value : "");
            $("#QuotationCode").val(ui.item ? ui.item.label : "");
        };
        $("#QuotationCode").autocomplete({
            source: getquotationcodes,
            select: selectquotation,
            focus: focusquotation,
            minLength: 2,
            delay: 100,
            change: changequotation
        });
        //Quotation Autocomplete
        $('#QuotationButton').click(function (e) {
            //e.preventDefault();
            var switcher = $('#QuotationSwitch').val();
            if (switcher === '1') {
                $('#QuotationIcon').removeClass();
                $('#QuotationIcon').addClass('fa fa-minus-square fa-lg');
                $('#QuotationSwitch').val("2");
                $("#QuotationCode").attr("readonly", true);
                $("#ClientName").attr("readonly", false);
                $("#SalesAgent").attr("readonly", false);
                $("#QuotationCode").val("0000000");
                $("#QuotationId").val("0");
                $("#SalesAgentId").val("0");
                $("#SalesAgent").val("");
                $("#ClientId").val("0");
                $("#ClientName").val("");
            }
            else {
                $('#QuotationIcon').removeClass();
                $('#QuotationIcon').addClass('fa fa-check-square fa-lg');
                $('#QuotationSwitch').val("1");
                $("#QuotationCode").attr("readonly", false);
                $("#ClientName").attr("readonly", true);
                $("#SalesAgent").attr("readonly", true);
                $("#QuotationCode").val("");
                $("#SalesAgentId").val("0");
                $("#SalesAgent").val("");
                $("#ClientId").val("0");
                $("#ClientName").val("");
            }
        });
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
            var $groupname = $('#GroupName').val();
            var $Color = $('#Color').val();

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
            discount = discount.toFixed(2);

            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;
            var datacount = dataTable.rows().count();
            var itemno = datacount + 1;
            dataTable.row.add([itemno,
                '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $Color + '</span></small>',
                '<span class="text-muted">' + $quantity + '</span>&nbsp;<span class="text-muted">' + $unit + '</span>',
                lessprice,
                totaldiscount,
                total,
                '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $productcode, $Color
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

        var dataTableCharges = _$chargesTable.DataTable({
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

        //function computeTotal() {
        //    var grandtotal = 0;
        //    var discounttotal = 0;
        //    var chargestotal = $('#ChargesTotal').val();
        //    var taxrate = 0;
        //    var tax = 0;
        //    var taxcode = 101;
        //    var nettotal = 0;
        //    dataTable.column(5).data()
        //        .each(function (value, index) {
        //            var $grandtotal = parseFloat(value);
        //            grandtotal = grandtotal + $grandtotal;
        //        });
        //    dataTable.column(4).data()
        //        .each(function (value, index) {
        //            var $discounttotal = parseFloat(value);
        //            discounttotal = discounttotal + $discounttotal;
        //        });
        //    var $taxtypeid = $('#TaxTypes').val();

        //    taxcode = $("#TaxTypes option:selected").data('code');
        //    taxrate = $("#TaxTypes option:selected").data('rate');

        //    if (taxcode === 101) {
        //        nettotal = grandtotal / taxrate;
        //        tax = nettotal * (taxrate - 1);
        //    }
        //    else if (taxcode === 104) {
        //        nettotal = grandtotal;
        //        tax = nettotal * (taxrate - 1);
        //        grandtotal = nettotal * taxrate;
        //    }
        //    else {
        //        nettotal = grandtotal;
        //        tax = 0;
        //    }
        //    var newgrandtotal = grandtotal + parseFloat(chargestotal);

        //    $('#DiscountTotal').val(currencyFormat(discounttotal));
        //    $('#NetTotal').val(currencyFormat(nettotal));
        //    $('#Tax').val(currencyFormat(tax));
        //    $('#Total').val(currencyFormat(grandtotal));
        //    //$('#ChargesTotal').val(currencyFormat(chargestotal));
        //    $('#GrandTotal').val(currencyFormat(newgrandtotal));
        //}
        function computeTotal() {
            var grandtotal = 0;
            var discounttotal = 0;
            var chargestotal = 0;
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
                chargeamount, total, '', $chargetypeid]).draw();
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
                var $groupname = f[i][17];
                var $productcode = f[i][18];
                var totaldiscount = f[i][4];

                temp[0] = itemno;
                temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }
        }
        function saveSalesOrder() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var viewData = {
                salesorder: {
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "code": "0",
                    "transactionTime": formdata.TransactionTime,
                    //MARC Batch Date 08/10/2022
                    "batchDate": getMonthYearFull(formdata.BatchDate),
                    //END Batch Date 08/10/2022
                    "deliveryTime": formdata.DeliveryTime,
                    "clientId": formdata.ClientId,
                    "clientOrderNo": formdata.ClientOrderNo,
                    "defaultSourceId": formdata.DefaultSourceId,
                    "defaultDestinationId": 0,
                    "quotationId": formdata.QuotationId,
                    "orderTypeId": formdata.OrderTypeId,
                    "pricingTypeId": formdata.PricingTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "contactPerson": formdata.ContactPerson,
                    "contactNo": formdata.ContactNo,
                    "deliveryAddress": formdata.DeliveryAddress,
                    "billingAddress": formdata.ClientAddress,
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
                    "deliveryStatusTime": formdata.DeliveryStatusTime,
                    "otherTerms": formdata.OtherTerms,
                    "deadlines": formdata.Deadlines
                    , "statusPreRevision": 0,
                    "revisionNo": 1
                },
                salesorderitems: [],
                salesordercharges: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            //jsonObj = [];
            for (var i = 0; f.length > i; i++) {

                item = {};
                item["SalesOrderId"] = "0";
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
                item["Reference"] = f[i][17];
                item["Color"] = f[i][18];
                viewData.salesorderitems.push(item);
            }

            //charges
            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;
            for (var k = 0; h.length > k; k++) {
                charge = {};
                charge["SalesOrderId"] = "0";
                charge["ChargeTypeId"] = h[k][6];
                charge["Rate"] = h[k][2];
                charge["Amount"] = h[k][3];
                charge["Total"] = h[k][4];
                viewData.salesordercharges.push(charge);
            }
            abp.message.confirm(
                'New sales order will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _salesOrderService.createSalesOrder(viewData).done(function (res) {
                            if (res === null || res === "0") { return; }
                            abp.message.success('Sales order created', 'Success');
                            //window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + result;
                            if (res.notif.id > 0) {
                                srConnection.invoke('sendNotification', res.salesOrder.code, res.salesOrder.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                                //console.log("sendNotification" + res.salesOrder.code, res.salesOrder.id, res.notif.userIds, abp.session.userId, '', res.notif.message );
                            }
                            setTimeout(function () {
                                //window.location.href = url; //will redirect to your blog page (an ex: blog.html)

                                //console.log("resId = " + res.salesorder.id);
                                window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + res.salesOrder.id;                               
                                //window.location.href = abp.appPath + 'SalesOrders/index';
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
            saveSalesOrder();
        });
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

            var discountvalue = parseFloat($disctotal) / parseFloat($qty);
            var origprice = discountvalue + parseFloat($price);

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
            discount = discount.toFixed(2);
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;

            var table = _$itemsTable.DataTable();
            var temp = table.row($indexno).data();
            temp[1] = '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>';
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
            //temp[17] = $groupname;
            $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
            $('#ItemEditModal').modal('hide');
            computeTotal();
        });
        _$itemsTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$itemsTable.DataTable();
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
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        //Datatable Add

        //Quotation Autocomplete

        $("#DeliveryStatusTime").hide();

        $('#DeliveryStatusDate').click(function (e) {
            //e.preventDefault();
            var switcher2 = $('#DeliveryTimeStatusSwitch').val();
            if (switcher2 === '1') {
                $('#DeliveryStatusDateIcon').removeClass();
                $('#DeliveryStatusDateIcon').addClass('fa fa-check-square fa-lg');
                $("#DeliveryTime").show();
                $("#DeliveryStatusTime").hide();
                $('#DeliveryTimeStatusSwitch').val("2");
                $("#DeliveryStatusTime").val("0");
            }
            else {
                $('#DeliveryStatusDateIcon').removeClass();
                $('#DeliveryStatusDateIcon').addClass('fa fa-minus-square fa-lg');
                $("#DeliveryTime").hide();
                $("#DeliveryStatusTime").show();
                $('#DeliveryTimeStatusSwitch').val("1");
            }
        });

        $("#Color").keyup(function (event) {
            this.value = this.value.toUpperCase();
        });

        function isValid(str) {
            return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }

        function computedeliverydate() {
            var date = new Date();
            var count = parseInt($("#NoOfDays").val());
            date.setDate(date.getDate() + count)
            $("#DeliveryTime").datepicker("setDate", date);
        }             
    });
})();



