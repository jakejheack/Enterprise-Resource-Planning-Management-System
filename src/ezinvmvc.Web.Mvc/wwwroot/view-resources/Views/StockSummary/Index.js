$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
var $month = (new Date().getMonth() + 1);
var mdayone = ($month.length > 1 ? $month : $month) + "/01/" + new Date().getFullYear();
$('#DateFrom').val(mdayone);
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});


$('select').selectpicker();

abp.ui.block();

(function () {
    $(function () {

        var _categoryService = abp.services.app.categoryService;
        var _brandService = abp.services.app.brandService;
        var _stockEntryService = abp.services.app.stockEntryService;
        var _warehouseService = abp.services.app.warehouseService;
        var _productService = abp.services.app.productService;
        var _$Table = $('#ListTable');
        var _$Table2 = $('#ListTable2');
        abp.ui.unblock();

        function getwarehouses() {
            var selectoptionsources = $('#Warehouses');
            selectoptionsources.empty();
            _warehouseService.getWarehouses().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptionsources.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptionsources.selectpicker('refresh');
            });
        }
        function getcategories() {
            var selectoptions = $('#Categories');
            selectoptions.empty();
            _categoryService.getCategories().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                selectoptions.selectpicker('refresh');
            });
        }
        function getbrands() {
            var selectoptions = $('#Brands');
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
        getwarehouses();

        //Item Autocomplete
        var getproducts = function (request, response) {
            _productService.getProductByName({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code,
                        value: el.id
                    };
                }));
            });
        };
        function getproduct() {
            var $productid = $('#ProductId').val();
            _productService.getProduct({ id: $productid }).done(function (result) {
                $('#ProductName').val(result.name);
            });
        }
        var selectproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            $("#ProductCode").val(ui.item ? ui.item.label : "");
            getproduct();
            return false;
        };
        var focusproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item.value);
            $("#ProductCode").val(ui.item.label);
            getproduct();
        };
        var changeproduct = function (event, ui) {
            event.preventDefault();
            $("#ProductId").val(ui.item ? ui.item.value : "");
            $("#ProductCode").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $("#ProductCode").val("");
                $("#ProductName").val("");
            }
        };
        $("#ProductCode").autocomplete({
            source: getproducts,
            select: selectproduct,
            focus: focusproduct,
            minLength: 2,
            delay: 100,
            change: changeproduct
        });
      
        //Item Autocomplete

        var dataTable = _$Table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _stockEntryService.getStockSummary,
                inputFilter: function () {
                    var $warehouse = $('#Warehouses').val();
                    var $product = $('#ProductId').val();
                    var $category = $('#Categories').val();
                    var $brand = $('#Brands').val();
                
                    if ($product === '') {
                        $product = 'null';
                    }
                    return {
                        filter: $warehouse + '|' + $product + '|' + $category + '|' + $brand
                    };
                }
            },
            columnDefs: [
                {
                    targets: 0,
                    data: "productCategory"
                },
                {
                    targets: 1,
                    data: "productBrand"
                },
                {
                    targets: 2,
                    data: "productCode"
                },
                {
                    targets: 3,
                    data: "productName"
                },
                {
                    targets: 4,
                    data: "warehouse"
                },
                {
                    targets: 5,
                    data: "unit"
                },
                {
                    targets: 6,
                    data: "qty",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    visible: false,
                    targets: 7,
                    data: "productId"
                },
                {
                    visible: false,
                    targets: 8,
                    data: "unitId"
                },
                {
                    visible: false,
                    targets: 9,
                    data: "warehouseId"
                }
            ]
        });

        var dataTable2 = _$Table2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _stockEntryService.getStockSummary,
                inputFilter: function () {
                    var $warehouse = $('#Warehouses').val();
                    var $product = $('#ProductId').val();
                    var $category = $('#Categories').val();
                    var $brand = $('#Brands').val();

                    if ($product === '') {
                        $product = 'null';
                    }
                    return {
                        filter: $warehouse + '|' + $product + '|' + $category + '|' + $brand,
                        forExport: true
                    };
                }
            },
            columnDefs: [
                {
                    targets: 0,
                    data: "productCategory"
                },
                {
                    targets: 1,
                    data: "productBrand"
                },
                {
                    targets: 2,
                    data: "productCode"
                },
                {
                    targets: 3,
                    data: "productName"
                },
                {
                    targets: 4,
                    data: "warehouse"
                },
                {
                    targets: 5,
                    data: "unit"
                },
                {
                    targets: 6,
                    data: "qty",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }
            ]
        });

        // View record
        _$Table.on('click', 'a.view-quotation', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-quotation-id");
            window.location.href = abp.appPath + 'Quotations/Details?id=' + clientId;
        });

        // Edit record
        _$Table.on('click', 'a.edit', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-id");
            window.location.href = abp.appPath + 'StockEntry/Edit?id=' + orderId;
        });
      
        function getDataList() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
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

        $('#SearchFilter').focus();

        $("#Warehouses").change(function () {
            getDataList();
        });

        $("#Categories").change(function () {
            getDataList();
        });

        $("#Brands").change(function () {
            getDataList();
        });


        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'Stock Summary', 'StockSummary.xls');
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
