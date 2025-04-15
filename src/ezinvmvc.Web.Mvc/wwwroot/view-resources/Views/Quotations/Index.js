$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.length > 1 ? $month : $month) + "/01/" + new Date().getFullYear();
var mdayone = "01/01/" + new Date().getFullYear();
$('#DateFrom').val(mdayone);
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});


$('select').selectpicker();

(function () {
    $(function () {

        var _$quotationsTable = $('#QuotationsTable');
        var _$quotationsTable2 = $('#QuotationsTable2');
        var _quotationService = abp.services.app.quotationService;
        var _employeeService = abp.services.app.employeeService;

        var _permissions = {
            create: abp.auth.hasPermission('Page.Quotations.Create'),
            edit: abp.auth.hasPermission('Page.Quotations.Edit'),
            'delete': abp.auth.hasPermission('Page.Quotations.Delete')
        };

        function getaes() {
            var aes = $('#AEs');
            aes.empty();
            var empid = $('#h1').val();
            //if (empid === '-1') {
            //    empid = '';
            //}
            aes.append('<option value="" selected disabled>Account Executives</option>');
            _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    aes.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                }
                aes.selectpicker('refresh');
            });
        }

        getaes();

        var dataTable = _$quotationsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _quotationService.getQuotations,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = 'null';
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $clientid = 'null';
                    var $accountexecutive = 'null';
                    //if (!abp.auth.isGranted("Pages.Quotations.AllAccounts")) {
                        var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                        console.log(empid);
                        $accountexecutive = empid;
                    //}
                    if ($id === '') {
                        $id = 'null';
                    }
                    var $aefilter = $('#AEs').val();
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + $clientid + '|' + $accountexecutive + '|' + $aefilter
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
                    data: { id: "id", code: "code", revisionNo: "revisionNo" },
                    "render": function (data) {
                        return '<a id="view-quotation" title="view" href="#" class="view-quotation" data-quotation-id="' + data.id + '" data-quotation-code="' + data.code + '-' + data.revisionNo + '">' + data.code + '-' + data.revisionNo + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "client",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
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
                    data: "agent"
                },
                {
                    orderData: 9,
                    targets: 5,
                    data: { status: "status", statusId : "statusId"},
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
                        else if (data.statusId === 6) {
                            return '<span class="badge badge-warning">' + data.status + '</span>';
                        }
                        else if (data.statusId === 7) {
                            return '<span class="badge text-white bg-flat-color-6">' + data.status + '</span>';
                        }
                        else if (data.statusId === 8) {
                            return '<span class="badge text-white bg-flat-color-4">' + data.status + '</span>';
                        }
                        else if (data.statusId === 9) {
                            return '<span class="badge badge-warning">' + data.status + '</span>';
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
                        //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>&nbsp;<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                        //var del = '<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
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

        var dataTable2 = _$quotationsTable2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _quotationService.getQuotations,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    var $client = 'null';
                    var $statusid = $('#StatusTypes').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $clientid = 'null';
                    var $accountexecutive = 'null';
                    //if (!abp.auth.isGranted("Pages.Quotations.AllAccounts")) {
                    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    console.log(empid);
                    $accountexecutive = empid;
                    //}
                    if ($id === '') {
                        $id = 'null';
                    }
                    var $aefilter = $('#AEs').val();
                    return {
                        filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + $clientid + '|' + $accountexecutive + '|' + $aefilter,
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
                    data: { id: "id", code: "code", revisionNo: "revisionNo" },
                    "render": function (data) {
                        return '<a id="view-quotation" title="view" href="#" class="view-quotation" data-quotation-id="' + data.id + '" data-quotation-code="' + data.code + '-' + data.revisionNo + '">' + data.code + '-' + data.revisionNo + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "client",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
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
                    data: "agent"
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
                        else if (data.statusId === 4) {
                            return '<span class="badge badge-primary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-info">' + data.status + '</span>';
                        }
                        else if (data.statusId === 6) {
                            return '<span class="badge badge-warning">' + data.status + '</span>';
                        }
                        else if (data.statusId === 7) {
                            return '<span class="badge text-white bg-flat-color-6">' + data.status + '</span>';
                        }
                        else if (data.statusId === 8) {
                            return '<span class="badge text-white bg-flat-color-4">' + data.status + '</span>';
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
                }
            ]
        });

        // View record
        _$quotationsTable.on('click', 'a.view-quotation', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-quotation-id");
            window.location.href = abp.appPath + 'Quotations/Details?id=' + clientId;
        });

        // Edit record
        _$quotationsTable.on('click', 'a.edit-order', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-order-id");
            window.location.href = abp.appPath + 'Quotations/Edit?id=' + orderId;
        });

        // Delete record
        _$quotationsTable.on('click', 'a.delete-product', function (e) {
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

                            getQuotations();
                        });
                    }
                }
            );
        });

        function getQuotations() {
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
            getQuotations();
        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getQuotations();
        });

        $('#ProductTableFilter').focus();

        $("#StatusTypes").change(function () {
            getQuotations();
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('QuotationsTable2', 'Quotations', 'Quotations.xls');
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
