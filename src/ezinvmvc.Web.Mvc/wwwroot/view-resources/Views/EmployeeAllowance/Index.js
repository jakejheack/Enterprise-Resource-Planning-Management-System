
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

(function () {
    $(function () {

        var _$Employeestable = $('#EmployeesTable');
        var _$EmployeeAllowance = $('#EmployeeAllowance');

        var _employeesservice = abp.services.app.employeeService;
        var _employeeAllowanceService = abp.services.app.employeeAllowanceService;
        var _hRTypeService = abp.services.app.hRTypeService;

        var _$formEmployeeId = $('form[name=EmployeeId]');
        var _$formEmployeeRate = $('form[name=EmployeeAllowanceSettings]');

        var payrollTypePeriod = $('#Period');
        payrollTypePeriod.empty();
        _hRTypeService.getAllPeriodRate().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                payrollTypePeriod.append('<option value=' + result.items[i].id + '>' + result.items[i].status + '</option>');
            }
            payrollTypePeriod.selectpicker('refresh');
        });

        var dataTable = _$Employeestable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeesservice.getAllEmp,
                inputFilter: function () {
                    var $p = $('#EmployeeTableFilter').val();
                    var $s = $('#StatusId').val();
                    var $c = $('#SearchBy').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $c + '|' + $p + '|' + $s
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
                        return '<a id="edit-Employee" title="Edit Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '" data-Employee-completeName="' + data.completeName + '" data-dismiss="modal"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
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
            GeAllowanceHistory(employeeId);
            //GeAllowanceHistory();
        });
        $('#AllowanceSavebutton').click(function (e) {
            e.preventDefault();
            AllowanceSavebutton();
        });
        function AllowanceSavebutton() {
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
                        _employeeAllowanceService.createEmployeeAllowance(items).done(function () {
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
                            GeAllowanceHistory();
                            ClearText();
                        });
                    }
                }
            );
        }

        //allowances
        var AllowancedataTable = _$EmployeeAllowance.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeeAllowanceService.getEmployeeAllowance,
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
                    visible: true,
                    targets: 1,
                    data: "empId"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "fullName"
                },
                {
                    targets: 3,
                    data: "description"
                },
                {
                    targets: 4,
                    data: "allowanceP"
                },
                {
                    targets: 5,
                    data: "startDate",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 6,
                    data: "endDate",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    //orderable: true,
                    //targets: 7,
                    //data: "deminimis"
                    orderable: true,
                    targets: 7,
                    data: { deminimis: "deminimis" },
                    "render": function (data) {
                        var $deminimis = data.deminimis;
                        if ($deminimis === true) {
                            return '<h4><span class="badge badge-warning">Yes</span></h4>';
                        }
                        else {
                            return '<h4><span class="badge badge-warning">No</span></h4>';
                        }
                    }
                },
                {
                    orderable: true,
                    targets: 8,
                    data: { cola: "cola" },
                    "render": function (data) {
                        var $cola = data.cola;
                        if ($cola === true) {
                            return '<h4><span class="badge badge-warning">Ecola</span></h4>';
                        }
                        else {
                            return '<h4><span class="badge badge-warning">Allowance</span></h4>';
                        }
                    }
                },
                {
                    orderable: true,
                    targets: 9,
                    data: { amount: "amount" },
                    "render": function (data) {
                        var $amount = data.amount;
                        return '<h4><span class="badge badge-warning">' + $amount.toFixed(2) + '</span></h4>';
                    }
                },
                {
                    orderable: true,
                    targets: 10,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 11,
                    class: "text-center",
                    data: { id: "id", description: "description", allowanceP: "allowanceP", startDate: "startDate", endDate:"endDate"},
                    "render": function (data) {
                        //return '<a id="delete-AllowancedataTable" title="Delete Employee Allowance" href="#" class="delete-AllowancedataTable" delete-AllowancedataTable-id="' + data.id + '"><i class="fa fa-lg fa-trash-o"></i></a>';
                    

                        //return '<a id="edit-Employee" title="Edit Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>&nbsp;|&nbsp;<a id="delete-Employee" title="delete" href="#" class="delete-Employee" data-Employee-id="' + data.id + '" data-Employee-name="' + data.firstName + '" data-Employee-code="' + data.employeeCode + '"><i class="fa fa-lg fa-trash-o"></i></a>';
                        var edit = '<a id="edit-AllowancedataTable" title="Edit Employee Allowance" href="#" class="edit-AllowancedataTable" data-AllowancedataTable-id="' + data.id + '" data-AllowancedataTable-description="' + data.description + '" data-AllowancedataTable-allowanceP="' + data.allowanceP + '"data-AllowancedataTable-allowanceP="' + data.allowanceP + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-AllowancedataTable" title="Delete Employee Allowance" href="#" class="delete-AllowancedataTable" delete-AllowancedataTable-id="' + data.id + '"><i class="fa fa-lg fa-trash-o"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.Allowance.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.Allowance.Delete")) {
                            ret += (ret.trim().length > 0 ? ' | ' + del : del);
                        }
                        return ret;
                    }

                }
            ]
        });

        function GeAllowanceHistory() {
            AllowancedataTable.ajax.reload();
        };

        $('#EmployeeAllowance').on('click', 'a.delete-AllowancedataTable', function (e) {
            var employeeAllowanceId = $(this).attr("delete-AllowancedataTable-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Employees Confirmation', 'ezinvmvc'), employeeAllowanceId),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _employeeAllowanceService.deleteEmployeeAllowance({
                            id: employeeAllowanceId
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
                            GeAllowanceHistory();
                        });
                    }
                }
            );
        });

        function ClearText() {
            $('#Description').val("");
            $('#Amount').val("0.00");
            $('#StartDate').val("");
            $('#EndDate').val("");
            $('#Taxable').val("true");
            $('#Status').val("Active");
        };

        $('#EmployeeAllowance').on('click', 'a.edit-AllowancedataTable', function (e) {
            var $Id = $(this).attr("data-AllowancedataTable-id");
            var $description = $(this).attr("data-AllowancedataTable-description");

            console.log($description);

            //e.preventDefault();
            //abp.message.confirm(
            //    abp.utils.formatString(abp.localization.localize('Delete Employees Confirmation', 'ezinvmvc'), employeeAllowanceId),
            //    function (isConfirmed) {
            //        if (isConfirmed) {
            //            _employeeAllowanceService.deleteEmployeeAllowance({
            //                id: employeeAllowanceId
            //            }).done(function () {

            //                $.ajax({
            //                    //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
            //                    type: 'POST',
            //                    processData: false,
            //                    contentType: false,
            //                    success: function () { },
            //                    error: function (e) { }
            //                });

            //                var employeeId = document.getElementById("EmpId").value;
            //                $('#EmpId').val(employeeId);
            //                GeAllowanceHistory();
            //            });
            //        }
            //    }
            //);
        });


    });
})(jQuery);