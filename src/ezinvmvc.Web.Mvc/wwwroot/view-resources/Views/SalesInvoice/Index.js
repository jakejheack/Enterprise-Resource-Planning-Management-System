$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
var mdayone = "01/01/" + new Date().getFullYear();
$('#DateFrom').val(mdayone);

$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

$('select').selectpicker();

(function () {
    $(function () {

        var _$Table = $('#ListTable');
        var _$Table2 = $('#ListTable2');
        var _salesInvoiceService = abp.services.app.salesInvoiceService;

        var _permissions = {
            create: abp.auth.hasPermission('Page.Sales.Invoice.Create'),
            edit: abp.auth.hasPermission('Page.Sales.Invoice.Edit'),
            'delete': abp.auth.hasPermission('Page.Sales.Invoice.Delete')
        };

        var dataTable = _$Table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _salesInvoiceService.getSalesInvoices,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = 'null';
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    if ($id === '') {
                        $id = 'null';
                    }
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto
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
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                },
                {
                    targets: 5,
                    //MULTIPLE SI
                    //data: "netTotal",
                    data: "billNetTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 6,
                    //MULTIPLE SI
                    //data: "tax",
                    data: "billTax",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    //MULTIPLE SI
                    //data: "subTotal",
                    data: "billSubTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    //MULTIPLE SI
                    //data: "otherCharges",
                    data: "billOtherCharges",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 9,
                    //MULTIPLE SI
                    //data: "grandTotal",
                    data: "billGrandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    orderable: false,
                    targets: 10,
                    class: "text-center",
                    data: { id: "id", code: "code" },
                    "render": function (data) {
                        //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                        //var del = '<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Sales.Edit")) {
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

        var dataTable2 = _$Table2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _salesInvoiceService.getSalesInvoices,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = 'null';
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    if ($id === '') {
                        $id = 'null';
                    }
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto,
                        forExport: true
                    };
                }
            },
            columnDefs: [
                {
                    targets: 0,
                    data: "code"
                },
                {
                    targets: 1,
                    data: "client"
                }
                ,
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
                    data: { status: "status", statusId: "statusId" },
                    "render": function (data) {
                        if (data.statusId === 1) {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 2) {
                            return '<span class="badge badge-warning">' + data.status + '</span>';
                        }
                        else if (data.statusId === 3) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                },
                {
                    targets: 4,
                    //MULTIPLE SI
                    //data: "netTotal",
                    data: "billNetTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 5,
                    //MULTIPLE SI
                    //data: "tax",
                    data: "billTax",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 6,
                    //MULTIPLE SI
                    //data: "subTotal",
                    data: "billSubTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    //MULTIPLE SI
                    //data: "otherCharges",
                    data: "billOtherCharges",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    //MULTIPLE SI
                    //data: "grandTotal",
                    data: "billGrandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }
            ]
        });

        // Edit record
        _$Table.on('click', 'a.edit-order', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-order-id");
            window.location.href = abp.appPath + 'SalesInvoice/Edit?id=' + orderId;
        });

        // Delete record

        function getDataList() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }

        $('#ShowAdvancedFiltersSpan').click(function () {
            $('#ShowAdvancedFiltersSpan').hide();
            $('#HideAdvancedFiltersSpan').show();
            $('#AdvacedAuditFiltersArea').slideDown();
        });

        $('#HideAdvancedFiltersSpan').click(function () {
            $('#HideAdvancedFiltersSpan').hide();
            $('#ShowAdvancedFiltersSpan').show();
            $('#AdvacedAuditFiltersArea').slideUp();
        });

        $('#ExportCompanyToExcelButton').click(function () {
            _companyService
                .getProductsToExcel({})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getDataList();
        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getDataList();
        });

        abp.event.on('app.createOrEditProductModalSaved', function () {
            getDataList();
        });

        $('#ProductTableFilter').focus();

        $("#lbBrands").change(function () {
            getSalesOrders();
        });

        $("#lbCategories").change(function () {
            getSalesOrders();
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'Sales Invoice', 'SalesInvoice.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) {
                    return window.btoa(decodeURIComponent(encodeURIComponent(s.replace(/[\u00A0-\u2666]/g, function (c) {
                        return '&#' + c.charCodeAt(0) + ';';
                    }).replace(/[\u{0080}-\u{FFFF}]/gu, ""))))
                }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

    });
})();
