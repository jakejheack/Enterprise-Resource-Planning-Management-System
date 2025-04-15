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
        var _payrollIServices = abp.services.app.payrollIServices;
        var _sectorservices = abp.services.app.sectorService;
        var _$AttendanceTable = $('#AttendanceTable');
        var _$PayrollTable = $('#PayrollTable');
        var _$PayrollTable2 = $('#PayrollTable2');

        $(document).ready(function () {
            getAttd();
        });
        var sectors = $('#sectors');
        sectors.empty();
        sectors.append('<option value = "" >-- Select Company --</option > ');
        _sectorservices.getSector({ filter: "" }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                sectors.append('<option value=' + result.items[i].name + '>' + result.items[i].name + '</option>');
            }
            sectors.selectpicker('refresh');
        });
        $('#sectors').change(function (e) {
            e.preventDefault();
            GetJournalPayroll($('#attid').val(), $('#card').val(), $('#sectors').val());
        });
        $('#card').change(function (e) {
            e.preventDefault();
            GetJournalPayroll($('#attid').val(), $('#card').val(), $('#sectors').val());
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

            $('#attid').val(attid);
            $('#period').val(period);
            $('#coveredDate').html("Covered&nbsp;Date&nbsp;:&nbsp;[&nbsp;" + period + "&nbsp;]&nbsp;/&nbsp;[&nbsp;" + attid + "&nbsp;]");
            GetJournalPayroll(attid, $('#card').val(), $('#sectors').val());
        });

        function GetJournalPayroll(attids, card, sectors) {
            $('#PayrollTable').dataTable().fnClearTable();
            $('#PayrollTable2').dataTable().fnClearTable();
            if (attids == '') {
                attids = "0";
            }
            _payrollIServices.getPayrollJournalDetailList({ filter: attids + "|" + sectors + "|||" + card }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $attId = result.items[i].attId;
                    var $description1 = result.items[i].description1;
                    var $empId = result.items[i].empId;
                    var $employeeCode = result.items[i].empCode;
                    var $description2 = result.items[i].description2;
                    var $description3 = result.items[i].description3;
                    var $firstName = result.items[i].firstName;
                    var $lastName = result.items[i].lastName;
                    var $net = result.items[i].netIncome;
                    var $netdisplay = currencyFormat($net);
                    var $netIncome = result.items[i].netIncome;

                    var $department = result.items[i].department;
                    var datacount = PayrolldataTable.rows().count();
                    var itemno = datacount + 1;

                    var datacount2 = PayrolldataTable2.rows().count();
                    var itemno2 = datacount2 + 1;

                    PayrolldataTable.row.add([itemno, $attId, $description1.toUpperCase(), $department.toUpperCase(), $empId, $employeeCode, $description2.toUpperCase(), $firstName.toUpperCase(), $lastName.toUpperCase(), $netdisplay, $netIncome,"",""]).draw();
                    PayrolldataTable2.row.add([itemno2, $attId, $description1.toUpperCase(), $department.toUpperCase(), $empId, $employeeCode, $description2.toUpperCase(), $firstName.toUpperCase(), $lastName.toUpperCase(), $netdisplay, $netIncome, "", ""]).draw();

                }
            })

        }

        var PayrolldataTable = _$PayrollTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    "visible": false,
                    targets: [0, 1, 4,7, 8, 9,10]
                },
                {
                    orderable: false,
                    targets: [0, 1, 2, 3,  5, 6, 9, 10, 11, 12]
                },
                {
                    className: 'text-center',
                    targets: [0]
                }
            ]

            , footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };

                // Total basic
                data = api.column(10, {
                    page: 'current'
                }).data(); pageTotal10 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(9).footer()).html(currencyFormat(pageTotal10));
            }
        });

        var PayrolldataTable2 = _$PayrollTable2.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    "visible": false,
                    targets: [0, 1, 4, 7, 8,10]
                },
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12]
                },
                {
                    className: 'text-center',
                    targets: [0]
                }
            ]

            , footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };

                // Total basic
                data = api.column(10, {
                    page: 'current'
                }).data(); pageTotal10 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(9).footer()).html(currencyFormat(pageTotal10));
            }
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('PayrollTable', 'PayrollJournal', 'PayrollJournal.xls');
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
        function printPreviewActual2() {
            var divToPrint = document.getElementById("PayrollTable");
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
            win.document.write('<h4>Payroll Acknowledgement</h4>');
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

        $('#PrintActualButton2').click(function (e) {
            e.preventDefault();
            printPreviewNetpay();
        });

        //Print
        function printPreviewNetpay() {
            var divToPrint2 = document.getElementById("PayrollTable2");
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
            win.document.write('<h4>Payroll Acknowledgement</h4>');
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
            win.document.write(divToPrint2.outerHTML);

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

        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual2();
        });

    });
})(jQuery);