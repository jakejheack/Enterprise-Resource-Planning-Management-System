$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

function PrintMe(PrintTable3) {
    var disp_setting = "toolbar=yes,location=no,";
    disp_setting += "directories=yes,menubar=yes,";
    disp_setting += "scrollbars=yes,width=800, height=1000, left=100, top=25";
    var content_vlue = document.getElementById('PrintTable3').innerHTML;
    var docprint = window.open("", "", disp_setting);
    docprint.document.open();
    docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
    docprint.document.write('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
    docprint.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
    docprint.document.write('<head><title>Print</title>');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/roboto/roboto.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/bootstrap.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/jquery-ui.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/font-awesome.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/cs-skin-elastic.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/Shared/_Layout.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/style.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/main.css" type="text/css" />');

    //docprint.document.write('<link rel="stylesheet" href="http://localhost/roboto/roboto.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/css/bootstrap.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/css/jquery-ui.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/css/font-awesome.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/css/cs-skin-elastic.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/Shared/_Layout.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/css/style.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://localhost/css/main.css" type="text/css" />');

    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/roboto/roboto.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/bootstrap.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/jquery-ui.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/font-awesome.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/cs-skin-elastic.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/Shared/_Layout.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/style.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/main.css" type="text/css" />');

    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/roboto/roboto.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/css/bootstrap.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/css/jquery-ui.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/css/font-awesome.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/css/cs-skin-elastic.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/Shared/_Layout.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/css/style.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/erp/css/main.css" type="text/css" />');

    docprint.document.write('<style type="text/css">body{ margin:0px;');
    docprint.document.write('font-family:verdana,Arial;color:#000;');
    docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:11px;}');
    docprint.document.write('a{color:#000;text-decoration:none;} </style>');
    //docprint.document.write('</head><body onLoad="self.print()" style="padding-right: 30%;"><Left>');
    docprint.document.write('</head><body onLoad="self.print()"><Left>');
    docprint.document.write(content_vlue);
    docprint.document.write('</center></body></html>');
    docprint.document.close();
    docprint.focus();
}


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
                ajaxFunction: _payrollIServices.getPhlhltSummary,
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
                    data: "payrollPeriod"
                },
                {
                    visible: false,
                    targets: 3,
                    data: "attId"
                },
                {
                    visible: true,
                    targets: 4,
                    data: "department"
                },
                {
                    targets: 5,
                    data: "empCode"
                },
                {
                    targets: 6,
                    data: "firstName"
                },
                {
                    targets: 7,
                    data: "middleName"
                },
                {
                    targets: 8,
                    data: "philhealthEEAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 9,
                    data: "philhealthERAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    targets: 10,
                    data: "philhealthTotalAmount",
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

                // Total basic
                data = api.column(8, {
                    page: 'current'
                }).data(); pageTotal8 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer basic
                $(api.column(8).footer()).html(currencyFormat(pageTotal8));


                // Total over this page abscense
                data = api.column(9, {
                    page: 'current'
                }).data(); pageTotal9 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer abscense
                $(api.column(9).footer()).html(currencyFormat(pageTotal9));

                // Total over this page late
                data = api.column(10, {
                    page: 'current'
                }).data(); pageTotal10 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer abscense
                $(api.column(10).footer()).html(currencyFormat(pageTotal10));
              
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

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('AttadjTable', 'PhilHealthTable', 'PhilHealthSummaryReport.xls');
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
            win.document.write('<h4>Phil-Health Summary Report</h4>');
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