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

(function ($) {

    var _$form = $('form[name=EmployeeForm]');
    var _employeeService = abp.services.app.employeeService;

    function saveEmployee() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }

        if ($('#Quota').val() == "") {
            $('#Quota').val('0.00');
        }
        var employee = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.message.confirm(
            'Employee Update!',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    _employeeService.updateEmployee(employee).done(function () {
                        $.ajax({
                            success: function () {
                                abp.notify.info('Employee info updated', 'Success');
                            },
                            error: function (e) { }
                        });
                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });
                }
            }
        );
    }


    //Handle save button click
    $('#SaveEmployeeButton').click(function (e) {
        e.preventDefault();
        saveEmployee();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            saveEmployee();
        }
    });

    $('#CreateDepartmentButton').click(function (e) {
         e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Employees/CreateDepartmentModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#DepartmentCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    $('#CreateDivisionButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Employees/CreateDivisionModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#DivisionCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });
    $('#CreateSectorButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Employees/CreateSectorModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#SectorCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });
    $('#CreatePositionButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Employees/CreatePositionModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#PositionCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });
})(jQuery);