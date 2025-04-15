
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

$('#CompressButton').hide();
$('#ExpandButton').show();

$('#PayrollRate').on('change', function () {
    var selectedValue = this.selectedOptions[0].value;
    clearAllMinimal();
    if (selectedValue === '5') {
        document.getElementById("PayrollRatePerMonth").readOnly = false;
        document.getElementById("PayrollRatePerWeek").readOnly = true;
        document.getElementById("PayrollRatePerDay").readOnly = true;
        document.getElementById("PayrollRatePerHour").readOnly = true;
        document.getElementById("PayrollRatePerPiece").readOnly = true;
    }
    if (selectedValue === '6') {
        document.getElementById("PayrollRatePerMonth").readOnly = true;
        document.getElementById("PayrollRatePerWeek").readOnly = false;
        document.getElementById("PayrollRatePerDay").readOnly = true;
        document.getElementById("PayrollRatePerHour").readOnly = true;
        document.getElementById("PayrollRatePerPiece").readOnly = true;
    }
    if (selectedValue === '7') {
        document.getElementById("PayrollRatePerMonth").readOnly = true;
        document.getElementById("PayrollRatePerWeek").readOnly = true;
        document.getElementById("PayrollRatePerDay").readOnly = false;
        document.getElementById("PayrollRatePerHour").readOnly = true;
        document.getElementById("PayrollRatePerPiece").readOnly = true;
    }
    if (selectedValue === '8') {
        document.getElementById("PayrollRatePerMonth").readOnly = true;
        document.getElementById("PayrollRatePerWeek").readOnly = true;
        document.getElementById("PayrollRatePerDay").readOnly = true;
        document.getElementById("PayrollRatePerHour").readOnly = false;
        document.getElementById("PayrollRatePerPiece").readOnly = true;
    }
    //if (selectedValue === '8') {
    //    document.getElementById("PayrollRatePerMonth").readOnly = true;
    //    document.getElementById("PayrollRatePerWeek").readOnly = true;
    //    document.getElementById("PayrollRatePerDay").readOnly = true;
    //    document.getElementById("PayrollRatePerHour").readOnly = true;
    //    document.getElementById("PayrollRatePerPiece").readOnly = false;
    //}
});
function clearAll() {
    $('#StartDate').val("");
    $('#EndDate').val("");
    $('#PayrollPeriod').val("");
    $('#PayrollRate').val("");
    $('#PayrollRatePerMonth').val("");
    $('#PayrollRatePerWeek').val("");
    $('#PayrollRatePerDay').val("");
    $('#PayrollRatePerHour').val("");
    $('#PayrollRatePerPiece').val("");
    //$('#StrickOvertime').val("true");
    //$('#Status').val("Active").change();
    $('#TimeIn').val("08:00");
    $('#TimeIOut').val("17:00");
    $('#MinLate').val("08:15")
    $('#DeductionLate').val("0.00");;
    //$('#FlexiTime').val("");

    $('#StrickOvertime').selectpicker('refresh');
    $('#StrickOvertime').val();
    //var selectStrickOvertime = $('#StrickOvertime').val();
    //selectStrickOvertime.selectpicker('refresh');

    var selectFlexiTime = $('#FlexiTime');
    selectFlexiTime.selectpicker('refresh');
}
function clearAllMinimal() {
    $('#PayrollRatePerMonth').val("")
    $('#PayrollRatePerWeek').val("")
    $('#PayrollRatePerDay').val("")
    $('#PayrollRatePerHour').val("")
    $('#PayrollRatePerPiece').val("")
}
function UnlockAll() {
    document.getElementById("StartDate").readOnly = false;
    document.getElementById("EndDate").readOnly = false;
    document.getElementById("PayrollPeriod").disabled = false;
    document.getElementById("PayrollRate").disabled = false;
    document.getElementById("PayrollRatePerMonth").readOnly = true;
    document.getElementById("PayrollRatePerWeek").readOnly = true;
    document.getElementById("PayrollRatePerDay").readOnly = true;
    document.getElementById("PayrollRatePerHour").readOnly = true;
    document.getElementById("PayrollRatePerPiece").readOnly = true;
    document.getElementById("StrickOvertime").disabled = false;
    document.getElementById("Status").disabled = false;
    document.getElementById("TimeIn").readOnly = false;
    document.getElementById("TimeIOut").readOnly = false;
    document.getElementById("MinLate").readOnly = false;
    document.getElementById("FlexiTime").disabled = false;
    document.getElementById("DeductionLate").disabled = false;
}
function lockAll() {
    document.getElementById("StartDate").readOnly = true;
    document.getElementById("EndDate").readOnly = true;
    document.getElementById("PayrollPeriod").disabled = true;
    document.getElementById("PayrollRate").disabled = true;
    document.getElementById("PayrollRatePerMonth").readOnly = true;
    document.getElementById("PayrollRatePerWeek").readOnly = true;
    document.getElementById("PayrollRatePerDay").readOnly = true;
    document.getElementById("PayrollRatePerHour").readOnly = true;
    document.getElementById("PayrollRatePerPiece").readOnly = true;
    document.getElementById("StrickOvertime").disabled = true;
    document.getElementById("Status").disabled = true;
    document.getElementById("TimeIn").readOnly = true;
    document.getElementById("TimeIOut").readOnly = true;
    document.getElementById("MinLate").readOnly = true;
    document.getElementById("FlexiTime").disabled = true;
    document.getElementById("DeductionLate").disabled = true;
}
// Employees
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

        var _$Employeestable = $('#EmployeesTable');
        var _$Salarytable = $('#EmployeeRates');

        var _$formEmployeeId = $('form[name=EmployeeId]');
        var _$formEmployeeRate = $('form[name=EmployeeRateSettings]');

        var _employeeSalariesService = abp.services.app.employeeSalariesService;
        var _employeesservice = abp.services.app.employeeService;
        var _hRTypeService = abp.services.app.hRTypeService;

        //HrType
        var payrollRateType = $('#PayrollRate');
        payrollRateType.empty();
        _hRTypeService.getAllPeriodType().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                payrollRateType.append('<option value=' + result.items[i].id + '>' + result.items[i].status + '</option>');
            }
            payrollRateType.selectpicker('refresh');
        });

        var payrollTypePeriod = $('#PayrollPeriod');
        payrollTypePeriod.empty();
        _hRTypeService.getAllPeriodRate().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                payrollTypePeriod.append('<option value=' + result.items[i].id + '>' + result.items[i].status + '</option>');
            }
            payrollTypePeriod.selectpicker('refresh');
        });

        //employee
        var dataTable = _$Employeestable.DataTable({
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
                    data: { id: "id", completeName: "completeName" },
                    "render": function (data) {
                        return '<a id="edit-Employee" title="Edit Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '" data-Employee-completeName="' + data.completeName + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        function GetEmployees() {
            dataTable.ajax.reload();
        }

        $('#GetEmployeeButton').click(function (e) {
            e.preventDefault();
            GetEmployees();
        });

        $('#EmployeeFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }

            e.preventDefault();
            GetEmployees();
        });

        $('#EmployeeTableFilter').focus();

        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            $('#EmpId').val("");
            $('#completeName').val("");
            var employeeId = $(this).attr("data-Employee-id");
            var completeName = $(this).attr("data-Employee-completeName");
            $('#EmpId').val(employeeId);
            $('#completeName').val(completeName);
            lockAll();
            clearAll();
            GetEmployeeSalary(employeeId);
            GetEmployeeSalaryHistory();
        });

        //EmployeeSalary
        var SaldataTable = _$Salarytable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeeSalariesService.getEmployeeSalary,
                inputFilter: function () {
                    var $d = $('#EmpId').val();
                    if ($d === '') {
                        $d = '0';
                    }
                    return {
                        filter: $d
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',
                    visible: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    visible: false,
                    targets: 1,
                    data: "fullName"
                },
                {
                    targets: 2,
                    data: "payrollP"
                },
                {
                    targets: 3,
                    data: "payrollR"
                },
                {
                    targets: 4,
                    data: "startDate",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 5,
                    data: "endDate",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: true,
                    targets: 6,
                    data: "payrollAmount",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    orderable: true,
                    targets: 7,
                    data: "status"
                },
                {
                    orderable: false,
                    targets:8,
                    class: "text-center",
                    data: { id: "id" },
                    "render": function (data) {
                        return '<a id="delete-Salary" title="Delete Employee Salary" href="#" class="delete-Salary" delete-Salary-id="' + data.id + '"><i class="fa fa-lg fa-trash-o"></i></a>';
                    }
                }
            ]
        });

        function GetEmployeeSalary(employeeId) {
            _employeeSalariesService.getTop1EmployeeSalary({ empId: employeeId, }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var startDate2 = new Date(result.items[i].startDate);
                    var endDate2 = new Date(result.items[i].endDate);
                    var payrollPeriod2 = result.items[i].payrollPeriod;
                    var payrollRate2 = result.items[i].payrollRate;
                    var payrollRatePerMonth2 = result.items[i].payrollRatePerMonth;
                    var monthCount2 = result.items[i].monthCount;
                    var payrollRatePerWeek2 = result.items[i].payrollRatePerWeek;
                    var weekCount2 = result.items[i].weekCount;
                    var payrollRatePerDay2 = result.items[i].payrollRatePerDay;
                    var dayCount2 = result.items[i].dayCount;
                    var payrollRatePerHour2 = result.items[i].payrollRatePerHour;
                    var hourCount2 = result.items[i].hourCount;
                    var payrollRatePerPiece2 = result.items[i].payrollRatePerPiece;
                    var pieceCount2 = result.items[i].pieceCount;

                    var TimeIn2 = new Date(result.items[i].timeIn);
                    var TimeIOut2 = new Date(result.items[i].timeIOut);
                    var MinLate2 = new Date(result.items[i].minLate);
                    var status2 = result.items[i].status;
                    var deductionLate2 = result.items[i].deductionLate;
                    $('#StartDate').val(getFormattedDate(startDate2));
                    $('#EndDate').val(getFormattedDate(endDate2));
                    $('#PayrollPeriod').val(payrollPeriod2).change();
                    $('#PayrollRate').val(payrollRate2).change();
                    $('#PayrollRatePerMonth').val(payrollRatePerMonth2);
                    $('#MonthCount').val(monthCount2);
                    $('#PayrollRatePerWeek').val(payrollRatePerWeek2);
                    $('#WeekCount').val(weekCount2);
                    $('#PayrollRatePerDay').val(payrollRatePerDay2);
                    $('#DayCount').val(dayCount2);
                    $('#PayrollRatePerHour').val(payrollRatePerHour2);
                    $('#HourCount').val(hourCount2);
                    $('#PayrollRatePerPiece').val(payrollRatePerPiece2);
                    $('#PieceCount').val(pieceCount2);
                    $('#Status').val(status2).change();
                    $('#DeductionLate').val(deductionLate2);

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
        function GetEmployeeSalaryHistory() {
            SaldataTable.ajax.reload();
        };

        $('#AllowanceSavebutton').click(function (e) {
            e.preventDefault();
            saveRateRecord();
        });

        function saveRateRecord() {
            if (!_$formEmployeeId.valid()) {
                return;
            }
            if (!_$formEmployeeRate.valid()) {
                return;
            }
            var account = _$formEmployeeId.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account2 = _$formEmployeeRate.serializeFormToObject();
            var items = { ...account, ...account2 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formEmployeeRate);
                        _employeeSalariesService.createEmployeeSalary(items).done(function () {
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
                            abp.ui.clearBusy(_$formEmployeeRate);
                            GetEmployeeSalaryHistory();
                        });
                    }
                }
            );
        }

        $('#AllowanceNewbutton').click(function (e) {
            e.preventDefault();
            UnlockAll();
            clearAll();
        });

        $('#AllowanceCancelbutton').click(function (e) {
            e.preventDefault();
            var employeeId = document.getElementById("EmpId").value;
            $('#EmpId').val(employeeId);
            GetEmployeeSalary(employeeId);
            GetEmployeeSalaryHistory();
            lockAll();
        });

        // Delete record
        $('#EmployeeRates').on('click', 'a.delete-Salary', function (e) {
            var employeeRatesId = $(this).attr("delete-Salary-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Employees Confirmation', 'ezinvmvc'), employeeRatesId),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _employeeSalariesService.deleteEmployeeSalary({
                            id: employeeRatesId
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });

                            var employeeId = document.getElementById("EmpId").value;
                            $('#EmpId').val(employeeId);
                            GetEmployeeSalary(employeeId);
                            GetEmployeeSalaryHistory();
                            lockAll();
                        });
                    }
                }
            );
        });
        $('#PayrollRatePerDay').change(function () {
            ComputePerday();
        });
        function ComputePerday() {
            var Perday = $('#PayrollRatePerDay').val();
            var PerWeekCount = $('#WeekCount').val();
            var AmountPerWeek = Perday * PerWeekCount
            $('#PayrollRatePerWeek').val(AmountPerWeek.toFixed(2));

            var PerMonthCountCount = $('#MonthCount').val();
            var AmountPerMonth = Perday * PerMonthCountCount
            $('#PayrollRatePerMonth').val(AmountPerMonth.toFixed(2));

            var PerHourDayCount = $('#DayCount').val();
            var AmountPerHour = Perday / PerHourDayCount
            $('#PayrollRatePerHour').val(AmountPerHour.toFixed(2));

            var PayrollRatePerMonth = $('#PayrollRatePerMonth').val();
            var AmounPayrollRatePerPiece = PayrollRatePerMonth / 2
            $('#PayrollRatePerPiece').val(AmounPayrollRatePerPiece.toFixed(2));
        }

        $('#PayrollRatePerWeek').change(function () {
            ComputePerWeek();
        });
        function ComputePerWeek() {

            var AmountPerWeek = $('#PayrollRatePerWeek').val();
            var PerWeekCount = $('#WeekCount').val();
            var AmountPerDay = AmountPerWeek / PerWeekCount
            $('#PayrollRatePerDay').val(AmountPerDay.toFixed(2));

            var Perday = $('#PayrollRatePerDay').val();
            var PerHourDayCount = $('#DayCount').val();
            var AmountPerHour = Perday / PerHourDayCount
            $('#PayrollRatePerHour').val(AmountPerHour.toFixed(2));

            ComputePerday();
        }

        $('#PayrollRatePerHour').change(function () {
            ComputePerHour();
        });
        function ComputePerHour() {

            var PayrollRatePerHourAmount = $('#PayrollRatePerHour').val();
            var PerHourDayCount = $('#DayCount').val();
            var AmountPerDay = PayrollRatePerHourAmount * PerHourDayCount;
            $('#PayrollRatePerDay').val(AmountPerDay.toFixed(2));

            ComputePerday();

        }

        $('#PayrollRatePerMonth').change(function () {
            ComputePerMonth();
        });
        function ComputePerMonth() {

            var PayrollRatePerHourAmount = $('#PayrollRatePerMonth').val();
            var PerHourDayCount = $('#MonthCount').val();
            var AmountPerDay = PayrollRatePerHourAmount / PerHourDayCount;
            $('#PayrollRatePerDay').val(AmountPerDay.toFixed(2));

            ComputePerday();

        }
    });
})(jQuery);