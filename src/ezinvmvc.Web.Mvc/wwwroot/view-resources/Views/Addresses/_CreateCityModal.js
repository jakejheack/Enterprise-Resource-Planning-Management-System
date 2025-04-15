(function ($) {
    $('.selectpicker').selectpicker();
    //$("#lbCityCountries").val($("#lbCountries").val());
    //$("#lbCityProvinces").val($("#lbProvinces").val());

    $('select[name=CountryId]').val($("#lbCountries").val());
    $('#lbCityCountries').selectpicker('refresh');
    countriesChanged($("#lbCityCountries").val());
    //alert($("#lbProvinces").val());
    //$('select[name=ProvinceId]').val($("#lbProvinces").val());
    //$('#lbCityProvinces').selectpicker('refresh');

    $('#lbCityCountries').change(function () {
        var id = $(this).children("option:selected").val();
        //alert(id);
        countriesChanged(id);
    });

    function countriesChanged(id) {
        if (id != "" && id != "0" && id != 0) {
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetProvinces?countryid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var province = $('#lbCityProvinces');
                    province.empty();
                    province.append('<option value = 0 >-- Select --</option > ');
                    var data = jdata['result'];
                    //alert(data['id']);
                    for (var i = 0; i < data.length; i++) {
                        if ($("#lbCountries").val() === id) {
                            if (data[i].id+'' === $("#lbProvinces").val()) {
                                province.append('<option value=' + data[i].id + ' selected>' + data[i].name + '</option>');
                            }
                            else {
                                province.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                            }
                        }
                        else {
                            province.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                        }
                    }

                    //manually trigger a change event for the contry so that the change handler will get triggered
                    province.selectpicker('refresh');
                }
            });
        }
        else {
            var province = $('#lbCityProvinces');
            province.empty();
            province.append('<option value = 0 >-- Select Country --</option > ');
            province.selectpicker('refresh');
        }
    }

    var _cityService = abp.services.app.cityService;
    var _$modal = $('#CityCreateModal');
    var _$form = $('form[name=CityCreateForm]');

    function save() {
        var cntry = $("#lbCityCountries").val();
        var prov = $("#lbCityProvinces").val();

        var err = false;

        if (cntry === "0" || cntry === 0) {
            $("#errCityCoun").show();
            //return;
            err = true;
        }
        else {
            $("#errCityCoun").hide();
        }

        if (prov === 0 || prov === "0") {
            $("#errCityProv").show();
            //return;
            err = true;
        }
        else {
            $("#errCityProv").hide();
        }

        if (!_$form.valid()) {
            return;
        }

        if (err) {
            return;
        }


        var city = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        abp.ui.setBusy(_$modal);
        _cityService.createCity(city).done(function (result) {
            var id = $("#lbProvinces").children("option:selected").val();
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetCities?provinceid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var city = $('#lbCities');
                    city.empty();
                    //city.append('<option value = 0 >-- Select --</option > ');
                    var data = jdata['result'];
                    //alert(data['id']);
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == result) {
                            city.append('<option value=' + data[i].id + ' selected>' + data[i].name + '</option>');
                        }
                        else {
                            city.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                        }
                    }

                    //manually trigger a change event for the contry so that the change handler will get triggered
                    city.selectpicker('refresh');
                    //city.change();
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

    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });
})(jQuery);

