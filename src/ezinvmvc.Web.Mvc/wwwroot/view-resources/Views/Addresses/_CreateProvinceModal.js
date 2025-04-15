(function ($) {
    $('.selectpicker').selectpicker();
    //$("#provCountries").val($("#lbCountries").val());
    $('select[name=CountryId]').val($("#lbCountries").val());
    $('#CountryId').selectpicker('refresh');

    var _provinceService = abp.services.app.provinceService;
    var _$modal = $('#ProvinceCreateModal');
    var _$form = $('form[name=ProvinceCreateForm]');

    function save() {
        var cntry = $("#CountryId").val();

        var err = false;

        if (cntry === "0" || cntry === 0) {
            $("#errProvCoun").show();
            //return;
            err = true;
        }
        else {
            $("#errProvCoun").hide();
        }

        if (!_$form.valid()) {
            return;
        }

        if (err) {
            return;
        }

        var province = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$modal);
        _provinceService.createProvince(province).done(function (result) {
            var id = $("#CountryId").children("option:selected").val();
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetProvinces?countryid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var province = $('#lbProvinces');
                    province.empty();
                    //province.append('<option value = 0 >-- Select --</option > ');
                    var data = jdata['result'];
                    //alert(data['id']);
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == result) {
                            province.append('<option value=' + data[i].id + ' selected>' + data[i].name + '</option>');
                        }
                        else {
                            province.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                        }
                    }

                    //manually trigger a change event for the contry so that the change handler will get triggered
                    province.selectpicker('refresh');
                    province.change();
                }
            });
            _$modal.modal('hide');
            //location.reload(true); 
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

    //$.AdminBSB.input.activate(_$form);
    $.AdminBSB.select.activate(_$form);

    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });
})(jQuery);

