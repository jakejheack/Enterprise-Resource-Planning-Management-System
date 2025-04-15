$('#cpdatetimepicker').datetimepicker({
    focusOnShow: true,
    format: 'L'
});
$(".selectpicker").selectpicker();
(function ($) {

    var _cpersonService = abp.services.app.contactPersonService;
    var _$modal = $('#ContactPersonEditModal');
    var _$form = $('form[name=ContactPersonEditForm]');

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
        _cpersonService.updateContactPerson(cperson).done(function (result) {
            //$cname = $("#CpTitle").val() + ' ' + $("#CpFirstName").val() + ' ' + $("#CpLastName").val();
            //$("#ContactPerson").val($cname);
            //$("#ContactPersonId").val(result);
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

