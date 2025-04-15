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
    format: 'MM/YYYY'
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
        var _salesOrderService = abp.services.app.salesOrderService;
        var _quotationService = abp.services.app.quotationService;
        var _employeeService = abp.services.app.employeeService;
        var _warehouseService = abp.services.app.warehouseService;
        var _stockEntryService = abp.services.app.stockEntryService;
        var _rfqService = abp.services.app.rFQService;
        var _tasksService = abp.services.app.tasksService;

        var _$form = $('form[name=SalesOrderForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');
        var _$chargesTable = $('#ChargesTable');
        var _$chargesTableDeleted = $('#ChargesTableDeleted');
        var _$itemsTablePrintActual = $('#ItemsTablePrintActual');

        $("#ProductImage").hide();
        $('#divTable').hide();
        abp.ui.block();
        function getsalesorder() {
            var $id = $('#Id').val();
            _salesOrderService.getSalesOrder({ id: $id }).done(function (result) {

                //$('#Id').val(result.id);
                $('#Prefix').val(result.prefix);
                $('#SalesOrderCode').val(result.code);
                $('#Series').val(result.seriesTypeId);
                $('#Companies').val(result.companyId);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                var sotransactiontime = new Date(result.transactionTime);
                var sodeliverytime = new Date(result.deliveryTime);
                var sobatchdate = new Date(result.batchDate);
                $('#TransactionTime').val(getFormattedDate(sotransactiontime));
                $('#BatchDate').val(getFormattedDateMY(sobatchdate));
                $('#DeliveryTime').val(getFormattedDate(sodeliverytime));
                $('#OrderTypes').val(result.orderTypeId);
                $('#PricingTypes').val(result.pricingTypeId);
                $('#PaymentTerms').val(result.termId);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#QuotationId').val(result.quotationId);
                $('#QuotationCode').val('000000');
                $('#ClientOrderNo').val(result.clientOrderNo);
                $('#DefaultDestinationId').val(result.defaultDestinationId);
                $('#TaxTypes').val(result.taxTypeId);
                $('#ContactPerson').val(result.contactPerson);
                $('#ContactNo').val(result.contactNo);
                $('#DeliveryAddress').val(result.deliveryAddress);
                $('#ClientAddress').val(result.billingAddress);
                $('#Notes').val(result.notes);
                var rdeadlines = new Date(result.deadlines);
                var dline = getFormattedDate(rdeadlines);
                $('#Deadlines').val(dline);

                $('#SalesAgent').val(result.salesAgent);
                $('#AccountExecutive').val(result.salesAgent);
                getaemanager(result.salesAgentId);
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
                $('#StatusId').val(result.statusId);
                $('#StatusPreRevision').val(result.statusPreRevision);
                $('#RevisionNo').val(result.revisionNo);
                $('#RevisionReason').val(result.revisionReason);
                $('#TPC').val(result.tpc);

                $('#OtherTerms').val(result.otherTerms);

                var hideterms = $("#OtherTerms").val();
                if (hideterms != "") {
                    $("#OtherTerms").show();
                }
                else {
                    $("#OtherTerms").hide();
                }

                $("#OtherTerms").prop("disabled", true);

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
                        $("#PricingTypes").attr("disabled", false);
                        $("#DeliveryTime").attr("disabled", false);
                        $("#TransactionTime").attr("disabled", false);
                        $("#AddItemButton").attr("disabled", false);

                        document.getElementById("DeliveryStatusDate").disabled = false;
                        break;
                    case 2:
                        $('#StatusBadge').addClass('badge badge-success');
                        if ($('#ForDeliveryButton').length) {
                            $('#ForDeliveryButton').removeAttr('hidden');
                        }
                        $("#PreRevisionButton").removeAttr('hidden');
                        break;
                    case 3:
                        $('#StatusBadge').addClass('badge badge-danger');
                        $("#PreRevisionButton").removeAttr('hidden');
                        //if ($('#SubmitButton').length) {
                        //    $('#SubmitButton').removeAttr('hidden');
                        //}
                        break;
                    case 4:
                        $('#StatusBadge').addClass('badge badge-primary');
                        $("#PreRevisionButton").removeAttr('hidden');
                        break;
                    case 5:
                        $('#StatusBadge').addClass('badge badge-info');
                        $("#PreRevisionButton").removeAttr('hidden');
                        break;
                    case 6:
                        $('#StatusBadge').addClass('badge badge-warning');
                        $('#ReviseButton').removeAttr('hidden');
                        $("#TransactionTime").attr("disabled", false);
                        $("#ClientName").attr("disabled", false);
                        $("#SalesAgent").attr("disabled", false);
                        $("#OrderTypes").attr("disabled", false);
                        $("#ClientOrderNo").attr("disabled", false);
                        $("#PricingTypes").attr("disabled", false);
                        $("#DeliveryTime").attr("disabled", false);
                        $("#TransactionTime").attr("disabled", false);
                        $("#AddItemButton").attr("disabled", false);

                        document.getElementById("DeliveryStatusDate").disabled = false;
                        break;
                    case 7:
                        $('#StatusBadge').addClass('badge badge-danger');
                        break;
                    default:
                        $('#StatusBadge').addClass('badge badge-secondary');
                }
                getwarehouses(result.defaultSourceId);
                getcompanies(result.companyId);
                getordertype(result.orderTypeId);
                gettaxtype(result.taxTypeId);
                getpricingtype(result.pricingTypeId);
                getpaymentterm(result.paymentTermId);
                getdeliverytype(result.deliveryTypeId);
                getwarrantytype(result.warrantyTypeId);
                getclient();
                if (result.quotationId > 0) {
                    getquotation(result.quotationId);
                }
                if (result.deliveryStatusTime > 0) {

                    $('#DeliveryStatusDateIcon').removeClass();
                    $('#DeliveryStatusDateIcon').addClass('fa fa-minus-square fa-lg');
                    $("#DeliveryTime").hide();
                    $("#DeliveryStatusTime").show();
                    $("#DeliveryStatusTime").val(result.deliveryStatusTime);
                    $('#DeliveryTimeStatusSwitch').val("1");
                }
                else {
                    $('#DeliveryStatusDateIcon').removeClass();
                    $('#DeliveryStatusDateIcon').addClass('fa fa-check-square fa-lg');
                    $("#DeliveryTime").show();
                    $("#DeliveryStatusTime").hide();

                    $("#DeliveryStatusTime").val("0");
                    $('#DeliveryTimeStatusSwitch').val("2");
                    $("#DeliveryStatusTime").val("0");

                }

                //if (result.statusId != 6) {
                    GetAgentDivision(result.salesAgentId);
                    dataTable.clear().draw();
                    getsalesorderitems($id);
                    getsalesordercharges($id);
                //}
                //else if (result.statusId == 6) {
                //    getrevisedquotation();
                //}
            });
        };
        function getquotation(id) {
            _quotationService.getQuotation({ id: id }).done(function (result) {
                $('#QuotationCode').val(result.code);
                if (result.requestId > 0) {
                    getrfq(result.requestId);
                }
            });
        }

        function getrfq(id) {
            _rfqService.getRFQ({ id: id }).done(function (result) {
                $("#RFQId").val(result.code); //+ ' - ' + result.client + ' - ' + result.projectName);
                $("#RFQCode").val(result.code);
                $('#Discount').val(result.discount);
                //$("#Discount").prop('disabled', true

                //Wilson
                //getrfqtask(result.id, 106);
                getrfqtask(result.code, 106);
            });
        }

        function getrfqtask(id, transactioncode) {
            console.log(id);
            //Wilson
            //_tasksService.getTasksall({ id: id }).done(function (result) {
            _tasksService.getTasksall({ filter: id + '|' + transactioncode}).done(function (result) {
                $("#SalesCoordinatorId").val(result.items[0].employeeId); //+ ' - ' + result.client + ' - ' + result.projectName);
                $("#SalesCoordinator").val(result.items[0].name);
                getscmanager(result.items[0].employeeId);
            });
        }

        function getscmanager(id) {
            console.log(id + " sc id");
            if (id > 0) {
                _employeeService.getEmployee({ id: id }).done(function (result) {
                    $('#SCManagerId').val(result.managerId);
                    $("#SalesCoordinatorEmail").val(result.email);
                    $("#SalesCoordinatorContactNum").val(result.cellNo);
                    console.log(result.managerId + " sc manager id");
                    if (result.managerId != null) {
                        if (result.managerId > 0) {
                            _employeeService.getEmployee({ id: result.managerId }).done(function (result) {
                                $('#SCManager').val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
                            });
                        }
                    }

                });
            }
        }

        function getaemanager(id) {
            console.log(id + " ae id");
            if (id > 0) {
                _employeeService.getEmployee({ id: id }).done(function (result) {
                    $('#AEManagerId').val(result.managerId);
                    $("#AccountExecutiveEmail").val(result.email);
                    $("#AccountExecutiveContactNum").val(result.cellNo);
                    console.log(result.managerId + " ae managerid");
                    if (result.managerId != null) {
                        if (result.managerId > 0) {
                            _employeeService.getEmployee({ id: result.managerId }).done(function (result) {
                                $('#AEManager').val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
                                $("#AEManagerEmail").val(result.email);
                                $("#AEManagerContactNum").val(result.cellNo);
                            });
                        }
                    }
                });
            }
        }

        function getsalesorderitems(id) {
            _salesOrderService.getSalesOrderItemsByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $statusid = $('#StatusId').val();
                    var $soiid = result.items[i].id;
                    var $soiproductid = result.items[i].productId;
                    var $soiproductcode = result.items[i].productCode;

                    var $soiproductname = result.items[i].productName;
                    var $soiunitid = result.items[i].unitId;
                    var $soiunit = result.items[i].unit;
                  
                    var $sqiproductdescription = result.items[i].description;
                    var $sqiimagename = result.items[i].imageName;
                    var $sqiproductid = result.items[i].productId;
                   
                    var $soiquantity = result.items[i].orderQty;
                    var $soiprice = result.items[i].unitPrice;
                    var $soidisc1 = result.items[i].disc1;
                    var $soidisc2 = result.items[i].disc2;
                    var $soidisc3 = result.items[i].disc3;
                    var $soidtype1 = result.items[i].discType1;
                    var $soidtype2 = result.items[i].discType2;
                    var $soidtype3 = result.items[i].discType3;
                    var $soiperdescription = result.items[i].description;
                    var $soireference = result.items[i].reference;
                    //alert($soireference);
                    var $soitotal = result.items[i].total;
                    var $soitotaldiscount = result.items[i].discTotal;

                    var soiprice = parseFloat($soiprice);
                    var soiquantity = parseFloat($soiquantity);


                    var $socolor = result.items[i].color;

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
                    var soitotaldiscount = parseFloat($soitotaldiscount);
                    var soitotal = parseFloat($soitotal);
                    var soidatacount = dataTable.rows().count();
                    var soiitemno = soidatacount + 1;

                    dataTable.row.add([soiitemno,
                        '<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + ' ' + $socolor + '</label></small>',
                        '<label class="text-muted">' + $soiquantity + '</label>&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                        soiprice,
                        soitotaldiscount,
                        soitotal,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-price="' + soiprice + '" data-disc1="' + soidisc1 + '" data-disc2="' + soidisc2 + '" data-disc3="' + soidisc3 + '" data-dtype1="' + parseInt($soidtype1) + '" data-dtype2="' + parseInt($soidtype2) + '" data-dtype3="' + parseInt($soidtype3) + '" data-groupname="" data-reference="' + $soiproductcode + '" data-disctotal="' + soitotaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $soiproductid, $soiperdescription, $soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soireference, $soiid, $socolor
                    ]).draw();
                    if ($sqiimagename !== '' && $sqiimagename !== null) {
                        dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $soiproductcode + '</span><br/><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                        '<span class="font-weight-bold">' + $soiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                        '<span class="text-muted">' + $soiquantity + '</span>',
                            soiprice,
                            soitotal]).draw();
                        //dataTablePrintActual.row.add([soiitemno,
                        //    '<a href="#" class="btn-link">' + $soireference + '</a><br/><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                        //    '<label class="text-muted">' + $soiproductname + '</label>',
                        //    '<label class="text-muted">' + $soiquantity + '</label>&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                        //    soiprice,
                        //    soitotaldiscount,
                        //    soitotal,
                        //    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-price="' + soiprice + '" data-disc1="' + soidisc1 + '" data-disc2="' + soidisc2 + '" data-disc3="' + soidisc3 + '" data-dtype1="' + parseInt($soidtype1) + '" data-dtype2="' + parseInt($soidtype2) + '" data-dtype3="' + parseInt($soidtype3) + '" data-groupname="" data-reference="' + $soiproductcode + '" data-disctotal="' + soitotaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        //    $soiproductid, $soiperdescription, $soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soireference, $soiid
                        //]).draw();

                    }
                }
            });
        }

        function GetAgentDivision(id) {
            _salesOrderService.agentDivision({ id: id }).done(function (result) {
                var $divisionname = result.status;
                $('#Divisionname').val($divisionname);
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

                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;

                    dataTableCharges.row.add([sqcitemno,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcid]).draw();
                }
                abp.ui.unblock();
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
        function getcompanies(id) {

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
                    $('#CompanyAddress').val(result.items[i].companyAddress);
                    //alert(result.items[i].companyAddress);
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
        function getpaymentterm(id) {

            var paymentterms = $('#PaymentTerms');
            paymentterms.empty();
            _commonService.getPaymentTerms().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        paymentterms.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        paymentterms.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                paymentterms.selectpicker('refresh');
            });
        }
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
        function getdeliverytype(id) {
            var deliverytypes = $('#DeliveryTypes');
            deliverytypes.empty();
            _commonService.getDeliveryTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' data-days=' + result.items[i].noOfDays + ' selected>' + result.items[i].name + '</option>');
                        $('#NoOfDays').val(result.items[i].noOfDays);
                    }
                    else {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code+ ' data-days=' + result.items[i].noOfDays + '>' + result.items[i].name + '</option>');
                    }

                }
                deliverytypes.selectpicker('refresh');
                computedeliverydate();
            });
        }


        function getrevisedquotation() {
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
                //$('#StatusBadge').text(result.status);
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
                getqclientDelAddress(reqId);
            });
        };
        function getqclientDelAddress($rfqid) {
            //var $rfqid = $('#rfqid').val();
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
                        $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $sqiproductcode, 0, $sqcolor
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

        $('#DeliveryTypes').on('change', function (e) {
            var ddays = $("#DeliveryTypes option:selected").data('days');
            $('#NoOfDays').val(ddays);
            computedeliverydate();
        });
        function getwarrantytype(id) {
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

        getchargetype();
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
                    return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
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
        //Datatable Add
        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
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
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4]
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: [3, 4]
                },
                {
                    className: 'text-center',
                    targets: [2]
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

        getsalesorder();

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
        //    _clientService.getClient({ id: $clientid }).done(function (result) {
        //        $('#ClientAddress').val(result.address);
        //        $('#DeliveryAddress').val(result.address);
        //        $('#ClientEmail').val(result.email);
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
        //Client Autocomplete
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
                //$('#ClientAddress').val(result.address);
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
                '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',
                '<span class="text-muted">' + $quantity + '</span>&nbsp;<span class="text-muted">' + $unit + '</span>',
                lessprice,
                totaldiscount,
                total,
                '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $productcode, 0, $Color
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
            $('#Color').val("");
            $("#ProductImage").hide();
            abp.notify.success('Item #' + itemno + ' added!', 'Success');
        }

        //function computeTotal() {
        //    var grandtotal = 0;
        //    var taxrate = 0;
        //    var tax = 0;
        //    var taxcode = 101;
        //    var nettotal = 0;
        //    dataTable.column(5).data()
        //        .each(function (value, index) {
        //            var $grandtotal = parseFloat(value);
        //            grandtotal = grandtotal + $grandtotal;
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

        //    $('#SubTotal').val(currencyFormat(nettotal));
        //    $('#Tax').val(currencyFormat(tax));
        //    $('#Total').val(currencyFormat(grandtotal));
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
        function updateSalesOrder() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var statId = $("#StatusId").val();
            if (statId === '6') {
                var revReason = $('#RevisionReason').val();
                if (revReason.length <= 0) {
                    abp.message.warn('Revision reason is required!', 'Ooops! Record not saved.');
                    return;
                }
            }
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();
            var $updatedsoid = $('#Id').val();
            var viewData = {
                salesorder: {

                    "id": formdata.Id,
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": formdata.Prefix,
                    "code": formdata.Code,
                    "transactionTime": formdata.TransactionTime,
                    //MARC Batch Date 08/10/2022
                    "batchDate": getMonthYearFull(formdata.BatchDate),
                    //END Batch Date 08/10/2022
                    "deliveryTime": formdata.DeliveryTime,
                    "clientId": formdata.ClientId,
                    "clientOrderNo": formdata.ClientOrderNo,
                    "defaultSourceId": formdata.DefaultSourceId,
                    "defaultDestinationId": formdata.DefaultDestinationId,
                    "quotationId": formdata.QuotationId,
                    "orderTypeId": formdata.OrderTypeId,
                    "pricingTypeId": formdata.PricingTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "contactPerson": formdata.ContactPerson,
                    "contactNo": formdata.ContactNo,
                    "deliveryAddress": formdata.DeliveryAddress,
                    "billingAddress": formdata.ClientAddress,
                    "notes": formdata.Notes,
                    "statusId": formdata.StatusId,
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
                    //MARC REVISION 03282024
                    , "revisionNo": $("#RevisionNo").val(), //formdata.RevisionNo,
                    "statusPreRevision": $("#StatusPreRevision").val(), //formdata.StatusPreRevision,
                    "revisionReason": $("#RevisionReason").val() //formdata.RevisionReason
                    //MARC REVISION 03282024
                },
                salesorderitems: [],
                salesordercharges: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {

                item = {};
                item["Id"] = f[i][18];
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
                item["Color"] = f[i][19];
                viewData.salesorderitems.push(item);
            }

            var tabledeleted = _$itemsTableDeleted.DataTable();
            var form_deleteddata = tabledeleted.rows().data();
            var g = form_deleteddata;
            for (var j = 0; g.length > j; j++) {
                item = {};
                item["Id"] = g[j][18];
                item["SalesOrderId"] = "0";
                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = g[j][0];
                //MARC IndexNo for arrangement fix 09132022
                item["ProductId"] = g[j][7];
                item["Description"] = g[j][8];
                item["OrderQty"] = g[j][9];
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
                item["IsDeleted"] = 1;
                viewData.salesorderitems.push(item);
            }

            //charges
            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {

                charge = {};
                charge["Id"] = h[k][7];
                charge["QuotationId"] = "0";
                charge["ChargeTypeId"] = h[k][6];
                charge["Rate"] = h[k][2];
                charge["Amount"] = h[k][3];
                charge["Total"] = h[k][4];
                viewData.salesordercharges.push(charge);
            }

            var tablechargesdeleted = _$chargesTableDeleted.DataTable();
            var form_datachargesdeleted = tablechargesdeleted.rows().data();
            var l = form_datachargesdeleted;

            for (var m = 0; l.length > m; m++) {

                charge = {};
                charge["Id"] = l[m][7];
                charge["QuotationId"] = "0";
                charge["ChargeTypeId"] = l[m][6];
                charge["Rate"] = l[m][2];
                charge["Amount"] = l[m][3];
                charge["Total"] = l[m][4];
                charge["IsDeleted"] = 1;
                viewData.salesordercharges.push(charge);
            }
            console.log(viewData);
            abp.message.confirm(
                'Sales order will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _salesOrderService.updateSalesOrder(viewData).done(function (res) {
                            abp.message.success('Sales order updated', 'Success');
                            if (res.salesOrder.statusId > 1) {
                                if (res.notif.id > 0) {
                                    srConnection.invoke('sendNotification', res.salesOrder.code, res.salesOrder.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                                }
                            }
                            if (res.salesOrder.id == viewData.salesorder.id) {
                                location.reload(true);
                            }
                            else {
                                window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + res.salesOrder.id;
                            }
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        $('#SaveButton').click(function (e) {
            e.preventDefault();
            updateSalesOrder();
        });
        $('#SubmitButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(2);
            updateSalesOrder();
        });
        $('#ForDeliveryButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(3);
            updateSalesOrder();
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
            discount = discount.toFixed(2);
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;

            var table = _$itemsTable.DataTable();
            var temp = table.row($indexno).data();
            temp[1] = '<a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $EColor + ' </span></small>';
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
            temp[19] = $EColor;
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
                        f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], parseInt(f[i][12]), f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17], f[i][18], f[i][19]]).draw();
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
            var salesOrdercode = $('#SalesOrderCode').val();
            //var quotationcode = $('#SalesOrderCode').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            var clientcontactno = $('#ContactNo').val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var requestcode = $('#QuotationCode').val();
            var pono = $('#ClientOrderNo').val();
            var notes = $('#Notes').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentemail = $('#ClientEmailId').val();

            var companyaddress = $('#CompanyAddress').val();
            var clientaddress = $('#ClientAddress').val();
            var transdate = $('#TransactionTime').val();
            var subtotal = $('#Total').val();
            var nettotal = $('#NetTotal').val();
            var discounttotal = $('#DiscountTotal').val();
            var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrintActual");
            var termname = $("#ContactPersons option:selected").html();
            var termsandconditions = $('#TermsAndConditions').val();
            var $deliverytypes = $("#DeliveryTypes option:selected").text();
            var deliveryaddr = $('#DeliveryAddress').val();
            var $paymentterms = $("#PaymentTerms option:selected").text();
            var $deliverytypesVal = $("#DeliveryTypes").val();
            var division = $("#Divisionname").val();
            var $deliverytypesSelect = $("#DeliveryTypes option:selected").text();

            var $DeliveryStatusTime = $("#DeliveryStatusTime").val();
            var $DeliveryStatusTimeSelected = $("#DeliveryStatusTime option:selected").text();

            if ($DeliveryStatusTime > 0) {

                var $DeliveryTime = $DeliveryStatusTimeSelected;
            }
            else {

                var $DeliveryTime = $('#DeliveryTime').val();
            }

            var $tpc = $('#TPC').val() + '%';
            var $disc = $('#Discount').val() + '%';

            var $sc = $("#SalesCoordinator").val();
            $sc = $sc.trim().length <= 0 ? '-' : $sc;
            var $scmanager = $("#SCManager").val();
            $scmanager = $scmanager.trim().length <= 0 ? '-' : $scmanager;
            var $idg = $("#IDG").val();
            $idg = $idg.trim().length <= 0 ? '-' : $idg;
            var $ae = $("#AccountExecutive").val();
            $ae = $ae.trim().length <= 0 ? '-' : $ae;
            var $aemanager = $("#AEManager").val();
            $aemanager = $aemanager.trim().length <= 0 ? '-' : $aemanager;
            var $acctmanager = $("#AccountingManager").val();
            $acctmanager = $acctmanager.trim().length <= 0 ? '-' : $acctmanager;
            var $ommanager = $("#OperationsManager").val();
            $ommanager = $ommanager.trim().length <= 0 ? '-' : $ommanager;

            var cbLO = $('#cbLayout').prop('checked');
            var cbSW = $('#cbSwatch').prop('checked');
            var cbPO = $('#cbPO').prop('checked');

            var batchDate = getMonthYearFull($('#BatchDate').val());

            var bdText = new Date(batchDate).toLocaleString('en-us', { month: 'long', year: 'numeric' });

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //win.document.write('<html><head><title>' + salesOrdercode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<html><head><title>' + salesOrdercode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row">');
            win.document.write('<div  class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 400px; vertical-align: top;" alt="" /></div>'); //<label class="text-muted float-right" style="white-space: pre-wrap; font-size:11px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="10%"></th>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="35%"></th>');
            win.document.write('<th width="20%"></th>');
            win.document.write('<th width="20%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td colspan="5" scope="row" class="text-center font-weight-bold" style="font-size:32px;font-style:italic">' + bdText + '</td>');
            win.document.write('</tr>');
            win.document.write('<tr>');
            win.document.write('<td colspan="5" scope="row" class="text-center font-weight-bold" style="font-size:36px">SO OFFICIAL FORM</td>');
            win.document.write('</tr>');
            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="font-weight-bold text-right">SO#</td>');
            win.document.write('<td class="font-weight-bold">' + salesOrdercode + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + requestcode + '</td>');
            win.document.write('<td class="font-weight-bold">' + division + '</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');
            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="font-weight-bold text-right"></td>');
            win.document.write('<td class="font-weight-bold">' + transdate + '</td>');
            win.document.write('<td class="font-weight-bold">' + salesagent + '</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="font-weight-bold text-right"></td>');
            win.document.write('<td class="font-weight-bold">PO #: ' + pono + '</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style = "font-size:16px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="35%"></th>');
            win.document.write('<th width="15%"></th>');
            win.document.write('<th width="35%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');
            win.document.write('<tr>');
            win.document.write('<td>TO :</td>');
            win.document.write('<td class="font-weight-bold">' + clientname + '</td>');
            //win.document.write('<td class="text-right">Delivery Type :</td>');
            //win.document.write('<td class="text-right">' + $deliverytypes + '</td>');

            win.document.write('<td class="text-right">Delivery Date :</td>');
            win.document.write('<td class="text-right">' + $DeliveryTime + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td style="vertical-align:top;">ADDRESS :</td>');
            win.document.write('<td class="text-mute" style="font-size:15px;vertical-align:top;">' + clientaddress + '</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">Delivery Address :</td>');
            win.document.write('<td class="text-right" style="font-size:15px;vertical-align:top;">' + deliveryaddr + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td ">ATTN :</td>');
            win.document.write('<td class="font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('<td>Accting Num :</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>Contact # :</td>');
            win.document.write('<td class="font-weight-bold">' + clientcontactno + '</td>');
            win.document.write('<td>Acctng Contact :</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>TelNum :</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="text-center" style="border:solid">' + (cbLO ? 'OK' : 'N/A') + '</td>');
            win.document.write('<td class="text-left">Lay-Out</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td></td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="text-center" style="border:solid">' + (cbSW ? 'OK' : 'N/A') + '</td>');
            win.document.write('<td class="text-left">Swatches</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>FaxNum :</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="text-center" style="border:solid">' + (cbPO ? 'OK' : 'N/A') + '</td>');
            win.document.write('<td class="text-left">P.O</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>Email :</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td></td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td>PROJECT</td>');
            //win.document.write('<td>' + clientproject + '</td>');
            //win.document.write('<td class="text-right">TEL No</td>');
            //win.document.write('<td class="text-right">' + clienttelephone + '</td>');
            //win.document.write('</tr>');


            win.document.write('</tbody>');

            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            // Header

            // Body
            //win.document.write(divToPrint.outerHTML);


            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:20px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="25%"></th>');
            win.document.write('<th width="16.66%"></th>');
            win.document.write('<th width="16.66%"></th>');
            win.document.write('<th width="16.66%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="font-weight-bold text-center">TERMS</td>');
            win.document.write('<td class="font-weight-bold text-center">TPC</td>');
            win.document.write('<td class="font-weight-bold text-center">DISCOUNT</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');
            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('<td class="font-weight-bold text-center">' + $paymentterms + '</td>');
            win.document.write('<td class="font-weight-bold text-center">' + $tpc + '</td>');
            win.document.write('<td class="font-weight-bold text-center">' + $disc + '</td>');
            win.document.write('<td class="font-weight-bold"></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            // Body

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            // Footer

            //TOTAL
            //win.document.write('<div class="row">');
            //win.document.write('<div class="col-lg-12">');
            //win.document.write('<table class="" width="100%" style="font-size:12px">');

            //win.document.write('<thead>');
            //win.document.write('<tr>');
            //win.document.write('<th width="75%"></th>');
            //win.document.write('<th width="25%"></th>');
            //win.document.write('</tr>');
            //win.document.write('</thead>');

            //win.document.write('<tbody>');

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


            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">GRAND TOTAL</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + grandtotal + '</td>');
            //win.document.write('</tr>');

            //win.document.write('</tbody>');
            //win.document.write('</table >');

            //win.document.write('</div>');
            //win.document.write('</div>');


            ////TERM

            //win.document.write('<div class="row">');
            //win.document.write('<div class="col-lg-12">');

            //win.document.write('<table class="" width="100%" style="font-size:12px;">');

            //win.document.write('<thead>');
            //win.document.write('<tr>');
            //win.document.write('<th width="30%"></th>');
            //win.document.write('<th width="70%"></th>');
            //win.document.write('</tr>');
            //win.document.write('</thead>');

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
            win.document.write('<table class="" width="100%" style="font-size:13px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="60%"></th>');
            win.document.write('<th width="40%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            //win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity bt signing on the space provided below, after which the sames quotaion shall become an official contract.</td>');
            win.document.write('<td class="text-left font-weight-bold">NOTE</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            //win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity bt signing on the space provided below, after which the sames quotaion shall become an official contract.</td>');
            win.document.write('<td class="text-left font-weight-bold" style="text-decoration:underline;">- Attached necessary lay-out for installation distribution purposes</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            //win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity bt signing on the space provided below, after which the sames quotaion shall become an official contract.</td>');
            win.document.write('<td class="text-left font-weight-bold" style="text-decoration:underline;">- Any mistake on the matter/delivery/ordering shall be charged accordingly to concerned individual upon investigation</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            //Notes

            //Signatory

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:16px;margin:0 auto;border-collapse: separate;border-spacing:50px 0;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="33.33%"></th>');
            win.document.write('<th width="33.33%"></th>');
            win.document.write('<th width="33.33%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td class="text-center font-weight-bold">' + $sc + '</td>');
            win.document.write('<td class="text-center font-weight-bold">' + $idg + '</td>');
            win.document.write('<td class="text-center font-weight-bold">' + $scmanager + '</td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid;">Sales Coordinator</td>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid;">IDG</td>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid;">Sales Support Manager</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:16px;margin:0 auto;border-collapse: separate;border-spacing:15px 0;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="25%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td class="text-center font-weight-bold" style="vertical-align:bottom;">' + $ae + '</td>');
            win.document.write('<td class="text-center font-weight-bold" style="vertical-align:bottom;">' + $aemanager + '</td>');
            win.document.write('<td class="text-center font-weight-bold" style="vertical-align:bottom;">' + $acctmanager + '</td>');
            win.document.write('<td class="text-center font-weight-bold" style="vertical-align:bottom;">' + $ommanager + '</td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('<td class="text-center font-weight-bold">_________________________</td>');
            //win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid;">Account Executive</td>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid">BDM</td>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid">Accounting Manager</td>');
            win.document.write('<td class="text-center font-weight-bold" style="border-top:1px;border-top-style:solid">Operations Manager</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            // Note

            //
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="70%"></th>');
            win.document.write('<th width="30%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td class="text-left font-weight-bold"></td>');
            win.document.write('<td scope="row" style="font-size:13px;font-style:italic">Date Routed: _________________________________</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');

            //spacer
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="100%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');
            win.document.write('</div>');
            win.document.write('</div>');
            //spacer

            // Footer

            win.document.write('</div>');
            win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath + 'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
            //win.print();
            //window.print();
        }

        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual();
        });

        $('#btnPrint').click(function (e) {
            var bd =  $('#BatchDate').val();
            console.log(getMonthYearFull(bd));
            e.preventDefault();
            //MARC 09/08/2021
            //$('#StatusId').val(2);
            //save();
            //END

            //MARC 09/08/2021

            $('#PrintModal').modal('show');

            //END
        });

        //SC Autocomplete
        var getscs = function (request, response) {
            _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getsc() {
            $id = $("#SalesCoordinatorId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#SalesCoordinatorEmail').val(result.email);
                $('#SalesCoordinatorContactNum').val(result.cellNo);
                $("#SalesCoordinator").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            });
        };
        var selectsc = function (event, ui) {
            event.preventDefault();
            $("#SalesCoordinatorId").val(ui.item ? ui.item.value : "");
            $("#SalesCoordinator").val(ui.item ? ui.item.label : "");
            getsc();
            return false;
        };
        var focussc = function (event, ui) {
            event.preventDefault();
            $("#SalesCoordinatorId").val(ui.item.value);
            $("#SalesCoordinator").val(ui.item.label);
        };
        var changesc = function (event, ui) {
            event.preventDefault();
            $("#SalesCoordinatorId").val(ui.item ? ui.item.value : "");
            $("#SalesCoordinator").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#SalesCoordinatorEmail').val('');
                $('#SalesCoordinatorContactNum').val('');
            }
        };
        $("#SalesCoordinator").autocomplete({
            //source: getsc,
            source: getscs,
            select: selectsc,
            focus: focussc,
            minLength: 2,
            delay: 100,
            change: changesc
        });
        //SC Autocomplete

        //IDG Autocomplete
        var getidgs = function (request, response) {
            _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getidg() {
            $id = $("#IDGId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#IDGEmail').val(result.email);
                $('#IDGContactNum').val(result.cellNo);
                $("#IDG").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            });
        };
        var selectidg = function (event, ui) {
            event.preventDefault();
            $("#IDGId").val(ui.item ? ui.item.value : "");
            $("#IDG").val(ui.item ? ui.item.label : "");
            getidg();
            return false;
        };
        var focusidg = function (event, ui) {
            event.preventDefault();
            $("#IDGId").val(ui.item.value);
            $("#IDG").val(ui.item.label);
        };
        var changeidg = function (event, ui) {
            event.preventDefault();
            $("#IDGId").val(ui.item ? ui.item.value : "");
            $("#IDG").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#IDGEmail').val('');
                $('#IDGContactNum').val('');
            }
        };
        $("#IDG").autocomplete({
            source: getidgs,
            select: selectidg,
            focus: focusidg,
            minLength: 2,
            delay: 100,
            change: changeidg
        });
        //IDG Autocomplete

        //SSM Autocomplete
        var getssms = function (request, response) {
            _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getssm() {
            $id = $("#SCManagerId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#SCManagerEmail').val(result.email);
                $('#SCManagerContactNum').val(result.cellNo);
                $("#SCManager").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            });
        };
        var selectssm = function (event, ui) {
            event.preventDefault();
            $("#SCManagerId").val(ui.item ? ui.item.value : "");
            $("#SCManager").val(ui.item ? ui.item.label : "");
            getssm();
            return false;
        };
        var focusssm = function (event, ui) {
            event.preventDefault();
            $("#SCManagerId").val(ui.item.value);
            $("#SCManager").val(ui.item.label);
        };
        var changessm = function (event, ui) {
            event.preventDefault();
            $("#SCManagerId").val(ui.item ? ui.item.value : "");
            $("#SCManager").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#SCManagerEmail').val('');
                $('#SCManagerContactNum').val('');
            }
        };
        $("#SCManager").autocomplete({
            source: getssms,
            select: selectssm,
            focus: focusssm,
            minLength: 2,
            delay: 100,
            change: changessm
        });
    //SSM Autocomplete

        //AEM Autocomplete
        var getaems = function (request, response) {
            _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getaem() {
            $id = $("#AEManagerId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#AEManagerEmail').val(result.email);
                $('#AEManagerContactNum').val(result.cellNo);
                $("#AEManager").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            });
        };
        var selectaem = function (event, ui) {
            event.preventDefault();
            $("#AEManagerId").val(ui.item ? ui.item.value : "");
            $("#AEManager").val(ui.item ? ui.item.label : "");
            getaem();
            return false;
        };
        var focusaem = function (event, ui) {
            event.preventDefault();
            $("#AEManagerId").val(ui.item.value);
            $("#AEManager").val(ui.item.label);
        };
        var changeaem = function (event, ui) {
            event.preventDefault();
            $("#AEManagerId").val(ui.item ? ui.item.value : "");
            $("#AEManager").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#AEManagerEmail').val('');
                $('#AEManagerContactNum').val('');
            }
        };
        $("#AEManager").autocomplete({
            source: getaems,
            select: selectaem,
            focus: focusaem,
            minLength: 2,
            delay: 100,
            change: changeaem
        });
    //AEM Autocomplete

        //AcctM Autocomplete
        var getacctms = function (request, response) {
            _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getacctm() {
            $id = $("#AccountingManagerId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#AccountingManagerEmail').val(result.email);
                $('#AccountingManagerContactNum').val(result.cellNo);
                $("#AccountingManager").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            });
        };
        var selectacctm = function (event, ui) {
            event.preventDefault();
            $("#AccountingManagerId").val(ui.item ? ui.item.value : "");
            $("#AccountingManager").val(ui.item ? ui.item.label : "");
            getacctm();
            return false;
        };
        var focusacctm = function (event, ui) {
            event.preventDefault();
            $("#AccountingManagerId").val(ui.item.value);
            $("#AccountingManager").val(ui.item.label);
        };
        var changeacctm = function (event, ui) {
            event.preventDefault();
            $("#AccountingManagerId").val(ui.item ? ui.item.value : "");
            $("#AccountingManager").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#AccountingManagerEmail').val('');
                $('#AccountingManagerContactNum').val('');
            }
        };
        $("#AccountingManager").autocomplete({
            source: getacctms,
            select: selectacctm,
            focus: focusacctm,
            minLength: 2,
            delay: 100,
            change: changeacctm
        });
    //AcctM Autocomplete

        //OM Autocomplete
        var getoms = function (request, response) {
            _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getom() {
            $id = $("#OperationsManagerId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#OperationsManagerEmail').val(result.email);
                $('#OperationsManagerContactNum').val(result.cellNo);
                $("#OperationsManager").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            });
        };
        var selectom = function (event, ui) {
            event.preventDefault();
            $("#OperationsManagerId").val(ui.item ? ui.item.value : "");
            $("#OperationsManager").val(ui.item ? ui.item.label : "");
            getom();
            return false;
        };
        var focusom = function (event, ui) {
            event.preventDefault();
            $("#OperationsManagerId").val(ui.item.value);
            $("#OperationsManager").val(ui.item.label);
        };
        var changeom = function (event, ui) {
            event.preventDefault();
            $("#OperationsManagerId").val(ui.item ? ui.item.value : "");
            $("#OperationsManager").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#OperationsManagerEmail').val('');
                $('#OperationsManagerContactNum').val('');
            }
        };
        $("#OperationsManager").autocomplete({
            source: getoms,
            select: selectom,
            focus: focusom,
            minLength: 2,
            delay: 100,
            change: changeom
        });
    //OM Autocomplete
        $('#TpcUpdate').click(function (e) {
            e.preventDefault();
            updateTpc();
        });

        function updateTpc() {
            if ($("#TPC").val() == "" || $("#TPC").val() == "0")
            {
                alert("Please Add TPC");
                return;
            }
            var $tpc = $("#TPC").val();
            var $code = $("#SalesOrderCode").val();

            abp.message.confirm(
                'TPC order will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _salesOrderService.updateTPC({ filter: $code + '|' + $tpc }).done(function () {
                            abp.message.success('TPC updated', 'Success');
                            $("#TPC").prop('disabled', true);
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            )
        }

        $('#DscUpdate').click(function (e) {
            e.preventDefault();
            updateDsc();
        });

        function updateDsc() {
            if ($("#Discount").val() == "" || $("#Discount").val() == "0") {
                alert("Please Add Discount");
                return;
            }
            var $Discount = $("#Discount").val();
            var $QuotationCode = $("#QuotationCode").val();

            abp.message.confirm(
                'Discount will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _salesOrderService.updateQDiscount({ filter: $QuotationCode + '|' + $Discount }).done(function () {
                            abp.message.success('Discount updated', 'Success');
                            $("#Discount").prop('disabled', true);
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            )
        }


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

        $('#PreRevisionButton').click(function (e) {
            e.preventDefault();
            $('#ReasonModal').modal('show');
        });

        $('#RevisionButton').click(function (e) {
            e.preventDefault();
            $('#StatusPreRevision').val($('#StatusId').val());
            $('#StatusId').val(6);
            updateSalesOrder();
        });

        $('#ReviseButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(7);
            updateSalesOrder();
        });

        $("#Color").keyup(function (event) {
            this.value = this.value.toUpperCase();
        });
        $("#EColor").keyup(function (event) {
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