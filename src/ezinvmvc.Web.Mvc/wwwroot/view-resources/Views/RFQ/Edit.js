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
    //var _clientService = abp.services.app.clientService;
    //var _provService = abp.services.app.provinceService;
    var _leadService = abp.services.app.leadService;
    var _cpersonService = abp.services.app.contactPersonService;
    var _$form = $('form[name=RfqForm]');
    var _$itemsTable = $('#ItemsTable');
    var _$itemsTableDeleted = $('#ItemsTableDeleted');
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
        _rfqService.getRFQ({ id: $id }).done(function (result) {
            //$('#Id').val(result.id);
            $('#Prefix').val(result.prefix);
            $('#Code').val(result.code);
            var rtransactiontime = new Date(result.transactionTime);
            var tt = getFormattedDate(rtransactiontime);
            $('#TransactionTime').val(tt);
            $('#RevisionNo').val(result.revisionNo);
            $('#RefNo').val(result.code + '-' + result.revisionNo);
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

            //alert(result.statusId);

            switch (result.statusId) {
                case 1:
                    $('#StatusBadge').addClass('badge badge-secondary');


                    if ($('#UpdateRfqButton').length) {
                        $('#UpdateRfqButton').removeAttr('hidden');
                    }
                    if ($('#SubmitButton').length) {
                        $('#SubmitButton').removeAttr('hidden');
                    }
                    break;
                case 2:
                    $('#StatusBadge').addClass('badge badge-success');
                    if ($('#ReviseButton').length) {
                        $('#ReviseButton').removeAttr('hidden');
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
                    $("#OAddItemButton").hide();
                    break;
                default:
                    $('#StatusBadge').addClass('badge badge-secondary');
                    $("#OAddItemButton").hide();
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
        });


    };

    function getrfqdetails(id) {
        _rfqService.getRfqDetailsByParentId({ id: id }).done(function (result) {

            for (var i = 0; i < result.items.length; i++) {
                var $soid = result.items[i].id;               
                var $soiproductid = result.items[i].productId;
                var $soiproductcode = result.items[i].productCode;
                var $soiproductname = result.items[i].rfqCode;
                var $sodescription = result.items[i].description;
                var $soindexno = result.items[i].indexno;
                var $soiunitid = result.items[i].unitId;
                var $soiunit = result.items[i].unit;
                var $soiquantity = result.items[i].qty;
                var $soiprice = result.items[i].unitPrice
                var $sogroupname = result.items[i].groupName;
                var $sorFQCode = result.items[i].rfqCode;

                var $socolor = result.items[i].color;
                var $soitemtype = result.items[i].itemType

                if ($soitemtype == 1) {
                    var typeitem = "Actual";
                }
                else {
                    var typeitem = "Option";
                }
                var soqiprice = parseFloat($soiprice);

                var $sodisc1 = result.items[i].disc1;
                var $sodisc2= result.items[i].disc2;
                var $sodisc3 = result.items[i].disc3;

                var $sodiscType1 = result.items[i].discType1;
                var $sodiscType2 = result.items[i].discType2;
                var $sodiscType3 = result.items[i].discType3;
                var $sodiscTotal = currencyFormat(result.items[i].discTotal);
                var $sototal = currencyFormat(result.items[i].total);


                var datacount = dataTable.rows().count();
                var itemno = datacount + 1;

                //var $soidisc1 = 0;
                //var $soidisc2 = 0;
                //var $soidisc3 = 0;
                //var $soidtype1 = "0";
                //var $soidtype2 = "0";
                //var $soidtype3 = "0";
                //var $soiperdescription = result.items[i].description;

                //var soiprice = parseFloat($soiprice);
                //var soiquantity = parseFloat($soiquantity);

                //var soidisc1 = 0;
                //var soidisc2 = 0;
                //var soidisc3 = 0;
                //if ($soidisc1 !== "") {
                //    soidisc1 = parseFloat($soidisc1);
                //}
                //if ($soidisc2 !== "") {
                //    soidisc2 = parseFloat($soidisc2);
                //}
                //if ($soidisc3 !== "") {
                //    soidisc3 = parseFloat($soidisc3);
                //}

                //var soidiscount = priceDiscount(soiprice, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3));
                //var soitotaldiscount = soidiscount * soiquantity;
                //var soilessprice = soiprice - soidiscount;
                //var soitotal = soilessprice * soiquantity;
                //var soidatacount = dataTable.rows().count();
                //var soiitemno = soidatacount + 1;

                //dataTable.row.add([itemno,
                //    //'<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><small><label class="text-muted">' + $soiperdescription + '</label></small>',
                //    //'<label class="text-muted">' + $soiquantity + '</label>',
                //    //'<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-productname="' + $soiproductname + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-groupname="' + $groupname + '" data-reference="' + $soiproductcode + '" data-soid="' + $soiid + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                //    //$soiproductid, $soiperdescription, $soiquantity, $soiunitid, $soiid, $groupname, $soiproductname

                //    '<span class="text-warning font-weight-bold">' + $sogroupname + '</span><br /><a href="#" class="btn-link">' + $soiproductcode + '</a><br /><small><span class="text-muted">' + $sorFQCode + ' ' + $socolor + '</span></small>',
                //    $soitemtype,
                //    '<span class="text-muted">' + $soiquantity + '</span>|<span class="text-muted">' + $soiunit + '</span>',
                //    $soiprice,
                //    $sodiscTotal,
                //    $sototal,
                //    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $soindexno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiproductname + '" data-qty="' + $soiquantity + '" data-groupname="' + $sogroupname + '" data-reference="' + $soiproductcode + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                //    //MARC --WALA KA ULIT DISCOUNTS
                //    //$productid, $perdescription, $quantity, $unitid, $groupname, $productname
                //    $soiproductid, $soiproductname, $soiquantity, $soiunitid, $sodisc1, parseInt($sodiscType1), $sodisc2, parseInt($sodiscType2), $sodisc3, parseInt($sodiscType3), $sogroupname, $soiproductcode, $soitemtype, $socolor, $soiid
                //]).draw();
                dataTable.row.add([itemno,
                    '<span class="text-warning font-weight-bold">' + $sogroupname + '</span><br /><a href="#" class="btn-link">' + $soiproductcode + '</a><br /><small><span class="text-muted">' + $sorFQCode + ' ' + $socolor + '</span><br /><small><span class="text-muted">' + $sodescription + '</span></small>',
                    typeitem,
                    '<span class="text-muted">' + $soiquantity + '</span> | <span class="text-muted">' + $soiunit + '</span>',
                    soqiprice,
                    $sodiscTotal,
                    $sototal,
                    '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiproductname + '" data-qty="' + $soiquantity + '" data-groupname="' + $sogroupname + '" data-reference="' + $soiproductcode + '" data-price="' + soqiprice + '"  data-disctotal="' + $sodiscTotal + '" data-color="' + $socolor + '" data-desc="' + $sodescription + '" data-disc1="' + $sodisc1 + '" data-disc2="' + $sodisc2 + '" data-disc3="' + $sodisc3 + '" data-dtype1="' + parseInt($sodiscType1) + '" data-dtype2="' + parseInt($sodiscType2) + '" data-dtype3="' + parseInt($sodiscType3) + '" data-soid="' + $soid + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                    $soiproductid, $sodescription, $soiquantity, $soiunitid, $sodisc1, parseInt($sodiscType1), $sodisc2, parseInt($sodiscType2), $sodisc3, parseInt($sodiscType3), $sogroupname, $soiproductcode, $soitemtype, $socolor, $soid
                ]).draw();
            }
        });
        getrfqotherdetails(id);
    };

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
            targets: [7, 8]
        },
        {
            orderable: true,
            "autoWidth": false,
            targets: [0, 1, 2, 3, 4, 5, 6]
        },
        {
            className: 'text-center',
            targets: [5]
        }
        ]
    });

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
            //rearrange2();
        });
    }

    $('#OUpdateItemButton').click(function (e) {
        e.preventDefault();
        //var $Oid = $('#Oid').val();
        //var $OrfqId = $('#OrfqId').val();
        //var $Oitemno = parseInt($('#Oitemno').val()) - 1;
        //var $OName = $('#OName').val();
        //var $OArea = $('#OArea').val();
        //var $ODescription = $('#ODescription').val();
        //var $ODimension = $('#ODimension').val();
        //var $OQuantity = $("#OQuantity").val();

        //var table = _$OItemsTable.DataTable();
        //var temp = table.row($Oitemno).data();

        ////temp[1] = $Oitemno;

        //temp[1] = $OName;
        //temp[2] = $OArea;
        //temp[3] = $ODescription;
        //temp[4] = $ODimension;
        //temp[5] = $OQuantity;
        //temp[6] = '<a id="edit-uitem" class="edit-uitem" title="edit" href="#" data-uid="' + $Oid + '" data-urfqId="' + $OrfqId + '" data-uitemno="' + $('#Oitemno').val() + '"  data-uname="' + $OName + '" data-uarea="' + $OArea + '" data-udesc="' + $ODescription + '" data-udimension="' + $ODimension + '"  data-uqty="' + $OQuantity + '" ><i class="fa fa-edit"></i></a>&nbsp;|&nbsp;<a id="delete-Oitem" class="delete-Oitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        //temp[7] = $Oid;
        //temp[8] = $OrfqId;
        //$('#OItemsTable').dataTable().fnUpdate(temp, $Oitemno, undefined, false);
        //$("#OUpdateItemButton").hide();
        //$("#OCancelItemButton").hide();
        //$("#OAddItemButton").show();

        //$('#Oitemno').val("0");
        //$('#OName').val("");
        //$('#OArea').val("");
        //$('#ODescription').val("");
        //$('#ODimension').val("");
        //$("#OQuantity").val("");
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
        var $filter = $("#Id").val() + '|' + request.term;
        //if (!abp.auth.isGranted("CRM.Leads.AllAccounts")) {
            var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
        //    console.log(empid);
        //    $filter = $filter + '|' + empid;
        //}
        _leadService.getLeadsforRFQforEdit({ filter: $filter }).done(function (result) {
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
        if ($clientid > 0) {
            _cpersonService.getContactPersonsFiltered({ id: 0, reference: "Client", referenceId: $clientid, filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.fullName,
                        value: el.id
                    };
                }));
            });
        }
        else {
            abp.message.warn('Please select Client first');
        }
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
        getcontactperson();
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
        //$("#ProductName").val(ui.item ? ui.item.label : "");
        //$("#PerDescription").val(ui.item ? ui.item.label : "");
        getproduct();
        getproductunits();
        getproductprice();
        return false;
    };
    var focusproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item.value);
        $("#ProductName").val(ui.item.label);
        //$("#PerDescription").val(ui.item.label);
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
            //if (result.imageName !== null && result.imageName !== '') {
            //    $("#EProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
            //    $("#EProductImage").show();
            //}
            //else {
            //    $("#EProductImage").hide();
            //}
        });
    }
    function editclickedgetproduct() {
        var $productid = $('#EProductId').val();
        _productService.getProduct({ id: $productid }).done(function (result) {
            $('#EProductCode').val(result.code);
            $('#EProductName').val(result.name);

            //$('#EPerDescription').val(result.description);
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
        //$("#soid").val("");
        var $unitid = $('#EUnits').val();
        var $pricingtypeid = $('#EPricingTypes').val();
        var $productid = $('#EProductId').val();
        if ($unitid === null) {
            $unitid = 0;
        }
        if ($pricingtypeid === null) {
            $pricingtypeid = 0;
        }
        _productPriceService.getProductPrices({ productId: $productid, pricingTypeId: $pricingtypeid, unitId: $unitid }).done(function (result)
        {
            for (var i = 0; i < result.items.length; i++)
            {
                var price = currencyFormat(result.items[i].unitPrice);
                $("#EPrice").val(result.items[i].unitPrice ? price : "");
            }
        });
    }
    var editselectproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item ? ui.item.value : "");
        //$("#EProductName").val(ui.item ? ui.item.label : "");
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
            targets: [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
        },
        {
            orderable: false,
            //targets: [0, 1, 2, [3, 4, 5, 6]
            //MARC --3 NA YUNG ACTION COLUMN
            targets: [0, 1, 2, 6]
            //targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
        {
            className: 'text-center',
            targets: [7]
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
            targets: [5,8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
        },
        {
            orderable: false,
            //targets: [0, 1, 2, [3, 4, 5, 6]
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [0, 1, 2, 6]
            targets: [0, 1, 2, 3, 4, 6, 7]
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
            targets: [7]
        }
        ]
    });


    $("#GroupName").keypress(function (event)
    {
        var str = $('#GroupName').val();
        var regex = /['@<>;:"|%&*+=!]/gi;

        if (regex.test(str) == true) {
            abp.message.warn('Please Remove Special Character on GroupName', 'Special Character');
        }

        return isValid;
    });
    function addnewitem() {

        var str = $('#GroupName').val();
        var regex = /['@<>;:"|%&*+=!]/gi;

        if (regex.test(str) == true) {
            abp.message.warn('Please Remove Special Character on GroupName', 'Special Character');
        }

        var $soid = 0;
        var $productid = $('#ProductId').val();
        var $productcode = $('#ProductCode').val();
        var $productname = $('#ProductName').val();
        var $unitid = $('#Units').val();
        var $unit = $("#Units option:selected").html();       
        var $quantity = $('#Quantity').val();
        var $groupname = $('#GroupName').val();
        var $color = $('#Color').val();
        var $itemtypev = $('#ItemType').val();
        var $itemtypet = $('#ItemType option:selected').text();
        var $price = $('#Price').val();
        var $disc1 = $('#Discount1').val();
        var $disc2 = $('#Discount2').val();
        var $disc3 = $('#Discount3').val();
        var $dtype1 = $('#DiscountType1').val();
        var $dtype2 = $('#DiscountType2').val();
        var $dtype3 = $('#DiscountType3').val();
        var $perdescription = $('#PerDescription').val();
        if ($perdescription === ''|| $quantity === '') {
            return;
        }

        //MARC --WALA KA ULIT PRICE
        var price = parseFloat($price.replace(/,/g, ''));
        var quantity = parseFloat($quantity);

        //MARC --WALA KA ULIT DISCOUNTS
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

        //MARC --WALA KA ULIT DISCOUNTS AT PRICE
        var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
        var totaldiscount = discount * quantity;
        var lessprice = price - discount;
        var total = lessprice * quantity;

        var datacount = dataTable.rows().count();
        var itemno = datacount + 1;
        //var $rowid = "id_row_" + itemno;
        //var $rowcode = "code_row_" + itemno;
        //var $rowname = "name_row_" + itemno;
        //var $rowquantity = "quantity_row_" + itemno;
        //var $rowunit = "unit_row_" + itemno;
        dataTable.row.add([itemno,
            //'<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><small><label name="' + $rowname + '" class="text-muted">' + $perdescription + '</label></small>',
            //'<label name="' + $rowquantity + '" class="text-muted">' + $quantity + '</label>',
            //'<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-productname="' + $productname + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            //$productid, $perdescription, $quantity, $unitid, 0, $groupname, $productname

            '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $color + '</span></small>',
            $itemtypet,
            '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
            lessprice,
            totaldiscount,
            total,
            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-desc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-price="' + $price + '" data-disctotal="' + totaldiscount + '" data-color="' + $color + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '"  data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-soid="' + $soid + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $groupname, $productcode, $itemtypev, $color, $soid
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
                deletedataTabled.row.add([f[i][0],
                    //'<a href="#" class="btn-link">' + f[i][10] + '</a><br /><small><label class="text-muted">' + f[i][5] + '</label></small>',
                    //'<label class="text-muted">' + f[i][6] + '</label>',
                    //'',
                    //f[i][4], f[i][5], f[i][6], f[i][7], f[i][8], f[i][9], f[i][10] 

                    '<span class="text-warning font-weight-bold">' + f[i][18] + '</span><br /><a href="#" class="btn-link">' + f[i][19] + '</a><br /><small><span class="text-muted">' + f[i][9] + ' ' + f[i][21] + '</span></small>',
                    f[i][2],
                    '<span class="text-muted">' + f[i][3] + '</span>',
                    f[i][4],
                    f[i][5],
                    f[i][6],
                    f[i][7],
                    f[i][8],
                    f[i][9],
                    f[i][10],
                    f[i][11],
                    f[i][12],
                    f[i][13],
                    f[i][14],
                    f[i][15],
                    f[i][16],
                    f[i][17],
                    f[i][18],
                    f[i][19],
                    f[i][20],
                    f[i][21],
                    f[i][22]
                    //$productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $groupname, $productcode, $itemtypev, $color, $soiid

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
        rearrange();
    });


    _$itemsTable.on('click', 'a.edit-item', function (e) {
        e.preventDefault();
        var $itemnofiile = $(this).attr("data-itemno");
        var $productid = $(this).attr("data-id");
        var $qty = $(this).attr("data-qty");
        var $unitid = $(this).attr("data-unitid");
        var $perdescription = $(this).attr("data-perdesc");
        var $productname = $(this).attr("data-productname");
        //alert($perdescription);
        var $soid = $(this).attr("data-soid");
        var $SOprice = $(this).attr("data-price");
        var $disc1 = $(this).attr("data-disc1");
        var $disc2 = $(this).attr("data-disc2");
        var $disc3 = $(this).attr("data-disc3");
        var $dtype1 = $(this).attr("data-dtype1");
        var $dtype2 = $(this).attr("data-dtype2");
        var $dtype3 = $(this).attr("data-dtype3");
        var $disctotal = $(this).attr("data-disctotal");
        var $reference = $(this).attr("data-reference");
        var $groupname = $(this).attr("data-groupname");
        var $socolor = $(this).attr("data-color");
        var $sodescription = $(this).attr("data-desc");
        console.log("price :" + $SOprice);
        console.log("color :" + $socolor);
        //if ($disctotal = "0.00") {
        //    var $disctotal2 = parseFloat($disctotal);
        //}
        //else {
        //    var $disctotal2 = parseFloat($disctotal.replace(/,/g, ''));
        //}
        var quantity2 = parseFloat($qty);

        var discountvalue = parseFloat($disctotal) / parseFloat(quantity2);
        var origprice = discountvalue + parseFloat($SOprice);
       
        $('#EPerDescription').val($sodescription);
        $('#EColor').val($socolor);
        $('#EProductId').val($productid);
        $('#EIndexNo').text($itemnofiile);
        $('#EQuantity').val($qty);
        //$('#EPerDescription').val($perdescription);
        $('#soid').val($soid);

        if ($disc1 !== '' || $disc2 !== '' || $disc3 !== '') {
            $('#accordioneditdiscount .collapse').collapse('show');
        }
        $('#EDiscount1').val($disc1);
        $('#EDiscount2').val($disc2);
        $('#EDiscount3').val($disc3);

        $('#EDiscountType1').val($dtype1);
        $('#EDiscountType2').val($dtype2);
        $('#EDiscountType3').val($dtype3);

        editclickedgetproduct();
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
        //var $productid ="0";
        //var $productcode = "0";
        //var $productname = "0";
        //var $unitid = "0";
        //var $unit = "0";
        var $eColor = $('#EColor').val();
        var $Texttypetext = $('#typeitem').val();
        var $typetext = $("#typeitem option:selected").text();
        var $EPrice = $('#EPrice').val();

        var $quantity = $('#EQuantity').val();
        var $soid = $('#soid').val();
        //var $price = $('#EPrice').val();

        var $disc1 = $('#EDiscount1').val();
        var $disc2 = $('#EDiscount2').val();
        var $disc3 = $('#EDiscount3').val();
        var $dtype1 = $('#EDiscountType1').val();
        var $dtype2 = $('#EDiscountType2').val();
        var $dtype3 = $('#EDiscountType3').val();
        var $perdescription = $('#EPerDescription').val();
        var $groupname = $('#EGroupName').val();
        var $sodescription = $('#EPerDescription').val();
        //if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '' || $perdescription === '') { return; }
        if ( $quantity === '' || $perdescription === '') { return; }
        
        var price = parseFloat($EPrice.replace(/,/g, ''));
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
        //temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><small><span class="text-muted">' + $perdescription + '</span></small>';
        //temp[2] = '<span class="text-muted">' + $quantity + '</span>';
        //temp[3] = lessprice;
        //temp[4] = totaldiscount;
        //temp[5] = total;
        //temp[3] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-productname="' + $productname + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        //temp[4] = $productid;
        //temp[5] = $perdescription;
        //temp[6] = $quantity;
        //temp[7] = $unitid;
        //temp[11] = disc1;
        //temp[12] = parseInt($dtype1);
        //temp[13] = disc2;
        //temp[14] = parseInt($dtype2);
        //temp[15] = disc3;
        ////temp[16] = parseInt($dtype3);
        //temp[8] = $soid;
        //temp[9] = $groupname;
        //temp[10] = $productname;
        ////temp[19] = $productcode;
        //$('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
        //$('#ItemEditModal').modal('hide');
        //computeTotal();


        temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $eColor + '</span><br /><small><span class="text-muted">' + $sodescription + '</span></small>',
        temp[2] = $typetext;
        temp[3] = '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>';
        temp[4] = lessprice;
        temp[5] = currencyFormat(totaldiscount);
        temp[6] = currencyFormat(total);
        temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-productname="' + $productname + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-price="' + lessprice + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '" data-color="' + $eColor + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-soid="' + $soid + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        temp[8] = $productid;
        temp[9] = $perdescription;
        temp[10] = $quantity;
        temp[11] = $unitid;
        temp[13] = parseInt($dtype1);
        temp[12] = disc1;
        temp[15] = parseInt($dtype2);
        temp[14] = disc2;
        temp[17] = parseInt($dtype3);
        temp[16] = disc3;
        temp[18] = $groupname;
        temp[19] = $productcode;
        temp[20] = $Texttypetext;
        temp[21] = $eColor;
        temp[22] = $soid;
        $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
        $('#ItemEditModal').modal('hide');
        rearrange();
    });
    function rearrange() {
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {
            var temp = table.row(i).data();
            var itemno = i + 1;

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
            var $soid = f[i][22];
            var $groupname = f[i][18];
            var $color = f[i][21];
            var totaldiscount = f[i][5];

            temp[0] = itemno;
            temp[1] = f[i][1];
            temp[2] = f[i][2];
            temp[3] = f[i][3];
            temp[4] = f[i][4];
            temp[5] = f[i][5];
            temp[6] = f[i][6];
            temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-desc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productid + '" data-price="' + $price + '" data-disctotal="' + totaldiscount + '" data-color="' + $color + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '"   data-dtype1="' + parseInt($dtype1) + '" data-dtype2="' + parseInt($dtype2) + '" data-dtype3="' + parseInt($dtype3) + '" data-soid="' + $soid + '"><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[8] = f[i][8];
            temp[9] = f[i][9];
            temp[10] = f[i][10];
            temp[11] = f[i][11];
            temp[12] = f[i][12];
            temp[13] = f[i][13];
            temp[14] = f[i][14];
            temp[15] = f[i][15];
            temp[16] = f[i][16];
            temp[17] = f[i][17];
            temp[18] = f[i][18];
            temp[19] = f[i][19];
            temp[20] = f[i][20];
            temp[21] = f[i][21];
            temp[22] = f[i][22];


            $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
        }
    }
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
                ////"clientId": formdatentId,
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
                "revisionNo": formdata.RevisionNo,
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
                "remarks": formdata.Remarks,
                "statusId": formdata.StatusId,
                "deadlines": formdata.Deadlines,
                "others": formdata.Others
            },
            rfqdetails: [],
            rfqotherdetails: []
        };
        disabled.attr('disabled', 'disabled');

        //rfqdetails
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {

            item = {};
            var ds1 = f[i][13];
            var ds2 = f[i][15];
            var ds3 = f[i][17];
            if (ds1 == 0) {
                ds1 = 2;
            }
            if (ds2 == 0) {
                ds2 = 2;
            }
            if (ds3 == 0) {
                ds3 = 2;
            }
            //item["Id"] = f[i][8];
            //item["RFQId"] = formdata.Id;
            //item["ProductId"] = f[i][4];
            //item["Description"] = f[i][5];
            //item["Qty"] = f[i][6];
            //item["UnitId"] = f[i][7];
            //item["GroupName"] = f[i][9];
            //item["ProductName"] = f[i][10];
            //item["UnitPrice"] = "0";
            //item["Disc1"] = "0";
            //item["DiscType1"] = "0";
            //item["Disc2"] = "0";
            //item["DiscType2"] = "0";
            //item["Disc3"] = "0";
            //item["DiscType3"] = "0";
            //item["DiscTotal"] = "0";
            item["id"] = f[i][22];
            item["RFQId"] = formdata.Id;
            item["IndexNo"] = f[i][0];
            item["ProductId"] = f[i][8];
            item["Description"] = f[i][9];
            item["Qty"] = f[i][10];
            item["UnitId"] = f[i][11];
            item["ItemType"] = f[i][20];
            item["GroupName"] = f[i][18];
            item["ProductName"] = "0";
            item["UnitPrice"] = f[i][4];
            item["Disc1"] = f[i][12];
            item["DiscType1"] = ds1;
            item["Disc2"] = f[i][14];
            item["DiscType2"] = ds2;
            item["Disc3"] = f[i][16];
            item["DiscType3"] = ds3;
            item["DiscTotal"] = f[i][5];
            item["Total"] = f[i][6];
            item["Color"] = f[i][21];
            viewData.rfqdetails.push(item);
        }

        var tabledeleted = _$itemsTableDeleted.DataTable();
        var form_deleteddata = tabledeleted.rows().data();
        var g = form_deleteddata;
        for (var j = 0; g.length > j; j++) {

            item = {};
            item["Id"] = g[j][22];
            item["RFQId"] = formdata.Id;
            item["IndexNo"] = g[j][0];
            item["ProductId"] = g[j][8];
            item["Description"] = g[j][9];
            item["Qty"] = g[j][10];
            item["UnitId"] = g[j][11];
            item["ItemType"] = g[j][20];
            item["GroupName"] = g[j][18];
            item["ProductName"] = "0";
            item["UnitPrice"] = g[j][5];
            item["Disc1"] = g[j][12];
            item["DiscType1"] = g[j][13];
            item["Disc2"] = g[j][14];
            item["DiscType2"] = g[j][15];
            item["Disc3"] = g[j][16];
            item["DiscType3"] = g[j][17];
            item["DiscTotal"] = g[j][5];
            item["Total"] = g[j][6];
            item["Color"] = g[j][21];
            item["IsDeleted"] = 1;
            if (g[j][22] > 0) {
                viewData.rfqdetails.push(item);
            }
        }

        //rfqotherdetails
        var tableo = _$OItemsTable.DataTable();
        var form_tableo = tableo.rows().data();
        var r = form_tableo;
        for (var q = 0; r.length > q; q++)
        {
            items = {};
            items["Id"] = r[q][7];
            items["RFQId"] = r[q][8];
            items["IndexNo"] = r[q][0];
            items["Name"] = r[q][1];
            items["Area"] = r[q][2];
            items["Description"] = r[q][3];
            items["Dimension"] = r[q][4];
            items["Quantity"] = r[q][5];
            viewData.rfqotherdetails.push(items);
        }
        //rfqotherdetails

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
                    var returnid = _rfqService.updateRfq(viewData).done(function (res) {
                        abp.message.success('RFQ updated', 'Success');
                        if (res.notif.id > 0) {
                            srConnection.invoke('sendNotification', res.rfq.code, res.rfq.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                        }
                        var url = 'Index';
                        setTimeout(function () {
                            //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                            window.location.href = abp.appPath + 'RFQ/Edit?id=' + res.rfq.id;
                        }, 2000);
                        //location.reload(true);
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

    $("#Color").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);


        return isValid(character);
    });
    $("#Color").keyup(function (event) {
        this.value = this.value.substr(0, 1).toUpperCase() + this.value.substr(1).toLowerCase();
    });

    function isValid(str) {
        return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    }
    $("#EColor").keypress(function (event)
    {
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
            "rfqId": formdata.Id,
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
                        getrfqotherdetails($('#Id').val());
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
                        getrfqotherdetails($('#Id').val());
                        
                    });
                }
            }
        );

    }

})(jQuery);