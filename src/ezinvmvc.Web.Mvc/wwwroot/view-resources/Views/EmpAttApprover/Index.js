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
document.getElementById("FlexiTime").disabled = true;
document.getElementById("StrickOvertime").disabled = true;

$('#CompressButton').show();
$('#ExpandButton').hide();

(function () {
    $(function () {

        $('#CompressButton').click(function (e) {
            $('#CompressButton').hide();
            $('#ExpandButton').show();
        });
        $('#ExpandButton').click(function (e) {
            $('#CompressButton').show();
            $('#ExpandButton').hide();
        });

        var _employeesservice = abp.services.app.employeeService;
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _$Employeestable = $('#EmployeesTable');
        var _$Attntable = $('#Attntable');
        var _$EmpAttIdTable = $('#EmpAttIdTable');
        var _$formAttEmpUpdate = $('form[name=FormAttEmpUpdate]');
        var _$formAttid = $('form[name=Attid]');

        var dataTable = _$Employeestable.DataTable({
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
            dataTable.ajax.reload();
        }
        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            $('#EmpId').val("");
            $('#completeName').val("");
            $('#EmpCode').val("");

            var employeeId = $(this).attr("data-Employee-id");
            var completeName = $(this).attr("data-Employee-completeName");
            var $empCode = $(this).attr("data-Employee-employeeCode");
            $('#completeName').val(completeName);
            $('#EmpId').val(employeeId);
            $('#EmpCode').val($empCode);
            GetAttendanceRecord();
            dataTableRec.ajax.reload();
        });

        function GetAttendanceRecord() {
            dataTableatt.ajax.reload();
            $('#EmpId').val("0");
            $('#attid').val("0");
            dataTableRec.ajax.reload();
        }
        var dataTableatt = _$EmpAttIdTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _empAttRecordService.getEmpAtt,
                inputFilter: function () {
                    var $d = $('#EmpId').val();
                    if ($d === '') {
                        $d = 0;
                    }
                    return {
                        filter: $d
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
                    visible: false,
                    targets: 1,
                    data: "empId"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "empCode"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "attId"
                },
                {
                    targets: 4,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 5,
                    data: "dateRecStart",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 6,
                    data: "dateRecEnd",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    visible: true,
                    targets: 7,
                    data: "status"
                },
                
                {
                    orderable: false,
                    targets: 8,
                    class: "text-center",
                    data: { id: "id", empId: "empId", attId: "attId", timeIn: "timeIn", minLate: "minLate", timeIOut: "timeIOut", noHours: "noHours", otNoHours: "otNoHours", strickOvertime: "strickOvertime", flexiTime: "flexiTime"  },
                    "render": function (data) {
                        var $strickOT = data.strickOvertime === true ? '1' : '0';
                        var $flexi = data.flexiTime === true ? '1' : '0';
                        return '<a id="View-attendanceId" title="View Attendance" href="#" class="View-attendanceId" data-attendanceId-id="' + data.id + '" data-attendanceId-empId="' + data.empId + '"  data-attendanceId-attId="' + data.attId + '" data-attendanceId-timeIn="' + data.timeIn + '" data-attendanceId-minLate="' + data.minLate + '" data-attendanceId-timeIOut="' + data.timeIOut + '" data-attendanceId-noHours="' + data.noHours + '" data-attendanceId-otNoHours="' + data.otNoHours + '"  data-attendanceId-strickOvertime="' + $strickOT + '" data-attendanceId-flexiTime ="' + $flexi + '"><i class="fa fa-lg fa-pencil-square-o color-blue"></i></a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="delete-attendanceId" title="delete" href="#" class="delete-attendanceId" data-attendanceId-id="' + data.id + '"><i class="fa fa-lg fa-trash-o color-red"></i></a>';
                    }
                }
            ]
        });
        
        // Delete record
        $('#EmpAttIdTable').on('click', 'a.delete-attendanceId', function (e) {
            var $id = $(this).attr("data-attendanceId-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Attendance', 'ezinvmvc'), $id),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _empAttRecordService.deleteEmpAttId({
                            id: $id
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });
                            GetAttendanceRecord();
                        });
                    }
                }
            );
        });

        //View Record
        $('#EmpAttIdTable').on('click', 'a.View-attendanceId', function (e) {
            e.preventDefault();
            $('#EmpId').val("");
            $('#attid').val("");
            $('#TimeIn').val("");
            $('#MinLate').val("");
            $('#TimeIOut').val("");
            $('#NoHours').val(0);
            $('#OTNoHours').val(0);


            var $EmpId = $(this).attr("data-attendanceId-EmpId");
            var $id = $(this).attr("data-attendanceId-id");
            var $attId = $(this).attr("data-attendanceId-attId");
            var $timeIn = $(this).attr("data-attendanceId-timeIn");
            var $minLate = $(this).attr("data-attendanceId-minLate");
            var $timeOut = $(this).attr("data-attendanceId-timeIOut");
            var $noHours = $(this).attr("data-attendanceId-noHours");
            var $oTNoHours = $(this).attr("data-attendanceId-oTNoHours");
            var $strickOvertime = $(this).attr("data-attendanceId-strickOvertime");
            var $flexiTime = $(this).attr("data-attendanceId-flexiTime");


            $('#EmpId').val($EmpId);
            $('#attid').val($attId);
            $('#TimeIn').val($timeIn);
            $('#MinLate').val($minLate);
            $('#TimeIOut').val($timeOut);
            $('#NoHours').val($noHours);
            $('#OTNoHours').val($oTNoHours);
            $('#StrickOvertime').val($strickOvertime);
            $('#FlexiTime').val($flexiTime);
            $('#StrickOvertime').selectpicker('refresh');
            $('#FlexiTime').selectpicker('refresh');

            GetAttendanceRecordDetails();
        });
        function GetAttendanceRecordDetails() {
            dataTableRec.ajax.reload();
        }
        var dataTableRec = _$Attntable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _empAttRecordService.getEmpAttRecord,
                inputFilter: function () {
                    var $d = $('#EmpId').val();
                    var $e = $('#attid').val();

                    if ($d === '') {
                        $d = 0;
                    }
                    if ($e === '') {
                        $e = 0;
                    }
                    return {
                        filter: $d + '|' + $e
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
                    visible: false,
                    targets: 1,
                    data: "empId"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "no"
                },
                {
                    visible: true,
                    targets: 3,
                    data: { attId: "attId", holidayLeave: "holidayLeave", enTitle: "enTitle" },
                    "render": function (data) {
                        var $holiday = data.holidayLeave;
                        var $attendanceId = data.attId;
                        var $enTitlement = data.enTitle;

                        if ($attendanceId !== "Absent/RestDay") {
                            if ($holiday !== "" ||$holiday !== null) {
                                var Hreturn = data.attId;
                            }
                            else if ($holiday === "" || $holiday === null) {
                                var Hreturn = '<h4><span class="badge badge-success">' + $enTitlement + '</span></h4>';
                               
                            }
                        }
                        
                        else if ($attendanceId === "Absent/RestDay") {
                            if ($holiday === "" || $holiday === null) {
                                var Hreturn = '<h4><span class="badge badge-danger">' + data.attId + '</span></h4>';                            
                            }
                            else if ($holiday !== "" || $holiday === null) {
                                var Hreturn = '<h4><span class="badge badge-success">' + $enTitlement + '</span></h4>';    
                            }
                        }
                        return Hreturn;
                    }
                },
                {
                    visible: true,
                    targets: 4,
                    data: { days: "days" },
                    "render": function (data) {
                        var $days = data.days;
                        if ($days === "SUN" || $days === "SAT") {
                            return '<h4><span class="badge badge-warning">' + $days + '</span></h4>';
                        }
                        else {
                            return $days;
                        }

                        //return getFormattedDate(dt);
                    }
                },
                {
                    targets: 5,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 6,
                    data: { dateIn: "dateIn" },
                    "render": function (data) {
                        var $dateIn = data.dateIn;
                        if ($dateIn === null) {
                            return "";
                        }
                        else {
                            var dt = new Date($dateIn);
                            return getFormattedDate(dt);
                        }
                    }
                },
                {
                    visible: true,
                    targets: 7,
                    data: "in"
                },
                {
                    visible: true,
                    targets: 8,
                    data: "out"
                },
                {
                    visible: true,
                    targets: 9,
                    data: "hours"
                },
                {
                    visible: true,
                    targets: 10,
                    data: "late"
                },
                {
                    visible: true,
                    targets: 11,
                    data: "uTime"
                },
                {
                    visible: true,
                    targets: 12,
                    data: "ot"
                },
                {
                    visible: true,
                    targets: 13,
                    data: "holidayLeave"
                },
                {
                    visible: false,
                    targets: 14,
                    data: "enTitle"
                },                
                {
                    visible: false,
                    targets: 15,
                    data: "description1"
                },
                {
                    visible: true,
                    targets: 16,
                    data: "status"
                },
                {
                    visible: false,
                    targets: 17,
                    data: "id"
                },
                {
                    orderable: false,
                    targets: 18,
                    class: "text-center",
                    data: { id: "id", attId: "attId", empId: "empId", days: "days", date: "date", dateIn: "dateIn", in: "in", out: "out", hours: "hours", late: "late", uTime: "uTime", ot: "ot", holidayLeave: "holidayLeave", enTitle: "enTitle", description1: "description1", status: "status" },
                    "render": function (data) {
                        return '<a id="edit-Attntable" title="edit Attntable" href="#" class="edit-Attntable" data-Attntable-id="' + data.id + '"  data-attendanceId-attId="' + data.attId + '"  data-attendanceId-days="' + data.days + '" data-attendanceId-date="' + data.date + '" data-attendanceId-dateIn="' + data.dateIn + '" data-attendanceId-in="' + data.in + '" data-attendanceId-out="' + data.out + '" data-attendanceId-hours="' + data.hours + '" data-attendanceId-late="' + data.late + '" data-attendanceId-uTime="' + data.uTime + '" data-attendanceId-ot="' + data.ot + '" data-attendanceId-holidayLeave="' + data.holidayLeave + '" data-attendanceId-enTitle="' + data.enTitle + '" data-attendanceId-description1="' + data.description1 + '" data-attendanceId-status="' + data.status + '" data-attendanceId-empId="' + data.empId + '" data-toggle="modal" data-target="#EmployeeAttUpdateModal"><i class="fa fa-lg fa-pencil-square-o color-blue"></i></a>';
                    }
                }
            ]
        });

        $('#Attntable').on('click', 'a.edit-Attntable', function (e) {
            e.preventDefault();

            //$('#Ida').val("");
            //$('#AttIda').val("");
            //$('#attid').val("");
            //$('#TimeIn').val("");
            //$('#MinLate').val("");
            //$('#TimeIOut').val("");
            //$('#NoHours').val(0);
            //$('#OTNoHours').val(0);

            var $id = $(this).attr("data-Attntable-id");
            var $AttId = $(this).attr("data-attendanceId-attId");
            var $days = $(this).attr("data-attendanceId-days");
            var $date = $(this).attr("data-attendanceId-date");
            var $dateIn = $(this).attr("data-attendanceId-dateIn");
            var $in = $(this).attr("data-attendanceId-in");
            var $out = $(this).attr("data-attendanceId-out");
            var $hours = $(this).attr("data-attendanceId-hours");
            var $late = $(this).attr("data-attendanceId-late");
            var $uTime = $(this).attr("data-attendanceId-uTime");
            var $ot = $(this).attr("data-attendanceId-ot");
            var $holidayLeave = $(this).attr("data-attendanceId-holidayLeave");
            var $enTitle = $(this).attr("data-attendanceId-enTitle");
            var $description1 = $(this).attr("data-attendanceId-description1");
            var $status = $(this).attr("data-attendanceId-status");
            var $empId = $(this).attr("data-attendanceId-empId");

            if ($date === "null" || $date === "") {
                $date = "";
            }
            else
            {
                var dt = new Date($date);
                $date = getFormattedDate(dt);
            }

            if ($dateIn === "null" || $dateIn === "") {
                $dateIn = "";
            }
            else {
                var dt = new Date($dateIn);
                $dateIn = getFormattedDate(dt);
            }

            $('#Ida').val($id);
            $('#AttIda').val($AttId);
            $('#EmpId').val($empId);
            $('#AttRecId').val($AttId);
            $('#Daysa').val($days);
            $('#Datea').val($date);
            $('#DateIna').val($dateIn);
            $('#Ina').val($in);
            $('#Outa').val($out);
            $('#Hoursa').val($hours);
            $('#Latea').val($late);
            $('#Utimea').val($uTime);
            $('#OTa').val($ot);
            $('#holidayLeavea').val($holidayLeave);
            $('#enTitlea').val($enTitle);
            $('#Descriptiona').val($description1);
            $('#Statusa').val($status);

        });

        $('#Updatebutton').click(function (e) {
            e.preventDefault();
            UpdateAtt();
        });
        function UpdateAtt() {
            if (!_$formAttEmpUpdate.valid()) {
                return;
            }
            if (!_$formAttid.valid()) {
                return;
            }
            var account5 = _$formAttEmpUpdate.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account6 = _$formAttid.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var items4 = { ...account5, ...account6 };
            abp.message.confirm(
                'Employee Attendance Update!',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formAttEmpUpdate);
                        _empAttRecordService.updateEmployeeLoans(items4).done(function () {
                            $.ajax({
                                success: function () {
                                    abp.notify.info('Employee info updated', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formAttEmpUpdate);
                        });

                        GetAttendanceRecord();
                    }
                }
            );
        }
    });
})(jQuery);