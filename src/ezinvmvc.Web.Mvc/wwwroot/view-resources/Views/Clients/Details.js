$('#datetimepicker1').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker2').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker3').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker4').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker5').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker6').datetimepicker({
    format: 'L',
    focusOnShow: true
});
$('#datetimepicker7').datetimepicker({
    format: 'L',
    focusOnShow: true
});
var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
var mdayone = "01/01/" + new Date().getFullYear();
$("#LeadDateFrom").val(mdayone);
$("#RfqDateFrom").val(mdayone);
$("#QTDateFrom").val(mdayone);
$("#SODateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
//Save Button
(function ($) {

    var _clientService = abp.services.app.clientService;
    var _cpersonService = abp.services.app.contactPersonService;
    var _leadService = abp.services.app.leadService;
    var _industryService = abp.services.app.industryService;
    var _commonService = abp.services.app.commonService;
    var _countryService = abp.services.app.countryService;
    var _provinceService = abp.services.app.provinceService;
    var _leadSourceService = abp.services.app.leadSourceService;
    var _leadTaskService = abp.services.app.leadTaskService;
    var _rfqService = abp.services.app.rFQService;
    var _quotationService = abp.services.app.quotationService;
    var _aeService = abp.services.app.accountExecutiveService;
    var _addressService = abp.services.app.addressService;
    var _employeeService = abp.services.app.employeeService;

    function getaes() {
        var aes1 = $('#AEs1');
        var aes2 = $('#AEs2');
        var aes3 = $('#AEs3');
        var aes4 = $('#AEs4');
        aes1.empty();
        aes2.empty();
        aes3.empty();
        aes4.empty();
        var empid = $('#h1').val();
        //if (empid === '-1') {
        //    empid = '';
        //}
        aes1.append('<option value="" selected disabled>Account Executives</option>');
        aes2.append('<option value="" selected disabled>Account Executives</option>');
        aes3.append('<option value="" selected disabled>Account Executives</option>');
        aes4.append('<option value="" selected disabled>Account Executives</option>');
        _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                aes1.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                aes2.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                aes3.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                aes4.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
            }
            aes1.selectpicker('refresh');
            aes2.selectpicker('refresh');
            aes3.selectpicker('refresh');
            aes4.selectpicker('refresh');
        });
    }

    getaes();

    function gettaxtype() {
        var taxtypes = $('#VATTypeId');
        var htax = $("#hVATTypeId").val();
        taxtypes.empty();
        //taxtypes.append('<option value = 0 >-- Select --</option > ');
        _commonService.getTaxTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (htax == result.items[i].id) {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                }
                else {
                    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                }
            }
            taxtypes.selectpicker('refresh');
        });
    }

    function getindustry() {
        var industries = $('#IndustryId');
        var hindstry = $("#hIndustryId").val();
        industries.empty();
        //taxtypes.append('<option value = 0 >-- Select --</option > ');
        _industryService.getIndustries().done(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (hindstry == result[i].id) {
                    industries.append('<option value=' + result[i].id + ' selected>' + result[i].name + '</option>');
                }
                else {
                    industries.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
                }
            }
            industries.selectpicker('refresh');
        });
    }

    function getcountry() {
        var countries = $('#lbCountries');
        var hcntry = $("#hCountryId").val();
        countries.empty();
        countries.append('<option value = 0 >-- Select --</option > ');
        _countryService.getCountrys().done(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (hcntry == result[i].id) {
                    countries.append('<option value=' + result[i].id + ' selected>' + result[i].name + '</option>');
                }
                else {
                    countries.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
                }
            }
            countries.selectpicker('refresh');
        });
    }

    function getprovince() {
        var provinces = $('#lbProvinces');
        var hcntry = $('#hCountryId').val();
        var hprov = $("#hProvinceId").val();
        provinces.empty();
        provinces.append('<option value = 0 >-- Select --</option > ');
        _countryService.getProvinces({ id: hcntry }).done(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (hprov == result[i].id) {
                    provinces.append('<option value=' + result[i].id + ' selected>' + result[i].name + '</option>');
                }
                else {
                    provinces.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
                }
            }
            provinces.selectpicker('refresh');
        });
    }

    function getcity() {
        var cities = $('#lbCities');
        var hprov = $('#hProvinceId').val();
        var hcity = $("#hCityId").val();
        cities.empty();
        cities.append('<option value = 0 >-- Select --</option > ');
        _provinceService.getCities({ id: hprov }).done(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (hcity == result[i].id) {
                    cities.append('<option value=' + result[i].id + ' selected>' + result[i].name + '</option>');
                }
                else {
                    cities.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
                }
            }
            cities.selectpicker('refresh');
        });
    }

    function getsources() {
        var sources = $('#LeadSources');
        sources.empty();
        _leadSourceService.getLeadSources().done(function (result) {
            for (var i = 0; i < result.length; i++) {
                sources.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
            }
            sources.selectpicker('refresh');
        });
    }

    function gettasks() {
        var tasks = $('#LeadTasks');
        tasks.empty();
        _leadTaskService.getLeadTasks().done(function (result) {
            for (var i = 0; i < result.length; i++) {
                tasks.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
            }
            tasks.selectpicker('refresh');
        });
    }

    //Contact Person
    $('#CreateContactPersonButton').click(function (e) {
        $id = $("#ClientId").val();
        console.log($id);
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

    var _$addresstable = $('#AddressTable');

    var addressDataTable = _$addresstable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _addressService.getAddresses,
            inputFilter: function () {
                var $c = $('#ClientId').val();
                var $r = 'Client';
                var $s = $('#CPSearchFilter').val();
                return {
                    filter : $c + '|' + $r
                };
            }
        },
        columnDefs: [
            {
                visible: false,
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                targets: 1,
                data: "creationTime",
                render: function (data) {
                    var tt = new Date(data);
                    var ret = getFormattedDateTime(tt);
                    return ret;
                }
            },
            {
                targets: 2,
                data: "completeAddress"
            }
        ]
    });

    function addressGetAll() {
        addressDataTable.ajax.reload();
    }

    var _$aetable = $('#AgentsTable');

    var aeDataTable = _$aetable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _aeService.getAccountExecutives,
            inputFilter: function () {
                var $c = $('#ClientId').val();
                var $r = 'Client';
                var $s = $('#CPSearchFilter').val();
                return {
                    filter: $c + '|' + $r
                };
            }
        },
        columnDefs: [
            {
                visible: false,
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                targets: 1,
                data: "creationTime",
                render: function (data) {
                    var tt = new Date(data);
                    var ret = getFormattedDate(tt);
                    return ret;
                }
            },
            {
                targets: 2,
                data: "employeeName"
            }
        ]
    });

    function aeGetAll() {
        aeDataTable.ajax.reload();
    }

    var _$cptable = $('#ContactPersonsTable');

    var cpDataTable = _$cptable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _cpersonService.getContactPersonsFiltered,
            inputFilter: function () {
                var $c = $('#ClientId').val();
                var $r = 'Client';
                var $s = $('#CPSearchFilter').val();
                var $ae = $('#h1').val();
                return {
                    id: 0,
                    reference: $r,
                    referenceId: $c,
                    filter: $s + '|' + $ae
                };
            }
        },
        columnDefs: [
            {
                className: 'control responsive',
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                targets: 1,
                data: "fullName"
            },
            {
                targets: 2,
                data: "position"
            }
            ,
            {
                targets: 3,
                data: "telNo"
            },
            {
                targets: 4,
                data: "mobileNo"
            },
            {
                targets: 5,
                data: "email"
            },
            {
                targets: 6,
                data: "birthday",
                render: function (data) {
                    var tt = new Date(data);
                    var ret = getFormattedDate(tt);
                    if (ret === "01/01/1900") {
                        return 'n/a';
                    }
                    else {
                        return ret;
                    }
                }
            },
            {
                orderable: false,
                targets: 7,
                class: "text-center",
                data: { id: "id", name: "name" },
                "render": function (data) {
                    //return '<a id="edit-cperson" title="edit" href="#" class="edit-cperson" data-cperson-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-cperson" title="delete" href="#" class="delete-cperson" data-cperson-id="' + data.id + '" data-cperson-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                    var edit = '<a id="edit-cperson" title="edit" href="#" class="edit-cperson" data-cperson-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                    var del = '<a id="delete-cperson" title="delete" href="#" class="delete-cperson" data-cperson-id="' + data.id + '" data-cperson-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    if (abp.auth.isGranted("Client.ContactPerson.Edit")) {
                        ret += edit;
                    }
                    if (abp.auth.isGranted("Client.ContactPerson.Delete")) {
                        ret += (ret.trim().length > 0 ? '|' + del : del);
                    }
                    return ret;
                }
            }
        ]
    });

    function cpGetAll() {
        cpDataTable.ajax.reload();
    }

    $('#CPSearchButton').click(function (e) {
        e.preventDefault();
        cpGetAll();
    });

    $('#CPSearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        cpGetAll();
    });

    //Edit contact person
    _$cptable.on('click', 'a.edit-cperson', function (e) {
        var id = $(this).attr("data-cperson-id");
        var cname = $('#ClientName').val();
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'ContactPersons/EditContactPersonModal?id=' + id + '&refname=' + cname,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#ContactPersonEditModal').modal('show');
                $('#ContactPersonEditModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    // Delete contact person
    _$cptable.on('click', 'a.delete-cperson', function (e) {
        var id = $(this).attr("data-cperson-id");
        var name = $(this).attr("data-cperson-name");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteContactPersonConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    _cpersonService.deleteContactPerson({
                        id: id
                    }).done(function () {
                        cpGetAll();
                    });
                }
            }
        );
    });

    $("#ContactPersonEditModal").on('hidden.bs.modal', function () {
        cpGetAll();
    });

    $("#ContactPersonCreateModal").on('hidden.bs.modal', function () {
        cpGetAll();
    });

    //Leads

    var _$ldtable = $('#LeadsTable');

    var ldDataTable = _$ldtable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _leadService.getLeads,
            inputFilter: function () {
                var $clientproj = $('#LeadSearchFilter').val();
                var $source = $('#LeadSources').val();
                var $task = $('#LeadTasks').val();
                var $datefrom = $('#LeadDateFrom').val();
                var $dateto = $('#LeadDateTo').val();
                var $ae = $('#h1').val();
                if ($clientproj === '') {
                    $clientproj = 'null';
                }
                var $clientid = $('#ClientId').val();
                var $aefilter = $('#AEs1').val();
                return {
                    filter: $clientproj + '|' + $source + '|' + $task + '|' + $datefrom + '|' + $dateto + '|' + $clientid + '|null|' + $ae + '|' + $aefilter 
                };
            }
        },
        columnDefs: [
            {
                className: 'control responsive',
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                targets: 1,
                data: "code"
            },
            {
                targets: 2,
                data: "leadDate",
                render: function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            },
            {
                targets: 3,
                data: "project"
            },
            {
                targets: 4,
                data: "uLeadTask"
            },
            {
                targets: 5,
                data: "uNextContactDateTime",
                render: function (data) {
                    var tt = new Date(data);
                    return getFormattedDateTime(tt);
                }
            },
            {
                targets: 6,
                data: { status: "status", statusid: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-danger">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                orderable: false,
                targets: 7,
                class: "text-center",
                data: { id: "id", name: "name", statusId: "statusId" },
                "render": function (data) {
                    //return '<a id="update-lead" title="update" href="#" class="update-lead" data-lead-id="' + data.id + '" data-ulead-id="' + data.uLeadUpdateId + '" data-toggle="modal" data-target="#LeadUpdateCreateModal"><i class="fa fa-plus-square-o"></i></a>|<a id="edit-lead" title="edit" href="#" class="edit-lead" data-lead-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-lead" title="delete" href="#" class="delete-lead" data-lead-id="' + data.id + '" data-lead-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    var buttons = '<a id="edit-lead" title="edit" href="#" class="edit-lead" data-lead-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>'; //|<a id="delete-lead" title="delete" href="#" class="delete-lead" data-lead-id="' + data.id + '" data-lead-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                    if (abp.auth.isGranted("CRM.Leads.Edit")) {
                        ret = buttons;
                    }
                    if (data.statusId.toString() === '2') {
                        if (abp.auth.isGranted('CRM.Leads.Updates')) {
                            //buttons = '<a id="update-lead" title="update" href="#" class="update-lead" data-lead-id="' + data.id + '" data-ulead-id="' + data.uLeadUpdateId + '" data-toggle="modal" data-target="#LeadUpdateCreateModal"><i class="fa fa-plus-square-o"></i></a>|' + buttons;
                            ret = '<a id="update-lead" title="update" href="#" class="update-lead" data-lead-id="' + data.id + '" data-ulead-id="' + data.uLeadUpdateId + '" data-toggle="modal" data-target="#LeadUpdateCreateModal"><i class="fa fa-plus-square-o"></i></a>'; //|' + buttons;
                            if (abp.auth.isGranted("CRM.Leads.Edit")) {
                                ret += "|" + buttons;
                            }
                        }
                    }
                    //return buttons;
                    return ret;
                }
            }
        ]
    });

    function ldGetAll() {
        ldDataTable.ajax.reload();
    }

    $('#LeadSearchButton').click(function (e) {
        e.preventDefault();
        ldGetAll();
    });

    $('#LeadSearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        ldGetAll();
    });

    $("#LeadSources").change(function () {
        ldGetAll();
    });

    $("#LeadTasks").change(function () {
        ldGetAll();
    });

    _$ldtable.on('click', 'a.edit-lead', function (e) {
        e.preventDefault();
        var productId = $(this).attr("data-lead-id");
        window.location.href = abp.appPath + 'Leads/Edit?id=' + productId;
    });

    // Delete record
    _$ldtable.on('click', 'a.delete-lead', function (e) {
        var id = $(this).attr("data-lead-id");
        var name = $(this).attr("data-lead-name");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteLeadConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    _service.deleteClient({
                        id: id
                    }).done(function () {
                        getAll();
                    });
                }
            }
        );
    });

    _$ldtable.on('click', 'a.update-lead', function (e) {
        console.log("update lead");
        var id = $(this).attr("data-lead-id");
        var uid = $(this).attr("data-ulead-id");
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Leads/CreateLeadUpdateModal?id=' + id + '&uid=' + uid,
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#LeadUpdateCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    var _$rfqtable = $('#RfqTable');

    var rfqDataTable = _$rfqtable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _rfqService.getRFQs,
            inputFilter: function () {
                var $id = $('#RfqSearchFilter').val();
                var $code = '  ';
                var $datefrom = $('#RfqDateFrom').val();
                var $dateto = $('#RfqDateTo').val();
                var $statusid = $('#RfqStatusTypes').val();
                var $clientid = $('#ClientId').val();
                var $ae = $('#h1').val();
                var $aefilter = $('#AEs2').val();
                return {
                    filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid + '|' + $ae + '|' + $aefilter
                };
            }
        },
        columnDefs: [
            {
                className: 'control responsive',
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                orderData: 8,
                targets: 1,
                data: { code: "code", revisionNo: "revisionNo" },
                "render": function (data) {
                    return data.code + '-' + data.revisionNo;
                }
            },
            {
                targets: 2,
                data: "projectName"
            },
            {
                targets: 3,
                data: "transactionTime",
                render: function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            }
            ,
            {
                targets: 4,
                data: "contactPerson"
            },
            {
                targets: 5,
                data: "email"
            },
            {
                //targets: 6,
                //data: "status"
                orderData: 9,
                targets: 6,
                data: { status: "status", statusid: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-danger">' + data.status + '</span>';
                    }
                    else if (data.statusId === 4) {
                        return '<span class="badge badge-primary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 5) {
                        return '<span class="badge badge-info">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                orderable: false,
                targets: 7,
                class: "text-center",
                data: { id: "id", PROJECTNAME: "projectName", astatus: "astatus", status: "status", assignedid: "assignedid" },
                "render": function (data) {
                    var buttons = '<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>';//|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    //return '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" data-rfq-id="' + data.id + '" ><i class="fa fa-user"></i></a>|<a id="approve-rfq" title="approve" href="#" class="approve-rfq" data-rfq-id="' + data.id + '" data-toggle="modal" data-target="#ClientApproveModal" ><i class="fa fa-thumbs-up"></i></a>|<a id="revise-rfq" title="revise" href="#" class="revise-rfq" data-rfq-id="' + data.id + '" data-rfq-status="' + data.status + '"><i class="fa fa-refresh"></i></a>|<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                    //return '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" data-rfq-id="' + data.id + '" ><i class="fa fa-user"></i></a>|<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                    if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                        ret = buttons;
                    }
                    if (data.astatus === 0) {
                        if (abp.auth.isGranted('Pages.Rfq.Assign')) {
                            ret = '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" assign-rfq-id="' + data.id + '" assign-rfq-assignid="' + data.assignedid + '"  data-rfq-status="' + data.status + '"  ><i class="fa fa-user"></i></a>'; //|' + buttons;
                            if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                                ret += "|" + buttons;
                            }
                        }
                    }
                    //else {
                       
                    //}

                    return ret;
                }
            },
            {
                visible: false,
                targets: 8,
                data: "code"
            },
            {
                visible: false,
                targets: 9,
                data: "statusId"
            }
        ]
    });


    _$rfqtable.on('click', 'a.revise-rfq', function (e) {
        e.preventDefault();
        var rfqid = $(this).attr("data-rfq-id");
        var rfqstatus = $(this).attr("data-rfq-status");
        window.location.href = abp.appPath + 'RFQ/Revision?id=' + rfqid;

    });

    _$rfqtable.on('click', 'a.edit-rfq', function (e) {
        e.preventDefault();
        var rfqid = $(this).attr("data-rfq-id");
        var rfqstatus = $(this).attr("data-rfq-status");
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('EditRFQConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    if (rfqstatus == "Approved") {
                        abp.message.error('Status has been approved!', 'Failed');
                        return;
                    }
                    else {
                        window.location.href = abp.appPath + 'RFQ/Edit?id=' + rfqid;
                    }

                }
            }
        );
    });

    _$rfqtable.on('click', 'a.approve-rfq', function (e) {
        e.preventDefault();
        var rfqid = $(this).attr("data-rfq-id");
        getrfq(rfqid);
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('ApproveRFQConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    //_service.deleteRfqInput({
                    //    id: id
                    //    getrfq(id);
                    //}).done(function () {
                    //    getAll();
                    //});
                    approvedRfq();
                }
            }
        );
    });

    _$rfqtable.on('click', 'a.delete-rfq', function (e) {
        var id = $(this).attr("data-rfq-id");
        var name = $(this).attr("data-rfq-projectname");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteRFQConfirmation', 'ezinvmvc'), name),
            function (isConfirmed) {
                if (isConfirmed) {
                    _service.deleteRfqInput({
                        id: id
                    }).done(function () {
                        getAll();
                    });
                }
            }
        );
    });

    function rfqGetAll() {
        rfqDataTable.ajax.reload();
    }

    $('#RfqSearchButton').click(function (e) {
        e.preventDefault();
        rfqGetAll();
    });

    $('#RfqSearchButton').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        rfqGetAll();
    });

    var _$quotationsTable = $('#QuotationsTable');

    var qtDataTable = _$quotationsTable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _quotationService.getQuotations,
            inputFilter: function () {
                var $id = $('#QTSearchFilter').val();
                var $client = 'null';
                var $statusid = $('#QTStatusTypes').val();
                var $datefrom = $('#QTDateFrom').val();
                var $dateto = $('#QTDateTo').val();
                var $cid = $('#ClientId').val();
                var $ae = $('#h1').val();
                var $aefilter = $('#AEs3').val();
                if ($id === '') {
                    $id = 'null';
                }
                return {
                    filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + $cid + '|' + $ae + '|' + $aefilter
                };
            }
        },
        columnDefs: [
            {
                className: 'control responsive',
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                orderData: 8,
                targets: 1,
                data: { code: "code", revisionNo: "revisionNo" },
                "render": function (data) {
                    return data.code + '-' + data.revisionNo;
                }
            },
            {
                targets: 2,
                "data": "transactionTime",
                "render": function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            },
            {
                targets: 3,
                data: "agent"
            },
            {
                targets: 4,
                data: "grandTotal",
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right'
            },
            {
                orderData: 8,
                targets: 5,
                data: { status: "status", statusId: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-danger">' + data.status + '</span>';
                    }
                    else if (data.statusId === 4) {
                        return '<span class="badge badge-primary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 5) {
                        return '<span class="badge badge-info">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                orderable: false,
                targets: 6,
                class: "text-center",
                data: { id: "id", code: "code" },
                "render": function (data) {
                    //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var edit = '<a id="edit-quot" title="edit" href="#" class="edit-quot" data-quot-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                    //var del = '<a id="delete-quot" title="delete" href="#" class="delete-quot" data-order-id="' + data.id + '" data-quot-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    if (abp.auth.isGranted("Pages.Quotations.Edit")) {
                        ret += edit;
                    }
                    //if (abp.auth.isGranted("Master.Products.Delete")) {
                    //    ret += (ret.trim().length > 0 ? '|' + del : del);
                    //}
                    return ret;
                }
            },
            {
                visible: false,
                targets: 7,
                data: "code"
            },
            {
                visible: false,
                targets: 8,
                data: "statusId"
            }
        ]
    });

    // Edit record

    _$quotationsTable.on('click', 'a.edit-quot', function (e) {
        e.preventDefault();
        var orderId = $(this).attr("data-order-id");
        window.location.href = abp.appPath + 'Quotations/Edit?id=' + orderId;
    });

    // Delete record
    _$quotationsTable.on('click', 'a.delete-quot', function (e) {
        var productId = $(this).attr("data-quot-id");
        //var productName = $(this).attr("data-product-name");
        var productCode = $(this).attr("data-quot-code");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteProductConfirmation', 'ezinvmvc'), productName),
            function (isConfirmed) {
                if (isConfirmed) {
                    _productService.deleteProduct({
                        id: productId
                    }).done(function () {

                        $.ajax({
                            url: abp.appPath + 'Products/RemoveFile?code=' + productCode,
                            type: 'POST',
                            processData: false,
                            contentType: false,
                            success: function () { },
                            error: function (e) { }
                        });

                        getQuotations();
                    });
                }
            }
        );
    });

    function getQuotations() {
        qtDataTable.ajax.reload();
    }

    $('#QTSearchButton').click(function (e) {
        e.preventDefault();
        getQuotations();
    });

    $('#QTSearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        getQuotations();
    });

    $("#QTStatusTypes").change(function () {
        getQuotations();
    });

    var _$salesOrdersTable = $('#SalesOrdersTable');
    var _salesOrderService = abp.services.app.salesOrderService;

    var soDataTable = _$salesOrdersTable.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        searching: false,
        listAction: {
            ajaxFunction: _salesOrderService.getSalesOrders,
            inputFilter: function () {
                var $id = $('#SOSearchFilter').val();
                var $client = 'null';
                var $statusid = $('#SOStatusTypes').val();
                var $datefrom = $('#SODateFrom').val();
                var $dateto = $('#SODateTo').val();
                var $cid = $('#ClientId').val();
                var $ae = $('#h1').val();
                var $aefilter = $('#AEs4').val();
                if ($id === '') {
                    $id = 'null';
                }
                return {
                    filter: $id + '|' + $client + '|' + $statusid + '|' + $datefrom + '|' + $dateto + '|' + $cid + '|null|' + $ae + '|' + $aefilter
                };
            }
        },
        columnDefs: [
            {
                className: 'control responsive',
                orderable: false,
                render: function () {
                    return '';
                },
                targets: 0
            },
            {
                targets: 1,
                data: "code"
            },
            {
                targets: 2,
                data: "client"
            }
            ,
            {
                targets: 3,
                "data": "transactionTime",
                "render": function (data) {
                    var tt = new Date(data);
                    return getFormattedDate(tt);
                }
            },
            {
                targets: 4,
                "data": "deliveryTime",
                "render": function (data) {
                    var dt = new Date(data);
                    return getFormattedDate(dt);
                }
            },
            {
                targets: 5,
                data: { status: "status", statusId: "statusId" },
                "render": function (data) {
                    if (data.statusId === 1) {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                    else if (data.statusId === 2) {
                        return '<span class="badge badge-success">' + data.status + '</span>';
                    }
                    else if (data.statusId === 3) {
                        return '<span class="badge badge-primary">' + data.status + '</span>';
                    }
                    else {
                        return '<span class="badge badge-secondary">' + data.status + '</span>';
                    }
                }
            },
            {
                targets: 6,
                data: "grandTotal",
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right'
            },
            {
                orderable: false,
                targets: 7,
                class: "text-center",
                data: { id: "id", code: "code" },
                "render": function (data) {
                    //return '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var edit = '<a id="edit-order" title="edit" href="#" class="edit-order" data-order-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                    //var del = '<a id="delete-order" title="delete" href="#" class="delete-order" data-order-id="' + data.id + '" data-order-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                    var ret = '';
                    if (abp.auth.isGranted("Pages.Sales.Orders.Edit")) {
                        ret += edit;
                    }
                    //if (abp.auth.isGranted("Master.Products.Delete")) {
                    //    ret += (ret.trim().length > 0 ? '|' + del : del);
                    //}
                    return ret;
                }
            }
        ]
    });

    // Edit record

    _$salesOrdersTable.on('click', 'a.edit-order', function (e) {
        e.preventDefault();
        var orderId = $(this).attr("data-order-id");
        window.location.href = abp.appPath + 'SalesOrders/Edit?id=' + orderId;
    });

    // Delete record
    $('#ProductsTable').on('click', 'a.delete-product', function (e) {
        var productId = $(this).attr("data-product-id");
        var productName = $(this).attr("data-product-name");
        var productCode = $(this).attr("data-product-code");

        e.preventDefault();
        abp.message.confirm(
            abp.utils.formatString(abp.localization.localize('DeleteProductConfirmation', 'ezinvmvc'), productName),
            function (isConfirmed) {
                if (isConfirmed) {
                    _productService.deleteProduct({
                        id: productId
                    }).done(function () {

                        $.ajax({
                            url: abp.appPath + 'Products/RemoveFile?code=' + productCode,
                            type: 'POST',
                            processData: false,
                            contentType: false,
                            success: function () { },
                            error: function (e) { }
                        });

                        getSalesOrders();
                    });
                }
            }
        );
    });

    function getSalesOrders() {
        soDataTable.ajax.reload();
    }

    $('#SOSearchButton').click(function (e) {
        e.preventDefault();
        getSalesOrders();
    });

    $('#SOSearchFilter').on('keydown', function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        e.preventDefault();
        getSalesOrders();
    });

    function loadPage() {
        gettaxtype();
        getindustry();
        getcountry();
        getprovince();
        getcity();

        addressGetAll();
        aeGetAll();

        cpGetAll();

        getsources();
        gettasks();
        ldGetAll();

        rfqGetAll();

        getQuotations();

        getSalesOrders();
    }

    loadPage();
})(jQuery);