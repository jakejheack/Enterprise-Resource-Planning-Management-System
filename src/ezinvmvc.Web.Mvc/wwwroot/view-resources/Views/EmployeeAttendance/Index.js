
$(".date-picker").datepicker();
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

$('select').selectpicker();
document.getElementById("EmployeeList").disabled = true;
document.getElementById("FlexiTime").disabled = true;
document.getElementById("StrickOvertime").disabled = true;

(function () {
    $(function () {
        var _employeesservice = abp.services.app.employeeService;
        var _bioAttendanceService = abp.services.app.bioAttendanceService;
        var _employeeSalariesService = abp.services.app.employeeSalariesService;
        var _employeeOTRateService = abp.services.app.employeeOTRateService;
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _$Employeestable = $('#EmployeesTable');
        var _$AttendanceTable = $('#AttendanceTable');
        var _$itemsexceltable = $('#exceltable');
        var _$Attntable = $('#Attntable');

        var _$FormAtt = $('form[name=FormAtt]');
        var _$FormAttEmp = $('form[name=FormAttEmp]');
        var _$FormAttid = $('form[name=Attid]');
        var _$FormAttidDetails = $('form[name=AttidDetails]');

        //Employee
        var dataTableatt = _$Employeestable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeesservice.getAttEmployees,
                inputFilter: function () {
                    var $p = $('#EmployeeTableFilter').val();
                    var $c = $('#SearchBy').val();
                    var $e = $('#attid').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    if ($e === '') {
                        $e = 'null';
                    }
                    return {
                        filter: $c + '|' + $p + '|' + $e
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
                    targets: 1,
                    data: "employeeCode"
                },
                {
                    targets: 2,
                    data: "completeName"
                },
                {
                    targets: 3,
                    data: "cellNo"
                },
                {
                    targets: 4,
                    data: "dept"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "post"
                },
                {
                    visible: false,
                    targets: 6,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { id: "id", completeName: "completeName", employeeCode: "employeeCode" },
                    "render": function (data) {
                        return '<a id="edit-Employee" title="Select Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '" data-Employee-completeName="' + data.completeName + '" data-Employee-employeeCode="' + data.employeeCode + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });
        function GetEmployees() {
            dataTableatt.ajax.reload();
        }

        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            $('#EmpId').val("");
            $('#completeName').val("");
            $('#EmpCode').val("");

            var employeeId = $(this).attr("data-Employee-id");
            var completeName = $(this).attr("data-Employee-completeName");
            var employeeCode = $(this).attr("data-Employee-employeeCode");

            $('#EmpId').val(employeeId);
            $('#completeName').val(completeName);
            $('#EmpCode').val(employeeCode);

            GetAttendanceRecord();
            GetAttendanceEmpRecord();
            GetEmployeeSalary(employeeId);
            GetEmployeeOTRalesSalary(employeeId);
            
        });
        $('#BtnLoadRecord').click(function (e) {
            e.preventDefault();
            dataTableEmp.ajax.reload();
        });
        //Attendance
        var dataTable = _$AttendanceTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAllAttendance

            },
            columnDefs: [

                {
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
                    data: "company"
                },

                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", company: "company" },
                    "render": function (data) {
                        return '<a id="edit-attendanceId" title="Select AttendanceId" href="#" class="edit-attendanceId" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-company="' + data.company + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        var dataTableAtt = _$itemsexceltable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAllAttendanceByCode,
                inputFilter: function () {
                    var $d = $('#EmpCode').val();
                    var $c = $('#attid').val();
                    if ($d === '') {
                        $d = 0;
                    }
                    if ($c === '') {
                        $c = 0;
                    }
                    return {
                        filter: $d + '|' + $c 
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
                    visible: true,
                    targets: 1,
                    data: "company"
                },
                {
                    visible: true,
                    targets: 2,
                    data: "name"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "no"
                },
                {
                    targets: 4,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDateTime(dt);
                    }
                },
                {
                    visible: false,
                    targets: 5,
                    data: "locId"
                },
                {
                    visible: false,
                    targets: 6,
                    data: "idNumber"
                },
                {
                    visible: false,
                    targets: 7,
                    data: "verifyCode"
                },
                {
                    visible: false,
                    targets: 8,
                    data: "cardNo"
                },
                {
                    visible: true,
                    targets: 9,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 10,
                    class: "text-center",
                    data: { id: "id", company: "company" },
                    "render": function (data) {
                        return '<a id="edit-attendanceId" title="Select AttendanceId" href="#" class="edit-attendanceId" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-company="' + data.company + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }
        ////baba
        var dataTableEmp = _$Attntable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAttendance,
                inputFilter: function () {
                    var $d = $('#EmpCode').val();
                    var $c = $('#attid').val();
                    var $e = $('#DateRecStart').val();
                    var $f = $('#DateRecEnd').val();
                    if ($d === '') {
                        $d = 0;
                    }
                    if ($c === '') {
                        $c = 0;
                    }
                    if ($e === '') {
                        $e = '1900-01-01';
                    }
                    if ($f === '') {
                        $f = '1900-01-01';
                    }
                    return {
                        filter: $d + '|' + $c + '|' + $e + '|' + $f
                    };
                }
            },
            columnDefs: [
                
                {
                    visible: true,
                    targets: 0,
                    data: { No: "no" },
                    "render": function (data) {
                        var $No = data.No;
                        if ($No !== 0) {
                            var EmpNo = document.getElementById("EmpCode").value;
                        }
                        else
                        {
                            var EmpNo = $No;
                        }
                        return EmpNo;
                    }
                },
                {
                    visible: true,
                    targets: 1,
                    data: { attendanceId: "attendanceId", holiday: "holiday", enTitlement: "enTitlement", date: "date" },
                    "render": function (data) {
                        var $holiday = data.holiday;
                        var $attendanceId = data.attendanceId;
                        var $enTitlement = data.enTitlement;
                        var $date = data.date;
                        var $empId = $('#EmpId').val();

                        if ($attendanceId !== "Absent/RestDay") {
                            if ($holiday !== null)
                            {
                                var Hreturn = '<h4><span class="badge badge-success">' + $enTitlement + '</span></h4>';
                            }
                            else if ($holiday === null) {
                                var Hreturn = data.attendanceId;
                            }
                        }
                        else if ($attendanceId === null)
                        {
                            if ($holiday !== null) {
                                var Hreturn = '<h4><span class="badge badge-success">' + $enTitlement + '</span></h4>';
                            }
                            else if ($holiday === null) {
                                var Hreturn = data.attendanceId;
                            }
                        }
                        else if ($attendanceId === "Absent/RestDay")
                        {
                           
                            if ($holiday === null)
                            {
                                var Hreturn = '<h4><span class="badge badge-danger">' + $attendanceId + '</span></h4>';                      
                            }
                            else if ($holiday !== null) {
                                var Hreturn = '<h4><span class="badge badge-success">' + $enTitlement + '</span></h4>';
                            }                 
                        }
                        return Hreturn;
                    }
                },
                {
                    targets: 2,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                        var DaysEntry = days[dt.getDay()];                        
                        if (DaysEntry === "SUN" || DaysEntry === "SAT")
                        {
                            return '<h4><span class="badge badge-warning">' + DaysEntry + '</span></h4>';
                        }
                        else
                        {
                            return DaysEntry;
                        }
                    }
                },
                {
                    targets: 3,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 4,
                    data: { dateIn1: "dateIn", no1: "no" },
                    "render": function (data) {
                        var $No = data.no;
                        if ($No === 0)
                        {
                            return "";
                        }
                        else
                        {
                            var dt = new Date(data.dateIn);
                            return getFormattedDate(dt);
                        }
                    }
                },
                {
                    visible: true,
                    targets: 5,
                    data: "timeIn"
                },
                {
                    visible: true,
                    targets: 6,
                    data: "timeOut"
                },
                {
                    visible: true,
                    targets: 7,
                    data: { timeIn1: "timeIn", timeOut1: "timeOut", no1: "no", holiday: "holiday"},
                    "render": function (data) {

                        var $No = data.no;
                        var $holiday = data.holiday;
                        if ( $No === 0 && $holiday === null ) {
                            return "0";
                        }
                        else if ( $No === 0 && $holiday !== null ) {
                            //return document.getElementById("NoHours").value;
                            return "0";

                        }
                        else if ($No !== 0 && $holiday !== null)
                        {
                            var start = moment(data.timeIn, "HH:mm:ss a");
                            var end = moment(data.timeOut, "HH:mm:ss a");
                            var finaltime = (end - start);
                            finaltime = finaltime / 60 / 60 / 1000
                            return parseInt(finaltime);
                        }
                        else if ($No !== 0 && $holiday === null )
                        {
                            var start = moment(data.timeIn, "HH:mm:ss a");
                            var end = moment(data.timeOut, "HH:mm:ss a");
                            var finaltime = (end - start);
                            finaltime = finaltime / 60 / 60 / 1000
                            return parseInt(finaltime);
                        }
                    }
                },
                {
                    visible: true,
                    targets: 8,
                    data: { timeIn1: "timeIn", LateHour1: "LateHour" },
                    "render": function (data, type, row) {
                        var startLate = moment(data.timeIn, "HH:mm:ss a");
                        var endLate = moment(document.getElementById("TimeIn").value, "HH:mm:ss a");
                        var MinLate = moment(document.getElementById("MinLate").value, "HH:mm:ss a");

                        if (document.getElementById("FlexiTime").value == "false")
                        {
                            if (Date.parse(MinLate) < Date.parse(startLate))
                            {
                                var diff = startLate - endLate;
                                var hours = Math.floor(diff / 1000 / 60 / 60);
                                diff -= hours * (1000 * 60 * 60);
                                var minutes = Math.floor(diff / 1000 / 60);
                                diff -= minutes * (1000 * 60);

                                var Late = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;

                                var LateHour = '<h4><span class="badge badge-secondary">' + Late + '</span></h4>';
                            }
                            else
                            {
                                var LateHour = "00:00";
                            }
                        }
                        else
                        {
                            var LateHour = "00:00";
                        }
                        return LateHour;
                    }
                },
                {
                    targets: 9,
                    data: { timeIn: "timeIn", timeOut: "timeOut" },
                    
                    "render": function (data) {
                        var startOut = moment(data.timeOut, "HH:mm:ss a");
                        var TimeOut = moment(document.getElementById("TimeIOut").value, "HH:mm:ss a");

                        var Houwminutes = document.getElementById("NoHours").value;

                        var hours = Math.floor(document.getElementById("NoHours").value);
                        var minutes = Math.round((document.getElementById("NoHours").value % 1) * 100) / 100;
                        var HoursUndertime = moment(hours + ':' + minutes * 60 + '0', "LT");    

                        if (data.timeOut !== null) {
                            if (document.getElementById("FlexiTime").value == "false") {
                                if (Date.parse(startOut) < Date.parse(TimeOut)) {
                                    var diff = TimeOut - startOut;
                                    var hours = Math.floor(diff / 1000 / 60 / 60);
                                    diff -= hours * (1000 * 60 * 60);
                                    var minutes = Math.floor(diff / 1000 / 60);
                                    diff -= minutes * (1000 * 60);

                                    var time = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
                                    if (data.timeOut == data.timeIn)
                                    {
                                        uTime = '<h4><span class="badge badge-info">' + time + '</span></h4>';
                                    }
                                    else
                                    {
                                        uTime = '<h4><span class="badge badge-secondary">' + time + '</span></h4>';
                                    }                                    
                                }
                                else
                                {
                                    uTime = "00:00";
                                }
                            }
                            else if (document.getElementById("FlexiTime").value == "true")
                            {
                                if (data.timeOut !== null) {
                                    var start = moment(data.timeIn, "HH:mm:ss a");
                                    var end = moment(data.timeOut, "HH:mm:ss a");
                                    var finaltime = (end - start);
                                    finaltime = finaltime / 60 / 60 / 1000
                                    if (Houwminutes > finaltime)
                                    {
                                        var P = (Houwminutes - finaltime);

                                        var hours = Math.floor(P);
                                        var minutes = Math.round((P % 1) * 100) / 100;
                                        var PHoursUndertime = moment(hours + ':' + minutes * 60 + '0', "LT");    

                                        var dtt = new Date(PHoursUndertime);
                                        PHoursUndertime = getFormattedTime(dtt);
                                        var h = ("0" + dtt.getHours()).slice(-2);
                                        var m = ("0" + dtt.getMinutes()).slice(-2);
                                        var s = ("0" + dtt.getSeconds()).slice(-2);
                                        var UnTime = etime = h + ":" + m;

                                        if (data.timeOut == data.timeIn)
                                        {
                                            uTime = '<h4><span class="badge badge-info" >' + UnTime + '</span></h4>';
                                        }
                                        else
                                        {
                                            uTime = '<h4><span class="badge badge-secondary" >' + UnTime + '</span></h4>';
                                        }
                                    }
                                    else { uTime = "00:00";}
                                }
                                else
                                {
                                    uTime = "00:00";
                                }
                            }
                        }
                        else
                        {
                            uTime = "00:00";
                        }
                        return uTime;
                    },                    
                },
                {
                    visible: true,
                    targets: 10,
                    data: { timeIn1: "timeIn", timeOut1: "timeOut", no1: "no", holiday: "holiday" },
                    "render": function (data) {
                        if (document.getElementById("StrickOvertime").value == "true") {
                            var startOut = moment(data.timeOut, "HH:mm:ss a");
                            var TimeOut = moment(document.getElementById("TimeIOut").value, "HH:mm:ss a");

                            var hours = Math.floor(document.getElementById("NoHours").value);
                            var minutes = Math.round((document.getElementById("NoHours").value % 1) * 100) / 100;

                            var OTLimit = document.getElementById("OTNoHours").value;

                            if (data.timeOut !== null) {
                                if (document.getElementById("FlexiTime").value == "false") {
                                    if (Date.parse(startOut) > Date.parse(TimeOut)) {
                                        var diff = startOut - TimeOut;
                                        var hours = Math.floor(diff / 1000 / 60 / 60);
                                        if (hours >= OTLimit) {
                                            diff -= hours * (1000 * 60 * 60);
                                            var minutes = Math.floor(diff / 1000 / 60);
                                            diff -= minutes * (1000 * 60);

                                            //var time = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
                                            var UnderTime2 = '<h4><span class="badge badge-secondary">' + hours + '</span></h4>';
                                        }
                                        else {
                                            var UnderTime2 = "0";
                                        }

                                    }
                                    else {
                                        var UnderTime2 = "0";
                                    }
                                }
                                else if (document.getElementById("FlexiTime").value == "true") {
                                    if (data.timeOut !== null) {

                                        var start = moment(data.timeIn, "HH:mm:ss a");
                                        var end = moment(data.timeOut, "HH:mm:ss a");
                                        var diff = end - start;
                                        var CompHour = Math.floor(diff / 1000 / 60 / 60);
                                        if (CompHour >= hours) {
                                            var P = (CompHour - hours);
                                            if (P >= OTLimit) {
                                                FinalINT = P * (1000 * 60 * 60);
                                                var minutes2 = Math.floor(FinalINT / 1000 / 60);
                                                FinalINT -= minutes2 * (1000 * 60);

                                                var PHoursUndertime = (hours <= 9 ? "0" : "") + P + ":" + (minutes2 <= 9 ? "0" : "") + minutes2;

                                                var dtt = new Date(PHoursUndertime);
                                                PHoursUndertime = getFormattedTime(dtt);
                                                var h = ("0" + dtt.getHours()).slice(-2);
                                                var m = ("0" + dtt.getMinutes()).slice(-2);
                                                var s = ("0" + dtt.getSeconds()).slice(-2);
                                                var UTime = etime = h + ":" + m;

                                                var UnderTime2 = '<h4><span class="badge badge-secondary">' + P + '</span></h4>';
                                            }
                                            else {
                                                var UnderTime2 = "0";
                                            }
                                        }
                                        else {
                                            var UnderTime2 = "0";
                                        }
                                    }
                                    else {
                                        var UnderTime2 = "0";
                                    }
                                }
                            }
                            else
                            {
                                var UnderTime2 = "0";
                            }
                        }
                        else {
                            var UnderTime2 = "0";
                        }
                        return UnderTime2;
                    }
                },
                {
                    visible: true,
                    targets: 11,
                    data: { holiday: "holiday"},
                    "render": function (data, type, row) {
                        var $holiday = data.holiday;
                        if ($holiday === null)
                        {
                            return  $holiday;
                        }
                        else
                        {
                            return '<h4><span class="badge badge-warning">' + $holiday + '</span></h4>';
                        }
                    }
                },
                {
                    visible: false,
                    targets: 12,
                    data: "enTitlement"
                },
                {
                    visible: false,
                    targets: 13,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", company: "company" },
                    "render": function (data) {
                        return '<a id="edit-attendanceId" title="Select AttendanceId" href="#" class="edit-attendanceId" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-company="' + data.company + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        function GetAttendanceEmpRecord() {
            document.getElementById("EmployeeList").disabled = false;
            GetEmployees();
        }

        function GetAttendanceRecord() {
            dataTableAtt.ajax.reload();
        }

        $('#AttendanceTable').on('click', 'a.edit-attendanceId', function (e) {
            e.preventDefault();
            $('#attid').val("");
            var Id = $(this).attr("data-attendanceId-id");
            $('#attid').val(Id);
            GetAscAttendanceRecord(Id);
            GetDescAttendanceRecord(Id);
            GetAttendanceRecord();
            GetAttendanceEmpRecord();
        });
        function GetAscAttendanceRecord(Id) {
            _bioAttendanceService.getTop1AscOvertimeRate({ attendanceId: Id }).done(function (result) {
                abp.ui.setBusy(_$FormAtt);
                var StartDate = new Date(result.date);
                $('#DateRecStart').val(getFormattedDate(StartDate));

                GetAttendanceEmpRecord();
                abp.ui.clearBusy(_$FormAtt);
            });

        }

        function GetDescAttendanceRecord(Id) {
            _bioAttendanceService.getTop1DescOvertimeRate({ attendanceId: Id }).done(function (result) {
                abp.ui.setBusy(_$FormAttEmp);
                var EndDate = new Date(result.date);
                $('#DateRecEnd').val(getFormattedDate(EndDate));
                GetAttendanceEmpRecord();

                abp.ui.clearBusy(_$FormAttEmp);
            });
           
        }

        function GetEmployeeSalary(employeeId) {
            _employeeSalariesService.getTop1EmployeeSalary({ empId: employeeId, }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    var TimeIn2 = new Date(result.items[i].timeIn);
                    var TimeIOut2 = new Date(result.items[i].timeIOut);
                    var MinLate2 = new Date(result.items[i].minLate);

                    var currentTimeIn = new Date(TimeIn2),
                        hoursin = currentTimeIn.getHours(),
                        minutesin = currentTimeIn.getMinutes();

                    if (minutesin < 10) {
                        minutesin = "0" + minutesin;
                    }

                    var currentTimeOut = new Date(TimeIOut2),
                        hoursOut = currentTimeOut.getHours(),
                        minutesOut = currentTimeOut.getMinutes();

                    if (minutesOut < 10) {
                        minutesOut = "0" + minutesOut;
                    }

                    var currentTimeLate = new Date(MinLate2),
                        hoursLate = currentTimeLate.getHours(),
                        minutesLate = currentTimeLate.getMinutes();

                    if (minutesLate < 10) {
                        minutesLate = "0" + minutesLate;
                    }

                    $('#TimeIn').val(hoursin + ":" + minutesin);
                    $('#TimeIOut').val(hoursOut + ":" + minutesOut);
                    $('#MinLate').val(hoursLate + ":" + minutesLate);
                    $('#NoHours').val(result.items[i].dayCount)
                    var selectoptions = $('#StrickOvertime');
                    if (result.items[i].strickOverTime === true) {
                        selectoptions.append('<option value=' + result.items[i].strickOverTime + ' selected>Yes</option>');
                    }
                    else {
                        selectoptions.append('<option value=' + result.items[i].strickOverTime + ' selected>No</option>');
                    }
                    selectoptions.selectpicker('refresh');

                    var selectFlexiTime = $('#FlexiTime');
                    if (result.items[i].flexiTime === true) {
                        selectFlexiTime.append('<option value=' + result.items[i].flexiTime + ' selected>Yes</option>');
                    }
                    else {
                        selectFlexiTime.append('<option value=' + result.items[i].flexiTime + ' selected>No</option>');
                    }
                    selectFlexiTime.selectpicker('refresh');
                }
            })
        };

        function GetEmployeeOTRalesSalary(employeeId) {
            $('#OTNoHours').val(0);
            _employeeOTRateService.getTop1EmployeeOTRates({ empId: employeeId, }).done(function (result) {
                if (result == null)
                {
                    $('#OTNoHours').val(0)
                }
                else
                {
                    $('#OTNoHours').val(result.regularDayHours);
                }
            });
        }

        $('#SaveAttbutton').click(function (e) {
            e.preventDefault();
            SaveAtt();
        });

        function SaveAtt() {
            if (!_$FormAttid.valid()) {
                return;
            }
            var today = new Date();
            var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' +  today.getFullYear();

            var disabled = _$FormAttid.find(':input:disabled').removeAttr('disabled');
            var formdata = _$FormAttid.serializeFormToObject();

            var viewData = {
                empAttInputs: {

                    "empId": formdata.EmpId,
                    "empCode": formdata.EmpCode,
                    "attId": formdata.attid,
                    "dateRecStart": formdata.DateRecStart,
                    "dateRecEnd": formdata.DateRecEnd,
                    "timeIn": formdata.TimeIn,
                    "minLate": formdata.MinLate,
                    "timeIOut": formdata.TimeIOut,
                    "noHours": formdata.NoHours,
                    "strickOvertime": $("#StrickOvertime").val(),
                    "flexiTime": $("#FlexiTime").val(),
                    "oTNoHours": formdata.OTNoHours,
                    "status": "Active",
                    "date": date,
                    "description1": "",
                    "description2": ""
                },
                empAttDetailsInputs: []
            };
            
            disabled.attr('disabled', 'disabled');

            var table2 = $('#Attntable').DataTable();
            var form_data = table2.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {

                var $EmpId = formdata.EmpId;
                var $AttRecId = formdata.attid;
                var $No = f[i]["no"];
                var $attendanceId = f[i]["attendanceId"];
                //var $days = f[i][2];
                var $Enddate = f[i]["date"];
                var $dateIn = f[i]["dateIn"];
                var $timeInIN = f[i]["timeIn"];
                var $timeOutOut = f[i]["timeOut"];
                //var $hours = f[i][7];
                //var $late = f[i][8];
                //var $uTime = f[i][9];
                //var $ot = f[i][10];
                var $holiday = f[i]["holiday"];
                var $entitle2 = f[i]["enTitlement"];
                
                //No
                if ($No !== 0) {
                    var EndEmpNo = $No;
                }
                else
                {                    
                    var EndEmpNo = document.getElementById("EmpCode").value;
                }
                //No

                //date
                var dt = new Date($Enddate);
                var EndEndDate = getFormattedDate(dt)
                //date

                //days
                var dt = new Date($Enddate);
                var daydays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                var DateDay = daydays[dt.getDay()];
                //days

                //dateIn
                if ($No === 0) {
                    var EndDateIn =  "";
                }
                else {
                    var dt = new Date($dateIn);
                    var EndDateIn =  getFormattedDate(dt);
                }
                //dateIn

                //timeIn
                if ($timeInIN === null) {
                    var EndtimeInIN = "";
                }
                else {
                    var EndtimeInIN = $timeInIN;
                }
                //timeIn

                //timeOut
                if ($timeOutOut === null) {
                    var EndtimeOutOut = "";
                }
                else {
                    var EndtimeOutOut = $timeOutOut;
                }
                //timeOut

                //hours
                if ($No === 0 && $holiday === null) {
                    var EndfinalTime = "0";
                }
                else if ($No === 0 && $holiday !== null)
                {
                    var EndfinalTime = "0";
                }
                else if ($No !== 0 && $holiday !== null)
                {
                    var start = moment($timeInIN, "HH:mm:ss a");
                    var end = moment($timeOutOut, "HH:mm:ss a");
                    var finaltime = (end - start);
                    finaltime = finaltime / 60 / 60 / 1000
                    var EndfinalTime = parseInt(finaltime);
                }
                else if ($No !== 0 && $holiday === null) {
                    var start = moment($timeInIN, "HH:mm:ss a");
                    var end = moment($timeOutOut, "HH:mm:ss a");
                    var finaltime = (end - start);
                    finaltime = finaltime / 60 / 60 / 1000
                    var EndfinalTime = parseInt(finaltime);
                }
                //hours

                //Late
                var startLate = moment($timeInIN, "HH:mm:ss a");
                var endLate = moment(document.getElementById("TimeIn").value, "HH:mm:ss a");
                var MinLate = moment(document.getElementById("MinLate").value, "HH:mm:ss a");
                if (document.getElementById("FlexiTime").value == "false") {
                    if (Date.parse(MinLate) < Date.parse(startLate)) {
                        var diff = startLate - endLate;
                        var hours = Math.floor(diff / 1000 / 60 / 60);
                        diff -= hours * (1000 * 60 * 60);
                        var minutes = Math.floor(diff / 1000 / 60);
                        diff -= minutes * (1000 * 60);

                        var Late = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;

                        var EndLateHour = Late;
                    }
                    else {
                        var EndLateHour = "00:00";
                    }
                }
                else {
                    var EndLateHour = "00:00";
                }
                //Late

                //uTime
                var startOut = moment($timeOutOut, "HH:mm:ss a");
                var TimeOut = moment(document.getElementById("TimeIOut").value, "HH:mm:ss a");

                var Houwminutes = document.getElementById("NoHours").value;

                var hours = Math.floor(document.getElementById("NoHours").value);
                var minutes = Math.round((document.getElementById("NoHours").value % 1) * 100) / 100;

                if ($timeOutOut !== null) {
                    if (document.getElementById("FlexiTime").value == "false") {
                        if (Date.parse(startOut) < Date.parse(TimeOut)) {
                            var diff = TimeOut - startOut;
                            var hours = Math.floor(diff / 1000 / 60 / 60);
                            diff -= hours * (1000 * 60 * 60);
                            var minutes = Math.floor(diff / 1000 / 60);
                            diff -= minutes * (1000 * 60);

                            var time = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
                            if ($timeOutOut == $timeInIN) {
                                var EnduTime = time;
                            }
                            else {
                                var EnduTime = time;
                            }
                        }
                        else {
                            var EnduTime = "00:00";
                        }
                    }
                    else if (document.getElementById("FlexiTime").value == "true") {
                        if ($timeOutOut !== null) {
                            var start = moment($timeInIN, "HH:mm:ss a");
                            var end = moment($timeOutOut, "HH:mm:ss a");
                            var finaltime = (end - start);
                            finaltime = finaltime / 60 / 60 / 1000
                            if (Houwminutes > finaltime) {
                                var P = (Houwminutes - finaltime);

                                var hours = Math.floor(P);
                                var minutes = Math.round((P % 1) * 100) / 100;
                                var PHoursUndertime = moment(hours + ':' + minutes * 60 + '0', "LT");

                                var dtt = new Date(PHoursUndertime);
                                PHoursUndertime = getFormattedTime(dtt);
                                var h = ("0" + dtt.getHours()).slice(-2);
                                var m = ("0" + dtt.getMinutes()).slice(-2);
                                var s = ("0" + dtt.getSeconds()).slice(-2);
                                var UnTime = etime = h + ":" + m;

                                if ($timeOutOut == $timeInIN) {
                                    var EnduTime = UnTime;
                                }
                                else {
                                    var EnduTime = UnTime;
                                }
                            }
                            else { var EnduTime = "00:00"; }
                        }
                        else {
                            var EnduTime = "00:00";
                        }
                    }
                }
                else
                {
                    EnduTime = "00:00";
                }
                //uTime

                //OT
                if (document.getElementById("StrickOvertime").value == "true") {
                    var startOut = moment($timeOutOut, "HH:mm:ss a");
                    var TimeOut = moment(document.getElementById("TimeIOut").value, "HH:mm:ss a");

                    var hours = Math.floor(document.getElementById("NoHours").value);
                    var minutes = Math.round((document.getElementById("NoHours").value % 1) * 100) / 100;

                    var OTLimit = document.getElementById("OTNoHours").value;

                    if ($timeOutOut !== null) {
                        if (document.getElementById("FlexiTime").value == "false") {
                            if (Date.parse(startOut) > Date.parse(TimeOut)) {
                                var diff = startOut - TimeOut;
                                var hours = Math.floor(diff / 1000 / 60 / 60);
                                if (hours >= OTLimit) {
                                    diff -= hours * (1000 * 60 * 60);
                                    var minutes = Math.floor(diff / 1000 / 60);
                                    diff -= minutes * (1000 * 60);

                                    //var time = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
                                    var Overtime = hours ;
                                }
                                else {
                                    var Overtime = "0";
                                }

                            }
                            else {
                                var Overtime = "0";
                            }
                        }
                        else if (document.getElementById("FlexiTime").value == "true") {
                            if ($timeOutOut !== null) {

                                var start = moment($timeInIN, "HH:mm:ss a");
                                var end = moment($timeOutOut, "HH:mm:ss a");
                                var diff = end - start;
                                var CompHour = Math.floor(diff / 1000 / 60 / 60);
                                if (CompHour >= hours) {
                                    var P = (CompHour - hours);
                                    if (P >= OTLimit) {
                                        FinalINT = P * (1000 * 60 * 60);
                                        var minutes2 = Math.floor(FinalINT / 1000 / 60);
                                        FinalINT -= minutes2 * (1000 * 60);

                                        var PHoursUndertime = (hours <= 9 ? "0" : "") + P + ":" + (minutes2 <= 9 ? "0" : "") + minutes2;

                                        var dtt = new Date(PHoursUndertime);
                                        PHoursUndertime = getFormattedTime(dtt);
                                        var h = ("0" + dtt.getHours()).slice(-2);
                                        var m = ("0" + dtt.getMinutes()).slice(-2);
                                        var s = ("0" + dtt.getSeconds()).slice(-2);
                                        var UTime = etime = h + ":" + m;

                                        var Overtime =  P ;
                                    }
                                    else {
                                        var Overtime = "0";
                                    }
                                }
                                else {
                                    var Overtime = "0";
                                }
                            }
                            else {
                                var Overtime = "0";
                            }
                        }
                    }
                    else {
                        var Overtime = "0";
                    }
                }
                else {
                    var Overtime = "0";
                }
                //OT

                //holiday1
                if ($holiday === null) {
                    var Endholiday1 = "";
                }
                else {
                    var Endholiday1 = $holiday;
                }
                //holiday1

                //entitle2
                if ($entitle2 === null) {
                    var Endentitle = "";
                }
                else {
                    var Endentitle = $entitle2;
                }
                //entitle2

                //var $attendanceId = f[i][1];
                //var $days = f[i][2];
                //var $date = f[i][3];
                //var $dateIn = f[i][4];
                //var $timeIn = f[i][5];
                //var $timeOut = f[i][6];
                //var $hours = f[i][7];
                //var $late = f[i][8];
                //var $uTime = f[i][9];
                //var $ot = f[i][10];
                //var $holiday = f[i][11];
                //var $entitle = f[i][12];

                item = {};
                item["empId"] = $EmpId;
                item["no"] = EndEmpNo;
                item["AttRecId"] = $AttRecId;
                item["attId"] = $attendanceId;
                item["days"] = DateDay;
                item["date"] = EndEndDate;
                item["dateIn"] = EndDateIn;
                item["in"] = EndtimeInIN;
                item["out"] = EndtimeOutOut;
                item["hours"] = EndfinalTime;
                item["late"] = EndLateHour;
                item["uTime"] = EnduTime;
                item["oT"] = Overtime;
                item["holidayLeave"] = Endholiday1;
                item["enTitle"] = Endentitle;
                item["Description1"] = "";
                item["Description2"] = "";
                item["Status"] = "Active";

                viewData.empAttDetailsInputs.push(item);
            }

            abp.message.confirm(
                'Employee Attendance be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$FormAttidDetails);
                        _empAttRecordService.createEmpAtt(viewData).done(function (result) {
                            if (result === null || result === "0") { return; }
                            abp.notify.success('Employee Attendace Save', 'Success');
                            //window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + result;
                        }).always(function () {
                            GetEmployees();
                            document.getElementById("completeName").value = "";
                            document.getElementById("EmpCode").value = "";
                            document.getElementById("TimeIn").value = "";
                            document.getElementById("TimeIOut").value = "";
                            //document.getElementById("attid").value = "";
                            abp.ui.clearBusy(_$FormAttidDetails);
                        });
                    }
                }
            );
        }
    });
})(jQuery);