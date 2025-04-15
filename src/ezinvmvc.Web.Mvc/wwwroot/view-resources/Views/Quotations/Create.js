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
abp.ui.block();

(function () {
    $(function () {
        var _pricingTypeService = abp.services.app.pricingTypeService;
        var _productPriceService = abp.services.app.productPriceService;
        var _productService = abp.services.app.productService;
        var _companyService = abp.services.app.companyService;
        var _commonService = abp.services.app.commonService;
        var _clientService = abp.services.app.clientService;
        var _rfqService = abp.services.app.rFQService;
        var _employeeService = abp.services.app.employeeService;
        var _quotationService = abp.services.app.quotationService;
        var _contactPersonService = abp.services.app.contactPersonService;
        var _leadService = abp.services.app.leadService;
        var _$form = $('form[name=QuotationForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$chargesTable = $('#ChargesTable');
        var _$OItemsTable = $('#OItemsTable');
        $("#ProductImage").hide();
        $('#OtherTerms').hide();
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
            _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: 100, companyId: companyid }).done(function (result) {
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
        getordertype();
        getpricingtype();
        getpaymentterm();
        gettaxtype();

        getdeliverytype();
        getwarrantytype();
        getchargetype();
        //RFQ Autocomplete
        var getrfqs = function (request, response) {
            var $filter = request.term; //+ '|' + '1,2,3,4';
            var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
            $filter = $filter + '|' + empid;
            _rfqService.getRFQsforQuotation({ filter: $filter }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code + ' - ' + el.clientName + ' - ' + el.projectName,
                        value: el.id
                    };
                }));
            });
        };
        function getrfq() {
            //$('#ItemsTable').DataTable().ajax.reload();
            $('#ItemsTable').DataTable().clear();
            var $rfqid = $('#RequestId').val();
            _rfqService.getRFQ({ id: $rfqid }).done(function (result) {
                $("#DefaultDiscount").val(result.discount);
                $("#RequestCode").val(result.code);
                $("#Request").val(result.code);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.clientName);
                $('#Project').val(result.projectName);
                $('#ContactPersonId').val(result.contactPersonId);
                $('#ContactPerson').val(result.contactPerson);
                $('#DeliveryAddress').val(result.deliveryAddress);
                $('#ClientAddress').val(result.address);
                $('#LeadId').val(result.leadId);
                console.log('rcode ' + result.code);
                console.log('rcode ' + result.code);
                var rdeadlines = new Date(result.deadlines);
                var dline = getFormattedDate(rdeadlines);
                $('#Deadlines').val(dline);

                $('#Others').val(result.others);
                getLeadAssignedTo();
                getrfqdetails($rfqid);

            });
        };
        function getLeadAssignedTo() {
            var $leadid = $('#LeadId').val();
            var $cid = $('#ClientId').val();
            
            if ($leadid.toLowerCase() === '0') {
                _clientService.getClientDetails({ id: $cid }).done(function (result) {
                    $("#SalesAgentId").val(result[0].assignedToId);
                    $("#SalesAgent").val(result[0].assignedTo);
                });
            }
            else {
                _leadService.getLead({ id: $leadid }).done(function (result) {
                    $("#SalesAgentId").val(result.assignedToId);
                    $("#SalesAgent").val(result.assignedTo);
                });
            }
        };
        var selectrfq = function (event, ui) {
            event.preventDefault();
            $("#RequestId").val(ui.item ? ui.item.value : "");
            getrfq();
            return false;
        };
        var focusrfq = function (event, ui) {
            event.preventDefault();
            $("#RequestId").val(ui.item.value);
        };
        var changerfq = function (event, ui) {
            event.preventDefault();
            $("#RequestId").val(ui.item ? ui.item.value : "");
            if (ui.item === null) {
                $("#DefaultDiscount").val('');
                $("#RequestCode").val('');
                $("#Request").val('');
                $('#ClientId').val('');
                $('#ClientName').val('');
                $('#Project').val('');
                $('#ContactPersonId').val('');
                $('#ContactPerson').val('');
                $('#DeliveryAddress').val('');
                $('#ClientAddress').val('');
            }
        };
        $("#Request").autocomplete({
            source: getrfqs,
            select: selectrfq,
            focus: focusrfq,
            minLength: 2,
            delay: 100,
            change: changerfq
        });
        //RFQ Autocomplete
        function clientautocompletehide() {
            ////Client Autocomplete
            //var getclients = function (request, response) {
            //    _clientService.getClients({ filter: request.term }).done(function (result) {
            //        response($.map(result.items, function (el) {
            //                return {
            //                    label: el.name,
            //                    value: el.id
            //                };
            //            }));
            //    });
            //};
            //function getclient() {
            //    var $clientid = $('#ClientId').val();
            //    _clientService.getClient({ id: $clientid }).done(function (result) {
            //        $('#ClientAddress').val(result.address);
            //        $('#ClientEmail').val(result.email);
            //    });
            //};

            //function getcontactpersons() {
            //    var $clientid = $('#ClientId').val();

            //    var contactpersons = $('#ContactPersons');
            //    contactpersons.empty();
            //    _contactPersonService.getContactPersonsFiltered({ id: 0, reference: 'Client', referenceId: $clientid }).done(function (result) {
            //        for (var i = 0; i < result.items.length; i++) {
            //            contactpersons.append('<option value=' + result.items[i].id + '>' + result.items[i].fullName + '</option>');
            //        }
            //        contactpersons.selectpicker('refresh');
            //    });
            //};

            //var selectclient = function (event, ui) {
            //    event.preventDefault();
            //    $("#ClientId").val(ui.item ? ui.item.value : "");
            //    $("#ClientName").val(ui.item ? ui.item.label : "");
            //    getclient();
            //    getcontactpersons();
            //    return false;
            //};
            //var focusclient = function (event, ui) {
            //    event.preventDefault();
            //    $("#ClientId").val(ui.item.value);
            //    $("#ClientName").val(ui.item.label);
            //};
            //var changeclient = function (event, ui) {
            //    event.preventDefault();
            //    $("#ClientId").val(ui.item ? ui.item.value : "");
            //    $("#ClientName").val(ui.item ? ui.item.label : "");
            //    if (ui.item === null) {
            //        $('#ClientAddress').val("");
            //        $('#ClientEmail').val("");
            //    }
            //};
            //$("#ClientName").autocomplete({
            //    source: getclients,
            //    select: selectclient,
            //    focus: focusclient,
            //    minLength: 2,
            //    delay: 100,
            //    change: changeclient
            //});
            // //Client Autocomplete
        }
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
            var $defaultdiscount = $('#DefaultDiscount').val();
            if ($defaultdiscount !== '') {
                $('#Discount1').val($defaultdiscount);
                //$('#accordiondiscount .collapse').collapse('show');
            }
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
            //$("#ProductName").val(ui.item ? ui.item.label : "");
            getproduct();
            getproductunits();
            getproductprice();
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
        };
        var changeproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            //$("#ProductName").val(ui.item ? ui.item.label : "");
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
            var $pricingtypeid = $('#PricingTypes').val();
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
        var editselectproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item ? ui.item.value : "");
            $("#EProductName").val(ui.item ? ui.item.label : "");
            $("#EPrice").val("");
            editgetproduct();
            editgetproductunits();
            editgetproductprice();
            return false;
        };
        var editfocusproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item.value);
            //$("#EProductName").val(ui.item.label);
            editgetproduct();
            editgetproductunits();
            editgetproductprice();
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
        //Other Charges
        //Datatable Add
        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                //MARC qi_option 07212022
                //targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
                targets: [2, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            },
            {
                orderable: false,
                //MARC qi_option 07212022
                //targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
                targets: [0, 1, 2, 3, 4, 5, 6, 7]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                //MARC qi_option 07212022
                //targets: [3, 4, 5]
                targets: [4, 5, 6]
            },
            {
                className: 'text-center',
                //MARC qi_option 07212022
                //targets: [2]
                targets: [3,6]
            }
                //,
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
        function addnewitem() {
            //MARC qi_option 07212022
            var $itemtypev = $('#ItemType').val();
            var $itemtypet = $('#ItemType option:selected').text();
            //MARC qi_option 07212022

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
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;
            var datacount = dataTable.rows().count();
            var itemno = datacount + 1;
            dataTable.row.add([itemno,
                '<span class="text-danger font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $Color + '</span></small>',

                //MARC qi_option 07212022
                $itemtypet, 
                //MARC qi_option 07212022

                '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
                lessprice,
                totaldiscount,
                total,
                '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                //MARC qi_option 07212022
                '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet +
                //MARC qi_option 07212022

                '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $groupname, $productcode

                //MARC qi_option 07212022
                , $itemtypev
                //MARC qi_option 07212022
                , $Color
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
            var grandtotal = 0;
            var discounttotal = 0;
            var chargestotal = 0;
            var taxrate = 0;
            var tax = 0;
            var taxcode = 101;
            var nettotal = 0;
            //dataTable.column(5).data()
            //    .each(function (value, index) {
            //        //MARC qi_option 07212022
            //        //var $grandtotal = parseFloat(value);
            //        //grandtotal = grandtotal + $grandtotal;
            //        console.log('computetotal items row : ' + index)
            //        console.log('item type : ' + dataTable.cell(index, 20).data());
            //        var $itemtype = dataTable.cell(index, 20).data();

            //        if ($itemtype === 1) {
            //            var $grandtotal = parseFloat(value);
            //            grandtotal = grandtotal + $grandtotal;
            //        }
            //        //MARC qi_option 07212022
            //    });
            //dataTable.column(4).data()
            //    .each(function (value, index) {
            //        //MARC qi_option 07212022
            //        //var $discounttotal = parseFloat(value);
            //        //discounttotal = discounttotal + $discounttotal;
            //        console.log('computetotal items row : ' + index)
            //        console.log('item type : ' + dataTable.cell(index, 20).data());
            //        var $itemtype = dataTable.cell(index, 20).data();

            //        if ($itemtype === 1) {
            //            var $discounttotal = parseFloat(value);
            //            discounttotal = discounttotal + $discounttotal;
            //        }
            //        //MARC qi_option 07212022
            //    });

            dataTable.column(6).data()
                .each(function (value, index) {
                    //MARC qi_option 07212022
                    //var $grandtotal = parseFloat(value);
                    //grandtotal = grandtotal + $grandtotal;
                    //console.log('computetotal items row : ' + index)
                    //console.log('item type : ' + dataTable.cell(index, 20).data());
                    var $itemtype = dataTable.cell(index, 20).data() + '';
                    //console.log(dataTable.cell(index, 0).data() + ' ' + dataTable.cell(index, 1).data());
                    if ($itemtype === '1') {
                        var $grandtotal = parseFloat(value);
                        grandtotal = grandtotal + $grandtotal;
                    }
                    //MARC qi_option 07212022
                });
            dataTable.column(5).data()
                .each(function (value, index) {
                    //MARC qi_option 07212022
                    //var $discounttotal = parseFloat(value);
                    //discounttotal = discounttotal + $discounttotal;
                    //console.log('computetotal items row : ' + index)
                    //console.log('item type : ' + dataTable.cell(index, 20).data());
                    var $itemtype = dataTable.cell(index, 20).data() + '';

                    if ($itemtype === '1') {
                        var $discounttotal = parseFloat(value);
                        discounttotal = discounttotal + $discounttotal;
                    }
                    //MARC qi_option 07212022
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

                //var $productid = f[i][8];
                //var $unitid = f[i][11];
                //var $perdescription = f[i][9];
                //var $quantity = f[i][10];
                //var $price = f[i][4];
                //var disc1 = f[i][12];
                //var disc2 = f[i][14];
                //var disc3 = f[i][16];
                //var $dtype1 = f[i][13];
                //var $dtype2 = f[i][15];
                //var $dtype3 = f[i][17];
                //var $groupname = f[i][18];
                //var $productcode = f[i][19];
                //var totaldiscount = f[i][4];
                //var $color = f[i][21];

                //temp[0] = itemno;
                //temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                //$('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);

                //MARC qi_option 07212022
                var $itemtypet = f[i][2];
                //MARC qi_option 07212022

                var $productid = f[i][8];
                var $unitid = f[i][11];
                var $perdescription = f[i][9];
                var $quantity = f[i][10];
                var $price = f[i][4];
                var disc1 = f[i][12];
                var disc2 = f[i][14];
                var disc3 = f[i][16];
                var $dtype1 = f[i][13];
                var $dtype2 = f[i][15];
                var $dtype3 = f[i][17];
                var $groupname = f[i][19];
                var $productcode = f[i][20];
                var totaldiscount = f[i][5];
                var $color = f[i][21];

                //MARC qi_option 07212022
                var $itemtypev = f[i][21];
                //MARC qi_option 07212022

                temp[0] = itemno;
                temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-color="' + $color + '"  data-price="' + $price + '" data-disctotal="' + totaldiscount + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '"  ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';

                //temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                    //MARC qi_option 07212022
                    //'" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '" data-color="' + $color +
                    //MARC qi_option 07212022

                    //'"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }
        }

        _$form.validate({
            // Specify validation rules
            rules: {
                WarrantyTypeId: {
                    required: true
                },
                DeliveryTypeId: {
                    required: true
                },
                TaxTypeId: {
                    required: true
                }
            },

            //specify custom messages
            messages: {
                WarrantyTypeId: {
                    required: "This field is required."
                },
                DeliveryTypeId: {
                    required: "This field is required."
                },
                TaxTypeId: {
                    required: "This field is required."
                }
            },

            // specify error placement
            errorPlacement: function (error, element) {

                if (element.attr("class").indexOf("selectpicker") != -1) {
                    // $(".dropdown-toggle").text(error);
                    var mpar = $(element).closest("div.bootstrap-select");
                    error.insertAfter($('.dropdown-toggle', mpar));

                } else {
                    error.insertAfter(element);
                }
            }

        });

        function saveQuotation() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            //console.log(String($("#WarrantyTypes").val()));
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var viewData = {
                quotation: {
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "code": "0",
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "clientOrderNo": formdata.ClientOrderNo,
                    "requestId": formdata.RequestId,
                    "requestCode": formdata.RequestCode,
                    "orderTypeId": formdata.OrderTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "contactPersonId": formdata.ContactPersonId,
                    "notes": formdata.Notes,
                    "termsAndConditions": formdata.TermsAndConditions,
                    "statusId": 1,
                    "taxTypeId": formdata.TaxTypeId,
                    "paymentTermId": formdata.PaymentTermId,
                    "deliveryTypeId": formdata.DeliveryTypeId,
                    //MARC multiselect 08262022
                    //"warrantyTypeId": formdata.WarrantyTypeId,
                    "warrantyTypeId": String($("#WarrantyTypes").val()),
                    //END MARC multiselect 08262022
                    "revisionNo": formdata.RevisionNo,
                    "subTotal": formdata.Total,
                    "otherDiscount": formdata.DiscountTotal,
                    "otherCharges": formdata.ChargesTotal,
                    "netTotal": formdata.NetTotal,
                    "taxRate": $("#TaxTypes option:selected").data('rate'),
                    "deadlines": formdata.Deadlines,
                    "otherTerms": formdata.OtherTerms,
                    "Others": formdata.Others,
                    "tax": formdata.Tax,
                    "packageCost": formdata.PackageCost || 0,                    
                    "grandTotal": formdata.GrandTotal
                },
                quotationitems: [],
                quotationcharges: [],
                quotationotheritem: []
            };
            disabled.attr('disabled', 'disabled');

            //items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {
                item = {};
                item["QuotationId"] = "0";
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022

                //item["ProductId"] = f[i][7];
                //item["Description"] = f[i][8];
                //item["OrderQty"] = f[i][9];
                //item["UnitId"] = f[i][10];
                //item["UnitPrice"] = f[i][3];
                //item["Disc1"] = f[i][11];
                //item["DiscType1"] = f[i][12];
                //item["Disc2"] = f[i][13];
                //item["DiscType2"] = f[i][14];
                //item["Disc3"] = f[i][15];
                //item["DiscType3"] = f[i][16];
                //item["DiscTotal"] = f[i][4];
                //item["Total"] = f[i][5];
                //item["GroupName"] = f[i][17];
                //item["Reference"] = f[i][18];

                item["ProductId"] = f[i][8];
                item["Description"] = f[i][9];
                item["OrderQty"] = f[i][10];
                item["UnitId"] = f[i][11];
                item["UnitPrice"] = f[i][4];
                item["Disc1"] = f[i][12];
                item["DiscType1"] = f[i][13];
                item["Disc2"] = f[i][14];
                item["DiscType2"] = f[i][15];
                item["Disc3"] = f[i][16];
                item["DiscType3"] = f[i][17];
                item["DiscTotal"] = f[i][5];
                item["Total"] = f[i][6];
                item["GroupName"] = f[i][18];
                item["Reference"] = f[i][19];

                //MARC qi_option 07212022
                item["ItemType"] = f[i][20]
                item["Color"] = f[i][21]
                viewData.quotationitems.push(item);
            }

            //charges
            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var g = form_datacharges;

            for (var j = 0; g.length > j; j++) {

                charge = {};
                charge["QuotationId"] = "0";
                charge["ChargeTypeId"] = g[j][6];
                charge["Rate"] = g[j][2];
                charge["Amount"] = g[j][3];
                charge["Total"] = g[j][4];
                viewData.quotationcharges.push(charge);
            }

            //sales order items
            var tableotheritem = _$OItemsTable.DataTable();
            var form_data2 = tableotheritem.rows().data();
            var k = form_data2;
            //jsonObj = [];
            for (var l = 0; k.length > l; l++) {
                items = {};
                items["RFQId"] = formdata.SeriesTypeId;
                items["IndexNo"] = k[l][0];
                items["Name"] = k[l][1];
                items["Area"] = k[l][2];
                items["Description"] = k[l][3];
                items["Dimension"] = k[l][4];
                items["Quantity"] = k[l][5];
                items["Description1"] = "";
                items["Status"] = "0";
                viewData.quotationotheritem.push(items);
                //jsonObj.push(item);
            }

            abp.message.confirm(
                'New sales order will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        var returnid = _quotationService.createQuotation(viewData).done(function (res) {
                            abp.message.success('Quotation created', 'Success');
                            //window.location.href = abp.appPath + 'Quotations/Edit?id=' + result;
                            if (res.notif.id > 0) {
                                srConnection.invoke('sendNotification', res.quotation.code, res.quotation.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                            }
                            var url = 'Index';
                            setTimeout(function () {
                                //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                                window.location.href = abp.appPath + 'Quotations/Edit?id=' + res.quotation.id;
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
            saveQuotation();
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
            var $ecolor = $(this).attr("data-color");
            var $esorFQCode = $(this).attr("data-sorFQCode");
            //MARC qi_option 07212022
            var $itemtypev = $(this).attr("data-itemtypev");
            var $itemtypet = $(this).attr("data-itemtypet");
            //MARC qi_option 07212022

            var discountvalue = parseFloat($disctotal) / parseFloat($qty);
            var origprice = discountvalue + parseFloat($price.replace(/,/g, ''));

            //MARC qi_option 07212022
            $('#EItemType').val(1);
            $('#EItemType').selectpicker('refresh');
            //MARC qi_option 07212022

            $('#EProductId').val($productid);
            $('#EIndexNo').text($itemno);
            $('#EQuantity').val($qty);
            $('#EProductName').val($esorFQCode);
            $('#EUnits').val($unitid);
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
            $('#EColor').val($ecolor);
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
        _$chargesTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$chargesTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        $('#UpdatetemButton').click(function (e) {
            e.preventDefault();
            var $indexno = parseInt($('#EIndexNo').text()) - 1;
            //MARC qi_option 07212022
            var $itemtypev = $('#EItemType').val();
            var $itemtypet = $('#EItemType option:selected').text();
            //MARC qi_option 07212022

            var $productid = $('#EProductId').val();
            var $productcode = $('#EProductCode').val();
            var $productname = $('#EProductName').val();
            var $unitid = $('#EUnits').val();
            var $unit = $("#EUnits option:selected").html();
            var $quantity = $('#EQuantity').val();
            var $price = $('#EPrice').val();
            var $EColor = $('#EColor').val();

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
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;
            
            var table = _$itemsTable.DataTable();
            var temp = table.row($indexno).data();
            //temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>';
            //temp[2] = '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>';
            //temp[3] = lessprice;
            //temp[4] = totaldiscount;
            //temp[5] = total;
            //temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

            //    //MARC qi_option 07212022
            //    '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet +
            //    //MARC qi_option 07212022

            //    '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            //temp[7] = $productid;
            //temp[8] = $perdescription;
            //temp[9] = $quantity;
            //temp[10] = $unitid;
            //temp[11] = disc1;
            //temp[12] = parseInt($dtype1);
            //temp[13] = disc2;
            //temp[14] = parseInt($dtype2);
            //temp[15] = disc3;
            //temp[16] = parseInt($dtype3);
            //temp[17] = $groupname;
            //temp[18] = $productcode;

            temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $EColor+'</span></small>';

            //MARC qi_option 07212022
            temp[2] = $itemtypet;

            temp[3] = '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>';
            temp[4] = lessprice
            temp[5] = totaldiscount;
            temp[6] = total;
            temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                //MARC qi_option 07212022
                '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '" data-color="' + $EColor + 
                //MARC qi_option 07212022

                '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[8] = $productid;
            temp[9] = $perdescription;
            temp[10] = $quantity;
            temp[11] = $unitid;
            temp[12] = disc1;
            temp[13] = parseInt($dtype1);
            temp[14] = disc2;
            temp[15] = parseInt($dtype2);
            temp[16] = disc3;
            temp[17] = parseInt($dtype3);
            temp[18] = $groupname;
            temp[19] = $productcode;

            //MARC qi_option 07212022
            temp[20] = $itemtypev;
            temp[21] = $EColor;
            //MARC qi_option 07212022

            $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
            $('#ItemEditModal').modal('hide');
            computeTotal();
        });
        // Delete product unit record
        $('#TaxTypes').on('change', function (e) {
            computeTotal();
        });
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            var qty = $('#Quantity').val();
            var pid = $('#ProductId').val();
            $('span.perror').remove();
            var valid = true;
            if (pid.length <= 0) {
                $('<span class="perror error">This field is required.</span>').
                    insertAfter('#ProductName');
                valid = false;
            }
            if (qty.length <= 0) {

                $('<span class="perror error">This field is required.</span>').
                    insertAfter('#Quantity');
                valid = false;
            }
            if (!valid) {
                return;
            }
            addnewitem();
            generateTermsAndConditions();
        });
        $('#AddChargeButton').click(function (e) {
            e.preventDefault();
            addnewcharge();
        });
        $('#PaymentTerms').on('change', function (e) {
            if ($('#PaymentTerms option:selected').text() == "Others") {
                $('#OtherTerms').val("");
                $('#OtherTerms').show();
            }
            else {
                $('#OtherTerms').hide();
            }

            generateTermsAndConditions();
        });
        $('#DeliveryTypes').on('change', function (e) {
            generateTermsAndConditions();
        });
        $('#TaxTypes').on('change', function (e) {
            generateTermsAndConditions();
        });
        $('#WarrantyTypes').on('change', function (e) {
            generateTermsAndConditions();
        });
        function generateTermsAndConditions() {
            var $paymentterms = $("#PaymentTerms option:selected").html();
            var $deliverytypes = $("#DeliveryTypes option:selected").html();
            var $taxtypes = $("#TaxTypes option:selected").html();
            var $warrantytypes = $("#WarrantyTypes option:selected").html();

            var $row1 = '1. VALIDITY:                                           14 working day(s)';
            var $row2 = '2. TERMS:	                                        ' + $paymentterms;
            var $row3 = '3. DELIVERY:	                                        ' + $deliverytypes + ' upon receipt of confirmation and completion of all approved materials whatever comes later.';
            var $row4 = '4. PRICE:	                                        ' + $taxtypes;
            var $row5 = '5. WARRANTY:                                      ' + $warrantytypes;
            var $row6 = '6. QUOTATION DOES NOT INCLUDE: BONDS(SURETY,PERFORMANCE,CARI,WARRANT, ETC.';
            var $row7 = '                                      Other Charges: Permits, Elevator Fee, Non Standard Fabric, Mobilization Charges outside Metro Manila';
            var $row8 = 'If you agree with the above terms and conditions, please signify your conformity by signing on the space provided';
            var $row9 = 'below, after which the same quotation shall become an official contract.';

            var $termsandconditions = $row1 + "\r" + $row2 + "\r" + $row3 + "\r" + $row4 + "\r" + $row5 + "\r" + $row6 + "\r" + $row7 + "\r\r" + $row8 + "\r" + $row9;

            $('#TermsAndConditions').val($termsandconditions);
        }
        //Datatable Add
        function getrfqdetails(id) {
            _rfqService.getRfqDetailsByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $soiid = result.items[i].id;
                    $('#soid').val($soiid);
                    var $soiproductid = result.items[i].productId;
                    var $soiproductcode = result.items[i].productCode;
                    var $soiproductname = result.items[i].rfqCode;
                    var $sodescription = result.items[i].description;
                    var $soindexno = result.items[i].indexno;
                    var $soiunitid = result.items[i].unitId;
                    var $soiunit = result.items[i].unit;
                    var $soiquantity = result.items[i].qty;
                    var $soiprice =result.items[i].unitPrice;
                    var $sogroupname = result.items[i].groupName;
                    var $sorFQCode = result.items[i].rfqCode;
                    //var soqiprice = parseFloat($soiprice);
                    var $socolor = result.items[i].color;
                    var $soitemtype = result.items[i].itemType
                    if ($soitemtype == 1) {
                        var act = "Actual";
                    }
                    else {
                        var act = "Option";
                    }
                    var $sodisc1 = result.items[i].disc1;
                    var $sodisc2 = result.items[i].disc2;
                    var $sodisc3 = result.items[i].disc3;

                    var $sodiscType1 = result.items[i].discType1;
                    var $sodiscType2 = result.items[i].discType2;
                    var $sodiscType3 = result.items[i].discType3;
                    var $sodiscTotal = result.items[i].discTotal;
                    var $sototal = result.items[i].total;


                    var datacount = dataTable.rows().count();
                    var itemno = datacount + 1;

                    dataTable.row.add([itemno,
                        '<span class="text-warning font-weight-bold">' + $sogroupname + '</span><br /><a href="#" class="btn-link">' + $soiproductcode + '</a><br /><small><span class="text-muted">' + $sorFQCode + '</span></small><br /><small><span class="text-muted">' + $sodescription + ' ' + $socolor + '</span></small>',
                        act,
                        '<span class="text-muted">' + $soiquantity + '</span>|<span class="text-muted">' + $soiunit + '</span>',
                        $soiprice,
                        $sodiscTotal,
                        $sototal,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiproductname + '" data-qty="' + $soiquantity + '" data-groupname="' + $sogroupname + '" data-reference="' + $soiproductcode + '" data-color="' + $socolor + '"  data-price="' + $soiprice + '" data-disctotal="' + $sodiscTotal + '" data-sorFQCode="' + $sorFQCode + '" data-disc1="' + $sodisc1 + '" data-disc2="' + $sodisc2 + '" data-disc3="' + $sodisc3 + '" data-dtype1="' + parseInt($sodiscType1) + '" data-dtype2="' + parseInt($sodiscType2) + '" data-dtype3="' + parseInt($sodiscType3) + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $soiproductid, $sodescription, $soiquantity, $soiunitid, $sodisc1, parseInt($sodiscType1), $sodisc2, parseInt($sodiscType2), $sodisc3, parseInt($sodiscType3), $sogroupname, $soiproductcode, $soitemtype, $socolor, $soiid
                    ]).draw();


                    computeTotal();
                    $('#WarrantyTypes').selectpicker('val', 1)
                    //$("#WarrantyTypes").val(1);
                }
            });

            OdataTable.clear().draw();
            getrfqotherdetails(id);
        };

        $("#Color").keyup(function (event) {
            this.value = this.value.substr(0, 1).toUpperCase() + this.value.substr(1).toLowerCase();
        });

        function isValid(str) {
            return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }
        $("#EColor").keypress(function (event) {
            var character = String.fromCharCode(event.keyCode);
            return isValid(character);
        });
        $("#EColor").keyup(function (event) {
            this.value = this.value.substr(0, 1).toUpperCase() + this.value.substr(1).toLowerCase();
        });

        $('#Others').keyup(updateCount);
        $('#Others').keydown(updateCount);
        function updateCount() {
            var cs = $(this).val().length;
            $('#characters').text(cs);
        }

        var OdataTable = _$OItemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 7, 8]
            },
            {
                orderable: true,
                "autoWidth": false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                className: 'text-center',
                targets: [5]
            }
            ]
        });

        function getrfqotherdetails(id) {
            _rfqService.getRfqOtherDetailsByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $rfqId = result.items[i].rfqId;
                    var $indexNo = result.items[i].indexNo;
                    var $OName = result.items[i].name;
                    var $OArea = result.items[i].area;
                    var $ODescription = result.items[i].description;
                    var $ODimension = result.items[i].dimension;
                    var $OQuantity = result.items[i].quantity;
                    var $description1 = result.items[i].description1;
                    var $status = result.items[i].status;

                    var datacount = OdataTable.rows().count();
                    var itemno = datacount + 1;

                    OdataTable.row.add([itemno, $OName, $OArea, $ODescription, $ODimension, $OQuantity,
                        '<a id="edit-Oitem" class="edit-Oitem" title="edit" href="#" data-Oid="' + $id + '" data-OrfqId="' + $rfqId + '" data-Oitemno="' + $indexNo + '"  data-Oname="' + $OName + '" data-Oarea="' + $OArea + '" data-Odesc="' + $ODescription + '" data-Odimension="' + $ODimension + '"  data-Oqty="' + $OQuantity + '" ><i class="fa fa-edit"></i></a>&nbsp;|&nbsp;<a id="delete-Oitem" class="delete-Oitem" title="delete" href="#" data-Oid="' + $id + '" ><i class="fa fa-trash"></i></a>', $id, $rfqId,
                    ]).draw();

                }
            });
        };

        $("#OUpdateItemButton").hide();
        $("#OCancelItemButton").hide();
        _$OItemsTable.on('click', 'a.edit-Oitem', function (e) {
            e.preventDefault();
            $("#OAddItemButton").hide();
            $("#OUpdateItemButton").show();
            $("#OCancelItemButton").show();
            var $Oid = $(this).attr("data-Oid");
            var $OrfqId = $(this).attr("data-OrfqId");
            var $Oitemno = $(this).attr("data-Oitemno");
            var $Oname = $(this).attr("data-Oname");
            var $Oarea = $(this).attr("data-Oarea");
            var $Odesc = $(this).attr("data-Odesc");
            var $Odimension = $(this).attr("data-Odimension");
            var $Oqty = $(this).attr("data-Oqty");

            $('#Oid').val($Oid);
            $('#OrfqId').val($OrfqId);
            $('#Oitemno').val($Oitemno);
            $('#OName').val($Oname);
            $('#OArea').val($Oarea);
            $('#ODescription').val($Odesc);
            $('#ODimension').val($Odimension);
            $("#OQuantity").val($Oqty);
        });

        _$OItemsTable.on('click', 'a.delete-Oitem', function (e) {
            e.preventDefault();
            var $Oid = $(this).attr("data-Oid");
            var $OrfqId = $(this).attr("data-OrfqId");
            $('#OrfqId').val($OrfqId);
            $this = $(this);
            var dtRow = $this.parents('tr');
            var tableitemsdelete = _$OItemsTable.DataTable();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Items', 'ezinvmvc'), $Oid),
                function (isConfirmed) {
                    if (isConfirmed) {
                        tableitemsdelete.row(dtRow[0].rowIndex - 1).remove().draw(false);
                        DeleteOtherItem($Oid, $OrfqId);
                    }
                }
            );


        });

        function DeleteOtherItem(Id, $OrfqId) {
            var $id = Id;
            var $rfqId = $OrfqId;
            _rfqService.delete({
                id: $id
            }).done(function () {
                $.ajax({
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    success: function () { },
                    error: function (e) { }
                });
                getrfqotherdetails($rfqId);
                rearrange2();
            });
        }

        $('#OUpdateItemButton').click(function (e) {
            e.preventDefault();
            $("#OCancelItemButton").hide();
            $("#OUpdateItemButton").hide();
            $("#OAddItemButton").show();
            updateRfqotherDetails();
        });

        $('#OCancelItemButton').click(function (e) {
            e.preventDefault();
            $('#Oid').val("0");
            $('#OrfqId').val("0");
            $("#OUpdateItemButton").hide();
            $("#OCancelItemButton").hide();
            $("#OAddItemButton").show();
            $('#Oitemno').val("0");
            $('#OName').val("");
            $('#OArea').val("");
            $('#ODescription').val("");
            $('#ODimension').val("");
            $("#OQuantity").val("");
            $("#OCancelItemButton").hide();
            $("#OUpdateItemButton").hide();
            $("#OAddItemButton").show();
        });

        _$OItemsTable.on('click', 'a.edit-uitem', function (e) {
            e.preventDefault();
            $("#OAddItemButton").hide();
            $("#OUpdateItemButton").show();
            $("#OCancelItemButton").show();
            var $uitemno = $(this).attr("data-uitemno");
            var $uname = $(this).attr("data-uname");
            var $uarea = $(this).attr("data-uarea");
            var $udesc = $(this).attr("data-udesc");
            var $udimension = $(this).attr("data-udimension");
            var $uqty = $(this).attr("data-uqty");
            var $Oid = $(this).attr("data-uid");
            var $OrfqId = $(this).attr("data-urfqId");

            $('#Oid').val($Oid);
            $('#OrfqId').val($OrfqId);
            $('#Oitemno').val($uitemno);
            $('#OName').val($uname);
            $('#OArea').val($uarea);
            $('#ODescription').val($udesc);
            $('#ODimension').val($udimension);
            $("#OQuantity").val($uqty);
        });

        function rearrange2() {
            var table = _$OItemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            for (var i = 0; f.length > i; i++) {
                var temp = table.row(i).data();
                var itemno = i + 1;

                var $OName = f[i][1];
                var $OArea = f[i][2];
                var $ODescription = f[i][3];
                var $ODimension = f[i][4];
                var $OQuantity = f[i][5];
                var $Oid = f[i][7];
                var $OrfqId = f[i][8];

                temp[0] = itemno;
                temp[1] = f[i][1];
                temp[2] = f[i][2];
                temp[3] = f[i][3];
                temp[4] = f[i][4];
                temp[5] = f[i][5];
                temp[6] = '<a id="edit-Oitem" class="edit-Oitem" title="edit" href="#" data-uid="' + $Oid + '" data-urfqId="' + $OrfqId + '" data-Oitemno="' + itemno + '"  data-Oname="' + $OName + '" data-Oarea="' + $OArea + '" data-Odesc="' + $ODescription + '" data-Odimension="' + $ODimension + '"  data-Oqty="' + $OQuantity + '" ><i class="fa fa-edit"></i></a>&nbsp;|&nbsp;<a id="delete-Oitem" class="delete-Oitem" title="delete" href="#" data-Oid="' + $id + '"><i class="fa fa-trash"></i></a>';

                temp[7] = f[i][7];
                temp[8] = f[i][8];
                $('#OItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }
        }

        $('#OAddItemButton').click(function (e) {
            e.preventDefault();
            saveRfqotherDetails();
        });

        function saveRfqotherDetails() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var formdata = _$form.serializeFormToObject();
            var items3 = {
                "rfqId": formdata.RequestId,
                "indexNo": "0",
                "name": formdata.OName,
                "area": formdata.OArea,
                "description": formdata.ODescription,
                "dimension": formdata.ODimension,
                "quantity": formdata.OQuantity,
                "status": "0",
            };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _rfqService.createRFQOtherDetails(items3).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Item Save successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            OdataTable.clear().draw();

                            $('#Oitemno').val("0");
                            $('#OName').val("");
                            $('#OArea').val("");
                            $('#ODescription').val("");
                            $('#ODimension').val("");
                            $("#OQuantity").val("");
                            getrfqotherdetails($('#RequestId').val());
                        });
                    }
                }
            );

        }

        function updateRfqotherDetails() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var formdata = _$form.serializeFormToObject();
            var items4 = {
                "id": formdata.Oid,
                "rfqId": formdata.OrfqId,
                "indexNo": formdata.Oitemno,
                "name": formdata.OName,
                "area": formdata.OArea,
                "description": formdata.ODescription,
                "dimension": formdata.ODimension,
                "quantity": formdata.OQuantity,
                "status": "0",
            };
            abp.message.confirm(
                'Record will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _rfqService.updateRFQOtherDetails(items4).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('Item Updated successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            OdataTable.clear().draw();
                            $('#Oitemno').val("0");
                            $('#OName').val("");
                            $('#OArea').val("");
                            $('#ODescription').val("");
                            $('#ODimension').val("");
                            $("#OQuantity").val("");
                            getrfqotherdetails($('#RequestId').val());

                        });
                    }
                }
            );

        }
    });
})();


