$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

function cutNumber(number, digitsAfterDot) {
    const str = `${number}`;

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1);
}

$(document).ready(function () {
    $('#Open').show();
    $('#Close').hide();
    $('#Show').hide();

    $('#Salary').hide();
    $('#Absent').hide();
    $('#Tardines').hide();
    $('#UnderTime').hide();
    $('#Lvs').hide();
    $('#OT').hide();
    $('#Alwnce').hide();
    $('#Othrs').hide();
    $('#Days').hide();

    $('#btnSavePayroll').prop("disabled", true);
});
(function () {
    $(function () {
        var _bioAttendanceService = abp.services.app.bioAtt2Service;
        var _empSalariesServices = abp.services.app.empSalariesServices;
        var _oTRatesService = abp.services.app.oTRatesService;
        var _employeeAllowanceService = abp.services.app.employeeAllowanceService;
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _empContributionService = abp.services.app.empContributionService;
        var _payrollIServices = abp.services.app.payrollIServices;
        var _attAdjustmentService = abp.services.app.attAdjustmentService;
        var _bioAtt2Service = abp.services.app.bioAtt2Service;
        var _attRecordsService = abp.services.app.attRecordsService;
        var _empLeavesService = abp.services.app.empLeavesService;

        var _$sssloanTable = $('#SSSLoanTable');
        var _$pagibigLoanTable = $('#PagibigLoanTable');
        var _$AttendanceTable = $('#AttendanceTable');
        var _$AttIDCompTable = $('#AttendanceNameCompTable');
        var _$AllowanceTable = $('#AllowanceTable');
        var _$OtherLoanmodalTable = $('#OtherLoanmodalTable');
        var _$DeductionTable = $('#DeductionTable');
        var _$OTTable = $('#OTTable');
        var _$AttRecTable = $('#AttRecTable');

        var _$EmpPayrollRec = $('form[name=EmpPayrollRec]');
        var _$AttAdjTable = $('#AttAdjTable');
        var _$EmpAttIdRec = $('form[name=EmpAttIdRec]');
        var _$hiddenform = $('form[name=hiddenform]');

        $('#Close').click(function (e) {
            $('#Open').show();
            $('#Close').hide();
        });
        $('#Open').click(function (e) {
            $('#Open').hide();
            $('#Close').show();
        });

        function clearTextRate() {
            $('#BasicSalaryCurrent').val('');
            $('#BasicSalaryAdjustment').val('');
            $('#BasicSalaryAmount').val('');

            $('#TravelhoursCurrent').val('');
            $('#TravelhoursAdjustment').val('');
            $('#TravelhoursAmount').val('');

            $('#HolidayCurrent').val('');
            $('#HolidayAdjustment').val('');
            $('#HolidayAmount').val('');

            $('#AbsensesCurrent').val('');
            $('#AbsensesAdjustment').val('');
            $('#AbsensesAmount').val('');
            $('#TardinessCurrent').val('');
            $('#TardinessAjustment').val('');
            $('#TardinessAmount').val('');
            $('#UndertimeCurrent').val('');
            $('#UndertimeAdjustment').val('');
            $('#TardinessDeductionLate').val('');            
            $('#UndertimeAmount').val('');
            $('#LeaveUse').val('');
            $('#LeaveAmout').val('');
            $('#LeaveTotalAmout').val('');
            $('#RGOTAmount').val('');
            $('#AllowanceAdjs').val('');
            $('#GeneralAmount').val('');
            $('#NONGeneralAmount').val(''); 
            $('#GrossAmount').val('');

            $('#NightDiffCurrent').val('');
            $('#NightDiffAdjustment').val('0.10');
            $('#NightDiffAmount').val('');

            $('#AllowanceTable').dataTable().fnClearTable();
            $('#AttAdjs').val('');
            $('#AttOT').val('');
            $('#AttOTAmount').val('');
            
            $('#SSSAdjustment').val('');
            $('#SSSAmount').val('');
            $('#SSSCurrent').val('');
            $('#PhilhealthAdjustment').val('');
            $('#PhilhealthAmount').val('');
            $('#PhilhealthCurrent').val('');
            $('#PagibigAjustment').val('');
            $('#PagibigAmount').val('');
            $('#PagibigCurrent').val('');
            $('#ContributionAmount').val('');

            $('#SSSLoanTable').dataTable().fnClearTable();
            $('#PagibigLoanTable').dataTable().fnClearTable();
            $('#OtherLoanmodalTable').dataTable().fnClearTable();
            $('#DeductionTable').dataTable().fnClearTable();
            $('#OTTable').dataTable().fnClearTable();
            $('#AttAdjTable').dataTable().fnClearTable();

            $('#PagibigLoanCurrent').val('');
            $('#PagibigLoanAdjustment').val('');
            $('#PagibigLoanAmount').val('');
            $('#SSSLoanCurrent').val('');
            $('#SSSLoanAdjustment').val('');
            $('#SSSLoanAmount').val('');
            $('#OtherLoanCurrent').val('');
            $('#OtherLoanAdjustment').val('');
            $('#OtherLoanAmount').val('');

            $('#DeductionDescription').val('');
            $('#DedDate').val('');
            $('#DeductionAmount').val('');
            $('#OtherDeduction').val('');
            $('#TaxHeld').val('');
            $('#LoansAmount').val('');
            $('#TaxableAmount').val('');
            $('#Percent').val('');
            $('#NetIncome').val('');

            //$('#idrate').val(0);
            $('#RateDescription').val('');
            $('#Regural').val('0.00');
            $('#RestDay').val('0.00');
            $('#SpecialHoliday').val('0.00');
            $('#LegalHoliday').val('0.00');
            $('#SpecialHolidayRestday').val('0.00');
            $('#LegalHolidayRestday').val('0.00');

            $('#ReguralOT').val('0.00');
            $('#RestDayOT').val('0.00');
            $('#SpecialHolidayOT').val('0.00');
            $('#LegalHolidayOT').val('0.00');
            $('#SpecialHolidayRestdayOT').val('0.00');
            $('#LegalHolidayRestdayOT').val('0.00');

            $('#NDRegural').val('0.00');
            $('#NDRestDay').val('0.00');
            $('#NDSpecialHoliday').val('0.00');
            $('#NDLegalHoliday').val('0.00');
            $('#NDSpecialHolidayRestday').val('0.00');
            $('#NDLegalHolidayRestday').val('0.00');

            $('#NDReguralOT').val('0.00');
            $('#NDRestDayOT').val('0.00');
            $('#NDSpecialHolidayOT').val('0.00');
            $('#NDLegalHolidayOT').val('0.00');
            $('#NDSpecialHolidayRestdayOT').val('0.00');
            $('#NDLegalHolidayRestdayOT').val('0.00');
        }
        function cleartext() {            
            $('#attid').val("");
            $('#EmpId').val("");
            $('#EmpCode').val("");
            $('#FullName').val("");
            $('#dateT').val("");
            $('#DeptName').val("");
            $('#RatePerDay').val("");
            $('#RatePerHour').val("");
            $('#TravelhoursAdjustment').val("");
            $('#Period').selectpicker('val', 0);
            $('#rateid').val(0);
        }

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
                    targets: 3,
                    data: "startDate",
                    "render": function (data) {
                        var sdt = new Date(data);
                        return getFormattedDate(sdt);
                    }
                },
                {
                    targets: 4,
                    data: "endDate",
                    "render": function (data) {
                        var Edt = new Date(data);
                        return getFormattedDate(Edt);
                    }
                },
                {
                    orderable: false,
                    targets: 5,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", companyName: "companyName", dateT: "dateT", startDate: "startDate", endDate: "endDate" },
                    "render": function (data) {
                        return '<a id="view-attendanceId" title="View Data" class="view-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-companyName="' + data.companyName + '" data-attendanceId-dateT="' + data.dateT + '" data-attendanceId-startDate="' + data.startDate + '" data-attendanceId-endDate="' + data.endDate + '"><i class="fa fa-md fa-search"></i></a> ';
                    }
                }
            ]
        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }

        $('#AttendanceTable').on('click', 'a.view-attendanceId', function (e) {
            e.preventDefault();
            $("#AttList").modal('hide');
            $('#attid').val("");
            var Id = $(this).attr("data-attendanceId-id");
            var company = $(this).attr("data-attendanceId-companyName");
            var dateT = $(this).attr("data-attendanceId-dateT");
            var $startDate = $(this).attr("data-attendanceId-startDate");
            var $endDate = $(this).attr("data-attendanceId-endDate");

            var Date2 = new Date(dateT);
            var DateTr = Date2.getFullYear();
            //var mnt = Id.substr(0, 2);
            $('#startdate').val($startDate);
            $('#enddate').val($endDate);
            $('#dateTrans').val(DateTr);
            $('#attid').val(Id);
            //$('#months').val(mnt);
            $('#companyId').val(company);
            $('#Open').hide();
            $('#Close').show();
            $('#Show').hide();
            //1
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
                    visible: false,
                    targets: 0,
                    data: "dateT",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    visible: false,
                    targets: 1,
                    data: "attendanceId"
                },
                {
                    visible: false,
                    targets: 2,
                    data: "ot"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "no"
                },
                {
                    targets: 4,
                    data: "name"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "department"
                },

                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { attendanceId: "attendanceId", department: "department", ot: "ot", no: "no", name: "name", dateT: "dateT" },
                    "render": function (data) {
                        var $ot = data.ot;
                        if ($ot == "0") {
                            return '<a id="view-attIdComp" title="Select" class="view-attIdComp btn btn-outline-danger btn-sm" data-attIdComp-id="' + data.attendanceId + '" data-attIdComp-department="' + data.department + '" data-attIdComp-no="' + data.no + '"  data-attIdComp-name="' + data.name + '" data-attIdComp-dateT="' + data.dateT + '" data-attIdComp-ot="' + data.ot + '"><i class="fa fa-md fa-arrow-circle-o-right"></i></a>';
                        }
                        else {
                            return '<a id="view-attIdComp" title="Select" class="view-attIdComp btn btn-outline-primary btn-sm" data-attIdComp-id="' + data.attendanceId + '" data-attIdComp-department="' + data.department + '" data-attIdComp-no="' + data.no + '"  data-attIdComp-name="' + data.name + '" data-attIdComp-dateT="' + data.dateT + '" data-attIdComp-ot="' + data.ot + '"><i class="fa fa-md fa-arrow-circle-o-right"></i></a>';
                         }                        
                    }
                }
            ]
        });

        function GetAttidCompNameTable() {
            dataTable2.ajax.reload();
        }

        $('#AttendanceNameCompTable').on('click', 'a.view-attIdComp', function (e) {
            e.preventDefault();

            if ($('#CutOff').val() == 0) { abp.notify.error('Select Cut off first'); return; }

            cleartext();
            clearTextRate();
            abp.ui.setBusy(_$EmpAttIdRec);
            abp.ui.setBusy(_$EmpPayrollRec);
            var attId = $(this).attr("data-attIdComp-id");
            var empId = $(this).attr("data-attIdComp-ot");
            var empno = $(this).attr("data-attIdComp-no");
            var name = $(this).attr("data-attIdComp-name");
            var dateT = $(this).attr("data-attIdComp-dateT");
            var department = $(this).attr("data-attIdComp-department");

            //$('#abcount').val(0);
            $('#attid').val(attId);
            $('#EmpId').val(empId);
            $('#EmpCode').val(empno);
            $('#FullName').val(name);
            $('#dateT').val(dateT);
            $('#DeptName').val(department);
            $('#BasicSalaryCurrent').prop("disabled", false);
            $('#AbsensesCurrent').prop("disabled", false);
            //$('#LeaveId').selectpicker('val', 0);

            $('#LeaveToUse').val(0);  
            //2
            GetRatesRecord();

        });

        function GetRatesRecord() {
            var $id = $('#EmpId').val();
            _empSalariesServices.getEmpSalariesByEmpId({ id: $id }).done(function (result) {
                if (result === null) {
                    abp.notify.error('No salary recorded');
                    abp.ui.clearBusy(_$EmpAttIdRec);
                    abp.ui.clearBusy(_$EmpPayrollRec);
                }
                else
                {
                    $('#RatePerDay').val(result.payrollRatePerDay);
                    $('#RatePerHour').val(result.payrollRatePerHour);
                    $('#TravelhoursAdjustment').val(result.payrollRatePerHour);
                    $('#SalaryPeriodid').selectpicker('val', result.salaryPeriod);
                    $('#Period').selectpicker('val', result.payrollPeriod);
                    $('#rateid').val(result.payrollrateid);
                    $('#TardinessAjustment').val(currencyFormat(result.laterate));
                    $('#UndertimeAdjustment').val(result.undertime);
                    $('#BasicSalaryAdjustment').val(result.payrollRatePerDay);
                    $('#AbsensesAdjustment').val(result.payrollRatePerDay);
                    $('#LeaveAmout').val(result.payrollRatePerDay);
                    $('#RatePerMonth').val(result.payrollRatePerMonth);
                    $('#TaxHeld').val(result.taxWHeld);
                    $('#TotalLeave').val(result.totalLeave);
                    $('#LeaveId').selectpicker('val', "");
                    $('#HolidayAdjustment').val(result.payrollRatePerHour);
                    //3
                    changerate();
                }
            });
        }

        function GetLeaveUse() {
            var $id = $('#EmpId').val();
            var $dateTrans = $('#dateTrans').val();

            _payrollIServices.getLeaveCount({ filter: $dateTrans + '|' + $id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $leaveUse = result.items[i].leaveUse;  
                    $('#TotalLeaveUse').val($leaveUse);
                }

                var $TotalLeave = $('#TotalLeave').val() || 0;
                var $TotalLeaveUse = $('#TotalLeaveUse').val() || 0;

                var $totalLeave = roundNumber((parseFloat($TotalLeave) - parseFloat($TotalLeaveUse)), 2);
                $('#LeaveToUse').val($totalLeave);
            //var tot = roundNumber((cost + total), 2);

                //changerate();
            });
        }

        $('#RGOT').click(function (e) {
            e.preventDefault();
            $("#RateModal").modal('show');
        });

        $('#Btndismiss').click(function (e) {
            e.preventDefault();
            $("#RateModal").modal('hide');
        });

        function changerate() {
            var $id = $('#rateid').val();
            _oTRatesService.getOTRate({ id: $id }).done(function (result) {
                //$('#idrate').val(result.id);
                //console.log(result);
                $('#Regural').val(result.regural);
                $('#RestDay').val(result.restDay);
                $('#SpecialHoliday').val(result.specialHoliday);
                $('#LegalHoliday').val(result.legalHoliday);
                $('#SpecialHolidayRestday').val(result.specialHolidayRestday);
                $('#LegalHolidayRestday').val(result.legalHolidayRestday);

                $('#ReguralOT').val(result.reguralOT);
                $('#RestDayOT').val(result.restDayOT);
                $('#SpecialHolidayOT').val(result.specialHolidayOT);
                $('#LegalHolidayOT').val(result.legalHolidayOT);
                $('#SpecialHolidayRestdayOT').val(result.specialHolidayRestdayOT);
                $('#LegalHolidayRestdayOT').val(result.legalHolidayRestdayOT);

                $('#NDRegural').val(result.ndRegural);
                $('#NDRestDay').val(result.ndRestDay);
                $('#NDSpecialHoliday').val(result.ndSpecialHoliday);
                $('#NDLegalHoliday').val(result.ndLegalHoliday);
                $('#NDSpecialHolidayRestday').val(result.ndSpecialHolidayRestday);
                $('#NDLegalHolidayRestday').val(result.ndLegalHolidayRestday);

                $('#NDReguralOT').val(result.ndReguralOT);
                $('#NDRestDayOT').val(result.ndRestDayOT);
                $('#NDSpecialHolidayOT').val(result.ndSpecialHolidayOT);
                $('#NDLegalHolidayOT').val(result.ndLegalHolidayOT);
                $('#NDSpecialHolidayRestdayOT').val(result.ndSpecialHolidayRestdayOT);
                $('#NDLegalHolidayRestdayOT').val(result.ndLegalHolidayRestdayOT);

                if ($('#SalaryPeriodid').val() == 3 || $('#SalaryPeriodid').val() == 4) {
                    //disable//
                    //$('#BasicSalaryCurrent').prop("disabled", true);
                    $('#BasicSalaryCurrent').prop("disabled", false);
                    $('#AbsensesCurrent').prop("disabled", false);
                    $('#BasicSalaryCurrent').val(13);
                    $('#AbsensesCurrent').val("");
                }
                else {
                    $('#AbsensesCurrent').val("");
                    //disable//
                    //$('#AbsensesCurrent').prop("disabled", true);
                    $('#AbsensesCurrent').prop("disabled", false);
                    $('#BasicSalaryCurrent').prop("disabled", false);
                    $('#BasicSalaryCurrent').val("");
                }
                //5
                
                //GetNonGeneralAmountRecord($("#EmpId").val());
            })
            GetGeneralAmountRecord($("#EmpId").val());
        }

        $("#Reguraltime").focusout(function () {
            var val = "RR"
            var duration = document.getElementById('Reguraltime').value;
            var RestDayRate = document.getElementById('Regural').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#ReguralTotalMin").val(myval);
            AddtoRate();
            Addtotable("1", duration, RestDayRate, myval, val);
            $('#Reguraltime').val("");
            $('#ReguralTotalMin').val("");
        });
        $("#RestDaytime").focusout(function () {
            var val = "RD"
            var duration = document.getElementById('RestDaytime').value;
            var RestDayRate = document.getElementById('RestDay').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#RestDayTotalMin").val(myval);
            AddtoRate();
            Addtotable("2", duration, RestDayRate, myval, val);
            $('#RestDaytime').val("");
            $('#RestDayTotalMin').val("");
        });
        $("#SpecialHolidaytime").focusout(function () {
            var val = "SH"
            var duration = document.getElementById('SpecialHolidaytime').value;
            var RestDayRate = document.getElementById('SpecialHoliday').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#SpecialHolidayTotalMin").val(myval);
            AddtoRate();
            Addtotable("3", duration, RestDayRate, myval, val);
            $('#SpecialHolidaytime').val("");
            $('#SpecialHolidayTotalMin').val("");
        });
        $("#LegalHolidaytime").focusout(function () {
            var val = "LH"
            var duration = document.getElementById('LegalHolidaytime').value;
            var RestDayRate = document.getElementById('LegalHoliday').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#LegalHolidayTotalMin").val(myval);
            AddtoRate();
            Addtotable("4", duration, RestDayRate, myval, val);
            $('#LegalHolidaytime').val("");
            $('#LegalHolidayTotalMin').val("");
        });
        $("#SpecialHolidayRestdaytime").focusout(function () {
            var val = "SH RD"
            var duration = document.getElementById('SpecialHolidayRestdaytime').value;
            var RestDayRate = document.getElementById('SpecialHolidayRestday').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#SpecialHolidayRestdayTotalMin").val(myval);
            AddtoRate();
            Addtotable("5", duration, RestDayRate, myval, val);
            $('#SpecialHolidayRestdaytime').val("");
            $('#SpecialHolidayRestdayTotalMin').val("");
        });
        $("#LegalHolidayRestdaytime").focusout(function () {
            var val = "LH RD"
            var duration = document.getElementById('LegalHolidayRestdaytime').value;
            var RestDayRate = document.getElementById('LegalHolidayRestday').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#LegalHolidayRestdayTotalMin").val(myval);
            AddtoRate();
            Addtotable("6", duration, RestDayRate, myval, val);
            $('#LegalHolidayRestdaytime').val("");
            $('#LegalHolidayRestdayTotalMin').val("");
        });

        $("#ReguralOTtime").focusout(function () {
            var val = "RG OT"
            var duration = document.getElementById('ReguralOTtime').value;
            var RestDayRate = document.getElementById('ReguralOT').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#ReguralOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("7", duration, RestDayRate, myval, val);
            $('#ReguralOTtime').val("");
            $('#ReguralOTTotalMin').val("");
        });
        $("#RestDayOTtime").focusout(function () {
            var val = "RD OT"
            var RestDayRate = document.getElementById('RestDayOT').value;
            var duration = document.getElementById('RestDayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#RestDayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("8", duration, RestDayRate, myval, val);
            $('#RestDayOTtime').val("");
            $('#RestDayOTTotalMin').val("");
        });
        $("#SpecialHolidayOTtime").focusout(function () {
            var val = "SH OT"
            var RestDayRate = document.getElementById('SpecialHolidayOT').value;
            var duration = document.getElementById('SpecialHolidayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#SpecialHolidayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("9", duration, RestDayRate, myval, val);
            $('#SpecialHolidayOTtime').val("");
            $('#SpecialHolidayOTTotalMin').val("");
        });
        $("#LegalHolidayOTtime").focusout(function () {
            var val = "LH OT"
            var RestDayRate = document.getElementById('LegalHolidayOT').value;
            var duration = document.getElementById('LegalHolidayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#LegalHolidayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("10", duration, RestDayRate, myval, val);
            $('#LegalHolidayOTtime').val("");
            $('#LegalHolidayOTTotalMin').val("");
        });
        $("#SpecialHolidayRestdayOTtime").focusout(function () {
            var val = "SHRD OT"
            var RestDayRate = document.getElementById('SpecialHolidayRestdayOT').value;
            var duration = document.getElementById('SpecialHolidayRestdayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#SpecialHolidayRestdayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("11", duration, RestDayRate, myval, val);
            $('#SpecialHolidayRestdayOTtime').val("");
            $('#SpecialHolidayRestdayOTTotalMin').val("");
        });
        $("#LegalHolidayRestdayOTtime").focusout(function () {

            var val = "LHRD OT"
            var RestDayRate = document.getElementById('LegalHolidayRestdayOT').value;
            var duration = document.getElementById('LegalHolidayRestdayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateTime(duration, RestDayRate, RatePerHour);
            $("#LegalHolidayRestdayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("12", duration, RestDayRate, myval, val);
            $('#LegalHolidayRestdayOTtime').val("");
            $('#LegalHolidayRestdayOTTotalMin').val("");
        });

        //ND
        $("#NDReguraltime").focusout(function () {
            var val = "ND RG"
            var RestDayRate = document.getElementById('NDRegural').value;
            var duration = document.getElementById('NDReguraltime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            //var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            $("#NDReguralTotalMin").val(myval);
            AddtoRate();
            Addtotable("13", duration, RestDayRate, myval, val);
            $('#NDReguraltime').val("");
            $('#NDReguralTotalMin').val("");
        });
        $("#NDRestDaytime").focusout(function () {
            var val = "ND RD"
            var RestDayRate = document.getElementById('NDRestDay').value;
            var duration = document.getElementById('NDRestDaytime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            //var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            var myval = ComputeRateNDHolTime(duration, RestDayRate, RatePerHour);
            $("#NDRestDayTotalMin").val(myval);
            AddtoRate();
            Addtotable("14", duration, RestDayRate, myval, val);
            $('#NDRestDaytime').val("");
            $('#NDRestDayTotalMin').val("");
        });
        $("#NDSpecialHolidaytime").focusout(function () {
            var val = "ND SH"
            var RestDayRate = document.getElementById('NDSpecialHoliday').value;
            var duration = document.getElementById('NDSpecialHolidaytime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            //var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            var myval = ComputeRateNDHolTime(duration, RestDayRate, RatePerHour);
            $("#NDSpecialHolidayTotalMin").val(myval);
            AddtoRate();
            Addtotable("15", duration, RestDayRate, myval, val);
            $('#NDSpecialHolidaytime').val("");
            $('#NDSpecialHolidayTotalMin').val("");
        });
        $("#NDLegalHolidaytime").focusout(function () {
            var val = "ND LH"
            var RestDayRate = document.getElementById('NDLegalHoliday').value;
            var duration = document.getElementById('NDLegalHolidaytime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            //var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            var myval = ComputeRateNDHolTime(duration, RestDayRate, RatePerHour);
            $("#NDLegalHolidayTotalMin").val(myval);
            AddtoRate();
            Addtotable("16", duration, RestDayRate, myval, val);
            $('#NDSpecialHoNDLegalHolidaytimelidaytime').val("");
            $('#NDLegalHolidayTotalMin').val("");
        });
        $("#NDSpecialHolidayRestdaytime").focusout(function () {
            var val = "NDSH RD"
            var RestDayRate = document.getElementById('NDSpecialHolidayRestday').value;
            var duration = document.getElementById('NDSpecialHolidayRestdaytime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            //var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            var myval = ComputeRateNDHolTime(duration, RestDayRate, RatePerHour);
            $("#NDSpecialHolidayRestdayTotalMin").val(myval);
            AddtoRate();
            Addtotable("17", duration, RestDayRate, myval, val);
            $('#NDSpecialHolidayRestdaytime').val("");
            $('#NDSpecialHolidayRestdayTotalMin').val("");
        });
        $("#NDLegalHolidayRestdaytime").focusout(function () {
            var val = "NDLH RD"
            var RestDayRate = document.getElementById('NDLegalHolidayRestday').value;
            var duration = document.getElementById('NDLegalHolidayRestdaytime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            //var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            var myval = ComputeRateNDHolTime(duration, RestDayRate, RatePerHour);
            $("#NDLegalHolidayRestdayTotalMin").val(myval);
            AddtoRate();
            Addtotable("18", duration, RestDayRate, myval, val);
            $('#NDLegalHolidayRestdaytime').val("");
            $('#NDLegalHolidayRestdayTotalMin').val("");
        });

        $("#NDReguralOTtime").focusout(function () {
            var val = "NDRG OT"
            var RestDayRate = document.getElementById('NDReguralOT').value;
            var duration = document.getElementById('NDReguralOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeNDRGOTTime(duration, RestDayRate, RatePerHour);
            $("#NDReguralOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("19", duration, RestDayRate, myval, val);
            $('#NDReguralOTtime').val("");
            $('#NDReguralOTTotalMin').val("");
        });
        $("#NDRestDayOTtime").focusout(function () {
            var val = "NDRD OT"
            var RestDayRate = document.getElementById('NDRestDayOT').value;
            var duration = document.getElementById('NDRestDayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeNDRGOTTime(duration, RestDayRate, RatePerHour);
            $("#NDRestDayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("20", duration, RestDayRate, myval, val);
            $('#NDReguralOTtime').val("");
            $('#NDRestDayOTTotalMin').val("");
        });
        $("#NDSpecialHolidayOTtime").focusout(function () {
            var val = "NDSH OT"
            var RestDayRate = document.getElementById('NDSpecialHolidayOT').value;
            var duration = document.getElementById('NDSpecialHolidayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeNDRGOTTime(duration, RestDayRate, RatePerHour);
            $("#NNDSpecialHolidayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("21", duration, RestDayRate, myval, val);
            $('#NDSpecialHolidayOTtime').val("");
            $('#NNDSpecialHolidayOTTotalMin').val("");
        });
        $("#NDLegalHolidayOTtime").focusout(function () {
            var val = "NDLH OT"
            var RestDayRate = document.getElementById('NDLegalHolidayOT').value;
            var duration = document.getElementById('NDLegalHolidayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeNDRGOTTime(duration, RestDayRate, RatePerHour);
            $("#NDLegalHolidayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("22", duration, RestDayRate, myval, val);
            $('#NDLegalHolidayOTtime').val("");
            $('#NDLegalHolidayOTTotalMin').val("");
        });
        $("#NDSpecialHolidayRestdayOTtime").focusout(function () {
            var val = "NDSH RDOT"
            var RestDayRate = document.getElementById('NDSpecialHolidayRestdayOT').value;
            var duration = document.getElementById('NDSpecialHolidayRestdayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeNDRGOTTime(duration, RestDayRate, RatePerHour);
            $("#NDSpecialHolidayRestdayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("23", duration, RestDayRate, myval, val);
            $('#NDLegalHolidayOTtime').val("");
            $('#NDLegalHolidayOTTotalMin').val("");
        });
        $("#NDLegalHolidayRestdayOTtime").focusout(function () {
            var val = "NDLH RDOT"
            var RestDayRate = document.getElementById('NDLegalHolidayRestdayOT').value;
            var duration = document.getElementById('NDLegalHolidayRestdayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeNDRGOTTime(duration, RestDayRate, RatePerHour);
            $("#NDLegalHolidayRestdayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("24", duration, RestDayRate, myval, val);
            $('#NDLegalHolidayRestdayOTtime').val("");
            $('#NDLegalHolidayRestdayOTTotalMin').val("");
        });

        function ComputeRateTime(duration, RestDayRate, RatePerHour) {

            var Rates = RatePerHour * RestDayRate;

            time = duration.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * Rates;

            var ratepermin = 0;

            if (min == 0) {
                ratepermin = 0;
            }
            else {
                ratepermin = Rates / 60;
            }

            var totalRatePerMinRestDay = ratepermin * min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin;
            return totalRateRestday.toFixed(2);
        }

        function ComputeRateNDTime(duration, RestDayRate, RatePerHour) {

            var Rates = RatePerHour * RestDayRate * 1.10;

            time = duration.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * Rates;

            var ratepermin = 0;

            if (min == 0) {
                ratepermin = 0;
            }
            else {
                ratepermin = Rates / 60;
            }

            var totalRatePerMinRestDay = ratepermin + min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin;
            return totalRateRestday.toFixed(2);
        }

        function ComputeNDRGOTTime(duration, RestDayRate, RatePerHour) {

            var Rates = RatePerHour * RestDayRate * 1.10;

            time = duration.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * Rates;

            var ratepermin = 0;

            if (min == 0) {
                ratepermin = 0;
            }
            else {
                ratepermin = Rates / 60;
            }

            var totalRatePerMinRestDay = ratepermin * min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin;
            return totalRateRestday.toFixed(2);
        }


        function ComputeRateNDHolTime(duration, RestDayRate, RatePerHour) {

            var Rates = RatePerHour * RestDayRate * 1.10;

            time = duration.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * Rates;

            var ratepermin = 0;

            if (min == 0) {
                ratepermin = 0;
            }
            else {
                ratepermin = Rates / 60;
            }

            var totalRatePerMinRestDay = ratepermin + min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin - RatePerHour;
            return totalRateRestday.toFixed(2);
        }


        function AddtoRate() {
            $("#RGOTAmount").val("");
            var $ReguralTotalMin = parseFloat($("#ReguralTotalMin").val().replace(",", ".")) || 0;
            var $RestDayTotalMin = parseFloat($("#RestDayTotalMin").val().replace(",", ".")) || 0;
            var $SpecialHolidayTotalMin = parseFloat($("#SpecialHolidayTotalMin").val().replace(",", ".")) || 0;
            var $LegalHolidayTotalMin = parseFloat($("#LegalHolidayTotalMin").val().replace(",", ".")) || 0;
            var $SpecialHolidayRestdayTotalMin = parseFloat($("#SpecialHolidayRestdayTotalMin").val().replace(",", ".")) || 0;
            var $LegalHolidayRestdayTotalMin = parseFloat($("#LegalHolidayRestdayTotalMin").val().replace(",", ".")) || 0;
            var $ReguralOTTotalMin = parseFloat($("#ReguralOTTotalMin").val().replace(",", ".")) || 0;
            var $RestDayOTTotalMin = parseFloat($("#RestDayOTTotalMin").val().replace(",", ".")) || 0;
            var $SpecialHolidayOTTotalMin = parseFloat($("#SpecialHolidayOTTotalMin").val().replace(",", ".")) || 0;
            var $LegalHolidayOTTotalMin = parseFloat($("#LegalHolidayOTTotalMin").val().replace(",", ".")) || 0;
            var $SpecialHolidayRestdayOTTotalMin = parseFloat($("#SpecialHolidayRestdayOTTotalMin").val().replace(",", ".")) || 0;
            var $LegalHolidayRestdayOTTotalMin = parseFloat($("#LegalHolidayRestdayOTTotalMin").val().replace(",", ".")) || 0;

            var $NDReguralTotalMin = parseFloat($("#NDReguralTotalMin").val().replace(",", ".")) || 0;
            var $NDRestDayTotalMin = parseFloat($("#NDRestDayTotalMin").val().replace(",", ".")) || 0;
            var $NDSpecialHolidayTotalMin = parseFloat($("#NDSpecialHolidayTotalMin").val().replace(",", ".")) || 0;
            var $NDLegalHolidayTotalMin = parseFloat($("#NDLegalHolidayTotalMin").val().replace(",", ".")) || 0;
            var $NDSpecialHolidayRestdayTotalMin = parseFloat($("#NDSpecialHolidayRestdayTotalMin").val().replace(",", ".")) || 0;
            var $NDLegalHolidayRestdayTotalMin = parseFloat($("#NDLegalHolidayRestdayTotalMin").val().replace(",", ".")) || 0;
            var $NDReguralOTTotalMin = parseFloat($("#NDReguralOTTotalMin").val().replace(",", ".")) || 0;
            var $NDRestDayOTTotalMin = parseFloat($("#NDRestDayOTTotalMin").val().replace(",", ".")) || 0;
            var $NDRestDayOTTotalMin = parseFloat($("#NDRestDayOTTotalMin").val().replace(",", ".")) || 0;
            var $NDLegalHolidayOTTotalMin = parseFloat($("#NDLegalHolidayOTTotalMin").val().replace(",", ".")) || 0;
            var $NDSpecialHolidayRestdayOTTotalMin = parseFloat($("#NDSpecialHolidayRestdayOTTotalMin").val().replace(",", ".")) || 0;
            var $NDLegalHolidayRestdayOTTotalMin = parseFloat($("#NDLegalHolidayRestdayOTTotalMin").val().replace(",", ".")) || 0;

            var RGOTOtalTAmount = $ReguralTotalMin + $RestDayTotalMin + $SpecialHolidayTotalMin + $LegalHolidayTotalMin + $SpecialHolidayRestdayTotalMin + $LegalHolidayRestdayTotalMin + $ReguralOTTotalMin + $RestDayOTTotalMin + $SpecialHolidayOTTotalMin + $LegalHolidayOTTotalMin + $SpecialHolidayRestdayOTTotalMin + $LegalHolidayRestdayOTTotalMin + $NDReguralTotalMin + $NDRestDayTotalMin + $NDSpecialHolidayTotalMin + $NDLegalHolidayTotalMin + $NDSpecialHolidayRestdayTotalMin + $NDLegalHolidayRestdayTotalMin + $NDReguralOTTotalMin + $NDRestDayOTTotalMin + $RestDayOTTotalMin + $SpecialHolidayOTTotalMin + $NDLegalHolidayOTTotalMin + $NDSpecialHolidayRestdayOTTotalMin + $NDLegalHolidayRestdayOTTotalMin;
            $("#RGOTAmount").val(RGOTOtalTAmount.toFixed(2));
        }

        function Addtotable(idnum, duration, RestDayRate, RatePerHour,val) {
            var $EmpId = $('#EmpId').val();
            var $attid = $('#attid').val();
            var $duration = duration;
            var $RestDayRate = RestDayRate;
            var $RatePerHour = RatePerHour;

            if ($duration === '' || $RestDayRate === '' || $RatePerHour === '') { return; }

            var datacount = OTdataTable.rows().count();
            var itemno = datacount + 1;
            abp.notify.success(val + ' added!', 'Success');
            OTdataTable.row.add([idnum, $EmpId, $attid, val,$RestDayRate, $duration, $RatePerHour,'']).draw();           
            computeTotalOt();
        }
        var OTdataTable = _$OTTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    "visible": true,
                    targets: [0]
                },
                {

                    "visible": false,
                    orderable: true,
                    targets: [1]
                },
                {
                    "visible": false,
                    orderable: true,
                    targets: [2]
                },
                {
                    orderable: true,
                    targets: [3]
                },
                {
                    orderable: true,
                    targets: [4]
                },
                {
                    orderable: true,
                    targets: [5]
                },

                {
                    orderable: true,
                    targets: [6]
                },
                {
                    data: null,
                    className: "text-center",
                    "render": function () {
                        return '<a id="delete-otitem" class="delete-otitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                    },
                    orderable: true,
                    targets: [7]
                }
            ]
        });
        _$OTTable.on('click', 'a.delete-otitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$OTTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotalOt();
        });

        function computeTotalOt() {
            var rgotamount = 0;
            OTdataTable.column(6).data()
                .each(function (value, index) {
                    var rgamount = parseFloat(value);
                    rgotamount = rgotamount + rgamount;
                });

            $('#RGOTAmount').val(currencyFormat(rgotamount));
        }
        //BASIC SALARY
        $("#BasicSalaryCurrent").focusout(function () {
            BasicSalaryCurrent();
        });
        $("#BasicSalaryCurrent").change(function () {
            BasicSalaryCurrent();
        });

        function BasicSalaryCurrent() {

            var $Current = parseFloat(jQuery("#BasicSalaryCurrent").val().replace(",", ".")) || 0;
            var $RateDay = parseFloat(jQuery("#RatePerDay").val().replace(",", ".")) || 0;
            var $RatePerMonth = parseFloat(jQuery("#RatePerMonth").val().replace(",", ".")) || 0;

            //console.log(currencyFormat($RatePerMonth));
            if ($('#SalaryPeriodid').val() == 3) {
                var BasicSalaryAmount = $RatePerMonth / 2;
            }
            else if ($('#SalaryPeriodid').val() != 3) {
                var BasicSalaryAmount = $Current * $RateDay;
            }
            //console.log(currencyFormat(BasicSalaryAmount));
            $("#BasicSalaryAmount").val(currencyFormat(BasicSalaryAmount));
        }
        
        function getAtt() {
            $('#btnSavePayroll').prop("disabled", false);
            var $startdate = $('#startdate').val();
            var $enddate = $('#enddate').val();
            var $EmpId = $('#EmpCode').val();
            var $attid = $('#attid').val();

            var $CutOff = $('#CutOff').val();

            if ($CutOff == "") {
                abp.notify.error('Select cut off');
                return;
            }
            _bioAtt2Service.getAttRecordList({ filter: $startdate + '|' + $enddate + '|' + $EmpId + '|' + $attid }).done(function (result) {

                dataTableAtt.clear().draw();
                for (var i = 0; i < result.items.length; i++) {
                    var $attId = result.items[i].attId;
                    var $Datev = result.items[i].datev;
                    var dt = new Date($Datev);
                    var $Ddate = getFormattedDate(dt);

                    var $Days = result.items[i].day;
                    if ($Days.length > 3) {
                        var $aDays = $Days.substring(0, 3);

                        if ($aDays === "Sun" || $aDays === "Sat") {
                            var $Ddays = '<a href="#" class="text-warning font-weight-bold">' + $aDays + '</a>';
                        }
                        else { var $Ddays = $aDays; }
                    }
                    var $status2 = result.items[i].status2;//workers
                    var $status3 = result.items[i].status3;//change sched
                    var $description1 = result.items[i].description1;//sched desc
                    var $holidays = result.items[i].holidays;
                    var $TimeIn = result.items[i].timeIn;
                    var $LunchOut = result.items[i].lunchOut;
                    var $LunchIn = result.items[i].lunchIn;
                    var $TimeOut = result.items[i].timeOut;

                    var $flexiTime = result.items[i].flexiTime;
                    var $status1 = result.items[i].status1;

                    var $aMIn = result.items[i].amIn;
                    var $breakOut = result.items[i].breakOut;
                    var $breakIn = result.items[i].breakIn;
                    var $pmOut = result.items[i].pmOut;
                    var $amLateIn = result.items[i].amLateIn;
                    var $amLAteEndIn = result.items[i].amLAteEndIn;
                    var $totalRows2 = result.items[i].totalRows2;
                    var $descriptionhol = result.items[i].description2;
                    var $percent = result.items[i].description3;
                    var $shift = result.items[i].description4;
                    
                    var $NDFTime = "22:00";

                    //@* Holiday *@
                    if ($descriptionhol !== "" || $descriptionhol !== null)
                    { 
                        //close by wilson Holidays
                        //if ($Days !== "Sunday")
                        //{                            
                        //    if ($descriptionhol == "Legal Holiday")
                        //    {
                        //        var HalAmt = $('#HolidayAmount').val() || 0;
                        //        var Holcountfinal = $('#HolidayCurrent').val();
                        //        var $Holcountcnt1 = 0;
                        //        var Holratefinal1 = $('#RatePerDay').val();

                        //        if (Holcountfinal == "") { Holcountfinal = 0;}
                        //        var Holrate = $percent * Holratefinal1;
                        //        var Holcount = 1;
                        //        $Holcountcnt1 = parseInt(Holcount) + parseInt(Holcountfinal);
                        //        $('#HolidayCurrent').val($Holcountcnt1);

                        //        Holratefinal = parseFloat(Holrate) + parseFloat(HalAmt);
                        //        //Holratefinal = (parseFloat(Holratefinal1) * parseFloat(Holrate)) + parseFloat(HalAmt);
                        //        $('#HolidayAmount').val(Holratefinal);
                        //    }
                        //    if ($descriptionhol == "Special Holiday")
                        //    { 
                        //        if (salaryperiod !== "1" || salaryperiod !== "2")
                        //        {
                        //            if ($aMIn !== "" || $TimeOut !== null)
                        //            {
                        //                var HalAmt2 = $('#HolidayAmount').val() || 0;
                        //                var Holcountfinal = $('#HolidayCurrent').val();
                        //                var $Holcountcnt2 = 0;
                        //                var Holrate = $('#RatePerDay').val();

                        //                if (Holcountfinal == "") { Holcountfinal = 0; }
                        //                var Holrate2 = $percent * Holrate ;
                        //                var Holcount2 = 1;
                        //                $Holcountcnt2 = parseInt(Holcount2) + parseInt(Holcountfinal);
                        //                $('#HolidayCurrent').val($Holcountcnt2);

                        //                Holratefinal2 = parseFloat(Holrate2) + parseFloat(HalAmt2);
                        //                //Holratefinal2 = (parseFloat(Holratefinal2) * parseFloat(Holrate2)) + parseFloat(HalAmt2);
                        //                $('#HolidayAmount').val(cutNumber(Holratefinal2, 2));
                        //            }
                        //            else
                        //            {
                        //                $('#HolidayCurrent').val("");
                        //                $('#HolidayAmount').val("");
                        //            }
                        //        }
                        //        else if (salaryperiod == "4" || salaryperiod == "3")
                        //        {
                        //            var HalAmt2 = $('#HolidayAmount').val() || 0;
                        //            var Holcountfinal = $('#HolidayCurrent').val();
                        //            var $Holcountcnt2 = 0;

                        //            if (Holcountfinal == "") { Holcountfinal = 0; }
                        //            var Holrate2 = ".30";
                        //            var Holcount2 = 1;
                        //            $Holcountcnt2 = parseInt(Holcount2) + parseInt(Holcountfinal);
                        //            $('#HolidayCurrent').val($Holcountcnt2);

                        //            var Holratefinal2 = $('#RatePerDay').val();
                        //            Holratefinal2 = (parseFloat(Holratefinal2) * parseFloat(Holrate2)) + parseFloat(HalAmt2);
                        //            $('#HolidayAmount').val(cutNumber(Holratefinal2, 2));
                        //        }
                        //    }
                        //}
                        //close by wilson Holidays
                    } 

                    if ($Days == "Sunday") {
                        var $totalRows = ""                        
                    }
                    else
                    {
                        var $totalRows = result.items[i].totalRows;
                    }
                    //@* Latecounts *@
                    if ($aMIn != "" || $aMIn !== null)
                    {
                        if ($status2 == 2) {
                            var $Lates = "";
                        }
                        if ($status2 == 0 || $status2 == 1)
                        {
                            console.log("Status3 ="+ $status3);
                            if ($status3 == 0) {
                                if (new Date("1970-1-1 " + $TimeIn) > new Date("1970-1-1 " + $amLateIn)) {
                                    var stime = $TimeIn.split(':');
                                    var shrs = parseInt(stime[0], 10);
                                    var smin = parseInt(stime[1], 10);
                                    var hrstomin = shrs * 60 + smin;

                                    var etime = $aMIn.split(':');
                                    var ehrs = parseInt(etime[0], 10);
                                    var emin = parseInt(etime[1], 10);
                                    var erstomin = ehrs * 60 + emin;

                                    var dLates = hrstomin - erstomin;

                                    if (dLates > 5) {
                                        if (dLates > 15) {
                                            var dailyLates = dLates / 15;
                                            var str = dailyLates.toString().split('.');
                                            numarray1 = parseInt(str[0]);
                                            numarray2 = '.' + str[1];
                                            if (numarray2 > .5) {
                                                addmin = 1;
                                            }
                                            else {
                                                addmin = 0;
                                            }
                                            var $Lates = numarray1 + addmin;
                                        }
                                        else {
                                            var $Lates = 1;
                                        }
                                    }
                                }
                                else {
                                    var $Lates = "";
                                }
                            }
                            else
                            {
                                var $Lates = "";
                            }
                        }                        
                    }
                    else
                    {
                        var $Lates = "";
                    }

                    //@* MLates *@
                    if ($aMIn != "" || $aMIn !== null) {
                        if ($status2 == 2) {
                            var $MLates = "";
                        }
                        if ($status2 == 0 || $status2 == 1) {
                            if ($status3 == 0)
                            {
                                if (new Date("1970-1-1 " + $TimeIn) > new Date("1970-1-1 " + $amLateIn)) {
                                    start = $aMIn.split(":");
                                    end = $TimeIn.split(":");
                                    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                                    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                                    var diff = endDate.getTime() - startDate.getTime();
                                    var hours = Math.floor(diff / 1000 / 60 / 60);
                                    diff -= hours * 1000 * 60 * 60;
                                    var minutes = Math.floor(diff / 1000 / 60);
                                    var $MLates = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
                                }
                                else {
                                    var $MLates = "";
                                }
                            }
                            else {
                                var $MLates = "";
                            }

                            
                        }                        
                    }
                    else
                    {
                        var $MLates = "";
                    }

                    //@* Undertime *@
                    if ($TimeOut !== "" || $TimeOut !== null) {
                        if ($status2 == 2)
                        {
                            var $UnderTime = "";
                        }
                        if ($status2 == 0) {
                            if ($status3 == 0) {
                                if ($Days == "Saturday")
                                {
                                    var $Out = "12:00"
                                    if (new Date("1970-1-1 " + $pmOut) < new Date("1970-1-1 " + $Out))
                                    {
                                        start = $Out.split(":");
                                        end = $pmOut.split(":");
                                        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                                        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                                        var diff = endDate.getTime() - startDate.getTime();
                                        var hours = Math.floor(diff / 1000 / 60 / 60);
                                        diff -= hours * 1000 * 60 * 60;
                                        var minutes = Math.floor(diff / 1000 / 60);
                                        var $UnderTime = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
                                    }
                                    else
                                    {
                                        var $UnderTime = "";
                                    }
                                }
                                else
                                { 
                                    if (new Date("1970-1-1 " + $pmOut) > new Date("1970-1-1 " + $TimeOut))
                                    {
                                        start = $TimeOut.split(":");
                                        end = $pmOut.split(":");
                                        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                                        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                                        var diff = endDate.getTime() - startDate.getTime();
                                        var hours = Math.floor(diff / 1000 / 60 / 60);
                                        diff -= hours * 1000 * 60 * 60;
                                        var minutes = Math.floor(diff / 1000 / 60);
                                        var $UnderTime = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
                                        //console.log("undertime :" + $UnderTime);
                                    }
                                    else
                                    {
                                        var $UnderTime = "";
                                    }
                                }
                            }
                            if ($status3 == 1) {
                                var $UnderTime = "";
                            }
                        }
                        if ($status2 == 1) {
                            if ($status3 == 0) {
                                if (new Date("1970-1-1 " + $pmOut) > new Date("1970-1-1 " + $TimeOut)) {
                                    start = $TimeOut.split(":");
                                    end = $pmOut.split(":");
                                    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                                    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                                    var diff = endDate.getTime() - startDate.getTime();
                                    var hours = Math.floor(diff / 1000 / 60 / 60);
                                    diff -= hours * 1000 * 60 * 60;
                                    var minutes = Math.floor(diff / 1000 / 60);
                                    var $UnderTime = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;                                    
                                }
                                else
                                {
                                    var $UnderTime = "";
                                }
                            }
                            if ($status3 == 1) {
                                var $UnderTime = "";
                            }
                        }                        
                    }
                    else
                    {
                        var $UnderTime = "";
                    }
                    //@* Undertime *@


                    //@* NightDiff *@                    
                    if ($TimeIn !== "" && $TimeIn !== null && $TimeIn !== "null" && $TimeOut !== "" && $TimeOut !== null && $TimeOut !== "null") {
                        if ($shift != 0) {
                            if (new Date("1970-1-1 " + $TimeOut) < new Date("1970-1-1 " + $TimeIn)) {
                                //console.log("out greater than in " + $TimeOut + "<" + $TimeIn);
                                if ($status3 == 0) {
                                    var $ndf = "";
                                }
                                else {
                                    var day1diff = "02:00";
                                    var day2diff = "06:00";
                                    var day3diff = "04:00";
                                    if (new Date("1970-1-1 " + $TimeIn) < new Date("1970-1-1 " + $NDFTime)) {
                                        //s
                                        var $Timein1 = $TimeIn;
                                        var $day3diff1 = day3diff;
                                        prodhrdArr1 = $Timein1.split(":");
                                        conprodArr1 = $day3diff1.split(":");
                                        var hh11 = parseInt(prodhrdArr1[0]) + parseInt(conprodArr1[0]);
                                        var mm11 = parseInt(prodhrdArr1[1]) + parseInt(conprodArr1[1]);

                                        if (mm11 > 59) {
                                            var mm2 = mm11 % 60;
                                            var mmx = mm11 / 60;
                                            var mm3 = parseInt(mmx);//add into hour
                                            var hh11 = parseInt(hh11) + parseInt(mm3);
                                            var mm11 = mm2;
                                        }
                                        var finaladd1 = ('0' + hh11).slice(-2) + ':' + ('0' + mm11).slice(-2);
                                        console.log("BREAKTIME HIGHER THAN 10:00pm " + $TimeIn + " + " + day3diff + " = " + finaladd1);

                                        if (finaladd1 > $NDFTime) {
                                            var prodhrd = day1diff;
                                            var conprod = $TimeOut;
                                            prodhrdArr = prodhrd.split(":");
                                            conprodArr = conprod.split(":");
                                            var hh1 = parseInt(prodhrdArr[0]) + parseInt(conprodArr[0]) - 1;
                                            var mm1 = parseInt(prodhrdArr[1]) + parseInt(conprodArr[1]);

                                            if (mm1 > 59) {
                                                var mm2 = mm1 % 60;
                                                var mmx = mm1 / 60;
                                                var mm3 = parseInt(mmx);//add into hour
                                                var hh1 = parseInt(hh1) + parseInt(mm3);
                                                var mm1 = mm2;
                                            }
                                            var finaladd = ('0' + hh1).slice(-2) + ':' + ('0' + mm1).slice(-2);
                                            var $ndf = finaladd;

                                            //var NDFMinusBreak = finaladd1;
                                            //prodhrdArr2 = NDFMinusBreak.split(":");
                                            //var hour = parseInt(prodhrdArr2[0]) - 1;
                                            //var minutes = parseInt(prodhrdArr2[1]);
                                            //if (minutes > 59) {
                                            //    var mm2 = minutes % 60;
                                            //    var mmx = minutes / 60;
                                            //    var mm3 = parseInt(mmx);//add into hour
                                            //    var hour = parseInt(hour);
                                            //    var minutes = mm2;
                                            //}
                                            //var MnusBreak = ('0' + hour).slice(-2) + ':' + ('0' + minutes).slice(-2);
                                            //console.log("MINUS 1 HOUR HIGHER THAN 10:00pm " + MnusBreak);
                                        }
                                        else
                                        //s
                                        {
                                            var prodhrd = day1diff;
                                            var conprod = $TimeOut;
                                            prodhrdArr = prodhrd.split(":");
                                            conprodArr = conprod.split(":");
                                            var hh1 = parseInt(prodhrdArr[0]) + parseInt(conprodArr[0]);
                                            var mm1 = parseInt(prodhrdArr[1]) + parseInt(conprodArr[1]);

                                            if (mm1 > 59) {
                                                var mm2 = mm1 % 60;
                                                var mmx = mm1 / 60;
                                                var mm3 = parseInt(mmx);//add into hour
                                                var hh1 = parseInt(hh1) + parseInt(mm3);
                                                var mm1 = mm2;
                                            }
                                            var finaladd = ('0' + hh1).slice(-2) + ':' + ('0' + mm1).slice(-2);
                                            var $ndf = finaladd;
                                        }
                                    }
                                    else {
                                        var $ndf = "00:00";
                                        //console.log("in higher than NDF " + $TimeIn + ">" + $NDFTime);
                                    }
                                }

                            }
                            else {
                                if ($status3 == 0) {
                                    if (new Date("1970-1-1 " + $TimeOut) > new Date("1970-1-1 " + $NDFTime)) {
                                        start = $NDFTime.split(":");
                                        end = $TimeOut.split(":");
                                        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                                        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                                        var diff = endDate.getTime() - startDate.getTime();
                                        var hours = Math.floor(diff / 1000 / 60 / 60);
                                        diff -= hours * 1000 * 60 * 60;
                                        var minutes = Math.floor(diff / 1000 / 60);
                                        var $ndf = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
                                        //console.log("out greater than NDF " + $ndf);
                                    }
                                    else {
                                        var $ndf = "";
                                    }
                                }
                                else {
                                    if (new Date("1970-1-1 " + $TimeOut) < new Date("1970-1-1 " + $NDFTime)) {
                                        start = $NDFTime.split(":");
                                        end = $TimeOut.split(":");
                                        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
                                        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
                                        var diff = endDate.getTime() - startDate.getTime();
                                        var hours = Math.floor(diff / 1000 / 60 / 60);
                                        diff -= hours * 1000 * 60 * 60;
                                        var minutes = Math.floor(diff / 1000 / 60);
                                        var $ndf = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
                                        //console.log("out greater than NDF " + $ndf);
                                    }
                                    else {
                                        var $ndf = "";
                                    }
                                }

                            }
                        }
                        else {
                            var $ndf = "";
                        }
                    }
                    else
                    {
                        var $ndf = "";
                    }

                    var salaryperiod = $('#SalaryPeriodid').val();
                    if (salaryperiod == "3" || salaryperiod == "4")
                    {
                        var $attId2 = $attId + $holidays;
                        
                        if ($attId2 == "" || $attId2 == null || $TimeIn == null || $TimeIn == 0)
                        {
                            if ($Days !== "Sunday")
                            {
                                var abcount = parseFloat(jQuery("#AbsensesCurrent").val()) || 0;
                                var absent = abcount + 1;
                                $('#AbsensesCurrent').val(absent);
                            }
                        }
                    }

                    dataTableAtt.row.add([$attId, $Ddate, $Ddays, $holidays, $TimeIn, $LunchOut, $LunchIn, $TimeOut, $flexiTime, $aMIn, $breakOut, $breakIn, $pmOut, $amLateIn, $amLAteEndIn, $Lates, $MLates, $UnderTime, $ndf, $totalRows2, $totalRows, $status2, $status3, $description1, $descriptionhol, $percent]).draw();
                    disperse();
                    abp.ui.clearBusy(_$EmpAttIdRec);
                    abp.ui.clearBusy(_$EmpPayrollRec); 
                }

                TardinessCurrentOut();
            });
        }

        var dataTableAtt = _$AttRecTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    orderable: true,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
                },
                {
                    className: 'text-left',
                    //targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25]
                },
                {
                    "visible": false,
                    targets: [0, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20,21,22,23,24,25]
                }
            ]
        });

        function disperse() {
            //var ndf = "00:00";
            //dataTableAtt.column(17).data()
            //    .each(function (value, index) {
            //        if (value.trim().length > 0)
            //        {
            //            ndf = ndf + ' / ' + value;
            //        }
            //    });

            //console.log(ndf);

            //DAILY
            var salaryperiod = $('#SalaryPeriodid').val();
            if (salaryperiod == "1" || salaryperiod == "2")
            {
                var Daycnt = 0
                dataTableAtt.column(19).data().each(function (value, index)
                {
                    if (value !== 0)
                    {
                        var $Daycnt = 1;
                        Daycnt = Daycnt + $Daycnt;

                        $('#BasicSalaryCurrent').val(Daycnt);
                        BasicSalaryCurrent();
                    }
                });
            }
            else if (salaryperiod == "4" || salaryperiod == "3")
            {
                var AbsentCounts = $('#AbsensesCurrent').val();
                if (AbsentCounts !== "") {
                    BasicSalaryCurrent();
                    Absentcount();
                }
                else {
                    BasicSalaryCurrent();
                }
            }  
            //END DAILY

            //Holiday
            //var salaryperiod = $('#SalaryPeriodid').val();
            //if (salaryperiod == "1" || salaryperiod == "2") {
            //    var Daycnt = 0
            //    dataTableAtt.column(19).data().each(function (value, index) {
            //        if (value !== 0) {
            //            var $Daycnt = 1;
            //            Daycnt = Daycnt + $Daycnt;

            //            $('#BasicSalaryCurrent').val(Daycnt);
            //            BasicSalaryCurrent();
            //        }
            //    });
            //}
            //else if (salaryperiod == "4" || salaryperiod == "3") {
            //    var AbsentCounts = $('#AbsensesCurrent').val();
            //    if (AbsentCounts !== "") {
            //        BasicSalaryCurrent();
            //        Absentcount();
            //    }
            //}
            //Holiday

            //NIGHTDIFF
            var finaltimendf = $('#NightDiffCurrent').val();
            dataTableAtt.column(18).data().each(function (value, index)
            {
                //NightDiffCurrentCurrent();
                if (value.trim().length !== "") {

                    if (finaltimendf == "") {
                        finaltimendf = "00:00";
                    }
                    if (value == "") {
                        value = "00:00";
                    }

                    var start = finaltimendf.split(":");
                    var t1Hr = parseInt(start[0]);
                    var t1Min = parseInt(start[1]);

                    var end = value.split(":");
                    var t2Hr = parseInt(end[0]);
                    var t2Min = parseInt(end[1]);

                    var rHr = t1Hr + t2Hr;
                    var rMin = t1Min + t2Min;
                    if (rMin >= 60) {
                        rMin = rMin - 60;
                        rHr = rHr + 1;
                    }
                    if (rMin < 10) rMin = "0" + rMin;
                    if (rHr < 10) rHr = "0" + rHr;
                    var AllNdf =  rHr + ":" + rMin;
                        
                    $('#NightDiffCurrent').val(AllNdf);
                    NightDiffCurrentCurrent();
                }
            });
            //END NIGHTDIFF

            //UTIME
            var finaltime = $('#UndertimeCurrent').val();
            dataTableAtt.column(17).data().each(function (value, index) {
                if (value.trim().length !== "") {

                    if (finaltime == "") {
                        finaltime = "00:00";
                    }
                    if (value == "") {
                        value = "00:00";
                    }

                    var start = finaltime.split(":");
                    var t1Hr = parseInt(start[0]);
                    var t1Min = parseInt(start[1]);

                    var end = value.split(":");
                    var t2Hr = parseInt(end[0]);
                    var t2Min = parseInt(end[1]);

                    var rHr = t1Hr + t2Hr;
                    var rMin = t1Min + t2Min;
                    if (rMin >= 60) {
                        rMin = rMin - 60;
                        rHr = rHr + 1;
                    }
                    if (rMin < 10) rMin = "0" + rMin;
                    if (rHr < 10) rHr = "0" + rHr;
                    var AllUdt = rHr + ":" + rMin;

                    $('#UndertimeCurrent').val(AllUdt);
                    //console.log("UT: "+ AllUdt);
                    undertimeCurrentOut();
                }
            });
            //END NIGHTDIFF

            //Lates
            var LateCount = $('#TardinessDeductionLate').val();
            var LateCount = 0;
            dataTableAtt.column(15).data()
                .each(function (value, index) {
                    if (value == "") {
                        value = "0";
                    }
                    //var $LateCount = parseInt(value);
                    //LateCount = LateCount + $LateCount;

                    //$('#TardinessDeductionLate').val(LateCount);
                    //console.log("UT: " + Alllates);
                    //TardinessCurrentOut();
            });
            //END Lates   

            //Lates
            var finaltimetc = $('#TardinessCurrent').val();
            dataTableAtt.column(16).data().each(function (value, index) {
                if (value.trim().length !== "") {

                    if (finaltimetc == "") {
                        finaltimetc = "00:00";
                    }
                    if (value == "") {
                        value = "00:00";
                    }

                    var start = finaltimetc.split(":");
                    var t1Hr = parseInt(start[0]);
                    var t1Min = parseInt(start[1]);

                    var end = value.split(":");
                    var t2Hr = parseInt(end[0]);
                    var t2Min = parseInt(end[1]);

                    var rHr = t1Hr + t2Hr;
                    var rMin = t1Min + t2Min;
                    if (rMin >= 60) {
                        rMin = rMin - 60;
                        rHr = rHr + 1;
                    }
                    if (rMin < 10) rMin = "0" + rMin;
                    if (rHr < 10) rHr = "0" + rHr;
                    var Alllates = rHr + ":" + rMin;

                    $('#TardinessCurrent').val(Alllates);
                    //console.log("UT: " + Alllates);
                    //TardinessCurrentOut();
                }
            });
            //END Lates 
        }

        //NIGHT DIFF 
        $("#NightDiffCurrent").focusout(function () {

            NightDiffCurrentCurrent();
        });

        function NightDiffCurrentCurrent() {
            var OTNDrate = '0.10';

            var $RatePerHour = parseFloat(jQuery("#RatePerHour").val().replace(",", ".")) || 0;
            var $NightDiffAdjustment = parseFloat(jQuery("#NightDiffAdjustment").val().replace(",", ".")) || 0;
            var $NightDiffAmount = $RatePerHour * OTNDrate;
            $('#NightDiffAdjustment').val(cutNumber($NightDiffAmount, 2));

            var $NightDiffCurrent = parseFloat(jQuery("#NightDiffCurrent").val().replace(",", ".")) || 0;
            var $NightDiffAdjustment2 = parseFloat(jQuery("#NightDiffAdjustment").val().replace(",", ".")) || 0;
            var $NightDiffAmount3 = $NightDiffCurrent * $NightDiffAdjustment2;

            $('#NightDiffAmount').val(cutNumber($NightDiffAmount3, 2));
        }

        //TRAVEL HOURS
        $("#TravelhoursCurrent").focusout(function () {
            Travelhourscount();
        });
        function Travelhourscount() {
            var $Current = parseFloat(jQuery("#TravelhoursCurrent").val().replace(",", ".")) || 0;
            var $RatePehour = parseFloat(jQuery("#TravelhoursAdjustment").val().replace(",", ".")) || 0;
            var TravelhoursAmount = $Current * $RatePehour;
            $("#TravelhoursAmount").val(TravelhoursAmount.toFixed(2));
        }      
        //TRAVEL HOURS
        $("#HolidayCurrent").focusout(function () {
            HolidayCurrentcount();
        });
        function HolidayCurrentcount() {
            var $Current = parseFloat(jQuery("#HolidayCurrent").val().replace(",", ".")) || 0;
            var $RatePehour = parseFloat(jQuery("#HolidayAdjustment").val().replace(",", ".")) || 0;
            var HolidayhoursAmount = $Current * $RatePehour;
            $("#HolidayAmount").val(HolidayhoursAmount.toFixed(2));
        }  
        //ABSENT
        $("#AbsensesCurrent").focusout(function () {
            Absentcount();
        });
        function Absentcount() {
            var $Current = parseFloat(jQuery("#AbsensesCurrent").val().replace(",", ".")) || 0;
            var $RateDay = parseFloat(jQuery("#RatePerDay").val().replace(",", ".")) || 0;
            var AbsensesAmount = $Current * $RateDay;
            $("#AbsensesAmount").val(AbsensesAmount.toFixed(2));
        }
        //TIREDINESS
        $("#TardinessCurrent").focusout(function () {
            TardinessCurrentOut();
        });
        function TardinessCurrentOut() {
            var TardCurrent = 0;
            var $Current = jQuery("#TardinessCurrent").val() || "00:00";
            var $TardinessAjustment = parseFloat(jQuery("#TardinessAjustment").val().replace(",", ".")) || 0;

            time = $Current.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * 60 + min;

            var Lateamount = hrstomin * $TardinessAjustment;
            var amtlate = TardCurrent + Lateamount;
            console.log(amtlate);
            $("#TardinessAmount").val(currencyFormat(amtlate));
            //var $Current = document.getElementById('TardinessCurrent').value;
            //var $TardinessAjustment = parseFloat(jQuery("#TardinessAjustment").val().replace(",", ".")) || 0;
            //var $RatePerHour = document.getElementById('RatePerHour').value;

            //time = $Current.split(':');
            //if (time == "") { return }
            //hrs = parseInt(time[0], 10);
            //min = parseInt(time[1], 10);
            //var hrstomin = hrs * 60 + min;

            //if (hrstomin > 5 && hrstomin < 14) {
            //    hrstomin = 15;
            //}
            //var fullmin = hrstomin / 15;
            //var str = fullmin.toString().split('.');
            //numarray1 = str[0];
            //numarray2 = str[1];
            //var FullAmt15min = numarray1 * $TardinessAjustment;
            //var AmntLess15min = $RatePerHour / 60 * numarray2;
            //var FullLateRateAmt = FullAmt15min + "." + AmntLess15min;
            //$("#TardinessAmount").val(parseInt(FullLateRateAmt).toFixed(2));
        }

        //Undertime
        $("#UndertimeCurrent").focusout(function () {
            undertimeCurrentOut();
        });
        function undertimeCurrentOut() {
            var $Current = document.getElementById('UndertimeCurrent').value;
            var $RatePerMin = document.getElementById('UndertimeAdjustment').value;
            time = $Current.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * 60 + min;
            var FullAmt15min = hrstomin * $RatePerMin;
            $("#UndertimeAmount").val(parseInt(FullAmt15min).toFixed(2));
        }
        //Leave
        $("#LeaveUse").focusout(function () {
            var $Current = document.getElementById('LeaveUse').value;
            var $LeaveAmout = document.getElementById('LeaveAmout').value;
            var hrstomin = $Current * $LeaveAmout;
            //$("#LeaveTotalAmout").val(parseInt(hrstomin).toFixed(2));

            $("#LeaveTotalAmout").val(currencyFormat(hrstomin));
        });

        //AttAdjustment
        var AttIdrecord = $('#AttIdrecord');
        AttIdrecord.empty();
        _bioAttendanceService.getAllAtt().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                AttIdrecord.append('<option value=' + result.items[i].dateT + '>' + result.items[i].attendanceId + '</option>');
            }
            AttIdrecord.selectpicker('refresh');
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
        });
        $('#AttIdrecord').change(function (e) {
            e.preventDefault();
            var Date1 = $('#AttIdrecord').val();
            var Date2 = new Date(Date1);
            var DateT = Date2.getMonth() + 1 + '/' + Date2.getDate() + '/' + Date2.getFullYear();
            $('#DateT').datepicker("setDate", DateT);
        });

        var AdjType = $('#AdjType');
        AdjType.empty();
        _attAdjustmentService.getAllType().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                AdjType.append('<option value=' + result.items[i].id + '>' + result.items[i].types + '</option>');
            }
            AdjType.selectpicker('refresh');
            $('#AdjType').selectpicker('val', 0)
        });
        //--Salary
        $('#AddAttAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                addattadj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }
            
        });
        function addattadj()
        {
            var $AttIdrecord = $('#attid').val(); 
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();
            var $AttAdjDescription = $('#AttAdjDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();
            if ($plusminus == 2)
            {
                var $AttAdjAmount = '-'+$('#AttAdjAmount').val();
            }
            else
            {
                var $AttAdjAmount = $('#AttAdjAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', '']).draw();
            abp.notify.success('Attendance Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Salary

        //--Absent
        $('#AddAttAbsentAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                AddAttAbsentAdj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }

        });
        $("#AttAbsent").focusout(function () {
            var $AttAbsent = document.getElementById('AttAbsent').value;
            var $AbsensesAdjustment = document.getElementById('AbsensesAdjustment').value;
            var $AbsentAmt = $AttAbsent * $AbsensesAdjustment;
            $("#AttAbsentAmount").val(parseInt($AbsentAmt).toFixed(2));
        });
        function AddAttAbsentAdj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttAbsentDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();
            var $AttAbsent = $('#AttAbsent').val();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttAbsentAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttAbsentAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttAbsent, '']).draw();
            abp.notify.success('Attendance Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Absent

        //--Tardiness
        $('#AddAttTardinesAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                AddAttTardinesAdj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }
        });
        $("#AttTardines").focusout(function () {
            var $Current = document.getElementById('AttTardines').value;
            var $TardinessAjustment = parseFloat(jQuery("#TardinessAjustment").val().replace(",", ".")) || 0;
            var $RatePerHour = document.getElementById('RatePerHour').value;

            time = $Current.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * 60 + min;

            if (hrstomin > 5 && hrstomin < 14) {
                hrstomin = 15;
            }
            var fullmin = hrstomin / 15;
            var str = fullmin.toString().split('.');
            numarray1 = str[0];
            numarray2 = str[1];
            var FullAmt15min = hrstomin * $TardinessAjustment;
            var AmntLess15min = $RatePerHour / 60 * numarray2;
            var FullLateRateAmt = FullAmt15min + "." + AmntLess15min;
            $("#AttTardinesAmount").val(currencyFormat(FullAmt15min));
        });
        function AddAttTardinesAdj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttTardinesDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();

            var $AttTardines = $('#AttTardines').val();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttTardinesAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttTardinesAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttTardines, '']).draw();
            abp.notify.success('Tardiness Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Tardiness

        //--Undertime
        $('#AddAttUnderTimeAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                AddUnderTimeAdj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }
        });
        $("#AttUnderTime").focusout(function () {
            var $Current = document.getElementById('AttUnderTime').value;
            var $RatePerMin = document.getElementById('UndertimeAdjustment').value;
            time = $Current.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * 60 + min;
            var FullAmt15min = hrstomin * $RatePerMin;
            $("#AttUnderTimeAmount").val(parseInt(FullAmt15min).toFixed(2));
        });
        function AddUnderTimeAdj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttUnderTimeDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();
            var $AttUnderTime = $('#AttUnderTime').val();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttUnderTimeAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttUnderTimeAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttUnderTime, '']).draw();
            abp.notify.success('Undertime Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Undertime

        //--Leave
        $('#AddAttLeaveAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                AddLeaveAdj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }
        });
        $("#AttLeave").focusout(function () {
            var $Current = document.getElementById('AttLeave').value;
            var $LeaveAmout = document.getElementById('LeaveAmout').value;
            var hrstomin = $Current * $LeaveAmout;
            $("#AttLeaveAmount").val(hrstomin);
        });
        function AddLeaveAdj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttLeaveDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();

            var $AttLeave = $('#AttLeave').val();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttLeaveAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttLeaveAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttLeave, '']).draw();
            abp.notify.success('Leave Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Leave

        //--Allowance
        $('#AddAttAlwnce').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                addAlwnceadj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }

        });
        function addAlwnceadj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttAlwnceDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttAlwnceAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttAlwnceAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', '']).draw();
            abp.notify.success('Allowance Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Allowance

        //--Others
        $('#AddAttOthrs').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                addOthrsadj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }

        });
        function addOthrsadj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttOthrsDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttOthrsAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttOthrsAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', '']).draw();
            abp.notify.success('Other Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--Others

        //--OT
        $('#AddAttOTAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                var $desc = $('#AttOTDescription option:selected').text() + " / " + $('#AttOT').val();
                AddOTAdj($desc);
            }
            else {
                alert("Select Add/Deduct");
                return;
            }
        });
        $("#AttOT").focusout(function () {
            if ($('#AttOTDescription').val() == "Regural Rates") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('Regural').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Rest Day") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('RestDay').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Special Holiday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('SpecialHoliday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Legal Holiday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('LegalHoliday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "SpHol Restday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('SpecialHolidayRestday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "LgHol Restday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('LegalHolidayRestday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Regural Rates OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('ReguralOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Rest Day OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('RestDayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Special Holiday OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('SpecialHolidayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "Legal Holiday OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('LegalHolidayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "SpHol Restday OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('SpecialHolidayRestdayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "LgHol Restday OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('LegalHolidayRestdayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = RegRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            //ND
            if ($('#AttOTDescription').val() == "ND Basic Rates") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDRegural').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND Rest Day") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDRestDay').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND Special Holiday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDSpecialHoliday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND Legal Holiday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDLegalHoliday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND SpHol Restday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDSpecialHolidayRestday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND LgHol Restday") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDLegalHolidayRestday').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND RG Rates OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDReguralOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND RD OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDRestDayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND LH OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDSpecialHolidayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND SHRD OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDSpecialHolidayRestdayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            if ($('#AttOTDescription').val() == "ND LHRD OT") {
                var duration = document.getElementById('AttOT').value;
                var dayRate = document.getElementById('NDLegalHolidayRestdayOT').value;
                var ratePerHour = document.getElementById('RatePerHour').value;
                var myval = NDRateTime(duration, dayRate, ratePerHour);
                $("#AttOTAmount").val(myval);
            }
            
        });

        function RegRateTime(duration, dayRate, ratePerHour) {

            var Rates = ratePerHour * dayRate;

            time = duration.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * Rates;

            var ratepermin = 0;

            if (min == 0) {
                ratepermin = 0;
            }
            else {
                ratepermin = Rates / 60;
            }

            var totalRatePerMinRestDay = ratepermin + min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin;
            return totalRateRestday.toFixed(2);
        }
        function NDRateTime(duration, dayRate, RatePerHour) {

            var Rates = RatePerHour * dayRate * 1.10;

            time = duration.split(':');
            if (time == "") { return }
            hrs = parseInt(time[0], 10);
            min = parseInt(time[1], 10);
            var hrstomin = hrs * Rates;

            var ratepermin = 0;

            if (min == 0) {
                ratepermin = 0;
            }
            else {
                ratepermin = Rates / 60;
            }

            var totalRatePerMinRestDay = ratepermin + min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin;
            return totalRateRestday.toFixed(2);
        }
        function AddOTAdj(desc) {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttOT = $('#AttOT').val();
            ///dpat ipasa as var
            var $AttAdjDescription = desc;
            var $Description1 = $('#AttIdrecord option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttOTAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttOTAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttOT, '']).draw();
            abp.notify.success('Overtime Adjustment ' + $AttAdjDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttAdjDescription').val("");
            $('#AttAdjAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
        }
        //--OT

        //--Day
        $('#AddAttDaysAdj').click(function (e) {
            e.preventDefault();
            if ($("#plusminus").val() != "") {
                AddAttDaysAdj();
            }
            else {
                alert("Select Add/Deduct");
                return;
            }

        });
        $("#AttDays").focusout(function () {
            var $AttDays = document.getElementById('AttDays').value;
            var $AbsensesAdjustment = document.getElementById('AbsensesAdjustment').value;
            var $DaysAmt = $AttDays * $AbsensesAdjustment;
            $("#AttDaysAmount").val(parseInt($DaysAmt).toFixed(2));
        });
        function AddAttDaysAdj() {
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttDaysDescription = $('#AttDaysDescription').val();
            var $Description1 = $('#AttIdrecord option:selected').text();
            var $AttDays = $('#AttDays').val();
            if ($plusminus == 2) {
                var $AttDaysAmount = '-' + $('#AttDaysAmount').val();
            }
            else {
                var $AttDaysAmount = $('#AttDaysAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AttAdjTable.rows().count();
            var itemno = datacount + 1;

            AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttDaysDescription, $AttDaysAmount, $Description1, $AttDays, '']).draw();
            abp.notify.success('Attendance Adjustment ' + $AttDaysDescription + ' added!', 'Success');
            computeTotal();
            $('#AttIdrecord').selectpicker('val', "");
            $('#DateT').datepicker("setDate", 0);
            $('#AdjType').selectpicker('val', 0);
            $('#plusminus').selectpicker('val', "");
            $('#AttDaysDescription').val("");
            $('#AttDaysAmount').val("");
            $('#AdjType').val("");
            $('#AdjTypeId').val("");
            $('#AttDays').val("");
        }
        //--Absent

        var AttAdjTable = _$AttAdjTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    "visible": false,
                    targets: [0]
                },
                {
                    orderable: true,
                    targets: [1]
                },
                {
                    orderable: false,
                    targets: [2]
                },
                {
                    "visible": false,
                    orderable: true,
                    targets: [3]
                },
                {
                    orderable: true,
                    targets: [4]
                },
                {
                    "visible": false,
                    orderable: true,
                    targets: [5]
                },
                {
                    orderable: true,
                    targets: [6]
                },
                {
                    orderable: true,
                    targets: [7]
                },
                {
                    orderable: true,
                    targets: [8]
                },
                {
                    "visible": false,
                    orderable: true,
                    targets: [9]
                },
                {
                    "visible": false,
                    orderable: true,
                    targets: [10]
                },
                {
                    data: null,
                    className: "text-center",
                    "render": function () {
                        return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                    },
                    orderable: true,
                    targets: [11]
                }
            ]
        });
        _$AttAdjTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$AttAdjTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        //AttAdjustment

        //Allowance
        function GetGeneralAmountRecord(EmpId) {
            $('#GeneralAmount').val('0.00')
            $('#GeneralCurrent').val('0.00')
            _employeeAllowanceService.getTop1EmpAllowance({ empId: EmpId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++)
                {
                    var amt = parseFloat(jQuery("#GeneralAmount").val().replace(",", ".")) || 0;
                    var $Current = parseFloat(jQuery("#BasicSalaryCurrent").val().replace(",", ".")) || 0;
                    var $deminimis = result.items[i].deminimis;
                    var $today = new Date().toDateString();
                    var $startDate = new Date(result.items[i].startDate).toDateString();
                    var $endDate = new Date(result.items[i].endDate).toDateString();
                    if ($deminimis == true) {
                        if ($startDate > $today) {
                            var Period = result.items[i].period;
                            if (Period == 1) {
                                var cmpamout = parseInt(result.items[i].amount || 0) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 2) {
                                var cmpamout = parseInt(result.items[i].amount || 0) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 3) {
                                var cmpamout = parseInt(result.items[i].amount || 0) / 2;
                                var total = amt + cmpamout;
                            }
                            if (Period == 4) {
                                if ($('#CutOffid').val() == 1) {
                                    var cmpamout = parseInt(result.items[i].amount);
                                    var total = amt + cmpamout;
                                }
                            }
                        }
                    }
                    if ($deminimis == false) {
                        if ($startDate > $today && $endDate < $today) {
                            var Period = result.items[i].period;
                            if (Period == 1) {
                                var cmpamout = parseInt(result.items[i].amount) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 2) {
                                var cmpamout = parseInt(result.items[i].amount) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 3) {
                                var cmpamout = parseInt(result.items[i].amount) / 2;
                                var total = amt + cmpamout;
                            }
                            if (Period == 4) {
                                if ($('#CutOffid').val() == 1) {
                                    var cmpamout = parseInt(result.items[i].amount);
                                    var total = amt + cmpamout;
                                }
                            }
                        }
                    }

                    //$('#NONGeneralCurrent').val();
                    $('#GeneralAmount').val(total);
                }
                //6
                GetNonGeneralAmountRecord($("#EmpId").val());
            });

        }
        function GetNonGeneralAmountRecord(EmpId) {
            $('#NONGeneralAdjustment').val('0.00')
            $('#NONGeneralAmount').val('0.00')
            $('#NONGeneralCurrent').val('0.00')
            _employeeAllowanceService.getNonTaxEmpAllowance({ empId: EmpId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++)
                {
                    var amt = parseFloat(jQuery("#NONGeneralAmount").val().replace(",", ".")) || 0;
                    var $Current = parseFloat(jQuery("#BasicSalaryCurrent").val().replace(",", ".")) || 0;
                    var $deminimis = result.items[i].deminimis;
                    var $today = new Date().toDateString();
                    var $startDate = new Date(result.items[i].startDate).toDateString();
                    var $endDate = new Date(result.items[i].endDate).toDateString();
                    if ($deminimis == true)
                    {
                        if (Date.parse($startDate) < Date.parse($today)) {
                            var Period = result.items[i].period;
                            if (Period == 1) {
                                var cmpamout = parseInt(result.items[i].amount) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 2) {
                                var cmpamout = parseInt(result.items[i].amount) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 3) {
                                var cmpamout = parseInt(result.items[i].amount) / 2;
                                var total = amt + cmpamout;
                            }
                            if (Period == 4) {
                                if ($('#CutOffid').val() == 1) {
                                    var cmpamout = parseInt(result.items[i].amount);
                                    var total = amt + cmpamout;
                                }
                            }
                        }
                        
                    }
                    if ($deminimis == false)
                    {
                        if ($startDate < $today && $endDate > $today ) {
                            var Period = result.items[i].period;
                            if (Period == 1) {
                                var cmpamout = parseInt(result.items[i].amount) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 2)
                            {
                                var cmpamout = parseInt(result.items[i].amount) / 2 / 13 * $Current;
                                var total = amt + cmpamout;
                            }
                            if (Period == 3) {
                                var cmpamout = parseInt(result.items[i].amount) / 2;
                                var total = amt + cmpamout;
                            }
                            if (Period == 4) {
                                if ($('#CutOffid').val() == 1)
                                {
                                    var cmpamout = parseInt(result.items[i].amount);
                                    var total = amt + cmpamout;
                                }
                            }
                        }
                    }
                    $('#NONGeneralAmount').val(currencyFormat(total));
                }
                //7
                getAtt();
            });
        }
        //Computer Gross
        $('#Compute').click(function (e) {
            e.preventDefault();
            if ($('#CutOff').val() == "" || $('#CutOff').val() == "0") {
                abp.notify.error('Select cut off');
                return;
            }
            abp.ui.setBusy(_$EmpAttIdRec);
            abp.ui.setBusy(_$EmpPayrollRec);
            $('#TaxableAmount').val("");
            $('#Percent').val("");
            $('#NetIncome').val("");
            var BasicSalaryAmount = parseFloat(jQuery("#BasicSalaryAmount").val().replace(",", "")) || 0;
            var LeaveTotalAmout = parseFloat(jQuery("#LeaveTotalAmout").val().replace(",", "")) || 0;
            var RGOTAmount = parseFloat(jQuery("#RGOTAmount").val().replace(",", ".")) || 0;
            var AllowanceAdjs = parseFloat(jQuery("#AllowanceAdjs").val().replace(",", ".")) || 0;
            var AttAdjs = parseFloat(jQuery("#AttAdjs").val().replace(",", ".")) || 0;
            var GeneralAmount = parseFloat(jQuery("#GeneralAmount").val().replace(",", ".")) || 0;
            var NONGeneralAmount = parseFloat(jQuery("#NONGeneralAmount").val().replace(",", "")) || 0;
            var NightDiffAmount = parseFloat(jQuery("#NightDiffAmount").val().replace(",", ".")) || 0;
            //var NightDiffval = parseFloat(jQuery("#NightDiffval").val().replace(",", ".")) || 0;

            var HolidayAmount = parseFloat(jQuery("#HolidayAmount").val().replace(",", ".")) || 0;
            var TravelhoursAmount = parseFloat(jQuery("#TravelhoursAmount").val().replace(",", ".")) || 0;
            var AbsensesAmount = parseFloat(jQuery("#AbsensesAmount").val().replace(",", ".")) || 0;
            var TardinessAmount = parseFloat(jQuery("#TardinessAmount").val().replace(",", ".")) || 0;
            var UndertimeAmount = parseFloat(jQuery("#UndertimeAmount").val().replace(",", ".")) || 0;

            var GrossIncome = BasicSalaryAmount + LeaveTotalAmout + RGOTAmount + AllowanceAdjs + AttAdjs + GeneralAmount + NONGeneralAmount + NightDiffAmount + TravelhoursAmount + HolidayAmount;
            var GrossDeduction = AbsensesAmount + TardinessAmount + UndertimeAmount;
            var GrossTotalIncome = GrossIncome - GrossDeduction;
            $('#GrossAmount').val(currencyFormat(GrossTotalIncome));

            SSSContribution();
            //GetSSSRecord($('#GrossAmount').val());

        });

        //CONTRIBUTION
        function GetSSSRecord(PayrollMonthly) {
            _empAttRecordService.getSSS({ sSSAmount: PayrollMonthly }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $ER = result.items[i].er;
                    var $EE = result.items[i].ee;
                    var $total = result.items[i].total;
                    $('#SSSCurrent').val(currencyFormat($total / 2));
                    $('#SSSAdjustment').val(currencyFormat($ER / 2));
                    $('#SSSAmount').val(currencyFormat($EE / 2));
                }
            });
        }
        function GetPhilHealthRecord() {
            _empAttRecordService.getPhilHealth().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    var Percent = result.items[i].percent;
                    var $Percent = Percent / 100;
                    var RatePerMonth = parseFloat(jQuery("#RatePerMonth").val().replace(",", ".")) || 0;
                    var TotaPhilHealthContri = RatePerMonth * $Percent;

                    $('#PhilhealthCurrent').val(currencyFormat(TotaPhilHealthContri / 2));
                    var TotaPhilHealthShare = (currencyFormat(TotaPhilHealthContri / 2));
                    $('#PhilhealthAmount').val(currencyFormat(TotaPhilHealthShare / 2));
                    $('#PhilhealthAdjustment').val(currencyFormat(TotaPhilHealthShare / 2));
                }
            });
        }
        function GetPagibigRecord() {
            _empAttRecordService.getPagibig().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //var $percent = result.items[i].percent;
                    var $amount = result.items[i].amount;
                    var share = parseFloat($amount) / 2;
                    computeShare = parseFloat(share / 2);
                    $('#PagibigCurrent').val(currencyFormat(share));
                    $('#PagibigAjustment').val(currencyFormat(computeShare));
                    $('#PagibigAmount').val(currencyFormat(computeShare));
                }
            });
        }

        //CONTRIBUTION 2
        $('#CutOff').change(function () {
            var AttId = $('#attid').val();
            if ($('#CutOff').val() == 1) {
                console.log($('#CutOff').val());
                var mnt = AttId.substr(4, 2);
                $('#months').val(mnt)
            }
            if ($('#CutOff').val() == 2) {
                console.log($('#CutOff').val());
                var mnt = AttId.substr(0, 2);
                $('#months').val(mnt)
            }
            $('#ContributionAmount').val("0.00");
            $('#GrossAmount').val("0.00");
            $('#GeneralAmount').val("0.00");
            $('#GeneralCurrent').val("0.00");
            $('#NONGeneralAmount').val("0.00");
            $('#NONGeneralCurrent').val("0.00");
            $('#AbsensesCurrent').val("");
            $('#UndertimeCurrent').val("");
            $('#CutOffid').val($('#CutOff').val());
            clearTextRate();            
            //GetGeneralAmountRecord($("#EmpId").val());
            //GetNonGeneralAmountRecord($("#EmpId").val());
        });

        function SSSContribution() {
            var $id = $('#EmpId').val();
            _empContributionService.getDetailEmpContributions({ empId: $id }).done(function (result) {

                if (result === null) {
                    $('#SSSCurrent').val("");
                    $('#SSSAdjustment').val("");
                    $('#SSSAmount').val("");
                    $('#PagibigAmount').val("");
                    $('#PagibigAdjustment').val("");
                    $('#PagibigCurrent').val("");
                    $('#PhilhealthAmount').val("");
                    $('#PhilhealthAdjustment').val("");
                    $('#PhilhealthCurrent').val("");
                }
                else {
                    //SSContribution();
                    var $ssschk = result.sssCheck;
                    var $sssType = result.sssType;
                    var $sssCutOff = result.sssCutOff;

                    $('#SSSCurrent').val("");
                    $('#SSSAdjustment').val("");
                    $('#SSSAmount').val("");
                    if ($ssschk == true) {
                        if ($sssType == 1 || $sssType == 3) {
                            if ($sssCutOff == $('#CutOff').val()) {
                                //$("#SSSCutOff").val(result.sssCutOff).trigger("change");
                                $('#SSSAmount').val(currencyFormat(result.sssee));
                                $('#SSSAdjustment').val(currencyFormat(result.ssser));
                                $('#SSSCurrent').val(currencyFormat(result.sssec));
                            }

                        }
                        else if ($sssType == 2) {
                            var payrollgross = $('#GrossAmount').val();
                            _empAttRecordService.getSSS({ sSSAmount: payrollgross }).done(function (result) {
                                for (var i = 0; i < result.items.length; i++) {
                                    var $ee = result.items[i].ee;
                                    var $er = result.items[i].er;
                                    var $ERC = result.items[i].erc;
                                    $('#SSSCurrent').val("");
                                    $('#SSSAdjustment').val("");
                                    $('#SSSAmount').val("");
                                    //$("#SSSCutOff").val(result.sssCutOff).trigger("change");

                                    if ($sssCutOff == 1 && $('#CutOff').val() == 1) {
                                        $('#SSSAmount').val(currencyFormat($ee));
                                        $('#SSSAdjustment').val(currencyFormat($er));
                                        $('#SSSCurrent').val(currencyFormat($ERC));
                                    }
                                    else if ($sssCutOff == 2 && $('#CutOff').val() == 2) {
                                        $('#SSSAmount').val(currencyFormat($ee));
                                        $('#SSSAdjustment').val(currencyFormat($er));
                                        $('#SSSCurrent').val(currencyFormat($ERC));
                                    }
                                    else if ($sssCutOff == 3) {
                                        $('#SSSAmount').val($ee.toFixed(2) / 2);
                                        $('#SSSAdjustment').val($er.toFixed(2) / 2);
                                        $('#SSSCurrent').val($ERC.toFixed(2) / 2);
                                    }

                                }
                            });
                        }

                    }

                    //PagibigContribution();
                    var $pagibigCheck = result.pagibigcheck;
                    var $pagibigType = result.pagibigType;
                    var $pagibigCutOff = result.pagibigCutOff;
                    $('#PagibigAmount').val("");
                    $('#PagibigAdjustment').val("");
                    $('#PagibigCurrent').val("");
                    if ($pagibigCheck == true) {
                        if ($pagibigType == 1 || $pagibigType == 3) {
                            if ($pagibigCutOff == $('#CutOff').val()) {
                                //$("#PagibigCutOff").val(result.pagibigCutOff).trigger("change");
                                $('#PagibigAmount').val(currencyFormat(result.pagibigEC));
                                $('#PagibigAdjustment').val(currencyFormat(result.pagibigER));
                                $('#PagibigCurrent').val(currencyFormat(result.pagibigECC));
                            }
                        }
                        else if ($pagibigType == 2) {
                            if ($pagibigCutOff == 1 && $('#CutOff').val() == 1) {
                                $('#PagibigAmount').val(currencyFormat(result.pagibigEC));
                                $('#PagibigAdjustment').val(currencyFormat(result.pagibigER));
                                $('#PagibigCurrent').val(currencyFormat(result.pagibigECC));
                            }
                            else if ($pagibigCutOff == 2 && $('#CutOff').val() == 2) {
                                $('#PagibigAmount').val(currencyFormat(result.pagibigEC));
                                $('#PagibigAdjustment').val(currencyFormat(result.pagibigER));
                                $('#PagibigCurrent').val(currencyFormat(result.pagibigECC));
                            }
                            else if ($pagibigCutOff == 3) {
                                $('#PagibigAmount').val(result.pagibigEC / 2);
                                $('#PagibigAdjustment').val(result.pagibigER / 2);
                                $('#PagibigCurrent').val(result.pagibigECC / 2);
                            }
                        }
                    }

                    //PhilhealthContribution();
                    var $philHealthcheck = result.philHealthcheck;
                    var $philHealthType = result.philHealthType;
                    var $philHealthCutOff = result.philHealthCutOff;
                    $('#PhilhealthAmount').val("");
                    $('#PhilhealthAdjustment').val("");
                    $('#PhilhealthCurrent').val("");
                    if ($philHealthcheck == true) {
                        if ($philHealthType == 1 || $philHealthType == 3) {
                            if ($philHealthCutOff == 1 && $('#CutOff').val() == 1) {
                                $('#PhilhealthAmount').val(currencyFormat(result.philHealthEC));
                                $('#PhilhealthAdjustment').val(currencyFormat(result.philHealthER));
                                $('#PhilhealthCurrent').val(currencyFormat(result.philHealthECC));
                            }
                            if ($philHealthCutOff == 2 && $('#CutOff').val() == 2) {
                                $('#PhilhealthAmount').val(currencyFormat(result.philHealthEC));
                                $('#PhilhealthAdjustment').val(currencyFormat(result.philHealthER));
                                $('#PhilhealthCurrent').val(currencyFormat(result.philHealthECC));
                            }
                            if ($philHealthCutOff == 3) {
                                $('#PhilhealthAmount').val(result.philHealthEC / 2);
                                $('#PhilhealthAdjustment').val(result.philHealthER / 2);
                                $('#PhilhealthCurrent').val(result.philHealthECC / 2);
                            }
                        }
                        else if ($philHealthType == 2) {
                            if ($philHealthCutOff == 1 && $('#CutOff').val() == 1) {
                                $('#PhilhealthAmount').val(result.philHealthEC);
                                $('#PhilhealthAdjustment').val(result.philHealthER);
                                $('#PhilhealthCurrent').val(result.philHealthECC);
                            }
                            else if ($philHealthCutOff == 2 && $('#CutOff').val() == 2) {
                                $('#PhilhealthAmount').val(result.philHealthEC);
                                $('#PhilhealthAdjustment').val(result.philHealthER);
                                $('#PhilhealthCurrent').val(result.philHealthECC);
                            }
                            else if ($philHealthCutOff == 3) {
                                $('#PhilhealthAmount').val(result.philHealthEC / 2);
                                $('#PhilhealthAdjustment').val(result.philHealthER / 2);
                                $('#PhilhealthCurrent').val(result.philHealthECC / 2);
                            }
                        }
                    }
                }
                $('#ContributionAmount').val("");

            })
            abp.ui.clearBusy(_$EmpAttIdRec);
            abp.ui.clearBusy(_$EmpPayrollRec);
        }
        //CONTRIBUTION 2

        //Compute Allowance
        $('#ComputeContribution').click(function (e) {
            e.preventDefault();
            $('#TaxableAmount').val("");
            $('#Percent').val("");
            $('#NetIncome').val("");
            var SSSCurrent = parseFloat(jQuery("#SSSAmount").val().replace(",", "")) || 0;
            var PhilhealthCurrent = parseFloat(jQuery("#PhilhealthAmount").val().replace(",", "")) || 0;
            var PagibigCurrent = parseFloat(jQuery("#PagibigAmount").val().replace(",", "")) || 0;

            var TotalContribution = SSSCurrent + PhilhealthCurrent + PagibigCurrent;
            $('#ContributionAmount').val(currencyFormat(TotalContribution));

            //GetSSSLoanRecord();
            GetPagibigLoanRecord();
            GetOtherLoanRecord();
            
            GetSSSAppLoanRecord();
        });
        $('#BtnAllowanceAdjstment').click(function (e) {
            e.preventDefault();
            $("#AllowanceAdjstment").modal('show');
        });
        $('#AddAllowance').click(function (e) {
            e.preventDefault();
            addnewallowance();
        });
        function addnewallowance() {
            var $AllowanceDate = $('#Date').val();
            var $AllowanceDescription = $('#AllowanceDescription').val();
            var $Aallowanceamount = $('#AllowanceAmount').val();

            if ($AllowanceDate === '' || $Aallowanceamount === '' || $AllowanceDescription === '') { return; }

            var datacount = dataTableAllowance.rows().count();
            var itemno = datacount + 1;

            dataTableAllowance.row.add([itemno, $AllowanceDate, $AllowanceDescription, $Aallowanceamount, '']).draw();
            abp.notify.success('Allowance ' + $AllowanceDescription + ' added!', 'Success');
            computeTotal();
        }
        var dataTableAllowance = _$AllowanceTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    "visible": true,
                    targets: [0]
                },
                {
                    orderable: true,
                    targets: [1]
                },
                {
                    orderable: true,
                    targets: [2]
                },
                {
                    orderable: true,
                    targets: [3]
                },
                {
                    data: null,
                    className: "text-center",
                    "render": function () {
                        return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                    },
                    orderable: true,
                    targets: [4]
                }
            ]
        });
        _$AllowanceTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$AllowanceTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });

        //SSS Loans Deduction
        $('#SSSLoanDeduction').click(function (e) {
            e.preventDefault();
            $("#SSSLoanmodal").modal('show');
        });
        function GetSSSLoanRecord() {
            var e = $('#EmpId').val();
            if (e == "") { e = "0" }
            _empAttRecordService.getLoanAmount({ empId: e, loanTitle: 1 }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#SSSLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#SSSLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#SSSLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
                getsssloan();
            });
        }
        function getsssloan() {
            sssdataTable.clear().draw();
            //$('#SSSLoanTable').dataTable().fnClearTable();
            var $d = $('#EmpId').val();
            var $e = '1';
            var $f = $('#CutOff').val();
            if ($f == "1") { $f = "3" }
            if ($f == "2") { $f = "4" }
            _empAttRecordService.getLoanList({ filter: $d + '|' + $e + '|' + $f }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var dt = new Date(result.items[i].dateStart);
                    var $dateStart = getFormattedDate(dt);
                    var $loanAmount = result.items[i].loanAmount;
                    var $loanBalance = result.items[i].loanBalance;
                    var $loanTypeName = result.items[i].loanTypeName;

                    var $dedType = result.items[i].deductionType;
                    if ($dedType == 'Daily') {
                        var $deductionType = 'Both';
                    }
                    if ($dedType == 'Semi-Monthly') {
                        var $deductionType = '1st Cutoff';
                    }
                    if ($dedType == 'Monthly') {
                        var $deductionType = '2nd Cutoff';
                    }

                    var $empLoan = result.items[i].empLoan;
                    var $applicationNo = result.items[i].applicationNo;
                    var sqidatacount = sssdataTable.rows().count();
                    var sqiitemno = sqidatacount + 1;

                    sssdataTable.row.add([sqiitemno,
                        $dateStart,
                        $loanAmount,
                        $loanBalance,
                        $loanTypeName,
                        $deductionType,
                        $empLoan,
                        $applicationNo,
                        '<a id="delete-item" class="delete-item btn btn-outline-primary btn-sm" title="Skip SSS Loan" href="#" ><i class="fa fa-sign-in"></i></a>'
                    ]).draw();
                }
                computeTotal();
            });
        }


        function GetSSSAppLoanRecord() {
            var e = $('#EmpId').val();
            var f = $('#CutOff').val();
            if (e == "") { e = "0" }
            if (f == "1") { f = "3" }
            if (f == "2") { f = "4" }
            _empAttRecordService.getLoanAmountApp({ empId: e, loanTitle: 1, dedId: f }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#SSSLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#SSSLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#SSSLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
                getsssloan();
            });
        }

        var sssdataTable = _$sssloanTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 3,7]
            },
            {
                orderable: false,
                targets: [1, 2,  4, 5, 6, 7]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3, 6]
            }
            ]
        });
        _$sssloanTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$sssloanTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        $('#btnReloadSSS').click(function (e) {
            e.preventDefault();
            getsssloan();
        });

        //Pagibig Loans Deduction
        $('#PagibigLoanDeduction').click(function (e) {
            e.preventDefault();
            $("#PagibigLoanmodal").modal('show');
        });
        function GetPagibigLoanRecord() {
            var e = $('#EmpId').val();
            var f = $('#CutOff').val();
            if (e == "") { e = "0" }
            if (f == "1") { f = "3" }
            if (f == "2") { f = "4" }  
            _empAttRecordService.getLoanAmountApp({ empId: e, loanTitle: 2, dedId: f }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#PagibigLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#PagibigLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#PagibigLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
                getpagibigloan();
            });
        }
        function getpagibigloan() {
            $('#PagibigLoanTable').dataTable().fnClearTable();
            var $d = $('#EmpId').val();
            var $e = '2';
            var $f = $('#CutOff').val();
            if ($f == "1") { $f = "3" }
            if ($f == "2") { $f = "4" }
            _empAttRecordService.getLoanList({ filter: $d + '|' + $e + '|' + $f }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var dt = new Date(result.items[i].dateStart);
                    var $dateStart = getFormattedDate(dt);
                    var $loanAmount = result.items[i].loanAmount;
                    var $loanBalance = result.items[i].loanBalance;
                    var $loanTypeName = result.items[i].loanTypeName;
                    //var $deductionType = result.items[i].deductionType;
                    var $dedType = result.items[i].deductionType;
                    if ($dedType == 'Daily') {
                        var $deductionType = 'Both';
                    }
                    if ($dedType == 'Semi-Monthly') {
                        var $deductionType = '1st Cutoff';
                    }
                    if ($dedType == 'Monthly') {
                        var $deductionType = '2nd Cutoff';
                    }
                    var $empLoan = result.items[i].empLoan;
                    var $applicationNo = result.items[i].applicationNo;
                    var sqidatacount = sssdataTable.rows().count();
                    var sqiitemno = sqidatacount + 1;

                    pagibigdataTable.row.add([sqiitemno,
                        $dateStart,
                        $loanAmount,
                        $loanBalance,
                        $loanTypeName,
                        $deductionType,
                        $empLoan,
                        $applicationNo,
                        '<a id="delete-item" class="delete-item btn btn-outline-primary btn-sm" title="Skip Pagibig Loan" href="#" ><i class="fa fa-sign-in"></i></a>'
                    ]).draw();
                }
                computeTotal();
            });
        }
        var pagibigdataTable = _$pagibigLoanTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 7]
            },
            {
                orderable: false,
                targets: [1, 2, 3, 4, 5, 6, 7]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3, 6]
            }
            ]
        });
        _$pagibigLoanTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$pagibigLoanTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        $('#btnReloadPagibig').click(function (e) {
            e.preventDefault();
            getpagibigloan();
        });

        //Other Loans Deduction
        $('#OtherLoanDeduction').click(function (e) {
            e.preventDefault();
            $("#OtherLoanmodal").modal('show');
        });
        function GetOtherLoanRecord() {
            var e = $('#EmpId').val();
            var f = $('#CutOff').val();
            if (e == "") { e = "0" }
            if (f == "1") { f = "3" }
            if (f == "2") { f = "4" }  
            _empAttRecordService.getLoanAmountApp({ empId: e, loanTitle: 3, dedId: f  }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#OtherLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#OtherLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#OtherLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
                getOtherloan();
            });
        }
        function getOtherloan() {
            $('#OtherLoanmodalTable').dataTable().fnClearTable();
            var $d = $('#EmpId').val();
            var $e = '3';
            var $f = $('#CutOff').val();
            if ($f == "1") { $f = "3" }
            if ($f == "2") { $f = "4" }
            _empAttRecordService.getLoanList({ filter: $d + '|' + $e + '|' + $f }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var dt = new Date(result.items[i].dateStart);
                    var $dateStart = getFormattedDate(dt);
                    var $loanAmount = result.items[i].loanAmount;
                    var $loanBalance = result.items[i].loanBalance;
                    var $loanTypeName = result.items[i].loanTypeName;
                    //var $deductionType = result.items[i].deductionType;
                    var $dedType = result.items[i].deductionType;
                    if ($dedType == 'Daily') {
                        var $deductionType = 'Both';
                    }
                    if ($dedType == 'Semi-Monthly') {
                        var $deductionType = '1st Cutoff';
                    }
                    if ($dedType == 'Monthly') {
                        var $deductionType = '2nd Cutoff';
                    }
                    var $empLoan = result.items[i].empLoan;
                    var $applicationNo = result.items[i].applicationNo;
                    var sqidatacount = sssdataTable.rows().count();
                    var sqiitemno = sqidatacount + 1;

                    otherdataTable.row.add([sqiitemno,
                        $dateStart,
                        $loanAmount,
                        $loanBalance,
                        $loanTypeName,
                        $deductionType,
                        $empLoan,
                        $applicationNo,
                        '<a id="delete-item" class="delete-item btn btn-outline-primary btn-sm" title="Skip Other Loan" href="#" ><i class="fa fa-sign-in"></i></a>'
                    ]).draw();
                }
                computeTotal();
            });
        }
        var otherdataTable = _$OtherLoanmodalTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 7]
            },
            {
                orderable: false,
                targets: [1, 2, 3, 4, 5, 6, 7]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3, 6]
            }
            ]
        });
        _$OtherLoanmodalTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$OtherLoanmodalTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        $('#btnOtherLoan').click(function (e) {
            e.preventDefault();
            getOtherloan();
        });

        //Deduction
        $('#OtherDed').click(function (e) {
            e.preventDefault();
            $("#Others").modal('show');
        });
        $('#AddDeduction').click(function (e) {
            e.preventDefault();
            addnewDeduction();
        });
        function addnewDeduction() {
            var $DedDate = $('#DedDate').val();
            var $DeductionDescription = $('#DeductionDescription').val();
            var $DeductionAmount = parseFloat(jQuery("#DeductionAmount").val() || 0);
            if ($DedDate === '' || $DeductionDescription === '' || $DeductionAmount === '') { return; }

            var datacount = DeductiondataTable.rows().count();
            var itemno = datacount + 1;

            DeductiondataTable.row.add([itemno, $DedDate, $DeductionDescription, $DeductionAmount, '']).draw();
            abp.notify.success('Allowance ' + $DeductionDescription + ' added!', 'Success');
            computeTotal();
        }
        var DeductiondataTable = _$DeductionTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    "visible": true,
                    targets: [0]
                },
                {
                    orderable: true,
                    targets: [1]
                },
                {
                    orderable: true,
                    targets: [2]
                },
                {
                    orderable: true,
                    targets: [3]
                },
                {
                    data: null,
                    className: "text-center",
                    "render": function () {
                        return '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>';
                    },
                    orderable: true,
                    targets: [4]
                }
            ]
        });
        _$DeductionTable.on('click', 'a.delete-item', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$DeductionTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        function computeTotal() {

            var grandtotal = 0;
            dataTableAllowance.column(3).data()
                .each(function (value, index) {
                    var $grandtotal = parseFloat(value);
                    grandtotal = grandtotal + $grandtotal;
                });

            $('#AllowanceAdjs').val(currencyFormat(grandtotal));

            var sssloan = 0;
            sssdataTable.column(6).data()
                .each(function (value, index) {
                    var $emploan = parseFloat(value);
                    sssloan = sssloan + $emploan;
                });
            jQuery('#SSSLoanAmount').val(sssloan.toFixed(2));

            var pagibogloan = 0;
            pagibigdataTable.column(6).data()
                .each(function (value, index) {
                    var $emploan2 = parseFloat(value);
                    pagibogloan = pagibogloan + $emploan2;
                });
            jQuery('#PagibigLoanAmount').val(pagibogloan.toFixed(2));

            var Otherloan = 0;
            otherdataTable.column(6).data()
                .each(function (value, index) {
                    var $emploan3 = parseFloat(value);
                    Otherloan = Otherloan + $emploan3;
                });
            jQuery('#OtherLoanAmount').val(Otherloan.toFixed(2));

            var dedtotal = 0;
            DeductiondataTable.column(3).data()
                .each(function (value, index) {
                    var $grandtotal = parseFloat(value);
                    dedtotal = dedtotal + $grandtotal;
                });
            $('#OtherDeduction').val(currencyFormat(dedtotal));

            var RGOTAmount = 0;
            OTdataTable.column(6).data()
                .each(function (value, index) {
                    var $RGOTAmount = parseFloat(value);
                    RGOTAmount = RGOTAmount + $RGOTAmount;
                });
            jQuery('#RGOTAmount').val(RGOTAmount.toFixed(2));

            var AttAdjAmount = 0;
            AttAdjTable.column(8).data()
                .each(function (value, index) {
                    var $AttAdjAmount = parseFloat(value);
                    AttAdjAmount = AttAdjAmount + $AttAdjAmount;
                });
            jQuery('#AttAdjs').val(AttAdjAmount.toFixed(2));


            $('#AllowanceDescription').val('');
            $('#Date').val('');
            $('#AllowanceAmount').val('');
            $('#DeductionDescription').val('');
            $('#DedDate').val('');
            $('#DeductionAmount').val('');
        }
        $('#ComputeLoans').click(function (e) {
            e.preventDefault();
            abp.ui.setBusy(_$EmpAttIdRec);
            abp.ui.setBusy(_$EmpPayrollRec);

            SSSLoanAmount1 = parseFloat(jQuery("#SSSLoanAmount").val() || 0);
            PagibigLoanAmount1 = parseFloat(jQuery("#PagibigLoanAmount").val() || 0);
            OtherLoanAmount1 = parseFloat(jQuery("#OtherLoanAmount").val() || 0);
            TaxHeld1 = parseFloat(jQuery("#TaxHeld").val() || 0);
            var OtherDeduction1 = parseFloat($("#OtherDeduction").val().replace(",", "")) || 0;
            //var $other = currencyFormat(OtherDeduction1);.replace(",", ".")) || 0;
            LoanAmount = SSSLoanAmount1 + PagibigLoanAmount1 + OtherLoanAmount1 + TaxHeld1 + OtherDeduction1;
            $('#LoansAmount').val(currencyFormat(LoanAmount));

            ComputeTaxableIncome();
        });

         //Taxable
        $('#Period').change(function (e) {
            e.preventDefault();
            var $id = $('#Period').val();
            $('#Periodid').val($id);
        });
        
        function ComputeTaxableIncome() {

            //var Gross = parseFloat(jQuery("#GrossAmount").val() || 0);
            //var Contri = parseFloat(jQuery("#ContributionAmount").val() || 0);
            var Loans = parseFloat(jQuery("#LoansAmount").val() || 0);
            var NonTax = parseFloat(jQuery("#NONGeneralAmount").val() || 0);
            var Gross = parseFloat($('#GrossAmount').val().replace(",", "")) || 0;
            var Contri = parseFloat($('#ContributionAmount').val().replace(",", "")) || 0;
            //taxable amount
            var TaxableAmount1 = Gross - Contri - NonTax;
            $('#TaxableAmount').val(currencyFormat(TaxableAmount1));

            TaxAmount();
        }

        function TaxAmount() {
            var $Period = $('#Periodid').val();
            var PayrollRateAmount = $('#RatePerDay').val();
            var TaxableAmount = $('#TaxableAmount').val();

            $('#Percent').val("");
            $('#NetIncome').val("");
            var PAmount = PayrollRateAmount.replace(",", "") || 0;
            var TAmount = TaxableAmount.replace(",", "") || 0;

            if ($Period == "1") {
                _empAttRecordService.getTaxDaily({ compensation: $Period, sSSAmount: PAmount }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var Percent = result.items[i].percent / 100;
                        var Prescribe = result.items[i].prescribe;
                        var StartAmount = result.items[i].startamount;

                        var Excess = PAmount - StartAmount;
                        var ExcessTimePercent = (Excess * Percent);

                        var BasicSalaryCurrent = parseFloat(jQuery("#BasicSalaryCurrent").val() || 0);
                        var BasicSalaryAdjustment = parseFloat(jQuery("#BasicSalaryAdjustment").val() || 0);
                        var BasicAbsensesCurrent = parseFloat(jQuery("#AbsensesCurrent").val() || 0);
                        var BasicSalaryCount = BasicSalaryCurrent + BasicSalaryAdjustment - BasicAbsensesCurrent;

                        var TaxPerDay = ExcessTimePercent + Prescribe;
                        var Attendance = BasicSalaryCount;

                        $('#Percent').val(TaxPerDay * Attendance);

                        //var Taxblenet = TaxableAmount;

                        if ($Period != "") {
                            var Taxnet = $('#Percent').val();
                        }
                        else {
                            var Taxnet = 0.00
                        }

                        var Loan = $('#LoansAmount').val();
                        var $NONGeneralAmount = $('#NONGeneralAmount').val();
                        var Net = TAmount - Tax.replace(",", "") - Loan.replace(",", "") || 0 + $NONGeneralAmount.replace(",", "") || 0;
                    }
                    //$('#NetIncome').val(Net.toFixed(2));

                    $('#NetIncome').val(currencyFormat(Net));
                });
            }
            if ($Period != "1")
            {
                var $id = $('#EmpId').val();
                _empContributionService.getDetailEmpContributions({ empId: $id }).done(function (result) {
                    if (result === null) {
                        $('#Percent').val("");
                        //$('#LoansAmount').val("");
                        var Loan = $('#LoansAmount').val() || 0;
                        var Tax = $('#Percent').val() || 0;
                        var Net = TaxableAmount - Tax - Loan;
                        $('#NetIncome').val(Net.toFixed(2));
                    }
                    else {
                        var $wTaxcheck = result.wTaxcheck;
                        var $wtaxType = result.wTaxType;
                        var $wtaxCutOff = result.wTaxCutOff;
                        if ($wTaxcheck == true) {
                            if ($wtaxType == 1 || $wtaxType == 3) {
                                if ($wtaxCutOff == 1 && $('#CutOff').val() == 1) {
                                    $('#Percent').val(result.wTaxECC);
                                }
                                if ($wtaxCutOff == 2 && $('#CutOff').val() == 2) {
                                    $('#Percent').val(result.wTaxECC);
                                }
                                if ($wtaxCutOff == 3) {
                                    $('#Percent').val(result.wTaxECC / 2);
                                }
                                var Loan = $('#LoansAmount').val();
                                var Tax2 = $('#Percent').val();
                                if (Tax2 == 0) {
                                    var Tax = '0.00';
                                }
                                
                                var $NONGeneralAmount = $('#NONGeneralAmount').val();
                                var Net = TAmount - Tax.replace(",", "") - Loan.replace(",", "") + parseFloat($NONGeneralAmount);

                                //var Net = TAmount - Tax.replace(",", "") - Loan.replace(",", "") || 0;
                                $('#NetIncome').val(currencyFormat(Net));
                            }
                            else if ($wtaxType == 2) {
                                var Period = $Period;

                                _empAttRecordService.getTax({ compensation: Period, sSSAmount: TaxableAmount }).done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {

                                        var Percent = result.items[i].percent / 100;
                                        var Prescribe = result.items[i].prescribe;
                                        var StartAmount = result.items[i].startamount;

                                        var computeShare = (TAmount - StartAmount) * Percent;
                                        var Tax = Prescribe + computeShare;

                                        if ($wtaxCutOff == 1 && $('#CutOff').val() == 1) {
                                            $('#Percent').val(Tax.toFixed(2));
                                        }
                                        if ($wtaxCutOff == 2 && $('#CutOff').val() == 2) {
                                            $('#Percent').val(Tax.toFixed(2));
                                        }
                                        if ($wtaxCutOff == 3) {
                                            $('#Percent').val(Tax.toFixed(2) / 2);
                                        }
                                    }
                                });
                                var Loan = $('#LoansAmount').val();
                                var Tax = document.getElementById('Percent').value;
                                var $NONGeneralAmount = $('#NONGeneralAmount').val();
                                var Net = TAmount - Tax.replace(",", "") - Loan.replace(",", "") || 0 + $NONGeneralAmount.replace(",", "") || 0;

                                //var Net = TAmount - Tax.replace(",", "") - Loan.replace(",", "") || 0;

                                $('#NetIncome').val(currencyFormat(Net));
                            }
                        }
                    }

                })
            }

            abp.ui.clearBusy(_$EmpAttIdRec);
            abp.ui.clearBusy(_$EmpPayrollRec);
            
        }

        $('#AdjType').change(function (e) {
            e.preventDefault();
            $('#AdjTypeId').val($('#AdjType').val());
            AddSwitch();
        });

        function AddSwitch() {
            if ($('#AdjTypeId').val() == 1) {
                $('#Salary').show();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 2) {
                $('#Salary').hide();
                $('#Absent').show();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 3) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').show();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 4) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').show();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 5) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').show();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 6) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').show();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 7) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').show();
                $('#Othrs').hide();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 8) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').show();
                $('#Days').hide();
            }
            if ($('#AdjTypeId').val() == 9) {
                $('#Salary').hide();
                $('#Absent').hide();
                $('#Tardines').hide();
                $('#UnderTime').hide();
                $('#Lvs').hide();
                $('#OT').hide();
                $('#Alwnce').hide();
                $('#Othrs').hide();
                $('#Days').show();
            }
        }

        $('#btnSavePayroll').click(function (e) {
            e.preventDefault();
            save();
        });

        function save() {
            if (!_$EmpPayrollRec.valid()) {
                return;
            }
            var disabled = _$EmpPayrollRec.find(':input:disabled').removeAttr('disabled');
            var formdata = _$EmpPayrollRec.serializeFormToObject();
            var currentYear = (new Date).getFullYear();
            var $LeaveId = $('#LeaveId').val() || 0; 
            var viewData = {
                payroll: {
                    "absensesAdjustment": formdata.AbsensesAdjustment || 0,
                    "absensesAmount": formdata.AbsensesAmount || 0,
                    "absensesCurrent": formdata.AbsensesCurrent || 0,
                    "allowanceAdjs": formdata.AllowanceAdjs || 0,
                    "attId": formdata.attid,
                    "basicSalaryAdjustment": formdata.BasicSalaryAdjustment,
                    "basicSalaryAmount": formdata.BasicSalaryAmount,
                    "basicSalaryCurrent": formdata.BasicSalaryCurrent,
                    "cutOff": formdata.CutOff,
                    "empId": formdata.EmpId,
                    "generalAmount": formdata.GeneralAmount || 0,
                    "grossAmount": formdata.GrossAmount || 0,
                    "leaveAmout": formdata.LeaveAmout || 0,
                    "leaveTotalAmout": formdata.LeaveTotalAmout || 0,
                    "leaveUse": formdata.LeaveUse || 0,
                    "loansAmount": formdata.LoansAmount || 0,
                    "netIncome": formdata.NetIncome,
                    "nONGeneralAmount": formdata.NONGeneralAmount || 0,
                    "attAdjs": formdata.AttAdjs || 0,
                    "description3": formdata.months || 0,

                    "travelhoursCurrent": formdata.TravelhoursCurrent || 0,
                    "travelhoursAdjustment": formdata.TravelhoursAdjustment || 0,
                    "travelhoursAmount": formdata.TravelhoursAmount || 0,

                    "holidayCurrent": formdata.HolidayCurrent || 0,
                    "holidayAdjustment": formdata.HolidayAdjustment || 0,
                    "holidayAmount": formdata.HolidayAmount || 0,

                    "nightDiffval": formdata.NightDiffval || 0,
                    "nightDiffCurrent": formdata.NightDiffCurrent || 0,
                    "nightDiffAdjustment": formdata.NightDiffAdjustment || 0,
                    "nightDiffAmount": formdata.NightDiffAmount || 0,

                    "otherLoan": formdata.OtherDeduction || 0,
                    "otherLoanAmount": formdata.OtherLoanAmount || 0,
                    "pagibigEEAmount": formdata.PagibigAmount || 0,
                    "pagibigERAmount": formdata.PagibigAdjustment || 0,
                    "pagibigLoanAmount": formdata.PagibigLoanAmount || 0,
                    "pagibigTotalAmount": formdata.PagibigCurrent || 0,
                    "percent": formdata.Percent || 0,
                    "periodid": formdata.Periodid || 0,
                    "salaryPeriod": formdata.SalaryPeriodid || 0,
                    "philhealthEEAmount": formdata.PhilhealthAmount || 0,
                    "philhealthERAmount": formdata.PhilhealthAdjustment || 0,
                    "philhealthTotalAmount": formdata.PhilhealthCurrent || 0,
                    "prescribe": formdata.Prescribe || 0,
                    "rateid": formdata.rateid,
                    "ratePerDay": formdata.RatePerDay,
                    "ratePerHour": formdata.RatePerHour,
                    "ratePerMonth": formdata.RatePerMonth,
                    "rGOTAmount": formdata.RGOTAmount || 0,
                    "sssECAmount": formdata.SSSCurrent || 0,
                    "sssEEAmount": formdata.SSSAmount || 0,
                    "sssERAmount": formdata.SSSAdjustment || 0,
                    "sssLoanAmount": formdata.SSSLoanAmount || 0,
                    "status": 1,
                    "tardinessAjustment": formdata.TardinessAjustment || 0,
                    "tardinessAmount": formdata.TardinessAmount || 0,
                    "tardinessCurrent": formdata.TardinessCurrent || 0,
                    "taxableAmount": formdata.TaxableAmount || 0,
                    "taxHeld": formdata.TaxHeld || 0,
                    "undertimeAdjustment": formdata.UndertimeAdjustment || 0,
                    "undertimeAmount": formdata.UndertimeAmount || 0,
                    "undertimeCurrent": formdata.UndertimeCurrent || 0,
                    "description1": formdata.DeptName,
                    "leaveId": formdata.LeaveId || 0,                  
                    "year": currentYear
                },
                
                otdetails: [],
                allowanceadj: [],
                pgbdetails:[],
                sssdetails: [],
                othrloandetails: [],                
                othrdeddetails: [],
                attadjdetails: []
            };

            disabled.attr('disabled', 'disabled');           

            //otTable
            var ottable = _$OTTable.DataTable();
            var form_ottable = ottable.rows().data();
            var h = form_ottable;
            for (var k = 0; h.length > k; k++) {
                charge = {};
                charge["Index"] = h[k][0];
                charge["EmpId"] = h[k][1];
                charge["AttId"] = h[k][2];
                //charge["Date"] = $.now();             
                charge["Description"] = h[k][3];
                charge["Rate"] = h[k][4];
                charge["Hour"] = h[k][5];
                charge["Amount"] = h[k][6];
                charge["Status"] = "Active";
                viewData.otdetails.push(charge);
            }

            //AllowanceTable
            var allowancetable = _$AllowanceTable.DataTable();
            var form_allowancetable = allowancetable.rows().data();
            var l = form_allowancetable;
            for (var m = 0; l.length > m; m++) {
                charge2 = {};
                charge2["EmpId"] = $('#EmpId').val();
                charge2["AttId"] = $('#attid').val();
                charge2["Index"] = l[m][0];
                charge2["Date"] = l[m][1];
                charge2["Description"] = l[m][2];
                charge2["Amount"] = l[m][3];
                charge2["Status"] = "Active";
                viewData.allowanceadj.push(charge2);
            }

            //sssloanTable
            var ssstable = _$sssloanTable.DataTable();
            var form_data = ssstable.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {

                item3 = {};
                item3["EmpId"] = $('#EmpId').val();
                item3["AttId"] = $('#attid').val();
                item3["AppNo"] = f[i][7];
                item3["StartDate"] = f[i][1];
                item3["Description"] = f[i][4];
                item3["LoanAmount"] = f[i][2];
                item3["Balance"] = f[i][3];
                item3["Period"] = f[i][5];
                item3["Amount"] = f[i][6];
                item3["Status"] = "Active";
                viewData.sssdetails.push(item3);
            }

            //pgbloanTable
            var pgbtable = _$pagibigLoanTable.DataTable();
            var form_pgbtabledata = pgbtable.rows().data();
            var n = form_pgbtabledata;

            for (var o = 0; n.length > o; o++) {

                item2 = {};
                item2["EmpId"] = $('#EmpId').val();
                item2["AttId"] = $('#attid').val();
                item2["AppNo"] = n[o][7];
                item2["StartDate"] = n[o][1];
                item2["Description"] = n[o][4];
                item2["LoanAmount"] = n[o][2];
                item2["Balance"] = n[o][3];
                item2["Period"] = n[o][5];
                item2["Amount"] = n[o][6];
                item2["Status"] = "Active";
                viewData.pgbdetails.push(item2);
            }

            //OtherLoanTable
            var OtherLoantable = _$OtherLoanmodalTable.DataTable();
            var form_OtherLoantable = OtherLoantable.rows().data();
            var p = form_OtherLoantable;

            for (var a = 0; p.length > a; a++)
            {
                item4 = {};
                item4["EmpId"] = $('#EmpId').val();
                item4["AttId"] = $('#attid').val();
                item4["AppNo"] = p[a][7];
                item4["StartDate"] = p[a][1];
                item4["Description"] = p[a][4];
                item4["LoanAmount"] = p[a][2];
                item4["Balance"] = p[a][3];
                item4["Period"] = p[a][5];
                item4["Amount"] = p[a][6];
                item4["Status"] = "Active";
                viewData.othrloandetails.push(item4);
            }

            //dedTable
            var dedtable = _$DeductionTable.DataTable();
            var form_dedtable = dedtable.rows().data();
            var r = form_dedtable;

            for (var b = 0; r.length > b; b++) {
                item5 = {};
                item5["EmpId"] = $('#EmpId').val();
                item5["AttId"] = $('#attid').val();
                item5["Index"] = r[b][0];
                item5["Date"] = r[b][1];
                item5["Description"] = r[b][2];
                item5["Amount"] = r[b][3];
                item5["Status"] = "Active";
                viewData.othrdeddetails.push(item5);
            }

            //AttadjTable
            var Attadjtable = _$AttAdjTable.DataTable();
            var form_Attadjtable = Attadjtable.rows().data();
            var s = form_Attadjtable;

            for (var t = 0; s.length > t; t++) {
                item6 = {};

                item6["Index"] = s[t][0];
                item6["AttId"] = s[t][1];
                item6["EmpId"] = $('#EmpId').val();
                item6["DateT"] = s[t][2];
                item6["AdjType"] = s[t][3];
                item6["Plusminus"] = s[t][5];
                item6["AttAdjDescription"] = s[t][7];
                item6["AttAdjAmount"] = s[t][8];
                item6["Description1"] = s[t][9];
                item6["Description2"] = s[t][10];
                item6["Status1"] = "Active";
                viewData.attadjdetails.push(item6);
            }

            abp.message.confirm(
                'New Payroll will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$EmpPayrollRec);
                        _payrollIServices.createpayroll(viewData).done(function () {
                            abp.notify.success('Payroll Saved', 'Success');
                        }).always(function () {
                            abp.ui.clearBusy(_$EmpPayrollRec);

                            $('#LeaveId').selectpicker('val', "");
                            $('#AttendanceNameCompTable').dataTable().fnClearTable();
                            $('#AttAdjTable').dataTable().fnClearTable();
                            $('#AllowanceTable').dataTable().fnClearTable();                            
                            $('#btnSavePayroll').prop("disabled", true);
                            GetAttidCompNameTable();
                            //$('#amOut1').val("");
                            //$('#pmIn1').val("");
                            //$('#pmOut1').val("");
                            //GetAttendanceRecord();
                        });
                    }
                }
            );
        }

        $('#LeaveId').change(function (e) {
            e.preventDefault();
            $('#LeaveToUse').val(0);  
            LoadLeave();
        });

        function LoadLeave() {
            var EmpId = $('#EmpId').val();
            var LeaveId = $('#LeaveId').val();  
            if (LeaveId == "") {
                _empLeavesService.getAlleave({ filter: EmpId + '|' + LeaveId }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var $remLeave = result.items[i].remLeave;
                        var Years = result.items[i].status;
                        if (Years > 0) {
                            $('#LeaveToUse').val($remLeave);
                            $('#LeaveUse').prop("disabled", false);
                        }
                        else {
                            $('#LeaveToUse').val(0);
                            $('#LeaveUse').prop("disabled", true);
                        }
                    }
                });
            }
            if (LeaveId == "1") {
                _empLeavesService.getSickLeave({ filter: EmpId + '|' + LeaveId }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var $remLeave = result.items[i].remLeave;
                        var Years = result.items[i].status;
                        if (Years > 0) {
                            $('#LeaveToUse').val($remLeave);
                            $('#LeaveUse').prop("disabled", false);

                        }
                        else {
                            $('#LeaveToUse').val(0);
                            $('#LeaveUse').prop("disabled", true);
                        }
                    }
                });
            }
            if (LeaveId == "2") {
                _empLeavesService.getVLeave({ filter: EmpId + '|' + LeaveId }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var $remLeave = result.items[i].remLeave;
                        var Years = result.items[i].status;
                        if (Years > 0) {
                            $('#LeaveToUse').val($remLeave);
                            $('#LeaveUse').prop("disabled", false);
                        }
                        else {
                            $('#LeaveToUse').val(0);
                            $('#LeaveUse').prop("disabled", true);
                        }
                    }
                });
            }
            if (LeaveId == "3") {
                _empLeavesService.getPLeave({ filter: EmpId + '|' + LeaveId }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var $remLeave = result.items[i].remLeave;
                        var Years = result.items[i].status;
                        if (Years > 0) {
                            $('#LeaveToUse').val($remLeave);
                            $('#LeaveUse').prop("disabled", false);
                        }
                        else {
                            $('#LeaveToUse').val(0);
                            $('#LeaveUse').prop("disabled", true);
                        }
                    }
                });
            }
            if (LeaveId == "4") {
                _empLeavesService.getILeave({ filter: EmpId + '|' + LeaveId }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var $remLeave = result.items[i].remLeave;
                        var Years = result.items[i].status;
                        if (Years > 0) {
                            $('#LeaveToUse').val($remLeave);
                        }
                        else {
                            $('#LeaveToUse').val(0);
                        }
                    }
                });
            }
            //4
            //changerate();
        } 

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('AttRecTable', 'AttRecTable', 'AttRecTable.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            console.log(table.innerHTML);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

    });
})(jQuery);