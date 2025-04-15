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
        var _empSalariesServices = abp.services.app.empSalariesServices;
        var _$AttendanceTable = $('#AttendanceTable');
        var _$AttadjTable = $('#AttadjTable');
        var _$hiddenform = $('form[name=hiddenform]');

        $(document).ready(function () {

            $('#dept').val();
            $('#attid').val();
        });

        var dataTable = _$AttadjTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _empSalariesServices.getOTSalaryList,
                inputFilter: function () {
                    var $a = 'null';
                    var $b = 'null';
                    var $c = $('#dept').val();
                    var $d = $('#attid').val();
                    var $e = 'null';

                    return {
                        filter: $a + '|' + $b + '|' + $c + '|' + $d + '|' + $e
                    };
                }
            },
            columnDefs: [

                {
                    className: 'control responsive',

                    visible: false,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    visible: false,
                    targets: 1,
                    data: "empId"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "aYear"
                },
                {
                    visible: false,
                    targets: 3,
                    data: "startDate"
                },
                {
                    visible: false,
                    targets: 4,
                    data: "amonth"
                },
                {
                    targets: 5,
                    data: "halfmonth",
                    class: "text-nowrap"
                },
                {
                    targets: 6,
                    data: "aWeek"
                },
                {
                    targets: 7,
                    data: "payrollRatePerDay"
                },
                {
                    targets: 8,
                    data: "aDay"
                },
                {
                    targets: 9,
                    data: "payrollRatePerHour",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 10,
                    data: "description"
                },
                {
                    targets: 11,
                    data: "undertime",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                }
            ]
            , footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };
                
                // Total over this page utime
                data = api.column(11, {
                    page: 'current'
                }).data(); pageTotal11 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer abscense
                $(api.column(11).footer()).html(currencyFormat(pageTotal11));

            }

        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }

        var dataTable2 = _$AttendanceTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": true,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAttRecord,
                inputFilter: function () {
                    var $a = 'null';
                    var $b = 'null';
                    var $c = 'null';
                    var $d = 'null';

                    return {
                        filter: $a + '|' + $b + '|' + $c + '|' + $d
                    };
                }
            },
            columnDefs: [

                {
                    //className: 'control responsive',
                    targets: 0,
                    data: "dateT",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    //className: 'control responsive',
                    targets: 0,
                    data: "endDate",
                    "render": function (data) {
                        var dt2 = new Date(data);
                        return getFormattedDate(dt2);
                    }
                },
                {
                    targets: 1,
                    data: "attendanceId"
                },
                {
                    targets: 2,
                    data: "department"
                },

                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", department: "department", dateT: "dateT", endDate: "endDate" },
                    "render": function (data) {
                        return '<a id="view-attendanceId" title="View Data" class="view-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-companyName="' + data.department + '" data-attendanceId-dateT="' + data.dateT + '"data-attendanceId-endDate="' + data.endDate + '"><i class="fa fa-md fa-search"></i></a> ';
                    }
                }
            ]
        });

        function GetTable() {
            dataTable2.ajax.reload();
        }

        $('#AttendanceTable').on('click', 'a.view-attendanceId', function (e) {
            e.preventDefault();
            $('#attid').val("");
            $('#dept').val("");
            $('#Cutoff').html("");
            $('#coveredDate').html("");
            var Id = $(this).attr("data-attendanceId-id");
            var company = $(this).attr("data-attendanceId-companyName");
            var endDate = $(this).attr("data-attendanceId-endDate");
            var dateT = $(this).attr("data-attendanceId-dateT");

            var $endDate = new Date(endDate);
            var Tenddate = getFormattedDate($endDate);

            var $dateT = new Date(dateT);
            var SDate = getFormattedDate($dateT);

            var today = new Date(SDate);
            var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var month = today.getMonth();
            var monthName = monthNames[month];
            $('#attid').val(Id);
            $('#dept').val(company);

            $('#coveredDate').html("Covered&nbsp;Date&nbsp;:&nbsp;[&nbsp;" + SDate + " - " + Tenddate + "&nbsp;]");
            $('#Company').html("MFT&nbsp;INTERNATIONAL&nbsp;CORP&nbsp;-&nbsp;(" + company.toUpperCase() + ")");
            GetAttendanceTable();

            _bioAttendanceService.getById({ attendanceId: Id }).done(function (result) {
                var cutc = result.enTitlement;
                if (cutc == "1") {
                    $('#Cutoff').html("First Half of&nbsp;" + monthName + "&nbsp;" + today.getFullYear());
                }
                if (cutc == "2") {
                    $('#Cutoff').html("Second Half of&nbsp;" + monthName + "&nbsp;" + today.getFullYear());
                }
            })
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('AttadjTable', 'AttadjTable', 'OTAdjSummaryReport.xls');
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
            var divToPrint = document.getElementById("AttadjTable");
            var $Cutoff = document.getElementById('Cutoff').innerHTML;
            var $Company = document.getElementById('Company').innerHTML;
            var $coveredDate = document.getElementById('coveredDate').innerHTML;
            //NEW
            var win = window.open('');
            win.document.write('<!DOCTYPE html><html><head>');
            win.document.write('<link href="' + abp.appPath + 'css/JournalPayrollPrint.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('<link href="' + abp.appPath + 'css/main.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('</head>');

            win.document.write('<body>');
            win.document.write('<div class="page-title center" style="text-align:center">');
            win.document.write('<h4>OT Adjustment Summary Report</h4>');
            win.document.write('</div >');
            win.document.write('<div class="page-title center" style="text-align:center">');
            win.document.write($Cutoff);
            win.document.write('</div>');
            win.document.write('<div class="page-title center" style="text-align:center">');
            win.document.write('<h4>ACTIVE ONLY</h4>');
            win.document.write('</div>');
            win.document.write('<div class="page-title center" style="text-align:left">');
            win.document.write($coveredDate);
            win.document.write('</div>');
            win.document.write('<div class="page-title center" style="text-align:left">');
            win.document.write($Company);
            win.document.write('</div>');

            win.document.write(divToPrint.outerHTML);

            win.document.write('</body>');
            win.document.write('</html>');
        }

        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual2();
        });
    });
})(jQuery);