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
    var _productService = abp.services.app.expenseItemService;
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
    var _vendorService = abp.services.app.vendorService;

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
    getpricingtype();
    getpaymentterm();
    gettaxtype();

    //Item Autocomplete
    var getproducts = function (request, response) {
        _productService.getExpenseItemByName({ filter: request.term }).done(function (result) {
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
        _productService.getExpenseItem({ id: $productid }).done(function (result) {
            $('#ProductCode').val(result.code);
            $('#PerDescription').val(result.description);
            $('#ProductName').val(result.name);
            $('#UnitId').val(result.expenseAccountId);
            //if (result.imageName !== null && result.imageName !== '') {
            //    $("#ProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
            //    $("#ProductImage").show();
            //}
            //else {
            //    $("#ProductImage").hide();
            //}
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
            $('#accordiondiscount .collapse').collapse('show');
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
        //getproductunits();
        //getproductprice();
        return false;
    };
    var focusproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item.value);
        //$("#ProductName").val(ui.item.label);
        //$("#PerDescription").val(ui.item.label);
        getproduct();
        //getproductunits();
        //getproductprice();
    };
    var changeproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item ? ui.item.value : "");
        //$("#ProductName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#ProductCode").val("");
            $("#Quantity").val("1");
            $("#Price").val("");
            $("#PerDescription").val("");
            $("#ProductName").val("");
            var units = $('#Units');
            units.empty();
            units.selectpicker('refresh');
            $("#ProductImage").hide();
            $('#UnitId').val('');
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
        _productService.getExpenseItemByName({ filter: request.term }).done(function (result) {
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
        _productService.getExpenseItem({ id: $productid }).done(function (result) {
            $('#EProductCode').val(result.code);
            $('#EProductName').val(result.name);
            $('#EPerDescription').val(result.description);
            $('#EUnitId').val(result.expenseAccountId);
            //if (result.imageName !== null && result.imageName !== '') {
            //    $("#EProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
            //    $("#EProductImage").show();
            //}
            //else {
            //    $("#EProductImage").hide();
            //}
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
    var editselectproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item ? ui.item.value : "");
        $("#EProductName").val(ui.item ? ui.item.label : "");
        $("#EPrice").val("");
        editgetproduct();
        //editgetproductunits();
        //editgetproductprice();
        return false;
    };
    var editfocusproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item.value);
        //$("#EProductName").val(ui.item.label);
        editgetproduct();
        //editgetproductunits();
        //editgetproductprice();
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
            $('#EUnitId').val('');
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
        var $filter = request.term + '|' + '1,2,3,4';
        //var $accountexecutive = 'null';
        if (!abp.auth.isGranted("Master.Clients.AllAccounts")) {
            var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
            console.log(empid);
            $filter = $filter + '|' + empid;
        }
        _clientService.getClients({ filter: $filter }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    //function getclient() {
    //    var $clientid = $('#ClientId').val();
    //    _clientService.getClientDetails({ id: $clientid }).done(function (result) {
    //        $('#TelNo').val(result[0].telNo);
    //        $('#FaxNo').val(result[0].faxNo);
    //        $('#MobileNo').val(result[0].mobileNo);
    //        $('#Email').val(result[0].email);
    //        $('#Address').val(result[0].completeAddress);
    //        $('#AssignedToId').val(result[0].assignedToId);
    //        $('#AssignedToEmail').val(result[0].assignedToEmail);
    //        $('#AssignedTo').val(result[0].assignedTo);
    //    });
    //};
    //var selectclient = function (event, ui) {
    //    event.preventDefault();
    //    $("#ClientId").val(ui.item ? ui.item.value : "");
    //    $("#ClientName").val(ui.item ? ui.item.label : "");
    //    getclient();
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
    //        $("#ContactPersonId").val('');
    //        $("#ContactPerson").val('');
    //        $('#TelNo').val('');
    //        $('#FaxNo').val('');
    //        $('#MobileNo').val('');
    //        $('#Email').val('');
    //        $('#Address').val('');
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
    //Client Autocomplete

    //Vendor Autocomplete
    var getvendors = function (request, response) {
        _vendorService.getVendors({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getvendor() {
        //var $vendorid = $('#VendorId').val();
        var $vendorid = $('#ClientId').val();
        _vendorService.getVendors({ id: $vendorid }).done(function (result) {

        });
    };
    var selectvendor = function (event, ui) {
        event.preventDefault();
        //$("#VendorId").val(ui.item ? ui.item.value : "");
        //$("#Vendor").val(ui.item ? ui.item.label : "");
        $("#ClientId").val(ui.item ? ui.item.value : "");
        $("#ClientName").val(ui.item ? ui.item.label : "");
        getvendor();
        return false;
    };
    var focusvendor = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item.value);
        $("#ClientName").val(ui.item.label);
    };
    var changevendor = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item ? ui.item.value : "");
        $("#ClientName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {

        }
    };
    $("#ClientName").autocomplete({
        source: getvendors,
        select: selectvendor,
        focus: focusvendor,
        minLength: 2,
        delay: 100,
        change: changevendor
    });
    //Vendor Autocomplete

    //gettaxtype(1);
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

    function getAll() {
        dataTable.ajax.reload();
    }

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
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

        var $productid = $('#ProductId').val();
        var $productcode = $('#ProductCode').val();
        var $productname = $('#ProductName').val();
        var $unitid = $('#UnitId').val(); //$('#Units').val();
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
            //'<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
            '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productname + '</a><br /><small><span class="text-muted">' + $perdescription + '</span></small>',

            '<span class="text-muted" hidden>' + $quantity + '</span><span class="text-muted" hidden>' + $unit + '</span>',
            lessprice,
            totaldiscount,
            total,
            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            $productid, $productname, $perdescription, $quantity, $unitid, lessprice, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), totaldiscount, total, $groupname, $productcode
        ]).draw();
        computeTotal();
        $('#ProductId').val("");
        $('#ProductCode').val("");
        $('#ProductName').val("");
        $('#UnitId').val("");
        $('#Units').empty();
        $('#Discount1').val("");
        $('#Discount2').val("");
        $('#Discount3').val("");
        $('#Quantity').val("1");
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

        var newgrandtotal = grandtotal + chargestotal;

        $('#DiscountTotal').val(currencyFormat(discounttotal));
        $('#NetTotal').val(currencyFormat(nettotal));
        $('#Tax').val(currencyFormat(tax));
        $('#Total').val(currencyFormat(grandtotal));
        $('#ChargesTotal').val(currencyFormat(chargestotal));
        $('#GrandTotal').val(currencyFormat(newgrandtotal));
    }

    $('#UpdatetemButton').click(function (e) {
        e.preventDefault();
        var $indexno = parseInt($('#EIndexNo').text()) - 1;
        var $productid = $('#EProductId').val();
        var $productcode = $('#EProductCode').val();
        var $productname = $('#EProductName').val();
        var $unitid = $('#EUnitId').val(); //s').val();
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
        var totaldiscount = discount * quantity;
        var lessprice = price - discount;
        var total = lessprice * quantity;

        var table = _$itemsTable.DataTable();
        var temp = table.row($indexno).data();
        //temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>';
        temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productname + '</a><br /><small><span class="text-muted">' + $perdescription + '</span></small>';

        temp[2] = '<span class="text-muted" hidden>' + $quantity + '</span><span class="text-muted" hidden>' + $unit + '</span>';
        temp[3] = lessprice;
        temp[4] = totaldiscount;
        temp[5] = total;
        temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        temp[7] = $productid;
        temp[8] = $productname;
        temp[9] = $perdescription;
        temp[10] = $quantity;
        temp[11] = $unitid;
        temp[12] = lessprice;
        temp[13] = disc1;
        temp[14] = parseInt($dtype1);
        temp[15] = disc2;
        temp[16] = parseInt($dtype2);
        temp[17] = disc3;
        temp[18] = parseInt($dtype3);
        temp[19] = totaldiscount;
        temp[20] = total;
        temp[21] = $groupname;
        temp[22] = $productcode;
        $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
        $('#ItemEditModal').modal('hide');
        computeTotal();
    });

    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();

        if (formdata.DebitTotal !== formdata.CreditTotal) {
            abp.notify.warn('Entry type not balance.', 'Warning');
            return;
        }

        //alert(formdata.ClientId);
        //alert(formdata.RequestId);
        //alert(formdata.RequestCode);

        //$("#PartyClient").removeAttr("required");
        //remove.removeAttr('required', 'required');

        var viewData = {
            rfp: {
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": $("#Series option:selected").html(),
                "code": "0",
                "transactionTime": formdata.TransactionTime,
                "clientId": formdata.ClientId,
                "requestId": formdata.RequestId,
                "requestCode": formdata.RequestCode,
                "notes": formdata.Notes,
                "termsAndConditions": "",
                "statusId": "1",
                "taxTypeId": formdata.TaxTypeId,
                "paymentTermId": formdata.PaymentTermId,
                "subTotal": formdata.SubTotal,
                "netTotal": formdata.NetTotal,
                "taxRate": $("#TaxTypes option:selected").data('rate'),
                "tax": formdata.Tax,
                "grandTotal": formdata.Total,
            },
            rfpitems: []
        };
        disabled.attr('disabled', 'disabled');

        //sales order items
        var tableitem = _$itemsTable.DataTable();
        var form_data = tableitem.rows().data();
        var f = form_data;

        if (f.length <= 0) {
            abp.message.warn('Add item/s first.', 'Ooops! Record not saved.');
            return;
        }

        //jsonObj = [];
        for (var i = 0; f.length > i; i++) {
            item = {};
            item["requestId"] = formdata.SeriesTypeId;
            item["productId"] = f[i][7];
            item["productName"] = f[i][8];
            item["description"] = f[i][9];
            item["qty"] = f[i][10];
            item["unitId"] = f[i][11];
            item["unitPrice"] = f[i][12];
            item["disc1"] = f[i][13];
            item["discType1"] = f[i][14];
            item["disc2"] = f[i][15];
            item["discType2"] = f[i][16];
            item["disc3"] = f[i][17];
            item["discType3"] = f[i][18];
            item["discTotal"] = f[i][4];
            item["total"] = f[i][20];
            item["groupName"] = f[i][21];
            item["inventoryAccountId"] = "1";


            viewData.rfpitems.push(item);
            //jsonObj.push(item);
        }

        //var salesorderinput = JSON.stringify(viewData);
        var rfqinput = JSON.stringify(viewData);
        abp.message.confirm(
            'New RFP will be created.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_salesOrderService.createSalesOrder(viewData).done(function () {
                    _rfpService.createRFP(viewData).done(function () {
                        abp.notify.success('Request For Payment created', 'Success');

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

    function rearrange() {
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {
            var temp = table.row(i).data();
            var itemno = i + 1;



            var $productid = f[i][7];
            var $unitid = f[i][11];
            var productName = f[i][8];
            var $perdescription = f[i][9];
            var $quantity = f[i][10];
            var $price = f[i][12];
            var disc1 = f[i][13];
            var disc2 = f[i][15];
            var disc3 = f[i][17];
            var $dtype1 = f[i][14];
            var $dtype2 = f[i][16];
            var $dtype3 = f[i][18];
            var $groupname = f[i][21];
            var $productcode = f[i][22];
            var totaldiscount = f[i][4];

            temp[0] = itemno;
            temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
        }
    }
    $('#AddItemButton').click(function (e) {
        e.preventDefault();
        addnewitem();
        //generateTermsAndConditions();
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
    _$itemsTable.on('click', 'a.delete-item', function (e) {
        e.preventDefault();
        $this = $(this);
        var dtRow = $this.parents('tr');
        var table = _$itemsTable.DataTable();
        table.row(dtRow[0].rowIndex - 1).remove().draw(false);
        computeTotal();
        rearrange();
    });
    $('#SaveButton').click(function (e) {
        e.preventDefault();
        save();
    });

    $('#TaxTypes').on('change', function (e) {
        computeTotal();
    });

})(jQuery);

