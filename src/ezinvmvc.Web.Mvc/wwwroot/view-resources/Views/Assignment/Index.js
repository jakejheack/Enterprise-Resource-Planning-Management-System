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
var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
$("#DateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
(function () {
    $(function () {

        var _$table = $('#AssignmentTable');
        var _service = abp.services.app.rFQService
        var _employeeService = abp.services.app.employeeService;
        var _tasksService = abp.services.app.tasksService;

        //var _$assignform = $('form[name=assignCreateForm]');
        //var _$form = $('form[name=RfqForm]');
        //var _$itemsTable = $('#ItemsTable');
        //var _$itemsTableDeleted = $('#ItemsTableDeleted');
        //var _$assignedTable = $('#AssignedTable');

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

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _tasksService.getTasksall,
                inputFilter: function () {
                    var $id = $('#SearchFilter').val();
                    //return {
                    //    filter: $s
                    //};
                    //var $id = $('#SearchFilter').val();
                    //var $code = '  ';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    //var $statusid = $('#StatusTypes').val();
                    //var $clientid = '  ';
                    return {
                        //filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid
                        filter: $id + '|' + '|' + $datefrom + '|' + $dateto
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
                    data: { id: "id", rfqId: "rfqId", code: "code", revisionNo: "revisionNo" },
                    "render": function (data) {
                        return '<a id="view-rfq" title="view" href="#" class="view-rfq" data-rfq-id="' + data.rfqId + '" data-rfq-code="' + data.code + '-' + data.revisionNo + '">' + data.code + '-' + data.revisionNo + '</i></a>';
                    }
                },
                {
                    orderData: 10,
                    targets: 2,
                    data: { soId: "soId", soCode: "soCode", soRevNO: "soRevNO" },
                    "render": function (data) {
                        if (data.soRevNO == 0) {
                            return '<a id="view-quotation" title="view" href="#" class="view-quotation" data-quotation-id="' + data.soId + '" data-quotation-code="' + data.soCode + '-' + data.revisionNo + '"></i></a>';
                        }
                        else { return '<a id="view-quotation" title="view" href="#" class="view-quotation" data-quotation-id="' + data.soId + '" data-quotation-code="' + data.soCode + '-' + data.revisionNo + '">' + data.soCode + '-' + data.soRevNO + '</i></a>'; }

                    }
                },
                {
                    targets: 3,
                    data: "name"
                },
                {
                    targets: 4,
                    data: "email"
                },
                {
                    targets: 5,
                    data: "creationTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    //orderable: false,
                    //targets: 6,
                    //data: "assignStatus"
                    orderable: false,
                    targets: 6,
                    data: { status: "status", assignStatus: "assignStatus" },
                    "render": function (data) {
                        if (data.status === 0) {
                            return '<span class="badge badge-secondary">' + data.assignStatus + '</span>';

                        }
                        else {
                            return '<span class="badge badge-success">' + data.assignStatus + '</span>';

                        }
                    }
                },
                {
                    visible: false,
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { id: "id", status: "status" },
                    "render": function (data) {
                        //var buttons = '<a id="edit-task" title="edit" href="#" class="edit-task" data-task-id="' + data.id + '"  data-task-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfq" title="delete" href="#" class="delete-rfq" data-rfq-id="' + data.id + '" "><i class="fa fa-trash"></i></a>';

                        return '<a id="assign-task" title="assign" href="#" class="assign-task" assign-task-id="' + data.id + '" assign-task-assignid="' + data.assignedid + '"  data-task-status="' + data.status + '"  ><i class="fa fa-user"></i></a>|';
                    }
                },
                {
                    visible: false,
                    targets: 8,
                    data: "employeeId"
                },
                {
                    visible: false,
                    targets: 9,
                    data: "code"
                },
                {
                    visible: false,
                    targets: 10,
                    data: "soCode"
                },
            ]
        });


        function getAll() {
            dataTable.ajax.reload();
        }

        getAll();

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

        $('#SearchFilter').focus();

        _$table.on('click', 'a.view-rfq', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-rfq-id");
            //alert(clientId);
            window.location.href = abp.appPath + 'RFQ/Details?id=' + clientId;
        });

        _$table.on('click', 'a.view-quotation', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-quotation-id");
            //alert(clientId);
            window.location.href = abp.appPath + 'Quotations/Details?id=' + clientId;
        });

    });
})();