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

    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/roboto/roboto.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/bootstrap.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/jquery-ui.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/font-awesome.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/cs-skin-elastic.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/Shared/_Layout.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/style.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/main.css" type="text/css" />');

    docprint.document.write('<link rel="stylesheet" href="~/fonts/roboto/roboto.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/css/bootstrap.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/css/jquery-ui.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/lib/font-awesome/css/font-awesome.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/css/cs-skin-elastic.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/view-resources/Views/Shared/_Layout.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/css/style.css" type="text/css" />');

    docprint.document.write('<link rel="stylesheet" href="~/lib/datatables.net-bs4/css/dataTables.bootstrap4.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/lib/datatables.net-responsive-bs4/css/responsive.bootstrap4.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="~/common/scripts/Datatables/datatables.css" type="text/css" />');

    docprint.document.write('<style type="text/css">body{ margin:0px;');

    docprint.document.write('font-family:verdana,Arial;color:#000;');
    docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
    docprint.document.write('a{color:#000;text-decoration:none;} </style>');
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
                ajaxFunction: _payrollIServices.getAttAdjSummary,
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
                    data: "lastName"
                },
                {
                    visible: true,
                    targets: 2,
                    data: "firstName"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "basicSalaryCurrent"
                },
                {
                    visible: true,
                    targets: 4,
                    data: "absensesCurrent"
                },
                {
                    targets: 5,
                    data: "tardinessCurrent"
                },
                {
                    targets: 6,
                    data: "undertimeCurrent"
                },
                {
                    targets: 7,
                    data: "middleName"
                },
                {
                    targets: 8,
                    data: "payrollPeriod"
                },
                {
                    targets: 9,
                    data: "payrollSalaryPeriod"
                },
                {
                    targets: 10,
                    data: "empCode"
                }
            ]
            , footerCallback: function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };

                // Total over this page utime
                data = api.column(10, {
                    page: 'current'
                }).data(); pageTotal10 = data.length ? data.reduce(function (a, b) { return intVal(a) + intVal(b); }) : 0;
                // Update footer abscense
                $(api.column(10).footer()).html(pageTotal10);

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

            var today = new Date(dateT);
            var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var month = today.getMonth() + 1;
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
    });
})(jQuery);