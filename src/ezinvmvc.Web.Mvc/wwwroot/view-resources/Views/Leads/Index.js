// Leads
$(".date-picker").datepicker("update", new Date());
var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
var mdayone = "01/01/" + new Date().getFullYear();
$("#DateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
(function () {
    $(function () {

        var _$table = $('#LeadsTable');
        var _$table2 = $('#LeadsTable2');
        var _service = abp.services.app.leadService;
        var _sourceService = abp.services.app.leadSourceService;
        var _taskService = abp.services.app.leadTaskService;
        var _employeeService = abp.services.app.employeeService;

        function getsources() {
            var companies = $('#Sources');
            companies.empty();
            companies.append('<option value="" selected disabled>Sources</option>');
            _sourceService.getLeadSources().done(function (result) {
                for (var i = 0; i < result.length; i++) {
                    companies.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
                }
                companies.selectpicker('refresh');
            });
        }

        function gettasks() {
            var companies = $('#Tasks');
            companies.empty();
            companies.append('<option value="" selected disabled>Tasks</option>');
            _taskService.getLeadTasks().done(function (result) {
                for (var i = 0; i < result.length; i++) {
                    companies.append('<option value=' + result[i].id + '>' + result[i].name + '</option>');
                }
                companies.selectpicker('refresh');
            });
        }

        function getaes() {
            var aes = $('#AEs');
            aes.empty();
            var empid = $('#h1').val();
            //if (empid === '-1') {
            //    empid = '';
            //}
            aes.append('<option value="" selected disabled>Account Executives</option>');
            _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    aes.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                }
                aes.selectpicker('refresh');
            });
        }

        getsources();
        gettasks();
        getaes();

        var _permissions = {
            create: abp.auth.hasPermission('CRM.Leads.Create'),
            edit: abp.auth.hasPermission('CRM.Leads.Edit'),
            'delete': abp.auth.hasPermission('CRM.Leads.Delete')
        };

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getLeads,
                inputFilter: function () {
                    //var $s = $('#SearchFilter').val();
                    //return {

                    //    filter: $s 
                    //};
                    //var $clientproj = $('#SearchFilter').val();
                    //var $source = $('#Sources').val();
                    //var $task = $('#Tasks').val();
                    //var $datefrom = $('#DateFrom').val();
                    //var $dateto = $('#DateTo').val();
                    //var $statusid = $('#StatusTypes').val();
                    //if ($clientproj === '') {
                    //    $clientproj = 'null';
                    //}
                    //return {
                    //    filter: $clientproj + '|' + $source + '|' + $task + '|' + $datefrom + '|' + $dateto + '|' + 'null' + '|' + $statusid
                    //};
                    var $clientproj = $('#SearchFilter').val();
                    var $source = $('#Sources').val();
                    var $task = $('#Tasks').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $statusid = $('#StatusTypes').val();
                    var $accountexecutive = 'null';
                    var $aefilter = $('#AEs').val();
                    console.log($aefilter);
                    //if (!abp.auth.isGranted("CRM.Leads.AllAccounts")) {
                        var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    //    console.log(empid);
                        $accountexecutive = empid;
                    //}
                    //else {
                    //    console.log($accountexecutive);
                    //}
                    if ($clientproj === '') {
                        $clientproj = 'null';
                    }
                    return {
                        filter: $clientproj + '|' + $source + '|' + $task + '|' + $datefrom + '|' + $dateto + '|' + 'null' + '|' + $statusid + '|' + $accountexecutive + '|' + $aefilter
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
                    orderData: 10,
                    targets: 1,
                    data: { id: "id", code: "code" },
                    render: function (data) {
                        return '<a id="view-lead" title="view" href="#" class="view-lead" data-lead-id="' + data.id + '" data-lead-code="' + data.code + '">' + data.code + '</i></a>'; 
                    }
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
                    data: "clientName",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
                },
                {
                    targets: 4,
                    data: "project",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                }
                ,
                {
                    targets: 5,
                    data: "leadSource"
                },
                {
                    targets: 6,
                    data: "uLeadTask",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                },
                {
                    targets: 7,
                    data: "uNextContactDateTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return "<div class='text-wrap width-100'>" + getFormattedDateTime(tt) + "</div>";
                    }
                },
                {
                    orderData: 11,
                    targets: 8,
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
                    targets: 9,
                    class: "text-center",
                    data: { id: "id", name: "name", statusId: "statusId"},
                    "render": function (data) {
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
                                    ret += " | " + buttons;
                                }
                            }
                        }
                        //return buttons;
                        return ret;
                    }
                },
                {
                    visible: false,
                    targets: 10,
                    data: "code"
                },
                {
                    visible: false,
                    targets: 11,
                    data: "statusId"
                }
            ]
        });

        var dataTable2 = _$table2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getLeads,
                inputFilter: function () {
                    //var $s = $('#SearchFilter').val();
                    //return {

                    //    filter: $s 
                    //};
                    //var $clientproj = $('#SearchFilter').val();
                    //var $source = $('#Sources').val();
                    //var $task = $('#Tasks').val();
                    //var $datefrom = $('#DateFrom').val();
                    //var $dateto = $('#DateTo').val();
                    //var $statusid = $('#StatusTypes').val();
                    //if ($clientproj === '') {
                    //    $clientproj = 'null';
                    //}
                    //return {
                    //    filter: $clientproj + '|' + $source + '|' + $task + '|' + $datefrom + '|' + $dateto + '|' + 'null' + '|' + $statusid
                    //};
                    var $clientproj = $('#SearchFilter').val();
                    var $source = $('#Sources').val();
                    var $task = $('#Tasks').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $statusid = $('#StatusTypes').val();
                    var $accountexecutive = 'null';
                    var $aefilter = $('#AEs').val();
                    console.log($aefilter);
                    //if (!abp.auth.isGranted("CRM.Leads.AllAccounts")) {
                    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    //    console.log(empid);
                    $accountexecutive = empid;
                    //}
                    //else {
                    //    console.log($accountexecutive);
                    //}
                    if ($clientproj === '') {
                        $clientproj = 'null';
                    }
                    return {
                        filter: $clientproj + '|' + $source + '|' + $task + '|' + $datefrom + '|' + $dateto + '|' + 'null' + '|' + $statusid + '|' + $accountexecutive + '|' + $aefilter,
                        forExport: true
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
                    data: { id: "id", code: "code" },
                    render: function (data) {
                        return '<a id="view-lead" title="view" href="#" class="view-lead" data-lead-id="' + data.id + '" data-lead-code="' + data.code + '">' + data.code + '</i></a>';
                    }
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
                    data: "clientName",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
                },
                {
                    targets: 4,
                    data: "project",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                }
                ,
                {
                    targets: 5,
                    data: "leadSource"
                },
                {
                    targets: 6,
                    data: "uLeadTask",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                },
                {
                    targets: 7,
                    data: "uNextContactDateTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return "<div class='text-wrap width-100'>" + getFormattedDateTime(tt) + "</div>";
                    }
                },
                {
                    targets: 8,
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
                }
            ]
        });
       
        function getAll() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getAll();
        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getAll();
        });

        $("#Sources").change(function () {
            getAll();
        });

        $("#Tasks").change(function () {
            getAll();
        });

        $("#StatusTypes").change(function () {
            getAll();
        });

        $('#SearchFilter').focus();

        // View record
        _$table.on('click', 'a.view-lead', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-lead-id");
            window.location.href = abp.appPath + 'Leads/Details?id=' + clientId;
        });

        // Edit record
        _$table.on('click', 'a.edit-lead', function (e) {
            e.preventDefault();
            var productId = $(this).attr("data-lead-id");
            window.location.href = abp.appPath + 'Leads/Edit?id=' + productId;
        });

        // Delete record
        _$table.on('click', 'a.delete-lead', function (e) {
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

        _$table.on('click', 'a.update-lead', function (e) {
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

        $("#LeadUpdateCreateModal").on('hidden.bs.modal', function () {
            getAll();
        });

        var _userId = abp.session.userId;

        function getUserEmployee(userid) {
            var empId = "";
            _employeeService.getEmployees({ filter: "UserId|" + userid }).done(function (result) {
                if (result.items.length > 0) {
                    console.log('gotemployee');
                    $("#AssignedToId").val(result.items[0].id);
                    empId = result.items[0].id;
                    $("#AssignedTo").val(result.items[0].completeName);
                    $("#AssignedToEmail").val(result.items[0].email);
                }
            });
            console.log(empId);
            return empId;
        };

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('LeadsTable2', 'Leads', 'Leads.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) {
                    return window.btoa(decodeURIComponent(encodeURIComponent(s.replace(/[\u00A0-\u2666]/g, function (c) {
                        return '&#' + c.charCodeAt(0) + ';';
                    }).replace(/[\u{0080}-\u{FFFF}]/gu, ""))))
                }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

        //function loadPage() {
        //    getUserEmployee(_userId);
        //}

        //loadPage();
    });
})();