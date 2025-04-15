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

        var _$salesOrdersTable = $('#ListTable');
        var _salesOrderService = abp.services.app.salesOrderService;
        var _companyService = abp.services.app.companyService;

        var _permissions = {
            create: abp.auth.hasPermission('Page.Sales.Orders.Create'),
            edit: abp.auth.hasPermission('Page.Sales.Orders.Edit'),
            'delete': abp.auth.hasPermission('Page.Sales.Orders.Delete')
        };

        var dataTable = _$salesOrdersTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _salesOrderService.getSalesOrderReport,
                inputFilter: function () {

                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $Types = $('#Types').val();
                    var $SearchFilter = $('#SearchFilter').val();

                    return {
                        filter: $datefrom + '|' + $dateto + '|' + $Types + '|' + $SearchFilter
                    };
                }
            },
            columnDefs: [
                {
                    visible: false,
                    className: 'control responsive',
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    className: 'tablefont',
                    targets: 1,
                    data: "code"
                },
                {
                    className: 'tablefont',
                    targets: 2,
                    data: "transactionTime",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    className: 'tablefont',
                    targets: 3,
                    data: "client"
                },
                {
                    className: 'tablefont',
                    targets: 4,
                    "data": "salesAgent"
                },
                {
                    className: 'tablefont',
                    targets: 5,
                    "data": "status"
                },
                {
                    className: 'tablefont',
                    targets: 6,
                    "data": "clientOrderNo"
                },
                {
                    className: 'tablefont',
                    targets: 7,
                    "data": "deliveryTime",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },                
                {
                    className: 'tablenumberright',
                    targets: 8,
                    data: "netTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2)
                },
                {
                    targets: 9,
                    data: "grandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'tablenumberright'
                },
                {
                    targets: 10,
                    data: "otherDiscount",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'tablenumberright'
                },
                {
                    targets: 11,
                    data: "tpc",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'tablenumberright'
                }
            ]
        });

        function getDataList() {
            dataTable.ajax.reload();
        }

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getDataList();
        });

        $('#btnprint').click(function (e) {
            e.preventDefault();
            printPreview();
        });

        function printPreview() {
           

            var companyaddress = $('#CompanyAddress').text();
            var divToPrint = document.getElementById("ListTable");

            var win = window.open('');
            win.document.write('<html><head><title>SALES ORDER REPORT</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/style.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');

            //win.document.write('<html><head><title>SALES ORDER REPORT</title><link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" /><link href="' + abp.appPath + 'css/960.css" type="text/css" rel="stylesheet" media="screen" asp-append-version="true" /><style>.table td, .table th {padding: 3px; border-top: 1px solid #FFF;} </style></head><body>');
            win.document.write('<div id="content" class="container_12 clearfix">');
            win.document.write('<div id="content-main" class="grid_12">');

            // Header
            win.document.write('<div class="row">');
            win.document.write('<div class="col-lg-12"><img src="' + abp.appPath + 'images/logo-header.png" style="width: 470px; vertical-align: top;" alt="" /><label class="text-muted float-right" style="white-space: pre-wrap; font-size:12px; text-primary">' + companyaddress + '</label></div>');
            win.document.write('</div>');

            win.document.write('<div class="row">');
            win.document.write('<br />');
            win.document.write('</div>');


            win.document.write(divToPrint.outerHTML);


           

            // Footer

            win.document.write('</div>');
            win.document.write('<script src="' + abp.appPath + 'js/jquery.min.js" asp-append-version="true"><script src="' + abp.appPath + 'js/bootstrap.min.js" asp-append-version="true"></script> </script><script src="' + abp.appPath + 'lib/jquery-print-preview/src/jquery.print-preview.js" asp-append-version="true"></script><script src="' + abp.appPath + 'view-resources/Views/Quotations/Print.js" asp-append-version="true"></script> </body></html>');
            //win.print();
            //window.print();
        }

    });
})();
