// Employees
(function () {
    $(function () {

        var _$table = $('#EmployeesTable');
        var _$table2 = $('#EmployeesTable2');
        var _employeesservice = abp.services.app.employeeService;

        var _$form = $('form[name=EmployeeCreateForm]');

        var dataTable = _$table.DataTable({
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
                    targets: 5,
                    data: "post"
                },
                {
                    targets: 6,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { id: "id", employeeCode: "employeeCode" },
                    "render": function (data) {
                        //return '<a id="edit-Employee" title="Edit Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>&nbsp;|&nbsp;<a id="delete-Employee" title="delete" href="#" class="delete-Employee" data-Employee-id="' + data.id + '" data-Employee-name="' + data.firstName + '" data-Employee-code="' + data.employeeCode + '"><i class="fa fa-lg fa-trash-o"></i></a>';
                        var edit = '<a id="edit-Employee" title="Edit Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-Employee" title="delete" href="#" class="delete-Employee" data-Employee-id="' + data.id + '" data-Employee-name="' + data.firstName + '" data-Employee-code="' + data.employeeCode + '"><i class="fa fa-lg fa-trash-o"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.Employees.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.Employees.Delete")) {
                            ret += (ret.trim().length > 0 ? ' | ' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });

        var dataTable2 = _$table2.DataTable({
            paging: false,
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
                        filter: $c + '|' + $p + '|' + $s,
                        forExport: true
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
                    targets: 5,
                    data: "post"
                },
                {
                    targets: 6,
                    data: "status"
                }
            ]
        });

        function GetEmployees() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
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

        function saveEmployee() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var employee = _$form.serializeFormToObject();
            abp.message.confirm(
                'New Employee will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _employeesservice.createEmployee(employee).done(function () {
                            $.ajax({
                                type: 'POST',
                                //data: formData,
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Employee added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            GetEmployees();
                        });
                    }
                }
            );
        }

        $('#submit').click(function (e) {
            e.preventDefault();
            saveEmployee();
            //GetEmployees();
        });

        _$form.find('input').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                saveEmployee();
                //GetEmployees();
            }
        });

        // Edit record
        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            var id = $(this).attr("data-Employee-id");
            window.location.href = abp.appPath + 'Employees/Update?id=' + id;
        });

        // Edit Other Details
        $('#EmployeesTable').on('click', 'a.details-Employee', function (e) {
            e.preventDefault();
            var id = $(this).attr("data-Employee-id");
            window.location.href = abp.appPath + 'Employees/Details?id=' + id;
        });

        // Delete record
        $('#EmployeesTable').on('click', 'a.delete-Employee', function (e) {
            var employeeId = $(this).attr("data-Employee-id");
            var employeeCode = $(this).attr("data-Employee-code");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Employees', 'ezinvmvc'), employeeCode),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _employeesservice.deleteEmployee({
                            id: employeeId
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });

                            GetEmployees();
                        });
                    }
                }
            );
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('EmployeesTable2', 'Employees', 'Employees.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) {
                    return window.btoa(decodeURIComponent(encodeURIComponent(s.replace(/[\u00A0-\u2666]/g, function (c) {
                        return '&#' + c.charCodeAt(0) + ';';
                    }).replace(/[\u{0080}-\u{FFFF}]/gu, ""))))
                }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

       
    });
})();