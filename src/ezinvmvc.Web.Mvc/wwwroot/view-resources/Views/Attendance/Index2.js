$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

$(document).ready(function () {
    $('#viewfile').show();
    $('#SaveAttendacebutton').hide();
});
(function () {
    $(function () {
        var _bioAttendanceService = abp.services.app.bioAtt2Service;

        var _$form = $('form[name=formexcel]');

        var _$itemsexceltable = $('#exceltable');
        var _$AttendanceTable = $('#AttendanceTable');

        $('#AttendanceNewbutton').click(function (e) {
            _$itemsexceltable.dataTable().clear();
            $('#SaveAttendacebutton').show();
            $('#attid').val("");
            
            GetAttendanceRecord();
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
                ajaxFunction: _bioAttendanceService.getAllAtt2,

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
                    data: "companyName"
                },

                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", companyName: "companyName" },
                    "render": function (data) {
                        return '<a id="edit-attendanceId" title="View" href="#" class="edit-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-companyName="' + data.companyName + '"><i class="fa fa-md fa-search"></i></a>';
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
            var company = $(this).attr("data-attendanceId-companyName");
            $('#attid').val(Id);
            $('#companyId').val(company);
            $('#SaveAttendacebutton').hide();
            $('#viewfile').hide();
            GetAttendanceRecord();
        });

        var dataAttendanceTable = _$itemsexceltable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAllAttendanceId ,
                inputFilter: function () {
                    var $d = $('#attid').val();
                    var $e = $('#companyId').val();
                    if ($d === '') {
                        $d = 0;
                    } if ($e === '') {
                        $e = 'null';
                    }
                    return {
                        filter: $d + '|' + $e
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
                    data: "no"
                },
                {
                    visible: true,
                    targets: 2,
                    data: "name"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "department"
                },
                {
                    targets: 4,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }

                },
                {
                    visible: true,
                    targets: 5,
                    data: "amIn"
                },
                {
                    visible: true,
                    targets: 6,
                    data: "amOut"
                },
                {
                    visible: true,
                    targets: 7,
                    data: "pmIn"
                },
                {
                    visible: true,
                    targets: 8,
                    data: "pmOut"
                },
                
            ]
        });

        function GetAttendanceRecord() {
            dataAttendanceTable.ajax.reload();
        }

        function save() {
            if (!_$form.valid()) {
                return;
            }
            var viewData = {
                att2item: []
            };
            var arr = $('#exceltable').tableToJSON();
            for (var i = 0; i < arr.length; i++) {
                item = {};

                item["AttendanceId"] = $('#attid').val();
                item["Company"] = "1";
                item["Status1"] = "1";
                item["Status2"] = "0";
                item["Status3"] = "0";
                item["Status4"] = "0";

                var obj = arr[i];
                var $amin = obj["AMIn"];
                var $AMOut = obj["AMOut"];
                var $PMIn = obj["PMIn"];
                var $PMOut = obj["PMOut"];
                var $Department = obj["Department"];
                if ($amin == "") { $amin = "0" }
                if ($AMOut == "") { $AMOut = "0" }
                if ($PMIn == "") { $PMIn = "0" }
                if ($PMOut == "") { $PMOut = "0" }
                item["No"] = obj["No"];
                item["Name"] = obj["Name"];
                item["Department"] = $Department.toUpperCase();
                item["Date"] = obj["Date"];
                item["AMIn"] = $amin;
                item["AMOut"] = $AMOut;
                item["PMIn"] = $PMIn;
                item["PMOut"] = $PMOut;
                item["Description1"] = "";
                item["DateRecorded"] = $('#DateRecorded').val();
                item["StartDate"] = $('#startdate').val();
                item["EndDate"] = $('#enddate').val();
                viewData.att2item.push(item);
            }
            abp.message.confirm(
                'New Attendance Record will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _bioAttendanceService.createAtt2(viewData).done(function (result) {
                            abp.notify.success('Attendance Saved', 'Success');
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            $('#viewfile').show();
                            $('#SaveAttendacebutton').hide();
                            GetAttendanceTable();
                        });
                    }
                }
            );
        }

        $('#enddate').change(function (e) {
            e.preventDefault();
            $('#attid').val("");
            var $enddate = $('#enddate').val();
            RefDate = $enddate.split('/');
            if (RefDate == "") { return }
            mm = RefDate[0];
            dd = RefDate[1];
            yy = RefDate[2];

            var $startdate = $('#startdate').val();
            RefDate = $startdate.split('/');
            if (RefDate == "") { return }
            mm1 = RefDate[0];
            dd1 = RefDate[1];

            $('#attid').val(mm1 + dd1 + mm + dd + yy);
        });

    });
})(jQuery);