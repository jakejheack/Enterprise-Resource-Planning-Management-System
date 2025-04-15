// ExpenseItem Index

$('select').selectpicker();

(function () {
    $(function () {

        var _$expenseItemsTable = $('#ListTable');
        var _expenseItemService = abp.services.app.expenseItemService;

        var _permissions = {
            create: abp.auth.hasPermission('Master.ExpenseItems.Create'),
            edit: abp.auth.hasPermission('Master.ExpenseItems.Edit'),
            'delete': abp.auth.hasPermission('Master.ExpenseItems.Delete')
        };

        var dataTable = _$expenseItemsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _expenseItemService.getExpenseItems,
                inputFilter: function () {
                    var $p = $('#ExpenseItemTableFilter').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $p + '||'
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
                    data: "code"
                },
                {
                    targets: 2,
                    data: "name"
                },
                {
                    targets: 3,
                    data: "expenseAccount"
                },
                {
                    targets: 4,
                    data: "expenseAccountId"
                },
                {
                    orderable: false,
                    targets: 5,
                    class: "text-center",
                    data: { id: "id", name: "name", code: "code"},
                    "render": function (data) {
                        //return '<a id="edit-expenseItem" title="edit" href="#" class="edit-expenseItem" data-expenseItem-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-expenseItem" title="delete" href="#" class="delete-expenseItem" data-expenseItem-id="' + data.id + '" data-expenseItem-name="' + data.name + '" data-expenseItem-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-expenseItem" title="edit" href="#" class="edit-expenseItem" data-expenseItem-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-expenseItem" title="delete" href="#" class="delete-expenseItem" data-expenseItem-id="' + data.id + '" data-expenseItem-name="' + data.name + '" data-expenseItem-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.ExpenseItems.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.ExpenseItems.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });

        // Edit record
        $('#ListTable').on('click', 'a.edit-expenseItem', function (e) {
            e.preventDefault();
            var expenseItemId = $(this).attr("data-expenseItem-id");
            window.location.href = abp.appPath + 'ExpenseItems/Edit?id=' + expenseItemId;
        });

        // Delete record
        $('#ListTable').on('click', 'a.delete-expenseItem', function (e) {
            var expenseItemId = $(this).attr("data-expenseItem-id");
            var expenseItemName = $(this).attr("data-expenseItem-name");
            var expenseItemCode = $(this).attr("data-expenseItem-code");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteExpenseItemConfirmation', 'ezinvmvc'), expenseItemName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _expenseItemService.deleteExpenseItem({
                            id: expenseItemId
                        }).done(function () {

                            $.ajax({
                                url: abp.appPath + 'ExpenseItems/RemoveFile?code=' + expenseItemCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });

                            getExpenseItems();
                        });
                    }
                }
            );
        });

        function getExpenseItems() {
            dataTable.ajax.reload();
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
                .getExpenseItemsToExcel({})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        $('#GetExpenseItemButton, #RefreshExpenseItemListButton').click(function (e) {
            e.preventDefault();
            getExpenseItems();
        });

        $('#ExpenseItemTableFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }

            e.preventDefault();
            getExpenseItems();
        });

        abp.event.on('app.createOrEditExpenseItemModalSaved', function () {
            getExpenseItems();
        });

        $('#ExpenseItemTableFilter').focus();

        $("#lbBrands").change(function () {
            getExpenseItems();
        });

        $("#lbCategories").change(function () {
            getExpenseItems();
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
            tableToExcel('ListTable', 'ExpenseItems', 'ExpenseItems.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }
    });
})();