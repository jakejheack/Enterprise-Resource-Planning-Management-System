(function ($) {

    var _sectorService = abp.services.app.sectorService;
    var _$modal = $('#CreateSectorModal');
    var _$form = $('form[name=SectorCreateForm]');

    function save() {

        if (!_$form.valid()) {
            return;
        }
        var sectors = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$modal);
        _sectorService.createSector(sectors).done(function () {
            _$modal.modal('hide');
            location.reload(true);
        }).always(function () {
            abp.ui.clearBusy(_$modal);
        });
    }
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