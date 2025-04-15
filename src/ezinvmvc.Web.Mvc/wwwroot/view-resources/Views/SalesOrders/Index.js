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
        var _$salesOrdersTable2 = $('#ListTable2');
        var _salesOrderService = abp.services.app.salesOrderService;
        var _employeeService = abp.services.app.employeeService;

        var _permissions = {
            create: abp.auth.hasPermission('Page.Sales.Orders.Create'),
            edit: abp.auth.hasPermission('Page.Sales.Orders.Edit'),
            'delete': abp.auth.hasPermission('Page.Sales.Orders.Delete')
        };

        function getaes() {
            var aes = $('#AEs');
            aes.empty();
            var empid = $('#h1').val();
            //if (empid === '-1') {
            //    empid = '';
            //}
            aes.append('<option value="" selected disabled>Account Executives</option>');
            _employeeService.getAllAgentAccounts({ filter: empid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    aes.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                }
                aes.selectpicker('refresh');
            });
        }

        getaes();

        var dataTable = _$salesOrdersTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _salesOrderService.getSalesOrders,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = $('#Client').val();
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $agent = '';
                    var $agentid = $('#h1').val();
                    if ($id === '') {
                        $id = 'null';
                    }
                    var $aefilter = $('#AEs').val();
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|null|' + $agent + '|' + $agentid + '|' + $aefilter
                    };
                }
            },
            order: [[14, 'asc']],
            columnDefs: [
                {
                    className: 'control responsive',
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                //{
                //    targets: 1,
                //    data: "code"
                //}
                {
                    orderData: 14,
                    targets: 1,
                    data: { id: "id", code: "code", revisionNo: "revisionNo" },
                    "render": function (data) {
                        var vcode = data.revisionNo > 0 ? data.code + '-' + data.revisionNo : data.code;
                        return '<a id="view-order" title="view" href="#" class="view-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '-' + data.revisionNo + '">' + vcode + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "salesAgent"
                },
                {
                    targets: 3,
                    data: "client"
                }
                ,
                {
                    targets: 4,
                    "data": "transactionTime",
                    "render": function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    //targets: 5,
                    //"data": "deliveryTime",
                    //"render": function (data) {
                    //    var dt = new Date(data);
                    //    return getFormattedDate(dt);
                    //}
                    targets: 5,
                    data: { deliveryTime: "deliveryTime", deliveryStatusTime: "DeliveryStatusTime" },
                    "render": function (data) {
                        if (data.deliveryStatusTime === 0) {
                            var dt = new Date(data.deliveryTime);
                            return getFormattedDate(dt);
                        }
                        else if (data.deliveryStatusTime === 1) {

                            return '<span class="badge badge-primary">To be advice</span>';
                        }
                        else if (data.deliveryStatusTime === 2) {
                            return '<span class="badge badge-primary">Once item created</span>';
                        }
                    },
                    orderData: 12
                },
                {
                    targets: 6,
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
                        else if (data.statusId === 6) {
                            return '<span class="badge badge-warning">' + data.status + '</span>';
                        }
                        else if (data.statusId === 7) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                    },
                    orderData: 13
                },
                {
                    targets: 7,
                    data: "grandTotal",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    data: "billingStatusId",
                    visible: abp.auth.isGranted("Pages.Accounts.Receivable") === true ? true: false,
                    "render": function (data) {
                        console.log(data);
                        if (data === 1 || data === 0) {
                            return '<span class="badge badge-secondary">Pending</span>';
                        }
                        else if (data === 2) {
                            return '<span class="badge badge-success">Partial</span>';
                        }
                        else if (data === 3) {
                            return '<span class="badge badge-danger">Billed</span>';
                        }
                        else {
                            return '<span class="badge badge-success">Other</span>';
                        }
                    }
                },
                {
                    targets: 9,
                    data: "billGrandTotal",
                    visible: abp.auth.isGranted("Pages.Accounts.Receivable") === true ? true : false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 10,
                    data: "billGrandBalance",
                    visible: abp.auth.isGranted("Pages.Accounts.Receivable") === true ? true : false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    orderable: false,
                    targets: 11,
                    class: "text-center",
                    data: { id: "id", code: "code" },
                    "render": function (data) {
                        //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
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
                },
                {
                    targets:12,
                    data: "deliveryTime",
                    visible:false
                },
                {
                    targets: 13,
                    data: "status",
                    visible: false
                },
                {
                    targets: 14,
                    data: "code",
                    visible:false
                }
            ]
        });


        var dataTable2 = _$salesOrdersTable2.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _salesOrderService.getSalesOrders,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = $('#Client').val();
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $agent = '';
                    var $agentid = $('#h1').val();
                    if ($id === '') {
                        $id = 'null';
                    }
                    var $aefilter = $('#AEs').val();
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|null|' + $agent + '|' + $agentid + '|' + $aefilter,
                        forExport: true
                    };
                }
            },
            columnDefs: [
                {
                    targets: 0,
                    data: "code"
                }
                ,
                {
                    targets: 1,
                    data: "salesAgent"
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
                    //targets: 5,
                    //"data": "deliveryTime",
                    //"render": function (data) {
                    //    var dt = new Date(data);
                    //    return getFormattedDate(dt);
                    //}
                    targets: 4,
                    data: { deliveryTime: "deliveryTime", deliveryStatusTime: "DeliveryStatusTime" },
                    "render": function (data) {
                        if (data.deliveryStatusTime === 0) {
                            var dt = new Date(data.deliveryTime);
                            return getFormattedDate(dt);
                        }
                        else if (data.deliveryStatusTime === 1) {

                            return '<span class="badge badge-primary">To be advice</span>';
                        }
                        else if (data.deliveryStatusTime === 2) {
                            return '<span class="badge badge-primary">Once item created</span>';
                        }
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
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-success">' + data.status + '</span>';
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
                    targets: 7,
                    data: "billingStatusId",
                    visible: abp.auth.isGranted("Pages.Accounts.Receivable") === true ? true : false,
                    "render": function (data) {
                        console.log(data);
                        if (data === 1) {
                            return '<span class="badge badge-secondary">Pending</span>';
                        }
                        else if (data === 2) {
                            return '<span class="badge badge-success">Partial</span>';
                        }
                        else if (data === 3) {
                            return '<span class="badge badge-danger">Billed</span>';
                        }
                        else {
                            return '<span class="badge badge-success">Other</span>';
                        }
                    }
                },
                {
                    targets: 8,
                    data: "billGrandTotal",
                    visible: abp.auth.isGranted("Pages.Accounts.Receivable") === true ? true : false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 9,
                    data: "billGrandBalance",
                    visible: abp.auth.isGranted("Pages.Accounts.Receivable") === true ? true : false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }
            ]
        });

        // Edit record
        _$salesOrdersTable.on('click', 'a.edit-order', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-order-id");
            window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + orderId;
        });

        // Edit record
        _$salesOrdersTable.on('click', 'a.view-order', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-order-id");
            window.location.href = abp.appPath + 'SalesOrders/Details?id=' + orderId;
        });

        // Delete record
        $('#ProductsTable').on('click', 'a.delete-product', function (e) {
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

        function getDataList() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'Sales Order', 'SalesOrder.xls');
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

        abp.event.on('app.createOrEditProductModalSaved', function () {
            getDataList();
        });

        $('#ProductTableFilter').focus();

        $("#lbBrands").change(function () {
            getDataList();
        });

        $("#lbCategories").change(function () {
            getDataList();
        });
        $("#StatusTypes").change(function () {
            getDataList();
        });
    });
})();
