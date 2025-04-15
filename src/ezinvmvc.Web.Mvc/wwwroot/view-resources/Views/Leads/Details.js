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

$('#datetimepicker1').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker2').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker3').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker4').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker5').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker6').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker7').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker8').datetimepicker({
    format: 'L',
    focusOnShow: true
});
var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
var mdayone = "01/01/" + new Date().getFullYear();
$("#RfqDateFrom").val(mdayone);
$("#QTDateFrom").val(mdayone);
$("#SODateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});

//Save Button
(function ($) {
    $(".date-picker").datepicker("update", new Date());
    $('.date-picker').datepicker({
        locale: abp.localization.currentLanguage.name,
        format: 'L'
    });
    $('.datetime-picker').datepicker({
        locale: abp.localization.currentLanguage.name,
        format: 'L LT'
    });
    $('#datetimepicker1').datetimepicker({
        focusOnShow: true
    });
    $('#datetimepicker2').datetimepicker({
        format: 'L',
        focusOnShow: true
    });

    var _leadService = abp.services.app.leadService;
    var _updatesService = abp.services.app.leadUpdateService;
    var _companyService = abp.services.app.companyService;
    var _commonService = abp.services.app.commonService;
    var _clientService = abp.services.app.clientService;
    var _contactPersonService = abp.services.app.contactPersonService;
    var _employeeService = abp.services.app.employeeService;
    var _pricingTypeService = abp.services.app.pricingTypeService;
    var _rfqService = abp.services.app.rFQService;
    var _quotationService = abp.services.app.quotationService;
    var _salesOrderService = abp.services.app.salesOrderService;


    var _$form = $('form[name=LeadForm]');
    var _$updatesTable = $('#UpdatesTable');
    var _$rfqform = $('form[name=RfqForm]');
    var _$rfqItemsTable = $('#RFQItemsTable');
    var _$qtform = $('form[name=QuotationForm]');
    var _$qtItemsTable = $('#QTItemsTable');
    var _$soform = $('form[name=SalesOrderForm]');
    var _$soItemsTable = $('#SOItemsTable');
    
    function getaes() {
        var aes1 = $('#AEs1');
        var aes2 = $('#AEs2');
        var aes3 = $('#AEs3');
        aes1.empty();
        aes2.empty();
        aes3.empty();
        var empid = $('#h1').val();
        //if (empid === '-1') {
        //    empid = '';
        //}
        aes1.append('<option value="" selected disabled>Account Executives</option>');
        aes2.append('<option value="" selected disabled>Account Executives</option>');
        aes3.append('<option value="" selected disabled>Account Executives</option>');
        _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                aes1.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                aes2.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                aes3.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
            }
            aes1.selectpicker('refresh');
            aes2.selectpicker('refresh');
            aes3.selectpicker('refresh');
        });
    }

    getaes();

    $('#CreateUpdatesButton').click(function (e) {
        var $id = $("#LeadId").val();
        var $uid = $("#LeadUpdateId").val();
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Leads/CreateSingleLeadUpdateModal?id=' + $id + '&uid=' + $uid,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#LeadUpdateCreateModal').modal('show');
                $('#LeadUpdateCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    var updatesDataTable = _$updatesTable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _updatesService.getLeadUpdatesByLeadId,
            inputFilter: function () {
                var $s = $('#LeadId').val();
                return {
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
                data: "leadUpdateDate",
                render: function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            },
            {
                targets: 2,
                data: "leadTask"
            }
            ,
            {
                targets: 3,
                data: "notes"
            },
            {
                targets: 4,
                data: "assignedTo"
            },
            {
                targets: 5,
                data: "nextContactDateTime",
                render: function (data) {
                    var tt = new Date(data);
                    return getFormattedDateTime(tt);
                }
            }
        ]
    });

    function updateGetAll() {
        updatesDataTable.ajax.reload();
    }

    $("#LeadUpdateCreateModal").on('hidden.bs.modal', function () {
        updateGetAll();
    });

    var _$rfqtable = $('#RfqTable');

    var rfqDataTable = _$rfqtable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _rfqService.getRFQs,
            inputFilter: function () {
                var $id = $('#RfqSearchFilter').val();
                var $code = '  ';
                var $datefrom = $('#RfqDateFrom').val();
                var $dateto = $('#RfqDateTo').val();
                var $statusid = $('#RfqStatusTypes').val();
                var $clientid = ''; //$('#ClientId').val();
                var $ae = $('#h1').val();
                var $aefilter = $('#AEs1').val();
                var $lid = $('#LeadId').val();
                return {
                    filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid + '|' + $ae + '|' + $aefilter + '|' + $lid
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
                orderData: 8,
                targets: 1,
                data: { code: "code", revisionNo: "revisionNo" },
                "render": function (data) {
                    return data.code + '-' + data.revisionNo;
                }
            },
            {
                targets: 2,
                data: "projectName"
            },
            {
                targets: 3,
                data: "transactionTime",
                render: function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            }
            ,
            {
                targets: 4,
                data: "contactPerson"
            },
            {
                targets: 5,
                data: "email"
            },
            {
                //targets: 6,
                //data: "status"
                orderData: 9,
                targets: 6,
                data: { status: "status", statusid: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-danger">' + data.status + '</span>';
                    }
                    else if (data.statusId === 4) {
                        return '<span class="badge badge-primary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 5) {
                        return '<span class="badge badge-info">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                orderable: false,
                targets: 7,
                class: "text-center",
                data: { id: "id", PROJECTNAME: "projectName", astatus: "astatus", status: "status", assignedid: "assignedid" },
                "render": function (data) {
                    var buttons = '<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>';//|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    //return '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" data-rfq-id="' + data.id + '" ><i class="fa fa-user"></i></a>|<a id="approve-rfq" title="approve" href="#" class="approve-rfq" data-rfq-id="' + data.id + '" data-toggle="modal" data-target="#ClientApproveModal" ><i class="fa fa-thumbs-up"></i></a>|<a id="revise-rfq" title="revise" href="#" class="revise-rfq" data-rfq-id="' + data.id + '" data-rfq-status="' + data.status + '"><i class="fa fa-refresh"></i></a>|<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                    //return '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" data-rfq-id="' + data.id + '" ><i class="fa fa-user"></i></a>|<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                    if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                        ret = buttons;
                    }
                    if (data.astatus === 0) {
                        if (abp.auth.isGranted('Pages.Rfq.Assign')) {
                            ret = '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" assign-rfq-id="' + data.id + '" assign-rfq-assignid="' + data.assignedid + '"  data-rfq-status="' + data.status + '"  ><i class="fa fa-user"></i></a>'; //|' + buttons;
                            if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                                ret += "|" + buttons;
                            }
                        }
                    }
                    //else {

                    //}

                    return ret;
                }
            },
            {
                visible: false,
                targets: 8,
                data: "code"
            },
            {
                visible: false,
                targets: 9,
                data: "statusId"
            }
        ]
    });


    _$rfqtable.on('click', 'a.revise-rfq', function (e) {
        e.preventDefault();
        var rfqid = $(this).attr("data-rfq-id");
        var rfqstatus = $(this).attr("data-rfq-status");
        window.location.href = abp.appPath + 'RFQ/Revision?id=' + rfqid;

    });

    _$rfqtable.on('click', 'a.edit-rfq', function (e) {
        e.preventDefault();
        var rfqid = $(this).attr("data-rfq-id");
        var rfqstatus = $(this).attr("data-rfq-status");
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('EditRFQConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    if (rfqstatus == "Approved") {
                        abp.message.error('Status has been approved!', 'Failed');
                        return;
                    }
                    else {
                        window.location.href = abp.appPath + 'RFQ/Edit?id=' + rfqid;
                    }

                }
            }
        );
    });

    _$rfqtable.on('click', 'a.approve-rfq', function (e) {
        e.preventDefault();
        var rfqid = $(this).attr("data-rfq-id");
        getrfq(rfqid);
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('ApproveRFQConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    //_service.deleteRfqInput({
                    //    id: id
                    //    getrfq(id);
                    //}).done(function () {
                    //    getAll();
                    //});
                    approvedRfq();
                }
            }
        );
    });

    _$rfqtable.on('click', 'a.delete-rfq', function (e) {
        var id = $(this).attr("data-rfq-id");
        var name = $(this).attr("data-rfq-projectname");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteRFQConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    _service.deleteRfqInput({
                        id: id
                    }).done(function () {
                        getAll();
                    });
                }
            }
        );
    });

    function rfqGetAll() {
        rfqDataTable.ajax.reload();
    }

    $('#RfqSearchButton').click(function (e) {
        e.preventDefault();
        rfqGetAll();
    });

    $('#RfqSearchButton').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        rfqGetAll();
    });

    var _$quotationsTable = $('#QuotationsTable');

    var qtDataTable = _$quotationsTable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _quotationService.getQuotations,
            inputFilter: function () {
                var $id = $('#QTSearchFilter').val();
                var $client = 'null';
                var $statusid = $('#QTStatusTypes').val();
                var $datefrom = $('#QTDateFrom').val();
                var $dateto = $('#QTDateTo').val();
                var $cid = '';//$('#ClientId').val();
                var $ae = $('#h1').val();
                var $aefilter = $('#AEs2').val();;
                var $lid = $('#LeadId').val();
                if ($id === '') {
                    $id = 'null';
                }
                return {
                    filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + $cid + '|' + $ae + '|' + $aefilter + '|' + $lid
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
                orderData: 8,
                targets: 1,
                data: { code: "code", revisionNo: "revisionNo" },
                "render": function (data) {
                    return data.code + '-' + data.revisionNo;
                }
            },
            {
                targets: 2,
                "data": "transactionTime",
                "render": function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            },
            {
                targets: 3,
                data: "agent"
            },
            {
                targets: 4,
                data: "grandTotal",
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right'
            },
            {
                orderData: 8,
                targets: 5,
                data: { status: "status", statusId: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-danger">' + data.status + '</span>';
                    }
                    else if (data.statusId === 4) {
                        return '<span class="badge badge-primary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 5) {
                        return '<span class="badge badge-info">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                orderable: false,
                targets: 6,
                class: "text-center",
                data: { id: "id", code: "code" },
                "render": function (data) {
                    //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var edit = '<a id="edit-quot" title="edit" href="#" class="edit-quot" data-quot-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                    //var del = '<a id="delete-quot" title="delete" href="#" class="delete-quot" data-order-id="' + data.id + '" data-quot-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    if (abp.auth.isGranted("Pages.Quotations.Edit")) {
                        ret += edit;
                    }
                    //if (abp.auth.isGranted("Master.Products.Delete")) {
                    //    ret += (ret.trim().length > 0 ? '|' + del : del);
                    //}
                    return ret;
                }
            },
            {
                visible: false,
                targets: 7,
                data: "code"
            },
            {
                visible: false,
                targets: 8,
                data: "statusId"
            }
        ]
    });

    // Edit record

    _$quotationsTable.on('click', 'a.edit-quot', function (e) {
        e.preventDefault();
        var orderId = $(this).attr("data-order-id");
        window.location.href = abp.appPath + 'Quotations/Edit?id=' + orderId;
    });

    // Delete record
    _$quotationsTable.on('click', 'a.delete-quot', function (e) {
        var productId = $(this).attr("data-quot-id");
        //var productName = $(this).attr("data-product-name");
        var productCode = $(this).attr("data-quot-code");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteProductConfirmation', 'ezinvmvc'), productName),
            function (isConfirmed) {
                if (isConfirmed) {
                    _productService.deleteProduct({
                        id: productId
                    }).done(function () {

                        $.ajax({
                            url: abp.appPath + 'Products/RemoveFile?code=' + productCode,
                            type: 'POST',
                            processData: false,
                            contentType: false,
                            success: function () { },
                            error: function (e) { }
                        });

                        getQuotations();
                    });
                }
            }
        );
    });

    function getQuotations() {
        qtDataTable.ajax.reload();
    }

    $('#QTSearchButton').click(function (e) {
        e.preventDefault();
        getQuotations();
    });

    $('#QTSearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        getQuotations();
    });

    $("#QTStatusTypes").change(function () {
        getQuotations();
    });

    var _$salesOrdersTable = $('#SalesOrdersTable');

    var soDataTable = _$salesOrdersTable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _salesOrderService.getSalesOrders,
            inputFilter: function () {
                var $id = $('#SOSearchFilter').val();
                var $client = 'null';
                var $statusid = $('#SOStatusTypes').val();
                var $datefrom = $('#SODateFrom').val();
                var $dateto = $('#SODateTo').val();
                var $cid = ''; //$('#ClientId').val();
                var $ae = $('#h1').val();
                var $aefilter = $('#AEs3').val();
                var $lid = $('#LeadId').val();
                if ($id === '') {
                    $id = 'null';
                }
                return {
                    filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + $cid + '|null|' + $ae + '|' + $aefilter + '|' + $lid
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
                data: "code"
            },
            {
                targets: 2,
                data: "client"
            }
            ,
            {
                targets: 3,
                "data": "transactionTime",
                "render": function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            },
            {
                targets: 4,
                "data": "deliveryTime",
                "render": function (data) {
                    var dt = new Date(data);
                    return getFormattedDate(dt);
                }
            },
            {
                targets: 5,
                data: { status: "status", statusId: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-primary">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                targets: 6,
                data: "grandTotal",
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right'
            },
            {
                orderable: false,
                targets: 7,
                class: "text-center",
                data: { id: "id", code: "code" },
                "render": function (data) {
                    //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var edit = '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                    //var del = '<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    if (abp.auth.isGranted("Pages.Sales.Orders.Edit")) {
                        ret += edit;
                    }
                    //if (abp.auth.isGranted("Master.Products.Delete")) {
                    //    ret += (ret.trim().length > 0 ? '|' + del : del);
                    //}
                    return ret;
                }
            }
        ]
    });

    // Edit record

    _$salesOrdersTable.on('click', 'a.edit-order', function (e) {
        e.preventDefault();
        var orderId = $(this).attr("data-order-id");
        window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + orderId;
    });

    // Delete record
    _$salesOrdersTable.on('click', 'a.delete-order', function (e) {
        var productId = $(this).attr("data-product-id");
        var productName = $(this).attr("data-product-name");
        var productCode = $(this).attr("data-product-code");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteProductConfirmation', 'ezinvmvc'), productName),
            function (isConfirmed) {
                if (isConfirmed) {
                    _productService.deleteProduct({
                        id: productId
                    }).done(function () {

                        $.ajax({
                            url: abp.appPath + 'Products/RemoveFile?code=' + productCode,
                            type: 'POST',
                            processData: false,
                            contentType: false,
                            success: function () { },
                            error: function (e) { }
                        });

                        getSalesOrders();
                    });
                }
            }
        );
    });

    function getSalesOrders() {
        soDataTable.ajax.reload();
    }

    $('#SOSearchButton').click(function (e) {
        e.preventDefault();
        getSalesOrders();
    });

    $('#SOSearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        getSalesOrders();
    });

    //function getrfq() {
    //    var $id = $('#RFQId').val();
    //    abp.ui.setBusy(_$rfqform);
    //    _rfqService.getRFQ({ id: $id }).done(function (result) {
    //        $('#RFQPrefix').val(result.prefix);
    //        $('#RFQCode').val(result.code);
    //        var rtransactiontime = new Date(result.transactionTime);
    //        var tt = getFormattedDate(rtransactiontime);
    //        $('#RFQTransactionTime').val(tt);
    //        $('#RFQRevisionNo').val(result.revisionNo);
    //        $('#RFQRefNo').val(result.code);
    //        $('#RFQSeries').val(result.seriesTypeId);
    //        $('#RFQCompanyId').val(result.companyId);
    //        $("#RFQType").val(result.type);
    //        $("#RFQLeadId").val(result.leadId);
    //        $("#RFQLeadCode").val(result.lead);
    //        $("#RFQLead").val(result.lead + ' - ' + result.client + ' - ' + result.projectName);
    //        $('#RFQClientId').val(result.clientId);
    //        $('#RFQClientName').val(result.client);
    //        $('#RFQProjectName').val(result.projectName);
    //        $('#RFQContactPersonId').val(result.contactPersonId);
    //        $('#RFQContactPerson').val(result.contactPerson);

    //        $('#RFQTelno').val(result.telNo);
    //        $('#RFQPhone').val(result.phone);
    //        $('#RFQEmail').val(result.email);
    //        $('#RFQAddress').val(result.address);
    //        $('#RFQDeliveryAddress').val(result.deliveryAddress);
    //        $('#RFQDiscount').val(result.discount);
    //        $('#RFQVat').val(result.vat);
    //        $('#RFQStatusId').val(result.statusId);
    //        $('#RFQStatusBadge').text(result.status);

    //        switch (result.statusId) {
    //            case 1:
    //                $('#RFQStatusBadge').addClass('badge badge-secondary');


    //                //if ($('#UpdateRfqButton').length) {
    //                //    $('#UpdateRfqButton').removeAttr('hidden');
    //                //}
    //                //if ($('#SubmitButton').length) {
    //                //    $('#SubmitButton').removeAttr('hidden');
    //                //}
    //                break;
    //            case 2:
    //                $('#RFQStatusBadge').addClass('badge badge-success');
    //                //if ($('#ReviseButton').length) {
    //                //    $('#ReviseButton').removeAttr('hidden');
    //                //}
    //                break;
    //            case 3:
    //                $('#RFQStatusBadge').addClass('badge badge-danger');
    //                //if ($('#SubmitButton').length) {
    //                //    $('#SubmitButton').removeAttr('hidden');
    //                //}
    //                break;
    //            case 4:
    //                $('#RFQStatusBadge').addClass('badge badge-primary');
    //                break;
    //            default:
    //                $('#RFQStatusBadge').addClass('badge badge-secondary');
    //        }
            
    //        var compid = result.companyId;
    //        var comp = $('#RFQCompany');
    //        getcompany(compid, comp);

    //        getrfqdetails($id);
    //        getRFQRevisionNos();
    //        abp.ui.clearBusy(_$rfqform);
    //    });


    //};

    //function getRFQRevisionNos() {
    //    var code = $('#RFQCode').val();
    //    var $revnos = $('#sRFQRevisionNo');
    //    var revno = $('#RFQRevisionNo').val();
    //    var id = $('#Id').val();
    //    $revnos.empty();
    //    _rfqService.getRFQRevisions({ filter: code, sorting: "revisionno asc" }).done(function (result) {
    //        for (var i = 0; i < result.length; i++) {
    //            //alert(id + "===" + result[i].id + "|" + revno + "===" + result[i].revisionNo);
    //            if (revno.trim() === (result[i].revisionNo + "").trim()) {
    //                //alert("equal");
    //                $revnos.append('<option value=' + result[i].id + ' selected>' + result[i].revisionNo + '</option>');
    //            }
    //            else {
    //                $revnos.append('<option value=' + result[i].id + '>' + result[i].revisionNo + '</option>');
    //            }
    //        }
    //        $revnos.selectpicker('refresh');
    //    });
    //}

    //$('#sRFQRevisionNo').change(function () {
    //    var id = $(this).children("option:selected").val();
    //    $('#RFQId').val(id);
    //    getrfq();
    //});

    //function getrfqdetails(id) {
    //    _$rfqItemsTable.DataTable().rows().remove().draw(false);
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
    //            var soidatacount = rfqDataTable.rows().count();
    //            var soiitemno = soidatacount + 1;

    //            rfqDataTable.row.add([soiitemno,
    //                '<a href="#" class="btn-link">' + $soiproductcode + '</a><br /><small><label class="text-muted">' + $soiperdescription + '</label></small>',
    //                '<label class="text-muted">' + $soiquantity + '</label>|<label class="text-muted">' + $soiunit + '</label>',
    //                '',
    //                $soiproductid, $soiperdescription, $soiquantity, $soiunitid, $soiid
    //            ]).draw();
    //        }
    //    });
    //};

    //var rfqDataTable = _$rfqItemsTable.DataTable({
    //    responsive: true,
    //    paging: false,
    //    "bInfo": false,
    //    searching: false,
    //    columnDefs: [{
    //        "visible": false,
    //        //targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    //        //MARC --WALA KA NA NITO SA VIEW
    //        //targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    //        targets: [4, 5, 6, 7]
    //    },
    //    {
    //        orderable: false,
    //        targets: [0, 1, 2, 3]
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
    //        targets: [3]
    //    }
    //    ]
    //});

    //function getcompany(id, comp) {
    //    _companyService.getCompanies().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                comp.val(result.items[i].name);
    //            }
    //        }
    //    });
    //}

    //function getquotation() {
    //    var $id = $('#QuotationId').val();
    //    abp.ui.setBusy(_$qtform);
    //    _quotationService.getQuotation({ id: $id }).done(function (result) {
    //        $('#QTPrefix').val(result.prefix);
    //        $('#QuotationCode').val(result.code);
    //        $('#QTRevisionNo').val(result.revisionNo);
    //        $('#QTCode').val(result.code);
    //        $('#QTRefNo').val(result.code);
    //        $('#QTSeries').val(result.seriesTypeId);
    //        $('#QTCompanies').val(result.companyId);
    //        $('#QTClientId').val(result.clientId);
    //        //$('#ClientName').val(result.client);
    //        var qtransactiontime = new Date(result.transactionTime);
    //        $('#QTTransactionTime').val(getFormattedDate(qtransactiontime));
    //        $('#QTOrderTypes').val(result.orderTypeId);
    //        $('#QTPricingTypes').val(result.pricingTypeId);
    //        $('#QTSalesAgent').val(result.agent);
    //        $('#QTSalesAgentId').val(result.salesAgentId);
    //        $('#QTStatusId').val(result.statusId);
    //        $('#QTRequestId').val(result.requestId);
    //        $('#QTPrevRequestId').val(result.requestId);
    //        $('#QTRequestCode').val(result.requestCode);
    //        $('#QTTaxTypes').val(result.taxTypeId);
    //        $('#QTNotes').val(result.notes);
    //        var sonettotal = currencyFormat(result.netTotal);
    //        var sotax = currencyFormat(result.tax);
    //        var sototal = currencyFormat(result.grandTotal);
    //        $('#QTSubTotal').val(sonettotal);
    //        $('#QTTax').val(sotax);
    //        $('#QTTotal').val(sototal);
    //        $('#QTStatusBadge').text(result.status);

    //        switch (result.statusId) {
    //            case 1:
    //                $('#QTStatusBadge').addClass('badge badge-secondary');


    //                //if ($('#SaveButton').length) {
    //                //    $('#SaveButton').removeAttr('hidden');
    //                //}
    //                //if ($('#SubmitButton').length) {
    //                //    $('#SubmitButton').removeAttr('hidden');
    //                //}
    //                break;
    //            case 2:
    //                $('#QTStatusBadge').addClass('badge badge-success');
    //                //if ($('#ReviseButton').length) {
    //                //    $('#ReviseButton').removeAttr('hidden');
    //                //}
    //                break;
    //            case 3:
    //                $('#QTStatusBadge').addClass('badge badge-danger');
    //                //if ($('#SubmitButton').length) {
    //                //    $('#SubmitButton').removeAttr('hidden');
    //                //}
    //                break;
    //            case 4:
    //                $('#QTStatusBadge').addClass('badge badge-primary');
    //                break;
    //            case 5:
    //                $('#QTStatusBadge').addClass('badge badge-info');
    //                break;
    //            default:
    //                $('#QTStatusBadge').addClass('badge badge-secondary');
    //        }

    //        getqtcompanies(result.companyId);
    //        getqtordertype(result.orderTypeId);
    //        getqttaxtype(result.taxTypeId);
    //        getqtpricingtype(result.pricingTypeId);
    //        getqtrfq();
    //        getqtagent();
    //        getqtclient();
    //        getquotationitems($id);
    //        getqtRevisionNos();
    //        //getcontactpersons(result.contactPersonId);
    //        abp.ui.clearBusy(_$qtform);
    //    });
    //};

    //function getqtRevisionNos() {
    //    var code = $('#QuotationCode').val();
    //    var $revnos = $('#sQTRevisionNo');
    //    var revno = $('#QTRevisionNo').val();
    //    var id = $('#QuotationId').val();
    //    $revnos.empty();
    //    _quotationService.getQuotationRevisions({ filter: code, sorting: "revisionno asc" }).done(function (result) {
    //        for (var i = 0; i < result.length; i++) {
    //            //alert(id + "===" + result[i].id + "|" + revno + "===" + result[i].revisionNo);
    //            if (revno.trim() === (result[i].revisionNo + "").trim()) {
    //                //alert("equal");
    //                $revnos.append('<option value=' + result[i].id + ' selected>' + result[i].revisionNo + '</option>');
    //            }
    //            else {
    //                $revnos.append('<option value=' + result[i].id + '>' + result[i].revisionNo + '</option>');
    //            }
    //        }
    //        $revnos.selectpicker('refresh');
    //    });
    //}

    //$('#sQTRevisionNo').change(function () {
    //    var id = $(this).children("option:selected").val();
    //    $('#QuotationId').val(id);
    //    getquotation();
    //});

    //function getquotationitems(id) {
    //    _$qtItemsTable.DataTable().rows().remove().draw(false);
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
    //            var sqidatacount = qtDataTable.rows().count();
    //            var sqiitemno = sqidatacount + 1;

    //            qtDataTable.row.add([sqiitemno,
    //                '<a href="#" class="btn-link">' + $sqiproductcode + '</a><br /><small><label class="text-muted">' + $sqiproductname + '</label></small>',
    //                '<label class="text-muted">' + $sqiquantity + '</label>|<label class="text-muted">' + $sqiunit + '</label>',
    //                sqiprice,
    //                sqitotaldiscount,
    //                sqitotal,
    //                '',
    //                $sqiproductid, $sqiperdescription, $sqiquantity, $sqiunitid, sqidisc1, parseInt($sqidtype1), sqidisc2, parseInt($sqidtype2), sqidisc3, parseInt($sqidtype3), $sqiid
    //            ]).draw();
    //        }
    //    });
    //};

    //function getqtcompanies(id) {
    //    var companies = $('#QTCompanies');
    //    companies.empty();
    //    _companyService.getCompanies().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        companies.selectpicker('refresh');
    //    });
    //}
    //function getqtordertype(id) {

    //    var ordertypes = $('#QTOrderTypes');
    //    ordertypes.empty();
    //    _commonService.getOrderTypes().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                ordertypes.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                ordertypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        ordertypes.selectpicker('refresh');
    //    });
    //}
    //function getqtpricingtype(id) {

    //    var pricingtypes = $('#QTPricingTypes');
    //    pricingtypes.empty();
    //    _pricingTypeService.getPricingTypes().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                pricingtypes.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                pricingtypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        pricingtypes.selectpicker('refresh');
    //    });
    //}
    //function getqttaxtype(id) {
    //    var taxtypes = $('#QTTaxTypes');
    //    taxtypes.empty();
    //    _commonService.getTaxTypes().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
    //            }

    //        }
    //        taxtypes.selectpicker('refresh');
    //    });
    //}
    //function getqtcontactpersons(id) {
    //    var $clientid = $('#QTClientId').val();

    //    var contactpersons = $('#QTContactPersons');
    //    contactpersons.empty();
    //    _contactPersonService.getContactPersonsFiltered({ id: 0, reference: 'Client', referenceId: $clientid }).done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                contactpersons.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].fullName + '</option>');
    //            }
    //            else {
    //                contactpersons.append('<option value=' + result.items[i].id + '>' + result.items[i].fullName + '</option>');
    //            }
    //        }
    //        contactpersons.selectpicker('refresh');
    //    });
    //};
    //function getqtrfq() {
    //    var $rfqid = $('#QTRequestId').val();
    //    _rfqService.getRFQ({ id: $rfqid }).done(function (result) {
    //        $("#QTRequest").val(result.code + ' - ' + result.client + ' - ' + result.projectName);
    //        $("#QTRequestCode").val(result.code);
    //        $('#QTClientId').val(result.clientId);
    //        $('#QTClientName').val(result.client);
    //        $('#QTProject').val(result.projectName);
    //        $('#QTContactPersonId').val(result.contactPersonId);
    //        $('#QTContactPerson').val(result.contactPerson);
    //    });
    //};
    //function getqtclient() {
    //    var $clientid = $('#QTClientId').val();
    //    _clientService.getClient({ id: $clientid }).done(function (result) {
    //        $('#QTClientAddress').val(result.address);
    //        $('#QTClientEmail').val(result.email);
    //        $('#QTClientTelephone').val(result.telNo);
    //    });
    //};
    //function getqtagent() {
    //    var $salesagentid = $('#QTSalesAgentId').val();
    //    _employeeService.getEmployee({ id: $salesagentid }).done(function (result) {
    //        $('#QTSalesAgentMobile').val(result.cellNo);
    //        $('#QTSalesAgentEmail').val(result.email);
    //    });
    //};
    //Datatable Add
    //var qtDataTable = _$qtItemsTable.DataTable({
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

    //function getsalesorder() {
    //    var $id = $('#SalesOrderId').val();
    //    _salesOrderService.getSalesOrder({ id: $id }).done(function (result) {
    //        //$('#Id').val(result.id);
    //        $('#SOPrefix').val(result.prefix);
    //        $('#SalesOrderCode').val(result.code);
    //        $('#SOSeries').val(result.seriesTypeId);
    //        $('#SOCompanies').val(result.companyId);
    //        $('#SOClientId').val(result.clientId);
    //        $('#SOClientName').val(result.client);
    //        var sotransactiontime = new Date(result.transactionTime);
    //        var sodeliverytime = new Date(result.deliveryTime);
    //        $('#SOTransactionTime').val(getFormattedDate(sotransactiontime));
    //        $('#SODeliveryTime').val(getFormattedDate(sodeliverytime));
    //        $('#SOOrderTypes').val(result.orderTypeId);
    //        $('#SOPricingTypes').val(result.pricingTypeId);
    //        $('#SOPaymentTerms').val(result.termId);
    //        $('#SOSalesAgentId').val(result.salesAgentId);
    //        $('#SOQuotationId').val(result.quotationId);
    //        $('#SOQuotationCode').val(result.quotationCode);
    //        $('#SOClientOrderNo').val(result.clientOrderNo);
    //        $('#SOTaxTypes').val(result.taxTypeId);
    //        $('#SONotes').val(result.notes);
    //        var sonettotal = currencyFormat(result.netTotal);
    //        var sotax = currencyFormat(result.tax);
    //        var sototal = currencyFormat(result.grandTotal);
    //        $('#SOSubTotal').val(sonettotal);
    //        $('#SOTax').val(sotax);
    //        $('#SOTotal').val(sototal);
    //        //getseriestype(result.seriesTypeId);
    //        getsocompanies(result.companyId);
    //        getsoordertype(result.orderTypeId);
    //        getsotaxtype(result.taxTypeId);
    //        getsopricingtype(result.pricingTypeId);
    //        getsopaymentterm(result.termId);
    //        getsoclient();
    //        getsalesorderitems($id);
    //    });
    //};
    //function getsalesorderitems(id) {
    //    _salesOrderService.getSalesOrderItemsByParentId({ id: id }).done(function (result) {

    //        for (var i = 0; i < result.items.length; i++) {
    //            var $soiid = result.items[i].id;
    //            var $soiproductid = result.items[i].productId;
    //            var $soiproductcode = result.items[i].productCode;
    //            var $soiproductname = result.items[i].description;
    //            var $soiunitid = result.items[i].unitId;
    //            var $soiunit = result.items[i].unit;
    //            var $soiquantity = result.items[i].orderQty;
    //            var $soiprice = result.items[i].unitPrice;

    //            var $soidisc1 = result.items[i].disc1;
    //            var $soidisc2 = result.items[i].disc2;
    //            var $soidisc3 = result.items[i].disc3;
    //            var $soidtype1 = result.items[i].discType1;
    //            var $soidtype2 = result.items[i].discType2;
    //            var $soidtype3 = result.items[i].discType3;
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
    //            var soidatacount = soDataTable.rows().count();
    //            var soiitemno = soidatacount + 1;

    //            soDataTable.row.add([soiitemno,
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
    //function getsocompanies(id) {

    //    var companies = $('#SOCompanies');
    //    companies.empty();
    //    _companyService.getCompanies().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        companies.selectpicker('refresh');
    //    });
    //}
    //function getsoordertype(id) {

    //    var ordertypes = $('#SOOrderTypes');
    //    ordertypes.empty();
    //    _commonService.getOrderTypes().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                ordertypes.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                ordertypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        ordertypes.selectpicker('refresh');
    //    });
    //}
    //function getsopricingtype(id) {

    //    var pricingtypes = $('#SOPricingTypes');
    //    pricingtypes.empty();
    //    _pricingTypeService.getPricingTypes().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                pricingtypes.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                pricingtypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        pricingtypes.selectpicker('refresh');
    //    });
    //}
    //function getsopaymentterm(id) {

    //    var paymentterms = $('#SOPaymentTerms');
    //    paymentterms.empty();
    //    _commonService.getPaymentTerms().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                paymentterms.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                paymentterms.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
    //            }
    //        }
    //        paymentterms.selectpicker('refresh');
    //    });
    //}
    //function getsotaxtype(id) {
    //    var taxtypes = $('#SOTaxTypes');
    //    taxtypes.empty();
    //    _commonService.getTaxTypes().done(function (result) {
    //        for (var i = 0; i < result.items.length; i++) {
    //            if (id === result.items[i].id) {
    //                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
    //            }
    //            else {
    //                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
    //            }

    //        }
    //        taxtypes.selectpicker('refresh');
    //    });
    //}
    //function getsoclient() {
    //    var $clientid = $('#ClientId').val();
    //    _clientService.getClient({ id: $clientid }).done(function (result) {
    //        $('#SOClientAddress').val(result.address);
    //        $('#SOClientEmail').val(result.email);
    //    });
    //};
    //Datatable Add
    //var soDataTable = _$soItemsTable.DataTable({
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

    function loadPage() {
        //var rfqId = $("#RFQId").val();
        //var qtId = $("#QuotationId").val();
        //var soId = $("#SalesOrderId").val();
        updateGetAll();

        //if (rfqId > 0) {
        //    $('#liRFQ').show();
        //    getrfq();
        //}
        //else {
        //    $('#liRFQ').hide();
        //}

        //if (qtId > 0) {
        //    $('#liQuotation').show();
        //    getquotation();
        //}
        //else {
        //    $('#liQuotation').hide();
        //}

        //if (soId > 0) {
        //    $('#liSalesOrder').show();
        //    getsalesorder();
        //}
        //else {
        //    $('#liSalesOrder').hide();
        //}
    }

    loadPage();
})(jQuery);




