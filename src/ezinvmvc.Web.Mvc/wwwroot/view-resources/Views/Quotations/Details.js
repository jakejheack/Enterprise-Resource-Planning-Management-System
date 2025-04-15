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

//$(".date-picker").datepicker("update", new Date());

//$('.date-picker').datepicker({
//    locale: abp.localization.currentLanguage.name,
//    format: 'L'
//});

//$('.datetime-picker').datepicker({
//    locale: abp.localization.currentLanguage.name,
//    format: 'L LT'
//});

$('#divTable').hide();

(function () {
    $(function () {
        var _pricingTypeService = abp.services.app.pricingTypeService;
        var _productPriceService = abp.services.app.productPriceService;
        var _productService = abp.services.app.productService;
        var _companyService = abp.services.app.companyService;
        var _commonService = abp.services.app.commonService;
        var _clientService = abp.services.app.clientService;
        var _employeeService = abp.services.app.employeeService;
        var _quotationService = abp.services.app.quotationService;
        var _contactPersonService = abp.services.app.contactPersonService;
        var _rfqService = abp.services.app.rFQService;
        var _$form = $('form[name=QuotationForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');
        var _$itemsTablePrint = $('#ItemsTablePrint');
        var _$itemsTablePrintActual = $('#ItemsTablePrintActual');
        var _$chargesTable = $('#ChargesTable');
        var _$OItemsTable = $('#OItemsTable');

        abp.ui.block();
        
        //function getquotation() {
        //    var $id = $('#Id').val();
        //    abp.ui.setBusy(_$form);
        //    _quotationService.getQuotation({ id: $id }).done(function (result) {
        //        $('#Prefix').val(result.prefix);
        //        $('#QuotationCode').val(result.code);
        //        $('#RevisionNo').val(result.revisionNo);
        //        $('#Code').val(result.code);
        //        $('#RefNo').val(result.code);
        //        $('#Series').val(result.seriesTypeId);
        //        $('#Companies').val(result.companyId);
        //        $('#ClientId').val(result.clientId);
        //        //$('#ClientName').val(result.client);
        //        var qtransactiontime = new Date(result.transactionTime);
        //        $('#TransactionTime').val(getFormattedDate(qtransactiontime));
        //        $('#OrderTypes').val(result.orderTypeId);
        //        $('#PricingTypes').val(result.pricingTypeId);
        //        $('#SalesAgent').val(result.agent);
        //        $('#SalesAgentId').val(result.salesAgentId);
        //        $('#StatusId').val(result.statusId);
        //        $('#RequestId').val(result.requestId);
        //        $('#PrevRequestId').val(result.requestId);
        //        $('#RequestCode').val(result.requestCode);
        //        $('#TaxTypes').val(result.taxTypeId);
        //        $('#Notes').val(result.notes);
        //        var sonettotal = currencyFormat(result.netTotal);
        //        var sotax = currencyFormat(result.tax);
        //        var sototal = currencyFormat(result.grandTotal);
        //        $('#SubTotal').val(sonettotal);
        //        $('#Tax').val(sotax);
        //        $('#Total').val(sototal);
        //        $('#StatusBadge').text(result.status);

        //        switch (result.statusId) {
        //            case 1:
        //                $('#StatusBadge').addClass('badge badge-secondary');


        //                //if ($('#SaveButton').length) {
        //                //    $('#SaveButton').removeAttr('hidden');
        //                //}
        //                //if ($('#SubmitButton').length) {
        //                //    $('#SubmitButton').removeAttr('hidden');
        //                //}
        //                break;
        //            case 2:
        //                $('#StatusBadge').addClass('badge badge-success');
        //                //if ($('#ReviseButton').length) {
        //                //    $('#ReviseButton').removeAttr('hidden');
        //                //}
        //                break;
        //            case 3:
        //                $('#StatusBadge').addClass('badge badge-danger');
        //                //if ($('#SubmitButton').length) {
        //                //    $('#SubmitButton').removeAttr('hidden');
        //                //}
        //                break;
        //            case 4:
        //                $('#StatusBadge').addClass('badge badge-primary');
        //                break;
        //            case 5:
        //                $('#StatusBadge').addClass('badge badge-info');
        //                break;
        //            default:
        //                $('#StatusBadge').addClass('badge badge-secondary');
        //        }

        //        getcompanies(result.companyId);
        //        getordertype(result.orderTypeId);
        //        gettaxtype(result.taxTypeId);
        //        getpricingtype(result.pricingTypeId);
        //        getrfq();
        //        getagent();
        //        getclient();
        //        getquotationitems($id);
        //        getRevisionNos();
        //        //getcontactpersons(result.contactPersonId);
        //        getcontactperson(result.contactPersonId);
        //        abp.ui.clearBusy(_$form);
        //    });
        //};


        function getquotation() {
            var $id = $('#Id').val();
            _quotationService.getQuotation({ id: $id }).done(function (result) {
                if (result === null) {
                    window.location.href = abp.appPath + 'Quotations/Index';
                }

                $('#Prefix').val(result.prefix);
                $('#QuotationCode').val(result.code);
                $('#RevisionNo').val(result.revisionNo);
                $('#Code').val(result.code);
                $('#RefNo').val(result.code + '-' + result.revisionNo);
                $('#Series').val(result.seriesTypeId);
                $('#Companies').val(result.companyId);
                $('#ClientId').val(result.clientId);
                //$('#ClientName').val(result.client);
                var qtransactiontime = new Date(result.transactionTime);
                $('#TransactionTime').val(getFormattedDate(qtransactiontime));
                $('#OrderTypes').val(result.orderTypeId);
                $('#PricingTypes').val(result.pricingTypeId);
                $('#SalesAgent').val(result.agent);
                $('#SalesAgentId').val(result.salesAgentId);
                $('#SalesAgentPosition').val(result.agentPosition);
                $('#Manager').val(result.manager);
                $('#ManagerPosition').val(result.managerPosition);
                $('#StatusId').val(result.statusId);
                $('#RequestId').val(result.requestId);
                $('#PrevRequestId').val(result.requestId);
                $('#RequestCode').val(result.requestCode);
                $('#TaxTypes').val(result.taxTypeId);
                $('#Notes').val(result.notes);
                $('#TermsAndConditions').val(result.termsAndConditions);
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

                switch (result.statusId) {
                    case 1:
                        $('#StatusBadge').addClass('badge badge-secondary');
                        if ($('#SaveButton').length) {
                            $('#SaveButton').removeAttr('hidden');
                        }
                        if ($('#SubmitButton').length) {
                            $('#SubmitButton').removeAttr('hidden');
                        }
                        break;
                    case 2:
                        $('#StatusBadge').addClass('badge badge-success');
                        if ($('#ActionButton').length) {
                            $('#ActionButton').removeAttr('hidden');
                        }
                        break;
                    case 3:
                        $('#StatusBadge').addClass('badge badge-danger');
                        if ($('#SubmitButton').length) {
                            $('#SubmitButton').removeAttr('hidden');
                        }
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
                    case 7:
                        $('#StatusBadge').addClass('badge text-white bg-flat-color-6');
                        break;
                    case 8:
                        $('#StatusBadge').addClass('badge text-white bg-flat-color-4');
                        break;
                    case 9:
                        $('#StatusBadge').addClass('badge badge-warning');
                        break;
                    default:
                        $('#StatusBadge').addClass('badge badge-secondary');
                }

                getcompanies(result.companyId);
                getordertype(result.orderTypeId);
                gettaxtype(result.taxTypeId);
                getpricingtype(result.pricingTypeId);

                getdeliverytype(result.deliveryTypeId);
                getpaymentterm(result.paymentTermId);
                getwarrantytype(result.warrantyTypeId);

                getrfq();
                getagent();
                getclient();
                getRevisionNos();
                getquotationcharges($id);
                getchargetype();
                getcontactperson(result.contactPersonId);
                dataTable.clear().draw();

                getquotationitems($id);
                //getcontactpersons(result.contactPersonId);
            });
        };
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
                    var $sqidisctotal = result.items[i].discTotal;
                    var $sqitotal = result.items[i].total;
                    var $sqiimagename = result.items[i].imageName;
                    var $sqigroupname = result.items[i].groupName;
                    var $sqireference = result.items[i].reference;

                    var $sqidisc1 = result.items[i].disc1;
                    var $sqidisc2 = result.items[i].disc2;
                    var $sqidisc3 = result.items[i].disc3;
                    var $sqidtype1 = result.items[i].discType1;
                    var $sqidtype2 = result.items[i].discType2;
                    var $sqidtype3 = result.items[i].discType3;
                    var $sqiperdescription = result.items[i].description;

                    //MARC qi_option 07212022
                    var $itemtypev = result.items[i].itemType + '';
                    var $itemtypet = $itemtypev === '1' ? "Actual" : "Option";
                    //MARC qi_option 07212022

                    var sqiprice = parseFloat($sqiprice);
                    var sqiquantity = parseFloat($sqiquantity);
                    var sqitotaldiscount = parseFloat($sqidisctotal);
                    var sqitotal = parseFloat($sqitotal);
                    var sqiactualprice = sqiprice + (sqitotaldiscount / sqiquantity);
                    var sqiactualtotal = sqiactualprice * sqiquantity;


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
                        '<span class="text-danger font-weight-bold">' + $sqigroupname + '</span><br /><a href="#" class="btn-link">' + $sqireference + '</a><br /><small><span class="text-muted">' + $sqiproductname + '</span></small>',

                        //MARC qi_option 07212022
                        $itemtypet,
                        //MARC qi_option 07212022

                        '<span class="text-muted">' + $sqiquantity + '</span>|<span class="text-muted">' + $sqiunit + '</span>',
                        sqiprice,
                        sqitotaldiscount,
                        sqitotal,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + sqiitemno + '"  data-id="' + $sqiproductid + '" data-unitid="' + $sqiunitid + '" data-perdesc="' + $sqiperdescription + '" data-qty="' + $sqiquantity + '" data-price="' + sqiprice + '" data-disc1="' + sqidisc1 + '" data-disc2="' + sqidisc2 + '" data-disc3="' + sqidisc3 + '" data-dtype1="' + parseInt($sqidtype1) + '" data-dtype2="' + parseInt($sqidtype2) + '" data-dtype3="' + parseInt($sqidtype3) + '" data-groupname="' + $sqigroupname + '" data-reference="' + $sqireference + '" data-disctotal="' + sqitotaldiscount +

                        //MARC qi_option 07212022
                        '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet +
                        //MARC qi_option 07212022

                        '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $sqiid, $sqigroupname, $sqireference

                        //MARC qi_option 07212022
                        , $itemtypev
                        //MARC qi_option 07212022
                    ]).draw();

                    var firstcol = '';

                    //if ($sqigroupname !== '' && $sqigroupname !== null) {
                    //    dataTablePrint.row.add(['<span class="font-weight-bold text-danger">' + $sqigroupname + '</span>', '', '', '', '']).draw();

                    //    dataTablePrintActual.row.add(['<span class="font-weight-bold text-danger">' + $sqigroupname + '</span>', '', '', '', '']).draw();
                    //}
                    //if ($sqiimagename !== '' && $sqiimagename !== null) {
                    //    dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                    //        '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                    //        '<span class="text-muted">' + $sqiquantity + '</span>',
                    //        sqiprice,
                    //        sqitotal]).draw();
                    //    dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                    //    dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
                    //    '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                    //    '<span class="text-muted">' + $sqiquantity + '</span>',
                    //        sqiactualprice,
                    //        sqiactualtotal]).draw();
                    //    dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
                    //}
                    //else {
                    //    dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                    //        '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                    //        '<span class="text-muted">' + $sqiquantity + '</span>',
                    //        sqiprice,
                    //        sqitotal]).draw();
                    //    dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                    //    dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                    //    '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                    //    '<span class="text-muted">' + $sqiquantity + '</span>',
                    //        sqiactualprice,
                    //        sqiactualtotal]).draw();
                    //    dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
                    //}
                    if ($itemtypev === '1') {
                        if ($sqigroupname !== '' && $sqigroupname !== null) {
                            dataTablePrint.row.add(['<span class="font-weight-bold text-danger">' + $sqigroupname + '</span>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold text-danger">' + $sqigroupname + '</span>', '', '', '', '']).draw();
                        }
                        if ($sqiimagename !== '' && $sqiimagename !== null) {
                            dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><div style="width:150px;height:150px"><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="object-fit:contain;width:100%;height:100%"/></div>',
                            '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                            '<span class="text-muted">' + $sqiquantity + '</span>',
                            sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                            sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><div style="width:150px;height:150px"><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="object-fit:contain;width:100%;height:100%"/></div>',
                            '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                            '<span class="text-muted">' + $sqiquantity + '</span>',
                            sqiactualprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                            sqiactualtotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]).draw();
                            dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
                        }
                        else {
                            //dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                            //'<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                            //'<span class="text-muted">' + $sqiquantity + '</span>',
                            //    sqiprice,
                            //    sqitotal]).draw();
                            //dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            //dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                            //'<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                            //'<span class="text-muted">' + $sqiquantity + '</span>',
                            //    sqiactualprice,
                            //    sqiactualtotal]).draw();

                            dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                            '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                            '<span class="text-muted">' + $sqiquantity + '</span>',
                            sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                            sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                            '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
                            '<span class="text-muted">' + $sqiquantity + '</span>',
                            sqiactualprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                            sqiactualtotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]).draw();
                            dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
                        }
                    }
                    else if ($itemtypev === '0') {
                        if ($sqigroupname !== '' && $sqigroupname !== null) {
                            dataTablePrint.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqigroupname + '</span>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqigroupname + '</span>', '', '', '', '']).draw();
                        }
                        dataTablePrint.row.add(['<span class="font-weight-bold" style="color:blue;">OPTION : </span>', '', '', '', '']).draw();

                        dataTablePrintActual.row.add(['<span class="font-weight-bold" style="color:blue;">OPTION : </span>', '', '', '', '']).draw();
                        if ($sqiimagename !== '' && $sqiimagename !== null) {
                            dataTablePrint.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqireference + '</span><br/><div style="width:150px;height:150px;"><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="object-fit:contain;height: 100%; width: 100%;"/></div>',
                            '<span class="font-weight-bold" style="color:blue;">' + $sqiproductname + '</span><br/><span style="white-space: pre-wrap; color:blue;">' + $sqiproductdescription + '</span>',
                            '<span style="color:blue;">' + $sqiquantity + '</span>',
                            '<span style="color:blue;">' + sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span><hr style="height:2px;border-width:0;color:blue;background-color:blue"><span style="color:blue;">' + sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>',
                                '']).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqireference + '</span><br/><div style="width:150px;height:150px;"><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="object-fit:contain;height: 100%; width: 100%;"/></div>',
                            '<span class="font-weight-bold" style="color:blue;">' + $sqiproductname + '</span><br/><span style="white-space: pre-wrap; color:blue;">' + $sqiproductdescription + '</span>',
                            '<span style="color:blue;">' + $sqiquantity + '</span>',
                            '<span style="color:blue;">' + sqiactualprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span><hr style="height:2px;border-width:0;color:blue;background-color:blue"><span style="color:blue;">' + sqiactualtotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>',
                                '']).draw();
                            dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
                        }
                        else {
                            dataTablePrint.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqireference + '</span>',
                            '<span class="font-weight-bold" style="color:blue;">' + $sqiproductname + '</span><br/><span style="white-space: pre-wrap; color:blue;">' + $sqiproductdescription + '</span>',
                            '<span style="color:blue;">' + $sqiquantity + '</span>',
                            '<span style="color:blue;">' + sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span><hr style="height:2px;border-width:0;color:blue;background-color:blue"><span style="color:blue;">' + sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>',
                                '']).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqireference + '</span>',
                            '<span class="font-weight-bold" style="color:blue;">' + $sqiproductname + '</span><br/><span style="white-space: pre-wrap; color:blue;">' + $sqiproductdescription + '</span>',
                            '<span style="color:blue;">' + $sqiquantity + '</span>',
                            '<span style="color:blue;">' + sqiactualprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span><hr style="height:2px;border-width:0;color:blue;background-color:blue"><span style="color:blue;">' + sqiactualtotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>',
                                '']).draw();
                            dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
                        }
                    }
                }
                abp.ui.unblock();
            });
            getquotationotherdetails(id)
        };
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

        function getRevisionNos() {
            var code = $('#QuotationCode').val();
            var $revnos = $('#sRevisionNo');
            var revno = $('#RevisionNo').val();
            var id = $('#Id').val();
            $revnos.empty();
            _quotationService.getQuotationRevisions({ filter: code, sorting: "revisionno asc" }).done(function (result) {
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
            getquotation();
        });

        //function getquotationitems(id) {
        //    _$itemsTable.DataTable().rows().remove().draw(false);
        //    _quotationService.getQuotationItemsByParentId({ id: id }).done(function (result) {

        //        for (var i = 0; i < result.items.length; i++) {
        //            var $sqiid = result.items[i].id;
        //            var $sqiproductid = result.items[i].productId;
        //            var $sqiproductcode = result.items[i].productCode;
        //            var $sqiproductname = result.items[i].productName;
        //            var $sqiproductdescription = result.items[i].productDescription;
        //            var $sqiunitid = result.items[i].unitId;
        //            var $sqiunit = result.items[i].unit;
        //            var $sqiquantity = result.items[i].orderQty;
        //            var $sqiprice = result.items[i].unitPrice;
        //            var $sqiimagename = result.items[i].imageName;

        //            var $sqidisc1 = result.items[i].disc1;
        //            var $sqidisc2 = result.items[i].disc2;
        //            var $sqidisc3 = result.items[i].disc3;
        //            var $sqidtype1 = result.items[i].discType1;
        //            var $sqidtype2 = result.items[i].discType2;
        //            var $sqidtype3 = result.items[i].discType3;
        //            var $sqiperdescription = result.items[i].description;

        //            var sqiprice = parseFloat($sqiprice);
        //            var sqiquantity = parseFloat($sqiquantity);

        //            var sqidisc1 = 0;
        //            var sqidisc2 = 0;
        //            var sqidisc3 = 0;
        //            if ($sqidisc1 !== "") {
        //                sqidisc1 = parseFloat($sqidisc1);
        //            }
        //            if ($sqidisc2 !== "") {
        //                sqidisc2 = parseFloat($sqidisc2);
        //            }
        //            if ($sqidisc3 !== "") {
        //                sqidisc3 = parseFloat($sqidisc3);
        //            }

        //            var sqidiscount = priceDiscount(sqiprice, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3));
        //            var sqitotaldiscount = sqidiscount * sqiquantity;
        //            var sqilessprice = sqiprice - sqidiscount;
        //            var sqitotal = sqilessprice * sqiquantity;
        //            var sqidatacount = dataTable.rows().count();
        //            var sqiitemno = sqidatacount + 1;

        //            dataTable.row.add([sqiitemno,
        //                '<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
        //                '<label class="text-muted">' + $sqiquantity + '</label>|<label class="text-muted">' + $sqiunit + '</label>',
        //                sqiprice,
        //                sqitotaldiscount,
        //                sqitotal,
        //                '',
        //                $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $sqiid
        //            ]).draw();

        //            //dataTablePrint.row.add(['<label class="font-weight-bold">' + $sqiproductcode + '</label><br/><img src="'+ abp.appPath +'products/' + $sqiproductcode + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
        //            //    '<label class="font-weight-bold">' + $sqiproductname + '</label><br/><label class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</label>',
        //            //    '<label class="text-muted">' + $sqiquantity + '</label>',
        //            //    sqiprice,
        //            //    sqitotaldiscount,
        //            //    sqitotal]).draw();

        //            var firstcol = '';

        //            if ($sqigroupname !== '' && $sqigroupname !== null) {
        //                dataTablePrint.row.add(['<span class="font-weight-bold text-danger">' + $sqigroupname + '</span>', '', '', '', '']).draw();

        //                dataTablePrintActual.row.add(['<span class="font-weight-bold text-danger">' + $sqigroupname + '</span>', '', '', '', '']).draw();
        //            }
        //            if ($sqiimagename !== '' && $sqiimagename !== null) {
        //                dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
        //                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
        //                '<span class="text-muted">' + $sqiquantity + '</span>',
        //                    sqiprice,
        //                    sqitotal]).draw();
        //                dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

        //                dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="height: 150px; width: 150px;"/>',
        //                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
        //                '<span class="text-muted">' + $sqiquantity + '</span>',
        //                    sqiactualprice,
        //                    sqiactualtotal]).draw();
        //                dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
        //            }
        //            else {
        //                dataTablePrint.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
        //                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
        //                '<span class="text-muted">' + $sqiquantity + '</span>',
        //                    sqiprice,
        //                    sqitotal]).draw();
        //                dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

        //                dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
        //                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + '</span>',
        //                '<span class="text-muted">' + $sqiquantity + '</span>',
        //                    sqiactualprice,
        //                    sqiactualtotal]).draw();
        //                dataTablePrintActual.row.add(['<br/>', '', '', '', '']).draw();
        //            }
        //        }
        //        abp.ui.unblock();
        //    });
        //};

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
        function getcontactpersons(id) {
            var $clientid = $('#ClientId').val();

            var contactpersons = $('#ContactPersons');
            contactpersons.empty();
            _contactPersonService.getContactPersonsFiltered({ id: 0, reference: 'Client', referenceId: $clientid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        contactpersons.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].fullName + '</option>');
                    }
                    else {
                        contactpersons.append('<option value=' + result.items[i].id + '>' + result.items[i].fullName + '</option>');
                    }
                }
                contactpersons.selectpicker('refresh');
            });
        };
        function getdeliverytype(id) {
            var deliverytypes = $('#DeliveryTypes');
            deliverytypes.empty();
            _commonService.getDeliveryTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        deliverytypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                    }

                }
                deliverytypes.selectpicker('refresh');
            });
        }
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
            });
        }
        ////Datatable Add
        //var dataTable = _$itemsTable.DataTable({
        //    responsive: true,
        //    paging: false,
        //    "bInfo": false,
        //    searching: false,
        //    columnDefs: [{
        //        "visible": false,
        //        targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
        //    },
        //    {
        //        orderable: false,
        //        targets: [0, 1, 2, 3, 4, 5, 6]
        //    },
        //    {
        //        render: $.fn.dataTable.render.number(',', '.', 2),
        //        className: 'text-right',
        //        targets: [3, 4, 5]
        //    },
        //    {
        //        className: 'text-center',
        //        targets: [2]
        //    },
        //    {
        //        visible: false,
        //        data: null,
        //        className: "text-center",
        //        "render": function () {
        //            return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        //        },
        //        targets: [6]
        //    }
        //    ]
        //});
        //var dataTableDeleted = _$itemsTableDeleted.DataTable({
        //    responsive: true,
        //    paging: false,
        //    "bInfo": false,
        //    searching: false,
        //    columnDefs: [{
        //        "visible": false,
        //        targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
        //    },
        //    {
        //        orderable: false,
        //        targets: [0, 1, 2, 3, 4, 5, 6]
        //    },
        //    {
        //        render: $.fn.dataTable.render.number(',', '.', 2),
        //        className: 'text-right',
        //        targets: [3, 4, 5]
        //    },
        //    {
        //        className: 'text-center',
        //        targets: [2]
        //    },
        //    {
        //        data: null,
        //        className: "text-center",
        //        "render": function () {
        //            return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        //        },
        //        targets: [6]
        //    }
        //    ]
        //});
        //var dataTablePrint = _$itemsTablePrint.DataTable({
        //    responsive: true,
        //    paging: false,
        //    "bInfo": false,
        //    searching: false,
        //    columnDefs: [
        //        {
        //            orderable: false,
        //            targets: [0, 1, 2, 3, 4, 5]
        //        },
        //        {
        //            render: $.fn.dataTable.render.number(',', '.', 2),
        //            className: 'text-right',
        //            targets: [3, 4, 5]
        //        },
        //        {
        //            className: 'text-center',
        //            targets: [2]
        //        }
        //    ]
        //});


        //Datatable Add
        var dataTable = _$itemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                //MARC qi_option 07212022
                //targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                targets: [5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            },
            {
                orderable: false,//MARC qi_option 07212022
                //targets: [0, 1, 2, 3, 4, 5, 6]
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
                //MARC qi_option 07212022//
                //targets: [2]
                targets: [3]
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
                //MARC qi_option 07212022
                //targets: [4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
                targets: [5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            },
                {
                    orderable: false,
                    //MARC qi_option 07212022
                    //targets: [0, 1, 2, 3, 4, 5, 6
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
                    targets: [3]
            },
            {
                data: null,
                className: "text-center",
                "render": function () {
                    return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                },
                //MARC qi_option 07212022
                //targets: [6]
                targets: [7]
            }
            ]
        });
        var dataTablePrint = _$itemsTablePrint.DataTable({
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
                    //render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: [3, 4]
                },
                {
                    className: 'text-center',
                    targets: [2]
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
                    //render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: [3, 4]
                },
                {
                    className: 'text-center',
                    targets: [2]
                }
            ]
        });
        getquotation();

        function getcontactperson(id) {
            _contactPersonService.getContactPerson({ id: id }).done(function (result) {
                $('#ContactPersonPosition').val(result.position);
            });
        };

        //RFQ Autocomplete
        var getrfqs = function (request, response) {
            var $prfqid = $('#PrevRequestId').val();
            _rfqService.getRFQsforQuotation({ filter: request.term + "|" + $prfqid }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code + ' - ' + el.client + ' - ' + el.projectName,
                        value: el.id
                    };
                }));
            });
        };
        function getrfq() {
            var $rfqid = $('#RequestId').val();
            _rfqService.getRFQ({ id: $rfqid }).done(function (result) {
                $("#Request").val(result.code + ' - ' + result.client + ' - ' + result.projectName);
                $("#RequestCode").val(result.code);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#Project').val(result.projectName);
                $('#ContactPersonId').val(result.contactPersonId);
                $('#ContactPerson').val(result.contactPerson);
                $('#DeliveryAddress').val(result.deliveryAddress);
                $('#ClientAddress').val(result.address);
                $('#ClientTelephone').val(result.telNo);
                $('#ClientEmail').val(result.email);
            });
        };

        var selectrfq = function (event, ui) {
            event.preventDefault();
            $("#RequestId").val(ui.item ? ui.item.value : "");
            $("#Request").val(ui.item ? ui.item.label : "");
            getrfq();
            return false;
        };
        var focusrfq = function (event, ui) {
            event.preventDefault();
            $("#RequestId").val(ui.item.value);
            $("#Request").val(ui.item.label);
        };
        var changerfq = function (event, ui) {
            event.preventDefault();
            $("#RequestId").val(ui.item ? ui.item.value : "");
            $("#Request").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#RequestCode").val('');
                $('#ClientId').val('');
                $('#ClientName').val('');
                $('#Project').val('');
                $('#ContactPersonId').val('')
                $('#ContactPerson').val('');
                $('#ClientTelephone').val('');
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

        function getclient() {
            var $clientid = $('#ClientId').val();
            _clientService.getClient({ id: $clientid }).done(function (result) {
                $('#ClientAddress').val(result.address);
                $('#ClientEmail').val(result.email);
                $('#ClientTelephone').val(result.telNo);
            });
        };
        function clientautocompletehidden() {
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
            //        $('#ClientEmail').val(result.email);
            //        $('#ClientTelephone').val(result.telNo);
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

        function getagent() {
            var $salesagentid = $('#SalesAgentId').val();
            _employeeService.getEmployee({ id: $salesagentid }).done(function (result) {
                $('#SalesAgentMobile').val(result.cellNo);
                $('#SalesAgentEmail').val(result.email);
                $('#ManagerId').val(result.managerId);
                getmanager();
            });
        };

        function getmanager() {
            var managerid = $('#ManagerId').val();
            if (managerid > 0) {
                _employeeService.getEmployee({ id: managerid }).done(function (result) {
                    $('#ManagerMobile').val(result.cellNo);
                    $('#ManagerEmail').val(result.email);
                });
            }
        };
      
        var selectagent = function (event, ui) {
            event.preventDefault();
            $("#SalesAgentId").val(ui.item ? ui.item.value : 0);
            $("#SalesAgent").val(ui.item ? ui.item.label : "");
            getagent();
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

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $perdescription === '') { return; }

            var price = parseFloat($price.replace(/,/g, ''));
            var quantity = parseFloat($quantity);

            var disc1 = 0;
            var disc2 = 0;
            var disc3 = 0;
            if ($disc1 !== "") {
                disc1 = parseFloat($disc1);
            }
            if ($disc2 !== "") {
                disc2 = parseFloat($disc2);
            }
            if ($disc3 !== "") {
                disc3 = parseFloat($disc3);
            }

            var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;
            var datacount = dataTable.rows().count();
            var itemno = datacount + 1;
            var $rowid = "id_row_" + itemno;
            var $rowcode = "code_row_" + itemno;
            var $rowname = "name_row_" + itemno;
            var $rowquantity = "quantity_row_" + itemno;
            var $rowunit = "unit_row_" + itemno;
            dataTable.row.add([itemno,
                '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',

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
                $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), 0, $groupname, $productcode


                //MARC qi_option 07212022
                , $itemtypev
                //MARC qi_option 07212022
            ]).draw();

            computeTotal();

            $('#Discount1').val("");
            $('#Discount2').val("");
            $('#Discount3').val("");
            $('#Quantity').val("");
        }
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
                        f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], parseInt(f[i][12]), f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17]]).draw();
                }
            }
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
            //dataTable.column(5).data()
            //    .each(function (value, index) {
            //        //MARC qi_option 07212022
            //        //var $grandtotal = parseFloat(value);
            //        //grandtotal = grandtotal + $grandtotal;
            //        console.log('computetotal items row : ' + index)
            //        var $itemtype = dataTable.cell(index, 20).data() + '';

            //        if ($itemtype === '1') {
            //            console.log('item type : ' + dataTable.cell(index, 20).data());
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
                    console.log('computetotal items row : ' + index)
                    var $itemtype = dataTable.cell(index, 21).data() + '';

                    if ($itemtype === '1') {
                        console.log('item type : ' + dataTable.cell(index, 21).data());
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
                    console.log('computetotal items row : ' + index)
                    console.log('item type : ' + dataTable.cell(index, 21).data());
                    var $itemtype = dataTable.cell(index, 21).data() + '';

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
        function updateQuotation() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();
            var $updatedsqid = $('#Id').val();
            var viewData = {
                quotation: {
                    "id": formdata.Id,
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": formdata.Prefix,
                    "code": formdata.Code,
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "clientOrderNo": formdata.ClientOrderNo,
                    "requestId": formdata.RequestId,
                    "requestCode": formdata.RequestCode,
                    "orderTypeId": formdata.OrderTypeId,
                    "salesAgentId": formdata.SalesAgentId,
                    "contactPersonId": formdata.ContactPersonId,
                    "notes": formdata.Notes,
                    "statusId": formdata.StatusId,
                    "taxTypeId": formdata.TaxTypeId,
                    "revisionNo": formdata.RevisionNo,
                    "subTotal": formdata.Total,
                    "otherDiscount": 0,
                    "netTotal": formdata.SubTotal,
                    "taxRate": $("#TaxTypes option:selected").data('rate'),
                    "tax": formdata.Tax,
                    "grandTotal": formdata.Total
                },
                quotationitems: []
            };
            disabled.attr('disabled', 'disabled');

            //items
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            //jsonObj = [];
            for (var i = 0; f.length > i; i++) {

                item = {};
                //item["Id"] = f[i][17];
                //item["QuotationId"] =0;
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
                //item["GroupName"] = f[i][18];
                //item["Reference"] = f[i][19];

                item["Id"] = f[i][18];
                item["QuotationId"] = 0;
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
                item["GroupName"] = f[i][19];
                item["Reference"] = f[i][20];

                //MARC qi_option 07212022
                console.log(f[i][21]);
                item["ItemType"] = f[i][21];
                viewData.quotationitems.push(item);
                //jsonObj.push(item);
            }

            var tabledeleted = _$itemsTableDeleted.DataTable();
            var form_deleteddata = tabledeleted.rows().data();
            var g = form_deleteddata;

            for (var j = 0; g.length > j; j++) {

                item = {};
                //item["Id"] = g[j][17];
                //item["QuotationId"] = "0";
                //item["ProductId"] = g[j][7];
                //item["Description"] = g[j][8];
                //item["OrderQty"] = g[j][9];
                //item["UnitId"] = g[j][10];
                //item["UnitPrice"] = g[j][3];
                //item["Disc1"] = g[j][11];
                //item["DiscType1"] = g[j][12];
                //item["Disc2"] = g[j][13];
                //item["DiscType2"] = g[j][14];
                //item["Disc3"] = g[j][15];
                //item["DiscType3"] = g[j][16];
                //item["DiscTotal"] = g[j][4];
                //item["Total"] = g[j][5];
                //item["GroupName"] = f[j][18];
                //item["Reference"] = f[j][19];

                item["Id"] = g[j][18];
                item["QuotationId"] = "0";
                item["ProductId"] = g[j][8];
                item["Description"] = g[j][9];
                item["OrderQty"] = g[j][10];
                item["UnitId"] = g[j][11];
                item["UnitPrice"] = g[j][4];
                item["Disc1"] = g[j][12];
                item["DiscType1"] = g[j][13];
                item["Disc2"] = g[j][14];
                item["DiscType2"] = g[j][15];
                item["Disc3"] = g[j][16];
                item["DiscType3"] = g[j][17];
                item["DiscTotal"] = g[j][5];
                item["Total"] = g[j][6];
                item["GroupName"] = f[j][19];
                item["Reference"] = f[j][20];

                //MARC qi_option 07212022
                item["ItemType"] = f[i][21];
                item["IsDeleted"] = 1;
                viewData.quotationitems.push(item);
            }
            abp.message.confirm(
                'New sales order will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        var returnid = _quotationService.updateQuotation(viewData).done(function (result) {
                            abp.message.success('Quotation updated', 'Success');
                            window.location.href = abp.appPath + 'Quotations/Edit?id=' + result;
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }
        $('#SaveButton').click(function (e) {
            e.preventDefault();
            updateQuotation();
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
            updateQuotation();
        });

        $('#ReviseButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(3);
            updateQuotation();
        });
        _$itemsTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$itemsTable.DataTable();
            deleteitem(dtRow[0].rowIndex - 1);
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        // Delete product unit record
        $('#TaxTypes').on('change', function (e) {
            computeTotal();
        });
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            addnewitem();
        });
        $('#PaymentTerms').on('change', function (e) {
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

        //function printPreview() {
        //    var quotationcode = $('#QuotationCode').val();
        //    var companyname = $("#Companies option:selected").html();
        //    var clientcontactperson = $("#ContactPerson").val();
        //    //var clientcontactperson = $("#ContactPersons option:selected").html();
        //    var clientname = $('#ClientName').val();
        //    var clienttelephone = $('#ClientTelephone').val();
        //    var clientproject = $('#Project').val();
        //    var requestcode = $('#RequestCode').val();
        //    var notes = $('#Notes').val();

        //    var salesagent = $('#SalesAgent').val();
        //    var salesagentmobile = $('#SalesAgentMobile').val();
        //    var salesagentemail = $('#SalesAgentEmail').val();

        //    var companyaddress = $('#CompanyAddress').text();
        //    var clientaddress = $('#ClientAddress').val();
        //    var transdate = $('#TransactionTime').val();
        //    var subtotal = $('#SubTotal').val();
        //    var tax = $('#Tax').val();
        //    var total = $('#Total').val();
        //    var divToPrint = document.getElementById("ItemsTablePrint");
        //    var termname = $("#ContactPersons option:selected").html();

        //    var win = window.open('');

        //    win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath +'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /></head><body>');
        //    win.document.write('<div id="content" class="container_12 clearfix">');
        //    win.document.write('<div id="content-main" class="grid_12">');

        //    // Header
        //    win.document.write('<div class="row">');
        //    win.document.write('<div  class="col-lg-12"><img src="' + abp.appPath +'images/logo-header.png" style="width: 350px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:11px;">' + companyaddress + '</label></div>');
        //    win.document.write('</div>');

        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');
        //    win.document.write('<table class="" width="100%">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="15%"></th>');
        //    win.document.write('<th width="45%"></th>');
        //    win.document.write('<th width="15%"></th>');
        //    win.document.write('<th width="25%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tbody>');
        //    win.document.write('<tr>');
        //    win.document.write('<td>TO</td>');
        //    win.document.write('<td class="font-weight-bold">' + clientname+'</td>');
        //    win.document.write('<td class="text-right">REF</td>');
        //    win.document.write('<td class="text-right">' + quotationcode+'</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row"></td>');
        //    win.document.write('<td class="text-mute" style="font-size:11px;">' + clientaddress + '</td>');
        //    win.document.write('<td class="text-right">RFQ No</td>');
        //    win.document.write('<td class="text-right">' + requestcode + '</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td>ATTN</td>');
        //    win.document.write('<td class="font-weight-bold">' + clientcontactperson+'</td>');
        //    win.document.write('<td class="text-right">DATE</td>');
        //    win.document.write('<td class="text-right">' + transdate+'</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td>PROJECT</td>');
        //    win.document.write('<td>' + clientproject + '</td>');
        //    win.document.write('<td class="text-right">TEL No</td>');
        //    win.document.write('<td class="text-right">' + clienttelephone +'</td>');
        //    win.document.write('</tr>');


        //    win.document.write('</tbody>');

        //    win.document.write('</table >');
        //    win.document.write('</div>');
        //    win.document.write('</div>');
        //    // Header

        //    // Body
        //    win.document.write(divToPrint.outerHTML);
        //    // Body

        //    // Footer

        //    //TOTAL
        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');
        //    win.document.write('<table class="" width="100%" style="font-size:12px;">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="75%"></th>');
        //    win.document.write('<th width="25%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tbody>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
        //    win.document.write('<td class="font-weight-bold text-right">' + subtotal + '</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
        //    win.document.write('<td class="font-weight-bold text-right">'+tax+'</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="font-weight-bold text-right">NET TOTAL</td>');
        //    win.document.write('<td class="font-weight-bold text-right">'+total+'</td>');
        //    win.document.write('</tr>');

        //    win.document.write('</tbody>');
        //    win.document.write('</table >');

        //    win.document.write('</div>');
        //    win.document.write('</div>');
        //    //TERM

        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');

        //    win.document.write('<table class="" width="100%" style="font-size:12px;">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="25%"></th>');
        //    win.document.write('<th width="75%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tbody>');
        //    win.document.write('<tr>');
        //    win.document.write('<td class="font-weight-bold">TERMS AND CONDITIONS:</td>');
        //    win.document.write('<td class="text-left"></td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row">1. VALIDITY</td>');
        //    win.document.write('<td class="text-left">14 Working day(s)</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row">2. TERMS</td>');
        //    win.document.write('<td class="text-left">50% Downpayment, 50% balance upon full completion</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row">3. DELIVERY</td>');
        //    win.document.write('<td class="text-left">Forty Five (45) Working Days upom receipt of confirmation and completion of all approved materials whatever comes later .</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row">4. PRICE</td>');
        //    win.document.write('<td class="text-left">VAT Inclusive</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row"></td>');
        //    win.document.write('<td class="text-left text-danger">Other Charges</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row"></td>');
        //    win.document.write('<td class="text-left text-danger">Permits, Elevator Fee</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row"></td>');
        //    win.document.write('<td class="text-left text-danger">Non Standard Fabric</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row"></td>');
        //    win.document.write('<td class="text-left text-danger">Mobilization Charges outside Metro Manila</td>');
        //    win.document.write('</tr>');

        //    win.document.write('</tbody>');
        //    win.document.write('</table >');

        //    win.document.write('</div>');
        //    win.document.write('</div>');

        //    //TOTAL
        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');
        //    win.document.write('<table class="" width="100%" style="font-size:12px;">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="60%"></th>');
        //    win.document.write('<th width="40%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tbody>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity bt signing on the space provided below, after which the sames quotaion shall become an official contract.</td>');
        //    win.document.write('<td class="text-left"></td>');
        //    win.document.write('</tr>');

        //    win.document.write('</tbody>');
        //    win.document.write('</table >');

        //    win.document.write('</div>');
        //    win.document.write('</div>');

        //    //Notes

        //    //Signatory

        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');
        //    win.document.write('<table class="" width="100%">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="75%"></th>');
        //    win.document.write('<th width="25%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tbody>');
        //    win.document.write('<tr>');
        //    win.document.write('<td>Very truly yours,</td>');
        //    win.document.write('<td class="text-left">Conforme:</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="font-weight-bold" scope="row">' + companyname+'</td>');
        //    win.document.write('<td class="text-left font-weight-bold">' + clientname + '</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td><br/></td>');
        //    win.document.write('<td><br/></td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="font-weight-bold" scope="row">' + salesagent + '</td>');
        //    win.document.write('<td class="text-left font-weight-bold">' + clientcontactperson + '</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row">Account Specialist</td>');
        //    win.document.write('<td class="text-left" style="font-size:11px">Signature overprinted name/ date</td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row" style="font-size:11px">' + salesagentmobile + '</td>');
        //    win.document.write('<td class="text-left"></td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td scope="row" style="font-size:11px">' + salesagentemail + '</td>');
        //    win.document.write('<td class="text-left"></td>');
        //    win.document.write('</tr>');

        //    win.document.write('</tbody>');
        //    win.document.write('</table >');
        //    win.document.write('</div>');
        //    win.document.write('</div>');
        
        //    // Note

        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');
        //    win.document.write('<table class="" width="100%">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="10%"></th>');
        //    win.document.write('<th width="90%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="text-left">Noted:</td>');
        //    win.document.write('<td scope="row" style="font-size:11px">' + notes + '</td>');
        //    win.document.write('</tr>');

        //    win.document.write('</tbody>');
        //    win.document.write('</table >');
        //    win.document.write('</div>');
        //    win.document.write('</div>');

        //    //
        //    win.document.write('<div class="row">');
        //    win.document.write('<div class="col-lg-12">');
        //    win.document.write('<table class="" width="100%">');

        //    win.document.write('<thead>');
        //    win.document.write('<tr>');
        //    win.document.write('<th width="75%"></th>');
        //    win.document.write('<th width="25%"></th>');
        //    win.document.write('</tr>');
        //    win.document.write('</thead>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="text-left font-weight-bold">Nick Balin</td>');
        //    win.document.write('<td scope="row" style="font-size:11px"></td>');
        //    win.document.write('</tr>');

        //    win.document.write('<tr>');
        //    win.document.write('<td class="text-left">Business Development Manager</td>');
        //    win.document.write('<td scope="row" style="font-size:11px"></td>');
        //    win.document.write('</tr>');

        //    win.document.write('</tbody>');
        //    win.document.write('</table >');
        //    win.document.write('</div>');
        //    win.document.write('</div>');

        //    // Footer

        //    win.document.write('</div>');
        //    win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath +'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
        //    //win.print();
        //    //window.print();
        //};

        //$('#PrintButton').click(function (e) {
        //    e.preventDefault();
        //    printPreview();
        //});

        function printPreview() {
            var quotationcode = $('#RefNo').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            var clientcontactpersonpos = $("#ContactPersonPosition").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var clientemail = $('#ClientEmail').val();
            var requestcode = $('#RequestCode').val();
            var notes = $('#Notes').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentmobile = $('#SalesAgentMobile').val();
            var salesagentemail = $('#SalesAgentEmail').val();
            var salesagentpos = $('#SalesAgentPosition').val();

            var managerid = $('#ManagerId').val();
            var manager = $('#Manager').val();
            var managerpos = $('#ManagerPosition').val();
            var managermobile = $('#ManagerMobile').val();
            var manageremail = $('#ManagerEmail').val();

            var companyaddress = $('#CompanyAddress').text();
            var clientaddress = $('#ClientAddress').val();
            var transdate = $('#TransactionTime').val();
            var subtotal = $('#Total').val();
            var nettotal = $('#NetTotal').val();
            var tax = $('#Tax').val();
            var grandtotal = $('#GrandTotal').val();
            var divToPrint = document.getElementById("ItemsTablePrint");
            var termname = $("#ContactPersons option:selected").html();
            var termsandconditions = $('#TermsAndConditions').val();

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath +'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<br />');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style = "font-size:16px;">');

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
            win.document.write('<td>TO</td>');
            win.document.write('<td class="font-weight-bold">' + clientname + '</td>');
            win.document.write('<td class="text-right">REF</td>');
            win.document.write('<td class="text-right">' + quotationcode + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-mute" style="font-size:15px;">' + clientaddress + '</td>');
            win.document.write('<td class="text-right">RFQ No</td>');
            win.document.write('<td class="text-right">' + requestcode + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>ATTN</td>');
            win.document.write('<td class="font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('<td class="text-right">DATE</td>');
            win.document.write('<td class="text-right">' + transdate + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>PROJECT</td>');
            win.document.write('<td>' + clientproject + '</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">TEL No</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">' + clienttelephone + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>EMAIL ADDRESS</td>');
            win.document.write('<td>' + clientemail + '</td>');
            win.document.write('<td class="text-right"></td>');
            win.document.write('<td class="text-right"></td>');
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
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:20px">QUOTATION</td>');
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

            // Header

            // Footer

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');

            // Body
            win.document.write(divToPrint.outerHTML);
            // Body

            win.document.write('<table class="" width="95%" style="font-size:16px;margin: 0 auto;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="75%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
            //win.document.write('</tr>');
            var taxcode = $("#TaxTypes option:selected").data('code');
            var taxrate = $("#TaxTypes option:selected").data('rate');
            var nettotal2 = 0, tax2 = 0, grandtotal2 = 0;
            if (taxcode === 101) {
                console.log(preformatFloat(nettotal) + ' + ' + preformatFloat(tax));
                nettotal2 = parseFloat(preformatFloat(nettotal)) + parseFloat(preformatFloat(tax));
                console.log(currencyFormat(nettotal2));
                //tax2 = nettotal2 * (taxrate - 1);

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                win.document.write('<td class="font-weight-bold text-right">' + currencyFormat(nettotal2) + '</td>');
                win.document.write('</tr>');

                //win.document.write('<tr>');
                //win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
                //win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
                //win.document.write('</tr>');
            }
            else if (taxcode === 104) {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
                win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
                win.document.write('</tr>');
            }
            else {

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
                win.document.write('</tr>');
            }

            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {
                //if (k === 0)
                //{
                //    win.document.write('<tr>');
                //    win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                //    win.document.write('<td class="font-weight-bold text-right">' + subtotal + '</td>');
                //    win.document.write('</tr>');
                //}

                var sqiprice = parseFloat(h[k][4]);

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right text-danger">' + h[k][1] + '</td>');
                win.document.write('<td class="font-weight-bold text-right text-danger">' + currencyFormat(sqiprice) + '</td>');
                win.document.write('</tr>');
            }

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold text-right">GRAND TOTAL</td>');
            win.document.write('<td class="font-weight-bold text-right">' + grandtotal + '</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            //TERM

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');

            win.document.write('<table class="" width="100%" style="font-size:16px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="30%"></th>');
            win.document.write('<th width="70%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');
            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold">TERMS AND CONDITIONS:</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">1. VALIDITY</td>');
            win.document.write('<td class="text-left">14 Working day(s)</td>');
            win.document.write('</tr>');

            var $paymentterms = $("#PaymentTerms option:selected").html();
            var $deliverytypes = $("#DeliveryTypes option:selected").html();
            var $taxtypes = $("#TaxTypes option:selected").html();
            //MARC multiselect 08262022
            //var $warrantytypes = $("#WarrantyTypes option:selected").html();
            var $warrantytypes = $("#WarrantyTypes").val();
            //END MARC multiselect 08262022

            win.document.write('<tr>');
            win.document.write('<td scope="row">2. TERMS OF PAYMENT</td>');
            win.document.write('<td class="text-left">' + $paymentterms + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" style="vertical-align:top">3. DELIVERY</td>');
            win.document.write('<td class="text-left">' + $deliverytypes + ' upon receipt of confirmation and completion of all approved materials whatever comes later .</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">4. PRICE</td>');
            win.document.write('<td class="text-left">' + $taxtypes + '</td>');
            win.document.write('</tr>');

            //MARC multiselect 08262022
            //win.document.write('<tr>');
            //win.document.write('<td scope="row">5. WARRANTY</td>');
            //win.document.write('<td class="text-left">' + $warrantytypes + '</td>');
            //win.document.write('</tr>');
            for (var i = 0; i < $warrantytypes.length; i++) {
                var val = $warrantytypes[i];
                var txt = $("#WarrantyTypes option[value='" + val + "']").text();
                if (i == 0) {
                    win.document.write('<tr>');
                    win.document.write('<td scope="row">5. WARRANTY</td>');
                    win.document.write('<td class="text-left">' + txt + '</td>');
                    win.document.write('</tr>');
                }
                else {
                    win.document.write('<tr>');
                    win.document.write('<td scope="row"></td>');
                    win.document.write('<td class="text-left">' + txt + '</td>');
                    win.document.write('</tr>');
                }
            }
            //END MARC multiselect 08262022

            win.document.write('<tr>');
            win.document.write('<td scope="row">6. QUOTATION DOES NOT INCLUDE</td>');
            //win.document.write('<td class="text-left text-danger">Other Charges</td>');
            win.document.write('<td class="text-left">Other Charges such as:</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-left text-danger">Permits, Elevator Fee</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-left text-danger">Non Standard Fabric</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-left text-danger">Mobilization Charges outside Metro Manila</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:16px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="60%"></th>');
            win.document.write('<th width="40%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity by signing on the space provided below, after which the same quotation shall become an official contract.</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

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
            win.document.write('<th width="70%"></th>');
            win.document.write('<th width="30%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');
            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>Very truly yours,</td>');
            win.document.write('<td class="text-left">Conforme:</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold" scope="row" style="vertical-align:top">' + companyname + '</td>');
            win.document.write('<td class="text-left font-weight-bold" style="vertical-align:top">' + clientname + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            //win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left" style="font-size:13px">Signature over printed name / Date</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="text-left font-weight-bold">_________________________</td>');
            win.document.write('<td class="text-left font-weight-bold">_________________________</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold" scope="row">' + salesagent + '</td>');
            win.document.write('<td class="text-left font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">' + salesagentpos + '</td>');
            //win.document.write('<td class="text-left" style="font-size:11px">Signature overprinted name/ date</td>');
            win.document.write('<td scope="row">' + clientcontactpersonpos + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">' + salesagentemail + '</td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">' + salesagentmobile + '</td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            if (managerid > 0) {
                win.document.write('<tr>');
                win.document.write('<td><br/></td>');
                win.document.write('<td><br/></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td class="text-left font-weight-bold">_________________________</td>');
                win.document.write('<td class="text-left"></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold" scope="row">' + manager + '</td>');
                win.document.write('<td class="text-left"></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td scope="row">' + managerpos + '</td>');
                win.document.write('<td class="text-left"></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td scope="row">' + manageremail + '</td>');
                win.document.write('<td><br/></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td scope="row">' + managermobile + '</td>');
                win.document.write('<td><br/></td>');
                win.document.write('</tr>');
            }

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
        function printPreviewActual() {
            var quotationcode = $('#RefNo').val();
            var companyname = $("#Companies option:selected").html();
            var clientcontactperson = $("#ContactPerson").val();
            var clientcontactpersonpos = $("#ContactPersonPosition").val();
            //var clientcontactperson = $("#ContactPersons option:selected").html();
            var clientname = $('#ClientName').val();
            var clientemail = $('#ClientEmail').val();
            var clienttelephone = $('#ClientTelephone').val();
            var clientproject = $('#Project').val();
            var requestcode = $('#RequestCode').val();
            var notes = $('#Notes').val();

            var salesagent = $('#SalesAgent').val();
            var salesagentmobile = $('#SalesAgentMobile').val();
            var salesagentemail = $('#SalesAgentEmail').val();
            var salesagentpos = $('#SalesAgentPosition').val();

            var managerid = $('#ManagerId').val();
            var manager = $('#Manager').val();
            var managerpos = $('#ManagerPosition').val();
            var managermobile = $('#ManagerMobile').val();
            var manageremail = $('#ManagerEmail').val();

            var companyaddress = $('#CompanyAddress').text();
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

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<br />');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style = "font-size:16px;">');

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
            win.document.write('<td>TO</td>');
            win.document.write('<td class="font-weight-bold">' + clientname + '</td>');
            win.document.write('<td class="text-right">REF</td>');
            win.document.write('<td class="text-right">' + quotationcode + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-mute" style="font-size:15px;">' + clientaddress + '</td>');
            win.document.write('<td class="text-right">RFQ No</td>');
            win.document.write('<td class="text-right">' + requestcode + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>ATTN</td>');
            win.document.write('<td class="font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('<td class="text-right">DATE</td>');
            win.document.write('<td class="text-right">' + transdate + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>PROJECT</td>');
            win.document.write('<td>' + clientproject + '</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">TEL No</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">' + clienttelephone + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>EMAIL ADDRESS</td>');
            win.document.write('<td>' + clientemail + '</td>');
            win.document.write('<td class="text-right"></td>');
            win.document.write('<td class="text-right"></td>');
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
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:16px"><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" class="text-center font-weight-bold" style="font-size:20px">ACTUAL</td>');
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

            // Header

            // Footer

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');

            // Body
            win.document.write(divToPrint.outerHTML);
            // Body

            win.document.write('<table class="" width="95%" style="font-size:16px;margin: 0 auto;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="75%"></th>');
            win.document.write('<th width="25%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold text-right">DISCOUNT</td>');
            win.document.write('<td class="font-weight-bold text-right">' + discounttotal + '</td>');
            win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
            //win.document.write('</tr>');

            var taxcode = $("#TaxTypes option:selected").data('code');
            var taxrate = $("#TaxTypes option:selected").data('rate');
            var nettotal2 = 0, tax2 = 0, grandtotal2 = 0;
            if (taxcode === 101) {
                console.log(preformatFloat(nettotal) + ' + ' + preformatFloat(tax));
                nettotal2 = parseFloat(preformatFloat(nettotal)) + parseFloat(preformatFloat(tax));
                console.log(currencyFormat(nettotal2));
                //tax2 = nettotal2 * (taxrate - 1);

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                win.document.write('<td class="font-weight-bold text-right">' + currencyFormat(nettotal2) + '</td>');
                win.document.write('</tr>');

                //win.document.write('<tr>');
                //win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
                //win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
                //win.document.write('</tr>');
            }
            else if (taxcode === 104) {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
                win.document.write('<td class="font-weight-bold text-right">' + tax + '</td>');
                win.document.write('</tr>');
            }
            else {

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                win.document.write('<td class="font-weight-bold text-right">' + nettotal + '</td>');
                win.document.write('</tr>');
            }

            var tablecharges = _$chargesTable.DataTable();
            var form_datacharges = tablecharges.rows().data();
            var h = form_datacharges;

            for (var k = 0; h.length > k; k++) {
                //if (k === 0) {
                //    win.document.write('<tr>');
                //    win.document.write('<td class="font-weight-bold text-right">TOTAL</td>');
                //    win.document.write('<td class="font-weight-bold text-right">' + subtotal + '</td>');
                //    win.document.write('</tr>');
                //}
                var sqiprice = parseFloat(h[k][4]);

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right text-danger">' + h[k][1] + '</td>');
                win.document.write('<td class="font-weight-bold text-right text-danger">' + currencyFormat(sqiprice) + '</td>');
                win.document.write('</tr>');
            }


            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold text-right">GRAND TOTAL</td>');
            win.document.write('<td class="font-weight-bold text-right">' + grandtotal + '</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');


            //TERM

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');

            win.document.write('<table class="" width="100%" style="font-size:16px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="30%"></th>');
            win.document.write('<th width="70%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');
            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold">TERMS AND CONDITIONS:</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">1. VALIDITY</td>');
            win.document.write('<td class="text-left">14 Working day(s)</td>');
            win.document.write('</tr>');

            var $paymentterms = $("#PaymentTerms option:selected").html();
            var $deliverytypes = $("#DeliveryTypes option:selected").html();
            var $taxtypes = $("#TaxTypes option:selected").html();
            //MARC multiselect 08262022
            //var $warrantytypes = $("#WarrantyTypes option:selected").html();
            var $warrantytypes = $("#WarrantyTypes").val();
            //END MARC multiselect 08262022

            win.document.write('<tr>');
            win.document.write('<td scope="row">2. TERMS OF PAYMENT</td>');
            win.document.write('<td class="text-left">' + $paymentterms + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" style="vertical-align:top">3. DELIVERY</td>');
            win.document.write('<td class="text-left">' + $deliverytypes + ' upon receipt of confirmation and completion of all approved materials whatever comes later .</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">4. PRICE</td>');
            win.document.write('<td class="text-left">' + $taxtypes + '</td>');
            win.document.write('</tr>');

            //MARC multiselect 08262022
            //win.document.write('<tr>');
            //win.document.write('<td scope="row">5. WARRANTY</td>');
            //win.document.write('<td class="text-left">' + $warrantytypes + '</td>');
            //win.document.write('</tr>');
            for (var i = 0; i < $warrantytypes.length; i++) {
                var val = $warrantytypes[i];
                var txt = $("#WarrantyTypes option[value='" + val + "']").text();
                if (i == 0) {
                    win.document.write('<tr>');
                    win.document.write('<td scope="row">5. WARRANTY</td>');
                    win.document.write('<td class="text-left">' + txt + '</td>');
                    win.document.write('</tr>');
                }
                else {
                    win.document.write('<tr>');
                    win.document.write('<td scope="row"></td>');
                    win.document.write('<td class="text-left">' + txt + '</td>');
                    win.document.write('</tr>');
                }
            }
            //END MARC multiselect 08262022

            win.document.write('<tr>');
            win.document.write('<td scope="row">6. QUOTATION DOES NOT INCLUDE</td>');
            //win.document.write('<td class="text-left text-danger">Other Charges</td>');
            win.document.write('<td class="text-left">Other Charges such as:</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-left text-danger">Permits, Elevator Fee</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-left text-danger">Non Standard Fabric</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-left text-danger">Mobilization Charges outside Metro Manila</td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            //TOTAL
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:16px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="60%"></th>');
            win.document.write('<th width="40%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td class="text-left">If you agree with the above terms and conditions, please signify your conformity by signing on the space provided below, after which the same quotation shall become an official contract.</td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');

            win.document.write('</tbody>');
            win.document.write('</table >');

            win.document.write('</div>');
            win.document.write('</div>');

            //Notes

            //Signatory

            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12">');
            win.document.write('<table class="" width="100%" style="font-size:16px;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<th width="70%"></th>');
            win.document.write('<th width="30%"></th>');
            win.document.write('</tr>');
            win.document.write('</thead>');
            win.document.write('<tbody>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left"></td>');
            win.document.write('</tr>');


            win.document.write('<tr>');
            win.document.write('<td>Very truly yours,</td>');
            win.document.write('<td class="text-left">Conforme:</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold" scope="row" style="vertical-align:top">' + companyname + '</td>');
            win.document.write('<td class="text-left font-weight-bold" style="vertical-align:top">' + clientname + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            //win.document.write('<td><br/></td>');
            win.document.write('<td class="text-left" style="font-size:13px">Signature over printed name / Date</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td><br/></td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="text-left font-weight-bold">_________________________</td>');
            win.document.write('<td class="text-left font-weight-bold">_________________________</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td class="font-weight-bold" scope="row">' + salesagent + '</td>');
            win.document.write('<td class="text-left font-weight-bold">' + clientcontactperson + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">' + salesagentpos + '</td>');
            //win.document.write('<td class="text-left" style="font-size:11px">Signature overprinted name/ date</td>');
            win.document.write('<td scope="row">' + clientcontactpersonpos + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">' + salesagentemail + '</td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">' + salesagentmobile + '</td>');
            win.document.write('<td><br/></td>');
            win.document.write('</tr>');

            if (managerid > 0) {
                win.document.write('<tr>');
                win.document.write('<td><br/></td>');
                win.document.write('<td><br/></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td class="text-left font-weight-bold">_________________________</td>');
                win.document.write('<td class="text-left"></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold" scope="row">' + manager + '</td>');
                win.document.write('<td class="text-left"></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td scope="row">' + managerpos + '</td>');
                win.document.write('<td class="text-left"></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td scope="row">' + manageremail + '</td>');
                win.document.write('<td><br/></td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                win.document.write('<td scope="row">' + managermobile + '</td>');
                win.document.write('<td><br/></td>');
                win.document.write('</tr>');
            }

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
        $('#PrintButton').click(function (e) {
            e.preventDefault();
            printPreview();
        });
        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual();
        });
        //Datatable Add

        var OdataTable = _$OItemsTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [7, 8]
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

        function getquotationotherdetails(id) {
            _quotationService.getRfqOtherDetailsByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $rfqId = result.items[i].quotationId;
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
    });
})();



