
//$(".date-picker").datepicker("update", new Date());
//$('.date-picker').datepicker({
//    locale: abp.localization.currentLanguage.name,
//    format: 'L'
//});
//$('.datetime-picker').datepicker({
//    locale: abp.localization.currentLanguage.name,
//    format: 'L LT'
//});

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

//Image Upload
$('.custom-file-input').on('change', function () {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(fileName);
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#filepreview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#fileinput").change(function () {
    readURL(this);
});//

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
        var _$chargesTableDeleted = $('#ChargesTableDeleted');
        var _$OItemsTable = $('#OItemsTable');
        $("#ProductImage").hide();
        $('#divTable').hide();

        abp.ui.block();
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
                $('#OtherTerms').val(result.otherTerms);
                $('#Others').val(result.others);
                var rdeadlines = new Date(result.deadlines);
                var dline = getFormattedDate(rdeadlines);
                $('#Deadlines').val(dline);

                var hideterms = $("#OtherTerms").val();
                if (hideterms != "") {
                    $("#OtherTerms").show();
                }
                else {
                    $("#OtherTerms").hide();
                }

                $("#OtherTerms").prop("disabled", true);

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
                $('#PackageCost').val(result.packageCost);

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
                        if ($('#ReviseButton2').length) {
                            $('#ReviseButton2').removeAttr('hidden');
                        }
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
                        if ($('#SubmitionButton2').length) {
                            $('#SubmitionButton2').removeAttr('hidden');
                        }
                        break;

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
                getquotationcharges($id);
                getchargetype();
                getcontactperson(result.contactPersonId);
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


                    var $sqcolor = result.items[i].color;
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
                    //console.log(sqiprice + '+' + '(' + sqitotaldiscount + '/' + sqiquantity + ')');
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
                        '<span class="text-danger font-weight-bold">' + $sqigroupname + '</span><br /><a href="#" class="btn-link">' + $sqireference + '</a><br /><small><span class="text-muted">' + $sqiproductname + ' ' + $sqcolor + '</span></small>',

                        //MARC qi_option 07212022
                        $itemtypet,
                        //MARC qi_option 07212022

                        '<span class="text-muted">' + $sqiquantity + '</span>|<span class="text-muted">' + $sqiunit + '</span>',
                        sqiprice,
                        sqitotaldiscount,
                        sqitotal,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + sqiitemno + '"  data-id="' + $sqiproductid + '" data-unitid="' + $sqiunitid + '" data-perdesc="' + $sqiperdescription + '" data-qty="' + $sqiquantity + '" data-price="' + sqiprice + '" data-disc1="' + sqidisc1 + '" data-disc2="' + sqidisc2 + '" data-disc3="' + sqidisc3 + '" data-dtype1="' + parseInt($sqidtype1) + '" data-dtype2="' + parseInt($sqidtype2) + '" data-dtype3="' + parseInt($sqidtype3) + '" data-groupname="' + $sqigroupname + '" data-reference="' + $sqireference + '" data-disctotal="' + sqitotaldiscount +

                        //MARC qi_option 07212022
                        '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '" data-color="' + $sqcolor +
                        //MARC qi_option 07212022

                        '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $sqiid, $sqigroupname, $sqireference

                        //MARC qi_option 07212022
                        , $itemtypev, $sqcolor
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
                                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + ' ' + $sqcolor + '</span>',
                                '<span class="text-muted">' + $sqiquantity + ' ' + $sqiunit + '</span>',
                                sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span><br/><div style="width:150px;height:150px"><img src="' + abp.appPath + 'products/' + $sqiproductid + '/' + $sqiimagename + '" style="object-fit:contain;width:100%;height:100%"/></div>',
                                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + ' ' + $sqcolor + '</span>',
                                '<span class="text-muted">' + $sqiquantity + ' ' + $sqiunit + '</span>',
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
                                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + ' ' + $sqcolor + '</span>',
                                '<span class="text-muted">' + $sqiquantity + ' ' + $sqiunit + ' </span>',
                                sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold">' + $sqireference + '</span>',
                                '<span class="font-weight-bold">' + $sqiproductname + '</span><br/><span class="text-muted" style="white-space: pre-wrap;">' + $sqiproductdescription + ' ' + $sqcolor + '</span>',
                                '<span class="text-muted">' + $sqiquantity + ' ' + $sqiunit + '</span>',
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
                                '<span style="color:blue;">' + $sqiquantity + ' ' + $sqiunit + '</span>',
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
                                '<span style="color:blue;">' + $sqiquantity + ' ' + $sqiunit + '</span>',
                                '<span style="color:blue;">' + sqiprice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span><hr style="height:2px;border-width:0;color:blue;background-color:blue"><span style="color:blue;">' + sqitotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>',
                                '']).draw();
                            dataTablePrint.row.add(['<br/>', '', '', '', '']).draw();

                            dataTablePrintActual.row.add(['<span class="font-weight-bold" style="color:blue;">' + $sqireference + '</span>',
                                '<span class="font-weight-bold" style="color:blue;">' + $sqiproductname + '</span><br/><span style="white-space: pre-wrap; color:blue;">' + $sqiproductdescription + '</span>',
                                '<span style="color:blue;">' + $sqiquantity + ' ' + $sqiunit + '</span>',
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
        }
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
                targets: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
            },
            {
                orderable: false,
                ////MARC qi_option 07212022
                targets: [0, 1, 2, 3, 4, 5, 6, 7]
                //targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
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
                targets: [5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,22]
            },
            {
                orderable: false,
                //MARC qi_option 07212022
                //targets: [0, 1, 2, 3, 4, 5, 6
                targets: [0, 1, 2, 3, 4, 5, 6, 7]                
                //targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
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
                        label: el.code + ' - ' + el.clientName + ' - ' + el.projectName,
                        value: el.id
                    };
                }));
            });
        };
        function getrfq() {
            var $rfqid = $('#RequestId').val();
            _rfqService.getRFQ({ id: $rfqid }).done(function (result) {
                $("#Request").val(result.code); //+ ' - ' + result.client + ' - ' + result.projectName);
                $("#RequestCode").val(result.code);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.clientName);
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
                $('#ContactPersonId').val('');
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
                //$('#ClientEmail').val(result.email);
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
            getproduct();
            getproductunits();
            getproductprice();
        };
        var changeproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            //$("#ProductName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#ProductName").val("");
                $("#ProductCode").val("");
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
            $("#EProductName").val(ui.item.label);
            editgetproduct();
            editgetproductunits();
            editgetproductprice();
        };
        var editchangeproduct = function (event, ui) {
            event.preventDefault();
            $("#EProductId").val(ui.item ? ui.item.value : "");
            $("#EProductName").val(ui.item ? ui.item.label : "");
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
            console.log('computed discount :' + discount);
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;
            //var datacount = dataTable.rows().count();
            //var itemno = datacount + 1;
             //WILSON indexing_insert between 10262022
            if ($('#RowId').val() !== "") {
                var itemno = $('#RowId').val();
            }
            else {
                var datacount = dataTable.rows().count();
                var itemno = datacount + 1;
            }
             //WILSON indexing_insert between 10262022           

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
        $('#UpdatetemButton').click(function (e) {
            e.preventDefault();

            var qty = $('#EQuantity').val();
            var pid = $('#EProductId').val();
            $('span.perror').remove();
            var valid = true;
            if (pid.length <= 0) {
                $('<span class="perror error">This field is required.</span>').
                    insertAfter('#EProductName');
                valid = false;
            }
            if (qty.length <= 0) {

                $('<span class="perror error">This field is required.</span>').
                    insertAfter('#EQuantity');
                valid = false;
            }
            if (!valid) {
                return;
            }

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

            var $disc1 = $('#EDiscount1').val();
            var $disc2 = $('#EDiscount2').val();
            var $disc3 = $('#EDiscount3').val();
            var $dtype1 = $('#EDiscountType1').val();
            var $dtype2 = $('#EDiscountType2').val();
            var $dtype3 = $('#EDiscountType3').val();
            var $perdescription = $('#EPerDescription').val();
            var $EColor = $('#EColor').val();
            var $groupname = $('#EGroupName').val();

            if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $price === '' || $perdescription === '') { return; }

            console.log('orig price :' + $price);
            var tmpPrice = $price.replace(/,/g, '');
            console.log('converted price :' + tmpPrice);
            var price = parseFloat($price.replace(/,/g, ''));
            console.log('initialize price :' + price);
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
            console.log('computed discount :' + discount);
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
            //temp[18] = $groupname;
            //temp[19] = $productcode;

            temp[1] = '<span class="text-danger font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $EColor + '</span></small>';

            //MARC qi_option 07212022
            temp[2] = $itemtypet;
            //MARC qi_option 07212022

            temp[3] = '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>';
            temp[4] = lessprice;
            temp[5] = totaldiscount;
            temp[6] = total;
            temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +
            
                //MARC qi_option 07212022
                '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet +
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
            temp[19] = $groupname;
            temp[20] = $productcode;

            //MARC qi_option 07212022
            temp[21] = $itemtypev;
            temp[22] = $EColor;
            //MARC qi_option 07212022

            $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
            $('#ItemEditModal').modal('hide');
            computeTotal();
        });
        function rearrange() {
            var table = _$itemsTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            for (var i = 0; f.length > i; i++) {
                var temp = table.row(i).data();
                var itemno = i + 1;

                //var $productid = f[i][7];
                //var $unitid = f[i][10];
                //var $perdescription = f[i][8];
                //var $quantity = f[i][9];
                //var $price = f[i][3];
                //var disc1 = f[i][11];
                //var disc2 = f[i][13];
                //var disc3 = f[i][15];
                //var $dtype1 = f[i][12];
                //var $dtype2 = f[i][14];
                //var $dtype3 = f[i][16];
                //var $groupname = f[i][18];
                //var $productcode = f[i][19];
                //var totaldiscount = f[i][4];

                //temp[0] = itemno;
                //temp[6] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                //    //MARC qi_option 07212022
                //    '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet +
                ////MARC qi_option 07212022

                //    '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';

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

                //MARC qi_option 07212022
                var $itemtypev = f[i][21];
                //MARC qi_option 07212022

                var $color = f[i][22];
                temp[0] = itemno;
                temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + $price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                    //MARC qi_option 07212022
                    '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '" data-color="' + $color +
                    //MARC qi_option 07212022

                    '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
            }

        }

        function addnewitem2() {

            //MARC qi_option 07212022
            var $itemtypev = $('#ItemType').val();
            var $itemtypet = $('#ItemType option:selected').text();
            //MARC qi_option 07212022

            //Wilson IndexNo 10272022
            var $indexno = $('#RowId').val();
            //Wilson IndexNo 10272022

            var $no = 0;
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
            var $Color = $('#Color').val();

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
            console.log('computed discount :' + discount);
            var totaldiscount = discount * quantity;
            var lessprice = price - discount;
            var total = lessprice * quantity;

            //var datacount = dataTable.rows().count();
            //var itemno = datacount + 1;

            var dtable = _$itemsTable.DataTable();
            var dform_data = dtable.rows().data();
            var f = dform_data;
            var dtable2 = _$itemsTable.DataTable();
            dtable2.clear().draw();
            var isAdded = false;
            for (var i = 0; f.length > i; i++) {

                var itemno = i + 1;
                console.log("Count" + i);
                if ($indexno == itemno)
                {
                    isAdded = true;
                    dtable.row.add([$indexno,
                        '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $Color + '</span></small>',

                        //MARC qi_option 07212022
                        $itemtypet,
                        //MARC qi_option 07212022

                        '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
                        lessprice,
                        totaldiscount,
                        total,
                        '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $indexno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                        //MARC qi_option 07212022
                        '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '" data-color="' + $Color + 
                        //MARC qi_option 07212022

                        '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                        $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $no, $groupname, $productcode

                        //MARC qi_option 07212022
                        , $itemtypev, $Color
                        //MARC qi_option 07212022
                    ]);

                    var itemno2 = parseInt($indexno) + 1;

                    dtable.row.add([itemno2, f[i][1], f[i][2], f[i][3], f[i][4], f[i][5], f[i][6], f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], f[i][12], f[i][13], f[i][14], f[i][15], f[i][16], f[i][17], f[i][18], f[i][19], f[i][20], f[i][21], f[i][22]
                    ]);
                }
                else
                {
                    //console.log(f[i]);
                    dtable.row.add([itemno, f[i][1], f[i][2], f[i][3], f[i][4], f[i][5], f[i][6], f[i][7], f[i][8], f[i][9], f[i][10], f[i][11], f[i][12], f[i][13], f[i][14], f[i][15], f[i][16], f[i][17], f[i][18], f[i][19], f[i][20], f[i][21], f[i][22]
                    ]);
                } 
            }
            if (!isAdded) {
                dtable.row.add([$indexno,
                    '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $Color + '</span></small>',

                    //MARC qi_option 07212022
                    $itemtypet,
                    //MARC qi_option 07212022

                    '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
                    lessprice,
                    totaldiscount,
                    total,
                    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $indexno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

                    //MARC qi_option 07212022
                    '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet + '" data-color="' + $Color + 
                    //MARC qi_option 07212022

                    '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                    $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $no, $groupname, $productcode


                    //MARC qi_option 07212022
                    , $itemtypev, $Color
                    //MARC qi_option 07212022
                ]);
            }
            dtable.draw();

            rearrange();

            //WILSON indexing_insert between 10262022
            //var dtable = $('#ItemsTable').DataTable();
            //dtable.rows().every(function () {
            //    var Row = this.data();//store every row data in a variable
            //    var index = (Row[0]);//show Row + Cell index
            //    var ItemName = (Row[1]);//show Row + Cell index
            //    var Type = (Row[2]);//show Row + Cell index
            //    var Qty = (Row[3]);//show Row + Cell index
            //    var Price = (Row[4]);//show Row + Cell index
            //    var Total = (Row[5]);//show Row + Cell index
            //    var Action = (Row[6]);//show Row + Cell index
            //    var a7 = (Row[7]);//show Row + Cell index
            //    var a8 = (Row[8]);//show Row + Cell index
            //    var a9 = (Row[9]);//show Row + Cell index
            //    var a10 = (Row[10]);//show Row + Cell index
            //    var a11 = (Row[11]);//show Row + Cell index
            //    var a12 = (Row[12]);//show Row + Cell index
            //    var a13 = (Row[13]);//show Row + Cell index
            //    var a14 = (Row[14]);//show Row + Cell index
            //    var a15 = (Row[15]);//show Row + Cell index
            //    var a16 = (Row[16]);//show Row + Cell index
            //    var a17 = (Row[17]);//show Row + Cell index
            //    var a18 = (Row[18]);//show Row + Cell index
            //    var a19 = (Row[19]);//show Row + Cell index
            //    var a20 = (Row[20]);//show Row + Cell index
            //    var a21 = (Row[21]);//show Row + Cell index
            //    if ($indexno == index)
            //    {                    
            //        dtable.row.add([$indexno,
            //            '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + '</span></small>',

            //            //MARC qi_option 07212022
            //            $itemtypet,
            //            //MARC qi_option 07212022

            //            '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
            //            lessprice,
            //            totaldiscount,
            //            total,
            //            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $indexno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-price="' + lessprice + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount +

            //            //MARC qi_option 07212022
            //            '" data-itemtypev="' + $itemtypev + '" data-itemtypet="' + $itemtypet +
            //            //MARC qi_option 07212022

            //            '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            //            $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), 0, $groupname, $productcode


            //            //MARC qi_option 07212022
            //            , $itemtypev
            //            //MARC qi_option 07212022
            //        ]);
            //    }
            //    else
            //    {
            //        dtable.row.add([index, ItemName, Type, Qty, Price, Total, Action, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21]);
            //    }
            //    //deleteitem(index);
            //});            
            //dtable.draw();
            //rearrange();
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
            abp.notify.success('Item #' + $indexno + ' added!', 'Success');
        }
        function deleteitem(indexno) {
            var dtable = _$itemsTable.DataTable();
            var dform_data = dtable.rows().data();
            var f = dform_data;
            for (var i = 0; f.length > i; i++) {
                if (indexno === i) {
                    console.log(f[i]);
                    dataTableDeleted.row.add([0,
                        '<a href="#" class="btn-link">' + f[i][7] + '</a><br /><small><label class="text-muted">' + f[i][8] + '</label></small>',
                        f[i][2],
                        '<label class="text-muted">' + f[i][10] + '</label>|<label class="text-muted">' + f[i][11] + '</label>',
                        f[i][4],
                        f[i][5],
                        f[i][6],
                        '',
                        f[i][8], f[i][9], f[i][10], f[i][11], parseInt(f[i][12]), f[i][13], parseInt(f[i][14]), f[i][15], parseInt(f[i][16]), f[i][17], f[i][18], f[i][19], f[i][20]

                        //MARC qi_option 07212022
                        , f[i][21], f[i][22]
                    ]).draw();
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
                    //console.log('computetotal items row : ' + index)
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
                    //console.log('computetotal items row : ' + index)
                    //console.log('item type : ' + dataTable.cell(index, 21).data());
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
                console.log("tax 101: " + tax);
            }
            else if (taxcode === 104) {
                nettotal = grandtotal;
                tax = nettotal * (taxrate - 1);
                grandtotal = nettotal * taxrate;
                console.log("tax 104: " + grandtotal);

            }
            else {
                nettotal = grandtotal;
                tax = 0;
            }

            var newgrandtotal = grandtotal + chargestotal;
            console.log("newgrandtotal: " + newgrandtotal);

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
        
        function updateQuotation() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            console.log(String($("#WarrantyTypes").val()));
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
                    "termsAndConditions": formdata.TermsAndConditions,
                    "statusId": formdata.StatusId,
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
                    "tax": formdata.Tax,
                    "grandTotal": formdata.GrandTotal,
                    "otherTerms": formdata.OtherTerms,
                    "packageCost": formdata.PackageCost || 0,
                    "deadlines": formdata.Deadlines
                },
                quotationitems: [],
                quotationcharges: []
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

                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = f[i][0];
                //MARC IndexNo for arrangement fix 09132022

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
                //console.log(f[i][21]);
                item["ItemType"] = f[i][21];
                item["Color"] = f[i][22];
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

                //MARC IndexNo for arrangement fix 09132022
                item["IndexNo"] = g[j][0];
                //MARC IndexNo for arrangement fix 09132022

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
                item["GroupName"] = g[j][19];
                item["Reference"] = g[j][20];

                //MARC qi_option 07212022
                item["ItemType"] = g[j][21];

                item["Color"] = g[j][22];
                item["IsDeleted"] = 1;
                viewData.quotationitems.push(item);
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
                viewData.quotationcharges.push(charge);
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
                viewData.quotationcharges.push(charge);
            }
            abp.message.confirm(
                'Quotation will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        var returnid = _quotationService.updateQuotation(viewData).done(function (res) {
                            abp.message.success('Quotation updated', 'Success');
                            //window.location.href = abp.appPath + 'Quotations/Edit?id=' + result; 
                            if (res.quotation.statusId > 1) {
                                if (res.notif.id > 0) {
                                    srConnection.invoke('sendNotification', res.quotation.code, res.quotation.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server                                    var url = 'Index';
                                }
                                setTimeout(function () {
                                    //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                                    window.location.href = abp.appPath + 'Quotations/Edit?id=' + res.quotation.id;
                                }, 2000);
                            }
                            else {
                                location.reload(true);
                            }
                        }).always(function () {
                            //getquotation();
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

        $('#SubmitionButton2').click(function (e) {
            e.preventDefault();
            var $statusid = $('#StatusId').val();
            if ($statusid === '9') {
                $('#StatusId').val(4);
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
        $('#ReviseButton2').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(9);
            updateQuotation();
        });

        $('#ForOrderButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(6);
            updateQuotation();
        });
        $('#OutBidButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(7);
            updateQuotation();
        });
        $('#CancelButton').click(function (e) {
            e.preventDefault();
            $('#StatusId').val(8);
            updateQuotation();
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
            //MARC qi_option 07212022
            var $itemtypev = $(this).attr("data-itemtypev");
            var $itemtypet = $(this).attr("data-itemtypet");
            //MARC qi_option 07212022

            var discountvalue = parseFloat($disctotal) / parseFloat($qty);
            var origprice = discountvalue + parseFloat($price);

            //MARC qi_option 07212022
            $('#EItemType').val($itemtypev);
            $('#EItemType').selectpicker('refresh');
            //MARC qi_option 07212022

            $('#EProductId').val($productid);
            $('#EIndexNo').text($itemno);
            $('#EQuantity').val($qty);
            $('#EPerDescription').val($perdescription);
            if ($disc1 !== '' || $disc2 !== '' || $disc3 !== '') {
                $('#accordioneditdiscount .collapse').collapse('hide');
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
            deleteitem(dtRow[0].rowIndex - 1);
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
            rearrange();
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
            addnewitem2();
            generateTermsAndConditions();
        });

        $('#AddChargeButton').click(function (e) {
            e.preventDefault();
            addnewcharge();
        });
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

            var $OtherTerms = $("#OtherTerms").val();
            var $paymentterms = $("#PaymentTerms option:selected").html();
            var $deliverytypes = $("#DeliveryTypes option:selected").html();
            var $taxtypes = $("#TaxTypes option:selected").html();
            var $warrantytypes = $("#WarrantyTypes option:selected").html();

            var $row1 = '1. VALIDITY:                                           14 working day(s)';
            var $row2 = '2. TERMS:	                                        ' + $paymentterms + '' + $OtherTerms;
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
            var $OtherTerms = $("#OtherTerms").val();
            var $PackageCost = $("#PackageCost").val();

            var win = window.open('');
            //<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />
            //win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true"><link href="' + abp.appPath + 'css/screen.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath + 'css/print.css" rel="stylesheet" asp-append-version="true" type="text/css" media="print" /><link href="' + abp.appPath +'lib/jquery-print-preview/src/css/print-preview.css" rel="stylesheet" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<html><head><title>' + quotationcode + '</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12"><img src="' + abp.appPath +'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
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
            win.document.write('<td class="font-weight-bold">' + clientname+'</td>');
            win.document.write('<td class="text-right">REF</td>');
            win.document.write('<td class="text-right">' + quotationcode+'</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row"></td>');
            win.document.write('<td class="text-mute" style="font-size:15px;">' + clientaddress + '</td>');
            win.document.write('<td class="text-right">RFQ No</td>');
            win.document.write('<td class="text-right">' + requestcode + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>ATTN</td>');
            win.document.write('<td class="font-weight-bold">' + clientcontactperson+'</td>');
            win.document.write('<td class="text-right">DATE</td>');
            win.document.write('<td class="text-right">' + transdate+'</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td>PROJECT</td>');
            win.document.write('<td>' + clientproject + '</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">TEL No</td>');
            win.document.write('<td class="text-right" style="vertical-align:top;">' + clienttelephone +'</td>');
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

            var taxcode = $("#TaxTypes option:selected").data('code');
            var taxrate = $("#TaxTypes option:selected").data('rate');
            var nettotal2 = 0, tax2 = 0, grandtotal2 = 0;

            if ($PackageCost == 0 | $PackageCost == "" | $PackageCost == null) {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right" hidden>PACKAGE COST</td>');
                win.document.write('<td class="font-weight-bold text-right" hidden>' + $PackageCost + '</td>');
                win.document.write('</tr>');
            }
            else
            {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right" show>PACKAGE COST</td>');
                win.document.write('<td class="font-weight-bold text-right" show>' + $PackageCost + '</td>');
                win.document.write('</tr>');
            }

            if (taxcode === 101) {
                //console.log(preformatFloat(nettotal) + ' + ' + preformatFloat(tax));
                nettotal2 = parseFloat(preformatFloat(nettotal)) + parseFloat(preformatFloat(tax));
                //console.log(currencyFormat(nettotal2));
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
                win.document.write('<td class="font-weight-bold text-right text-danger">' + h[k][1]+'</td>');
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
            win.document.write('<td class="text-left">' + $paymentterms + ' ' + $OtherTerms + '</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row" style="vertical-align:top">3. DELIVERY</td>');
            win.document.write('<td class="text-left">' + $deliverytypes + ' upon receipt of confirmation and completion of all approved materials whatever comes later .</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td scope="row">4. PRICE</td>');
            win.document.write('<td class="text-left">' + $taxtypes+'</td>');
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
            win.document.write('<td class="font-weight-bold" scope="row" style="vertical-align:top">' + companyname+'</td>');
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
            win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath +'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
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
            var $PackageCost = $("#PackageCost").val();
            var $TaxTypeId = $("#TaxTypes").val();

            
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

            if ($PackageCost == 0 | $PackageCost == "" | $PackageCost == null) {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right" hidden>PACKAGE COST</td>');
                win.document.write('<td class="font-weight-bold text-right" hidden>' + $PackageCost + '</td>');
                win.document.write('</tr>');
            }
            else {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right" show>PACKAGE COST</td>');
                win.document.write('<td class="font-weight-bold text-right" show>' + $PackageCost + '</td>');
                win.document.write('</tr>');
            }


            if ($TaxTypeId == 4) {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">Total</td>');
                //var $Total2 = parseFloat(preformatFloat(subtotal)) + parseFloat(preformatFloat(discounttotal));
                var $Total = parseFloat(preformatFloat(nettotal)) + parseFloat(preformatFloat(discounttotal));
                win.document.write('<td class="font-weight-bold text-right">' + currencyFormat($Total) + '</td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                var one = 1;
                var $PecentDiscount = parseFloat(preformatFloat(nettotal)) / parseFloat($Total) - parseFloat(one);
                var $Percent = $PecentDiscount * 100;
                var $getpositive = $Percent * -1;
                //var round = Math.trunc($getpositive);
                var round = Math.round($getpositive);
                win.document.write('<td class="font-weight-bold text-right">SPECIAL DISCOUNT ' + round + '%</td>');
                //win.document.write('<td class="font-weight-bold text-right">DISCOUNT</td>');
                win.document.write('<td class="font-weight-bold text-right">' + discounttotal + '</td>');
                win.document.write('</tr>');
            }
            else
            {
                win.document.write('<tr>');
                win.document.write('<td class="font-weight-bold text-right">Total</td>');
                var $Total = parseFloat(preformatFloat(subtotal)) + parseFloat(preformatFloat(discounttotal));
                win.document.write('<td class="font-weight-bold text-right">' + currencyFormat($Total) + '</td>');
                win.document.write('</tr>');

                win.document.write('<tr>');
                var one = 1;
                var $PecentDiscount = parseFloat(preformatFloat(subtotal)) / parseFloat($Total) - parseFloat(one);
                var $Percent = $PecentDiscount * 100;
                var $getpositive = $Percent * -1;
                var round = Math.round($getpositive);
                win.document.write('<td class="font-weight-bold text-right">SPECIAL DISCOUNT ' + round + '%</td>');
                win.document.write('<td class="font-weight-bold text-right">' + discounttotal + '</td>');
                win.document.write('</tr>');

            }


            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">subtotal</td>');
            //win.document.write('<td class="font-weight-bold text-right">' + subtotal + '</td>');
            //win.document.write('</tr>');

            //win.document.write('<tr>');
            //win.document.write('<td class="font-weight-bold text-right">ADDITIONAL 12% VAT</td>');
            //win.document.write('<td class="font-weight-bold text-right">'+tax+'</td>');
            //win.document.write('</tr>');

            var taxcode = $("#TaxTypes option:selected").data('code');
            var taxrate = $("#TaxTypes option:selected").data('rate');
            var nettotal2 = 0, tax2 = 0, grandtotal2 = 0;

           

            if (taxcode === 101) {
                //console.log(preformatFloat(nettotal) + ' + ' + preformatFloat(tax));
                nettotal2 = parseFloat(preformatFloat(nettotal)) + parseFloat(preformatFloat(tax));
                //console.log(currencyFormat(nettotal2));
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
            var $OtherTerms = $("#OtherTerms").val();
            var $deliverytypes = $("#DeliveryTypes option:selected").html();
            var $taxtypes = $("#TaxTypes option:selected").html();
            //MARC multiselect 08262022
            //var $warrantytypes = $("#WarrantyTypes option:selected").html();
            var $warrantytypes = $("#WarrantyTypes").val();
            //END MARC multiselect 08262022

            win.document.write('<tr>');
            win.document.write('<td scope="row">2. TERMS OF PAYMENT</td>');
            win.document.write('<td class="text-left">' + $paymentterms + ' ' + $OtherTerms + '</td>');
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

        var handleRenderjQueryFileUpload = function () {
            $('#fileupload').fileupload({
                url: abp.appPath + 'quotations/',
                disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
                maxFileSize: 999000,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
            });
            $('#fileupload').bind('fileuploadchange', function (e, data) {
                $('#fileupload .empty-row').hide();
            });
            $('#fileupload').bind('fileuploadfail', function (e, data) {
                if (data.errorThrown === 'abort') {
                    if ($('#fileupload .files tr').not('.empty-row').length === 1) {
                        $('#fileupload .empty-row').show();
                    }
                }
            });

            if ($.support.cors) {
                $.ajax({
                    url: abp.appPath + 'quotations/',
                    type: 'HEAD'
                }).fail(function () {
                    var alert = '<div class="alert alert-danger m-b-0 m-t-15">Upload server currently unavailable - ' + new Date() + '</div>';
                    $('#fileupload #error-msg').html(alert);
                });
            }
        };
        handleRenderjQueryFileUpload();
        //Datatable Add

        $('#DocumentButton').click(function (e) {
            e.preventDefault();
            var $id = $("#Id").val();
            var $code = $("#Code").val();
            //$("#DocReferenceName").val($code);
            //$("#DocReferenceId").val($id);
            $.ajax({
                url: abp.appPath + 'Documents/DocumentModal?refid=' + $id + '&refname=' + $code + '&reference=Quotation',
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    //console.log(content);
                    $('#DocumentModal div.modal-content').html(content);
                    $('#DocumentModal').modal('show');
                },
                error: function (e) { }
            });
            //docGetAll();
            //$('#DocumentModal').modal('show');
        });

        $('.custom-file-input').on('change', function () {
            let fileName = $(this).val().split('\\').pop();
            $(this).next('.custom-file-label').addClass("selected").html(fileName);
        });
        
        var _docService = abp.services.app.documentService;
        var _$docform = $('form[name=DocumentForm]');
        var _$doctable = $('#DocumentsTable');

        var docDataTable = _$doctable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _docService.getDocumentsFiltered,
                inputFilter: function () {
                    var $c = $('#Id').val();
                    var $r = "Quotation";
                    var $s = '';
                    return {
                        id: 0,
                        reference: $r,
                        referenceId: $c,
                        filter: $s
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    targets: 1,
                    data: "fileName"
                },
                {
                    targets: 2,
                    data: "fileExtension"
                }
                ,
                {
                    targets: 3,
                    data: "description"
                },
                {
                    targets: 4,
                    data: "referenceName"
                },
                {
                    targets: 5,
                    data: "creationTime",
                    render: function (data) {
                        var tt = new Date(data);
                        var ret = getFormattedDate(tt);
                        if (ret === "01/01/1900") {
                            return 'n/a';
                        }
                        else {
                            return ret;
                        }
                    }
                },
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id", fileName: "fileName", fileExtension: "fileExtension", filePath: "filePath" },
                    "render": function (data) {
                        return '<a id="download-doc" title="edit" href="#" class="download-doc" data-doc-id="' + data.id + '" data-doc-filename="' + data.fileName + '" data-doc-fileextension="' + data.fileExtension + '" data-doc-filepath="' + data.filePath + '"><i class="fa fa-download"></i></a>'; //"|<a id="delete-cperson" title="delete" href="#" class="delete-cperson" data-doc-id="' + data.id + '" data-doc-name="' + data.fileName + '"><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        });

        function docGetAll() {
            docDataTable.ajax.reload();
        }

        _$doctable.on('click', 'a.download-doc', function (e) {
            var id = $(this).attr("data-doc-id");
            var name = $(this).attr("data-doc-filename");
            var extension = $(this).attr("data-doc-fileextension");
            var path = $(this).attr("data-doc-filepath");
            var cname = $('#ClientName').val();
            e.preventDefault();

            //var filepath = path + '\\' + name + '.' + extension;
            ////location.href = filepath;

            //var link = document.createElement('a');
            //link.href = filepath;
            //link.download = filepath.substr(filepath.lastIndexOf('/') + 1);
            //link.click();

            //$.ajax({
            //    url: abp.appPath + 'Documents/Download?filePath=' + $filePath,
            //    type: 'POST',
            //    processData: false,
            //    contentType: false,
            //    success: function (res) {
            //        var docu = {
            //            "referenceId": refid,
            //            "reference": ref,
            //            "description": desc,
            //            "fileName": res.fileName,
            //            "fileExtension": res.fileExtension,
            //            "filePath": res.filePath
            //        };
            //        _docService.CreateDocument(docu).done(function () {
            //            abp.message.success('File Uploaded', 'Success');
            //            docGetAll();
            //        }).always(function () {
            //            abp.ui.clearBusy(_$docform);
            //        });
            //    },
            //    error: function (e) {
            //        abp.message.error('File upload failed!', 'Error');
            //    }
            //});
            //console.log(abp.appPath);
             $.ajax({
                 url: abp.appPath + 'Documents/DownloadFile?id=' + id,
                type: 'POST',
                processData: false,
                contentType: false,
                 success: function (res) {
                 },
                error: function (e) {
                    abp.message.error('File download failed!', 'Error');
                }
            });
            //window.location = abp.appPath + '/Documents/DownloadFile?id=' + id;
        });

        //$('#fileinput').on('change', function () {
        //    var x = document.getElementById("fileinput");
        //    $("#btnStartUploadfile").show();
        //    $("#btnclose").show();
        //    var txt = "";
        //    if ('files' in x) {
        //        if (x.files.length == 0) {
        //            txt = "Select one or more files.";
        //        } else {
        //            for (var i = 0; i < x.files.length; i++) {
        //                txt += "<br><strong>" + (i + 1) + ". file</strong><br>";
        //                var file = x.files[i];
        //                if ('name' in file) {
        //                    txt += "name: " + file.name + " / size: " + file.size + " bytes <br>";
        //                }
        //            }
        //        }
        //    }
        //    else {
        //        if (x.value == "") {
        //            txt += "Select one or more files.";
        //        } else {
        //            txt += "The files property is not supported by your browser!";
        //            txt += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
        //        }
        //    }
        //    document.getElementById("demo").innerHTML = txt;
        //});

        function saveFile() {

            var doc = _$docform.serializeFormToObject(); //serializeFormToObject is defined in main.js
            var $ref = "Quotation";
            var $refid = $("#Id").val();
            var $desc = $("#DocNotes").val();

            var formData = new FormData();
            formData.append('file', $('#fileinput')[0].files[0]);

            abp.message.confirm(
                'New file will be uploaded.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$docform);
                        $.ajax({
                            url: abp.appPath + 'Documents/UploadFile?reference=' + $ref + '&referenceid=' + $refid,
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (res) {
                                //console.log(typeof res);
                                var obj = res.result;
                                //console.log(obj);
                                var $name = obj.fileName;
                                var $ext = obj.fileExtension;
                                var $path = obj.filePath;
                                var docu = {
                                    "referenceId": $refid,
                                    "reference": $ref,
                                    "description": $desc,
                                    "fileName": $name,
                                    "fileExtension": $ext,
                                    "filePath": $path
                                };
                                //console.log(docu);
                                _docService.createDocument(docu).done(function () {
                                    abp.message.success('File Uploaded', 'Success');
                                    docGetAll();
                                }).always(function () {
                                    abp.ui.clearBusy(_$docform);
                                });
                            },
                            error: function (e) {
                                abp.message.error('File upload failed!', 'Error');
                            }
                        });
                    }
                }
            );
        }

        $('#UploadButton').click(function (e) {
            e.preventDefault();
            saveFile();
        });
        $("#Color").keyup(function (event) {
            this.value = this.value.toUpperCase();
        });

        function isValid(str) {
            return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }
        $("#EColor").keypress(function (event) {
            var character = String.fromCharCode(event.keyCode);
            return isValid(character);
        });
        $("#EColor").keyup(function (event) {
            this.value = this.value.toUpperCase();
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
            _quotationService.delete({
                id: $id
            }).done(function () {
                $.ajax({
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    success: function () { },
                    error: function (e) { }
                });

                OdataTable.clear().draw();
                getquotationotherdetails($('#Id').val());
                //rearrange2();
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
                "quotationId": formdata.Id,
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
                        _quotationService.createRFQOtherDetails(items3).done(function () {
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
                            getquotationotherdetails($('#Id').val());
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
                "quotationId": formdata.Id,
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
                        _quotationService.updateRFQOtherDetails(items4).done(function () {
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
                            getquotationotherdetails($('#Id').val());

                        });
                    }
                }
            );

        }
    });
})();



