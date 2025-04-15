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

$('#CompressButton').click(function (e) {
    $('#CompressButton').hide();
    $('#ExpandButton').show();
});
$('#ExpandButton').click(function (e) {
    $('#CompressButton').show();
    $('#ExpandButton').hide();
});
document.getElementById('TableName').readOnly = true;

document.getElementById('RegularDayDescription').readOnly = true;
document.getElementById('RestDayDescription').readOnly = true;
document.getElementById('SpecialHolidayDescription').readOnly = true;
document.getElementById('LegalHolidayDescription').readOnly = true;
document.getElementById('SpecialHolidayRDDescription').readOnly = true;
document.getElementById('LegalHolidayRDDescription').readOnly = true;
document.getElementById('DoubleHolidayDescription').readOnly = true;
document.getElementById('DoubleHolidayRDDescription').readOnly = true;

document.getElementById('RegularDayHours').readOnly = true;
document.getElementById('RestDayHour').readOnly = true;
document.getElementById('SpecialHolidayHour').readOnly = true;
document.getElementById('LegalHolidayHour').readOnly = true;
document.getElementById('SpecialHolidayRDHour').readOnly = true;
document.getElementById('LegalHolidayRDHour').readOnly = true;
document.getElementById('DoubleHolidayHour').readOnly = true;
document.getElementById('DoubleHolidayRDHour').readOnly = true;

document.getElementById('RegularDay').readOnly = true;
document.getElementById('RestDay').readOnly = true;
document.getElementById('SpecialHoliday').readOnly = true;
document.getElementById('LegalHoliday').readOnly = true;
document.getElementById('SpecialHolidayRD').readOnly = true;
document.getElementById('LegalHolidayRD').readOnly = true;
document.getElementById('DoubleHoliday').readOnly = true;
document.getElementById('DoubleHolidayRD').readOnly = true; 

document.getElementById('RegularDayOT').readOnly = true;
document.getElementById('RestDayOT').readOnly = true;
document.getElementById('SpecialHolidayOT').readOnly = true;
document.getElementById('LegalHolidayOT').readOnly = true;
document.getElementById('SpecialHolidayRDOT').readOnly = true;
document.getElementById('LegalHolidayRDOT').readOnly = true;
document.getElementById('DoubleHolidayDOT').readOnly = true;
document.getElementById('DoubleHolidayRDOT').readOnly = true; 

document.getElementById('RegularDayND').readOnly = true;
document.getElementById('RestDayND').readOnly = true;
document.getElementById('SpecialHolidayND').readOnly = true;
document.getElementById('LegalHolidayND').readOnly = true;
document.getElementById('SpecialHolidayRDND').readOnly = true;
document.getElementById('LegalHolidayRDND').readOnly = true;
document.getElementById('DoubleHolidayDND').readOnly = true;
document.getElementById('DoubleHolidayRDND').readOnly = true;

document.getElementById('RegularDayNDOT').readOnly = true;
document.getElementById('RestDayNDOT').readOnly = true;
document.getElementById('SpecialHolidayNDOT').readOnly = true;
document.getElementById('LegalHolidayNDOT').readOnly = true;
document.getElementById('SpecialHolidayRDNDOT').readOnly = true;
document.getElementById('LegalHolidayRDNDOT').readOnly = true;
document.getElementById('DoubleHolidayNDOT').readOnly = true;
document.getElementById('DoubleHolidayRDNDOT').readOnly = true; 


(function () {
    $(function () {

        var _$Employeestable = $('#EmployeesTable');
        var _$RatesTable = $('#RatesTable');
        var _$EmployeeOTRates = $('#EmployeeOTRates');

        var _employeesservice = abp.services.app.employeeService;
        var _employeeOTRateService = abp.services.app.employeeOTRateService;
        var _overtimeRatesService = abp.services.app.overtimeRatesService;

        var _$formEmployeeId = $('form[name=EmployeeId]');
        var _$formEmployeeRate = $('form[name=OvertimeRateSettings]');

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
            GetOtRatesEmployees();
            Refresh();
        });

        //Rates

        var dataTable1 = _$RatesTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _overtimeRatesService.getOvertimeRate,
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
                    data: "tableName"
                },
                {
                    orderable: false,
                    targets: 2,
                    class: "text-center",
                    data: { id: "id", tableName: "tableName" },
                    "render": function (data) {
                        return '<a id="edit-RatesTable" title="Select RatesTable" href="#" class="edit-RatesTable" data-RatesTable-id="' + data.id + '" ><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        function GetRatesList() {
            dataTable1.ajax.reload();
        }

        $('#RatesTable').on('click', 'a.edit-RatesTable', function (e) {
            e.preventDefault();
            $('#TabId').val("");
            var $id = $(this).attr("data-RatesTable-id");
            _overtimeRatesService.getTop1OvertimeRate({ id: $id }).done(function (result) {
                $('#TabId').val(result.id);
                $('#TableName').val(result.tableName);

                $('#RegularDayDescription').val(result.regularDayDescription);
                $('#RestDayDescription').val(result.restDayDescription);
                $('#SpecialHolidayDescription').val(result.specialHolidayDescription);
                $('#LegalHolidayDescription').val(result.legalHolidayDescription);
                $('#SpecialHolidayRDDescription').val(result.specialHolidayRDDescription);
                $('#LegalHolidayRDDescription').val(result.legalHolidayRDDescription);
                $('#DoubleHolidayDescription').val(result.doubleHolidayDescription);
                $('#DoubleHolidayRDDescription').val(result.doubleHolidayRDDescription);

                $('#RegularDayHours').val(result.regularDayHours);
                $('#RestDayHour').val(result.restDayHour);
                $('#SpecialHolidayHour').val(result.specialHolidayHour);
                $('#LegalHolidayHour').val(result.legalHolidayHour);
                $('#SpecialHolidayRDHour').val(result.specialHolidayRDHour);
                $('#LegalHolidayRDHour').val(result.legalHolidayRDHour);
                $('#DoubleHolidayHour').val(result.doubleHolidayHour);
                $('#DoubleHolidayRDHour').val(result.doubleHolidayRDHour);

                $('#RegularDay').val(result.regularDay);
                $('#RestDay').val(result.restDay);
                $('#SpecialHoliday').val(result.specialHoliday);
                $('#LegalHoliday').val(result.legalHoliday);
                $('#SpecialHolidayRD').val(result.specialHolidayRD);
                $('#LegalHolidayRD').val(result.legalHolidayRD);
                $('#DoubleHoliday').val(result.doubleHoliday);
                $('#DoubleHolidayRD').val(result.doubleHolidayRD);

                $('#RegularDayOT').val(result.regularDayOT);
                $('#RestDayOT').val(result.restDayOT);
                $('#SpecialHolidayOT').val(result.specialHolidayOT);
                $('#LegalHolidayOT').val(result.legalHolidayOT);
                $('#SpecialHolidayRDOT').val(result.specialHolidayRDOT);
                $('#LegalHolidayRDOT').val(result.legalHolidayRDOT);
                $('#DoubleHolidayDOT').val(result.doubleHolidayDOT);
                $('#DoubleHolidayRDOT').val(result.doubleHolidayRDOT);

                $('#RegularDayND').val(result.regularDayND);
                $('#RestDayND').val(result.restDayND);
                $('#SpecialHolidayND').val(result.specialHolidayND);
                $('#LegalHolidayND').val(result.legalHolidayND);
                $('#SpecialHolidayRDND').val(result.specialHolidayRDND);
                $('#LegalHolidayRDND').val(result.legalHolidayRDND);
                $('#DoubleHolidayDND').val(result.doubleHolidayDND);
                $('#DoubleHolidayRDND').val(result.doubleHolidayRDND);

                $('#RegularDayNDOT').val(result.regularDayNDOT);
                $('#RestDayNDOT').val(result.restDayNDOT);
                $('#SpecialHolidayNDOT').val(result.specialHolidayNDOT);
                $('#LegalHolidayNDOT').val(result.legalHolidayNDOT);
                $('#SpecialHolidayRDNDOT').val(result.specialHolidayRDNDOT);
                $('#LegalHolidayRDNDOT').val(result.legalHolidayRDNDOT);
                $('#DoubleHolidayNDOT').val(result.doubleHolidayNDOT);
                $('#DoubleHolidayRDNDOT').val(result.doubleHolidayRDNDOT);
            });


        });

        $('#RateSavebutton').click(function (e) {
            e.preventDefault();
            UpdateStatus();
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
                        _employeeOTRateService.createEmployeeOTRates(items).done(function () {
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
                            GetOtRatesEmployees();
                        });
                    }
                }
            );
            
        }

        var dataTable2 = _$EmployeeOTRates.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeeOTRateService.getEmployeeOTRates,
                inputFilter: function () {
                    //var $p = $('#EmpId').val();
                    var $p = document.getElementById("EmpId").value;

                    if ($p === '') {
                        $p = '0';
                    }
                    return {
                        filter: $p
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
                    visible:false,
                    targets: 1,
                    data: "empId"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "tabId"
                },
                {
                    targets: 3,
                    data: "fullName"
                },
                {
                    targets: 4,
                    data: "tableName"
                },
                {
                    visible: true,
                    targets: 5,
                    data: "status"
                },

                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id", tabId: "tabId", empId: "empId", fullName: "fullName"},
                    "render": function (data) {
                        return '<a id="edit-EmployeeOTRates" title="OT Rate Employee" href="#" class="edit-EmployeeOTRates" data-EmployeeOTRates-tabId="' + data.tabId + '" data-EmployeeOTRates-completeName="' + data.completeName + '" data-EmployeeOTRates-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>&nbsp;|&nbsp;<a id="delete-EmployeeOTRates" title="Delete OT Rate Employee" href="#" class="delete-EmployeeOTRates" data-EmployeeOTRates-tabId="' + data.tabId + '" data-EmployeeOTRates-completeName="' + data.completeName + '" data-EmployeeOTRates-id="' + data.id + '"><i class="fa fa-lg fa-trash"></i></a>';
                    }
                }
            ]
        });

        function GetOtRatesEmployees() {
            dataTable2.ajax.reload();
        }

        $('#EmployeeOTRates').on('click', 'a.edit-EmployeeOTRates', function (e) {
            e.preventDefault();
            $('#TabId').val("");
            var $tabId = $(this).attr("data-EmployeeOTRates-tabId");
            _overtimeRatesService.getTop1OvertimeRate({ id: $tabId }).done(function (result) {
                $('#TabId').val(result.id);
                $('#TableName').val(result.tableName);

                $('#RegularDayDescription').val(result.regularDayDescription);
                $('#RestDayDescription').val(result.restDayDescription);
                $('#SpecialHolidayDescription').val(result.specialHolidayDescription);
                $('#LegalHolidayDescription').val(result.legalHolidayDescription);
                $('#SpecialHolidayRDDescription').val(result.specialHolidayRDDescription);
                $('#LegalHolidayRDDescription').val(result.legalHolidayRDDescription);
                $('#DoubleHolidayDescription').val(result.doubleHolidayDescription);
                $('#DoubleHolidayRDDescription').val(result.doubleHolidayRDDescription);

                $('#RegularDayHours').val(result.regularDayHours);
                $('#RestDayHour').val(result.restDayHour);
                $('#SpecialHolidayHour').val(result.specialHolidayHour);
                $('#LegalHolidayHour').val(result.legalHolidayHour);
                $('#SpecialHolidayRDHour').val(result.specialHolidayRDHour);
                $('#LegalHolidayRDHour').val(result.legalHolidayRDHour);
                $('#DoubleHolidayHour').val(result.doubleHolidayHour);
                $('#DoubleHolidayRDHour').val(result.doubleHolidayRDHour);

                $('#RegularDay').val(result.regularDay);
                $('#RestDay').val(result.restDay);
                $('#SpecialHoliday').val(result.specialHoliday);
                $('#LegalHoliday').val(result.legalHoliday);
                $('#SpecialHolidayRD').val(result.specialHolidayRD);
                $('#LegalHolidayRD').val(result.legalHolidayRD);
                $('#DoubleHoliday').val(result.doubleHoliday);
                $('#DoubleHolidayRD').val(result.doubleHolidayRD);

                $('#RegularDayOT').val(result.regularDayOT);
                $('#RestDayOT').val(result.restDayOT);
                $('#SpecialHolidayOT').val(result.specialHolidayOT);
                $('#LegalHolidayOT').val(result.legalHolidayOT);
                $('#SpecialHolidayRDOT').val(result.specialHolidayRDOT);
                $('#LegalHolidayRDOT').val(result.legalHolidayRDOT);
                $('#DoubleHolidayDOT').val(result.doubleHolidayDOT);
                $('#DoubleHolidayRDOT').val(result.doubleHolidayRDOT);

                $('#RegularDayND').val(result.regularDayND);
                $('#RestDayND').val(result.restDayND);
                $('#SpecialHolidayND').val(result.specialHolidayND);
                $('#LegalHolidayND').val(result.legalHolidayND);
                $('#SpecialHolidayRDND').val(result.specialHolidayRDND);
                $('#LegalHolidayRDND').val(result.legalHolidayRDND);
                $('#DoubleHolidayDND').val(result.doubleHolidayDND);
                $('#DoubleHolidayRDND').val(result.doubleHolidayRDND);

                $('#RegularDayNDOT').val(result.regularDayNDOT);
                $('#RestDayNDOT').val(result.restDayNDOT);
                $('#SpecialHolidayNDOT').val(result.specialHolidayNDOT);
                $('#LegalHolidayNDOT').val(result.legalHolidayNDOT);
                $('#SpecialHolidayRDNDOT').val(result.specialHolidayRDNDOT);
                $('#LegalHolidayRDNDOT').val(result.legalHolidayRDNDOT);
                $('#DoubleHolidayNDOT').val(result.doubleHolidayNDOT);
                $('#DoubleHolidayRDNDOT').val(result.doubleHolidayRDNDOT);
            });


        });

        function UpdateStatus() {
            var $empId = document.getElementById("EmpId").value;
            
            _employeeOTRateService.updateEmployeeOTRates({ EmpId: $empId }).done(function () {

                    $.ajax({
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        success: function () { },
                        error: function (e) { }
                    });
                    
            });
            GetOtRatesEmployees();
        }

        function Refresh() {

            $('#TabId').val("");
            $('#TableName').val("");

            $('#RegularDayDescription').val("Regular");
            $('#RestDayDescription').val("Rest Day");
            $('#SpecialHolidayDescription').val("Special Holiday");
            $('#LegalHolidayDescription').val("Legal Holiday");
            $('#SpecialHolidayRDDescription').val("Special Holiday Rest Day");
            $('#LegalHolidayRDDescription').val("Legal Holiday Rest Day");
            $('#DoubleHolidayDescription').val("Double Holiday");
            $('#DoubleHolidayRDDescription').val("Double Holiday Rest Day");

            $('#RegularDayHours').val("1");
            $('#RestDayHour').val("1");
            $('#SpecialHolidayHour').val("1");
            $('#LegalHolidayHour').val("1");
            $('#SpecialHolidayRDHour').val("1");
            $('#LegalHolidayRDHour').val("1");
            $('#DoubleHolidayHour').val("1");
            $('#DoubleHolidayRDHour').val("1");

            $('#RegularDay').val("0.000");
            $('#RestDay').val("0.000");
            $('#SpecialHoliday').val("0.000");
            $('#LegalHoliday').val("0.000");
            $('#SpecialHolidayRD').val("0.000");
            $('#LegalHolidayRD').val("0.000");
            $('#DoubleHoliday').val("0.000");
            $('#DoubleHolidayRD').val("0.000");

            $('#RegularDayOT').val("0.000");
            $('#RestDayOT').val("0.000");
            $('#SpecialHolidayOT').val("0.000");
            $('#LegalHolidayOT').val("0.000");
            $('#SpecialHolidayRDOT').val("0.000");
            $('#LegalHolidayRDOT').val("0.000");
            $('#DoubleHolidayDOT').val("0.000");
            $('#DoubleHolidayRDOT').val("0.000");

            $('#RegularDayND').val("0.000");
            $('#RestDayND').val("0.000");
            $('#SpecialHolidayND').val("0.000");
            $('#LegalHolidayND').val("0.000");
            $('#SpecialHolidayRDND').val("0.000");
            $('#LegalHolidayRDND').val("0.000");
            $('#DoubleHolidayDND').val("0.000");
            $('#DoubleHolidayRDND').val("0.000");

            $('#RegularDayNDOT').val("0.000");
            $('#RestDayNDOT').val("0.000");
            $('#SpecialHolidayNDOT').val("0.000");
            $('#LegalHolidayNDOT').val("0.000");
            $('#SpecialHolidayRDNDOT').val("0.000");
            $('#LegalHolidayRDNDOT').val("0.000");
            $('#DoubleHolidayNDOT').val("0.000");
            $('#DoubleHolidayRDNDOT').val("0.000");
        }

        // Delete record
        $('#EmployeeOTRates').on('click', 'a.delete-EmployeeOTRates', function (e) {
            e.preventDefault();
            var $id = $(this).attr("data-EmployeeOTRates-id");
            
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Employees Rates Confirmation', 'ezinvmvc'), $id),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _employeeOTRateService.deleteEmployeeOTRates({ id: $id }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });
                            GetOtRatesEmployees();
                        });
                    }
                }
            );
        });
    });
})(jQuery);