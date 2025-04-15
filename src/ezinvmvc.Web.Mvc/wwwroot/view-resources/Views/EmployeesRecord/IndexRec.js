
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

$('#Add').show();
$('#Update').hide();

$('#AddLeave').show();
$('#UpdateLeave').hide();

$('#SaveItemButton').show();
$('#UpdateItemButton').hide();

$('#SaveLeaveButton').show();
$('#UpdateLeaveButton').hide();


(function () {
    $(function () {

        //Employee
        var _employeeRecordService = abp.services.app.employeeRecordService;
        var _employeeattendanceService = abp.services.app.employeeAttendanceService;
        var _employeeLeaveService = abp.services.app.employeeLeaveService;
        var _employeesservice = abp.services.app.employeeService;

        var _$table = $('#EmployeesTable');
        var _$tablePerformance = $('#PerformanceTable');
        var _$tableAttendance = $('#AttendanceTable');
        var _$tableLeaves = $('#LeavesTable');

        var _$form = $('form[name=EmployeeRecordCreateForm]');
        var _$formId = $('form[name=EmployeeRecordIdForm]');
        var _$formLeave = $('form[name=EmployeeLeaveCreateForm]');
        var _$formEmployeeId = $('form[name=EmployeeId]');
        var _$formLeaveId = $('form[name=EmployeeLeaveIdCreateForm]');
        

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeesservice.getEmployees,
                inputFilter: function () {
                    var $p = $('#EmployeeTableFilter').val();
                    var $c = $('#SearchBy').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $c + '|' + $p
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
                    targets: 1,
                    data: "completeName"
                },
                {
                    orderable: false,
                    targets: 2,
                    class: "text-center",
                    data: { id: "id", completeName: "completeName" },
                    "render": function (data) {
                        return '<a id="edit-Employee" title="View Items" href="#" class="edit-Employee" data-Employee-id="' + data.id + '"data-Employee-name="' + data.completeName + '"><i class="fa fa-arrow-right"></i></a>';
                    }
                }
            ]
        });
        
        $('#EmployeeTableFilter').focus();
        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            $('#EmpId').val("");
            $('#FullName').val("");
            $('#Id').val("");
            $('#Date').val("");
            $('#Description').val("");
            var employeeId = $(this).attr("data-Employee-id");
            var employeeName = $(this).attr("data-Employee-name");

            $('#EmpId').val(employeeId);
            $('#EmpId2').val(employeeId);
            $('#FullName').val(employeeName);

            $('#Add').show();
            $('#Update').hide();
            
            $('#AddLeave').show();
            $('#UpdateLeave').hide();

            $('#SaveItemButton').show();
            $('#UpdateItemButton').hide();

            $('#SaveLeaveButton').show();
            $('#UpdateLeaveButton').hide();

            GetPerformanceRecord();
            GetAttendanceRecord();
            GetLeaveRecord();
        });

        //Records
        var dataTablePerfromance = _$tablePerformance.DataTable({
            paging: false,
            serverSide: false,
            processing: false,
            searching: false,
            listAction: {
                ajaxFunction: _employeeRecordService.getAccountsAbility,
                inputFilter: function () {
                    var $p = $('#EmpId').val();
                    if ($p === "") {
                        $p = '0';
                    }
                    return {
                        filter: $p
                    };
                }
            },
            columnDefs: [
                {
                    className: 'form control',
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    targets: 1,
                    "data": "description"
                },
                {
                    targets: 2,
                    "data": "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    visible: false,
                    targets: 3,
                    data: "id",
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", EmpId: "EmpId" },
                    "render": function (data) {
                        return '<a id="edit-PerformanceTable" title="Edit Performance Table" href="#" class="edit-PerformanceTable" data-PerformanceTable-id="' + data.id + '" data-PerformanceTable-date="' + data.date + '"  data-PerformanceTable-description="' + data.description + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>&nbsp;|&nbsp;<a id="new-PerformanceTable" title="New" href="#" data-PerformanceTable-id="' + data.id + '" class="new-PerformanceTable"><i class="fa fa-lg fa-dropbox"></i></a>';
                    }
                }
            ]
        });
        function GetPerformanceRecord() {
            dataTablePerfromance.ajax.reload();
        }
        function savePerformanceRecord() {
            if (!_$form.valid()) {
                return;
            }
            if (!_$formEmployeeId.valid()) {
                return;
            }
            var Record1 = _$formEmployeeId.serializeFormToObject();
            var Record2 = _$form.serializeFormToObject();
            var items = { ...Record2, ...Record1 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _employeeRecordService.createEmployeeRecord(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            GetPerformanceRecord();
                        });
                    }
                }
            );
        }
        $('#SaveItemButton').click(function (e) {
            e.preventDefault();
            savePerformanceRecord();
        });

        $('#PerformanceTable').on('click', 'a.edit-PerformanceTable', function (e) {
            e.preventDefault();
            var id = $(this).attr("data-PerformanceTable-id");
            var date = $(this).attr("data-PerformanceTable-date");
            var description = $(this).attr("data-PerformanceTable-description");

            var date2 = moment(date).format('MM/DD/YYYY');

            $('#Id').val(id);
            $('#Date').val(date2);
            $('#Description').val(description);

            $('#Add').hide();
            $('#Update').show();
            $('#SaveItemButton').hide();
            $('#UpdateItemButton').show();
        });

        $('#PerformanceTable').on('click', 'a.new-PerformanceTable', function (e) {
            e.preventDefault();
            $('#Id').val("");
            $('#Date').val("");
            $('#Description').val("")
            var x = document.getElementById("EmpId").value;
            var y = document.getElementById("FullName").value;
            $("#EmpId").val(x);
            $("#FullName").val(y);

            $('#Add').show();
            $('#Update').hide();

            $('#SaveItemButton').show();
            $('#UpdateItemButton').hide();
        });

        $('#UpdateItemButton').click(function (e) {
            e.preventDefault();
            UpdateAccount();
        });

        function UpdateAccount() {
            
            if (!_$formEmployeeId.valid()) {
                return;
            }
            if (!_$formId.valid()) {
                return;
            }
            if (!_$form.valid()) {
                return;
            }
            var Record1 = _$formEmployeeId.serializeFormToObject();
            var Record2 = _$formId.serializeFormToObject();
            var Record3 = _$form.serializeFormToObject();
            var items = { ...Record1, ...Record2, ...Record3 };
            abp.message.confirm(
                'Employee Update!',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _employeeRecordService.updateEmployeeRecord(items).done(function () {
                            $.ajax({
                                success: function () {
                                    abp.notify.info('Employee info updated', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                        $('#Id').val("");
                        $('#Date').val("");
                        $('#Description').val("")
                        //var x = document.getElementById("EmpId").value;
                        //var y = document.getElementById("FullName").value;
                        //$("#EmpId").val(x);
                        //$("#FullName").val(y);

                        $('#Add').show();
                        $('#Update').hide();

                        GetPerformanceRecord();
                    }
                }
            );
        }

        //Attendance
        var dataTableAttendance = _$tableAttendance.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeeattendanceService.getEmployeeAttendance,
                inputFilter: function () {
                    var $a = $('#DateFrom').val();
                    var $b = $('#DateTo').val();
                    var $c = $('#Status').val();
                    var $d = $('#EmpId').val();
                    if ($a === '') {
                        $a = 'null';
                    }
                    if ($b === '') {
                        $b = 'null';
                    }
                    if ($c === '') {
                        $c = 'null';
                    }
                    if ($d === '') {
                        $d = 'null';
                    }
                    return {
                        filter: $a + '|' + $b + '|' + $c + '|' + $d
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
                    targets: 2,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 3,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 2,
                    class: "text-center",
                    data: { id: "id", completeName: "completeName" },
                    "render": function (data) {
                        return '<a id="edit-Employee" title="View Items" href="#" class="edit-Employee" data-Employee-id="' + data.id + '"data-Employee-name="' + data.completeName + '"><i class="fa fa-archive"></i></a>';
                    }
                }
            ]
        });
        $('#FilterAttendaceButton').click(function (e) {
            dataTableAttendance.ajax.reload();
        });
        function GetAttendanceRecord() {
            dataTableAttendance.ajax.reload();
        }

        //Leaves
        function GetLeaveRecord() {
            dataTableLeave.ajax.reload();
        }
        var dataTableLeave = _$tableLeaves.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeeLeaveService.getEmployeeLeave,
                inputFilter: function () {
                    var $d = $('#EmpId').val();
                    if ($d === "") {
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
                    targets: 2,
                    data: "dateFrom",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 3,
                    data: "dateTo",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 4,
                    data: "description"
                },
                {
                    targets: 5,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id", empId: "empId" },
                    "render": function (data) {
                        return '<a id="edit-Leave" title="View Items" href="#" class="edit-Leave" data-Leave-id="' + data.id + '"data-Leave-empId="' + data.empId + '" data-Leave-datefrom="' + data.dateFrom + '" data-Leave-dateTo="' + data.dateTo + '"data-Leave-description="' + data.description + '"data-Leave-status="' + data.status + '"><i class="fa fa-lg fa-pencil-square-o"></i></a> &nbsp;|&nbsp; <a id="new-Leave" title="New" href="#" data-Leave-id="' + data.id + '" class="new-Leave"><i class="fa fa-lg fa-dropbox"></i></a>';
                    }
                }
            ]
        });
        $('#SaveLeaveButton').click(function (e) {
            e.preventDefault();
            saveLeaveRecord();
        });
        $('#LeavesTable').on('click', 'a.edit-Leave', function (e) {
            e.preventDefault();
            var id = $(this).attr("data-Leave-id");
            var empId = $(this).attr("data-Leave-empId"); 
            var datefrom = $(this).attr("data-Leave-datefrom");
            var dateTo = $(this).attr("data-Leave-dateTo");
            var description = $(this).attr("data-Leave-description");
            var status = $(this).attr("data-Leave-status");

            var datefrom2 = moment(datefrom).format('MM/DD/YYYY');
            var dateTo2 = moment(dateTo).format('MM/DD/YYYY');

            $('#Id').val(id);
            $('#EmpId').val(empId);
            $('#LeaveDateFrom').val(datefrom2);
            $('#LeaveDateTo').val(dateTo2);
            $('#LeaveDescription').val(description);

            $("#LeaveStatus").val(status).change();
            $('#AddLeave').hide();
            $('#UpdateLeave').show();

            $('#SaveLeaveButton').hide();
            $('#UpdateLeaveButton').show();
        });
        $('#LeavesTable').on('click', 'a.new-Leave', function (e) {
            e.preventDefault();
            $('#LeaveId').val("");
            $('#LeaveDateFrom').val("");
            $('#LeaveDateTo').val("");
            $('#LeaveStatus').val("")
            $('#LeaveDescription').val("")

            $('#AddLeave').show();
            $('#UpdateLeave').hide();

            $('#SaveLeaveButton').show();
            $('#UpdateLeaveButton').hide();
        });
        $('#UpdateLeaveButton').click(function (e) {
            e.preventDefault();
            UpdateLeave();
        });
        function UpdateLeave() {
            if (!_$formEmployeeId.valid()) {
                return;
            }
            if (!_$formLeave.valid()) {
                return;
            }
            if (!_$formId.valid()) {
                return;
            }
            var Leave1 = _$formEmployeeId.serializeFormToObject();
            var Leave2 = _$formLeave.serializeFormToObject();
            var Leave3 = _$formId.serializeFormToObject();
            var items = { ...Leave1, ...Leave2, ...Leave3 };
            abp.message.confirm(
                'Employee Update!',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLeave);
                        _employeeLeaveService.updateEmployeeLeave(items).done(function () {
                            $.ajax({
                                success: function () {
                                    abp.message.success('Employee leave updated', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formLeave);
                        });
                        $('#LeaveId').val("");
                        $('#LeaveDateFrom').val("");
                        $('#LeaveDateTo').val("");
                        $('#LeaveStatus').val("")
                        $('#LeaveDescription').val("")
                        //var x = document.getElementById("LeaveEmpId").value;
                        //var y = document.getElementById("FullName").value;
                        //$("#EmpId").val(x);
                        //$("#FullName").val(y);

                        $('#SaveLeaveButton').show();
                        $('#UpdateLeaveButton').hide();

                        GetLeaveRecord();
                    }
                }
            );
        }
        function saveLeaveRecord() {

            if (!_$formEmployeeId.valid()) {
                return;
            }
            if (!_$formLeave.valid()) {
                return;
            }
            var Leave1 = _$formEmployeeId.serializeFormToObject();
            var Leave2 = _$formLeave.serializeFormToObject();
            
            var items = { ...Leave1, ...Leave2 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLeave);
                        _employeeLeaveService.createEmployeeLeave(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.message.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formLeave);
                            GetLeaveRecord();
                        });
                    }
                }
            );
        }
        function GetLeaveRecord() {
            dataTableLeave.ajax.reload();
        }
    });
})();
