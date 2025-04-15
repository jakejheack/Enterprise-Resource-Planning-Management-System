$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});


function PrintMe(PrintTable) {
    var disp_setting = "toolbar=yes,location=no,";
    disp_setting += "directories=yes,menubar=yes,";
    disp_setting += "scrollbars=yes,width=800, height=1000, left=100, top=25";
    var content_vlue = document.getElementById('PrintTable').innerHTML;
    var docprint = window.open("", "", disp_setting);
    docprint.document.open();
    docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
    docprint.document.write('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
    docprint.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
    docprint.document.write('<head><title>Print</title>');

    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/roboto/roboto.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/bootstrap.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/jquery-ui.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/font-awesome.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/cs-skin-elastic.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/Shared/_Layout.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/style.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost:62114/css/main.css" type="text/css" />');

    docprint.document.write('<link rel="stylesheet" href="http://localhost/roboto/roboto.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/css/bootstrap.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/css/jquery-ui.min.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/css/font-awesome.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/css/cs-skin-elastic.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/Shared/_Layout.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/css/style.css" type="text/css" />');
    docprint.document.write('<link rel="stylesheet" href="http://localhost/css/main.css" type="text/css" />');

    ////docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/roboto/roboto.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/bootstrap.min.css" type="text/css" />');
    ////docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/jquery-ui.min.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/font-awesome.css" type="text/css" />');
    ////docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/cs-skin-elastic.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/Shared/_Layout.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/style.css" type="text/css" />');
    //docprint.document.write('<link rel="stylesheet" href="http://192.168.10.55/test/css/main.css" type="text/css" />');

    docprint.document.write('<style type="text/css">body{ margin:0px;');
    docprint.document.write('font-family:verdana,Arial;color:#000;');
    docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:15px;}');
    docprint.document.write('a{color:#000;text-decoration:none;} </style>');
    //docprint.document.write('</head><body onLoad="self.print()" style="padding-right: 30%;"><Left>');
    docprint.document.write('</head><body onLoad="self.print()"><Left>');
    docprint.document.write(content_vlue);
    docprint.document.write('</center></body></html>');
    docprint.document.close();
    docprint.focus();
}

function cutNumber(number, digitsAfterDot) {
    const str = `${number}`;

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1);
}
(function () {
    $(function () {
        $(document).ready(function () {
            GetAttendanceTable();
            GetPayrollList();
        });

        //var _empSalariesServices = abp.services.app.empSalariesServices;
        //var _employeeAllowanceService = abp.services.app.employeeAllowanceService;
        //var _empAttRecordService = abp.services.app.empAttRecordService;
        //var _empContributionService = abp.services.app.empContributionService;
        var _bioAttendanceService = abp.services.app.bioAtt2Service;
        var _payrollIServices = abp.services.app.payrollIServices;
        var _payrollOTDetailsServices = abp.services.app.payrollOTDetailsServices;
        var _payrollAllowanceServices = abp.services.app.payrollAllowanceServices;
        var _payrollAttAdjustmentServices = abp.services.app.payrollAttAdjustmentServices;
        var _payrollSSSLoanServices = abp.services.app.payrollSSSLoanServices;
        var _payrollPagibigLoanServices = abp.services.app.payrollPagibigLoanServices;
        var _payrollOtherLoanServices = abp.services.app.payrollOtherLoanServices;
        var _payrollOtherDeductionServices = abp.services.app.payrollOtherDeductionServices;

        var _$AttendanceTable = $('#AttendanceTable');
        var _$EmpPayrollListTable = $('#EmpPayrollListTable');
        //var _$OTTable = $('#OTTable');
        //var _$AllowanceTable = $('#AllowanceTable');
        //var _$AttAdjTable = $('#AttAdjTable');
        //var _$SSLoanTable = $('#SSLoanTable');
        //var _$pgbLoanTable = $('#pgbLoanTable');
        //var _$OtLoanTable = $('#OtLoanTable');
        //var _$OtherDedTable = $('#OtherDedTable');

        var dataTable = _$AttendanceTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAllAtt2,

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
                    data: "companyName"
                },

                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", companyName: "companyName" },
                    "render": function (data) {
                        return '<a id="view-attendanceId" title="View Data" class="view-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-companyName="' + data.companyName + '"><i class="fa fa-md fa-search"></i></a> ';
                    }
                }
            ]
        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }

        $('#AttendanceTable').on('click', 'a.view-attendanceId', function (e) {
            e.preventDefault();
            $("#compname").val("");
            $('#attid').val("");
            var AttId = $(this).attr("data-attendanceId-id");
            var company = $(this).attr("data-attendanceId-companyName");
            var dateT = $(this).attr("data-attendanceId-dateT");
            var $startDate = $(this).attr("data-attendanceId-startDate");
            var $endDate = $(this).attr("data-attendanceId-endDate");
            $('#attid').val(AttId);
            $('#compname').val(company);
            //1
            GetPayrollList();
            $('#AttList').modal('hide');
        });

        var dataTablelist = _$EmpPayrollListTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _payrollIServices.getAllList,
                inputFilter: function () {
                    var $datestart = "";
                    var $dateend = "";
                    var $empid = "";
                    var $attId2 = $('#attid').val();
                    if ($attId2 == "") {
                        var $attId = "0";
                    }
                    else {
                        var $attId = $attId2;
                    }
                    var $compname2 = $('#compname').val();
                    if ($compname2 == "") {
                        var $compname = "0";
                    }
                    else {
                        var $compname = $compname2;
                    }
                    if ($empid === '') {
                        $empid = '0';
                    }
                    return {
                        filter: $datestart + '|' + $dateend + '|' + $empid + '|' + $attId + '|' + $compname
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
                    orderable: true,
                    targets: 1,
                    data: "attId"
                },
                {
                    orderable: true,
                    targets: 2,
                    data: "empCode"
                },
                {
                    targets: 3,
                    orderable: true,
                    data: {  firstName: "firstName", middleName: "middleName", lastName: "lastName"},
                    "render": function (data) {
                        var Hreturn = data.lastName + ", " + data.firstName + ", " + data.middleName;
                        return Hreturn;
                    }
                },
                {
                    visible: false,
                    targets: 4,
                    data: "firstName"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "middleName"
                },
                {
                    targets: 6,
                    data: "description1"
                },
                {
                    targets: 7,
                    data: "netIncome"
                },
                {
                    orderable: false,
                    targets: 8,
                    class: "text-center",
                    data: { id: "id", firstName: "firstName", middleName: "middleName", lastName: "lastName", description1: "description1", empId: "empId", attId: "attId", status1: "status1", status2: "status2", status3: "status3", empCode: "empCode" },
                    "render": function (data) {
                        //return '<a id="edit-Employee" title="View Items" href="#" class="edit-Employee btn btn-outline-primary btn-sm" data-Employee-id="' + data.id + '" data-Employee-firstName="' + data.firstName + '" data-Employee-middleName="' + data.middleName + '" data-Employee-lastName="' + data.lastName + '" data-Employee-description1="' + data.description1 + '" data-Employee-empId="' + data.empId + '" data-Employee-attId="' + data.attId + '" data-Employee-status1="' + data.status1 + '" data-Employee-status2="' + data.status2 + '" data-Employee-status3="' + data.status3 + '" data-Employee-empCode="' + data.empCode + '"><i class="fa fa-print"></i></a>' + " | " + '<a id="edit2-Employee" title="View Items" href="#" class="edit2-Employee btn btn-outline-primary btn-sm" data-Employee-id="' + data.id + '" data-Employee-firstName="' + data.firstName + '"data-Employee-middleName="' + data.middleName + '"data-Employee-lastName="' + data.lastName + '"data-Employee-description1="' + data.description1 + '" data-Employee-empId="' + data.empId + '" data-Employee-attId="' + data.attId + '" data-Employee-status1="' + data.status1 + '" data-Employee-status2="' + data.status2 + '" data-Employee-status3="' + data.status3 + '" data-Employee-empCode="' + data.empCode + '"><i class="fa fa-print"></i></a>';
                        var ret = '';
                        var print = '<a id="edit-Employee" title="View Items" href="#" class="edit-Employee btn btn-outline-primary btn-sm" data-Employee-id="' + data.id + '" data-Employee-firstName="' + data.firstName + '"data-Employee-middleName="' + data.middleName + '"data-Employee-lastName="' + data.lastName + '"data-Employee-description1="' + data.description1 + '" data-Employee-empId="' + data.empId + '" data-Employee-attId="' + data.attId + '" data-Employee-status1="' + data.status1 + '" data-Employee-status2="' + data.status2 + '" data-Employee-status3="' + data.status3 + '" data-Employee-empCode="' + data.empCode + '"><i class="fa fa-print"></i></a>';
                        ret = print;
                        if (abp.auth.isGranted('Pages.Payroll.Edit')) {
                            var edit = '<a id="edit2-Employee" title="Edit Payroll" href="#" class="edit2-Employee btn btn-outline-primary btn-sm" data-Employee-id="' + data.id + '" data-Employee-firstName="' + data.firstName + '"data-Employee-middleName="' + data.middleName + '"data-Employee-lastName="' + data.lastName + '"data-Employee-description1="' + data.description1 + '" data-Employee-empId="' + data.empId + '" data-Employee-attId="' + data.attId + '" data-Employee-status1="' + data.status1 + '" data-Employee-status2="' + data.status2 + '" data-Employee-status3="' + data.status3 + '" data-Employee-empCode="' + data.empCode + '"><i class="fa fa-edit"></i></a>'; //|' + buttons;
                            ret = print + " | " + edit;
                        }
                        return ret;
                    }
                }
            ]
        });
        function GetPayrollList() {
            dataTablelist.ajax.reload();
        }

        $('#EmpPayrollListTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            logs
            $("#logs").val("");
            $("#head1").hide();
            $("#head2").hide();
            $("#head3").hide();
            $("#head4").hide();
            $("#head5").hide();
            $("#head6").hide();
            $("#line1").hide();
            $("#line2").hide();
            $("#line3").hide();
            $('#PayrollViewModal').modal('show');
            var payrollid = $(this).attr("data-Employee-id");
            var $firstName = $(this).attr("data-Employee-firstName");
            var $middleName = $(this).attr("data-Employee-middleName");
            var $lastName = $(this).attr("data-Employee-lastName");
            var $status1 = $(this).attr("data-Employee-status1");
            var $status2 = $(this).attr("data-Employee-status2");
            var $status3 = $(this).attr("data-Employee-status3");
            var $attId = $(this).attr("data-Employee-attId");
            var $empCode = $(this).attr("data-Employee-empCode");
            var $empId = $(this).attr("data-Employee-empId");

            var sDate = $status2.split('-');
            var y = parseInt(sDate[0], 10);
            var m = parseInt(sDate[1], 10);
            var d = parseInt(sDate[2], 10);
            sDate = m + '/' + d + '/' + y;

            var eDate = $status3.split('-');
            var y = parseInt(eDate[0], 10);
            var m = parseInt(eDate[1], 10);
            var d = parseInt(eDate[2], 10);
            eDate = m + '/' + d + '/' + y;

            $('.startdate').text(sDate);
            $('.enddate').text(eDate);
            $('#attid').html($attId);
            $('#Empcode').html($empCode);
            $('#empId').html($empId);
            _payrollIServices.getPayrollDetailsbyId({ id: payrollid }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    $('#name').html($lastName + ", " + $firstName + " " + $middleName);
                    //$('#attid').html(result.items[i].attid);
                    $('#Empcode').html($empCode);
                    $('#Department').html(result.items[i].department);
                    $('#PayrollPeriod').html(result.items[i].payrollPeriod + " / Daily");
                    $('#RatePerMonth').html(result.items[i].ratePerMonth.toFixed(2));

                    $('#BasicSalaryCurrent').html(result.items[i].basicSalaryCurrent.toFixed(2));
                    $('#BasicSalaryAdjustment').html(result.items[i].basicSalaryAdjustment.toFixed(2));
                    $('#BasicSalaryAmount').html(result.items[i].basicSalaryAmount.toFixed(2));

                    var $holidayCurrent = result.items[i].holidayCurrent;
                    if ($holidayCurrent == "0" || $holidayCurrent == null) {
                        $('#HolidayCurrent0').hide();
                        $('#HolidayCurrent').hide();
                        $('#HolidayAdjustment').hide();
                        $('#HolidayAmount').hide();
                    }
                    else {
                        $('#HolidayCurrent0').show();
                        $('#HolidayCurrent').show();
                        $('#HolidayAdjustment').show();
                        $('#HolidayAmount').show();
                        $('#HolidayCurrent').html(result.items[i].holidayCurrent);
                        $('#HolidayAdjustment').html(result.items[i].holidayAdjustment.toFixed(2));
                        $('#HolidayAmount').html(result.items[i].holidayAmount.toFixed(2));
                    }

                    var $travellhoursCurrent = result.items[i].travelhoursCurrent;
                    if ($travellhoursCurrent == "0" || $travellhoursCurrent == null) {
                        $('#TravelhoursCurrent0').hide();
                        $('#TravelhoursCurrent').hide();
                        $('#TravelhoursAdjustment').hide();
                        $('#TravelhoursAmount').hide();
                    }
                    else {
                        $('#TravelhoursCurrent0').show();
                        $('#TravelhoursCurrent').show();
                        $('#TravelhoursAdjustment').show();
                        $('#TravelhoursAmount').show();
                        $('#TravelhoursCurrent').html(result.items[i].travelhoursCurrent);
                        $('#TravelhoursAdjustment').html(result.items[i].travelhoursAdjustment.toFixed(2));
                        $('#TravelhoursAmount').html(result.items[i].travelhoursAmount.toFixed(2));
                    }
                    var $nightDiffCurrent = result.items[i].nightDiffCurrent;
                    if ($nightDiffCurrent == "0" || $nightDiffCurrent == "00:00") {
                        $('#NightDiffCurrent0').hide();
                        $('#NightDiffCurrent').hide();
                        $('#NightDiffAdjustment').hide();
                        $('#NightDiffAmount').hide();
                    }
                    else {
                        $('#NightDiffCurrent0').show();
                        $('#NightDiffCurrent').show();
                        $('#NightDiffAdjustment').show();
                        $('#NightDiffAmount').show();
                        $('#NightDiffCurrent').html(result.items[i].nightDiffCurrent);
                        $('#NightDiffAdjustment').html(result.items[i].nightDiffAdjustment.toFixed(2));
                        $('#NightDiffAmount').html(result.items[i].nightDiffAmount.toFixed(2));
                    }

                    var $absensesCurrent = result.items[i].absensesCurrent;
                    if ($absensesCurrent == "0") {
                        $('#AbsensesCurrent0').hide();
                        $('#AbsensesCurrent').hide();
                        $('#AbsensesAdjustment').hide();
                        $('#AbsensesAmount').hide();
                    }
                    else {
                        $('#AbsensesCurrent0').show();
                        $('#AbsensesCurrent').show();
                        $('#AbsensesAdjustment').show();
                        $('#AbsensesAmount').show();
                        $('#AbsensesCurrent').html(result.items[i].absensesCurrent.toFixed(2));
                        $('#AbsensesAdjustment').html(result.items[i].absensesAdjustment.toFixed(2));
                        $('#AbsensesAmount').html(result.items[i].absensesAmount.toFixed(2));
                    }

                    var $TardinessCurrent = result.items[i].tardinessCurrent;
                    if ($TardinessCurrent == "0" || $TardinessCurrent == "00:00") {
                        $('#TardinessCurrent0').hide();
                        $('#TardinessCurrent').hide();
                        $('#TardinessAjustment').hide();
                        $('#TardinessAmount').hide();
                    }
                    else {
                        $('#TardinessCurrent0').show();
                        $('#TardinessCurrent').show();
                        $('#TardinessAjustment').show();
                        $('#TardinessAmount').show();
                        $('#TardinessCurrent').html(result.items[i].tardinessCurrent);
                        $('#TardinessAjustment').html(result.items[i].tardinessAjustment);
                        $('#TardinessAmount').html(result.items[i].tardinessAmount.toFixed(2));
                    }

                    var $UndertimeCurrent = result.items[i].undertimeCurrent;
                    if ($UndertimeCurrent == "0" || $UndertimeCurrent == "00:00") {
                        $('#UndertimeCurrent0').hide();
                        $('#UndertimeCurrent').hide();
                        $('#UndertimeAdjustment').hide();
                        $('#UndertimeAmount').hide();
                    }
                    else {
                        $('#UndertimeCurrent0').show();
                        $('#UndertimeCurrent').show();
                        $('#UndertimeAdjustment').show();
                        $('#UndertimeAmount').show();
                        $('#UndertimeCurrent').html(result.items[i].undertimeCurrent);
                        $('#UndertimeAdjustment').html(result.items[i].undertimeAdjustment.toFixed(2));
                        $('#UndertimeAmount').html(result.items[i].undertimeAmount.toFixed(2));
                    }
                    var $leaveUse = result.items[i].leaveUse;
                    if ($leaveUse == "0") {
                        $('#LeaveUse0').hide();
                        $('#LeaveUse').hide();
                        $('#LeaveAmout').hide();
                        $('#LeaveTotalAmout').hide();
                    }
                    else {
                        $('#LeaveUse0').show();
                        $('#LeaveUse').show();
                        $('#LeaveAmout').show();
                        $('#LeaveTotalAmout').show();
                        $('#LeaveUse').html(result.items[i].leaveUse);
                        $('#LeaveAmout').html(result.items[i].leaveAmout.toFixed(2));
                        $('#LeaveTotalAmout').html(result.items[i].leaveTotalAmout.toFixed(2));
                    }

                    var GnAmt = result.items[i].generalAmount;
                    if (GnAmt == "0.00") {
                        $('#GeneralAmount0').hide();
                        $('#GeneralAmount1').hide();
                        $('#GeneralAmount2').hide();
                        $('#GeneralAmount').hide();
                    }
                    else {
                        $('#GeneralAmount0').show();
                        $('#GeneralAmount1').show();
                        $('#GeneralAmount2').show();
                        $('#GeneralAmount').show();
                        $('#GeneralAmount').html(GnAmt.toFixed(2));
                    }
                    var NonGnAmt = result.items[i].nonGeneralAmount;
                    if (NonGnAmt == "0.00") {
                        $('#NONGeneralAmount0').hide();
                        $('#NONGeneralAmount1').hide();
                        $('#NONGeneralAmount2').hide();
                        $('#NONGeneralAmount').hide();
                    }
                    else {
                        $('#NONGeneralAmount0').show();
                        $('#NONGeneralAmount1').show();
                        $('#NONGeneralAmount2').show();
                        $('#NONGeneralAmount').show();
                        $('#NONGeneralAmount').html(NonGnAmt.toFixed(2));
                    }

                    //GrossAmount
                    $('#GrossAmount').html(result.items[i].grossAmount);

                    //Contribution
                    $('#SSSEEAmount').html(result.items[i].ssseeAmount.toFixed(2));
                    $('#SSSERAmount').html(result.items[i].ssserAmount.toFixed(2));
                    $('#SSSECAmount').html(result.items[i].sssecAmount.toFixed(2));

                    $('#PhilhealthEEAmount').html(result.items[i].philhealthEEAmount.toFixed(2));
                    $('#PhilhealthERAmount').html(result.items[i].philhealthERAmount.toFixed(2));
                    $('#PhilhealthTotalAmount').html(result.items[i].philhealthTotalAmount.toFixed(2));

                    $('#PagibigEEAmount').html(result.items[i].pagibigEEAmount.toFixed(2));
                    $('#PagibigERAmount').html(result.items[i].pagibigERAmount.toFixed(2));
                    $('#PagibigTotalAmount').html(result.items[i].pagibigTotalAmount.toFixed(2));
                    //TOtal COntribution
                    var $ssee = parseFloat(result.items[i].ssseeAmount.toFixed(2));
                    var $phee = parseFloat(result.items[i].philhealthEEAmount.toFixed(2));
                    var $pgee = parseFloat(result.items[i].pagibigEEAmount.toFixed(2));
                    var totalcontri = $ssee + $phee + $pgee;
                    $('#TotalContri').html(totalcontri.toFixed(2));
                    $('#Totalded').html(result.items[i].loansAmount.toFixed(2));
                    $('#TaxableAmount').html(result.items[i].taxableAmount.toFixed(2));
                    $('#Percent').html(result.items[i].percent);
                    $('#NetIncome').html(result.items[i].netIncome);
                }
                GetOvertimeRecord($('#attid').html(), $('#empId').html());
            })

        });

        function GetOvertimeRecord($a, $b) {
            $("#Overtime-list").empty();
            $("#Overtime-listprint").empty();
            _payrollOTDetailsServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].index;
                    var $description = result.items[i].description;
                    var $hour = result.items[i].hour;
                    var $rate = result.items[i].rate;
                    var $amount = result.items[i].amount;
                    //--end trim--//
                    $("#Overtime-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $description + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount + '</label></div></div></div>');
                    $("#Overtime-listprint").prepend('<table style="width: 100%;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-12 col-xl-12"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $description + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount + '</label></div></div></td></tr></tbody></table>');

                }
                GetAllowanceRecord($('#attid').html(), $('#empId').html());
            });
        }

        function GetAllowanceRecord($a, $b) {
            $("#Allowance-list").empty();
            $("#Allowance-listprint").empty();
            _payrollAllowanceServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].index;
                    var $description = result.items[i].description.toUpperCase();
                    if (result.items[i].hour == null || result.items[i].hour === "") {
                        var $hour = "0.00";
                    }
                    else {
                        var $hour = result.items[i].hour;
                    }
                    if (result.items[i].rate == 0 || result.items[i].rate === '0') {
                        var $rate = "0.00";
                    }
                    else {
                        var $rate = result.items[i].rate;
                    }
                    var $amount = result.items[i].amount;

                    $("#Allowance-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $description + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $hour + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $amount.toFixed(2) + '</label></div></div></div>');
                    $("#Allowance-listprint").prepend('<table style="width: 100%;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $description + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount.toFixed(2) + '</label></div></div></td></tr></tbody></table>');

                }
                GetAttAdjTableRecord($('#attid').html(), $('#empId').html());
            });
        }

        function GetAttAdjTableRecord($a, $b) {
            $("#AttAdj-list").empty();
            $("#AttAdj-listprint").empty();
            _payrollAttAdjustmentServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].index;
                    var $description = result.items[i].description1;
                    if (result.items[i].description2 == null || result.items[i].description2 == "") {
                        var $hour = "0.00";
                    }
                    else {
                        var $hour = result.items[i].description2;
                    }
                    if (result.items[i].description3 == null || result.items[i].description3 == "") {
                        var $rate = "0.00";
                    }
                    else {
                        var $rate = result.items[i].description1;
                    }
                    var $amount = result.items[i].attAdjAmount;
                    var $description3 = result.items[i].description3.toUpperCase();
                    var $AttAdjDescription = result.items[i].attAdjDescription.toUpperCase();
                    $("#AttAdj-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $description3 + "-" + "ADJ" + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $hour + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $amount + '</label></div></div></div>');
                    $("#AttAdj-listprint").prepend('<table style="width: 50%; font-size: 12px;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-12 col-xl-12"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $AttAdjDescription + "-" + $description3 + " ADJ" + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount + '</label></div></div></td></tr></tbody></table>');

                }
                GetSSLoanRecord($('#attid').html(), $('#empId').html());
            });
        }

        function GetSSLoanRecord($a, $b) {
            $("#SSLoan-list").empty();
            $("#SSLoan-listprint").empty();
            _payrollSSSLoanServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].appNo;
                    $("#logs").val($index);
                    var $description = result.items[i].description;
                    if (result.items[i].loanAmount == 0 || result.items[i].loanAmount == "0") {
                        var $hour = "0.00";
                    }
                    else {
                        var $hour = result.items[i].loanAmount;
                    }
                    if (result.items[i].balance == 0 || result.items[i].balance == "0") {
                        var $rate = "0.00";
                    }
                    else {
                        var $rate = result.items[i].balance;
                    }
                    var $amount = result.items[i].amount;

                    $("#SSLoan-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $description + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $hour.toFixed(2) + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $amount.toFixed(2) + '</label></div></div></div>');
                    $("#SSLoan-listprint").prepend('<table style="width: 50%; font-size: 12px;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $description + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour.toFixed(2) + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount.toFixed(2) + '</label></div></div></td></tr></tbody></table>');
                }
                GetPgbLoanRecord($('#attid').html(), $('#empId').html());
            });
        }

        function GetPgbLoanRecord($a, $b) {
            $("#pgb-list").empty();
            $("#pgb-listprint").empty();
            _payrollPagibigLoanServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].appNo;
                    $("#logs").val($index);
                    var $description = result.items[i].description;
                    if (result.items[i].loanAmount == 0 || result.items[i].loanAmount == "0") {
                        var $hour = "0.00";
                    }
                    else {
                        var $hour = result.items[i].loanAmount;
                    }
                    if (result.items[i].balance == 0 || result.items[i].balance == "0") {
                        var $rate = "0.00";
                    }
                    else {
                        var $rate = result.items[i].balance;
                    }
                    var $amount = result.items[i].amount;

                    $("#pgb-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $description + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $hour.toFixed(2) + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $amount.toFixed(2) + '</label></div></div></div>');
                    $("#pgb-listprint").prepend('<table style="width: 50%; font-size: 12px;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $description + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour.toFixed(2) + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount.toFixed(2) + '</label></div></div></td></tr></tbody></table>');
                }
                GetOTLoanRecord($('#attid').html(), $('#empId').html());
            });
        }

        function GetOTLoanRecord($a, $b) {
            $("#OtLoan-list").empty();
            $("#OtLoan-listprint").empty();
            _payrollOtherLoanServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].appNo;
                    $("#logs").val($index);
                    var $description = result.items[i].description;
                    if (result.items[i].loanAmount == 0 || result.items[i].loanAmount == "0") {
                        var $hour = "0.00";
                    }
                    else {
                        var $hour = result.items[i].loanAmount;
                    }
                    if (result.items[i].balance == 0 || result.items[i].balance == "0") {
                        var $rate = "0.00";
                    }
                    else {
                        var $rate = result.items[i].balance;
                    }
                    var $amount = result.items[i].amount;

                    $("#OtLoan-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12 no-padding"><label style="width: 100px;">' + $description + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $hour.toFixed(2) + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $amount.toFixed(2) + '</label></div></div></div>');
                    $("#OtLoan-listprint").prepend('<table style="width: 50%; font-size: 12px;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-12 col-xl-12"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $description + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour.toFixed(2) + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount.toFixed(2) + '</label></div></div></td></tr></tbody></table>');
                }
                GetOtherDedRecord($('#attid').html(), $('#empId').html());
            });
        }

        function GetOtherDedRecord($a, $b) {
            $("#OtherDedLoan-list").empty();
            $("#OtherDedLoan-listprint").empty();
            _payrollOtherDeductionServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $index = result.items[i].index;
                    $("#logs").val($index);
                    var $description = result.items[i].description;
                    if (result.items[i].hour == null || result.items[i].hour === "") {
                        var $hour = "0.00";
                    }
                    else {
                        var $hour = result.items[i].hour;
                    }
                    if (result.items[i].rate == 0 || result.items[i].rate === '0') {
                        var $rate = "0.00";
                    }
                    else {
                        var $rate = result.items[i].rate;
                    }
                    var $amount = result.items[i].amount;

                    $("#OtherDedLoan-list").prepend('<div class="row"><div class="col-md-4 col-xl-4"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $description + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $hour + '</label></div></div><div class="col-md-2 col-xl-2"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $rate + '</label></div></div><div class="col-md-3 col-xl-3"><div class="col-md-12 col-xl-12"><label style="width: 100px;">' + $amount.toFixed(2) + '</label></div></div></div>');
                    $("#OtherDedLoan-listprint").prepend('<table style="width: 50%; font-size: 12px;"><tbody><tr><td style="width: 33% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label>' + $description + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $hour.toFixed(2) + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $rate + '</label></div></div></td><td style="width: 30% !important;"><div class="col-md-4 col-xl-4"> <div class="col-md-12 col-xl-12 no-padding"><label style="width: 100%;">' + $amount.toFixed(2) + '</label></div></div></td></tr></tbody></table>');

                }
                Logs();
            });
        }

        function Logs() {
            var logger = $("#logs").val();
            if (logger == "" || logger == null) {
                $("#head1").hide();
                $("#head2").hide();
                $("#head3").hide();
                $("#head4").hide();
                $("#head5").hide();
                $("#head6").hide();
                $("#line1").hide();
                $("#line2").hide();
                $("#line3").hide();
            }
            else {
                $("#head1").show();
                $("#head2").show();
                $("#head3").show();
                $("#head4").show();
                $("#head5").show();
                $("#head6").show();
                $("#line1").show();
                $("#line2").show();
                $("#line3").show();
            }
        }

        $('#EmpPayrollListTable').on('click', 'a.edit2-Employee', function (e) {
            e.preventDefault();
            //logs

            //$('#PayrollViewModal2').modal('show');
            var payrollid = $(this).attr("data-Employee-id");
            var $firstName = $(this).attr("data-Employee-firstName");
            var $middleName = $(this).attr("data-Employee-middleName");
            var $lastName = $(this).attr("data-Employee-lastName");
            var $status1 = $(this).attr("data-Employee-status1");
            var $status2 = $(this).attr("data-Employee-status2");
            var $status3 = $(this).attr("data-Employee-status3");
            var $attId = $(this).attr("data-Employee-attId");
            var $empCode = $(this).attr("data-Employee-empCode");
            var $empId = $(this).attr("data-Employee-empId");

            var sDate = $status2.split('-');
            var y = parseInt(sDate[0], 10);
            var m = parseInt(sDate[1], 10);
            var d = parseInt(sDate[2], 10);
            sDate = m + '/' + d + '/' + y;

            var eDate = $status3.split('-');
            var y = parseInt(eDate[0], 10);
            var m = parseInt(eDate[1], 10);
            var d = parseInt(eDate[2], 10);
            eDate = m + '/' + d + '/' + y;


            window.location.href = abp.appPath + 'Payroll/Edit?id=' + payrollid + '&EmpId=' + $empId + '&EmpCode=' + $empCode + '&AttId=' + $attId + '&EmpCode=' + $empCode;
        });

        $('#btnprintme').click(function (e) {
            e.preventDefault();
            printPreviewActual2();
        });

        function printPreviewActual2() {
            var $start = document.getElementById('start').innerHTML;
            var $end = document.getElementById('end').innerHTML;
            var $name = document.getElementById('name').innerHTML;
            var $empId = document.getElementById('empId').innerHTML;
            var $department = document.getElementById('Department').innerHTML;
            var $payrollPeriod = document.getElementById('PayrollPeriod').innerHTML;
            var $ratePerMonth = document.getElementById('RatePerMonth').innerHTML;
            var $Loan1 = "";
            var $Loan2 = "";
            var $Loan3 = "";
            var $Loan4 = "";
            var $earning1 = document.getElementById("EARNINGS1");
            var $earning2 = document.getElementById("EARNINGS2");
            var $earning3 = document.getElementById("EARNINGS3");
            var $earning4 = document.getElementById("EARNINGS4");
            var $earning5 = document.getElementById("Overtime-listprint");
            var $earning6 = document.getElementById("Allowance-listprint");
            var $earning7 = document.getElementById("AttAdj-listprint");
            var $GrossAmount = document.getElementById('GrossAmount').innerHTML;

            var $contri1 = document.getElementById("contri1");
            var $contri2 = document.getElementById("contri2");
            var $contri3 = document.getElementById("contri3");
            var $contri4 = document.getElementById("contri4");
            var $TotalContri = document.getElementById('TotalContri').innerHTML;

            var $Loan1 = document.getElementById("head1");
            var $Loan2 = document.getElementById("head2");
            var $Loan3 = document.getElementById("head3");
            var $Loan4 = document.getElementById("head4");

            var $SSLoan = document.getElementById("SSLoan-listprint");
            var $pgb = document.getElementById("pgb-listprint");
            var $OtLoan = document.getElementById("OtLoan-listprint");
            var $OtherDedLoan = document.getElementById('OtherDedLoan-listprint');
            var $Totalded = document.getElementById('Totalded').innerHTML;

            var $TaxableAmount = document.getElementById('TaxableAmount').innerHTML;
            var $Percent = document.getElementById('Percent').innerHTML;
            var $NetIncome = document.getElementById('NetIncome').innerHTML;

            var win = window.open('');
            var printContents = `<!DOCTYPE html>
                                <html>
                                <head>
                                    <!-- Edited by Erwin -->
                                    <link href="${abp.appPath}css/bootstrap.min.css" rel="stylesheet" asp-append-version="true"/>
                                    <style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; margin-top:1.5in; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } .xfooter {width: 970px; position: absolute; height:4.5in; bottom: 0;  }</style>
                                    <style>

                                        @font-face {
                                            font-family: 'Roboto Slab';
                                            src: url('${abp.appPath}fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf');
                                        }

                                        table , td, th {
	                                        border: 1px solid #e8e8e8;
	                                        border-collapse: collapse;
                                        }
                                        td, th {
	                                        padding: 3px;
	                                        width: 30px;
	                                        height: 25px;
                                        }
                                        th {
	                                        background: #f0e6cc;
                                        }
                                        .even {
	                                        background: #fbf8f0;
                                        }
                                        .odd {
	                                        background: #fefcf9;
                                        }
                                    </style>

                                    <title>PRINT PAYSLIP</title>
                                </head><body>
                                `;
            printContents += '<div style="text-align: center; font-weight: 700; width:50%; font-size: 12px;">MFT INTERNATIONAL CORP</div>';
            printContents += '<div style="text-align: center; font-weight: 700; font-size: x-small; width:50%">PAYSLIP</div>';
            printContents += '<div style="text-align: center; font-weight: 700; width:50%; font-size: 12px;">' + $start + ' - ' + $end +'</div>';
            //printContents += '<div style="text-align: center; font-weight: 700;">10/26/2023 - 11/10/2023</div>';

            printContents += '<table style="width: 50%;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-size: 12px;">Employee Name :<br></td>';
            printContents += '<td style="width: 80.0000%; font-weight: 700; font-size: 12px;">' + $name + '<br></td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-size: 12px;">Employee Code :<br></td>';
            printContents += '<td style="width: 80.0000%; font-weight: 700; font-size: 12px;">' + $empId + '</td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-size: 12px;">Department :<br></td>';
            printContents += '<td style="width: 80.0000%; font-weight: 700; font-size: 12px;">' + $department + '</td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-weight: 700; font-size: 12px;">' + $payrollPeriod + ' :<br></td>';
            printContents += '<td style="width: 80.0000%; font-weight: 700; font-size: 12px;">' + $ratePerMonth + '</td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            //Earning
            printContents += '<table style="width: 50%;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 33% !important; font-size: 12px; vertical-align: text-top;"">' + $earning1.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-size: 12px; vertical-align: text-top;"">' + $earning2.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-size: 12px; vertical-align: text-top;"">' + $earning3.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-size: 12px; vertical-align: text-top;"">' + $earning4.outerHTML + '</td>';
            printContents += '</tr>';            
            printContents += '</tbody></table>';
            //Earning end
            //Adjustment
            printContents += $earning5.outerHTML;
            printContents += $earning6.outerHTML;
            printContents += $earning7.outerHTML;
            //Adjustment End
            //Gross
            printContents += '<table style="width: 50%; background-color: #e8e8e8;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 84% !important; text-align: end !important; padding-right: 40px !important; font-weight: 700; font-size: 12px;">GROSS PAY</td>';
            printContents += '<td style="width: 30% !important; font-weight: 700; font-size: 12px;"><div class="col-md-12 col-xl-12">' + $GrossAmount +' </div></td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            //Gross End
            //Contri
            printContents += '<table style="width: 50%;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 33% !important; font-size: 12px; vertical-align: text-top;">' + $contri1.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-size: 12px; vertical-align: text-top;">' + $contri2.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-size: 12px; vertical-align: text-top;">' + $contri3.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-size: 12px; vertical-align: text-top;">' + $contri4.outerHTML + '</td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            //Contri end
            //Gross
            printContents += '<table style="width: 50%; background-color: #e8e8e8;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 84% !important; text-align: end !important; padding-right: 40px !important; font-weight: 700; font-size: 12px;">CONTRIBUTION</td>';
            printContents += '<td style="width: 30% !important; font-weight: 700; font-size: 12px;"><div class="col-md-12 col-xl-12">' + $TotalContri + ' </div></td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            //Gross End
            //Loan
            printContents += '<table style="width: 50%;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 33% !important; font-weight: 700; font-size: 12px;">' + $Loan1.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-weight: 700; font-size: 12px;">' + $Loan2.outerHTML + '</td>';
            printContents += '<td style="width: 26% !important; font-weight: 700; font-size: 12px;">' + $Loan3.outerHTML + '</td>';
            printContents += '<td style="width: 30% !important; font-weight: 700; font-size: 12px;">' + $Loan4.outerHTML + '</td>';
            printContents += '</tr>';

            printContents += $SSLoan.outerHTML;
            printContents += $pgb.outerHTML;
            printContents += $OtLoan.outerHTML;
            printContents += $OtherDedLoan.outerHTML;

            printContents += '<table style="width: 50%;background-color: #e8e8e8;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 84% !important; text-align: end !important; padding-right: 40px !important; font-weight: 700; font-size: 12px;">DEDUCTION</td>';
            printContents += '<td style="width: 30% !important; font-weight: 700; font-size: 12px;">' + $Totalded + '</td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            printContents += '</tbody></table>';
            //Loan End

            printContents += '<div class="col-md-12 col-xl2-12 line" style="height: 5px;"></div>';
            //gross
            printContents += '<table style="width: 50%;background-color: #e8e8e8;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 84.0000%; font-weight: 700; font-size: 12px; text-align: end;padding-right: 40px;">TAXABLE INCOME<br></td>';
            printContents += '<td style="width: 20.0000%; font-weight: 700; font-size: 12px;">' + $TaxableAmount + '<br></td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 84.0000%; font-weight: 700; font-size: 12px; text-align: end;padding-right: 40px;">TAX AMT<br></td>';
            printContents += '<td style="width: 20.0000%; font-weight: 700; font-size: 12px;">' + $Percent + '</td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 84.0000%; font-weight: 700; font-size: 12px; text-align: end;padding-right: 40px;">NET AMT<br></td>';
            printContents += '<td style="width: 20.0000%; font-weight: 700; font-size: 12px;">' + $NetIncome+ '</td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            //gross end

            printContents += `</body></html>`;

            win.document.write(printContents);
        }
    });

})(jQuery);