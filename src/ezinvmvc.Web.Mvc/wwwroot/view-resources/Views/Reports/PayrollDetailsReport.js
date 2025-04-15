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
                ajaxFunction: _payrollIServices.getPayrollDetails,
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
                    visible: true,
                    targets: 1,
                    data: "department",
                    class: "text-nowrap"
                },
                {
                    visible: true,
                    targets: 2,
                    data: "empCode"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "lastName",
                    class: "text-nowrap"
                },
                {
                    visible: true,
                    targets: 4,
                    data: "ratePerMonth",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 5,
                    data: "basicSalaryAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 6,
                    data: "absensesAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 7,
                    data: "tardinessAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 8,
                    data: "undertimeAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 9,
                    data: "payrollPeriod"
                },
                {
                    targets: 10,
                    data: "firstName"
                },
                {
                    targets: 11,
                    data: "rgotAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 12,
                    data: "leaveTotalAmout",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 13,
                    data: "attAdjs",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 14,
                    data: "allowanceAdjs",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 15,
                    data: "generalAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 16,
                    data: "nonGeneralAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 17,
                    data: "grossAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 18,
                    data: "ssseeAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 19,
                    data: "philhealthEEAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 20,
                    data: "pagibigEEAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 21,
                    data: "loansAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 22,
                    data: "taxableAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 23,
                    data: "percent",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 24,
                    data: "netIncome",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
            ],
            //    footerCallback: function (row, data, start, end, display) {
            //        var api = this.api(), data;
            //        // Remove the formatting to get integer data for summation
            //        var intVal = function (i) {
            //            return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
            //        };

            //        // Total basic
            //        data = api.column(4, {
            //            page: 'current'
            //        }).data(); pageTotal4 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer basic
            //        $(api.column(4).footer()).html(currencyFormat(pageTotal4));

            //        // Total basic
            //        data = api.column(5, {
            //            page: 'current'
            //        }).data(); pageTotal5 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer basic
            //        $(api.column(5).footer()).html(currencyFormat(pageTotal5));

            //        // Total basic
            //        data = api.column(6, {
            //            page: 'current'
            //        }).data(); pageTotal6 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer basic
            //        $(api.column(6).footer()).html(currencyFormat(pageTotal6));

            //        // Total basic
            //        data = api.column(7, {
            //            page: 'current'
            //        }).data(); pageTotal7 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer basic
            //        $(api.column(7).footer()).html(currencyFormat(pageTotal7));

            //        // Total basic
            //        data = api.column(8, {
            //            page: 'current'
            //        }).data(); pageTotal8 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer basic
            //$(api.column(8).footer()).html(currencyFormat(pageTotal8));


            //        // Total over this page abscense
            //        data = api.column(9, {
            //            page: 'current'
            //        }).data(); pageTotal9 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(9).footer()).html(currencyFormat(pageTotal9));

            //        // Total over this page late
            //        data = api.column(10, {
            //            page: 'current'
            //        }).data(); pageTotal10 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(10).footer()).html(currencyFormat(pageTotal10));

            //        // Total over this page late
            //        data = api.column(11, {
            //            page: 'current'
            //        }).data(); pageTotal11 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(11).footer()).html(currencyFormat(pageTotal11));

            //        // Total over this page late
            //        data = api.column(12, {
            //            page: 'current'
            //        }).data(); pageTotal12 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(12).footer()).html(currencyFormat(pageTotal12));

            //        // Total over this page late
            //        data = api.column(13, {
            //            page: 'current'
            //        }).data(); pageTotal13 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(13).footer()).html(currencyFormat(pageTotal13));

            //        // Total over this page late
            //        data = api.column(14, {
            //            page: 'current'
            //        }).data(); pageTotal14 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(14).footer()).html(currencyFormat(pageTotal14));

            //        // Total over this page late
            //        data = api.column(15, {
            //            page: 'current'
            //        }).data(); pageTotal15 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(15).footer()).html(currencyFormat(pageTotal15));

            //        // Total over this page late
            //        data = api.column(16, {
            //            page: 'current'
            //        }).data(); pageTotal16 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(16).footer()).html(currencyFormat(pageTotal16));

            //        // Total over this page late
            //        data = api.column(17, {
            //            page: 'current'
            //        }).data(); pageTotal17 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(17).footer()).html(currencyFormat(pageTotal17));

            //        // Total over this page late
            //        data = api.column(18, {
            //            page: 'current'
            //        }).data(); pageTotal18 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(18).footer()).html(currencyFormat(pageTotal18));

            //        // Total over this page late
            //        data = api.column(19, {
            //            page: 'current'
            //        }).data(); pageTotal19 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(19).footer()).html(currencyFormat(pageTotal19));

            //        // Total over this page late
            //        data = api.column(20, {
            //            page: 'current'
            //        }).data(); pageTotal20 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(20).footer()).html(currencyFormat(pageTotal20));

            //        // Total over this page late
            //        data = api.column(21, {
            //            page: 'current'
            //        }).data(); pageTotal21 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(21).footer()).html(currencyFormat(pageTotal21));

            //        // Total over this page late
            //        data = api.column(22, {
            //            page: 'current'
            //        }).data(); pageTotal22 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(22).footer()).html(currencyFormat(pageTotal22));

            //        // Total over this page late
            //        data = api.column(23, {
            //            page: 'current'
            //        }).data(); pageTotal23 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(23).footer()).html(currencyFormat(pageTotal23));

            //        // Total over this page late
            //        data = api.column(24, {
            //            page: 'current'
            //        }).data(); pageTotal24 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
            //        // Update footer abscense
            //        $(api.column(24).footer()).html(currencyFormat(pageTotal24));
            //    }
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

                total = api.column(14).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(14, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(14).footer().innerHTML = currencyFormat(total);

                total = api.column(15).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(15, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(15).footer().innerHTML = currencyFormat(total);

                total = api.column(16).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(16, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(16).footer().innerHTML = currencyFormat(total);

                total = api.column(17).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(17, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(17).footer().innerHTML = currencyFormat(total);

                total = api.column(18).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(18, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(18).footer().innerHTML = currencyFormat(total);

                total = api.column(19).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(19, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(19).footer().innerHTML = currencyFormat(total);

                total = api.column(20).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(20, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(20).footer().innerHTML = currencyFormat(total);

                total = api.column(21).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(21, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(21).footer().innerHTML = currencyFormat(total);

                total = api.column(22).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(22, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(22).footer().innerHTML = currencyFormat(total);

                total = api.column(23).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(23, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(23).footer().innerHTML = currencyFormat(total);

                total = api.column(24).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(24, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(24).footer().innerHTML = currencyFormat(total);


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

            win.document.write('<STYLE type="text/css">');
            win.document.write('@page');
            win.document.write('{');
            win.document.write('size: landscape;');
            win.document.write('}');
            win.document.write('@media print{');
            win.document.write('@page {');
            win.document.write('size: landscape');
            win.document.write('margin-left:0.0cm');
            win.document.write('margin-right:0.0cm');
            win.document.write('}');
            win.document.write('}');
            win.document.write('@media print{');
            win.document.write('.class-name{');
            win.document.write('@page{');
            win.document.write('size:landscape;');
            win.document.write('}');
            win.document.write('}');
            win.document.write('}');
            win.document.write('</STYLE>');
            win.document.write('<STYLE type="text/css" media="print">');
            win.document.write('@page { size: landscape; }');
            win.document.write('</STYLE>');

            win.document.write('</head>');           

            win.document.write('<body>');
            win.document.write('<div class="page-title center" style="text-align:center">');
            win.document.write('<h4>Payroll Detail Report</h4>');
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
        //Export
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('AttadjTable', 'AttadjTable',' PayrollDetails.xls');
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
    });
})(jQuery);