$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
var $month = (new Date().getMonth() + 1);
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
        var _collectionService = abp.services.app.collectionService;

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
                ajaxFunction: _collectionService.getCollections,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client =  $('#Client').val();
                    var $status = 'null';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $clientid = 'null';
                    if ($id === '') {
                        $id = 'null';
                    }
                    if ($client === '') {
                        $id = 'null';
                    }
                    return {
                        filter: $id + '|' + $client + '|' + $status + '|' + $datefrom + '|' + $dateto + '|' + $clientid
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
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                }
                ,
                {
                    targets: 5,
                    data: "paymentMode"
                },
                {
                    targets: 6,
                    data: "grandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    data: "allocated",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    data: "unallocated",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    orderable: false,
                    targets: 9,
                    class: "text-center",
                    data: { id: "id", code: "code", statusId: "statusId" },
                    "render": function (data) {
                        //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-collection-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-order" title="delete" href="#" class="delete-order" data-collection-id="' + data.id + '" data-collection-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-col" title="Edit" href="#" class="edit-col" data-collection-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                        var display = '<a id="display-col" title="Details" href="#" class="display-col" data-collection-id="' + data.id + '"><i class="fa fa-search"></i></a>';
                        //var del = '<a id="delete-col" title="delete" href="#" class="delete-col" data-collection-id="' + data.id + '" data-collection-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Collections.Edit")) {
                            console.log(data.statusId.toString());
                            if (data.statusId.toString() == "1") {
                                ret += edit;
                            }
                            else if (data.statusId.toString() == "2") {
                                ret += display;
                            }
                        }
                        //if (abp.auth.isGranted("Pages.Collections.Delete")) {
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
                ajaxFunction: _collectionService.getCollections,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = $('#Client').val();
                    var $status = 'null';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $clientid = 'null';
                    if ($id === '') {
                        $id = 'null';
                    }
                    if ($client === '') {
                        $id = 'null';
                    }
                    return {
                        filter: $id + '|' + $client + '|' + $status + '|' + $datefrom + '|' + $dateto + '|' + $clientid,
                        forExport: true
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
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                }
                ,
                {
                    targets: 5,
                    data: "paymentMode"
                },
                {
                    targets: 6,
                    data: "grandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    data: "allocated",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    data: "unallocated",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
            ]
        });

        // Edit record
        _$Table.on('click', 'a.edit-col', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-collection-id");
            window.location.href = abp.appPath + 'Collections/Edit?id=' + orderId;
        });
        _$Table.on('click', 'a.display-col', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-collection-id");
            window.location.href = abp.appPath + 'Collections/Details?id=' + orderId;
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
            tableToExcel('ListTable2', 'Collections', 'Collections.xls');
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
