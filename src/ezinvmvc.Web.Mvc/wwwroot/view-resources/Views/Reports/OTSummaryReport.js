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
        var _payrollSSSLoanServices = abp.services.app.payrollSSSLoanServices;
        var _oTRatesService = abp.services.app.oTRatesService;
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
            GetJournalPayroll($('#sectors').val(), $('#dept').val(), $('#attid').val(), "");
        });
        $('#card').change(function (e) {
            e.preventDefault();
            GetJournalPayroll($('#sectors').val(), $('#dept').val(), $('#attid').val(), "");
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
            var empid = "";
            $('#coveredDate').html("Covered&nbsp;Date&nbsp;:&nbsp;[&nbsp;" + period + "&nbsp;]&nbsp;/&nbsp;[&nbsp;" + attid + "&nbsp;]");
            GetJournalPayroll($('#sectors').val(), $('#dept').val(), attid, empid);
        });

        function GetJournalPayroll(comp, dept, attid, empid) {
            $('#LoanTable').dataTable().fnClearTable();

            _oTRatesService.getPayrollOTList({ filter: comp + "|" + dept + "|" + attid + "|" + empid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $comp = result.items[i].status1;
                    var $dept = result.items[i].status2;
                    var $fullname = result.items[i].status3;
                    var $empid = result.items[i].status4;
                    var $attid = result.items[i].status5;
                    var $regural = result.items[i].reguralstring;
                    var $restDay = result.items[i].restDaystring;
                    var $specialHoliday = result.items[i].specialHolidaystring;
                    var $legalHoliday = result.items[i].legalHolidaystring;
                    var $specialHolidayRestday = result.items[i].specialHolidayRestdaystring;
                    var $legalHolidayRestday = result.items[i].legalHolidayRestdaystring;
                    var $reguralOT = result.items[i].reguralOTstring;
                    var $restDayOT = result.items[i].restDayOTstring;
                    var $specialHolidayOT = result.items[i].specialHolidayOTstring;
                    var $legalHolidayOT = result.items[i].legalHolidayOTstring;
                    var $specialHolidayRestdayOT = result.items[i].specialHolidayRestdayOTstring;
                    var $legalHolidayRestdayOT = result.items[i].legalHolidayRestdayOTstring;
                    var $nDRegural = result.items[i].ndReguralstring;
                    var $nDRestDay = result.items[i].ndRestDaystring;
                    var $nDSpecialHoliday = result.items[i].ndSpecialHolidaystring;
                    var $nDLegalHoliday = result.items[i].ndLegalHolidaystring;
                    var $nDSpecialHolidayRestday = result.items[i].ndSpecialHolidayRestdaystring;
                    var $nDLegalHolidayRestday = result.items[i].ndLegalHolidayRestdaystring;
                    var $nDReguralOT = result.items[i].ndReguralOTstring;
                    var $nDRestDayOT = result.items[i].ndRestDayOTstring;
                    var $nDSpecialHolidayOT = result.items[i].ndSpecialHolidayOTstring;
                    var $nDLegalHolidayOT = result.items[i].ndLegalHolidayOTstring;
                    var $nDSpecialHolidayRestdayOT = result.items[i].ndSpecialHolidayRestdayOTstring;
                    var $nDLegalHolidayRestdayOT = result.items[i].ndLegalHolidayRestdayOTstring;

                    if ($regural > ""){
                        var arraya = $regural.split("|");
                        var a = arraya[0];
                    }
                    else {
                        var a = 0.00;
                    }

                    if ($restDay > "") {
                        var arrayb = $restDay.split("|");
                        var b = arrayb[0];
                    }
                    else {
                        var b = 0.00;
                    }

                    if ($specialHoliday > "") {
                        var arrayc = $specialHoliday.split("|");
                        var c = arrayc[0];
                    }
                    else {
                        var c = 0.00;
                    }

                    if ($legalHoliday > "") {
                        var arrayd = $legalHoliday.split("|");
                        var d = arrayd[0];
                    }
                    else {
                        var d = 0.00;
                    }

                    if ($specialHolidayRestday > "") {
                        var arraye = $specialHolidayRestday.split("|");
                        var e = arraye[0];
                    }
                    else {
                        var e = 0.00;
                    }

                    if ($legalHolidayRestday > "") {
                        var arrayf = $legalHolidayRestday.split("|");
                        var f = arrayf[0];
                    }
                    else {
                        var f = 0.00;
                    }

                    if ($reguralOT > "") {
                        var arrayg = $reguralOT.split("|");
                        var g = arrayg[0];
                    }
                    else {
                        var g = 0.00;
                    }

                    if ($restDayOT > "") {
                        var arrayh = $restDayOT.split("|");
                        var h = arrayh[0];
                    }
                    else {
                        var h = 0.00;
                    }

                    if ($specialHolidayOT > "") {
                        var arrayia= $specialHolidayOT.split("|");
                        var ia = arrayia[0];
                    }
                    else {
                        var ia = 0.00;
                    }

                    if ($legalHolidayOT > "") {
                        var arrayj = $legalHolidayOT.split("|");
                        var j = arrayj[0];
                    }
                    else {
                        var j = 0.00;
                    }

                    if ($specialHolidayRestdayOT > "") {
                        var arrayk = $specialHolidayRestdayOT.split("|");
                        var k = arrayk[0];
                    }
                    else {
                        var k = 0.00;
                    }

                    if ($legalHolidayRestdayOT > "") {
                        var arrayl = $legalHolidayRestdayOT.split("|");
                        var l = arrayl[0];
                    }
                    else {
                        var l = 0.00;
                    }

                    if ($nDRegural > "") {
                        var arraym = $nDRegural.split("|");
                        var m = arraym[0];
                    }
                    else {
                        var m = 0.00;
                    }

                    if ($nDRestDay > "") {
                        var arrayn = $nDRestDay.split("|");
                        var n = arrayn[0];
                    }
                    else {
                        var n = 0.00;
                    }

                    if ($nDSpecialHoliday > "") {
                        var arrayo = $nDSpecialHoliday.split("|");
                        var o = arrayo[0];
                    }
                    else {
                        var o = 0.00;
                    }

                    if ($nDLegalHoliday > "") {
                        var arrayp = $nDLegalHoliday.split("|");
                        var p = arrayp[0];
                    }
                    else {
                        var p = 0.00;
                    }

                    if ($nDSpecialHolidayRestday > "") {
                        var arrayq = $nDSpecialHolidayRestday.split("|");
                        var q = arrayq[0];
                    }
                    else {
                        var q = 0.00;
                    }

                    if ($nDLegalHolidayRestday > "") {
                        var arrayr = $nDLegalHolidayRestday.split("|");
                        var r = arrayr[0];
                    }
                    else {
                        var r = 0.00;
                    }

                    if ($nDReguralOT > "") {
                        var arrays = $nDReguralOT.split("|");
                        var s = arrays[0];
                    }
                    else {
                        var s = 0.00;
                    }

                    if ($nDRestDayOT > "") {
                        var arrayt = $nDRestDayOT.split("|");
                        var t = arrayt[0];
                    }
                    else {
                        var t = 0.00;
                    }

                    if ($nDSpecialHolidayOT > "") {
                        var arrayu = $nDSpecialHolidayOT.split("|");
                        var u = arrayu[0];
                    }
                    else {
                        var u = 0.00;
                    }

                    if ($nDLegalHolidayOT > "") {
                        var arrayv = $nDLegalHolidayOT.split("|");
                        var v = arrayv[0];
                    }
                    else {
                        var v = 0.00;
                    }

                    if ($nDSpecialHolidayRestdayOT > "") {
                        var arrayw = $nDSpecialHolidayRestdayOT.split("|");
                        var w = arrayw[0];
                    }
                    else {
                        var w = 0;
                    }

                    if ($nDLegalHolidayRestdayOT > "") {
                        var arrayx = $nDLegalHolidayRestdayOT.split("|");
                        var x = arrayx[0];
                    }
                    else {
                        var x = 0;
                    }
                    var $status = "";

                    //var $status = parseFloat(a) + parseFloat(b) + parseFloat(c) + parseFloat(d) + parseFloat(e) + parseFloat(f) + parseFloat(g) + parseFloat(h) + parseFloat(i) + parseFloat(j) + parseFloat(k) + parseFloat(l) + parseFloat(m) + parseFloat(n) + parseFloat(o) + parseFloat(p) + parseFloat(q) + parseFloat(r) + parseFloat(s) + parseFloat(t) + parseFloat(u) + parseFloat(v) + parseFloat(w) + parseFloat(x);
                    var $status = parseFloat(a) + parseFloat(b) + parseFloat(c) + parseFloat(d) + parseFloat(e) + parseFloat(f) + parseFloat(g) + parseFloat(h) + parseFloat(ia) + parseFloat(j) + parseFloat(k) + parseFloat(l) + parseFloat(m) + parseFloat(n) + parseFloat(o) + parseFloat(p) + parseFloat(q) + parseFloat(r) + parseFloat(s) + parseFloat(t) + parseFloat(u) + parseFloat(v) + parseFloat(w) + parseFloat(x);;

                    var datacount = LoanTable.rows().count();
                    var itemno = datacount + 1;

                    LoanTable.row.add([itemno, $comp, $dept, $fullname, $empid, $attid, $regural, $restDay, $specialHoliday, $legalHoliday, $specialHolidayRestday, $legalHolidayRestday, $reguralOT, $restDayOT, $specialHolidayOT, $legalHolidayOT, $specialHolidayRestdayOT, $legalHolidayRestdayOT, $nDRegural, $nDRestDay, $nDSpecialHoliday, $nDLegalHoliday, $nDSpecialHolidayRestday, $nDLegalHolidayRestday, $nDReguralOT, $nDRestDayOT, $nDSpecialHolidayOT, $nDLegalHolidayOT, $nDSpecialHolidayRestdayOT, $nDLegalHolidayRestdayOT, currencyFormat($status), $status]).draw();

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
                    targets: [5,31]
                },
                {
                    orderable: false,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                },
                {
                    //className: 'text-center',
                    //targets: [0]
                }
            ]

            , footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };

                // Total basic
                data = api.column(31, {
                    page: 'current'
                }).data(); pageTotal31 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(30).footer()).html(currencyFormat(pageTotal31));

            //    // Total basic
            //    data = api.column(14, {
            //        page: 'current'
            //    }).data(); pageTotal14 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer basic
            //    $(api.column(11).footer()).html(currencyFormat(pageTotal14));
            }
        });

        //extract
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('LoanTable', 'OTSummary', 'OTSummaryReport.xls');
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
        function printPreviewActual222() {
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
            win.document.write('<h4>OT SUMMARY REPORT</h4>');
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
        function printPreviewActual() {
            var date = new Date();
            var divToPrint = document.getElementById("LoanTable");
            var $rundate = date.toLocaleDateString();
            var $coveredDate = document.getElementById('coveredDate').innerHTML;

            //NEW
            var win = window.open('');
            var printContents = `<!DOCTYPE html>
                                <html>
                                <head>
                                    <!-- Edited by Erwin -->
                                   
                                    <style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; margin-top:1.5in; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } .xfooter {width: 970px; position: absolute; height:4.5in; bottom: 0;  }</style>
                                    <style>

                                        .sortTable1 td {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        font-size: small;
                                        font-family: sans-serif;
                                        }
                                        .table th, .table td {
                                        padding: 1px;
                                        line-height: 12px;
                                        text-align: left;
                                        vertical-align: top;
                                        border-top: 1px solid #a1a1a1;
                                        border-left: 1px solid #ffffff;
                                        font-size: smaller;
                                        border-collapse:collapse;

                                        }
                                    </style>

                                    <title>OT SUMMARY REPORT</title>
                                </head><body>
                                `;
            //printContents += '<div style="text-align: left; font-weight: 700; width:100%; font-size: 12px;font-family: sans-serif;">MFT INTERNATIONAL CORP</div>';
            printContents += '<div style="text-align: left; font-weight: 700; font-size: x-small; width:100%;font-family: sans-serif;">Overtime Summary Report</div>';
            printContents += '<div style="text-align: left; font-weight: 700; width:100%; font-size: 11px;font-family: sans-serif;">' + $coveredDate + '</div>';
            //printContents += '<div style="text-align: center; font-weight: 700;">10/26/2023 - 11/10/2023</div>';

            printContents += divToPrint.outerHTML;

            printContents += `</body></html>`;

            win.document.write(printContents);
        }


    });
})(jQuery);