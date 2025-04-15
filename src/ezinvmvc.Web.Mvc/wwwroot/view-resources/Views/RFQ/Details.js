function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

        //if (amount.indexOf(".", present) || amount.indexOf(".", present + 1));
        //{}
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

(function ($) {
    var _pricingTypeService = abp.services.app.pricingTypeService;
    var _productPriceService = abp.services.app.productPriceService;
    var _productService = abp.services.app.productService;
    var _companyService = abp.services.app.companyService;
    var _commonService = abp.services.app.commonService;
    var _clientService = abp.services.app.clientService;
    var _salesOrderService = abp.services.app.salesOrderService;
    var _rfqService = abp.services.app.rFQService;
    var _tasksService = abp.services.app.tasksService;
    //var _clientService = abp.services.app.clientService;
    //var _provService = abp.services.app.provinceService;

    var _$form = $('form[name=RfqForm]');
    var _$itemsTable = $('#ItemsTable');
    var _$itemsTableDeleted = $('#ItemsTableDeleted');
    var _$assignedTable = $('#AssignedTable');
    var _$OItemsTable = $('#OItemsTable');

    //Handle From Type change
    $('#Type').change(function (e) {
        $sel = $(this).children("option:selected").val();
        if ($sel.toUpperCase() === "Leads".toUpperCase()) {
            $("#divLead").show();
            $("#LeadId").attr("required");
            $("#LeadCode").attr("required");
            $("#Lead").attr("required");
            $("#ClientId").removeAttr("required");
            //$("#ClientId").attr("readonly", "readonly");
            $("#ClientName").removeAttr("required");
            $("#ClientName").attr("readonly", "readonly");
            $("#ContactPersonId").removeAttr("required")
            //$("#ContactPersonId").attr("readonly", "readonly");
            $("#ContactPerson").removeAttr("required")
            $("#ContactPerson").attr("readonly", "readonly");
            $("#ProjectName").removeAttr("required")
            $("#ProjectName").attr("readonly", "readonly");
        }
        else {
            $("#divLead").hide();
            $("#LeadId").removeAttr("required");
            $("#LeadCode").removeAttr("required");
            $("#Lead").removeAttr("required");
            //$("#ClientId").removeAttr("readonly");
            $("#ClientId").attr("required", "required");
            $("#ClientName").removeAttr("readonly");
            $("#ClientName").attr("required", "required");
            $("#ContactPersonId").attr("required", "required")
            //$("#ContactPersonId").removeAttr("readonly");
            $("#ContactPerson").attr("required", "required")
            $("#ContactPerson").removeAttr("readonly");
            $("#ProjectName").attr("required", "required")
            $("#ProjectName").removeAttr("readonly");


        }

        $("#LeadId").val('');
        $("#LeadCode").val('');
        $("#Lead").val('');
        $("#ClientId").val('');
        $("#ClientName").val('');
        $("#ContactPersonId").val('');
        $("#ContactPerson").val('');
        $("#ProjectName").val('');
        $('#Telno').val('');
        $('#Phone').val('');
        $('#Taxno').val('');
        $('#Email').val('');
        $('#Address').val('');
    });

    function getrfq() {
        var $id = $('#Id').val();
        abp.ui.setBusy(_$form);
        _rfqService.getRFQ({ id: $id }).done(function (result) {
            //$('#Id').val(result.id);
            $('#Prefix').val(result.prefix);
            $('#Code').val(result.code);
            var rtransactiontime = new Date(result.transactionTime);
            var tt = getFormattedDate(rtransactiontime);
            $('#TransactionTime').val(tt);
            $('#RevisionNo').val(result.revisionNo);
            $('#RefNo').val(result.code);
            $('#Series').val(result.seriesTypeId);
            $('#CompanyId').val(result.companyId);
            $("#Type").val(result.type).change();
            $("#Type").selectpicker('refresh');
            $("#LeadId").val(result.leadId);
            $("#LeadCode").val(result.lead);
            $("#Lead").val(result.lead + ' - ' + result.clientName + ' - ' + result.projectName);
            $('#ClientId').val(result.clientId);
            $('#ClientName').val(result.clientName);
            $('#ProjectName').val(result.projectName);
            $('#ContactPersonId').val(result.contactPersonId);
            $('#ContactPerson').val(result.contactPerson);

            var rdeadlines = new Date(result.deadlines);
            var dline = getFormattedDate(rdeadlines);
            $('#Deadlines').val(dline);

            $('#Telno').val(result.telNo);
            $('#Phone').val(result.phone);
            $('#Email').val(result.email);
            $('#Address').val(result.address);
            $('#DeliveryAddress').val(result.deliveryAddress);
            $('#Discount').val(result.discount);
            $('#Vat').val(result.vat);
            $('#Vat').selectpicker('refresh');
            $('#Remarks').val(result.remarks);
            $('#StatusId').val(result.statusId);
            //alert(result.status);
            $('#StatusBadge').text(result.status);
            $('#Others').val(result.others);

            //alert(result.statusid);

            switch (result.statusId) {
                case 1:
                    $('#StatusBadge').addClass('badge badge-secondary');


                    //if ($('#UpdateRfqButton').length) {
                    //    $('#UpdateRfqButton').removeAttr('hidden');
                    //}
                    //if ($('#SubmitButton').length) {
                    //    $('#SubmitButton').removeAttr('hidden');
                    //}
                    break;
                case 2:
                    $('#StatusBadge').addClass('badge badge-success');
                    //if ($('#ReviseButton').length) {
                    //    $('#ReviseButton').removeAttr('hidden');
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
                default:
                    $('#StatusBadge').addClass('badge badge-secondary');
            }

            //var sotransactiontime = new Date(result.transactionTime);
            //var sodeliverytime = new Date(result.deliveryTime);
            //$('#TransactionTime').val(getFormattedDate(sotransactiontime));
            //$('#DeliveryTime').val(getFormattedDate(sodeliverytime));
            //$('#OrderTypes').val(result.orderTypeId);
            //$('#PricingTypes').val(result.pricingTypeId);
            //$('#PaymentTerms').val(result.termId);
            //$('#SalesAgentId').val(result.salesAgentId);
            //$('#QuotationId').val(result.quotationId);
            //$('#QuotationCode').val(result.quotationCode);
            //$('#ClientOrderNo').val(result.clientOrderNo);
            //$('#TaxTypes').val(result.taxTypeId);
            //$('#Notes').val(result.notes);
            //var sonettotal = currencyFormat(result.netTotal);
            //var sotax = currencyFormat(result.tax);
            //var sototal = currencyFormat(result.grandTotal);
            //$('#SubTotal').val(sonettotal);
            //$('#Tax').val(sotax);
            //$('#Total').val(sototal);
            ////getseriestype(result.seriesTypeId);
            var compid = result.companyId;
            getcompanies(compid);
            //getordertype(result.orderTypeId);
            //gettaxtype(result.taxTypeId);
            //getpricingtype(result.pricingTypeId);
            //getpaymentterm(result.termId);
            //getclient();
            //getsalesorderitems($id);
            getrfqdetails($id);
            getAssignedPerson($id);
            getRevisionNos();
            abp.ui.clearBusy(_$form);
        });


    };

    function getRevisionNos() {
        var code = $('#Code').val();
        var $revnos = $('#sRevisionNo');
        var revno = $('#RevisionNo').val();
        var id = $('#Id').val();
        $revnos.empty();
        _rfqService.getRFQRevisions({ filter: code, sorting: "revisionno asc" }).done(function (result) {
            for (var i = 0; i < result.length; i++) {
                //alert(id + "===" + result[i].id + "|" + revno + "===" + result[i].revisionNo);
                if (revno.trim() === (result[i].revisionNo + "").trim()) {
                    //alert("equal");
                    $revnos.append('<option value=' + result[i].id + ' selected>' + result[i].revisionNo + '</option>');
                }
                else {
                    $revnos.append('<option value=' + result[i].id + '>' + result[i].revisionNo + '</option>');
                }
            }
            $revnos.selectpicker('refresh');
        });
    }

    $('#sRevisionNo').change(function () {
        var id = $(this).children("option:selected").val();
        $('#Id').val(id);
        getrfq();
    });

    function getrfqdetails(id) {
        _$itemsTable.DataTable().rows().remove().draw(false);
        _rfqService.getRfqDetailsByParentId({ id: id }).done(function (result) {

            for (var i = 0; i < result.items.length; i++) {
                var $soiid = result.items[i].id;
                var $soiproductid = result.items[i].productId;
                var $soiproductcode = result.items[i].productCode;
                var $soidescription = result.items[i].description;
                var $soiunitid = result.items[i].unitId;
                var $soiunit = result.items[i].unit;
                var $soiquantity = result.items[i].qty;
                var $soiprice = result.items[i].unitPrice;
                var $soiproductname = result.items[i].rfqCode;

                var $soidisc1 = 0;
                var $soidisc2 = 0;
                var $soidisc3 = 0;
                var $soidtype1 = "0";
                var $soidtype2 = "0";
                var $soidtype3 = "0";
                var $soiperdescription = result.items[i].description;
                var $groupname = result.items[i].groupName;

                var $socolor = result.items[i].color;
                var soiprice = parseFloat($soiprice);
                var soiquantity = parseFloat($soiquantity);

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

                dataTable.row.add([soiitemno,
                    '<a href="#" class="text-warning font-weight-bold">' + $groupname + '</a><br /><a href="#" class="btn-link">' + $soiproductcode + '</a><br /><span class="text-muted">' + $soiproductname + ' ' + $socolor + '</span><br /><span class="text-muted">' + $soidescription + '</span>',
                    '<span class="text-muted">' + $soiquantity + '</span> | <span class="text-muted">' + $soiunit + '</span>',
                    '',
                    $soiproductid, $soiperdescription, $soiquantity, $soiunitid, $soiid
                ]).draw();
            }
        });

        getrfqotherdetails(id);
    };

    function getAssignedPerson(id) {
        //_$assignedTable.dataTableAssigned().rows().remove().draw(false);
        _tasksService.getTaskByParentId({ id: id }).done(function (result) {

            for (var i = 0; i < result.items.length; i++) {
                var $name = result.items[i].name;
                var $email = result.items[i].email;

                //var $name = result.name;
                //var $email = result.email;

                var datacount = dataTableAssigned.rows().count();
                var itemno = datacount + 1;

                dataTableAssigned.row.add([itemno,
                    '<a href="#" class="text-muted">' + $name + '</a><br />',
                    '<label class="text-muted">' + $email + '</label>',
                    ''
                ]).draw();
            }
        });
    };

    //function getrfqdetails(id) {
    //    _rfqService.getRfqDetailsByParentId({ id: id }).done(function (result) {

    //        for (var i = 0; i < result.items.length; i++) {
    //            var $soiid = result.items[i].id;
    //            var $soiproductid = result.items[i].productId;
    //            var $soiproductcode = result.items[i].productCode;
    //            var $soiproductname = result.items[i].description;
    //            var $soiunitid = result.items[i].unitId;
    //            var $soiunit = result.items[i].unit;
    //            var $soiquantity = result.items[i].qty;
    //            var $soiprice = result.items[i].unitPrice;

    //            var $soidisc1 = 0;
    //            var $soidisc2 = 0;
    //            var $soidisc3 = 0;
    //            var $soidtype1 = "0";
    //            var $soidtype2 = "0";
    //            var $soidtype3 = "0";
    //            var $soiperdescription = result.items[i].description;

    //            var soiprice = parseFloat($soiprice);
    //            var soiquantity = parseFloat($soiquantity);

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
    //                '<a href="#" class="btn-link">' + $soiproductcode + '</a><br /><small><label class="text-muted">' + $soiperdescription + '</label></small>',
    //                '<label class="text-muted">' + $soiquantity + '</label>|<label class="text-muted">' + $soiunit + '</label>',
    //                soiprice,
    //                soitotaldiscount,
    //                soitotal,
    //                '',
    //                $soiproductid, $soiperdescription, $soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soiid
    //            ]).draw();
    //        }
    //    });
    //};

    getrfq();

    function getcompanies(id) {
        //alert("hoy");
        //var companies = $('#Companies');
        //companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                //alert(id);
                //alert(result.items[i].id)
                if (id === result.items[i].id) {
                    //companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    //$("#CompanyId").val(id)
                    $("#Company").val(result.items[i].name);
                }
                //else {
                //    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                //}
            }
            //companies.selectpicker('refresh');
        });
    }

    //function getcompanies() {
    //var companies = $('#Companies');
    //companies.empty();
    //_companyService.getCompanies().done(function (result) {
    //    for (var i = 0; i < result.items.length; i++) {
    //        if (result.items[i].isDefault === true) {
    //            companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            getseriestype(result.items[i].id);
    //        }
    //        else {
    //            companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //        }
    //    }
    //    companies.selectpicker('refresh');
    //});
    //}

    //getcompanies();
    //$('#Companies').on('change', function (e) {
    //    getseriestype($('#Companies').val());
    //});
    //function getseriestype(companyid) {
    //    var series = $('#Series');
    //    series.empty();
    //    _commonService.getSeriesTypesByTransId({ id: 2, transactionCode: 101, companyId: companyid }).done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
    //        }
    //        series.selectpicker('refresh');
    //    });
    //}


    function getAll() {
        dataTable.ajax.reload();
    }

    //$('#SearchButton').click(function (e) {
    //    e.preventDefault();
    //    getAll();
    //});

    //$('#SearchFilter').on('keydown', function (e) {
    //    if (e.keyCode !== 13) {
    //        return;
    //    }
    //    e.preventDefault();
    //    getAll();
    //});

    //$('#SearchFilter').focus();

    //Lead Autocomplete
    var getleads = function (request, response) {
        _leadService.getLeadsforRFQ({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.code + ' - ' + el.clientName + ' - ' + el.project,
                    value: el.id
                };
            }));
        });
    };

    function getlead() {
        var $leadid = $('#LeadId').val();
        _leadService.getLead({ id: $leadid }).done(function (result) {
            $("#LeadCode").val(result.code);
            $("#ClientId").val(result.clientId);
            $("#ClientName").val(result.clientName);
            $("#ContactPersonId").val(result.contactPersonId);
            getcontactperson();
            $("#ProjectName").val(result.project);
            getclient();
        });
    };
    var selectlead = function (event, ui) {
        event.preventDefault();
        $("#LeadId").val(ui.item ? ui.item.value : "");
        $("#Lead").val(ui.item ? ui.item.label : "");
        getlead();
        return false;
    };
    var focuslead = function (event, ui) {
        event.preventDefault();
        $("#LeadId").val(ui.item.value);
        $("#Lead").val(ui.item.label);
    };
    var changelead = function (event, ui) {
        event.preventDefault();
        $("#LeadId").val(ui.item ? ui.item.value : "");
        $("#Lead").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#ClientId").val('');
            $("#ClientName").val('');
            $("#ContactPersonId").val('');
            $("#ContactPerson").val('');
            $("#ProjectName").val('');
            $('#Telno').val('');
            $('#Phone').val('');
            $('#Taxno').val('');
            $('#Email').val('');
            $('#Address').val('');
        }
    };
    $("#Lead").autocomplete({
        source: getleads,
        select: selectlead,
        focus: focuslead,
        minLength: 2,
        delay: 100,
        change: changelead
    });
    //Lead Autocomplete

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
        _clientService.getClientDetails({ id: $clientid }).done(function (result) {
            $('#Telno').val(result[0].telNo);
            $('#Phone').val(result[0].mobileNo);
            $('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            $('#Address').val(result[0].completeAddress);
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
            $('#Telno').val('');
            $('#Phone').val('');
            $('#Taxno').val('');
            $('#Email').val('');
            $('#Address').val('');
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

    //CPerson Autocomplete
    var getcpersons = function (request, response) {
        var $clientid = $('#ClientId').val();
        _cpersonService.getContactPersonsFiltered({ id: 0, reference: "Client", referenceId: $clientid, filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.fullName,
                    value: el.id
                };
            }));
        });
    };
    function getcontactperson() {
        var $cpersonid = $('#ContactPersonId').val();
        _cpersonService.getContactPerson({ id: $cpersonid }).done(function (result) {
            $('#ContactPerson').val(result.title + ' ' + result.firstName + ' ' + result.lastName);
            $('#Email').val(result.email);
        });
    };
    var selectcperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item ? ui.item.value : "");
        $("#ContactPerson").val(ui.item ? ui.item.label : "");
        //getclient();
        return false;
    };
    var focuscperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item.value);
        $("#ContactPerson").val(ui.item.label);
    };
    var changecperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item ? ui.item.value : "");
        $("#ContactPerson").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $("#ContactPersonId").val('');
        //    $("#ContactPerson").val('');
        //    $('#TelNo').val('');
        //    $('#FaxNo').val('');
        //    $('#MobileNo').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#ContactPerson").autocomplete({
        source: getcpersons,
        select: selectcperson,
        focus: focuscperson,
        minLength: 2,
        delay: 100,
        change: changecperson
    });
    //CPerson Autocomplete

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
    };

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
    //Additem
    //Datatable Add

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            //targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            //MARC --WALA KA NA NITO SA VIEW
            //targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            targets: [4, 5, 6, 7]
        },
        {
            orderable: false,
            //targets: [0, 1, 2, [3, 4, 5, 6]
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [0, 1, 2, 6]
            targets: [0, 1, 2, 3]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
        {
            className: 'text-center',
            targets: [2]
        },
        {
            visible: false,
            data: null,
            className: "text-center",
            "render": function () {
                return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            },
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [6]
            targets: [3]
        }
        ]
    });

    var deletedataTabled = _$itemsTableDeleted.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            //targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            //MARC --WALA KA NA NITO SA VIEW
            //targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            targets: [4, 5, 6, 7]
        },
        {
            orderable: false,
            //targets: [0, 1, 2, [3, 4, 5, 6]
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [0, 1, 2, 6]
            targets: [0, 1, 2, 3]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
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
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [6]
            targets: [3]
        }
        ]
    });

    var dataTableAssigned = _$assignedTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            //targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            //MARC --WALA KA NA NITO SA VIEW
            //targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            //targets: [4, 5, 6, 7]
        },
        {
            orderable: false,
            //targets: [0, 1, 2, [3, 4, 5, 6]
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [0, 1, 2, 6]
            targets: [0, 1, 2, 3]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
        {
            className: 'text-center',
            targets: [2]
        },
        {
            visible: false,
            data: null,
            className: "text-center",
            "render": function () {
                return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            },
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [6]
            targets: [3]
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

        //MARC --WALA KA PRICE
        //var $price = $('#Price').val();

        //MARC --WALA KA DISCOUNTS
        //var $disc1 = $('#Discount1').val();
        //var $disc2 = $('#Discount2').val();
        //var $disc3 = $('#Discount3').val();
        //var $dtype1 = $('#DiscountType1').val();
        //var $dtype2 = $('#DiscountType2').val();
        //var $dtype3 = $('#DiscountType3').val();
        var $perdescription = $('#PerDescription').val();

        //MARC --WALA KA ULIT PRICE
        if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '') {// || $price === '') {
            return;
        }

        //MARC --WALA KA ULIT PRICE
        //var price = parseFloat($price.replace(/,/g, ''));
        var quantity = parseFloat($quantity);

        //MARC --WALA KA ULIT DISCOUNTS
        //var disc1 = 0;
        //var disc2 = 0;
        //var disc3 = 0;
        //if ($disc1 !== "") {
        //    disc1 = parseFloat($disc1);
        //}
        //if ($disc2 !== "") {
        //    disc2 = parseFloat($disc2);
        //}
        //if ($disc3 !== "") {
        //    disc3 = parseFloat($disc3);
        //}

        //MARC --WALA KA ULIT DISCOUNTS AT PRICE
        //var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
        //var totaldiscount = discount * quantity;
        //var lessprice = price - discount;
        //var total = lessprice * quantity;

        var datacount = dataTable.rows().count();
        var itemno = datacount + 1;
        var $rowid = "id_row_" + itemno;
        var $rowcode = "code_row_" + itemno;
        var $rowname = "name_row_" + itemno;
        var $rowquantity = "quantity_row_" + itemno;
        var $rowunit = "unit_row_" + itemno;
        dataTable.row.add([itemno,
            '<a href="#" name="' + $rowcode + '" class="btn-link">' + $productcode + '</a><br /><small><label name="' + $rowname + '" class="text-muted">' + $perdescription + '</label></small>',
            '<label name="' + $rowquantity + '" class="text-muted">' + $quantity + '</label>|<label name="' + $rowunit + '" class="text-muted">' + $unit + '</label>',
            //MARC --WALA KA ULIT PRICE
            //price,
            //totaldiscount,
            //total,
            '',
            //MARC --WALA KA ULIT DISCOUNTS
            $productid, $perdescription, $quantity, $unitid
            //, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3)
        ]).draw();

        //MARC --WALA KA ULIT PRICE
        //computeTotal();

        //MARC --WALA KA ULIT DISCOUNTS
        //$('#Discount1').val("");
        //$('#Discount2').val("");
        //$('#Discount3').val("");
        $('#Quantity').val("");
        //MARC --DAGDAG KO TO
        $('#ProductCode').val('');
        $('#ProductName').val('');
        $('#ProductId').val('');
        $('#PerDescription').val('')
    }

    function deleteitem(indexno) {
        var dtable = _$itemsTable.DataTable();
        var dform_data = dtable.rows().data();
        var f = dform_data;

        for (var i = 0; f.length > i; i++) {
            if (indexno === i) {
                deletedataTabled.row.add([0,
                    '<a href="#" class="btn-link">' + f[i][4] + '</a><br /><small><label class="text-muted">' + f[i][5] + '</label></small>',
                    '<label class="text-muted">' + f[i][6] + '</label>|<label class="text-muted">' + f[i][7] + '</label>',
                    '',
                    f[i][4], f[i][5], f[i][6], f[i][7], f[i][8]
                ]).draw();
            }
        }
    }

    function computeTotal() {
        var grandtotal = 0;
        var taxrate = 0;
        var tax = 0;
        var taxcode = 101;
        var nettotal = 0;
        dataTable.column(5).data()
            .each(function (value, index) {
                var $grandtotal = parseFloat(value);
                grandtotal = grandtotal + $grandtotal;
            });

        var $taxtypeid = $('#TaxTypes').val();

        taxcode = $("#TaxTypes option:selected").data('code');
        taxrate = $("#TaxTypes option:selected").data('rate');

        if (taxcode === 101) {
            nettotal = grandtotal / taxrate;
            tax = nettotal * (taxrate - 1);
        }
        else {
            nettotal = grandtotal;
            tax = 0;
        }

        $('#SubTotal').val(currencyFormat(nettotal));
        $('#Tax').val(currencyFormat(tax));
        $('#Total').val(currencyFormat(grandtotal));
    }



    _$itemsTable.on('click', 'a.delete-item', function (e) {
        e.preventDefault();
        $this = $(this);
        var dtRow = $this.parents('tr');
        var tableitemsdelete = _$itemsTable.DataTable();
        deleteitem(dtRow[0].rowIndex - 1);
        tableitemsdelete.row(dtRow[0].rowIndex - 1).remove().draw(false);
        // computeTotal();
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

    function updateRfq() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();
        var $updatedsoid = $('#Id').val();
        var viewData = {
            rfq: {
                "id": formdata.Id,
                //"companyId": formdata.CompanyId,
                //"seriesTypeId": formdata.SeriesTypeId,
                ////"prefix": $("#Series option:selected").html(),
                //"prefix": formdata.Prefix,
                //"code": formdata.Code,
                ////"clientId": formdata.ClientId,
                //"clientId": 1,
                //"projectName": formdata.ProjectName1,
                //"contactPerson": formdata.ContactPerson,
                //"email": formdata.Email,
                //"phone": formdata.Phone,
                //"address": formdata.Address,
                //"telNo": formdata.Telno,
                //"deliveryAddress": formdata.DeliveryAddress,
                //"vat": formdata.Vat,
                //"status": "For Approval",
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": formdata.Prefix,
                "code": formdata.Code,
                "transactionTime": formdata.TransactionTime,
                "type": formdata.Type,
                "leadId": formdata.Type.toUpperCase() === "LEADS".toUpperCase() ? formdata.LeadId : 0,
                "lead": formdata.Type.toUpperCase() === "LEADS".toUpperCase() ? formdata.LeadCode : '',
                "clientId": formdata.ClientId,
                "client": formdata.Client,
                "projectName": formdata.ProjectName,
                "contactPersonId": formdata.ContactPersonId,
                "contactPerson": formdata.ContactPerson,
                "telNo": formdata.Telno,
                "phone": formdata.Phone,
                "email": formdata.Email,
                "address": formdata.Address,
                "deliveryAddress": formdata.DeliveryAddress,
                "discount": formdata.Discount,
                "vat": formdata.Vat,
                "statusId": formdata.StatusId,
            },
            rfqdetails: []
        };
        disabled.attr('disabled', 'disabled');

        //Details
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;

        for (var i = 0; f.length > i; i++) {

            item = {};
            item["Id"] = f[i][8];
            item["RFQId"] = formdata.Id;
            item["ProductId"] = f[i][4];
            item["Description"] = f[i][5];
            item["Qty"] = f[i][6];
            item["UnitId"] = f[i][7];
            item["UnitPrice"] = "0";
            item["Disc1"] = "0";
            item["DiscType1"] = "0";
            item["Disc2"] = "0";
            item["DiscType2"] = "0";
            item["Disc3"] = "0";
            item["DiscType3"] = "0";
            item["DiscTotal"] = "0";;
            item["Total"] = "0";
            viewData.rfqdetails.push(item);
        }
        var tabledeleted = _$itemsTableDeleted.DataTable();
        var form_deleteddata = tabledeleted.rows().data();
        var g = form_deleteddata;

        for (var j = 0; g.length > j; j++) {

            item = {};
            item["Id"] = g[j][8];
            item["RFQId"] = formdata.Id;
            item["ProductId"] = g[j][4];
            item["Description"] = g[j][5];
            item["OrderQty"] = g[j][6];
            item["UnitId"] = g[j][7];
            item["UnitPrice"] = "0";
            item["Disc1"] = "0";
            item["DiscType1"] = "0";
            item["Disc2"] = "0";
            item["DiscType2"] = "0";
            item["Disc3"] = "0";
            item["DiscType3"] = "0";
            item["DiscTotal"] = "0";;
            item["Total"] = "0";
            item["IsDeleted"] = 1;
            viewData.rfqdetails.push(item);
        }
        abp.message.confirm(
            'RFQ will be updated.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_rfqService.updateRfq(viewData).done(function () {
                    //    abp.message.success('RFQ updated', 'Success');

                    //    var url = 'Index';
                    //    setTimeout(function () {
                    //        window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                    //    }, 2000);
                    //}).always(function () {
                    //    abp.ui.clearBusy(_$form);
                    //});
                    var returnid = _rfqService.updateRfq(viewData).done(function (result) {
                        abp.message.success('RFQ updated', 'Success');
                        window.location.href = abp.appPath + 'RFQ/Edit?id=' + result;
                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });

                }
            }
        );
    }

    $('#UpdateRfqButton').click(function (e) {
        e.preventDefault();
        updateRfq();
    });

    $('#SubmitButton').click(function (e) {
        e.preventDefault();
        var $statusid = $('#StatusId').val();
        if ($statusid === '3') {
            $('#StatusId').val(5);
        }
        else {
            $('#StatusId').val(2);
        }
        updateRfq();
    });

    $('#ReviseButton').click(function (e) {
        e.preventDefault();
        $('#StatusId').val(3);
        updateRfq();

        //var url = 'Index';
        //setTimeout(function () {
        //    window.location.href = url; //will redirect to your blog page (an ex: blog.html)
        //}, 2000);

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

    var OdataTable = _$OItemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            targets: [ 6,7, 8]
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

})(jQuery);




