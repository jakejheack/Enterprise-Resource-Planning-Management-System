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
    var _$itemsTableA = $('#ItemsTableApprove');
    var _$itemsTableDeleted = $('#ItemsTableDeleted');

    function getcompanies() {
        var companies = $('#Companies');
        abp.ui.block($('#Companies'));
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].isDefault === true) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    getseriestype(result.items[i].id);
                    //alert(result.items[i].payableAccountId);
                    $('#AccountId').val(result.items[i].payableAccountId);
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

    //Client Autocomplete
    //var getclients = function (request, response) {
    //    _clientService.getClients({ filter: request.term }).done(function (result) {
    //        response($.map(result.items, function (el) {
    //            return {
    //                label: el.name,
    //                value: el.id
    //            };
    //        }));
    //    });
    //};

    //function getclient() {
    //    var $clientid = $('#ClientId').val();
    //    _clientService.getClientDetails({ id: $clientid }).done(function (result) {
    //        $('#Telno').val(result[0].telNo);
    //        $('#Phone').val(result[0].mobileNo);
    //        $('#Taxno').val(result[0].taxNo);
    //        $('#Email').val(result[0].email);
    //        $('#Address').val(result[0].completeAddress);
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
    //        $('#Telno').val('');
    //        $('#Phone').val('');
    //        $('#Taxno').val('');
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

    function getclientbyid(id) {
        _clientService.getClientDetails({ id: id }).done(function (result) {
            //$('#ClientId').val(id);
            //$('#ClientName').val(result[0].name);
        });
    };

    function getvendortbyid(id) {
        _vendorService.getVendors({ id: id }).done(function (result) {
            //$('#VendorID').val(id);
            //$('#Vendor').val(result[0].name);
            $('#ClientId').val(id);
            $('#ClientName').val(result[0].name);
        });
    };

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


    //Quotation Autocomplete
    var getQuotations = function (request, response) {
        _quotationService.getQuotations({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.code,
                    value: el.id
                };
            }));
        });
    };
    function getQuotation() {
        var $quotationid = $('#RequestId').val();
        _quotationService.getQuotation({ id: $quotationid }).done(function (result) {
            //$('#ClientId').val(result.clientId);
            //$('#ClientName').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);

            var sonettotal = currencyFormat(result.netTotal);
            var sotax = currencyFormat(result.tax);
            var sototal = currencyFormat(result.grandTotal);
            $('#SubTotal').val(sonettotal);
            $('#Tax').val(sotax);
            $('#Total').val(sototal);
            $('#StatusBadge').text(result.status);
            getclientbyid(result.clientId);
            getquotationitems(result.id);
            gettaxtype(result.taxTypeId);
            getpricingtype(result.pricingTypeId);

        });
    };
    var selectQuotations = function (event, ui) {
        event.preventDefault();
        $("#RequestId").val(ui.item ? ui.item.value : "");
        $("#RequestCode").val(ui.item ? ui.item.label : "");
        getQuotation();
        return false;
    };
    var focusQuotations = function (event, ui) {
        event.preventDefault();
        $("#RequestId").val(ui.item.value);
        $("#RequestCode").val(ui.item.label);
    };
    var changQuotations = function (event, ui) {
        event.preventDefault();
        $("#RequestId").val(ui.item ? ui.item.value : "");
        $("#RequestCode").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#SubTotal').val('');
            $('#Tax').val('');
            $('#Total').val('');
            $('#Notes').val('');
            $('#Company').val('');
            $('#ClientName').val('');

        }
    };
    $("#RequestCode").autocomplete({
        source: getQuotations,
        select: selectQuotations,
        focus: focusQuotations,
        minLength: 2,
        delay: 100,
        change: changQuotations
    });
    //Client Autocomplete


    function getRFP() {
        var $id = $('#Id').val();
        //abp.ui.setBusy(_$form);
        _rfpService.getRFP({ id: $id }).done(function (result) {
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
            $('#StatusId').val(result.statusId);

            $('#NetTotal').val(result.netTotal);
            $('#Tax').val(result.tax);
            $('#Total').val(result.grandTotal);

            $('#StatusBadge').text(result.status);
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
            loadPage(result.statusId);
            //computeTotal();
            getRFPItems($id);

            //getvendortbyid(result.clientId)


        });


    };

    function getRFPItems(id) {
        _$itemsTable.DataTable().rows().remove().draw(false);
        _$itemsTableA.DataTable().rows().remove().draw(false);
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
                var sqitotal = sqiprice * sqiquantity;
                var sqidatacount = dataTable.rows().count();
                var sqiitemno = sqidatacount + 1;
                $('#DiscountTotal').val(sqitotaldiscount);
                dataTable.row.add([sqiitemno,
                    //'<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
                    '<a href="#" class="btn-link">' + $sqiproductname + '</a><br /><small><label class="text-muted">' + $sqiperdescription + '</label></small>',

                    '<label class="text-muted" hidden>' + $sqiquantity + '</label><label class="text-muted" hidden>' + $sqiunit + '</label>',
                    sqiprice,
                    sqitotaldiscount,
                    sqitotal,
                    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + sqiitemno + '"  data-id="' + $sqiproductid + '" data-unitid="' + $sqiunitid + '" data-unit="' + $sqiunit + '" data-perdesc="' + $sqiperdescription + '" data-qty="' + $sqiquantity + '" data-price="' + sqiprice + '" data-disc1="' + sqidisc1 + '" data-disc2="' + sqidisc2 + '" data-disc3="' + sqidisc3 + '" data-dtype1="' + parseInt($sqidtype1) + '" data-dtype2="' + parseInt($sqidtype2) + '" data-dtype3="' + parseInt($sqidtype3) + '" data-groupname="' + $sqigroupname + '" data-reference="' + $sqireference + '" data-disctotal="' + sqitotaldiscount + '" data-itemid="' + $sqiid + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                    $sqiproductid, $sqiproductname, $sqiperdescription, $sqiquantity, $sqiunitid, sqiprice, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), sqitotaldiscount, sqitotal, $sqiid

                ]).draw();

                dataTableA.row.add([sqiitemno,
                    //'<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
                    '<a href="#" class="btn-link">' + $sqiproductname + '</a><br /><small><label class="text-muted">' + $sqiperdescription + '</label></small>',

                    '<label class="text-muted">' + $sqiunit + '</label>',
                    sqiprice,
                    sqitotaldiscount,
                    sqitotal,
                    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemAEditModal" data-itemno="' + sqiitemno + '"  data-id="' + $sqiproductid + '" data-unitid="' + $sqiunitid + '" data-unit="' + $sqiunit + '" data-perdesc="' + $sqiperdescription + '" data-qty="' + $sqiquantity + '" data-price="' + sqiprice + '" data-disc1="' + sqidisc1 + '" data-disc2="' + sqidisc2 + '" data-disc3="' + sqidisc3 + '" data-dtype1="' + parseInt($sqidtype1) + '" data-dtype2="' + parseInt($sqidtype2) + '" data-dtype3="' + parseInt($sqidtype3) + '" data-groupname="' + $sqigroupname + '" data-reference="' + $sqireference + '" data-disctotal="' + sqitotaldiscount + '" data-itemid="' + $sqiid + '"><i class="fa fa-edit"></i></a>', //| <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
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

    //gettaxtype(1);
    function gettaxtype(id) {
        var taxtypes = $('#TaxTypes');
        taxtypes.empty();
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].type == 1) {
                    if (id === result.items[i].id) {
                        //taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' data-accountid=' + result.items[i].liabilityAccountId + ' selected>' + result.items[i].name + '</option>');
                        //Accounting
                        $('#TaxAccountId').val(result.items[i].liabilityAccountId);
                        //Accounting
                    }
                    else {
                        //taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' data-accountid=' + result.items[i].liabilityAccountId + '>' + result.items[i].name + '</option>');
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

    function loadPage(id) {
        if (id == '1') {
            $('#SaveButton').removeAttr('hidden');
            $('#PreApprovedButton').removeAttr('hidden');
            $('#ApprovedButton').removeAttr('hidden');
        }

        if (id == '2') {
            //$('#SaveButton').removeAttr('hidden');
        }

    }

    function getAll() {
        dataTable.ajax.reload();
    }



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
            $('#ProductName').val(result.name);
            $('#PerDescription').val(result.description);
            $('#UnitId').val(result.expenseAccountId);
            //if (result.imageName !== null && result.imageName !== '') {
            //    $("#ProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
            //    $("#ProductImage").show();
            //}
            //else {
            //    $("#ProductImage").hide();
            //}
            var $accountidExpense = $('#UnitId').val();
            if ($accountidExpense > 0) {
                _accountService.getAccount({ id: $accountidExpense }).done(function (result) {
                    $('#UnitName').val(result.name);
                });
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
        getproduct();
        //getproductunits();
        //getproductprice();
    };
    var changeproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item ? ui.item.value : "");
        //$("#ProductName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#ProductName").val("");
            $("#ProductCode").val("");
            $("#Quantity").val("1");
            $("#Price").val("");
            $("#PerDescription").val("");
            var units = $('#Units');
            units.empty();
            units.selectpicker('refresh');
            $("#ProductImage").hide();
            $('#UnitId').val('');
            $('#UnitName').val('');
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
            var $accountidExpense = $('#EUnitId').val();
            if ($accountidExpense > 0) {
                _accountService.getAccount({ id: $accountidExpense }).done(function (result) {
                    $('#EUnitName').val(result.name);
                });
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
        $("#EProductName").val(ui.item.label);
        editgetproduct();
        //editgetproductunits();
        //editgetproductprice();
    };
    var editchangeproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item ? ui.item.value : "");
        $("#EProductName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#EProductCode").val("");
            $("#EQuantity").val("1");
            $("#EPrice").val("");
            $("#EPerDescription").val("");
            var units = $('#EUnits');
            units.empty();
            units.selectpicker('refresh');
            $("#EProductImage").hide();
            $('#EUnitId').val('');
            $('#EUnitName').val('');
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

    function addnewitem() {

        var $productid = $('#ProductId').val();
        var $productcode = $('#ProductCode').val();
        var $productname = $('#ProductName').val();
        var $unitid = $('#UnitId').val(); //s').val();
        var $unit = $("#UnitName").val(); //s option:selected").html();
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
        var datacount = dataTable.rows().count();
        var itemno = datacount + 1;

        dataTable.row.add([itemno,
            //'<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
            '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productname + '</a><br /><small><span class="text-muted">' + $perdescription + '</span></small>',
            '<span class="text-muted" hidden>' + $unit + '</span>',
            lessprice,
            totaldiscount,
            total,
            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-unit="' + $unit + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            $productid, $productname, $perdescription, $quantity, $unitid, lessprice, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), totaldiscount, total, 0, $groupname, $productcode]).draw();

        dataTableA.row.add([itemno,
            //'<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
            '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productname + '</a><br /><small><span class="text-muted">' + $perdescription + '</span></small>',
            '<span class="text-muted">' + $unit + '</span>',
            lessprice,
            totaldiscount,
            total,
            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-unit="' + $unit + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>', //| <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            $productid, $productname, $perdescription, $quantity, $unitid, lessprice, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), totaldiscount, total, 0, $groupname, $productcode]).draw();


        computeTotal();




        $('#ProductId').val("");
        $('#ProductCode').val("");
        $('#ProductName').val("");
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
        //var $itemid = $('#EPerDescription').val();
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
        temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-unit="' + $unit + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
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
        temp[22] = $groupname;
        temp[23] = $productcode;
        $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
        $('#ItemEditModal').modal('hide');

        var tableA = _$itemsTableA.DataTable();
        var tempA = tableA.row($indexno).data();
        //temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>';
        tempA[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productname + '</a><br /><small><span class="text-muted">' + $perdescription + '</span></small>';

        tempA[2] = '<span class="text-muted">' + $unit + '</span>';
        tempA[3] = lessprice;
        tempA[4] = totaldiscount;
        tempA[5] = total;
        tempA[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-unit="' + $unit + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        tempA[7] = $productid;
        tempA[8] = $productname;
        tempA[9] = $perdescription;
        tempA[10] = $quantity;
        tempA[11] = $unitid;
        tempA[12] = lessprice;
        tempA[13] = disc1;
        tempA[14] = parseInt($dtype1);
        tempA[15] = disc2;
        tempA[16] = parseInt($dtype2);
        tempA[17] = disc3;
        tempA[18] = parseInt($dtype3);
        tempA[19] = totaldiscount;
        tempA[20] = total;
        tempA[22] = $groupname;
        tempA[23] = $productcode;
        $('#ItemsTableApprove').dataTable().fnUpdate(tempA, $indexno, undefined, false);
        computeTotal();
    });


    $('#UpdateItemAButton').click(function (e) {
        e.preventDefault();
        var $indexno = parseInt($('#EAIndexNo').text()) - 1;
        var $unitid = $('#ExpenseAccountId').val(); //s').val();
        var $unit = $("#ExpenseAccountName").val();

        if ($unitid == 0 || $unitid.length == 0) {
            abp.message.warn('Account required.', 'Ooops! Item not updated.');
            return;
        }
        var table = _$itemsTable.DataTable();
        var temp = table.row($indexno).data();
        temp[2] = '<span class="text-muted" hidden>' + $unit + '</span>';
        
        temp[11] = $unitid;
        $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);

        var tableA = _$itemsTableA.DataTable();
        var tempA = tableA.row($indexno).data();
        //temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>';
        tempA[2] = '<span class="text-muted">' + $unit + '</span>';
        tempA[11] = $unitid;
        $('#ItemsTableApprove').dataTable().fnUpdate(tempA, $indexno, undefined, false);
        computeTotal();
        $('#ItemAEditModal').modal('hide');
        $('#ExpenseAccountId').val(''); //s').val();
        $("#ExpenseAccountName").val('')
    });

    function rearrange() {
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {
            var temp = table.row(i).data();
            var itemno = i + 1;

            var $price = f[i][3];
            var $productid = f[i][7];
            var $perdescription = f[i][9];
            var $quantity = f[i][10];
            var $unitid = f[i][11];
            var disc1 = f[i][13];
            var disc2 = f[i][15];
            var disc3 = f[i][17];
            var $dtype1 = f[i][14];
            var $dtype2 = f[i][16];
            var $dtype3 = f[i][18];
            var $groupname = f[i][22];
            var $productcode = f[i][23];

            var totaldiscount = f[i][19];

            temp[0] = itemno;
            temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-unit="' + $unit + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
        }

        var tableA = _$itemsTableA.DataTable();
        var form_dataA = tableA.rows().data();
        var fA = form_dataA;
        for (var i = 0; fA.length > i; i++) {
            var tempA = tableA.row(i).data();
            var itemno = i + 1;

            var $price = fA[i][3];
            var $productid = fA[i][7];
            var $perdescription = fA[i][9];
            var $quantity = fA[i][10];
            var $unitid = fA[i][11];
            var disc1 = fA[i][13];
            var disc2 = fA[i][15];
            var disc3 = fA[i][17];
            var $dtype1 = fA[i][14];
            var $dtype2 = fA[i][16];
            var $dtype3 = fA[i][18];
            var $groupname = fA[i][22];
            var $productcode = fA[i][23];

            var totaldiscount = fA[i][19];

            tempA[0] = itemno;
            tempA[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-unit="' + $unit + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            $('#ItemsTableApprove').dataTable().fnUpdate(tempA, i, undefined, false);
        }
    }
    function deleteitem(indexno) {
        var dtable = _$itemsTable.DataTable();
        var dform_data = dtable.rows().data();
        var f = dform_data;
        for (var i = 0; f.length > i; i++) {
            //alert(f[i][7]);
            if (indexno === i) {
                dataTableDeleted.row.add([0,
                    '<a href="#" class="btn-link">' + f[i][7] + '</a><br /><small><label class="text-muted">' + f[i][8] + '</label></small>',
                    '<label class="text-muted">' + f[i][10] + '</label>|<label class="text-muted">' + f[i][11] + '</label>',
                    f[i][3],
                    f[i][4],
                    f[i][5],
                    '',
                    f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], f[i][12], f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17], parseInt(f[i][18]), f[i][19], f[i][20], f[i][21]
                ]).draw();
            }
        }
    }
    //function deletecharge(indexno) {
    //    var dtable = _$chargesTable.DataTable();
    //    var dform_data = dtable.rows().data();
    //    var f = dform_data;

    //    for (var i = 0; f.length > i; i++) {
    //        if (indexno === i) {
    //            dataTableChargesDeleted.row.add([0,
    //                f[i][1],
    //                f[i][2],
    //                f[i][3], f[i][4], '', f[i][6], f[i][7]]).draw();
    //        }
    //    }
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
        //dataTableCharges.column(4).data()
        //    .each(function (value, index) {
        //        var $chargestotal = parseFloat(value);
        //        chargestotal = chargestotal + $chargestotal;
        //    });

        var $taxtypeid = $('#TaxTypes').val();

        taxcode = $("#TaxTypes option:selected").data('code');
        taxrate = $("#TaxTypes option:selected").data('rate');

        //Accounting
        var taxaccountid = $("#TaxTypes option:selected").data('accountid');
        $('#TaxAccountId').val(taxaccountid);
        //Accounting

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

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
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
    var dataTableA = _$itemsTableA.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
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

    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }

        var statusid = $('#StatusId').val();
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();

        //alert(formdata.RequestId);
        var viewData = {
            rfp: {
                "id": formdata.Id,
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": formdata.Prefix,
                "code": formdata.RefNo,
                "transactionTime": formdata.TransactionTime,
                "clientId": formdata.ClientId,
                "requestId": formdata.RequestId,
                "requestCode": formdata.RequestCode,
                "notes": formdata.Notes,
                "termsAndConditions": "",
                "statusId": formdata.StatusId,
                "taxTypeId": formdata.TaxTypeId,
                "paymentTermId": formdata.PaymentTermId,
                "subTotal": formdata.SubTotal,
                "netTotal": formdata.NetTotal,
                "taxRate": $("#TaxTypes option:selected").data('rate'),
                "tax": formdata.Tax,
                "grandTotal": formdata.Total,
            },
            rfpitems: [],
            generalledger: []
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
            item["discTotal"] = f[i][19];
            item["total"] = f[i][20];
            item["groupName"] = "";
            item["inventoryAccountId"] = "1";
            item["id"] = f[i][21];


            //alert(f[i][21]);


            viewData.rfpitems.push(item);
            //jsonObj.push(item);
        }



        var tableledgers = _$itemsTable.DataTable();
        var form_dataledger = tableitem.rows().data();
        var x = form_dataledger;

        //for (var y = 0; x.length > y; y++) {
        //    var debit = parseFloat(x[y][2]);
        //    var credit = parseFloat(x[y][3]);
        //    ledger = {};
        //    ledger["TransactionTypeId"] = "0";
        //    ledger["TransactionId"] = formdata.Id;
        //    ledger["TransactionCode"] = formdata.RefNo;
        //    ledger["TransactionTime"] = formdata.TransactionTime;
        //    ledger["AccountId"] = formdata.AccountId;
        //    ledger["Debit"] = x[y][20];
        //    ledger["Credit"] = formdata.Tax;
        //    if (debit > 0) {
        //        ledger["BaseTypeId"] = "1";
        //    }
        //    else {
        //        ledger["BaseTypeId"] = "2";
        //    }

        //    ledger["Description"] = "";
        //    ledger["CenterTypeId"] = "1";
        //    ledger["PartyId"] = "3";
        //    ledger["ProjectId"] = "0";
        //    var partyid = "1";
        //    if (partyid > 0) {
        //        ledger["PartyName"] = formdata.ClientName;
        //        ledger["PartyCode"] = "105";
        //    }
        //    else {
        //        ledger["PartyName"] = "";
        //        ledger["PartyCode"] = "0";
        //    }
        //    ledger["CompanyId"] = formdata.CompanyId;
        //    viewData.generalledger.push(ledger);
        //}

        //generate ledger
        if (statusid == '2') {
            // A/P
            var ledger = {};
            ledger["TransactionTypeId"] = "0";
            ledger["TransactionId"] = formdata.Id;
            ledger["TransactionCode"] = formdata.RefNo;
            ledger["TransactionTime"] = formdata.TransactionTime;
            ledger["AccountId"] = formdata.AccountId;
            ledger["Debit"] = "0";
            ledger["Credit"] = formdata.Total;
            if (formdata.Total > 0) {
                ledger["BaseTypeId"] = "2";
            }
            else {
                ledger["BaseTypeId"] = "1";
            }

            ledger["Description"] = "";
            ledger["CenterTypeId"] = "1";
            ledger["PartyId"] = formdata.ClientId;
            ledger["ProjectId"] = "0";
            var partyid = "1";
            if (partyid > 0) {
                ledger["PartyName"] = formdata.ClientName;
                ledger["PartyCode"] = "200";
            }
            else {
                ledger["PartyName"] = "";
                ledger["PartyCode"] = "0";
            }
            ledger["CompanyId"] = formdata.CompanyId;
            viewData.generalledger.push(ledger);
            // A/P

            var $taxtypeid = $('#TaxTypes').val();

            var taxcode = $("#TaxTypes option:selected").data('code');
            var taxrate = $("#TaxTypes option:selected").data('rate');

            //Accounting
            var taxaccountid = $("#TaxTypes option:selected").data('accountid');
            $('#TaxAccountId').val(taxaccountid);
            //Accounting
            var enet = 0, etax = 0, etaxtotal = 0;

            //Expense
            var tableA = _$itemsTableA.DataTable();
            var form_dataA = tableA.rows().data();
            var fA = form_dataA;
            for (var i = 0; fA.length > i; i++) {
                var ledger = {};
                ledger["TransactionTypeId"] = "0";
                ledger["TransactionId"] = formdata.Id;
                ledger["TransactionCode"] = formdata.RefNo;
                ledger["TransactionTime"] = formdata.TransactionTime;
                ledger["AccountId"] = fA[i][11]; //$('#ExpenseAccountId').val();

                enet = 0;
                etax = 0;
                var eamt = fA[i][5] + '';
                var eamount = parseFloat(eamt.replace(/,/g, ''));
                if (taxcode === 101) {
                    enet = eamount / taxrate;
                    etax = enet * (taxrate - 1);
                    etaxtotal += etax;
                }
                else if (taxcode === 104) {
                    enet = eamount;
                    etax = enet * (taxrate - 1);
                    etaxtotal += etax;
                    //grandtotal = nettotal * taxrate;
                }
                else {
                    enet = eamount;
                    etax = 0;
                    etaxtotal += etax;
                }

                ledger["Debit"] = currencyFormat(enet); //formdata.NetTotal;
                ledger["Credit"] = "0";
                if (formdata.NetTotal > 0) {
                    ledger["BaseTypeId"] = "1";
                }
                else {
                    ledger["BaseTypeId"] = "2";
                }

                ledger["Description"] = "";
                ledger["CenterTypeId"] = "1";
                ledger["PartyId"] = formdata.ClientId;
                ledger["ProjectId"] = "0";
                var partyid = "1";
                if (partyid > 0) {
                    ledger["PartyName"] = formdata.ClientName;
                    ledger["PartyCode"] = "200";
                }
                else {
                    ledger["PartyName"] = "";
                    ledger["PartyCode"] = "0";
                }
                ledger["CompanyId"] = formdata.CompanyId;
                viewData.generalledger.push(ledger);
            }
            //Expense

            //Tax
            var ledger = {};
            ledger["TransactionTypeId"] = "0";
            ledger["TransactionId"] = formdata.Id;
            ledger["TransactionCode"] = formdata.RefNo;
            ledger["TransactionTime"] = formdata.TransactionTime;
            ledger["AccountId"] = formdata.TaxAccountId;
            ledger["Debit"] = currencyFormat(etaxtotal); //formdata.Tax;
            ledger["Credit"] = "0";
            if (formdata.Tax > 0) {
                ledger["BaseTypeId"] = "1";
            }
            else {
                ledger["BaseTypeId"] = "2";
            }

            ledger["Description"] = "";
            ledger["CenterTypeId"] = "1";
            ledger["PartyId"] = formdata.ClientId;
            ledger["ProjectId"] = "0";
            var partyid = "1";
            if (partyid > 0) {
                ledger["PartyName"] = formdata.ClientName;
                ledger["PartyCode"] = "200";
            }
            else {
                ledger["PartyName"] = "";
                ledger["PartyCode"] = "0";
            }
            ledger["CompanyId"] = formdata.CompanyId;
            viewData.generalledger.push(ledger);
            //Tax
        }
        //generate ledger

        var tabledeleted = _$itemsTableDeleted.DataTable();
        var form_deleteddata = tabledeleted.rows().data();
        var g = form_deleteddata;

        for (var j = 0; g.length > j; j++) {

            item = {};
            item["requestId"] = "0";
            item["productId"] = g[j][7];
            item["productName"] = g[j][8];
            item["description"] = g[j][9];
            item["qty"] = g[j][10];
            item["unitId"] = g[j][11];
            item["unitPrice"] = g[j][12];
            item["disc1"] = g[j][13];
            item["discType1"] = g[j][14];
            item["disc2"] = g[j][15];
            item["discType2"] = g[j][16];
            item["disc3"] = g[j][17];
            item["discType3"] = g[j][18];
            item["discTotal"] = g[j][19];
            item["total"] = g[j][20];
            item["groupName"] = "";
            item["inventoryAccountId"] = "1";
            item["id"] = g[j][21];
            item["IsDeleted"] = 1;
            //viewData.rfpitems.push(item);
            if (g[j][21] > 0) {
                viewData.rfpitems.push(item);
            }
        }


        //var salesorderinput = JSON.stringify(viewData);
        //var rfqinput = JSON.stringify(viewData);
        abp.message.confirm(
            'New RFP will be updated.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_salesOrderService.createSalesOrder(viewData).done(function () {
                    _rfpService.updateRFP(viewData).done(function () {
                        abp.notify.success('Request For Payment updated', 'Success');

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


    _$itemsTableA.on('click', 'a.edit-item', function (e) {
        e.preventDefault();
        var $itemno = $(this).attr("data-itemno");
        var $productid = $(this).attr("data-id");
        var $qty = $(this).attr("data-qty");
        var $unitid = $(this).attr("data-unitid");
        var $unit = $(this).attr("data-unit");
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
        $('#EAIndexNo').text($itemno);
        if ($unitid > 0) {
            $('#ExpenseAccountId').val($unitid);
            $('#ExpenseAccountName').val($unit);
        }
        else {
            $('#ExpenseAccountId').val('');
            $('#ExpenseAccountName').val('');
        }
    });

    _$itemsTable.on('click', 'a.delete-item', function (e) {
        e.preventDefault();
        $this = $(this);
        var dtRow = $this.parents('tr');
        var table = _$itemsTable.DataTable();
        deleteitem(dtRow[0].rowIndex - 1);

        var tableA = _$itemsTableA.DataTable();
        //deleteitem(dtRow[0].rowIndex - 1);
        tableA.row(dtRow[0].rowIndex - 1).remove().draw(false);

        table.row(dtRow[0].rowIndex - 1).remove().draw(false);

        computeTotal();
        rearrange();
    });
    $('#AddItemButton').click(function (e) {
        e.preventDefault();
        addnewitem();
        //generateTermsAndConditions();
    });
    $('#SaveButton').click(function (e) {
        e.preventDefault();
        save();
    });

    $('#PreApprovedButton').click(function (e) {
        e.preventDefault();
        $('#ExpenseAccountModal').modal('show');
    });

    //Sales Account Autocomplete
    var getAccountsExpense = function (request, response) {
        _accountService.getAccountByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getAccountExpense() {
        var $accountidExpense = $('#ExpenseAccountId').val();
        _accountService.getAccount({ id: $accountidExpense }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectAccountExpense = function (event, ui) {
        event.preventDefault();
        $("#ExpenseAccountId").val(ui.item ? ui.item.value : "");
        $("#ExpenseAccountName").val(ui.item ? ui.item.label : "");

        getAccountExpense();
        return false;
    };
    var focusAccountExpense = function (event, ui) {
        event.preventDefault();
        $("#ExpenseAccountId").val(ui.item.value);
        $("#ExpenseAccountName").val(ui.item.label);
    };
    var changeAccountExpense = function (event, ui) {
        event.preventDefault();
        $("#ExpenseAccountId").val(ui.item ? ui.item.value : "");
        $("#ExpenseAccountName").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#ExpenseAccountName").autocomplete({
        source: getAccountsExpense,
        select: selectAccountExpense,
        focus: focusAccountExpense,
        minLength: 2,
        delay: 100,
        change: changeAccountExpense
    });
        //Sales Account Autocomplete

    $('#ApprovedButton').click(function (e) {
        e.preventDefault();
        var expacc = 1; //$("#ExpenseAccountId").val();
        var eindex = 0;
        //var $statusid = $('#StatusId').val();

        var tableitemA = _$itemsTableA.DataTable();
        var form_data = tableitemA.rows().data();
        var f = form_data;

        if (f.length <= 0) {
            abp.message.warn('Add item/s first.', 'Ooops! Record not saved.');
            return;
        }

        //jsonObj = [];
        for (var i = 0; f.length > i; i++) {
            console.log(f[i]);
            if (f[i][11] == 0) {
                expacc = f[i][11];
                eindex = f[i][0];
                break;
            }
        }

        if (expacc > 0) {
            $('#StatusId').val(2);
            save();
        }
        else {
            abp.message.warn('Item #' + eindex + ' Expense Account is required!', 'Warning');
        }
    });

    $('#TaxTypes').on('change', function (e) {
        computeTotal();
    });

})(jQuery);

