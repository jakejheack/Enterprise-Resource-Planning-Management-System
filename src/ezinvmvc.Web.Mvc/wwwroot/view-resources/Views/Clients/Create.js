function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

        //if (amount.indexOf(".", present) || amount.indexOf(".", present + 1));
        //{}
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

//Save Button
(function ($) {

    var _clientService = abp.services.app.clientService;
    var _companyService = abp.services.app.companyService;
    var _commonService = abp.services.app.commonService;
    var _employeeService = abp.services.app.employeeService;

    function getcompanies() {
        var companies = $('#CompanyId');
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].isDefault) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
            getseriestype();
        });
        //var compid = $("#CompanyId").children("option:selected").val();
        //alert(compid);
    }

    function getseriestype() {
        var compid = $("#CompanyId").children("option:selected").val();
        var transcode = $("#hTransactionCode").val();
        var series = $('#SeriesTypeId');
        series.empty();
        _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: transcode, companyId: compid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
            }
            series.selectpicker('refresh');
        });
    }

    function gettaxtype() {
        var taxtypes = $('#VATTypeId');
        taxtypes.empty();
        //taxtypes.append('<option value = 0 >-- Select --</option > ');
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
            }
            taxtypes.selectpicker('refresh');
        });
    }

    gettaxtype();
    getcompanies();
    //getseriestype();

    $("#CompanyId").change(function () {
        getseriestype();
    });

    var _$form = $('form[name=ClientForm]');

    $('#lbCountries').change(function () {
        var id = $(this).children("option:selected").val();
        //alert(id); 
        if (id != 0) {
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetProvinces?countryid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var province = $('#lbProvinces');
                    province.empty();
                    province.append('<option value = 0 >-- Select --</option > ');
                    var data = jdata['result'];
                    //alert(data['id']);
                    for (var i = 0; i < data.length; i++) {
                        province.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                    }

                    //manually trigger a change event for the contry so that the change handler will get triggered
                    province.selectpicker('refresh');
                    province.change();
                }
            });
        }
        else {
            var province = $('#lbProvinces');
            province.empty();
            province.append('<option value = 0 >-- Select Country --</option > ');
            province.selectpicker('refresh');
            province.change();
        }
    });

    $('#lbProvinces').change(function () {
        var id = $(this).children("option:selected").val();
        //alert(id);
        if (id != 0) {
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetCities?provinceid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var cities = $('#lbCities');
                    cities.empty();
                    cities.append('<option value = 0 >-- Select --</option > ');
                    var data = jdata['result'];
                    //alert(data['id']);
                    for (var i = 0; i < data.length; i++) {
                        cities.append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                    }

                    //manually trigger a change event for the contry so that the change handler will get triggered
                    cities.selectpicker('refresh');
                    //province.change();
                }
            });
        }
        else {
            var cities = $('#lbCities');
            cities.empty();
            cities.append('<option value = 0 >-- Select Province --</option > ');
            cities.selectpicker('refresh');
        }
    });

    function saveClient() {
        
        var inds = $("#IndustryId").val();
        var cntry = $("#lbCountries").val();
        var prov = $("#lbProvinces").val();
        var cty = $("#lbCities").val();

        var err = false;

        if (inds === "0" || inds === 0) {
            $("#errInds").show();
            //return;
            err = true;
        }
        else {
            $("#errInds").hide();
        }

        if (cntry === "0" || cntry === 0) {
            $("#errCoun").show();
            //return;
            err = true;
        }
        else {
            $("#errCoun").hide();
        }

        if (prov === 0 || prov === "0") {
            $("#errProv").show();
            //return;
            err = true;
        }
        else {
            $("#errProv").hide();
        }

        if (cty === 0 || cty === "0") {
            $("#errCity").show();
            //return;
            err = true;
        }
        else {
            $("#errCity").hide();
        }

        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }

        if (err) {
            return;
        }

        //var formData = new FormData();
        //formData.append('file', $('#fileinput')[0].files[0]);

        var client = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        //if ($('#fileinput')[0].files.length !== 0)
        //{
        //    product.imageName = $('#fileinput')[0].files[0].name;
        //}

        var $c = client.Code;
        var $name = client.Name;

        abp.message.confirm(
            'New client will be added.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    _clientService.createClient(client).done().always(function () {
                        abp.ui.clearBusy(_$form);
                        abp.notify.success('New client added successfully : ' + $name, 'Success');
                        //$.ajax({
                        //    type: 'GET',
                        //    url: abp.appPath + 'Clients/Index',
                        //    success: function (jdata) {

                        //    }
                        //});
                        var url = 'Index';
                        setTimeout(function () {
                            window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                        }, 2000);
                    });
                }
            }
        );
    }

    //Handle save button click
    $('#SaveClientButton').click(function (e) {
        e.preventDefault();
        saveClient();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            saveProduct();
        }
    });

    $('#CreateCountryButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Addresses/CreateCountryModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#CountryCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    $('#CreateProvinceButton').click(function (e) {
        var id = $("#lbCountries").children("option:selected").val();
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Addresses/CreateProvinceModal?countryid=' + id,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#ProvinceCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    $('#CreateCityButton').click(function (e) {
        var id = $("#lbProvinces").children("option:selected").val();
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Addresses/CreateCityModal?provinceid=' + id,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#CityCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    //Employee Autocomplete
    var getemployees = function (request, response) {
        _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.completeName,
                    value: el.id
                };
            }));
        });
    };
    function getemployee() {
        $id = $("#AssignedToId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#AssignedToEmail').val(result.email);
        });
    };
    var selectemployee = function (event, ui) {
        event.preventDefault();
        $("#AssignedToId").val(ui.item ? ui.item.value : "");
        $("#AssignedTo").val(ui.item ? ui.item.label : "");
        getemployee();
        return false;
    };
    var focusemployee = function (event, ui) {
        event.preventDefault();
        $("#AssignedToId").val(ui.item.value);
        $("#AssignedTo").val(ui.item.label);
    };
    var changeemployee = function (event, ui) {
        event.preventDefault();
        $("#AssignedToId").val(ui.item ? ui.item.value : "");
        $("#AssignedTo").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#AssignedToEmail').val('');
        }
    };
    $("#AssignedTo").autocomplete({
        source: getemployees,
        select: selectemployee,
        focus: focusemployee,
        minLength: 2,
        delay: 100,
        change: changeemployee
    });
    //Employee Autocomplete

    var _userId = abp.session.userId;

    function getUserEmployee(userid) {
        _employeeService.getEmployees({ filter: "UserId|" + userid }).done(function (result) {
            if (result.items.length > 0) {
                $("#AssignedToId").val(result.items[0].id);
                $("#AssignedTo").val(result.items[0].completeName);
                $("#AssignedToEmail").val(result.items[0].email);
            }
        });
    };

    function loadPage() {
        getUserEmployee(_userId);
        var cntry = $("#lbCountries").val();
        if (cntry.length > 0 && cntry != "0") {
            $("#lbCountries").change();
        }
    }

    loadPage();
})(jQuery);




