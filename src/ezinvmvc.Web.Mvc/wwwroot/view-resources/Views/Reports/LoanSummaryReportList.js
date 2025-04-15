$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

(function () {
    $(function () {
        var _sectorservices = abp.services.app.sectorService;
        var _payrollSSSLoanServices = abp.services.app.payrollSSSLoanServices;
        var _employeeLoansService = abp.services.app.employeeLoansService;
        var _$LoanTable = $('#LoanTable');

        $(document).ready(function () {
            getAttd();
        });
        var sectors = $('#sectors');
        sectors.empty();
        sectors.append('<option value = "" >-- Select Company --</option > ');

        _sectorservices.getSector({ filter: "" }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                sectors.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            sectors.selectpicker('refresh');
        });

        $('#sectors').change(function (e) {
            e.preventDefault();
            GetLoanSummay($('#sectors').val(), "");
        });

        $('#Search').click(function (e) {
            e.preventDefault();
            GetLoanSummay($('#sectors').val(), "");
        });

        function GetLoanSummay(comp, loanTitleId) {
            $('#LoanTable').dataTable().fnClearTable();
            var options = { year: 'numeric', month: 'long', day: 'numeric' };

            _employeeLoansService.getSummaryLoanReportList({ filter: comp + "|" + loanTitleId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $loanTitle = result.items[i].loanTitle;
                    var $name = result.items[i].name;
                    var $firstName = result.items[i].firstName;
                    var $empId = result.items[i].empId;
                    var $loanType = result.items[i].loanType;
                    var $fullName = result.items[i].fullName;
                    var $applicationNo = result.items[i].applicationNo;
                    var $middleName = result.items[i].middleName;
                    var $loanAmount = result.items[i].loanAmount;
                    var $DStart = moment(result.items[i].dateStart); //Get the current 
                    var $dateStart = $DStart.format("MM-DD-YYYY");
                    var $End = moment(result.items[i].dateEnd); //Get the current 
                    var $dateEnd = $End.format("MM-DD-YYYY");
                    var $monthlyAmortization = result.items[i].monthlyAmortization;
                    var $paid = result.items[i].address
                    var $address = parseFloat($loanAmount) - parseFloat($paid);


                    var $EloanAmount = result.items[i].loanAmount;
                    var $EmonthlyAmortization = result.items[i].monthlyAmortization;
                    var $Eaddress = parseFloat($loanAmount) - parseFloat($paid);

                    var datacount = LoanTable.rows().count();
                    var itemno = datacount + 1;

                    LoanTable.row.add([itemno, $loanTitle, $name, $firstName.toUpperCase(), $empId, $loanType, $fullName.toUpperCase(), $applicationNo, $middleName, currencyFormat($loanAmount), $dateStart, $dateEnd, currencyFormat($monthlyAmortization), currencyFormat($address), $EloanAmount, $EmonthlyAmortization, $Eaddress]).draw();
                }
            })
        }

        var LoanTable = _$LoanTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            processing: false,

            columnDefs: [
                {
                    "visible": false,
                    targets: [1, 2, 4, 5, 7, 14, 15, 16]
                },
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
                },
                {
                    //render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: [9,12,13]
                }
            ]

            , footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };

                // Total basic
                data = api.column(14, {
                    page: 'current'
                }).data(); pageTotal14 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(9).footer()).html(currencyFormat(pageTotal14));

                // Total basic
                data = api.column(15, {
                    page: 'current'
                }).data(); pageTotal15 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(12).footer()).html(currencyFormat(pageTotal15));

                // Total basic
                data = api.column(16, {
                    page: 'current'
                }).data(); pageTotal16 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(13).footer()).html(currencyFormat(pageTotal16));
            }
        });

        //extract
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('LoanTable', 'LoanSummary', 'LoanSummaryReportList.xls');
        });
        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            console.log(table.innerHTML);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }
        //Print
        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual();
        });
        function printPreviewActual() {
            var divToPrint = document.getElementById("LoanTable");
            var $coveredDate = document.getElementById('coveredDate').innerHTML;
            //NEW
            var win = window.open('');
            win.document.write('<!DOCTYPE html><html><head>');

            win.document.write('<link href="' + abp.appPath + 'css/JournalPayrollPrint.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('<link href="' + abp.appPath + 'css/main.css" rel="stylesheet" asp-append-version="true" />');


            win.document.write('</head>');

            win.document.write('<body>');
            win.document.write('<div class="page-header">');
            win.document.write('<div class="page-title center" style="text-align:left; font-family: sans-serif;font-size: smaller;">');
            win.document.write('<h4>SSS LOAN COLLECTION LIST</h4>');
            win.document.write('</div>');
            win.document.write('<div class="page-title center" style="text-align:left; font-family: sans-serif;font-size: smaller;">');
            win.document.write($coveredDate);
            win.document.write('</div>');
            win.document.write('</div>');

            //win.document.write('<div class="page-footer">');
            //win.document.write('<table style="width:100% ;font-family: sans-serif;font-size:medium;">');
            //win.document.write('<tr>');
            //win.document.write('<td style="width: 35%; text-align:center;font-family: sans-serif;font-size: smaller;">Prepared By : <br><br><br> Anna Liza Tubice<br>HRAD Manager</td>');
            //win.document.write('<td style="width: 33%; text-align:center;font-family: sans-serif;font-size: smaller;">Check By : <br><br><br> Mylin Hernandez<br>Accounting and Finance Manager</td>');
            //win.document.write('<td style="width: 32%; text-align:center;font-family: sans-serif;font-size: smaller;">Check By : <br><br><br> Steve Li<br>General Manager</td>');
            //win.document.write('</tr>');

            win.document.write('</table>');
            win.document.write('</div>');

            win.document.write('<table style="width:100% ;font-family: sans-serif;font-size: small;">');

            win.document.write('<thead>');
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write('<!--place holder for the fixed-position header-->');
            win.document.write('<div class="page-header-space"></div>');
            win.document.write('</td>');
            win.document.write('</tr>');
            win.document.write('</thead>');

            win.document.write('<tbody>');
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write('<!--*** CONTENT GOES HERE ***-->');
            win.document.write('<div class="page">');
            win.document.write(divToPrint.outerHTML);

            win.document.write('</div>');
            win.document.write('</td>');
            win.document.write('</tr>');
            win.document.write('</tbody>');

            win.document.write('<tfoot>');
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write('<!--place holder for the fixed-position footer-->');
            //win.document.write('<div class="page-footer-space"></div>');
            win.document.write('</td>');
            win.document.write(' </tr>');
            win.document.write('</tfoot>');

            win.document.write('</table>');
            win.document.write('</body>');
            win.document.write('</html>');
            //printContents.document.write(printContents);
        }

    });
})(jQuery);