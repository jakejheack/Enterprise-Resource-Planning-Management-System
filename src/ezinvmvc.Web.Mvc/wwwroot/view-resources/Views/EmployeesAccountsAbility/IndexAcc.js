
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

$('#SaveItemButton').show();
$('#UpdateItemButton').hide();

(function () {
    $(function () {
        //AccountAbility
        var _$tableAccountAbility = $('#AccountAbilityTable');
        var _accountAbilityService = abp.services.app.accountAbilityService;
        var _$form = $('form[name=AccountAbilityeCreateForm]');
        var _$formItemId = $('form[name=AccountAbilityIdForm]');

        var dataTableAccount = _$tableAccountAbility.DataTable({
            paging: false,
            serverSide: false,
            processing: false,
            searching: false,
            listAction: {
                ajaxFunction: _accountAbilityService.getAccountsAbility,
                inputFilter: function () {
                    var $p = $('#EmpId').val();
                    if ($p === 0) {
                        $p = '';
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

                    visible: false,
                    targets: 1,
                    "data": "datePurchase",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 2,
                    "data": "dateIssue",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 3,
                    data: "particulars"
                },
                {
                    targets: 4,
                    data: "qty"
                },
                {
                    targets: 5,
                    data: "returnedDate"
                },
                {
                    targets: 6,
                    data: "amount",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right'
                },
                {
                    targets: 7,
                    data: "status"
                },
                {
                    visible: false,
                    targets: 8,
                    data: "id",
                },
                {
                    orderable: false,
                    targets: 9,
                    class: "text-center",
                    data: { id: "id", EmpId: "EmpId" },
                    "render": function (data) {
                        return '<a id="edit-AccountAbility" title="Edit AccountAbility" href="#" class="edit-AccountAbility" data-AccountAbility-id="' + data.id + '" data-AccountAbility-dateIssue="' + data.dateIssue + '" data-AccountAbility-datePurchase="' + data.datePurchase + '" data-AccountAbility-particulars="' + data.particulars + '" data-AccountAbility-amount="' + data.amount + '" data-AccountAbility-qty="' + data.qty + '" data-AccountAbility-status="' + data.status + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>&nbsp;|&nbsp;<a id="new-AccountAbility" title="New AccountAbility" href="#" data-AccountAbility-id="' + data.id + '" class="new-AccountAbility"><i class="fa fa-lg fa-dropbox"></i></a>';
                    }
                }
            ]
        });

        function GetAccountAbility() {
            dataTableAccount.ajax.reload();
        }

        $('#SaveItemButton').click(function (e) {
            e.preventDefault();
            saveAccountAbility();
        });

        function saveAccountAbility() {
            if (!_$form.valid()) {
                return;
            }
            var items = _$form.serializeFormToObject();
            abp.message.confirm(
                'New Item will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _accountAbilityService.createAccoutAbility(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Item added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            GetAccountAbility();
                        });
                    }
                }
            );
        }
        //Edit
        $('#AccountAbilityTable').on('click', 'a.edit-AccountAbility', function (e) {
            e.preventDefault();
            var id = $(this).attr("data-AccountAbility-id");
            var dateIssue = $(this).attr("data-AccountAbility-dateIssue");
            var datePurchase = $(this).attr("data-AccountAbility-datePurchase");
            var particulars = $(this).attr("data-AccountAbility-particulars");
            var qty = $(this).attr("data-AccountAbility-qty");
            var amount = $(this).attr("data-AccountAbility-amount");
            var status = $(this).attr("data-AccountAbility-status");

            var dateIssue2 = moment(dateIssue).format('MM/DD/YYYY');
            var datePurchase2 = moment(datePurchase).format('MM/DD/YYYY');

            $('#Id').val(id);
            $('#DateIssue').val(dateIssue2);
            $('#DatePurchase').val(datePurchase2);
            $('#Particulars').val(particulars);
            $('#Qty').val(qty);
            $('#Amount').val(amount);
            $("#Status").val(status).change();

            $('#Add').hide();
            $('#Update').show();
            $('#SaveItemButton').hide();
            $('#UpdateItemButton').show();
        });
        //New?
        $('#AccountAbilityTable').on('click', 'a.new-AccountAbility', function (e) {
            e.preventDefault();
            $('#Id').val("");
            $('#DateIssue').val("");
            $('#DatePurchase').val("");
            $('#Particulars').val("");
            $('#Qty').val("");
            $('#Amount').val("");
            $('#Status').val("");
            var x = document.getElementById("EmpId").value;
            var y = document.getElementById("FullName").value;
            $("#EmpId").val(x);
            $("#FullName").val(y);

            $('#Add').show();
            $('#Update').hide();
        });
        //Employee
        var _$table = $('#EmployeesTable');

        var _employeesservice = abp.services.app.employeeService;

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

        function GetEmployees() {
            dataTable.ajax.reload();
        }

        $('#EmployeeTableFilter').focus();
        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            $('#Id').val("");
            $('#EmpId').val("");
            $('#DateIssue').val("");
            $('#DatePurchase').val("");
            $('#Particulars').val("");
            $('#Qty').val("");
            $('#Amount').val("");
            $('#Status').val("");
            var employeeId = $(this).attr("data-Employee-id");
            var employeeName = $(this).attr("data-Employee-name");

            $('#EmpId').val(employeeId);
            $('#FullName').val(employeeName);
            GetAccountAbility();

            $('#Add').show();
            $('#Update').hide();

            $('#SaveItemButton').show();
            $('#UpdateItemButton').hide();
        });

        //update
        //Handle update button click
        $('#UpdateItemButton').click(function (e) {
            e.preventDefault();
            UpdateAccount();
        });
        function UpdateAccount() {
            if (!_$form.valid()) {
                return;
            }
            if (!_$formItemId.valid()) {
                return;
            }
            var account = _$form.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account2 = _$formItemId.serializeFormToObject();
            var c = { ...account, ...account2};
            abp.message.confirm(
                'Employee Update!',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _accountAbilityService.updateAccoutAbility(c).done(function () {
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
                        $('#DateIssue').val("");
                        $('#DatePurchase').val("");
                        $('#Particulars').val("");
                        $('#Qty').val("");
                        $('#Amount').val("");
                        $('#Status').val("");
                        var x = document.getElementById("EmpId").value;
                        var y = document.getElementById("FullName").value;
                        $("#EmpId").val(x);
                        $("#FullName").val(y);

                        $('#Add').show();
                        $('#Update').hide();

                        GetAccountAbility();
                    }
                }
            );
        }
        _$form.find('input').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                UpdateAccount();
            }
        });
        
    });
})();