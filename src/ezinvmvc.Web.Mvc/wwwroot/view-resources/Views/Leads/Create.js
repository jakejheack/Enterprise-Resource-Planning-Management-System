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
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker({
        format: 'MM/DD/YYYY'
    });

    var _leadService = abp.services.app.leadService;
    var _clientService = abp.services.app.clientService;
    var _cpersonService = abp.services.app.contactPersonService;
    var _employeeService = abp.services.app.employeeService;
    var _companyService = abp.services.app.companyService;
    var _commonService = abp.services.app.commonService;

    var _$form = $('form[name=LeadForm]');

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

    getcompanies();
    //getseriestype();

    $("#CompanyId").change(function () {
        getseriestype();
    });

    //Client Autocomplete
    var getclients = function (request, response) {
        var $filter = request.term + '|' + '1,2,3,4';
        //var $accountexecutive = 'null';
        //if (!abp.auth.isGranted("Master.Clients.AllAccounts")) {
            var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
            console.log(empid);
            $filter = $filter + '|' + empid;
        //}
        _clientService.getClients({ filter: $filter }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getclient() {
        var $clientid = $('#ClientId').val();
        var $empid = $('#h1').val();
        _clientService.getClientDetails({ id: $clientid }).done(function (result) {
            $('#TelNo').val(result[0].telNo);
            $('#FaxNo').val(result[0].faxNo);
            $('#MobileNo').val(result[0].mobileNo);
            //$('#Email').val(result[0].email);
            $('#Address').val(result[0].completeAddress);
            // $('#AssignedToId').val(result[0].assignedToId);
            //$('#AssignedToEmail').val(result[0].assignedToEmail);
            //$('#AssignedTo').val(result[0].assignedTo);
            //MARC 11092021 AE defaults to client AE
            if (result[0].assignedToId === $empid) {
                $('#AssignedToId').val(result[0].assignedToId);
                $('#AssignedToEmail').val(result[0].assignedToEmail);
                $('#AssignedTo').val(result[0].assignedTo);
            }
            else {
                $('#AssignedToId').val($empid);
                getemployee();
            }
            //MARC 11092021 AE defaults to client AE
        });
    };
    var selectclient = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item ? ui.item.value : "");
        $("#ClientName").val(ui.item ? ui.item.label : "");
        getclient();
        return false;
    };
    var focusclient = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item.value);
        $("#ClientName").val(ui.item.label);
    };
    var changeclient = function (event, ui) {
        event.preventDefault();
        $("#ClientId").val(ui.item ? ui.item.value : "");
        $("#ClientName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#ContactPersonId").val('');
            $("#ContactPerson").val('');
            $('#TelNo').val('');
            $('#FaxNo').val('');
            $('#MobileNo').val('');
            //$('#Email').val('');
            $('#Address').val('');
        }
    };
    $("#ClientName").autocomplete({
        source: getclients,
        select: selectclient,
        focus: focusclient,
        minLength: 2,
        delay: 100,
        change: changeclient
    });
    //Client Autocomplete

    //CPerson Autocomplete
    var getcpersons = function (request, response) {
        var $clientid = $('#ClientId').val();
        //MARC filter cperson per AE 11/02/2021
        var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
        console.log(empid);
        var $filter = request.term + '|' + empid;
        //_cpersonService.getContactPersonsFiltered({ id: 0, reference: "Client", referenceId: $clientid, filter: request.term }).done(function (result) {
        _cpersonService.getContactPersonsFiltered({ id: 0, reference: "Client", referenceId: $clientid, filter: $filter }).done(function (result) {
        //END MARC filter cperson per AE 11/02/2021
            response($.map(result.items, function (el) {
                return {
                    label: el.fullName,
                    value: el.id
                };
            }));
        });
    };
    function getcperson() {
        var $cpersonid = $('#ContactPersonId').val();
        _cpersonService.getContactPerson({ id: $cpersonid }).done(function (result) {
            //$('#TelNo').val(result[0].telNo);
            //$('#FaxNo').val(result[0].faxNo);
            //$('#MobileNo').val(result[0].mobileNo);
            $('#Email').val(result.email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectcperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item ? ui.item.value : "");
        $("#ContactPerson").val(ui.item ? ui.item.label : "");
        getcperson();
        return false;
    };
    var focuscperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item.value);
        $("#ContactPerson").val(ui.item.label);
    };
    var changecperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item ? ui.item.value : "");
        $("#ContactPerson").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            //console.log(ui.item);
            $("#ContactPersonId").val('');
            $("#ContactPerson").val('');
        //    $('#TelNo').val('');
        //    $('#FaxNo').val('');
        //    $('#MobileNo').val('');
            $('#Email').val('');
        //    $('#Address').val('');
        }
    };
    $("#ContactPerson").autocomplete({
        source: getcpersons,
        select: selectcperson,
        focus: focuscperson,
        minLength: 2,
        delay: 100,
        change: changecperson
    });
    //CPerson Autocomplete

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
        var $name = $("#AssignedTo").val();
        _employeeService.getEmployee({ id: $id }).done(function (result) {
            $('#AssignedToEmail').val(result.email);
            //MARC 11092021 AE defaults to client AE
            if ($name.trim().length === 0) {
                $("#AssignedTo").val(result.firstName + ' ' + result.middleName + ' ' + result.lastName);
            }
            //MARC 11092021 AE defaults to client AE
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

    $("#AssignedToId").change(function () {
        var id = $(this).children("option:selected").val();
        $("#AssignedToIdEmail").val(id);
        var txt = $("#AssignedToIdEmail option:selected").html();
        $("#AssignedToEmail").val(txt);
    });
    
    function checkDate(date) {
        //var text = '02/28/2011';
        var comp = date.split('/');
        var m = parseInt(comp[0], 10);
        var d = parseInt(comp[1], 10);
        var y = parseInt(comp[2], 10);
        var date = new Date(y, m - 1, d);
        if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
            //alert('Valid date');
            return true;
        } else {
            //alert('Invalid date');
            return false;
        }
    }

    _$form.validate({
        // Specify validation rules
        rules: {
            LeadSourceId: {
                min: 1
            },
            LeadTaskId: {
                min: 1
            }
        },

        //specify custom messages
        messages: {
            LeadSourceId: {
                min: "This field is required."
            },
            LeadTaskId: {
                min: "This field is required."
            }
        },

        // specify error placement
        errorPlacement: function (error, element) {

            if (element.attr("class").indexOf("selectpicker") != -1) {
                // $(".dropdown-toggle").text(error);
                var mpar = $(element).closest("div.bootstrap-select");
                error.insertAfter($('.dropdown-toggle', mpar));

            } else {
                error.insertAfter(element);
            }
        }

    });

    function saveLead() {
        var err = false;

        var clnt = $("#ClientId").val();
        var cntct = $("#ContactPersonId").val();
        var ldate = $("#LeadDate").val();
        var ndate = $("#NextContactDateTime").val();

        if (!checkDate(ldate)) {
            $("#LeadDate").val('');
            $("#errDate").show();
            err = true;
        }
        else {
            $("#errDate").hide();
        }
        
        if (ndate.trim().length <= 0) {
            $("#NextContactDateTime").val('');
            $("#errNDate").show();
            err = true;
        }
        else {
            $("#errNDate").hide();
        }
        if (clnt.trim().length <= 0 || clnt === 0 || clnt === '0') {
            $("#errClient").show();
            err = true;
        }
        else {
            $("#errClient").hide();
        }
        if (cntct.trim().length <= 0 || cntct === 0 || cntct === '0') {
            $("#errCPerson").show();
            err = true;
        }
        else {
            $("#errCPerson").hide();
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

        var lead = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        //if ($('#fileinput')[0].files.length !== 0)
        //{
        //    product.imageName = $('#fileinput')[0].files[0].name;
        //}

        var $c = lead.Code;
        var $name = lead.Name;

        abp.message.confirm(
            'New lead will be added.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    _leadService.createLead(lead).done(function (res) {
                        abp.notify.success('New lead added successfully : ' + $name, 'Success');
                        console.log(res);
                        if (res.notif.id > 0) {
                            srConnection.invoke('sendNotification', res.lead.code, res.lead.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                        }
                        var url = 'Index';
                        setTimeout(function () {
                            //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                            window.location.href = abp.appPath + 'Leads/Edit?id=' + res.lead.id;
                        }, 2000);
                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });
                }
            }
        );
    }

    //Handle save button click
    $('#SaveLeadButton').click(function (e) {
        e.preventDefault();
        saveLead();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            saveLead();
        }
    });

    $("#Project").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);


        return isValid(character);
    });
    $("#Project").keyup(function (event) {
        this.value = this.value.toUpperCase();
    });

    function isValid(str) {
        return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);

    }

    $('#CreateContactPersonButton').click(function (e) {
        $id = $("#ClientId").val();
        $name = $("#ClientName").val();
        if ($id.trim().length <= 0) {
            abp.message.info('Select Client first', 'Warning');
            return;
        }
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'ContactPersons/CreateContactPersonModal?refid=' + $id + '&refname=' + $name + '&reference=' + 'Client',
            //url: abp.appPath + '../ContactPersons/CreateContactPersonModal',
            //data: { refid: $id, refname: $name, reference: "Client" },
            //dataType: "json",
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#ContactPersonCreateModal').modal('show');
                $('#ContactPersonCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
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

    $('#CreateClientButton').click(function (e) {
        //var id = $("#lbProvinces").children("option:selected").val();
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Clients/CreateModal', //?provinceid=' + id,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#ClientCreateModal').modal('show');
                $('#ClientCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    $("#ClientCreateModal").on('hidden.bs.modal', function () {
        if ($("#ClientId").val().trim().length > 0) {
            getclient();
        }
    });

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
    }

    loadPage();
})(jQuery);




