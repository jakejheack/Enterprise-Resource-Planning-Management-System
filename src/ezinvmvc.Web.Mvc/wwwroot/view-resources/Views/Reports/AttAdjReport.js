$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
function cutNumber(number, digitsAfterDot) {
    const str = `${number}`;

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1);
}

(function () {
    $(function () {
        var _bioAttendanceService = abp.services.app.bioAtt2Service;
        var _$AttendanceTable = $('#AttendanceTable');
        var _$AttadjTable = $('#AttadjTable');
        var _$hiddenform = $('form[name=hiddenform]');

        $(document).ready(function () {
            GetAttendanceTable();
        });

        var dataTable = _$AttadjTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAttAdjustmentReport,
                inputFilter: function () {
                    var $a = "";
                    var $b = $('#attid').val();
                    var $c = $('#dept').val();
                    if ($a === '') {
                        $a = 'null';
                    }
                    return {
                        filter: $a + '|' + $b + '|' + $c
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

                    visible: true,
                    targets: 1,
                    data: "department"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "attendanceId"
                },
                {
                    targets: 3,
                    data: "no"
                },
                {
                    targets: 4,
                    data: "name"
                },
                {
                    targets: 5,
                    data: "description1",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 6,
                    data: "description2",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    data: "late",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    data: "uTime",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }, 
                {
                    targets: 9,
                    data: "description3",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 10,
                    data: "enTitlement",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                }, 
                {
                    targets: 11,
                    data: "description4",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 12,
                    data: "days",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 13,
                    data: "attId",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },

            ],
            //footerCallback: function (row, data, start, end, display)
            //{
            //    var api = this.api(), data;
            //    // Remove the formatting to get integer data for summation
            //    var intVal = function (i) {return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;};

            //    data = api.column(5, {
            //        page: 'current'
            //    }).data(); pageTotal5 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer basic
            //    $(api.column(5).footer()).html(cutNumber(pageTotal5, 2));

            //    // Total over this page abscense
            //    data = api.column(6, {
            //        page: 'current'
            //    }).data(); pageTotal6 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(6).footer()).html(cutNumber(pageTotal6, 2));

            //    // Total over this page late
            //    data = api.column(7, {
            //        page: 'current'
            //    }).data(); pageTotal7 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(7).footer()).html(cutNumber(pageTotal7, 2));

            //    // Total over this page utime
            //    data = api.column(8, {
            //        page: 'current'
            //    }).data(); pageTotal8 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(8).footer()).html(cutNumber(pageTotal8, 2));

            //    // Total over this page Others
            //    data = api.column(9, {
            //        page: 'current'
            //    }).data(); pageTotal9 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(9).footer()).html(cutNumber(pageTotal9, 2));

            //    // Total over this page Total
            //    data = api.column(10, {
            //        page: 'current'
            //    }).data(); pageTotal10 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(10).footer()).html(cutNumber(pageTotal10, 2));

            //    // Total over this page Total
            //    data = api.column(11, {
            //        page: 'current'
            //    }).data(); pageTotal11 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(11).footer()).html(cutNumber(pageTotal11, 2));

            //    // Total over this page Total
            //    data = api.column(12, {
            //        page: 'current'
            //    }).data(); pageTotal12 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(12).footer()).html(cutNumber(pageTotal12, 2));

            //    // Total over this page Total
            //    data = api.column(13, {
            //        page: 'current'
            //    }).data(); pageTotal13 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //    // Update footer abscense
            //    $(api.column(13).footer()).html(cutNumber(pageTotal13, 2));

            //},

            //new footer

            footerCallback: function (row, data, start, end, display) {
                let api = this.api();
                // Remove the formatting to get integer data for summation
                let intVal = function (i) {
                    return typeof i === 'string'
                        ? i.replace(/[\$,]/g, '') * 1
                        : typeof i === 'number'
                            ? i
                            : 0;
                };
                // Total over all pages
                total = api.column(5).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(5, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(5).footer().innerHTML = currencyFormat(total);

                total = api.column(6).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(6, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(6).footer().innerHTML = currencyFormat(total);

                total = api.column(7).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(7, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(7).footer().innerHTML = currencyFormat(total);

                total = api.column(8).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(8, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(8).footer().innerHTML = currencyFormat(total);

                total = api.column(9).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(9, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(9).footer().innerHTML = currencyFormat(total);

                total = api.column(10).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(10, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(10).footer().innerHTML = currencyFormat(total);

                total = api.column(11).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(11, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(11).footer().innerHTML = currencyFormat(total);

                total = api.column(12).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(12, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(12).footer().innerHTML = currencyFormat(total);

                total = api.column(13).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(13, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(13).footer().innerHTML = currencyFormat(total);
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
            var endDate = $(this).attr("data-attendanceId-endDate");
            var dateT = $(this).attr("data-attendanceId-dateT");
            var company = $(this).attr("data-attendanceId-companyName");

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

            $('#AttadjTable').dataTable().fnClearTable();
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
            tableToExcel('AttadjTable', 'AttadjTable', 'AttAdjReport.xls');
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
            win.document.write('<h4>Attendance Adjustment Report</h4>');
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