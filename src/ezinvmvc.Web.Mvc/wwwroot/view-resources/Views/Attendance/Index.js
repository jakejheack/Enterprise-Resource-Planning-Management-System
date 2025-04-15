// Employees

$(".date-picker").datepicker();
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
$('#viewfile').show();
$('#SaveAttendacebutton').show();
(function () {
    $(function () {
        var _bioAttendanceService = abp.services.app.bioAttendanceService;

        var _$form = $('form[name=formexcel]');

        var _$itemsexceltable = $('#exceltable');
        var _$AttendanceTable = $('#AttendanceTable');

        $('#AttendanceNewbutton').click(function (e) {
            _$itemsexceltable.dataTable().clear();
            $('#SaveAttendacebutton').show();
            $('#attid').val("");
            
            GetPerformanceRecord();
        });

        $('#SaveAttendacebutton').click(function (e) {
            e.preventDefault();
            save();
        });

        var dataTable = _$AttendanceTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAllAttendance

            },
            columnDefs: [

                {
                    //className: 'control responsive',
                    targets: 0,
                    data: "dateT",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 1,
                    data: "attendanceId"
                },
                {
                    targets: 2,
                    data: "company"
                },

                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", company: "company" },
                    "render": function (data) {
                        return '<a id="edit-attendanceId" title="Edit Loans" href="#" class="edit-attendanceId" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-company="' + data.company + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }

        $('#AttendanceTable').on('click', 'a.edit-attendanceId', function (e) {
            e.preventDefault();
            $('#attid').val("");
            var Id = $(this).attr("data-attendanceId-id");
            $('#attid').val(Id);
            $('#SaveAttendacebutton').hide();
            $('#viewfile').hide();
            GetPerformanceRecord();
        });

        var dataTableLeave = _$itemsexceltable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAllAttendanceId ,
                inputFilter: function () {
                    var $d = $('#attid').val();
                    if ($d === '') {
                        $d = 0;
                    }
                    return {
                        filter: $d
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
                    visible: true,
                    targets: 1,
                    data: "company"
                },
                {
                    visible: true,
                    targets: 2,
                    data: "name"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "no"
                },
                {
                    targets: 4,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDateTime(dt);
                    }

                },
                {
                    visible: true,
                    targets: 5,
                    data: "locId"
                },
                {
                    visible: true,
                    targets: 6,
                    data: "idNumber"
                },
                {
                    targets: 7,
                    data: "verifyCode"
                },
                {
                    visible: false,
                    targets: 8,
                    data: "cardNo"
                },
                {
                    targets: 9,
                    data: "status"
                },
                
            ]
        });

        function GetPerformanceRecord() {
            dataTableLeave.ajax.reload();
        }

        function save() {
            if (!_$form.valid()) {
                return;
            }
            var viewData = {
                attendanceitem: []
            };
            var arr = $('#exceltable').tableToJSON();
            for (var i = 0; i < arr.length; i++) {
                item = {};
                item["AttendanceId"] = $('#attid').val();
                var obj = arr[i];
                item["Company"] = obj["Company"];
                item["Name"] = obj["Name"];
                item["No"] = obj["No"];
                var mydate = obj["Date"];
                var formatedate = mydate.replace(/(\d{2})(\/)(\d{2})/, "$3$2$1");
                item["Date"] = formatedate;
                item["LocId"] = obj["LocId"];
                item["IdNumber"] = obj["IdNumber"];
                item["VerifyCode"] = obj["VerifyCode"];
                item["CardNo"] = obj["CardNo"];
                item["Status"] = "Active";
                viewData.attendanceitem.push(item);
            }
            abp.message.confirm(
                'New sales order will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _bioAttendanceService.createAttendanceEntry(viewData).done(function (result) {
                            abp.notify.success('Attendance Saved', 'Success');
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            GetAttendanceTable();
                        });
                    }
                }
            );
        }
    });
})(jQuery);