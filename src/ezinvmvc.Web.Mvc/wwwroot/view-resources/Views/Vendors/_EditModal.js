(function ($) {

    var _service = abp.services.app.vendorService;
    var _$modal = $('#VendorEditModal');
    var _$form = $('form[name=VendorEditForm]');

    function save() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var vendor = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$form);
        _service.updateVendor(vendor).done(function () {
            _$modal.modal('hide');
            $('#VendorsTable').DataTable().ajax.reload();
        }).always(function () {abp.ui.clearBusy(_$modal);});
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