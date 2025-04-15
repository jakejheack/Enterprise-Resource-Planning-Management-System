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
        var _deliveryReceiptService = abp.services.app.deliveryReceiptService;

        var _permissions = {
            create: abp.auth.hasPermission('Page.Delivery.Receipt.Create'),
            edit: abp.auth.hasPermission('Page.Delivery.Receipt.Edit'),
            'delete': abp.auth.hasPermission('Page.Delivery.Receipt.Delete')
        };

        var dataTable = _$Table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _deliveryReceiptService.getDeliveryReceipts,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = $('#Client').val();
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $SOnumber = $('#SOnumber').val();
                    var $DRnumber = $('#DRnumber').val();
                    if ($id === '') {
                        $id = 'null';
                    }
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + null + '|' + null + '|' + $SOnumber + '|' + $DRnumber
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
                    data: "drNumber"
                },
                {
                    targets: 3,
                    data: "clientOrderNo"
                },
                {
                    targets: 4,
                    data: "salesOrderCode"
                },
                {
                    targets: 5,
                    data: "client"
                }
                ,
                {
                    targets: 6,
                    "data": "transactionTime",
                    "render": function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 7,
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
                    visible: false,
                    targets: 8,
                    data: "grandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    orderable: false,
                    targets: 9,
                    class: "text-center",
                    data: { id: "id", code: "code" },
                    "render": function (data) {
                        //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                        var edit = '<a id="edit-dr" title="edit" href="#" class="edit-dr" data-dr-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                        //var del = '<a id="delete-dr" title="delete" href="#" class="delete-dr" data-dr-id="' + data.id + '" data-dr-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Delivery.Receipt.Edit")) {
                            ret += edit;
                        }
                        //if (abp.auth.isGranted("Pages.Delivery.Receipt.Delete")) {
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
                ajaxFunction: _deliveryReceiptService.getDeliveryReceipts,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = $('#Client').val();
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $SOnumber = $('#SOnumber').val();
                    var $DRnumber = $('#DRnumber').val();
                    if ($id === '') {
                        $id = 'null';
                    }
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + null + '|' + null + '|' + $SOnumber + '|' + $DRnumber,
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
                    data: "drNumber"
                },
                {
                    targets: 3,
                    data: "clientOrderNo"
                },
                {
                    targets: 4,
                    data: "salesOrderCode"
                },
                {
                    targets: 5,
                    data: "client"
                }
                ,
                {
                    targets: 6,
                    "data": "transactionTime",
                    "render": function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 7,
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
                    visible: false,
                    targets: 8,
                    data: "grandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }
            ]
        });

        // Edit record
        _$Table.on('click', 'a.edit-dr', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-dr-id");
            window.location.href = abp.appPath + 'DeliveryReceipt/Edit?id=' + orderId;
        });

        // Delete record

        function getDataList() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'Delivery Receipt', 'DeliveryReceipt.xls');
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
        $("#StatusTypes").change(function () {
            getDataList();
        });

    });
})();
