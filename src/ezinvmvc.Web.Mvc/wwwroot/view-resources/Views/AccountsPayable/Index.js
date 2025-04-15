$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
var $month = (new Date().getMonth() + 1);
var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
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
        var _cVService = abp.services.app.cVService;

        var _permissions = {
            create: abp.auth.hasPermission('Page.Sales.Invoice.Create'),
            edit: abp.auth.hasPermission('Page.Sales.Invoice.Edit'),
            'delete': abp.auth.hasPermission('Page.Sales.Invoice.Delete')
        };

        var dataTable = _$Table.DataTable({
            responsive: true,
            serverSide: true,
            processing: true,
            searching: false,
            paging: false,
            "bInfo": false,
            pageLength: 10000,
            listAction: {
                ajaxFunction: _cVService.getAPs,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    //var $client = $('#Client').val();
                    //var $code = $('#Client').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    //if ($id === '') {
                    //    $id = 'null';
                    //}
                    return {
                        //filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto
                        filter: $id + '|' + $datefrom + '|' + $dateto
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
                    data: "client"
                },
                {
                    targets: 4,
                    data: "grandTotal",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 5,
                    data: "paid",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 6,
                    data: "credit",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    data: "balance",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }
            ]
        });

        var dataTable2 = _$Table2.DataTable({
            responsive: true,
            serverSide: true,
            processing: true,
            searching: false,
            paging: false,
            "bInfo": false,
            pageLength: 10000,
            listAction: {
                ajaxFunction: _cVService.getAPs,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    //var $client = $('#Client').val();
                    //var $code = $('#Client').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    //if ($id === '') {
                    //    $id = 'null';
                    //}
                    return {
                        //filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto
                        filter: $id + '|' + $datefrom + '|' + $dateto,
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
                    data: "client"
                },
                {
                    targets: 4,
                    data: "grandTotal",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 5,
                    data: "paid",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 6,
                    data: "credit",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    data: "balance",
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }
            ]
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

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'AccountsPayable', 'AccountsPayable.xls');
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
