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
    var _pricingTypeService = abp.services.app.pricingTypeService;
    var _productPriceService = abp.services.app.productPriceService;
    var _productService = abp.services.app.productService;
    var _companyService = abp.services.app.companyService;
    var _commonService = abp.services.app.commonService;
    var _clientService = abp.services.app.clientService;
    var _salesOrderService = abp.services.app.salesOrderService;
    var _rfqService = abp.services.app.rFQService;
    var _cpersonService = abp.services.app.contactPersonService;
    var _leadService = abp.services.app.leadService;
    var _stockEntryService = abp.services.app.stockEntryService;

    var _$form = $('form[name=RfqForm]');
    var _$itemsTable = $('#ItemsTable');
    var _$OItemsTable = $('#OItemsTable');
    function getcompanies() {
        var companies = $('#Companies');
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].isDefault === true) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    getseriestype(result.items[i].id);
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
        });
    }
    getcompanies();
    $('#Companies').on('change', function (e) {
        getseriestype($('#Companies').val());
    });
    function getseriestype(companyid) {
        var series = $('#Series');
        series.empty();
        _commonService.getSeriesTypesFiltered({ id: 0, transactionCode: '106', companyId: companyid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
            }
            series.selectpicker('refresh');
        });
    }

    //function saveRfq() {
    //    if (!_$form.valid()) {
    //        return;
    //    }
    //    //var formData = new FormData();
    //    //formData.append('file', $('#fileinput')[0].files[0]);

    //    var rfq = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
    //    //if ($('#fileinput')[0].files.length !== 0)
    //    //{
    //    //    product.imageName = $('#fileinput')[0].files[0].name;
    //    //}

    //    var $c = rfq.RFQID;
    //    var $name = rfq.ProjectName;

    //    abp.message.confirm(
    //        'New RFQ will be added.',
    //        'Are you sure?',
    //        function (isConfirmed) {
    //            if (isConfirmed) {
    //                abp.ui.setBusy(_$form);
    //                //_clientService.createClient(client).done().always(function ()
    //                _rfqService.createRfqInput(rfq).done().always(function () {
    //                    abp.ui.clearBusy(_$form);
    //                    abp.notify.success('New RFQ added successfully : ' + $name, 'Success');
    //                    //$.ajax({
    //                    //    type: 'GET',
    //                    //    url: abp.appPath + 'Clients/Index',
    //                    //    success: function (jdata) {

    //                    //    }
    //                    //});
    //                    var url = 'Index';
    //                    setTimeout(function () {
    //                        window.location.href = url; //will redirect to your blog page (an ex: blog.html)
    //                    }, 2000);
    //                });
    //            }
    //        }
    //    );
    //}

    //Handle save button click
    //$('#SaveRfqButton').click(function (e) {
    //    e.preventDefault();
    //    saveRfq();
    //});

    //Handle enter key
    //_$form.find('input').on('keypress', function (e) {
    //    if (e.which === 13) {
    //        e.preventDefault();
    //        saveRfq();
    //    }
    //});

    //$('#CreateCountryButton').click(function (e) {
    //    e.preventDefault();
    //    $.ajax({
    //        url: abp.appPath + '../Addresses/CreateCountryModal',
    //        type: 'POST',
    //        contentType: 'application/html',
    //        success: function (content) {
    //            $('#CountryCreateModal div.modal-content').html(content);
    //        },
    //        error: function (e) { }
    //    });
    //});

    //$('#CreateProvinceButton').click(function (e) {
    //    var id = $("#lbCountries").children("option:selected").val();
    //    e.preventDefault();
    //    $.ajax({
    //        url: abp.appPath + '../Addresses/CreateProvinceModal?countryid=' + id,
    //        type: 'POST',
    //        contentType: 'application/html',
    //        success: function (content) {
    //            $('#ProvinceCreateModal div.modal-content').html(content);
    //        },
    //        error: function (e) { }
    //    });
    //});

    //$('#CreateCityButton').click(function (e) {
    //    var id = $("#lbProvinces").children("option:selected").val();
    //    e.preventDefault();
    //    $.ajax({
    //        url: abp.appPath + '../Addresses/CreateCityModal?provinceid=' + id,
    //        type: 'POST',
    //        contentType: 'application/html',
    //        success: function (content) {
    //            $('#CityCreateModal div.modal-content').html(content);
    //        },
    //        error: function (e) { }
    //    });
    //});

    //Clientview

    //var _$table = $('#ClientsTable');
    //var _service = abp.services.app.clientService;
    //var _$modal = $('#ClientCreateModal');
    //var _$form = _$modal.find('form');

    //var _permissions = {
    //    create: abp.auth.hasPermission('Master.Clients.Create'),
    //    edit: abp.auth.hasPermission('Master.Clients.Edit'),
    //    'delete': abp.auth.hasPermission('Master.Clients.Delete')
    //};

    //var dataTable = _$table.DataTable({
    //    paging: true,
    //    serverSide: true,
    //    processing: true,
    //    searching: false,
    //    listAction: {
    //        ajaxFunction: _service.getClients,
    //        inputFilter: function () {
    //            var $s = $('#SearchFilter').val();
    //            return {
    //                filter: $s
    //            };
    //        }
    //    },
    //    columnDefs: [
    //        {
    //            className: 'control responsive',
    //            orderable: false,
    //            render: function () {
    //                return '';
    //            },
    //            targets: 0
    //        },
    //        {
    //            targets: 1,
    //            data: "code"
    //        },
    //        {
    //            targets: 2,
    //            data: "name"
    //        }
    //        ,
    //        {
    //            orderable: false,
    //            targets: 3,
    //            class: "text-center",
    //            data: { id: "id", name: "name" },
    //            "render": function (data) {
    //                return '<a id="edit-client" title="edit" href="#" class="edit-client" data-client-id="' + data.id + '" data-toggle="modal" data-target="#ClientEditModal" ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-client" title="delete" href="#" class="delete-client" data-client-id="' + data.id + '" data-client-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
    //            }
    //        }
    //    ]
    //});

    function getAll() {
        dataTable.ajax.reload();
    }

    //$('#SearchButton').click(function (e) {
    //    e.preventDefault();
    //    getAll();
    //});

    //$('#SearchFilter').on('keydown', function (e) {
    //    if (e.keyCode !== 13) {
    //        return;
    //    }
    //    e.preventDefault();
    //    getAll();
    //});

    //$('#SearchFilter').focus();

    //Handle From Type change
    $('#Type').change(function (e) {
        $sel = $(this).children("option:selected").val();
        if ($sel.toUpperCase() === "Leads".toUpperCase()) {
            $("#divLead").show();
            $("#LeadId").attr("required");
            $("#LeadCode").attr("required");
            $("#Lead").attr("required");
            $("#ClientId").removeAttr("required");
            //$("#ClientId").attr("readonly", "readonly");
            $("#ClientName").removeAttr("required");
            $("#ClientName").attr("readonly", "readonly");
            $("#ContactPersonId").removeAttr("required")
            //$("#ContactPersonId").attr("readonly", "readonly");
            $("#ContactPerson").removeAttr("required")
            $("#ContactPerson").attr("readonly", "readonly");
            $("#ProjectName").removeAttr("required")
            $("#ProjectName").attr("readonly", "readonly");
        }
        else {
            $("#divLead").hide();
            $("#LeadId").removeAttr("required");
            $("#LeadCode").removeAttr("required");
            $("#Lead").removeAttr("required");
            //$("#ClientId").removeAttr("readonly");
            $("#ClientId").attr("required", "required");
            $("#ClientName").removeAttr("readonly");
            $("#ClientName").attr("required", "required");
            $("#ContactPersonId").attr("required", "required")
            //$("#ContactPersonId").removeAttr("readonly");
            $("#ContactPerson").attr("required", "required")
            $("#ContactPerson").removeAttr("readonly");
            $("#ProjectName").attr("required", "required")
            $("#ProjectName").removeAttr("readonly");
        }

        $("#LeadId").val('');
        $("#LeadCode").val('');
        $("#Lead").val('');
        $("#ClientId").val('');
        $("#ClientName").val('');
        $("#ContactPersonId").val('');
        $("#ContactPerson").val('');
        $("#ProjectName").val('');
        $('#Telno').val('');
        $('#Phone').val('');
        $('#Taxno').val('');
        $('#Email').val('');
        $('#Address').val('');
    });

    //Lead Autocomplete
    var getleads = function (request, response) {
        var $filter = request.term;
        //if (!abp.auth.isGranted("CRM.Leads.AllAccounts")) {
            var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
            console.log(empid);
            $filter = $filter + '|' + empid;
        //}
        _leadService.getLeadsforRFQ({ filter: $filter }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.code + ' - ' + el.clientName + ' - ' + el.project + ' - ' + el.contactPerson,
                    value: el.id
                };
            }));
        });
    };

    function getlead() {
        var $leadid = $('#LeadId').val();
        _leadService.getLead({ id: $leadid }).done(function (result) {
            $("#LeadCode").val(result.code);
            $("#ClientId").val(result.clientId);
            $("#ClientName").val(result.clientName);
            $("#ContactPersonId").val(result.contactPersonId);
            getcontactperson();
            $("#ProjectName").val(result.project);
            getclient();
        });
    };
    var selectlead = function (event, ui) {
        event.preventDefault();
        $("#LeadId").val(ui.item ? ui.item.value : "");
        $("#Lead").val(ui.item ? ui.item.label : "");
        getlead();
        return false;
    };
    var focuslead = function (event, ui) {
        event.preventDefault();
        $("#LeadId").val(ui.item.value);
        $("#Lead").val(ui.item.label);
    };
    var changelead = function (event, ui) {
        event.preventDefault();
        $("#LeadId").val(ui.item ? ui.item.value : "");
        $("#Lead").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#ClientId").val('');
            $("#ClientName").val('');
            $("#ContactPersonId").val('');
            $("#ContactPerson").val('');
            $("#ProjectName").val('');
            $('#Telno').val('');
            $('#Phone').val('');
            $('#Taxno').val('');
            $('#Email').val('');
            $('#Address').val('');
        }
    };
    $("#Lead").autocomplete({
        source: getleads,
        select: selectlead,
        focus: focuslead,
        minLength: 2,
        delay: 100,
        change: changelead
    });
    //Lead Autocomplete

    //Client Autocomplete
    var getclients = function (request, response) {
        _clientService.getClients({ filter: request.term + '|4' }).done(function (result) {
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
        _clientService.getClientDetails({ id: $clientid }).done(function (result) {
            $('#Telno').val(result[0].telNo);
            $('#Phone').val(result[0].mobileNo);
            $('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            $('#Address').val(result[0].completeAddress);
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
            $('#Telno').val('');
            $('#Phone').val('');
            $('#Taxno').val('');
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
        if ($clientid > 0) {
            _cpersonService.getContactPersonsFiltered({ id: 0, reference: "Client", referenceId: $clientid, filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.fullName,
                        value: el.id
                    };
                }));
            });
        }
        else {
            abp.message.warn('Please select Client first');
        }
    };

    function getcontactperson() {
        var $cpersonid = $('#ContactPersonId').val();
        _cpersonService.getContactPerson({ id: $cpersonid }).done(function (result) {
            $('#ContactPerson').val(result.title + ' ' + result.firstName + ' ' + result.lastName);
            $('#Email').val(result.email);
        });
    };
    var selectcperson = function (event, ui) {
        event.preventDefault();
        $("#ContactPersonId").val(ui.item ? ui.item.value : "");
        $("#ContactPerson").val(ui.item ? ui.item.label : "");
        getcontactperson();
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
        //if (ui.item === null) {
        //    $("#ContactPersonId").val('');
        //    $("#ContactPerson").val('');
        //    $('#TelNo').val('');
        //    $('#FaxNo').val('');
        //    $('#MobileNo').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
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

    //Item Autocomplete
    var getproducts = function (request, response) {
        _productService.getProductByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name + ' ' + el.code,
                    value: el.id
                };
            }));
        });
    };
    function getproduct() {
        var $productid = $('#ProductId').val();
        _productService.getProduct({ id: $productid }).done(function (result) {
            $('#ProductCode').val(result.code);
            $("#PerDescription").val(result.description);
            $('#ProductName').val(result.name);
        });
    };
    function getproductunits() {
        var units = $('#Units');
        var $productid = $('#ProductId').val();
        units.empty();
        _productService.getProductUnits({
            id: $productid
        }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                units.append('<option value=' + result.items[i].unitId + '>' + result.items[i].unit + '</option>');
            }
            units.selectpicker('refresh');
        });
    }
    function getproductprice() {
        var $unitid = $('#Units').val();
        var $pricingtypeid = $('#PricingTypes').val();
        var $productid = $('#ProductId').val();
        if ($unitid === null) {
            $unitid = 0;
        }
        if ($pricingtypeid === null) {
            $pricingtypeid = 0;
        }
        _productPriceService.getProductPrices({
            productId: $productid, pricingTypeId: $pricingtypeid, unitId: $unitid
        }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                var price = currencyFormat(result.items[i].unitPrice);
                $("#Price").val(result.items[i].unitPrice ? price : "");
            }
        });
    }
    var selectproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item ? ui.item.value : "");
        //$("#ProductName").val(ui.item ? ui.item.label : "");
        getproduct();
        getproductunits();
        getproductprice();
        return false;
    };
    var focusproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item.value);
        //$("#ProductName").val(ui.item.label);
        //$("#PerDescription").val(ui.item.label);
    };
    var changeproduct = function (event, ui) {
        event.preventDefault();
        $("#ProductId").val(ui.item ? ui.item.value : "");
        //$("#ProductName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#ProductCode").val("");
            $("#Quantity").val("");
            $("#Price").val("");
            $("#PerDescription").val("");
            var units = $('#Units');
            units.empty();
            units.selectpicker('refresh');
        }
    };
    $("#ProductName").autocomplete({
        source: getproducts,
        select: selectproduct,
        focus: focusproduct,
        minLength: 2,
        delay: 100,
        change: changeproduct
    });
    $('#Units').on('change', function (e) {
        getproductprice();
    });
    //Item Autocomplete

    //Edit Item Autocomplete
    var editgetproducts = function (request, response) {
        _productService.getProductByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function editgetproduct() {
        var $productid = $('#EProductId').val();
        _productService.getProduct({ id: $productid }).done(function (result) {
            $('#EProductCode').val(result.code);
            $('#EProductName').val(result.name);
            $('#EPerDescription').val(result.description);
            //if (result.imageName !== null && result.imageName !== '') {
            //    $("#EProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
            //    $("#EProductImage").show();
            //}
            //else {
            //    $("#EProductImage").hide();
            //}
        });
    }
    function editclickedgetproduct() {
        var $productid = $('#EProductId').val();
        _productService.getProduct({ id: $productid }).done(function (result) {
            $('#EProductCode').val(result.code);
            $('#EProductName').val(result.name);
            //$('#EPerDescription').val(result.description);
            //if (result.imageName !== null && result.imageName !== '') {
            //    $("#EProductImage").attr("src", abp.appPath + "products/" + result.id + "/" + result.imageName);
            //    $("#EProductImage").show();
            //}
            //else {
            //    $("#EProductImage").hide();
            //}
        });
    }
    function editgetproductunits() {
        var units = $('#EUnits');
        var $productid = $('#EProductId').val();
        units.empty();
        _productService.getProductUnits({
            id: $productid
        }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                units.append('<option value=' + result.items[i].unitId + '>' + result.items[i].unit + '</option>');
            }
            units.selectpicker('refresh');
        });
    }
    function editgetproductprice() {
        $("#EPrice").val("");
        var $unitid = $('#EUnits').val();
        var $pricingtypeid = $('#EPricingTypes').val();
        var $productid = $('#EProductId').val();
        if ($unitid === null) {
            $unitid = 0;
        }
        if ($pricingtypeid === null) {
            $pricingtypeid = 0;
        }
        _productPriceService.getProductPrices({
            productId: $productid, pricingTypeId: $pricingtypeid, unitId: $unitid
        }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                var price = currencyFormat(result.items[i].unitPrice);
                $("#EPrice").val(result.items[i].unitPrice ? price : "");
            }
        });
    }
    var editselectproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item ? ui.item.value : "");
        $("#EProductName").val(ui.item ? ui.item.label : "");
        $("#EPrice").val("");
        editgetproduct();
        editgetproductunits();
        editgetproductprice();
        return false;
    };
    var editfocusproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item.value);
        $("#EProductName").val(ui.item.label);
        editgetproduct();
        editgetproductunits();
        editgetproductprice();
    };
    var editchangeproduct = function (event, ui) {
        event.preventDefault();
        $("#EProductId").val(ui.item ? ui.item.value : "");
        $("#EProductName").val(ui.item ? ui.item.label : "");
        if (ui.item === null) {
            $("#EProductCode").val("");
            $("#EQuantity").val("");
            $("#EPrice").val("");
            $("#EPerDescription").val("");
            var units = $('#EUnits');
            units.empty();
            units.selectpicker('refresh');
            $("#EProductImage").hide();
        }
    };
    $("#EProductName").autocomplete({
        source: editgetproducts,
        select: editselectproduct,
        focus: editfocusproduct,
        minLength: 2,
        delay: 100,
        change: editchangeproduct
    });
    $('#EUnits').on('change', function (e) {
        editgetproductprice();
    });
    //Edit Item Autocomplete
    //Additem
    //Datatable Add

    $("#OUpdateItemButton").hide();
    var OdataTable = _$OItemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            //targets: [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
        },
        {
            orderable: true,   
            "autoWidth": false,
            targets: [0, 1, 2, 3, 4,5,6]
        },
        {
            className: 'text-center',
            targets: [5]
        }
        ]
    });

    $('#OAddItemButton').click(function (e) {
        e.preventDefault();
        addnewOitem();
    });

    $('#OUpdateItemButton').click(function (e) {
        e.preventDefault();
        var $Oitemno = parseInt($('#Oitemno').val()) - 1;
        var $OName = $('#OName').val();
        var $OArea = $('#OArea').val();
        var $ODescription = $('#ODescription').val();
        var $ODimension = $('#ODimension').val();
        var $OQuantity = $("#OQuantity").val();

        var table = _$OItemsTable.DataTable();
        var temp = table.row($Oitemno).data();

        //temp[1] = $Oitemno;
        temp[1] = $OName;
        temp[2] = $OArea;
        temp[3] = $ODescription;
        temp[4] = $ODimension;
        temp[5] = $OQuantity;
        temp[6] = '<a id="edit-uitem" class="edit-uitem" title="edit" href="#" data-uitemno="' + $('#Oitemno').val() + '"  data-uname="' + $OName + '" data-uarea="' + $OArea + '" data-udesc="' + $ODescription + '" data-udimension="' + $ODimension + '"  data-uqty="' + $OQuantity + '" ><i class="fa fa-edit"></i></a>&nbsp;|&nbsp;<a id="delete-Oitem" class="delete-Oitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        $('#OItemsTable').dataTable().fnUpdate(temp, $Oitemno, undefined, false);
        $("#OUpdateItemButton").hide();
        $("#OAddItemButton").show();

        $('#Oitemno').val("0");
        $('#OName').val("");
        $('#OArea').val("");
        $('#ODescription').val("");
        $('#ODimension').val("");
        $("#OQuantity").val("");
        $("#OUpdateItemButton").hide();
        $("#OAddItemButton").show();
    });

    function rearrange2() {
        var table = _$OItemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {
            var temp = table.row(i).data();
            var itemno = i + 1;

            var $OName = f[i][1];
            var $OArea = f[i][2];
            var $ODescription = f[i][3];
            var $ODimension = f[i][4];
            var $OQuantity = f[i][5];

            temp[0] = itemno;
            temp[1] = f[i][1];
            temp[2] = f[i][2];
            temp[3] = f[i][3];
            temp[4] = f[i][4];
            temp[5] = f[i][5];
            temp[6] = '<a id="edit-Oitem" class="edit-Oitem" title="edit" href="#" data-Oitemno="' + itemno + '"  data-Oname="' + $OName + '" data-Oarea="' + $OArea + '" data-Odesc="' + $ODescription + '" data-Odimension="' + $ODimension + '"  data-Oqty="' + $OQuantity + '" ><i class="fa fa-edit"></i></a>&nbsp;|&nbsp;<a id="delete-Oitem" class="delete-Oitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            $('#OItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
        }
    }

    _$OItemsTable.on('click', 'a.edit-uitem', function (e) {
        e.preventDefault();
        $("#OAddItemButton").hide();
        $("#OUpdateItemButton").show();
        var $uitemno = $(this).attr("data-uitemno");
        var $uname = $(this).attr("data-uname");
        var $uarea = $(this).attr("data-uarea");
        var $udesc = $(this).attr("data-udesc");
        var $udimension = $(this).attr("data-udimension");
        var $uqty = $(this).attr("data-uqty");

        $('#Oitemno').val($uitemno);
        $('#OName').val($uname);
        $('#OArea').val($uarea);
        $('#ODescription').val($udesc);
        $('#ODimension').val($udimension);
        $("#OQuantity").val($uqty);
    });

    function addnewOitem() {
        var $OName = $('#OName').val();
        var $OArea = $('#OArea').val();
        var $ODescription = $('#ODescription').val();
        var $ODimension = $('#ODimension').val();
        var $OQuantity = $("#OQuantity").val();

        var datacount = OdataTable.rows().count();
        var itemno = datacount + 1;

        OdataTable.row.add([itemno, $OName, $OArea, $ODescription, $ODimension, $OQuantity,
            '<a id="edit-Oitem" class="edit-Oitem" title="edit" href="#" data-Oitemno="' + itemno + '"  data-Oname="' + $OName + '" data-Oarea="' + $OArea + '" data-Odesc="' + $ODescription + '" data-Odimension="' + $ODimension + '"  data-Oqty="' + $OQuantity + '" ><i class="fa fa-edit"></i></a>&nbsp;|&nbsp;<a id="delete-Oitem" class="delete-Oitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
        ]).draw();

        $('#Oitemno').val("0");
        $('#OName').val("");
        $('#OArea').val("");
        $('#ODescription').val("");
        $('#ODimension').val("");
        $("#OQuantity").val("");
        $("#OUpdateItemButton").hide();
        $("#OAddItemButton").show();
    }

    _$OItemsTable.on('click', 'a.edit-Oitem', function (e) {
        e.preventDefault();
        $("#OAddItemButton").hide();
        $("#OUpdateItemButton").show();
        var $Oitemno = $(this).attr("data-Oitemno");
        var $Oname = $(this).attr("data-Oname");
        var $Oarea = $(this).attr("data-Oarea");
        var $Odesc = $(this).attr("data-Odesc");
        var $Odimension = $(this).attr("data-Odimension");
        var $Oqty = $(this).attr("data-Oqty");

        $('#Oitemno').val($Oitemno);
        $('#OName').val($Oname);
        $('#OArea').val($Oarea);
        $('#ODescription').val($Odesc);
        $('#ODimension').val($Odimension);
        $("#OQuantity").val($Oqty);
    });

    _$OItemsTable.on('click', 'a.delete-Oitem', function (e) {
        e.preventDefault();
        $this = $(this);
        var dtRow = $this.parents('tr');
        var tableitemsdelete = _$OItemsTable.DataTable();
        tableitemsdelete.row(dtRow[0].rowIndex - 1).remove().draw(false);
        rearrange2();
    });

    var dataTable = _$itemsTable.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            //targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            //MARC --WALA KA NA NITO SA VIEW
            //targets: [3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            //targets: [4, 5, 6, 7]
            targets: [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
        },
        {
            orderable: false,
            //targets: [0, 1, 2, [3, 4, 5, 6]
            //MARC --3 NA YUNG ACTION COLUMN
            //targets: [0, 1, 2, 6]
            targets: [0, 1, 2, 3, 7]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
        {
            className: 'text-center',
            //targets: [2]

            targets: [3]
        }
        ]
    });
    $("#GroupName").keypress(function (event) {
        var str = $('#GroupName').val();
        var regex = /['@<>;:"|%&*+=!]/gi;

        if (regex.test(str) == true) {
            abp.message.warn('Please Remove Special Character on GroupName', 'Special Character');
        }

        return isValid;
    });
    function addnewitem() {

        var str = $('#GroupName').val();
        var regex = /['@<>;:"|%&*+=!]/gi;

        if (regex.test(str) == true) {
            abp.message.warn('Please Remove Special Character on GroupName', 'Special Character');
        }
        var $productid = $('#ProductId').val();
        var $productcode = $('#ProductCode').val();
        var $productname = $('#ProductName').val();
        var $unitid = $('#Units').val();
        var $unit = $("#Units option:selected").html();
        var $quantity = $('#Quantity').val();
        var $groupname = $('#GroupName').val();
        var $color = $('#Color').val();
        var $itemtypev = $('#ItemType').val();
        var $itemtypet = $('#ItemType option:selected').text();

        //MARC --WALA KA PRICE
        var $price = $('#Price').val();

        //MARC --WALA KA DISCOUNTS
        var $disc1 = $('#Discount1').val();
        var $disc2 = $('#Discount2').val();
        var $disc3 = $('#Discount3').val();
        var $dtype1 = $('#DiscountType1').val();
        var $dtype2 = $('#DiscountType2').val();
        var $dtype3 = $('#DiscountType3').val();
        var $perdescription = $('#PerDescription').val();

        //MARC --WALA KA ULIT PRICE
        //if ($productid === '' || $productcode === '' || $productname === '' || $quantity === '') {// || $price === '') {
        //    return;
        //}

        if ($quantity === '' || $perdescription === '') {// || $price === '') {
            return;
        }

        //MARC --WALA KA ULIT PRICE
        var price = parseFloat($price.replace(/,/g, ''));
        var quantity = parseFloat($quantity);

        //MARC --WALA KA ULIT DISCOUNTS
        var disc1 = 0;
        var disc2 = 0;
        var disc3 = 0;
        if ($disc1 !== "") {
            disc1 = parseFloat($disc1);
        }
        if ($disc2 !== "") {
            disc2 = parseFloat($disc2);
        }
        if ($disc3 !== "") {
            disc3 = parseFloat($disc3);
        }

        //MARC --WALA KA ULIT DISCOUNTS AT PRICE
        var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
        var totaldiscount = discount * quantity;
        var lessprice = price - discount;
        var total = lessprice * quantity;

        var datacount = dataTable.rows().count();
        var itemno = datacount + 1;
        //var $rowid = "id_row_" + itemno;
        //var $rowcode = "code_row_" + itemno;
        //var $rowname = "name_row_" + itemno;
        //var $rowdesc = "desc_row_" + itemno;
        //var $rowquantity = "quantity_row_" + itemno;
        //var $rowunit = "unit_row_" + itemno;
        dataTable.row.add([itemno,
            //'<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" name="' + $rowcode + '" class="btn-link">' + $productcode + '</a><br /><small><label name="' + $rowname + '" class="text-muted">' + $productname + '</label></small>',
            '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $color + '</span></small>',
            $itemtypet, 
            '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>',
            //'<label name="' + $quantity + '" class="text-muted">' + $unit + '</label>',
            //MARC --WALA KA ULIT PRICE
            //'<label name="' + $rowquantity + '" class="text-muted">' + $quantity + '</label>|<label name="' + $rowunit + '" class="text-muted">' + $unit + '</label>',
            ////MARC --WALA KA ULIT PRICE
            lessprice,
            totaldiscount,
            total,
            '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '"  data-color="' + $color + '" data-type="' + $itemtypev + '" data-disctotal="' + totaldiscount + '" data-price="' + price + '" data-disc1="' + disc1 + '" data-disc2="' + disc2 + '" data-disc3="' + disc3 + '" data-dtype1="' + $dtype1 + '" data-dtype2="' + $dtype2 + '" data-dtype3="' + $dtype3 + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
            //MARC --WALA KA ULIT DISCOUNTS
            //$productid, $perdescription, $quantity, $unitid, $groupname, $productname
            $productid, $perdescription, $quantity, $unitid, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3), $groupname, $productcode, $itemtypev, $color

            //, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3)
        ]).draw();

        //MARC --WALA KA ULIT PRICE
        //computeTotal();

        //MARC --WALA KA ULIT DISCOUNTS
        //$('#Discount1').val("");
        //$('#Discount2').val("");
        //$('#Discount3').val("");
        $('#Quantity').val("");
        //MARC --DAGDAG KO TO
        $('#ProductCode').val('');
        $('#ProductName').val('');
        $('#ProductId').val('');
        $('#PerDescription').val('')
    }

    function computeTotal() {
        var grandtotal = 0;
        var taxrate = 0;
        var tax = 0;
        var taxcode = 101;
        var nettotal = 0;
        dataTable.column(5).data()
            .each(function (value, index) {
                var $grandtotal = parseFloat(value);
                grandtotal = grandtotal + $grandtotal;
            });

        var $taxtypeid = $('#TaxTypes').val();

        taxcode = $("#TaxTypes option:selected").data('code');
        taxrate = $("#TaxTypes option:selected").data('rate');

        if (taxcode === 101) {
            nettotal = grandtotal / taxrate;
            tax = nettotal * (taxrate - 1);
        }
        else {
            nettotal = grandtotal;
            tax = 0;
        }

        $('#SubTotal').val(currencyFormat(nettotal));
        $('#Tax').val(currencyFormat(tax));
        $('#Total').val(currencyFormat(grandtotal));
    }

    $('#UpdatetemButton').click(function (e) {
        e.preventDefault();
        var $indexno = parseInt($('#EIndexNo').text()) - 1;
        var $productid = $('#EProductId').val();
        var $productcode = $('#EProductCode').val();
        var $productname = $('#EProductName').val();
        var $unitid = $('#EUnits').val();
        var $unit = $("#EUnits option:selected").html();
        var $quantity = $('#EQuantity').val();
        var $eColor = $('#EColor').val();
        var $Texttypetext = $('#typeitem').val();
        var $typetext = $("#typeitem option:selected").text();
        var $EPrice = $('#EPrice').val();

        var $disc1 = $('#EDiscount1').val();
        var $disc2 = $('#EDiscount2').val();
        var $disc3 = $('#EDiscount3').val();
        var $dtype1 = $('#EDiscountType1').val();
        var $dtype2 = $('#EDiscountType2').val();
        var $dtype3 = $('#EDiscountType3').val();
        var $perdescription = $('#EPerDescription').val();
        var $groupname = $('#EGroupName').val();

        if ( $quantity === '' || $perdescription === '') { return; }

        var price = parseFloat($EPrice.replace(/,/g, ''));
        var quantity = parseFloat($quantity);

        var disc1 = 0;
        var disc2 = 0;
        var disc3 = 0;
        if ($disc1 !== "") {
            disc1 = parseFloat($disc1.replace(/,/g, ''));
        }
        if ($disc2 !== "") {
            disc2 = parseFloat($disc2.replace(/,/g, ''));
        }
        if ($disc3 !== "") {
            disc3 = parseFloat($disc3.replace(/,/g, ''));
        }

        var discount = priceDiscount(price, disc1, parseInt($dtype1), disc2, parseInt($dtype2), disc3, parseInt($dtype3));
        var totaldiscount = discount * quantity;
        var lessprice = price - discount;
        var total = lessprice * quantity;

        var table = _$itemsTable.DataTable();
        var temp = table.row($indexno).data();

        temp[1] = '<span class="text-warning font-weight-bold">' + $groupname + '</span><br /><a href="#" class="btn-link">' + $productcode + '</a><br /><small><span class="text-muted">' + $productname + ' ' + $eColor + '</span></small>';
        temp[2] = $typetext;
        temp[3] = '<span class="text-muted">' + $quantity + '</span>|<span class="text-muted">' + $unit + '</span>';
        temp[4] = lessprice;
        temp[5] = totaldiscount;
        temp[6] = total;
        temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + $('#EIndexNo').text() + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-productname="' + $productname + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" data-reference="' + $productcode + '" data-reference="' + $productcode + '" data-disctotal="' + totaldiscount + '"  data-price="' + $EPrice + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
        temp[8] = $productid;
        temp[9] = $perdescription;
        temp[10] = $quantity;
        temp[11] = $unitid;
        temp[12] = $disc1;
        temp[13] = parseInt($dtype1);
        temp[14] = $disc2;
        temp[15] = parseInt($dtype2);
        temp[16] = $disc3;
        temp[17] = parseInt($dtype3);
        temp[18] = $groupname;
        temp[19] = $productcode;
        temp[20] = $Texttypetext;
        temp[21] = $eColor;
        $('#ItemsTable').dataTable().fnUpdate(temp, $indexno, undefined, false);
        $('#ItemEditModal').modal('hide');
        rearrange();
    });
    function rearrange() {
        var table = _$itemsTable.DataTable();
        var form_data = table.rows().data();
        var f = form_data;
        for (var i = 0; f.length > i; i++) {
            var temp = table.row(i).data();
            var itemno = i + 1;

            //var $productcode = f[i][4];
            //var $productid = f[i][4];
            //var $unitid = f[i][7];
            //var $perdescription = f[i][5];
            //var $quantity = f[i][6];
            ////var $price = f[i][3];
            ////var disc1 = f[i][11];
            ////var disc2 = f[i][13];
            ////var disc3 = f[i][15];
            ////var $dtype1 = f[i][12];
            ////var $dtype2 = f[i][14];
            ////var $dtype3 = f[i][16];
            //var $groupname = f[i][8];
            ////var $productcode = f[i][19];
            ////var totaldiscount = f[i][4];
            //temp[0] = itemno;
            //temp[3] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productcode + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[0] = itemno;
            temp[1] = f[i][1];
            temp[2] = f[i][2];
            temp[3] = f[i][3];
            temp[4] = f[i][4];
            temp[5] = f[i][5];
            temp[6] = f[i][6];
            temp[7] = '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + itemno + '"  data-id="' + $productid + '" data-unitid="' + $unitid + '" data-perdesc="' + $perdescription + '" data-qty="' + $quantity + '" data-groupname="' + $groupname + '" data-reference="' + $productid + '" ><i class="fa fa-edit"></i></a> | <a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
            temp[8] = f[i][8];
            temp[9] = f[i][9];
            temp[10] = f[i][10];
            temp[11] = f[i][11];
            temp[12] = f[i][12];
            temp[13] = f[i][13];
            temp[14] = f[i][14];
            temp[15] = f[i][15];
            temp[16] = f[i][16];
            temp[17] = f[i][17];
            temp[18] = f[i][18];
            temp[19] = f[i][19];
            temp[20] = f[i][20];
            temp[21] = f[i][21];
            temp[22] = f[i][22];
            $('#ItemsTable').dataTable().fnUpdate(temp, i, undefined, false);
        }
    }

    _$itemsTable.on('click', 'a.edit-item', function (e) {
        e.preventDefault();
        var $itemno = $(this).attr("data-itemno");
        var $productid = $(this).attr("data-id");
        var $qty = $(this).attr("data-qty");
        var $unitid = $(this).attr("data-unitid");
        var $perdescription = $(this).attr("data-perdesc");
        var $color = $(this).attr("data-color");
        var $itemtypev = $(this).attr("data-type");
        //alert($perdescription);
        var $price = $(this).attr("data-price");
        var $disc1 = $(this).attr("data-disc1");
        var $disc2 = $(this).attr("data-disc2");
        var $disc3 = $(this).attr("data-disc3");
        var $dtype1 = $(this).attr("data-dtype1");
        var $dtype2 = $(this).attr("data-dtype2");
        var $dtype3 = $(this).attr("data-dtype3");
        var $disctotal = $(this).attr("data-disctotal");
        var $reference = $(this).attr("data-reference");
        var $groupname = $(this).attr("data-groupname");
        //alert($groupname);
        var discountvalue = parseFloat($disctotal) / parseFloat($qty);
        var origprice = discountvalue + parseFloat($price);

        $('#itemno').val($itemno);
        $('#EProductId').val($productid);
        $('#EIndexNo').text($itemno);
        $('#EQuantity').val($qty);
        $('#EPerDescription').val($perdescription);
        $('#EItemType').text($itemtypev);
        $('#EColor').val($color);
        if ($disc1 !== '' || $disc2 !== '' || $disc3 !== '') {
            $('#accordioneditdiscount .collapse').collapse('show');
        }
        $('#EDiscount1').val($disc1);
        $('#EDiscount2').val($disc2);
        $('#EDiscount3').val($disc3);

        $('#EDiscountType1').val($dtype1);
        $('#EDiscountType2').val($dtype2);
        $('#EDiscountType3').val($dtype3);

        editclickedgetproduct();
        editgetproductunits($unitid);
        $('#EProductCode').val($reference);
        $('#EGroupName').val($groupname);
        $('#EPrice').val($price);
    });


    _$itemsTable.on('click', 'a.delete-item', function (e) {
        e.preventDefault();
        $this = $(this);
        var dtRow = $this.parents('tr');
        var tableitemsdelete = _$itemsTable.DataTable();
        tableitemsdelete.row(dtRow[0].rowIndex - 1).remove().draw(false);
        computeTotal();
        rearrange();
    });
    // Delete product unit record

    $('#TaxTypes').on('change', function (e) {
        computeTotal();
    });
    $('#AddItemButton').click(function (e) {
        e.preventDefault();
        addnewitem();
    });
    //Datatable Add

    function saveRfq() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        var formdata = _$form.serializeFormToObject();

        var viewData = {
            revision: {
                "lastseries": "0",
                "rfqid": "0",
                "rfqcode": "0",

            },
            rfq: {
                "companyId": formdata.CompanyId,
                "seriesTypeId": formdata.SeriesTypeId,
                "prefix": $("#Series option:selected").html(),
                "code": "0",
                "revisionNo": "1",
                "transactionTime": formdata.TransactionTime,
                "type": formdata.Type,
                "leadId": formdata.Type.toUpperCase() === "LEADS".toUpperCase() ? formdata.LeadId : 0,
                "lead": formdata.Type.toUpperCase() === "LEADS".toUpperCase() ? formdata.LeadCode : '',
                "clientId": formdata.ClientId,
                "client": formdata.Client,
                "projectName": formdata.ProjectName,
                "contactPersonId": formdata.ContactPersonId,
                "contactPerson": formdata.ContactPerson,
                "telNo": formdata.Telno,
                "phone": formdata.Phone,
                "email": formdata.Email,
                "address": formdata.Address,
                "deliveryAddress": formdata.DeliveryAddress,
                "discount": formdata.Discount,
                "vat": formdata.Vat,
                "remarks": formdata.Remarks,
                "statusid": "1",
                "deadlines": formdata.Deadlines,
                "others": formdata.Others
                //"status": "For Approval",

                //"transactionTime": formdata.TransactionTime,
                //"deliveryTime": formdata.DeliveryTime,

                //"clientOrderNo": formdata.ClientOrderNo,
                //"quotationId": formdata.QuotationId,
                //"orderTypeId": formdata.OrderTypeId,
                //"salesAgentId": formdata.SalesAgentId,
                //"notes": formdata.Notes,
                //"statusId": 1,
                //"taxTypeId": formdata.TaxTypeId,
                //"subTotal": formdata.Total,
                //"otherDiscount": 0,
                //"netTotal": formdata.SubTotal,
                //"taxRate": $("#TaxTypes option:selected").data('rate'),
                //"tax": formdata.Tax,
                //"grandTotal": formdata.Total



            },
            rfqdetails: [],
            rfqotherdetails: []
        };
        disabled.attr('disabled', 'disabled');

        //sales order items
        var tableitem = _$itemsTable.DataTable();
        var form_data = tableitem.rows().data();
        var f = form_data;
        //jsonObj = [];
        for (var i = 0; f.length > i; i++) {
            var ds1 = f[i][13];
            var ds2 = f[i][15];
            var ds3 = f[i][17];
            if (ds1 == 0) {
                ds1 = 2;
            }
            if (ds2 == 0) {
                ds2 = 2;
            }
            if (ds3 == 0) {
                ds3 = 2;
            }

            item = {};
            item["RFQId"] = formdata.SeriesTypeId;

            //Wilson IndexNo for arrangement fix 09132022
            item["IndexNo"] = f[i][0];
            //Wilson IndexNo for arrangement fix 09132022
            item["ProductId"] = f[i][8];
            item["Description"] = f[i][9];
            item["Qty"] = f[i][10];
            item["UnitId"] = f[i][11];
            item["ItemType"] = f[i][20];
            item["GroupName"] = f[i][18];
            //item["ProductName"] = f[i][9];
            item["ProductName"] = "0";
            item["UnitPrice"] = f[i][4];
            item["Disc1"] = f[i][12];
            item["DiscType1"] = ds1;
            item["Disc2"] = f[i][14];
            item["DiscType2"] = ds2;
            item["Disc3"] = f[i][16];
            item["DiscType3"] = ds3;
            item["DiscTotal"] = f[i][5];
            item["Total"] = f[i][6];
            item["Color"] = f[i][21];
            viewData.rfqdetails.push(item);
            //jsonObj.push(item);
        }


        //sales order items
        var tableotheritem = _$OItemsTable.DataTable();
        var form_data2 = tableotheritem.rows().data();
        var g = form_data2;
        //jsonObj = [];
        for (var j = 0; g.length > j; j++) {
            items = {};
            items["RFQId"] = formdata.SeriesTypeId;
            items["IndexNo"] = g[j][0];
            items["Name"] = g[j][1];
            items["Area"] = g[j][2];
            items["Description"] = g[j][3];
            items["Dimension"] = g[j][4];
            items["Quantity"] = g[j][5];
            items["Description1"] = "";
            items["Status"] = "0";
            viewData.rfqotherdetails.push(items);
            //jsonObj.push(item);
        }

        //var salesorderinput = JSON.stringify(viewData);
        var rfqinput = JSON.stringify(viewData);
        abp.message.confirm(
            'New RFQ will be created.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    //_salesOrderService.createSalesOrder(viewData).done(function () {
                    _rfqService.createRFQ(viewData).done(function (res) {
                        abp.notify.success('Request for Quotation created', 'Success');
                        if (res.notif.id > 0) {
                            srConnection.invoke('sendNotification', res.rfq.code, res.rfq.id, res.notif.userIds, abp.session.userId, '', res.notif.message); // Send a message to the server
                        }
                        var url = 'Index';
                        setTimeout(function () {
                            //window.location.href = url; //will redirect to your blog page (an ex: blog.html)
                            window.location.href = abp.appPath + 'RFQ/Edit?id=' + res.rfq.id;
                        }, 2000);
                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });
                }
            }
        );
    }

    $('#SaveRfqButton').click(function (e) {
        e.preventDefault();
        saveRfq();
    });
    $("#Color").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);
        return isValid(character);
    });
    $("#Color").keyup(function (event) {
        this.value = this.value.substr(0, 1).toUpperCase() + this.value.substr(1).toLowerCase();
    });
    $("#GroupName").keyup(function (event) {
        this.value = this.value.substr(0, 1).toUpperCase() + this.value.substr(1).toLowerCase();
    });
        
    function isValid(str) {
        return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);

    }

    $("#EColor").keypress(function (event) {

        var character = String.fromCharCode(event.keyCode);
        return isValid(character);
    });
    $("#EColor").keyup(function (event) {
        this.value = this.value.substr(0, 1).toUpperCase() + this.value.substr(1).toLowerCase();
    });

    $('#Others').keyup(updateCount);
    $('#Others').keydown(updateCount);
    function updateCount() {
        var cs = $(this).val().length;
        $('#characters').text(cs);
    }
})(jQuery);