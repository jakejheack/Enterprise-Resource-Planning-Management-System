// Rfq
//$('#datetimepicker3').datetimepicker({
//    format: 'L',
//    focusOnShow: true
//});
//var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
//$('#DateFrom').val(mdayone);
//$('#datetimepicker4').datetimepicker({
//    format: 'L',
//    focusOnShow: true
//});
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

        var _$table = $('#RfqTable');
        var _$table2 = $('#RfqTable2');
        var _service = abp.services.app.rFQService
        var _employeeService = abp.services.app.employeeService;
        var _tasksService = abp.services.app.tasksService;

        //var _$assignform = $('form[name=assignCreateForm]');
        var _$form = $('form[name=RfqForm]');
        var _$itemsTable = $('#ItemsTable');
        var _$itemsTableDeleted = $('#ItemsTableDeleted');
        var _$assignedTable = $('#AssignedTable');



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

        getaes();

        //Employee Autocomplete
        //var getemployees = function (request, response) {
        //    _employeeService.getEmployees({ filter: "CompleteName|" + request.term }).done(function (result) {
        //        response($.map(result.items, function (el) {
        //            return {
        //                label: el.completeName,
        //                value: el.id
        //            };
        //        }));
        //    });
        //};

        //function messageAlert() {
        //    if (ViewBag.Message != null) {
        //        window.onload = function () {
        //            alert("@ViewBag.Message");
        //        };
        //    }
        //}

        //messageAlert();

        var getemployees = function (request, response) {
            _employeeService.getAllSalescordinator({ filter: "CompleteName|" + request.term }).done(function (result) {
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

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getRFQs,
                inputFilter: function () {
                    //var $s = $('#SearchFilter').val();
                    //return {
                    //    filter: $s
                    //};
                    var $id = $('#SearchFilter').val();
                    var $code = '  ';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $statusid = $('#StatusTypes').val();
                    var $clientid = '  ';
                    var $accountexecutive = 'null';
                    //if (!abp.auth.isGranted("Pages.Rfq.AllAccounts")) {
                        var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    //    console.log(empid);
                        $accountexecutive = empid;
                    //}
                    //else {
                        console.log($accountexecutive);
                    //}
                    var $aefilter = $('#AEs').val();
                    return {
                        filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid + '|' + $accountexecutive + '|' + $aefilter
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
                    orderData: 9,
                    targets: 1,
                    data: { id: "id", code: "code", revisionNo: "revisionNo" },
                    "render": function (data) {
                        return '<a id="view-rfq" title="view" href="#" class="view-rfq" data-rfq-id="' + data.id + '" data-rfq-code="' + data.code + '-' + data.revisionNo + '">' + data.code + '-' + data.revisionNo + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "clientName",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
                },
                {
                    targets: 3,
                    data: "projectName",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                },
                {
                    targets: 4,
                    data: "transactionTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 5,
                    data: "contactPerson"
                },
                {
                    targets: 6,
                    data: "accountExecutive",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                },
                {
                    //targets: 6,
                    //data: "status"
                    orderData: 10,
                    targets: 7,
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
                    targets: 8,
                    class: "text-center",
                    data: { id: "id", PROJECTNAME: "projectName", astatus: "astatus", status: "status", assignedid: "assignedid", code: "code" },
                    "render": function (data) {
                        var buttons = '<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>'; //|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        //return '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" data-rfq-id="' + data.id + '" ><i class="fa fa-user"></i></a>|<a id="approve-rfq" title="approve" href="#" class="approve-rfq" data-rfq-id="' + data.id + '" data-toggle="modal" data-target="#ClientApproveModal" ><i class="fa fa-thumbs-up"></i></a>|<a id="revise-rfq" title="revise" href="#" class="revise-rfq" data-rfq-id="' + data.id + '" data-rfq-status="' + data.status + '"><i class="fa fa-refresh"></i></a>|<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                        //return '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" data-rfq-id="' + data.id + '" ><i class="fa fa-user"></i></a>|<a id="edit-rfq" title="edit" href="#" class="edit-rfq" data-rfq-id="' + data.id + '"  data-rfq-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" data-rfq-projectName="' + data.projectname + '"><i class="fa fa-trash"></i></a>';
                        if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                            ret = buttons;
                        }
                        console.log(data.astatus);
                        if (data.astatus === 0) {
                            if (abp.auth.isGranted('Pages.Rfq.Assign')) {
                                ret = '<a id="assign-rfq" title="assign" href="#" class="assign-rfq" assign-rfq-id="' + data.id + '"assign-rfq-code="' + data.code + '" assign-rfq-assignid="' + data.assignedid + '"  data-rfq-status="' + data.status + '"  ><i class="fa fa-user"></i></a>'; //|' + buttons;
                                if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                                    ret += " | " + buttons;
                                }
                            }
                        }
                        //else {
                        //    if (abp.auth.isGranted('Pages.Rfq.Edit')) {
                        //        ret = buttons;
                        //    }
                        //}

                        return ret;
                    }
                },
                {
                    visible: false,
                    targets: 9,
                    data: "code"
                },
                {
                    visible: false,
                    targets: 10,
                    data: "statusId"
                }
                ,
                {
                    visible: false,
                    targets: 11,
                    data: "assignedid"
                }
            ]
        });

        var dataTable2 = _$table2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getRFQs,
                inputFilter: function () {
                    //var $s = $('#SearchFilter').val();
                    //return {
                    //    filter: $s
                    //};
                    var $id = $('#SearchFilter').val();
                    var $code = '  ';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $statusid = $('#StatusTypes').val();
                    var $clientid = '  ';
                    var $accountexecutive = 'null';
                    //if (!abp.auth.isGranted("Pages.Rfq.AllAccounts")) {
                    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    //    console.log(empid);
                    $accountexecutive = empid;
                    //}
                    //else {
                    console.log($accountexecutive);
                    //}
                    var $aefilter = $('#AEs').val();
                    return {
                        filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid + '|' + $accountexecutive + '|' + $aefilter,
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
                    data: { id: "id", code: "code", revisionNo: "revisionNo" },
                    "render": function (data) {
                        return '<a id="view-rfq" title="view" href="#" class="view-rfq" data-rfq-id="' + data.id + '" data-rfq-code="' + data.code + '-' + data.revisionNo + '">' + data.code + '-' + data.revisionNo + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "clientName",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
                },
                {
                    targets: 3,
                    data: "projectName",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                },
                {
                    targets: 4,
                    data: "transactionTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 5,
                    data: "contactPerson"
                },
                {
                    targets: 6,
                    data: "accountExecutive",
                    render: function (data) {
                        return "<div class='text-wrap width-100'>" + data + "</div>";
                    }
                },
                {
                    //targets: 6,
                    //data: "status"
                    targets: 7,
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
                }
            ]
        });

        var dataTableAssigned = _$assignedTable.DataTable({
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
            },
            {
                orderable: false,
                //targets: [0, 1, 2, [3, 4, 5, 6]
                //MARC --3 NA YUNG ACTION COLUMN
                //targets: [0, 1, 2, 6]
                targets: [0, 1, 2, 3]
            },
            //MARC --WALA KA NA PRICES
            //{
            //    render: $.fn.dataTable.render.number(',', '.', 2),
            //    className: 'text-right',
            //    targets: [3, 4, 5]
            //},
            {
                "visible": false,
                className: 'text-center',
                targets: [2]
            },
            {
                //orderable: false,
                //targets: 3,
                //class: "text-center",
                //data: null,
                ////data: { id: "i" },
                //"render": function (data) {
                //    //return '<a id="edit-assign" title="edit" href="#" class="edit-assign" data-assign-id="' + data.Id + '"  data-assign-name="' + data.name + '"  data-assign-email="' + data.email + '" ><i class="fa fa-pencil-square-o"></i></a>';
                //    return '<a id="edit-assign" title="edit" href="#" class="edit-assign" ><i class="fa fa-pencil-square-o"></i></a>';
                //}

            },
            {
                "visible": false,
                className: 'text-center',
                targets: [4]
            },
            ]
        });

        function getAssignedPerson(id) {

            //abp.ui.clearBusy(_$form);
            //_$assignedTable.dataTableAssigned().rows().remove().draw(false);
            _tasksService.getTaskByParentId({ id: id }).done(function (result) {

                if (result.items.length > 0) {
                    for (var i = 0; i < result.items.length; i++) {
                        var $id = result.items[i].employeeId;
                        var $name = result.items[i].name;
                        var $email = result.items[i].email;
                        //alert($id);
                        //var $name = result.name;
                        //var $email = result.email;
                        //alert($id);

                        var datacount = dataTableAssigned.rows().count();
                        var itemno = datacount + 1;
                        var assignid = $("#hassignid").val();
                        //alert(assignid);
                        dataTableAssigned.row.add([itemno,
                            '<a href="#" class="text-muted">' + $name + '</a><br />',
                            '<label class="text-muted">' + $email + '</label>',
                            '<a id="edit-assign" title="edit" href="#" class="edit-assign" data-assignedit-id="' + assignid + '" data-employee-id="' + $id + '"  data-employee-name="' + $name + '"  data-assign-email="' + $email + '"><i class="fa fa-pencil-square-o"></i></a>'
                            , $id
                        ]).draw();
                    }

                    $('#div2').hide();
                    $('#div1').show();
                    $('#btnassign').hide();
                    $('#btnupdate').show();
                }
                else {
                    $('#div2').show();
                    $('#div1').hide();
                    $('#btnupdate').hide();
                    $('#btnassign').show();
                }

            });

            $('#AssignedCreateModal').modal('show');
        };

        // View record
        _$table.on('click', 'a.view-rfq', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-rfq-id");
            window.location.href = abp.appPath + 'RFQ/Details?id=' + clientId;
        });

        _$table.on('click', 'a.revise-rfq', function (e) {
            e.preventDefault();
            var rfqid = $(this).attr("data-rfq-id");
            var rfqstatus = $(this).attr("data-rfq-status");
            window.location.href = abp.appPath + 'RFQ/Revision?id=' + rfqid;
            //abp.message.confirm(
            //    abp.utils.formatString(abp.localization.localize('ReviviseRFQConfirmation', 'ezinvmvc'), name),
            //    function (isConfirmed) {
            //        if (isConfirmed) {
            //            if (rfqstatus == "For Approval") {
            //                abp.message.error(rfqstatus + ' !', 'Failed');
            //                return;
            //            }
            //            else {
            //                window.location.href = abp.appPath + 'RFQ/Revision?id=' + rfqid;
            //            }
            //            //_service.deleteRfqInput({
            //            //    id: id
            //            //    getrfq(id);
            //            //}).done(function () {
            //            //    getAll();
            //            //});
            //            //
            //        }
            //    }
            //);

        });

        _$table.on('click', 'a.edit-rfq', function (e) {
            e.preventDefault();
            var rfqid = $(this).attr("data-rfq-id");
            var rfqstatus = $(this).attr("data-rfq-status");
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('EditRFQConfirmation', 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        if (rfqstatus === "Approved") {
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

        _$table.on('click', 'a.approve-rfq', function (e) {
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

        $('#RfqTable').on('click', 'a.delete-rfq', function (e) {
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

        _$table.on('click', 'a.assign-rfq', function (e) {
            e.preventDefault();
            var id = $(this).attr("assign-rfq-id");
            var code = $(this).attr("assign-rfq-code");
            var assignid = $(this).attr("assign-rfq-assignid");
            $('#Id').val(id);
            $('#Code').val(code);
            $('#hassignid').val(assignid);
            //getAllassign();
            //alert('assignedid:' + assignid);
            getAssignedPerson(id);



        });

        _$assignedTable.on('click', 'a.edit-assign', function (e) {
            e.preventDefault();
            var _employeeid = $(this).attr("data-employee-id");
            var _employeeName = $(this).attr("data-employee-Name");
            $("#AssignedToId").val(_employeeid)
            $("#AssignedTo").val(_employeeName)
            //$('#Id').val(id);
            ////getAllassign();
            //getAssignedPerson(id);
            //var assignid = $("#hassignid").val();
            //alert(_employeeid);
            getemployee();
            $('#div2').show();

        });



        $('#btnassign').click(function (e) {
            e.preventDefault();
            assign();


        });

        function assign() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();


            // var assignedToId = $("#AssignedToId").val();
            //var assignedTo = $("#AssignedTo").val();
            //var assignedToEmail = $("#AssignedToEmail").val();

            var viewData = {
                tasks: {
                    "referenceTransactionCode": '106',
                    "referenceId": '7',
                    "transactionCode": formdata.Id,
                    "employeeId": formdata.AssignedToId,
                    "name": formdata.AssignedTo,
                    "email": formdata.AssignedToEmail,
                    "status": '0',
                    "code" : formdata.Code
                }
            };
            disabled.attr('disabled', 'disabled');

            //var tasks = JSON.stringify(viewData);
            abp.message.confirm(
                'RFQ will be assigned.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _tasksService.createTasks(viewData).done(function (res) {
                            abp.notify.success('RFQ has been successfully assigned!', 'Success');
                            if (res.notifs.length > 0) {
                                for (var i = 0; i < res.notifs.length; i++) {
                                    if (res.notifs[i].id > 0) {
                                        srConnection.invoke('sendNotification', res.tasks.code, res.tasks.id, res.notifs[i].userIds, abp.session.userId, '', res.notifs[i].message); // Send a message to the server
                                    }
                                }
                            }
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            $('#AssignedCreateModal').modal('hide');
                            //getAllassign();
                            dataTableAssigned.ajax.reload();
                            dataTableAssigned.clear().draw();
                            clearassigne();
                            location.reload(true);
                        });
                    }
                }
            );
        }


        $('#btnupdate').click(function (e) {
            e.preventDefault();
            assignupdate();


        });
        function assignupdate() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var assignid = $("#hassignid").val();
            // var assignedToId = $("#AssignedToId").val();
            //var assignedTo = $("#AssignedTo").val();
            //var assignedToEmail = $("#AssignedToEmail").val();
            //alert(assignid);
            var viewData = {
                tasks: {
                    "id": assignid,
                    "referenceTransactionCode": '106',
                    "referenceId": '7',
                    "transactionCode": formdata.Id,
                    "employeeId": formdata.AssignedToId,
                    "name": formdata.AssignedTo,
                    "email": formdata.AssignedToEmail,
                    "status": '0',
                    "code": formdata.Code
                }
            };
            disabled.attr('disabled', 'disabled');

            //var tasks = JSON.stringify(viewData);
            abp.message.confirm(
                'RFQ will be assigned.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _tasksService.updateTasks(viewData).done(function (res) {
                            abp.notify.success('Assign has been successfully updated!', 'Success');
                            for (var i = 0; i < res.notifs.length; i++) {
                                srConnection.invoke('sendNotification', res.tasks.code, res.tasks.id, res.notifs[i].userIds, abp.session.userId, '', res.notifs[i].message); // Send a message to the server
                            }
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            $('#AssignedCreateModal').modal('hide');
                            //getAllassign();
                            dataTableAssigned.ajax.reload();
                            dataTableAssigned.clear().draw();
                            clearassigne();
                            location.reload(true);
                        });
                    }
                }
            );
        }

        //function assign() {
        //    if (!_$form.valid()) {
        //        return;
        //    }

        //    var assignedToId = $("#AssignedToId").val();
        //    var assignedTo = $("#AssignedTo").val();
        //    var assignedToEmail = $("#AssignedToEmail").val();

        //    tasks.assignedToId = assignedToId;
        //    tasks.assignedTo = assignedTo;
        //    tasks.assignedToEmail = assignedToEmail;


        //    var tasks = _$form.serializeFormToObject();

        //    abp.message.confirm(
        //        'RFQ will be assigned.',
        //        'Are you sure?',
        //        function (isConfirmed) {
        //            if (isConfirmed) {
        //                abp.ui.setBusy(_$form);
        //                _tasksService.createTasks(tasks).done(function () {
        //                    abp.message.success('RFQ has been successfully assinged!', 'Success');
        //                }).always(function () {
        //                    abp.ui.clearBusy(_$form);
        //                });
        //            }
        //        }
        //    );
        //}



        //function approvedRfq() {
        //    if (!_$form.valid()) {
        //        return;
        //    }
        //    var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        //    var formdata = _$form.serializeFormToObject();
        //    //var $updatedsoid = $('#Id').val();
        //    var viewData = {
        //        rfq: {
        //            "id": formdata.Id,
        //            "companyId": formdata.CompanyId,
        //            "seriesTypeId": formdata.SeriesTypeId,
        //            "prefix": formdata.Prefix,
        //            "code": formdata.Code,
        //            "type": formdata.Type,
        //            "leadId": formdata.LeadId,
        //            "lead": formdata.Lead,
        //            "clientId": formdata.ClientId,
        //            "client": formdata.ClientName,
        //            "projectName": formdata.ProjectName,
        //            "contactPersonId": formdata.ContactPersonId,
        //            "contactPerson": formdata.ContactPerson,
        //            "telNo": formdata.Telno,
        //            "phone": formdata.Phone,
        //            "email": formdata.Email,
        //            "address": formdata.Address,
        //            "deliveryAddress": formdata.DeliveryAddress,
        //            "discount": formdata.Discount,
        //            "vat": formdata.Vat,
        //            "status": "Approved"
        //        }
        //    };
        //    disabled.attr('disabled', 'disabled');

        //    abp.ui.setBusy(_$form);
        //    _service.approvedRfq(viewData).done(function () {
        //        abp.message.success('RFQ has been approved!', 'Success');
        //        getAll();
        //        //var url = 'Index';
        //        //setTimeout(function () {
        //        //    window.location.href = url; //will redirect to your blog page (an ex: blog.html)
        //        //}, 2000);
        //    }).always(function () {
        //        abp.ui.clearBusy(_$form);
        //    });
        //}

        //$('#RfqTable').on('click', 'a.approve-rfq', function (e) {
        //    var id = $(this).attr("data-rfq-id");
        //    var name = $(this).attr("data-rfq-projectname");

        //    e.preventDefault();
        //    abp.message.confirm(
        //        abp.utils.formatString(abp.localization.localize('ApproveRFQConfirmation', 'ezinvmvc'), name),
        //        function (isConfirmed) {
        //            if (isConfirmed) {
        //                //_service.deleteRfqInput({
        //                //    id: id
        //                //    getrfq(id);
        //                //}).done(function () {
        //                //    getAll();
        //                //});
        //                getrfq(id);
        //            }
        //        }
        //    );
        //});

        //function getrfq(id) {
        // _service.getRFQ({ id: id }).done(function (result) {
        //        $('#Id').val(id);
        //        $('#Prefix').val(result.prefix);
        //        $('#Code').val(result.code);
        //        $('#Series').val(result.seriesTypeId);
        //        $('#CompanyId').val(result.companyId);
        //        $("#Type").val(result.type);
        //        $("#LeadId").val(result.leadId);
        //        $("#LeadCode").val(result.lead);
        //        $("#Lead").val(result.lead + ' - ' + result.client + ' - ' + result.projectName);
        //        $('#ClientId').val(result.clientId);
        //        $('#ClientName').val(result.client);
        //        $('#ProjectName').val(result.projectName);
        //        $('#ContactPersonId').val(result.contactPersonId);
        //        $('#ContactPerson').val(result.contactPerson);

        //        $('#Telno').val(result.telNo);
        //        $('#Phone').val(result.phone);
        //        $('#Email').val(result.email);
        //        $('#Address').val(result.address);
        //        $('#DeliveryAddress').val(result.deliveryAddress);
        //        $('#Discount').val(result.discount);
        //        $('#Vat').val(result.vat);

        //    });


        //};

        function clearassigne() {
            //$("#AssignedToId").val('');
            $("#AssignedTo").val('');
            $("#AssignedToEmail").val('');
        }

        function getAll() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }
        function getAllassign() {
            dataTableAssigne.ajax.reload();
            getAssignedPerson(id);
        }

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getAll();

        });

        $('#btncancel').click(function (e) {
            e.preventDefault();
            dataTableAssigned.clear().draw();
            clearassigne();
            //$('#AssignedTable').dataTableAssigned().reload();

        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getAll();
        });

        $('#SearchFilter').focus();

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('RfqTable2', 'Request For Quotation', 'RequestForQuotation.xls');
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



        // Save record
        //function save() {
        //    if (!_$form.valid()) {
        //        return;
        //    }
        //    var client = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        //    abp.ui.setBusy(_$modal);
        //    _service.createClient(client).done(function () {
        //        _$form.trigger("reset");
        //        _$modal.modal('hide');
        //        getAll();
        //    }).always(function () {
        //        abp.ui.clearBusy(_$modal);
        //    });
        //}

        //_$form.find('button[type="submit"]').click(function (e) {
        //    e.preventDefault();
        //    //save();
        //});

        //_$form.find('input').on('keypress', function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        //save();
        //    }
        //});

        //_$form.find('select').on('keypress', function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        //save();
        //    }
        //});
        //_$modal.on('shown.bs.modal', function () {
        //    _$form.find('input[type=text]:first').focus();
        //});

        //Edit record
        //_$table.on('click', 'a.edit-rfq', function (e) {
        //    var id = $(this).attr("data-rfq-id");

        //    e.preventDefault();
        //    $.ajax({
        //        url: abp.appPath + 'Clients/EditModal?id=' + id,
        //        type: 'POST',
        //        contentType: 'application/html',
        //        success: function (content) {
        //            //$('#ClientEditModal div.modal-content').html(content);
        //            $('select').selectpicker();
        //        },
        //        error: function (e) { }
        //    });
        //});



        // Delete record

        //_$table.on('click', 'a.delete-rfq', function (e) {



        //$('#ExportToExcelButton').click(function (e) {
        //    e.preventDefault();

        //    _service.getClientsToExcel({})
        //        .done(function (result) {
        //            app.downloadTempFile(result);
        //        });
        //});


        //$('#ExportButton').click(function () {
        //    _service
        //        .getClientsToExcel({})
        //        .done(function (result) {
        //            app.downloadTempFile(result);
        //        });
        //});





        //function saveRfq() {
        //    if (!_$form.valid()) {
        //        return;
        //    }
        //    var disabled = _$form.find(':input:disabled').removeAttr('disabled');
        //    var formdata = _$form.serializeFormToObject();

        //    var viewData = {
        //        salesorder: {
        //            "companyId": formdata.CompanyId,
        //            "seriesTypeId": formdata.SeriesTypeId,
        //            "prefix": $("#Series option:selected").html(),
        //            "code": "0",
        //            "transactionTime": formdata.TransactionTime,
        //            "deliveryTime": formdata.DeliveryTime,
        //            "clientId": formdata.ClientId,
        //            "clientOrderNo": formdata.ClientOrderNo,
        //            "quotationId": formdata.QuotationId,
        //            "orderTypeId": formdata.OrderTypeId,
        //            "salesAgentId": formdata.SalesAgentId,
        //            "notes": formdata.Notes,
        //            "statusId": 1,
        //            "taxTypeId": formdata.TaxTypeId,
        //            "subTotal": formdata.Total,
        //            "otherDiscount": 0,
        //            "netTotal": formdata.SubTotal,
        //            "taxRate": $("#TaxTypes option:selected").data('rate'),
        //            "tax": formdata.Tax,
        //            "grandTotal": formdata.Total
        //        },
        //        salesorderitems: []
        //    };
        //    disabled.attr('disabled', 'disabled');

        //    //sales order items
        //    var table = _$itemsTable.DataTable();
        //    var form_data = table.rows().data();
        //    var f = form_data;

        //    //jsonObj = [];
        //    for (var i = 0; f.length > i; i++) {

        //        item = {};
        //        item["SalesOrderId"] = "0";
        //        item["ProductId"] = f[i][7];
        //        item["Description"] = f[i][8];
        //        item["OrderQty"] = f[i][9];
        //        item["UnitId"] = f[i][10];
        //        item["UnitPrice"] = f[i][3];
        //        item["Disc1"] = f[i][11];
        //        item["DiscType1"] = f[i][12];
        //        item["Disc2"] = f[i][13];
        //        item["DiscType2"] = f[i][14];
        //        item["Disc3"] = f[i][15];
        //        item["DiscType3"] = f[i][16];
        //        item["DiscTotal"] = f[i][4];
        //        item["Total"] = f[i][5];
        //        viewData.salesorderitems.push(item);
        //        //jsonObj.push(item);
        //    }

        //    var salesorderinput = JSON.stringify(viewData);
        //    abp.message.confirm(
        //        'New sales order will be created.',
        //        'Are you sure?',
        //        function (isConfirmed) {
        //            if (isConfirmed) {
        //                abp.ui.setBusy(_$form);
        //                _salesOrderService.createSalesOrder(viewData).done(function () {
        //                    abp.message.success('Sales order created', 'Success');
        //                }).always(function () {
        //                    abp.ui.clearBusy(_$form);
        //                });
        //            }
        //        }
        //    );
        //}
    });
})();