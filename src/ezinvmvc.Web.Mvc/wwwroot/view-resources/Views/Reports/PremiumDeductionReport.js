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
        var _bioAttendanceService = abp.services.app.bioAtt2Service;
        var _empContributionService = abp.services.app.empContributionService;
        var _sectorservices = abp.services.app.sectorService;
        var _payrollSSSLoanServices = abp.services.app.payrollSSSLoanServices;
        var _$AttendanceTable = $('#AttendanceTable');
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
            GetJournalPayroll($('#attid').val(), $('#sectors').val(),"");
        });
        function getAttd() {
            _bioAttendanceService.getAttList().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $attendanceId = result.items[i].attendanceId;
                    var $startdate = result.items[i].startDate;
                    var $enddate = result.items[i].endDate;

                    var start = new Date($startdate);
                    var $start = getFormattedDate(start);

                    var end = new Date($enddate);
                    var $end = getFormattedDate(end);

                    var $period = $start + " - " + $end;

                    var datacount = dataTable.rows().count();
                    var itemno = datacount + 1;

                    dataTable.row.add([itemno, $attendanceId, $period, '<a id="view-item" class="view-item" title="view" href="#" data-attid="' + $attendanceId + '"  data-period="' + $period + '"><i class="fa fa-edit"></i></a>']).draw();
                }
            });
        };

        var dataTable = _$AttendanceTable.DataTable({
            responsive: true,
            paging: true,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    orderable: true,
                    targets: [0, 1, 2]
                }
            ]
        });

        $('#AttendanceTable').on('click', 'a.view-item', function (e) {
            e.preventDefault();
            $('#attid').val("");
            $('#dept').val("");
            $('#Cutoff').html("");
            $('#coveredDate').html("");
            var attid = $(this).attr("data-attid");
            var period = $(this).attr("data-period");
            $('#AttList').modal('hide')
            $('#attid').val(attid);
            $('#period').val(period);
            $('#coveredDate').html("Covered&nbsp;Date&nbsp;:&nbsp;[&nbsp;" + period + "&nbsp;]&nbsp;/&nbsp;[&nbsp;" + attid + "&nbsp;]");
            GetJournalPayroll(attid, $('#sectors').val(), "");
        });

        function GetJournalPayroll(attid, comp, dept) {
            $('#LoanTable').dataTable().fnClearTable();
            _empContributionService.getPremiumDeduction({ filter: attid + "|" + comp + "|" + dept }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sssType = result.items[i].sssType;
                    var $name = result.items[i].description4;
                    var $description3 = result.items[i].description3;
                    var $pagibigType = result.items[i].pagibigType;
                    var $description1 = result.items[i].description1;
                    var $description2 = result.items[i].description2;
                    var $sssER = result.items[i].ssser;
                    var $sssEE = result.items[i].sssee;
                    var $philHealthER = result.items[i].philHealthER;
                    var $philHealthEC = result.items[i].philHealthEC;
                    var $pagibigER = result.items[i].pagibigER;
                    var $pagibigEC = result.items[i].pagibigEC;
                    var $taxHeld = result.items[i].wTaxEC;

                    var datacount = LoanTable.rows().count();
                    var itemno = datacount + 1;

                    LoanTable.row.add([itemno, $sssType, $name, $description3, $pagibigType, $description1.toUpperCase(), $description2.toUpperCase(), $sssER, $sssEE, $philHealthER, $philHealthEC, $pagibigER, $pagibigEC, $taxHeld, $sssER, $sssEE, $philHealthER, $philHealthEC, $pagibigER, $pagibigEC, $taxHeld]).draw();

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
                    targets: [1, 2, 3, 14, 15, 16, 17, 18, 19, 20]
                },
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: [7, 8, 9, 10, 11, 12, 13]
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
                $(api.column(7).footer()).html(currencyFormat(pageTotal14));

                // Total basic
                data = api.column(15, {
                    page: 'current'
                }).data(); pageTotal15 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(8).footer()).html(currencyFormat(pageTotal15));

                // Total basic
                data = api.column(16, {
                    page: 'current'
                }).data(); pageTotal16 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(9).footer()).html(currencyFormat(pageTotal16));

                // Total basic
                data = api.column(17, {
                    page: 'current'
                }).data(); pageTotal17 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(10).footer()).html(currencyFormat(pageTotal17));

                // Total basic
                data = api.column(18, {
                    page: 'current'
                }).data(); pageTotal18 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(11).footer()).html(currencyFormat(pageTotal18));

                // Total basic
                data = api.column(19, {
                    page: 'current'
                }).data(); pageTotal19 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(12).footer()).html(currencyFormat(pageTotal19));

                // Total basic
                data = api.column(20, {
                    page: 'current'
                }).data(); pageTotal20 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(13).footer()).html(currencyFormat(pageTotal20));
            }
        });

        //extract
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('LoanTable', 'Premium Deduction', 'PremiumDeduction.xls');
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
            win.document.write('<h4>PREMIUM DEDUCTION REPORT</h4>');
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