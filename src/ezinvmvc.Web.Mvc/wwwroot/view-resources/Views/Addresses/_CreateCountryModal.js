(function ($) {

    var _countryService = abp.services.app.countryService;
    var _$modal = $('#CountryCreateModal');
    var _$form = $('form[name=CountryCreateForm]');

    function save() {

        if (!_$form.valid()) {
            return;
        }
        var country = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$modal);
        _countryService.createCountry(country).done(function (result) {
            //var id = $("#lbCountries").children("option:selected").val();
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetCountries',
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var country = $('#lbCountries');
                    country.empty();
                    //country.append('<option value = 0 >-- Select --</option > ');
                    var data = jdata['result'];
                    //alert(data['id']);
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == result) {
                            country.append('<option value=' + data[i].id + ' selected>' + data[i].name + '</option>');
                        }
                        else {
                            country.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                        }
                    }

                    //manually trigger a change event for the contry so that the change handler will get triggered
                    country.selectpicker('refresh');
                    country.change();
                }
            });
            _$modal.modal('hide');
            //location.reload(true); 
            //$(".selectpicker").refresh();
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

