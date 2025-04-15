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
    $('#Open').show();
    $('#Close').hide();
    $('#Show').hide();
});
(function () {
    $(function () {
        var _bioAttendanceService = abp.services.app.bioAtt2Service;

        var _$form = $('form[name=formexcel]');
        var _$hiddenform = $('form[name=hiddenform]');

        var _$itemsexceltable = $('#exceltable');
        var _$AttendanceTable = $('#AttendanceTable');
        var _$AttIDCompTable = $('#AttendanceNameCompTable');
        $('#Close').click(function (e) {
            $('#Open').show();
            $('#Close').hide();
        });
        $('#Open').click(function (e) {
            $('#Open').hide();
            $('#Close').show();
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
                        return '<a id="view-attendanceId" title="View Data" class="view-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-companyName="' + data.companyName + '"><i class="fa fa-md fa-search"></i></a> ';
                    }
                }
            ]
        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }

        $('#AttendanceTable').on('click', 'a.view-attendanceId', function (e) {
            e.preventDefault();
            $('#attid').val("");
            var Id = $(this).attr("data-attendanceId-id");
            var company = $(this).attr("data-attendanceId-companyName");
            $('#attid').val(Id);
            $('#companyId').val(company);
            $('#Open').hide();
            $('#Close').show();
            $('#Show').hide();
            GetAttidCompNameTable() 
        });

        var dataTable2 = _$AttIDCompTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAttByAttIdandCompname,
                inputFilter: function () {
                    var $d = $('#attid').val();
                    var $e = $('#companyId').val();
                    if ($d === '') {
                        $d = '0';
                    } if ($e === '') {
                        $e = '0';
                    }
                    return {
                        filter: $d + '|' + $e
                    };
                }
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
                    data: "no"
                },
                {
                    targets: 3,
                    data: "name"
                },
                {
                    targets: 4,
                    data: "department"
                },

                {
                    orderable: false,
                    targets: 5,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", department: "department", no: "no", name: "name", dateT: "dateT", startDate: "startDate", endDate: "endDate" },
                    "render": function (data) {
                        return '<a id="view-attIdComp" title="View Biometric Record" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"  class="view-attIdComp btn btn-outline-primary btn-sm" data-attIdComp-id="' + data.attendanceId + '" data-attIdComp-department="' + data.department + '" data-attIdComp-no="' + data.no + '"  data-attIdComp-name="' + data.name + '" data-attIdComp-dateT="' + data.dateT + '" update-attIdComp-start="' + data.startDate + '" update-attIdComp-end="' + data.endDate + '"><i class="fa fa-md fa-search"></i></a> | <a id="view-attendanceId" title="View Record" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"  class="view-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-companyName="' + data.companyName + '"><i class="fa fa-md fa-search"></i></a>';
                    }
                }
            ]
        });

        function GetAttidCompNameTable()  {
            dataTable2.ajax.reload();
        }

        $('#AttendanceNameCompTable').on('click', 'a.view-attIdComp', function (e) {
            e.preventDefault();
            $('#attid').val("");
            $('#no').val(0);
            var Id = $(this).attr("data-attIdComp-id");
            var company = $(this).attr("data-attIdComp-department");
            var no = $(this).attr("data-attIdComp-no");
            var name = $(this).attr("data-attIdComp-name");
            var dateT = $(this).attr("data-attIdComp-dateT");
            var $start = $(this).attr("update-attIdComp-start");
            var $end = $(this).attr("update-attIdComp-end");
            $('#attid').val(Id);
            $('#companyId').val(company);
            $('#no').val(no);
            $('#name1').val(name);
            $('#name').val(name);
            $('#dateT').val(dateT);
            $('#Open').show();
            $('#Close').hide();
            $('#Show').show();
            $('#startDate').val($start);
            $('#endDate').val($end);       
            GetAttendanceRecord();
        });

        var dataAttendanceTable = _$itemsexceltable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _bioAttendanceService.getAttByNo,
                inputFilter: function () {
                    var $d = $('#attid').val();
                    var $e = $('#companyId').val();
                    var $f = $('#no').val();
                    if ($d === '') {
                        $d = 0;
                    } if ($e === '') {
                        $e = 'null';
                    } if ($f === '') {
                        $f = 'null';
                    }
                    return {
                        filter: $d + '|' + $e + '|' + $f
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',
                    orderable: false,
                    visible: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    visible: false,
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
                    visible: false,
                    targets: 4,
                    data: "description1",

                    data: { description1: "description1" },
                    "render": function (data)
                    {
                        var dtdescription1 = data.description1;
                        return '<input id="descriptionEntry" name = "descriptionEntry" class="form-control" type="text" value="' + dtdescription1 + '" disabled /> ';
                    }
                },
                {
                    visible: true,
                    targets: 5,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                        var DaysEntry = days[dt.getDay()];
                        if (DaysEntry === "SUN" || DaysEntry === "SAT") {
                            return '<h4><span class="badge badge-warning">' + DaysEntry + '</span></h4>';
                        }
                        else {
                            return DaysEntry;
                        }
                    }
                },
                {
                    targets: 6,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }

                },
                {
                    visible: true,
                    targets: 7,
                    data: "amIn"
                },
                {
                    visible: true,
                    targets: 8,
                    data: "amOut"
                },
                {
                    visible: true,
                    targets: 9,
                    data: "pmIn"
                },
                {
                    visible: true,
                    targets: 10,
                    data: "pmOut"
                },

                {
                    visible: false,
                    targets: 11,
                    data: "startDate"
                },

                {
                    visible: false,
                    targets: 12,
                    data: "endDate"
                },                
                {
                    orderable: false,
                    targets: 13,
                    class: "text-center",
                    data: { id: "id", description1: "description1", date: "date", amIn: "amIn", amOut: "amOut", pmIn: "pmIn", pmOut: "pmOut", name: "name", status2: "status2", startDate: "startDate", endDate: "endDate", status3:"status3"},
                    "render": function (data) {
                        var ret = "";
                        if (data.status2 == 1) {
                            ret = '<a id="update-record" title="Modified Record" href="#" data-toggle="modal" data-target="#AttList" class="update-record btn btn-info btn-sm" update-record-id="' + data.id + '" update-record-description1="' + data.description1 + '" update-record-date="' + data.date + '" update-record-amIn="' + data.amIn + '" update-record-amOut="' + data.amOut + '" update-record-pmIn="' + data.pmIn + '" update-record-pmOut="' + data.pmOut + '" update-record-name="' + data.name + '" update-record-start="' + data.startDate + '" update-record-end="' + data.endDate + '" update-record-status3="' + data.status3 + '"  ><i class="fa fa-sm fa-pencil-square-o"></i></a>';
                        }
                        if (data.status2 == 2) {
                            ret = '<a id="update-record" title="Modified Record" href="#" data-toggle="modal" data-target="#AttList" class="update-record btn btn-info btn-sm" update-record-id="' + data.id + '" update-record-description1="' + data.description1 + '" update-record-date="' + data.date + '" update-record-amIn="' + data.amIn + '" update-record-amOut="' + data.amOut + '" update-record-pmIn="' + data.pmIn + '" update-record-pmOut="' + data.pmOut + '" update-record-name="' + data.name + '" update-record-start="' + data.startDate + '" update-record-end="' + data.endDate + '" update-record-status3="' + data.status3 + '"><i class="fa fa-sm fa-pencil-square-o"></i></a>';
                        }
                        else {
                            ret = '<a id="update-record" title="Original Record" href="#" data-toggle="modal" data-target="#AttList" class="update-record btn btn-primary btn-sm" update-record-id="' + data.id + '" update-record-description1="' + data.description1 + '" update-record-date="' + data.date + '" update-record-amIn="' + data.amIn + '" update-record-amOut="' + data.amOut + '" update-record-pmIn="' + data.pmIn + '" update-record-pmOut="' + data.pmOut + '" update-record-name="' + data.name + '" update-record-start="' + data.startDate + '" update-record-end="' + data.endDate + '" update-record-status3="' + data.status3 + '"><i class="fa fa-sm fa-pencil-square-o"></i></a>';
                        }
                        return ret;
                    },

                }

            ]
        });

        $('#exceltable').on('click', 'a.update-record', function (e) {
            e.preventDefault();
            var $Id = $(this).attr("update-record-id");
            var $description1 = $(this).attr("update-record-description1");
            var $date = $(this).attr("update-record-date");
            var $amIn = $(this).attr("update-record-amIn");
            var $amOut = $(this).attr("update-record-amOut");
            var $pmIn = $(this).attr("update-record-pmIn");
            var $pmOut = $(this).attr("update-record-pmOut");
            var $name = $(this).attr("update-record-name");
            var $start = $(this).attr("update-record-start");
            var $end = $(this).attr("update-record-end");
            var $status3 = $(this).attr("update-record-status3");

            var date = new Date($date);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var alert = [month, day, year].join('/');

            if ($amIn == "") {
                $amIn = "0:00";
            }
            if ($amOut == "") {
                $amOut = "0:00";
            }
            if ($pmIn == "") {
                $pmIn = "0:00";
            }
            if ($pmOut == "") {
                $pmOut = "0:00";
            }

            $('#idupdate').val($Id);
            $('#description1update').val($description1);
            $('#date1update').val(alert);
            $('#amIn1update').val($amIn);
            $('#amOut1update').val($amOut);
            $('#pmIn1update').val($pmIn);
            $('#pmOut1update').val($pmOut);
            $('#name').val($name);
            $('#name1').val($name);
            $('#startDate').val($start);
            $('#endDate').val($end);
            $('#SchedStatus').selectpicker('val', $status3);
        });

        $('#Update').click(function (e) {
            e.preventDefault();
            $('#AttList').modal('hide');
            UpdateData();
        });
        $('#Delete').click(function (e) {
            e.preventDefault();
            DeleteData();
        });

        function UpdateData()
        {
            if (!_$hiddenform.valid()) {
                return;
            }
            var items = _$hiddenform.serializeFormToObject();  //serializeFormToObject is defined in main.js

            var am1 = $('#amIn1update').val();
            var am2 = $('#amOut1update').val();
            var pm1 = $('#pmIn1update').val();
            var pm2 = $('#pmOut1update').val();

            if (am1 == "") {
                am1 = "0:00";
            }

            if (am2 == "") {
                am2 = "0:00";
            }
            if (pm1 == "") {
                pm1 = "0:00";
            }
            if (pm2 == "") {
                pm2 = "0:00";
            }

            items.dateRecorded = $('#dateT').val();
            items.company = 1;
            //items.name = $('#name').val();
            items.department = $('#companyId').val();
            items.no = $('#no').val();
            items.id = $('#idupdate').val();
            items.attendanceId = $('#attid').val();
            items.date = $('#date1update').val();
            items.aMIn = am1;
            items.aMOut = am2;
            items.pMIn = pm1;
            items.pMOut = pm2;
            items.Description1 = $('#description1update').val();
            items.Status1 = 1;
            items.Status2 = 2;
            items.Status3 = $('#SchedStatus').val() || 0;

            items.StartDate = $('#startDate').val();
            items.EndDate = $('#endDate').val();

            abp.message.confirm(
                'Employee Attendance Update!',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$hiddenform);
                        _bioAttendanceService.updateAtt2(items).done(function () {
                            $.ajax({
                                success: function () {
                                    abp.notify.info('Attendance info updated', 'Success');
                                    GetAttendanceRecord();
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            
                        });

                        GetAttendanceRecord();
                        abp.ui.clearBusy(_$hiddenform);
                        $('#AttList').modal('hide');
                    }
                }
            );            
        }

        function DeleteData() {
            var id = $('#idupdate').val();
            var attid = $('#attid').val();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Confirmation', 'ezinvmvc'), attid),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _bioAttendanceService.deleteAtt2({
                            id: id
                        }).done(function () {
                            $.ajax({
                                success: function () {
                                    abp.notify.info('Deleted', 'Success');
                                },
                                error: function (e) { }
                            });
                            GetAttendanceRecord();
                        });
                    }
                }
            );
        }

        $('#exceltable').on('click', 'a.delete-record', function (e) {
            e.preventDefault();
            var $attid = $('#attid').val();
            var $Id = $(this).attr("delete-record-id");
            var $description1 = $(this).attr("delete-record-description1");
            var $date = $(this).attr("delete-record-date");
            var $amIn = $(this).attr("delete-record-amIn");
            var $amOut = $(this).attr("delete-record-amOut");
            var $pmIn = $(this).attr("delete-record-pmIn");
            var $pmOut = $(this).attr("delete-record-pmOut");
            var $name = $(this).attr("delete-record-name");

            var date = new Date($date);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var alert = [month, day, year].join('/');

            if ($amIn == "") {
                $amIn = "0:00";
            }
            if ($amOut == "") {
                $amOut = "0:00";
            }
            if ($pmIn == "") {
                $pmIn = "0:00";
            }
            if ($pmOut == "") {
                $pmOut = "0:00";
            }

            $('#idupdate').val($Id);
            $('#description1update').val($description1);
            $('#date1update').val(alert);
            $('#amIn1update').val($amIn);
            $('#amOut1update').val($amOut);
            $('#pmIn1update').val($pmIn);
            $('#pmOut1update').val($pmOut);
            $('#name').val($name);
            $('#name1').val($name);

            _bioAttendanceService.deleteAtt2({ id: $Id}).done(function () {
                GetAttendanceRecord();
                abp.ui.clearBusy(_$TableForm2);
            });
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
                item["No"] = obj["No"];
                item["Name"] = obj["Name"];
                item["Department"] = obj["Department"];
                item["Date"] = obj["Date"];
                item["AMIn"] = obj["AMIn"];
                item["AMOut"] = obj["AMOut"];
                item["PMIn"] = obj["PMIn"];
                item["PMOut"] = obj["PMOut"];
                viewData.att2item.push(item);
            }
            abp.message.confirm(
                'New sales order will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _bioAttendanceService.updateAtt2(viewData).done(function (result) {
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

        $('#Addrow').click(function (e) {
            e.preventDefault();
            savedata();
        });

        function savedata() {
            if (!_$form.valid()) {
                return;
            }
            var item = _$form.serializeFormToObject();
            abp.ui.setBusy(_$form);

            item.attendanceId = $('#attid').val();
            item.company = 1;
            item.no = $('#no').val();
            item.name = $('#name1').val();
            item.department = $('#companyId').val();
            item.date = $('#date1').val();

            var $amIn1 = $('#amIn1').val();
            var $amOut1 = $('#amOut1').val();
            var $pmIn1 = $('#pmIn1').val();
            var $pmOut1 = $('#pmOut1').val();

            if ($amIn1 == "") {
                $amIn1 = "0:00";
            }
            if ($amOut1 == "") {
                $amOut1 = "0:00";
            }
            if ($pmIn1 == "") {
                $pmIn1 = "0:00";
            }
            if ($pmOut1 == "") {
                $pmOut1 = "0:00";
            }

            item.aMIn = $amIn1;
            item.aMOut = $amOut1;
            item.pMIn = $pmIn1;
            item.pMOut = $pmOut1;
            item.dateRecorded = $('#dateT').val();

            item.Description1 = "";
            item.Status1 = 1;
            item.Status2 = 1;
            item.StartDate = $('#startDate').val();
            item.EndDate = $('#endDate').val();

            abp.message.confirm(
                'New Adjustment will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _bioAttendanceService.createAdj(item).done(function () {
                            abp.notify.success('Adjustment Saved', 'Success');
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            $('#date1').val("");
                            $('#amIn1').val("");
                            $('#amOut1').val("");
                            $('#pmIn1').val("");
                            $('#pmOut1').val("");
                            GetAttendanceRecord();
                        });
                    }
                }
            );
        }

        $('#EmployeesTable').on('click', 'a.delete-Employee', function (e) {
            var employeeId = $(this).attr("data-Employee-id");
            var employeeCode = $(this).attr("data-Employee-code");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Employees', 'ezinvmvc'), employeeCode),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _employeesservice.deleteEmployee({
                            id: employeeId
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });

                            GetEmployees();
                        });
                    }
                }
            );
        });
        
    });
})(jQuery);