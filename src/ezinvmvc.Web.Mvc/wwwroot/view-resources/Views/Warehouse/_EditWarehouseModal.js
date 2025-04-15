(function ($) {

    var _warehouseService = abp.services.app.warehouseService;
    var _$modal = $('#WarehouseEditModal');
    var _$form = $('form[name=WarehouseEditForm]');

    function save() {

        
      
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var warehouse = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$form);
        _warehouseService.updateWarehouse(warehouse).done(function () {
            _$modal.modal('hide');
            $('#WarehouseTable').DataTable().ajax.reload();
        }).always(function () {abp.ui.clearBusy(_$modal);});
    }

    //Handle save button click
    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        if ($('[name="IsMain"]:checked').length > 0)
            $('[name="IsMain"]:hidden').val(true);
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