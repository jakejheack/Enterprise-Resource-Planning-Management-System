// Product Index

$('select').selectpicker();

(function () {
    $(function () {

        var _$productsTable = $('#ListTable');
        var _$productsTable2 = $('#ListTable2');
        var _productService = abp.services.app.productService;
        var _categoryService = abp.services.app.categoryService;
        var _brandService = abp.services.app.brandService;

        var _permissions = {
            create: abp.auth.hasPermission('Master.Products.Create'),
            edit: abp.auth.hasPermission('Master.Products.Edit'),
            'delete': abp.auth.hasPermission('Master.Products.Delete')
        };
        function getcategories() {
            var selectoptions = $('#lbCategories');
            selectoptions.empty();
            _categoryService.getCategories().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptions.selectpicker('refresh');
            });
        }
        function getbrands() {
            var selectoptions = $('#lbBrands');
            selectoptions.empty();
            _brandService.getBrands().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptions.selectpicker('refresh');
            });
        }
        getcategories();
        getbrands();
        var dataTable = _$productsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _productService.getProducts,
                inputFilter: function () {
                    var $p = $('#ProductTableFilter').val();
                    var $c = $('#lbCategories').val();
                    var $b = $('#lbBrands').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $c + '|' + $b + '|' + $p
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
                    orderable: false,
                    targets: 1,
                    data: { code: "code", imageName: "imageName" },
                    "render": function (data) {
                        if (data.imageName !== null) {
                            return '<img src="' + abp.appPath + 'products/' + data.id + '/' + data.imageName + '" class="datatable-img"/>';
                        }
                        else {
                            return '<i class="fa fa-image fa-2x"></i>';
                        }
                    }
                },
                {
                    targets: 2,
                    data: "code"
                },
                {
                    targets: 3,
                    data: "name"
                }
                ,
                {
                    targets: 4,
                    data: "category"
                },
                {
                    targets: 5,
                    data: "unit"
                },
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id", name: "name", code: "code"},
                    "render": function (data) {
                        //return '<a id="edit-product" title="edit" href="#" class="edit-product" data-product-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-product" title="delete" href="#" class="delete-product" data-product-id="' + data.id + '" data-product-name="' + data.name + '" data-product-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-product" title="edit" href="#" class="edit-product" data-product-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-product" title="delete" href="#" class="delete-product" data-product-id="' + data.id + '" data-product-name="' + data.name + '" data-product-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.Products.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.Products.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });

        var dataTable2 = _$productsTable2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _productService.getProducts,
                inputFilter: function () {
                    var $p = $('#ProductTableFilter').val();
                    var $c = $('#lbCategories').val();
                    var $b = $('#lbBrands').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $c + '|' + $b + '|' + $p,
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
                    data: "name"
                }
                ,
                {
                    targets: 2,
                    data: "category"
                },
                {
                    targets: 3,
                    data: "unit"
                }
            ]
        });

        // Edit record
        $('#ListTable').on('click', 'a.edit-product', function (e) {
            e.preventDefault();
            var productId = $(this).attr("data-product-id");
            window.location.href = abp.appPath + 'Products/Edit?id=' + productId;
        });

        // Delete record
        $('#ListTable').on('click', 'a.delete-product', function (e) {
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

                            getProducts();
                        });
                    }
                }
            );
        });

        function getProducts() {
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

        $('#GetProductButton, #RefreshProductListButton').click(function (e) {
            e.preventDefault();
            getProducts();
        });

        $('#ProductTableFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }

            e.preventDefault();
            getProducts();
        });

        abp.event.on('app.createOrEditProductModalSaved', function () {
            getProducts();
        });

        $('#ProductTableFilter').focus();

        $("#lbBrands").change(function () {
            getProducts();
        });

        $("#lbCategories").change(function () {
            getProducts();
        });

        $('#ExportToPDF').click(function (e) {
            var pdf = new jsPDF('p', 'pt', 'letter');

            pdf.cellInitialize();
            pdf.setFontSize(10);
            $.each($('#ListTable tr'), function (i, row) {
                $.each($(row).find("td, th"), function (j, cell) {
                    var txt = $(cell).text().trim() || " ";
                    var width = (j === 4) ? 40 : 70; //make 4th column smaller
                    pdf.cell(10, 50, width, 30, txt, i);
                });
            });

            pdf.save('sample-file.pdf');
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'Products', 'Products.xls');
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