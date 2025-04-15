function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

        do {
            present = amount.indexOf(".", present);
            if (present !== -1) {
                count++;
                present++;
            }
        }
        while (present !== -1);
        if (present === -1 && amount.length === 0 && event.keyCode === 46) {
            event.keyCode = 0;
            return false;
        }

        if (count >= 1 && event.keyCode === 46) {

            event.keyCode = 0;
            return false;
        }
        if (count === 1) {
            var lastdigits = amount.substring(amount.indexOf(".") + 1, amount.length);
            if (lastdigits.length >= 2) {
                event.keyCode = 0;
                return false;
            }
        }
        return true;
    }
    else {
        event.keyCode = 0;
        return false;
    }
}


(function ($) {

    var _service = abp.services.app.productService;
    var _$modal = $('#ProductUnitEditModal');
    var _$form = $('form[name=ProductUnitEditForm]');

    function update() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var productunit = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        productunit.Conversion = $('#EditConversion').val();
        productunit.UnitId = $('#EditUnits').val();
        productunit.DefaultUnitId = $('#DefaultUnitId').val();

        var isdefault = $('#EditIsDafault').val();

        if (isdefault === '1') {
            productunit.DefaultUnitId  = productunit.UnitId;
        }

        abp.ui.setBusy(_$form);
        _service.updateProductUnit(productunit).done(function () {
            _$modal.modal('hide');
            window.location.reload();
            $('#UnitsTable').DataTable().ajax.reload();
        }).always(function () {abp.ui.clearBusy(_$modal);});
    }


    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        update();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            update();
        }
    });

    $.AdminBSB.input.activate(_$form);

    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });
})(jQuery);