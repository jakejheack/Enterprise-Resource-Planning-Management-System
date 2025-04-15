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
    $('.selectpicker').selectpicker();
    $("#CCompanyId").val($('#CompanyId').val());
    //alert($("#CompanyId").children("option:selected").text());
    $("#CCompanyName").val($("#CompanyId").children("option:selected").text());

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
            getCseriestype();
        });
        //var compid = $("#CompanyId").children("option:selected").val();
        //alert(compid);
    }

    function getCseriestype() {
        var compid = $("#CCompanyId").val(); //.children("option:selected").val();
        var transcode = $("#hCTransactionCode").val();
        var series = $('#CSeriesTypeId');
        series.empty();
        _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: transcode, companyId: compid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
            }
            series.selectpicker('refresh');
        });
    }

    function getCtaxtype() {
        var taxtypes = $('#CVATTypeId');
        taxtypes.empty();
        //taxtypes.append('<option value = 0 >-- Select --</option > ');
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
            }
            taxtypes.selectpicker('refresh');
        });
    }

    getCtaxtype();
    //getCcompanies();
    getCseriestype();

    //$("#CompanyId").change(function () {
    //    getseriestype();
    //});

    var _$modal = $('#ClientCreateModal');
    var _$form = $('form[name=ClientForm]');

    $('#clbCountries').change(function () {
        var id = $(this).children("option:selected").val();
        //alert(id); 
        if (id != 0) {
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetProvinces?countryid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var province = $('#clbProvinces');
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
            var province = $('#clbProvinces');
            province.empty();
            province.append('<option value = 0 >-- Select Country --</option > ');
            province.selectpicker('refresh');
            province.change();
        }
    });
    $("#CName").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);

       
        return isValid(character);
    });
    $("#CName").keyup(function (event) {
        this.value = this.value.toUpperCase();
    });

    function isValid(str) {
        return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        
    }
    
    $('#clbProvinces').change(function () {
        var id = $(this).children("option:selected").val();
        //alert(id);
        if (id != 0) {
            $.ajax({
                type: 'POST',
                url: abp.appPath + 'Addresses/GetCities?provinceid=' + id,
                success: function (jdata) {
                    console.log(jdata['result']);
                    // the next thing you want to do 
                    var cities = $('#clbCities');
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
            var cities = $('#clbCities');
            cities.empty();
            cities.append('<option value = 0 >-- Select Province --</option > ');
            cities.selectpicker('refresh');
        }
    });

    function saveClient() {

        var inds = $("#CIndustryId").val();
        var cntry = $("#clbCountries").val();
        var prov = $("#clbProvinces").val();
        var cty = $("#clbCities").val();

        var err = false;

        if (inds === "0" || inds === 0) {
            $("#errCInds").show();
            //return;
            err = true;
        }
        else {
            $("#errCInds").hide();
        }

        if (cntry === "0" || cntry === 0) {
            $("#errCCoun").show();
            //return;
            err = true;
        }
        else {
            $("#errCCoun").hide();
        }

        if (prov === 0 || prov === "0") {
            $("#errCProv").show();
            //return;
            err = true;
        }
        else {
            $("#errCProv").hide();
        }

        if (cty === 0 || cty === "0") {
            $("#errCCity").show();
            //return;
            err = true;
        }
        else {
            $("#errCCity").hide();
        }

        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }

        if (err) {
            return;
        }

        var client = _$form.serializeFormToObject();
        var $c = client.Code;
        var $name = client.Name;
        
        abp.ui.setBusy(_$form);
        _clientService.createClient(client).done(function (result) {
            $("#ClientId").val(result);
            $("#ClientName").val($name);
            _$modal.modal('hide');
        }).always(function () {
            abp.ui.clearBusy(_$form);
        });
    }

    //Handle save button click
    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        saveClient();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            saveClient();
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
        $id = $("#CAssignedToId").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#CAssignedToEmail').val(result.email);
        });
    };
    var selectemployee = function (event, ui) {
        event.preventDefault();
        $("#CAssignedToId").val(ui.item ? ui.item.value : "");
        $("#CAssignedTo").val(ui.item ? ui.item.label : "");
        getemployee();
        return false;
    };
    var focusemployee = function (event, ui) {
        event.preventDefault();
        $("#CAssignedToId").val(ui.item.value);
        $("#CAssignedTo").val(ui.item.label);
    };
    var changeemployee = function (event, ui) {
        event.preventDefault();
        $("#CAssignedToId").val(ui.item ? ui.item.value : "");
        $("#CAssignedTo").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $('#CAssignedToEmail').val('');
        }
    };
    $("#CAssignedTo").autocomplete({
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
                $("#CAssignedToId").val(result.items[0].id);
                $("#CAssignedTo").val(result.items[0].completeName);
                $("#CAssignedToEmail").val(result.items[0].email);
            }
        });
    }

    function loadModal() {
        getUserEmployee(_userId);
        $('#clbCountries').change();
    }

    loadModal();



})(jQuery);





