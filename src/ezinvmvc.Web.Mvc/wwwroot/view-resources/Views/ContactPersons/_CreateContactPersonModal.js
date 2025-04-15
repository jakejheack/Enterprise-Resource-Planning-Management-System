$('#cpdatetimepicker').datetimepicker({
    focusOnShow: true,
    format: 'L'
});
$(".selectpicker").selectpicker();
(function ($) {

    var _cpersonService = abp.services.app.contactPersonService;
    var _$modal = $('#ContactPersonCreateModal');
    var _$form = $('form[name=ContactPersonCreateForm]');

    function save() {
        var bday = $("#CpBirthday").val();
        if (bday.trim().length <= 0) {
            $("#CpBirthday").val('1/1/1900 00:00:00');
        }
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var cperson = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$modal);
        _cpersonService.createContactPerson(cperson).done(function (result) {
            $cname = $("#CpTitle").val() + ' ' + $("#CpFirstName").val() + ' ' + $("#CpLastName").val();
            $("#ContactPerson").val($cname);
            $("#Email").val($("#CpEmail").val());
            $("#ContactPersonId").val(result);
            _$modal.modal('hide');
            $("#CpReference").val('');
            $("#CpReferenceId").val('');
            $("#CpReferenceName").val('');
            $("#CpTitle").val('');
            $("#CpFirstName").val('');
            $("#CpLastName").val('');
            $("#CpTelNo").val('');
            $("#CpEmail").val('');
            $("#CpPosition").val('');
            $("#CpBirthday").val('');
        }).always(function () {
            abp.ui.clearBusy(_$modal);
        });
    }

    $("#CpFirstName").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);


        return isValid(character);
    });
    $("#CpFirstName").keyup(function (event) {
        this.value = this.value.toUpperCase();
    });

    $("#CpLastName").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);


        return isValid(character);
    });
    $("#CpLastName").keyup(function (event) {
        this.value = this.value.toUpperCase();
    });

    function isValid(str) {
        return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);

    }

    //Handle save button click
    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        save();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });

    $.AdminBSB.input.activate(_$form);

    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });
})(jQuery);

