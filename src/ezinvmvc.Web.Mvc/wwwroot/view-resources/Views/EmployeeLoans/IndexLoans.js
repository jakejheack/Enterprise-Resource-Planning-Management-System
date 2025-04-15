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
$('#CompressButton').show();
$('#ExpandButton').hide();

$('#CompressButton').click(function (e) {
    $('#CompressButton').hide();
    $('#ExpandButton').show();
});
$('#ExpandButton').click(function (e) {
    $('#CompressButton').show();
    $('#ExpandButton').hide();
});

$('#SaveLoanbutton').show();
$('#UpdateLoanbutton').hide();


(function () {
    $(function () {
        var _employeesservice = abp.services.app.employeeService;
        var _employeeLoansService = abp.services.app.employeeLoansService;
        var _loantTitleService = abp.services.app.loanTitleService;
        var _loantTypeService = abp.services.app.loanTypeService;
        var _companyService = abp.services.app.companyService;
        var _hRTypeService = abp.services.app.hRTypeService;
        var _$Employeestable = $('#EmployeesTable');
        var _$EmployeLoanstable = $('#EmployeLoans');
        //employee
        //var payrollTypePeriod = $('#DeductionType');
        //payrollTypePeriod.empty();
        //_hRTypeService.getAllPeriodRate().done(function (result) {
        //    for (var i = 0; i < result.items.length; i++) {
        //        payrollTypePeriod.append('<option value=' + result.items[i].id + '>' + result.items[i].status + '</option>');
        //    }
        //    payrollTypePeriod.selectpicker('refresh');
        //});

        var companies = $('#EmployersName');
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].isDefault) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
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
                        return '<a id="edit-Employee" title="Edit Loans" href="#" class="edit-Employee" data-Employee-id="' + data.id + '" data-Employee-completeName="' + data.completeName + '" data-dismiss="modal"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
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

        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            clearAll();
            $('#EmpId').val("");
            $('#fullName').val("");
            var employeeId = $(this).attr("data-Employee-id");
            var completeName = $(this).attr("data-Employee-completeName");
            $('#EmpId').val(employeeId);
            $('#fullName').val(completeName);
            GetEmployeeDetails(employeeId);
            GetEmployeeLoans();
            $('#SaveLoanbutton').show();
            $('#SaveLoanbutton').prop("disabled", false);
            $('#UpdateLoanbutton').hide();
            ded1();
            ded2();
        });
        function GetEmployeeLoans() {
            dataTable2.ajax.reload();
        }

        function GetEmployeeDetails(employeeId) {
            _employeeLoansService.getEmployeeDetails({ id: employeeId, }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    $('#LoanTitle').val(0);
                    $('#ApplicationNo').val("");
                    $('#ReceivedBy').val("");
                    $('#DateReceived').val("");
                    $('#SSSPHILHEALTHNo').val("");
                    $('#TINNo').val("");
                    $('#LoanType').val(0);
                    $('#TINNo').val("");
                    $('#FirstName').val("");
                    $('#MiddleName').val("");
                    $('#LastName').val("");
                    $('#Address').val("");
                    $('#EmployersIDNo').val("");
                    $('#PostalCode').val("");
                    $('#EmployersAddress').val("");
                    $('#LoanAmount').val("");
                    $('#DateStart').val("");
                    $('#DateEnd').val("");
                    $('#MonthlyAmortization').val("");
                    $('#DeductionType').val("0");
                    $('#Status').val("Active");
                    $('#TINNo').val(result.items[i].tin);
                    $('#FirstName').val(result.items[i].firstName);
                    $('#MiddleName').val(result.items[i].middleName);
                    $('#LastName').val(result.items[i].lastName);
                    $('#Address').val(result.items[i].address);
                }
            })
        };

        //employeeLoanDatatable
        var dataTable2 = _$EmployeLoanstable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeeLoansService.getAllEmployeeLoans,
                inputFilter: function () {
                    var $p = $('#EmpId').val();
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
                    targets: 1,
                    data: "fullName"
                },
                {
                    targets: 2,
                    data: "applicationNo"
                },
                {
                    targets: 3,
                    data: "dateStart",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 4,
                    data: "dateEnd",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 5,
                    data: "loanTitleName"
                },
                {
                    targets: 6,
                    data: "loanTypeName"
                },
                {
                    targets: 7,
                    data: "monthlyAmortization",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 8,
                    data: "loanAmount",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 9,
                    data: "status"
                },

                {
                    targets: 10,
                    class: "text-center",
                    data: { id: "id", fullName: "fullName" },
                    "render": function (data) {
                        var edit = '<a id="select-EmployeeLoan" title="Select Loan" href="#" class="select-EmployeeLoan" data-EmployeeLoan-id="' + data.id + '" data-EmployeeLoan-fullName="' + data.fullName + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-EmployeeLoan" title="Delete Loan" href="#" class="delete-EmployeeLoan" delete-EmployeeLoan-id="' + data.id + '" data-EmployeeLoan-fullName="' + data.fullName + '"><i class="fa fa-lg fa-trash-o"></i></a>';

                        var ret = '';
                        if (abp.auth.isGranted("Master.EmployeeLoan.Edit"))
                        {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.EmployeeLoan.Delete")) {
                            ret += (ret.trim().length > 0 ? ' | ' + del : del);
                        }
                        return ret;

                    }
                }
            ]
        });

        $('#EmployeLoans').on('click', 'a.select-EmployeeLoan', function (e) {
            e.preventDefault();
            $('#Id').val("");
            $('#fullName').val("");
            clearAll();
            var EmployeeLoanId = $(this).attr("data-EmployeeLoan-id");
            var completeName = $(this).attr("data-EmployeeLoan-fullName");
            $('#Id').val(EmployeeLoanId);
            $('#fullName').val(completeName);
            GetEmployeeLoanDetails(EmployeeLoanId);
            $('#SaveLoanbutton').hide();
            $('#UpdateLoanbutton').show();
        });

        $('#EmployeLoans').on('click', 'a.delete-EmployeeLoan', function (e) {
            var Id = $(this).attr("delete-EmployeeLoan-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Loans', 'ezinvmvc'), Id),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _employeeLoansService.deleteEmployeeLoans({
                            id: Id
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });
                            GetEmployeeLoans();
                        });
                    }
                }
            );
        });

        function GetEmployeeLoanDetails(EmployeeLoanId) {
            _employeeLoansService.getEmployeeLoansById({ id: EmployeeLoanId, }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    $('#LoanTitle').val(0);
                    $('#ApplicationNo').val("");
                    $('#ReceivedBy').val("");
                    $('#DateReceived').val("");
                    $('#SSSPHILHEALTHNo').val("");
                    $('#TINNo').val("");
                    $('#LoanType').val(0);
                    $('#TINNo').val("");
                    $('#FirstName').val("");
                    $('#MiddleName').val("");
                    $('#LastName').val("");
                    $('#Address').val("");
                    $('#EmployersName').val("");
                    $('#EmployersIDNo').val("");
                    $('#PostalCode').val("");
                    $('#EmployersAddress').val("");
                    $('#LoanAmount').val("");
                    $('#DateStart').val("");
                    $('#DateEnd').val("");
                    $('#MonthlyAmortization').val("");
                    $('#DeductionType').val("0");
                    $('#Id').val(0);
                    var RdateReceived = new Date(result.items[i].dateReceived);
                    var RdateStart = new Date(result.items[i].dateStart);
                    var RdateEnd = new Date(result.items[i].dateEnd);

                    $('#Id').val(result.items[i].id);
                    $('#LoanTitle').val(result.items[i].loanTitle);
                    $('#ApplicationNo').val(result.items[i].applicationNo);
                    $('#ReceivedBy').val(result.items[i].receivedBy);
                    $('#DateReceived').val(getFormattedDate(RdateReceived));
                    $('#SSSPHILHEALTHNo').val(result.items[i].sssphilhealthNo);
                    $('#TINNo').val(result.items[i].tinNo);
                    $('#LoanType').val(result.items[i].loanType);
                    $('#TINNo').val(result.items[i].tinNo);
                    $('#FirstName').val(result.items[i].firstName);
                    $('#MiddleName').val(result.items[i].middleName);
                    $('#LastName').val(result.items[i].lastName);
                    $('#Address').val(result.items[i].address);
                    $('#EmployersName').val(result.items[i].employersName);
                    $('#EmployersIDNo').val(result.items[i].employersIDNo);
                    $('#PostalCode').val(result.items[i].postalCode);
                    $('#EmployersAddress').val(result.items[i].employersAddress);
                    $('#LoanAmount').val(result.items[i].loanAmount);
                    $('#DateStart').val(getFormattedDate(RdateStart));
                    $('#DateEnd').val(getFormattedDate(RdateEnd));
                    $('#MonthlyAmortization').val(result.items[i].monthlyAmortization);
                    //$('#DeductionType').val(result.items[i].deductionType);

                    var Titleid = result.items[i].loanTitle;
                    var loanType = result.items[i].loanType;
                    var EemployersName = result.items[i].employersName;
                    var FdeductionType = result.items[i].deductionType;
                    
                    var taxtypes = $('#DeductionType');
                    $('#DeductionType option[value="' + FdeductionType + '"]').prop('selected', true);
                    taxtypes.selectpicker('refresh');

                    var TypeName = $('#LoanType');
                    TypeName.empty();
                    _loantTypeService.getLoanTypeId({ loanTitleId: Titleid }).done(function (result) {
                        for (var i = 0; i < result.items.length; i++) {
                            if (loanType === result.items[i].id) {
                                TypeName.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].loanTypeName + '</option>');
                            }
                            else {
                                TypeName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTypeName + '</option>');
                            }
                        }
                        TypeName.selectpicker('refresh');
                    });

                    var TitleName = $('#LoanTitle');
                    TitleName.empty();
                    _loantTitleService.getLoanTitle().done(function (result) {
                        for (var i = 0; i < result.items.length; i++) {
                            if (Titleid === result.items[i].id) {

                                TitleName.append('<option value=' + result.items[i].id + ' selected >' + result.items[i].loanTitleName + '</option>');
                            }
                            else {
                                TitleName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                            }
                        }
                        TitleName.selectpicker('refresh');
                    });

                    var companies = $('#EmployersName');
                    companies.empty();
                    _companyService.getCompanies().done(function (result) {
                        for (var i = 0; i < result.items.length; i++) {
                            if (EemployersName === result.items[i].id) {

                                companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                            }
                            else {
                                companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                            }
                        }
                        companies.selectpicker('refresh');
                    });
                }
            })
        };

        //Title
        var _$formLoanTitleName = $('form[name=FormLoanTitleName]');

        var _$formLoanTypeName = $('form[name=FormLoanTypeName]');

        var _$formLoanForm = $('form[name=LoanForm]');

        var _$formEmployeeId = $('form[name=EmployeeId]');

        var _$formEmployeeIdFormId = $('form[name=EmployeeIdFormId]');

        $('#SaveLoanTitlebutton').click(function (e) {
            e.preventDefault();
            saveTitle();
        });

        function saveTitle() {
            if (!_$formLoanTitleName.valid()) {
                return;
            }
            var account = _$formLoanTitleName.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var items = { ...account};
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLoanTitleName);
                        _loantTitleService.createLoanTitles(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Title added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formLoanTitleName);

                            var TitleName = $('#LoanTitle');
                            TitleName.empty();
                            _loantTitleService.getLoanTitle().done(function (result) {
                                for (var i = 0; i < result.items.length; i++) {
                                    if (result.items[i].isDefault) {
                                        TitleName.append('<option value=' + result.items[i].id + ' selected >' + result.items[i].loanTitleName + '</option>');
                                    }
                                    else {
                                        TitleName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                                    }
                                }
                                TitleName.selectpicker('refresh');
                            });

                            var TitleName2 = $('#LoanTitleId');
                            TitleName2.empty();
                            _loantTitleService.getLoanTitle().done(function (result) {
                                for (var i = 0; i < result.items.length; i++) {
                                    if (result.items[i].isDefault) {
                                        TitleName2.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                                    }
                                    else {
                                        TitleName2.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                                    }
                                }
                                TitleName2.selectpicker('refresh');
                            });


                        });
                    }
                }
            );

        }
        
        //Type
        $('#SaveLoanTypebutton').click(function (e) {
            e.preventDefault();
            saveType();
        });
        function saveType() {
            if (!_$formLoanTypeName.valid()) {
                return;
            }
            var account2 = _$formLoanTypeName.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var items2 = { ...account2 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLoanTypeName);
                        _loantTypeService.createLoanType(items2).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Type added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formLoanTypeName);

                            var Titleid = document.getElementById("LoanTitle").value;
                            GetType(Titleid);

                        });
                    }
                }
            );

        }
        $('#LoanTitle').change(function (e) {
            var Titleid = document.getElementById("LoanTitle").value;
            GetType(Titleid);
        });
        function GetType(Titleid) {
            var TypeName = $('#LoanType');
            TypeName.empty();
            TypeName.append('<option value="" selected disabled>Select Title</option>');
            _loantTypeService.getLoanTypeId({ loanTitleId: Titleid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    TypeName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTypeName + '</option>');
                }
                TypeName.selectpicker('refresh');
            });
            CreateReference();
        }
        
        $('#SaveLoanbutton').click(function (e) {
            e.preventDefault();
            SaveLoan();
        });

        function SaveLoan() {
            if (!_$formLoanForm.valid()) {
                return;
            }
            if (!_$formEmployeeId.valid()) {
                return;
            }
            var account3 = _$formLoanForm.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account4 = _$formEmployeeId.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var items3 = { ...account3, ...account4 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLoanForm);
                        _employeeLoansService.createEmployeeLoans(items3).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Loan Save successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formLoanForm);

                            $('#SaveLoanbutton').prop("disabled", true);
                            GetEmployeeLoans();
                        });
                    }
                }
            );

        }

        function clearAll() {
            $('#LoanTitle').val(0);
            $('#ApplicationNo').val("");
            $('#ReceivedBy').val("");
            $('#DateReceived').val("");
            $('#SSSPHILHEALTHNo').val("");
            $('#TINNo').val("");
            $('#LoanType').val(0);
            $('#TINNo').val("");
            $('#FirstName').val("");
            $('#MiddleName').val("");
            $('#LastName').val("");
            $('#Address').val("");
            $('#EmployersName').val("");
            $('#EmployersIDNo').val("");
            $('#PostalCode').val("");
            $('#EmployersAddress').val("");
            $('#LoanAmount').val("");
            $('#DateStart').val("");
            $('#DateEnd').val("");
            $('#MonthlyAmortization').val("");
            $('#DeductionType').val("0");
            $('#Id').val("");
            $('#Status').val("Active");

            $('#LoanAmount').val("");
            $('#DateStart').val("");
            $('#DateEnd').val("");
            $('#MonthlyAmortization').val("");
            $('#DeductionType').selectpicker('val', "");

        }

        $('#UpdateLoanbutton').click(function (e) {
            e.preventDefault();
            UpdateAccount();
        });
        function UpdateAccount() {
            if (!_$formEmployeeIdFormId.valid()) {
                return;
            }
            if (!_$formLoanForm.valid()) {
                return;
            }
            if (!_$formEmployeeId.valid()) {
                return;
            }
            var account5 = _$formLoanForm.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account6 = _$formEmployeeId.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account7 = _$formEmployeeIdFormId.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var items4 = { ...account5, ...account6, ...account7 };
            abp.message.confirm(
                'Employee Update!',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLoanForm);
                        _employeeLoansService.updateEmployeeLoans(items4).done(function () {
                            $.ajax({
                                success: function () {
                                    abp.notify.info('Employee info updated', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formLoanForm);
                        });
                        clearAll();

                        $('#SaveLoanbutton').show();
                        $('#UpdateLoanbutton').hide();

                        GetEmployeeLoans();
                    }
                }
            );
        }

        $('#DedId').change(function (e) {
            var dedid = $('#DedId').val();

            if (dedid == 1)
            { 
                ded1();
            }
            if (dedid == 2)
            {
                ded2();
            }
            CreateReference();
        });

        function ded1() {
            var TitleName = $('#LoanTitle');
            TitleName.empty();

            TitleName.append('<option value="" selected disabled>Select Title</option>');
            _loantTitleService.getLoanTitle().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault) {
                        TitleName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                    else {
                        TitleName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                }
                TitleName.selectpicker('refresh');
            });

            var TitleName2 = $('#LoanTitleId');
            TitleName2.empty();

            _loantTitleService.getLoanTitle().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault) {
                        TitleName2.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                    else {
                        TitleName2.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                }
                TitleName2.selectpicker('refresh');
            });
            //GetType(Titleid);
        }

        function ded2() {
            var TitleName = $('#LoanTitle');
            TitleName.empty();

            TitleName.append('<option value="" selected disabled>Select Title</option>');
            _loantTitleService.getLoanTitleDed().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault) {
                        TitleName.append('<option value=' + result.items[i].id + ' >' + result.items[i].loanTitleName + '</option>');
                    }
                    else {
                        TitleName.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                }
                TitleName.selectpicker('refresh');
            });

            var TitleName2 = $('#LoanTitleId');
            TitleName2.empty();
            _loantTitleService.getLoanTitleDed().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault) {
                        TitleName2.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                    else {
                        TitleName2.append('<option value=' + result.items[i].id + '>' + result.items[i].loanTitleName + '</option>');
                    }
                }
                TitleName2.selectpicker('refresh');
            });
            //GetType(Titleid);
        }

        $('#LoanType').change(function (e) {
            CreateReference();
        });
        
        function CreateReference() {
            $('#ApplicationNo').val("");
            var $DateReceived = $('#DateReceived').val();
            RefDate = $DateReceived.split('/');
            if (RefDate == "") { return abp.notify.success('Please Select Date', 'Date Recieved'); }
            mm = RefDate[0];
            dd = RefDate[1];
            yy = RefDate[2];
            var ref1 = mm + dd + yy;
            var empid = $('#EmpId').val() || 0;
            //var $dedId = $('#DedId').val() || 0;
            var $LoanTitle = $('#LoanTitle').val() || 0;
            var $LoanType = $('#LoanType').val() || 0;
            var ref2 = $LoanTitle + $LoanType;

            var finalref = empid + ref1 + ref2;
            $('#ApplicationNo').val(finalref);
        }

        $('#NewLoanbutton').click(function (e) {
            e.preventDefault();
            clearAll();
        });

        $('#forceclose').click(function (e) {
            e.preventDefault();
            forseclose();
        });
        function forseclose() {
            var loanid = $('#Id').val();
            
            abp.message.confirm(
                'Force to Closed Loan.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formLoanForm);
                        _employeeLoansService.forceClosedById({ id: loanid, }).done(function (result) {
                            for (var i = 0; i < result.items.length; i++) {
                                $('#Status').val("Close");
                            }

                            
                            abp.notify.success('Loan Close', 'Success');
                        }).always(function () {
                            abp.ui.clearBusy(_$formLoanForm);

                            GetEmployeeLoans();
                            $('#SaveLoanbutton').show();
                            $('#UpdateLoanbutton').hide();
                        });
                    }
                }
            );
        }

    });
}) (jQuery);