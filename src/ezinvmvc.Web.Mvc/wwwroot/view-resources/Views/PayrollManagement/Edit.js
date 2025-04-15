$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
truncateDecimals = function (number) {
    return Math[number < 0 ? 'ceil' : 'floor'](number);
};
function cutNumber(number, digitsAfterDot) {
    const str = `${number}`;

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1);
}
(function () {
    $(function () {
        var _payrollIServices = abp.services.app.payrollIServices;
        var _oTRatesService = abp.services.app.oTRatesService;
        var _payrollOTDetailsServices = abp.services.app.payrollOTDetailsServices;
        var _payrollAllowanceServices = abp.services.app.payrollAllowanceServices;
        var _bioAttendanceService = abp.services.app.bioAtt2Service;
        var _attAdjustmentService = abp.services.app.attAdjustmentService;
        var _payrollAttAdjustmentServices = abp.services.app.payrollAttAdjustmentServices;
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _payrollSSSLoanServices = abp.services.app.payrollSSSLoanServices;
        var _payrollPagibigLoanServices = abp.services.app.payrollPagibigLoanServices;
        var _payrollOtherLoanServices = abp.services.app.payrollOtherLoanServices;
        var _payrollOtherDeductionServices = abp.services.app.payrollOtherDeductionServices;
        var _empSalariesServices = abp.services.app.empSalariesServices;
        var _empContributionService = abp.services.app.empContributionService;
        var _$AttAdjTable = $('#AttAdjTable');
        var _$OTTable = $('#OTTable');
        var _$AllowanceTable = $('#AllowanceTable');
        var _$AttRecTable = $('#AttRecTable');
        var _$sssloanTable = $('#SSSLoanTable');
        var _$pagibigLoanTable = $('#PagibigLoanTable');
        var _$OtherLoanmodalTable = $('#OtherLoanmodalTable');
        var _$DeductionTable = $('#DeductionTable');
        var _$AttRecTable = $('#AttRecTable');
        var _$EmpPayrollRec = $('form[name=EmpPayrollRec]');
        //15
        function computeTotal() {
            var rgotamount = 0;
            dataTable.column(7).data()
                .each(function (value, index) {
                    var rgamount = parseFloat(value);
                    rgotamount = rgotamount + rgamount;
                    $('#GrossAmount').val('');
                });
            $('#RGOTAmount').val(currencyFormat(rgotamount));

            var Allowancegrandtotal = 0;
            AllowancedataTable.column(6).data()
                .each(function (value, index) {
                    var $grandtotal = parseFloat(value);
                    Allowancegrandtotal = Allowancegrandtotal + $grandtotal;
                    $('#GrossAmount').val('');
                });
            $('#AllowanceAdjs').val(currencyFormat(Allowancegrandtotal));

            var Adjgrandtotal = 0;
            AdjdataTable.column(10).data()
                .each(function (value, index) {
                    var $Adjtotal = parseFloat(value);
                    Adjgrandtotal = Adjgrandtotal + $Adjtotal;
                    $('#GrossAmount').val('');
                });
            $('#AttAdjs').val(currencyFormat(Adjgrandtotal));

            var SSSgrandtotal = 0;
            sssdataTable.column(7).data()
                .each(function (value, index) {
                    var $SSStotal = parseFloat(value);
                    SSSgrandtotal = SSSgrandtotal + $SSStotal;
                    $('#GrossAmount').val('');
                });
            $('#SSSLoanAmount').val(currencyFormat(SSSgrandtotal));

            var pgbgrandtotal = 0;
            pagibigdataTable.column(7).data()
                .each(function (value, index) {
                    var $pgbtotal = parseFloat(value);
                    pgbgrandtotal = pgbgrandtotal + $pgbtotal;
                });
            $('#PagibigLoanAmount').val(currencyFormat(pgbgrandtotal));

            var otlgrandtotal = 0;
            otherdataTable.column(7).data()
                .each(function (value, index) {
                    var $otlbtotal = parseFloat(value);
                    otlgrandtotal = otlgrandtotal + $otlbtotal;
                });
            $('#OtherLoanAmount').val(currencyFormat(otlgrandtotal));

            var otherdedgrandtotal = 0;
            deductiondataTable.column(6).data()
                .each(function (value, index) {
                    var $otherded = parseFloat(value);
                    otherdedgrandtotal = otherdedgrandtotal + $otherded;
                    $('#GrossAmount').val('');
                });
            $('#OtherDeduction').val(currencyFormat(otherdedgrandtotal));

            GetLeaveUse($('#dateTrans').val(), $('#EmpId').val());
        }        
        $(document).ready(function ()
        {
            $('#Salary').hide();
            $('#Absent').hide();
            $('#Tardines').hide();
            $('#UnderTime').hide();
            $('#Lvs').hide();
            $('#OT').hide();
            $('#Alwnce').hide();
            $('#Othrs').hide();
            $('#Days').hide();
            var PId = $('#PId').val();
            PayrollGetDetails(PId);
        });
        //1
        function PayrollGetDetails(id) {
            _payrollIServices.getPayrollDetailsbyId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    $('#FullName').val(result.items[i].lastName + ", " + result.items[i].firstName + ", " + result.items[i].middleName);
                    $('#DeptName').val(result.items[i].department);
                    $('#SalaryPeriodid').selectpicker('val', result.items[i].salaryPeriod);
                    $('#Department').val(result.items[i].department);
                    $('#CutOff').selectpicker('val', result.items[i].cutOff);
                    $('#RatePerMonth').val(result.items[i].ratePerMonth.toFixed(2));
                    $('#RatePerDay').val(result.items[i].ratePerDay.toFixed(2));
                    $('#RatePerHour').val(result.items[i].ratePerHour.toFixed(2));
                    $('#rateid').val(result.items[i].rateid);

                    $('#BasicSalaryCurrent').val(result.items[i].basicSalaryCurrent);
                    $('#BasicSalaryAdjustment').val(result.items[i].basicSalaryAdjustment.toFixed(2));
                    $('#BasicSalaryAmount').val(result.items[i].basicSalaryAmount.toFixed(2));

                    $('#TravelhoursCurrent').val(result.items[i].travelhoursCurrent);
                    $('#TravelhoursAdjustment').val(result.items[i].travelhoursAdjustment.toFixed(2));
                    $('#TravelhoursAmount').val(result.items[i].travelhoursAmount.toFixed(2));

                    $('#HolidayCurrent').val(result.items[i].holidayCurrent);
                    $('#HolidayAdjustment').val(result.items[i].holidayAdjustment.toFixed(2));
                    $('#HolidayAmount').val(result.items[i].holidayAmount.toFixed(2));

                    $('#AbsensesCurrent').val(result.items[i].absensesCurrent);
                    $('#AbsensesAdjustment').val(result.items[i].absensesAdjustment.toFixed(2));
                    $('#AbsensesAmount').val(result.items[i].absensesAmount.toFixed(2));

                    $('#TardinessCurrent').val(result.items[i].tardinessCurrent);
                    $('#TardinessAjustment').val(result.items[i].tardinessAjustment.toFixed(2));
                    $('#TardinessAmount').val(result.items[i].tardinessAmount.toFixed(2));

                    $('#UndertimeCurrent').val(result.items[i].undertimeCurrent);
                    $('#UndertimeAdjustment').val(result.items[i].undertimeAdjustment.toFixed(2));
                    $('#UndertimeAmount').val(result.items[i].undertimeAmount.toFixed(2));

                    $('#NightDiffCurrent').val(result.items[i].nightDiffCurrent);
                    $('#NightDiffAdjustment').val(result.items[i].nightDiffAdjustment.toFixed(2));
                    $('#NightDiffAmount').val(result.items[i].nightDiffAmount.toFixed(2));

                    $('#LeaveUse').val(result.items[i].leaveUse.toFixed(2));
                    $('#LeaveAmout').val(result.items[i].leaveAmout.toFixed(2));
                    $('#LeaveTotalAmout').val(result.items[i].leaveTotalAmout);

                    $('#RGOTAmount').val(result.items[i].rgotAmount.toFixed(2));

                    $('#AllowanceAdjs').val(result.items[i].allowanceAdjs.toFixed(2));

                    $('#AttAdjs').val(result.items[i].attAdjs.toFixed(2));

                    $('#GeneralAmount').val(result.items[i].generalAmount.toFixed(2));

                    $('#NONGeneralAmount').val(result.items[i].nonGeneralAmount.toFixed(2));

                    $('#GrossAmount').val(result.items[i].grossAmount);

                    $('#DeptName').val(result.items[i].description1);
                    $('#Periodid').val(result.items[i].periodid);

                    //Contribution
                    $('#SSSAmount').val(result.items[i].ssseeAmount.toFixed(2));
                    $('#SSSAdjustment').val(result.items[i].ssserAmount.toFixed(2));
                    $('#SSSCurrent').val(result.items[i].sssecAmount.toFixed(2));

                    $('#PhilhealthAmount').val(result.items[i].philhealthEEAmount.toFixed(2));
                    $('#PhilhealthAdjustment').val(result.items[i].philhealthERAmount.toFixed(2));
                    $('#PhilhealthCurrent').val(result.items[i].philhealthTotalAmount.toFixed(2));

                    $('#PagibigAmount').val(result.items[i].pagibigEEAmount.toFixed(2));
                    $('#PagibigAdjustment').val(result.items[i].pagibigERAmount.toFixed(2));
                    $('#PagibigCurrent').val(result.items[i].pagibigTotalAmount.toFixed(2));
                    //TOtal COntribution
                    var $ssee = parseFloat(result.items[i].ssseeAmount.toFixed(2));
                    var $phee = parseFloat(result.items[i].philhealthEEAmount.toFixed(2));
                    var $pgee = parseFloat(result.items[i].pagibigEEAmount.toFixed(2));
                    var totalcontri = $ssee + $phee + $pgee;
                    $('#ContributionAmount').val(totalcontri.toFixed(2));
                    //Deductions
                    $('#SSSLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                    $('#PagibigLoanAmount').val(result.items[i].pagibigLoanAmount.toFixed(2));
                    $('#OtherLoanAmount').val(result.items[i].otherLoanAmount.toFixed(2));
                    $('#OtherDeduction').val(result.items[i].otherLoan.toFixed(2));

                    $('#Totalded').val(result.items[i].loansAmount.toFixed(2));
                    $('#TaxableAmount').val(result.items[i].taxableAmount.toFixed(2));
                    $('#Percent').val(result.items[i].percent);
                    $('#NetIncome').val(result.items[i].netIncome);
                }
                //GetOvertimeRecord($('#attid').html(), $('#empId').html());
                changerate();
            })
        }

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
        //AttAdjustment

        ////OT
        $('#btnReloadOt').click(function (e) {
            e.preventDefault();
            GetOvertimeRecord($('#attid').val(), $('#EmpId').val());
        });
        $('#RGOT').click(function (e) {
            e.preventDefault();
            $("#RateModal").modal('show');
        });
        $('#Btndismiss').click(function (e) {
            e.preventDefault();
            $("#RateModal").modal('hide');
        });
        //2
        function changerate() {
            var $id = $('#rateid').val();
            _oTRatesService.getOTRate({ id: $id }).done(function (result) {
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
                    $('#BasicSalaryCurrent').prop("disabled", true);

                    $('#AbsensesCurrent').prop("disabled", false);
                    $('#BasicSalaryCurrent').val(13);
                }
                else {
                    $('#AbsensesCurrent').prop("disabled", true);
                    $('#BasicSalaryCurrent').prop("disabled", false);
                }
                GetOvertimeRecord($('#attid').val(), $('#EmpId').val());
                //GetAllowanceRecord($('#attid').val(), $('#EmpId').val());
                //GetRatesRecord($('#EmpId').val());                
                //GetAttAdjTableRecord($('#attid').val(), $('#EmpId').val());
                //GetSSLoanRecord($('#attid').val(), $('#EmpId').val());
                //GetPgbLoanRecord($('#attid').val(), $('#EmpId').val());
                //GetOTLoanRecord($('#attid').val(), $('#EmpId').val());
                //GetOtherDedRecord($('#attid').val(), $('#EmpId').val());
                //GetLeaveUse($('#dateTrans').val(), $('#EmpId').val());
            })
        }
        //3
        function GetOvertimeRecord($a, $b) {
            $('#OTTable').dataTable().fnClearTable();
            _payrollOTDetailsServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $index = result.items[i].index;
                    var $empid = result.items[i].empId;
                    var $attid = result.items[i].attId;
                    var $description = result.items[i].description;
                    var $hour = result.items[i].hour;
                    var $rate = result.items[i].rate;
                    var $amount = result.items[i].amount;
                    dataTable.row.add([$id, $index, $empid, $attid, $description, $rate, $hour, $amount, '<a id="delete-item" class="delete-otitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();

                    //computeTotal();
                }
            });
            GetAllowanceRecord($('#attid').val(), $('#EmpId').val());
        }
        //6
        function GetRatesRecord($id) {
            _empSalariesServices.getEmpSalariesByEmpId({ id: $id }).done(function (result) {
                if (result === null) {
                    abp.notify.error('No salary recorded');
                    abp.ui.clearBusy(_$EmpAttIdRec);
                    abp.ui.clearBusy(_$EmpPayrollRec);
                }
                else
                {
                    $('#TotalLeave').val(result.totalLeave);
                }
            });
            GetSSLoanRecord($('#attid').val(), $('#EmpId').val());
        }
        //7
        function GetLeaveUse($a, $b) {
            _payrollIServices.getLeaveCount({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $leaveUse = result.items[i].leaveUse;
                    $('#TotalLeaveUse').val($leaveUse);
                }

                var $TotalLeave = $('#TotalLeave').val() || 0;
                var $TotalLeaveUse = $('#TotalLeaveUse').val() || 0;

                var $totalLeave = parseFloat($TotalLeave) - parseFloat($TotalLeaveUse);
                $('#LeaveToUse').val($totalLeave.toFixed(2));
            });
            //GetSSLoanRecord($('#attid').val(), $('#EmpId').val());
        }
        var dataTable = _$OTTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            "bDestroy": true,
            columnDefs: [{
                "visible": false,
                targets: [0, 1, 2, 3]
            },
            {
                orderable: true,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            //{
            //    render: $.fn.dataTable.render.number(',', '.', 2),
            //    className: 'text-right',
            //    targets: [5, 6, 7]
            //}
            ]
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

            var totalRatePerMinRestDay = ratepermin + min;
            var totalRateRestday = totalRatePerMinRestDay + hrstomin;
            return totalRateRestday.toFixed(2);
        }
        function ComputeRateNDTime(duration, RestDayRate, RatePerHour)
        {
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            $("#NDRestDayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("20", duration, RestDayRate, myval, val);
            $('#NDReguralOTtime').val("");
            $('#NDReguralOTTotalMin').val("");
        });
        $("#NDSpecialHolidayOTtime").focusout(function () {
            var val = "NDSH OT"
            var RestDayRate = document.getElementById('NDSpecialHolidayOT').value;
            var duration = document.getElementById('NDSpecialHolidayOTtime').value;
            var RatePerHour = document.getElementById('RatePerHour').value;
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
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
            var myval = ComputeRateNDTime(duration, RestDayRate, RatePerHour);
            $("#NDLegalHolidayRestdayOTTotalMin").val(myval);
            AddtoRate();
            Addtotable("24", duration, RestDayRate, myval, val);
            $('#NDLegalHolidayRestdayOTtime').val("");
            $('#NDLegalHolidayRestdayOTTotalMin').val("");
        });

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
        function Addtotable(idnum, duration, RestDayRate, RatePerHour, val) {

            var $index = 0;
            var $id = 0;
            var $EmpId = $('#EmpId').val();
            var $attid = $('#attid').val();
            var $duration = duration;
            var $RestDayRate = RestDayRate;
            var $RatePerHour = RatePerHour;

            if ($duration === '' || $RestDayRate === '' || $RatePerHour === '') { return; }

            var datacount = dataTable.rows().count();
            var itemno = datacount + 1;
            abp.notify.success(val + ' added!', 'Success');
            dataTable.row.add([$id, $index, $EmpId, $attid, val, $RestDayRate, $duration, $RatePerHour, '<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            computeTotal();
        }
        _$OTTable.on('click', 'a.delete-otitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$OTTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });

        ////ALLOWANCE TABLE
        var AllowancedataTable = _$AllowanceTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            "bDestroy": true,
            columnDefs: [{
                "visible": false,
                targets: [0,1,2,3]
            },
            {
                orderable: true,
                targets: [0, 1, 2, 3, 4, 5, 6, 7]
            },
                //{
                //    render: $.fn.dataTable.render.number(',', '.', 2),
                //    className: 'text-right',
                //    targets: [5, 6, 7]
                //}
            ]
        });
        //4
        function GetAllowanceRecord($a, $b)
        {
            $('#AllowanceTable').dataTable().fnClearTable();
            _payrollAllowanceServices.getAllList({ filter: $a + '|' + $b }).done(function (result)
            {
                for (var i = 0; i < result.items.length; i++)
                {
                    var $id = result.items[i].id;
                    var $index = result.items[i].index;
                    var $empid = result.items[i].empId;
                    var $attid = result.items[i].attId;
                    var $date = result.items[i].date;

                    var Date2 = new Date($date);
                    var DateTr = Date2.getFullYear();
                    $('#dateTrans').val(DateTr);

                    var $description = result.items[i].description;
                    var $amount = result.items[i].amount;
                    AllowancedataTable.row.add([$id, $index, $empid, $attid, $date, $description, $amount, '<a id="delete-item" class="delete-alltitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                }
            });
            GetAttAdjTableRecord($('#attid').val(), $('#EmpId').val());
        } 
        $('#AddAllowance').click(function (e) {
            e.preventDefault();
            addnewallowance();
        });
        function addnewallowance() {
            var $id = 0;
            var $index = 0;
            var $EmpId = $('#EmpId').val();
            var $attid = $('#attid').val();
            var $AllowanceDate = $('#Date').val();
            var $AllowanceDescription = $('#AllowanceDescription').val();
            var $Aallowanceamount = $('#AllowanceAmount').val();

            if ($AllowanceDate === '' || $Aallowanceamount === '' || $AllowanceDescription === '') { return; }

            var datacount = AllowancedataTable.rows().count();
            var itemno = datacount + 1;

            AllowancedataTable.row.add([$id, itemno, $EmpId, $attid, $AllowanceDate, $AllowanceDescription, $Aallowanceamount, '<a id="delete-item" class="delete-alltitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            abp.notify.success('Allowance ' + $AllowanceDescription + ' added!', 'Success');
            computeTotal();
        }
        _$AllowanceTable.on('click', 'a.delete-alltitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$AllowanceTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        $('#btnReloadAll').click(function (e) {
            e.preventDefault();
            GetAllowanceRecord($('#attid').val(), $('#EmpId').val());
        });
        ////ADJUSTMENT
        $('#btnReloadAdj').click(function (e) {
            e.preventDefault();
            GetAttAdjTableRecord($('#attid').val(), $('#EmpId').val());
        });
        var AdjdataTable = _$AttAdjTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            "bDestroy": true,
            columnDefs: [{
                "visible": false,
                targets: [0,1, 2, 3, 5, 6, 7,8, 11,12]
            },
            {
                orderable: true,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13]
            },
                //{
                //    render: $.fn.dataTable.render.number(',', '.', 2),
                //    className: 'text-right',
                //    targets: [5, 6, 7]
                //}
            ]
        });
        //5
        function GetAttAdjTableRecord($a, $b)
        {
            $('#AttAdjTable').dataTable().fnClearTable();
            _payrollAttAdjustmentServices.getAllList({ filter: $a + '|' + $b }).done(function (result)
            {
                for (var i = 0; i < result.items.length; i++)
                {
                    var $id = result.items[i].id;
                    var $index = result.items[i].index;
                    var $empid = result.items[i].empId;
                    var $attid = result.items[i].attId;
                    var $dateT = result.items[i].dateT;

                    var sDate = $dateT.split('-');
                    var y = parseInt(sDate[0], 10);
                    var m = parseInt(sDate[1], 10);
                    var d = parseInt(sDate[2], 10);
                    sDate = m + '/' + d + '/' + y;

                    var $adjTypeId = result.items[i].adjType;
                    var $adjType = "AdjType";
                    var $plusminusId = result.items[i].plusminus;
                    var $plusminus = "Add/Minus";
                    var $attAdjDescription = result.items[i].attAdjDescription;
                    var $attAdjAmount = result.items[i].attAdjAmount;
                    var $description1 = result.items[i].description1;
                    var $description2 = result.items[i].description2;
                    var $types = result.items[i].description3;
                    AdjdataTable.row.add([$id, $index, $empid, $attid, sDate, $adjTypeId, $adjType, $plusminusId, $plusminus, $attAdjDescription, $attAdjAmount, $description1, $description2, $types,'<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                }
            });
            GetRatesRecord($('#EmpId').val());
        }
        //--Salary --ADJUSTMENT
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
        function addattadj() {
            var $id = "0";
            var $index = "0";
            var $empid = $('#EmpId').val();
            var $attid = $('#attid').val();
            var $dateT = $('#DateT').val();

            var sDate = $dateT.split('-');
            var y = parseInt(sDate[0], 10);
            var m = parseInt(sDate[1], 10);
            var d = parseInt(sDate[2], 10);
            sDate = m + '/' + d + '/' + y;

            var $adjTypeId = $('#AdjType').val();
            var $adjType = $('#AdjType option:selected').text();
            var $plusminusId = $('#plusminus').val();
            var $plusminus = $('#plusminus option:selected').text();
            var $attAdjDescription = $('#AttAdjDescription').val();
            //var $attAdjAmount = $('#AttAdjAmount').val();
            var $description1 = $('#AttIdrecord').text();
            var $types = $('#AdjType option:selected').text();
            if ($plusminusId == 2) {
                var $AttAdjAmount2 = '-' + $('#AttAdjAmount').val();
            }
            else {
                var $AttAdjAmount2 = $('#AttAdjAmount').val();
            }
            if ($description1 === '' || $dateT === '' || $adjType === '' || $attid === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;

            AdjdataTable.row.add([$id, itemno, $empid, $attid, $dateT, $adjTypeId, $adjType, $plusminusId, $plusminus, $attAdjDescription, $AttAdjAmount2, $description1, '', $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            abp.notify.success('Allowance ' + $attAdjDescription + ' added!', 'Success');
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
        _$AttAdjTable.on('click', 'a.delete-Adjtitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$AttAdjTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
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
            var $id = "0";
            var $index = "0";
            var $empid = $('#EmpId').val();
            var $AttId = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $adjTypeId = $('#AdjType').val();
            var $AdjType = $('#AdjType option:selected').text();
            var $plusminusId = $('#plusminus').val();
            var $plusminus = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttAbsentDescription').val();
            var $Description1 = $('#AttIdrecord').text();
            var $AttAbsent = $('#AttAbsent').val();
            var $types = $('#AdjType option:selected').text();
            if ($plusminusId == 2) {
                var $AttAdjAmount = '-' + $('#AttAbsentAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttAbsentAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $adjTypeId === '' || $AttId === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;

            AdjdataTable.row.add([$id, itemno, $empid, $AttId, $DateT, $adjTypeId, $AdjType, $plusminusId, $plusminus, $AttAdjDescription, $AttAdjAmount, $Description1, $AttAbsent, $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
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
            var FullAmt15min = numarray1 * $TardinessAjustment;
            var AmntLess15min = $RatePerHour / 60 * numarray2;
            var FullLateRateAmt = FullAmt15min + "." + AmntLess15min;
            $("#AttTardinesAmount").val(parseInt(FullLateRateAmt).toFixed(2));
        });
        function AddAttTardinesAdj() {
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $attid = $('#attid').val();
            var $dateT = $('#DateT').val();
            var $adjTypeId = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminusId = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttTardinesDescription').val();
            //var $AttAdjDescription = $('#AttTardinesDescription').val();
            var $Description1 = $('#AttIdrecord').text();
            var $types = $('#AdjType option:selected').text();

            var $AttTardines = $('#AttTardines').val();
            if ($plusminusId == 2) {
                var $AttAdjAmount = '-' + $('#AttTardinesAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttTardinesAmount').val();
            }
            if ($Description1 === '' || $dateT === '' || $adjTypeId === '' || $attid === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;
            AdjdataTable.row.add([$id, itemno, $empid, $attid, $dateT, $adjTypeId, $AdjType2, $plusminusId, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttTardines, $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();

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
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttUnderTimeDescription').val();
            var $Description1 = $('#AttIdrecord').text();
            var $AttUnderTime = $('#AttUnderTime').val();;
            var $types = $('#AdjType option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttUnderTimeAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttUnderTimeAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;

            AdjdataTable.row.add([$id, itemno, $empid, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttUnderTime, $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
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
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttLeaveDescription').val();
            var $Description1 = $('#AttIdrecord').text();

            var $AttLeave = $('#AttLeave').val();
            var $types = $('#AdjType option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttLeaveAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttLeaveAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;

            AdjdataTable.row.add([$id, itemno, $empid, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttLeave, $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
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
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttAlwnceDescription').val();
            var $Description1 = $('#AttIdrecord').text();

            var $types = $('#AdjType option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttAlwnceAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttAlwnceAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;
            AdjdataTable.row.add([$id, itemno, $empid, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            //AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', '']).draw();
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
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttAdjDescription = $('#AttOthrsDescription').val();
            var $Description1 = $('#AttIdrecord').text();
            var $types = $('#AdjType option:selected').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttOthrsAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttOthrsAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;

            AdjdataTable.row.add([$id, itemno, $empid, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            //AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, '', '']).draw();
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
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttOT = $('#AttOT').val();
            ///dpat ipasa as var
            var $AttAdjDescription = desc;
            var $types = $('#AdjType option:selected').text();
            var $Description1 = $('#AttIdrecord').text();
            if ($plusminus == 2) {
                var $AttAdjAmount = '-' + $('#AttOTAmount').val();
            }
            else {
                var $AttAdjAmount = $('#AttOTAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;
            AdjdataTable.row.add([$id, itemno, $empid, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttOT, $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            //AttAdjTable.row.add(['0',itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttAdjDescription, $AttAdjAmount, $Description1, $AttOT, '']).draw();
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
            var $id = "0";
            var $empid = $('#EmpId').val();
            var $AttIdrecord = $('#attid').val();
            var $DateT = $('#DateT').val();
            var $AdjType = $('#AdjType').val();
            var $AdjType2 = $('#AdjType option:selected').text();
            var $plusminus = $('#plusminus').val();
            var $plusminus2 = $('#plusminus option:selected').text();

            var $AttDaysDescription = $('#AttDaysDescription').val();
            var $Description1 = $('#AttIdrecord').text();
            var $AttDays = $('#AttDays').val();
            var $types = $('#AdjType option:selected').text();
            if ($plusminus == 2) {
                var $AttDaysAmount = '-' + $('#AttDaysAmount').val();
            }
            else {
                var $AttDaysAmount = $('#AttDaysAmount').val();
            }
            if ($Description1 === '' || $DateT === '' || $AdjType === '' || $AttIdrecord === '') { abp.notify.info('Please Select Attendance ', 'Nothing Selected'); return; }

            var datacount = AdjdataTable.rows().count();
            var itemno = datacount + 1;
            AdjdataTable.row.add([$id, itemno, $empid, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttDaysDescription, $AttDaysAmount, $Description1, $AttDays, $types, '<a id="delete-item" class="delete-Adjtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            //AttAdjTable.row.add([itemno, $AttIdrecord, $DateT, $AdjType, $AdjType2, $plusminus, $plusminus2, $AttDaysDescription, $AttDaysAmount, $Description1, $AttDays, '']).draw();
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

        //DEDUCTION
        //SSS Loans Deduction
        $('#SSSLoanDeduction').click(function (e) {
            e.preventDefault();
            $("#SSSLoanmodal").modal('show');
        });
        var sssdataTable = _$sssloanTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 1,2]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7,8]
            },
            {
                //render: $.fn.dataTable.render.number(',', '.', 2),
                //className: 'text-right',
                //targets: [2, 3, 6]
            }
            ]
        });
        $('#btnReloadSSS').click(function (e) {
            e.preventDefault();
            GetSSLoanRecord($('#attid').val(), $('#EmpId').val());
        });
        //8
        function GetSSLoanRecord($a, $b) {
            $('#SSSLoanTable').dataTable().fnClearTable();
            _payrollSSSLoanServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $empId = result.items[i].empId;
                    var $attId = result.items[i].attId;
                    var $appNo = result.items[i].appNo;
                    var $description = result.items[i].description;
                    var $loanAmount = result.items[i].loanAmount;
                    var $balance = result.items[i].balance;
                    var $amount = result.items[i].amount;
                    sssdataTable.row.add([$id, $empId,$attId,$appNo,$description,$loanAmount,$balance,$amount,'<a id="delete-item" class="delete-ssstitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                }
                GetSSSLoanRecord();
            });
        }
        //9
        function GetSSSLoanRecord() {
            var e = $('#EmpId').val();
            if (e == "") { e = "0" }
            _empAttRecordService.getLoanAmount({ empId: e, loanTitle: 1 }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#SSSLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#SSSLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#SSSLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
            });
            GetPgbLoanRecord($('#attid').val(), $('#EmpId').val());
        }
        _$sssloanTable.on('click', 'a.delete-ssstitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$sssloanTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });

        //Pagibig Loans Deduction
        $('#PagibigLoanDeduction').click(function (e) {
            e.preventDefault();
            $("#PagibigLoanmodal").modal('show');
        });
        var pagibigdataTable = _$pagibigLoanTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 1,2]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                //render: $.fn.dataTable.render.number(',', '.', 2),
                //className: 'text-right',
                //targets: [2, 3, 6]
            }
            ]
        });
        //10
        function GetPgbLoanRecord($a, $b) {
            $('#PagibigLoanTable').dataTable().fnClearTable();
            _payrollPagibigLoanServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $empId = result.items[i].empId;
                    var $attId = result.items[i].attId;
                    var $appNo = result.items[i].appNo;
                    var $description = result.items[i].description;
                    var $loanAmount = result.items[i].loanAmount;
                    var $balance = result.items[i].balance;
                    var $amount = result.items[i].amount;
                    pagibigdataTable.row.add([$id, $empId, $attId, $appNo, $description, $loanAmount, $balance, $amount, '<a id="delete-item" class="delete-pgbtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                }
                GetPagibigLoanRecord();
            });
        }
        //11
        function GetPagibigLoanRecord() {
            var e = $('#EmpId').val();
            if (e == "") { e = "0" }
            _empAttRecordService.getLoanAmount({ empId: e, loanTitle: 2 }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#PagibigLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#PagibigLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#PagibigLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
            });
            GetOTLoanRecord($('#attid').val(), $('#EmpId').val());
        }
        $('#btnReloadPagibig').click(function (e) {
            e.preventDefault();
            GetPgbLoanRecord($('#attid').val(), $('#EmpId').val());
        });
        _$pagibigLoanTable.on('click', 'a.delete-pgbtitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$pagibigLoanTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });

        //Other Loans Deduction
        $('#OtherLoanDeduction').click(function (e) {
            e.preventDefault();
            $("#OtherLoanmodal").modal('show');
        });
        //13
        function GetOtherLoanRecord() {
            var e = $('#EmpId').val();
            if (e == "") { e = "0" }
            _empAttRecordService.getLoanAmount({ empId: e, loanTitle: 3 }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    jQuery('#OtherLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#OtherLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#OtherLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
            });
            GetOtherDedRecord($('#attid').val(), $('#EmpId').val());
        }
        var otherdataTable = _$OtherLoanmodalTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 1,2]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                //render: $.fn.dataTable.render.number(',', '.', 2),
                //className: 'text-right',
                //targets: [2, 3, 6]
            }
            ]
        });
        //12
        function GetOTLoanRecord($a, $b)
        {
            $('#OtherLoanmodalTable').dataTable().fnClearTable();
            _payrollOtherLoanServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $empId = result.items[i].empId;
                    var $attId = result.items[i].attId;
                    var $appNo = result.items[i].appNo;
                    var $description = result.items[i].description;
                    var $loanAmount = result.items[i].loanAmount;
                    var $balance = result.items[i].balance;
                    var $amount = result.items[i].amount;
                    otherdataTable.row.add([$id, $empId, $attId, $appNo, $description, $loanAmount, $balance, $amount, '<a id="delete-item" class="delete-Otltitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                }
            });
            GetOtherLoanRecord();
        } 
        $('#btnOtherLoan').click(function (e) {
            e.preventDefault();
            GetOTLoanRecord($('#attid').val(), $('#EmpId').val());
        });
        _$OtherLoanmodalTable.on('click', 'a.delete-Otltitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$OtherLoanmodalTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });

        //Other Deduction
        $('#OtherDed').click(function (e) {
            e.preventDefault();
            $("#Others").modal('show');
        });
        var deductiondataTable = _$DeductionTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 1,2,3]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5, 6, 7]
            },
            {
                //render: $.fn.dataTable.render.number(',', '.', 2),
                //className: 'text-right',
                //targets: [2, 3, 6]
            }
            ]
        });
        //14
        function GetOtherDedRecord($a, $b) {
            $('#DeductionTable').dataTable().fnClearTable();
            _payrollOtherDeductionServices.getAllList({ filter: $a + '|' + $b }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $empId = result.items[i].empId;
                    var $attId = result.items[i].attId;
                    var $index = result.items[i].index;
                    var $date = result.items[i].date;                    
                    var $description = result.items[i].description;
                    var $amount = result.items[i].amount;
                    deductiondataTable.row.add([$id, $empId, $attId, $index, $date, $description, $amount, '<a id="delete-item" class="delete-dtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                }
                computeTotal(); 
            });
        }
        $('#AddDeduction').click(function (e) {
            e.preventDefault();
            addnewDeduction();
        });
        function addnewDeduction() {
            var $id = 0;
            var $empId = $('#EmpId').val();
            var $attId = $('#attid').val();
            var $DedDate = $('#DedDate').val();
            var $description = $('#DeductionDescription').val();
            var $amount = $('#DeductionAmount').val();            

            if ($DedDate === '' || $description === '' || $amount === '') { return; }
            var datacount = deductiondataTable.rows().count();
            var itemno = datacount + 1;

            deductiondataTable.row.add([$id, $empId, $attId, itemno, $DedDate, $description, $amount, '<a id="delete-item" class="delete-dtitem" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
            abp.notify.success('Allowance ' + $description + ' added!', 'Success');
            computeTotal();
        }
        _$DeductionTable.on('click', 'a.delete-dtitem', function (e) {
            e.preventDefault();
            $this = $(this);
            var dtRow = $this.parents('tr');
            var table = _$DeductionTable.DataTable();
            table.row(dtRow[0].rowIndex - 1).remove().draw(false);
            computeTotal();
        });
        $('#btnReloadd').click(function (e) {
            e.preventDefault();
            GetOtherDedRecord($('#attid').val(), $('#EmpId').val());
        });

        ////ChangeCurrentBasicSalary
        $("#BasicSalaryCurrent").focusout(function () {
            BasicSalaryCurrent();
        });
        function BasicSalaryCurrent() {

            var $Current = parseFloat(jQuery("#BasicSalaryCurrent").val().replace(",", ".")) || 0;
            var $RateDay = parseFloat(jQuery("#RatePerDay").val().replace(",", ".")) || 0;
            var $RatePerMonth = parseFloat(jQuery("#RatePerMonth").val().replace(",", ".")) || 0;

            if ($('#SalaryPeriodid').val() == 3) {
                var BasicSalaryAmount = $RatePerMonth / 2;
            }
            else if ($('#SalaryPeriodid').val() != 3) {
                var BasicSalaryAmount = $Current * $RateDay;
            }
            $("#BasicSalaryAmount").val(BasicSalaryAmount);
        }

        //TRAVEL HOURS
        $("#TravelhoursCurrent").focusout(function () {
            Travelhourscount();
            $('#GrossAmount').val('');
        });
        function Travelhourscount() {
            var $Current = parseFloat(jQuery("#TravelhoursCurrent").val().replace(",", ".")) || 0;
            var $RatePehour = parseFloat(jQuery("#TravelhoursAdjustment").val().replace(",", ".")) || 0;
            var TravelhoursAmount = $Current * $RatePehour;
            $("#TravelhoursAmount").val(TravelhoursAmount.toFixed(2));
        }

        //ABSENT
        $("#AbsensesCurrent").focusout(function () {
            $('#GrossAmount').val('');
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
            var $Current = parseFloat(jQuery("#TardinessDeductionLate").val().replace(",", ".")) || 0;
            var $TardinessAjustment = parseFloat(jQuery("#TardinessAjustment").val().replace(",", ".")) || 0;

            var Lateamount = $Current * $TardinessAjustment;
            $("#TardinessAmount").val(cutNumber(Lateamount, 2));
        }

        //Undertime
        $("#UndertimeCurrent").focusout(function () {
            $('#GrossAmount').val('');
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
            $("#UndertimeAmount").val(parseFloat(FullAmt15min).toFixed(2));
        }

        //NIGHT DIFF 
        $("#NightDiffCurrent").focusout(function () {
            $('#GrossAmount').val('');
            NightDiffCurrentCurrent();
        });
        function NightDiffCurrentCurrent() {
            var OTNDrate = '0.10';

            var $RatePerHour = parseFloat(jQuery("#RatePerHour").val().replace(",", ".")) || 0;
            var $NightDiffAdjustment = parseFloat(jQuery("#NightDiffAdjustment").val().replace(",", ".")) || 0;
            var $NightDiffAmount = $RatePerHour * OTNDrate;
            $('#NightDiffAdjustment').val(parseFloat($NightDiffAmount).toFixed(2));

            var $NightDiffCurrent = parseFloat(jQuery("#NightDiffCurrent").val().replace(",", ".")) || 0;
            var $NightDiffAdjustment2 = parseFloat(jQuery("#NightDiffAdjustment").val().replace(",", ".")) || 0;
            var $NightDiffAmount3 = $NightDiffCurrent * $NightDiffAdjustment2;

            $('#NightDiffAmount').val(parseFloat($NightDiffAmount3).toFixed(2));
        }

        //Leave
        $("#LeaveUse").focusout(function () {
            var $Current = document.getElementById('LeaveUse').value;
            var $LeaveAmout = document.getElementById('LeaveAmout').value;
            var hrstomin = $Current * $LeaveAmout;
            $("#LeaveTotalAmout").val(hrstomin);
            $('#GrossAmount').val('');
        });

        //Computer Gross
        $('#Compute').click(function (e) {
            e.preventDefault();
            if ($('#CutOff').val() == "" || $('#CutOff').val() == "0") {
                abp.notify.error('Select cut off');
                return;
            }
            var BasicSalaryAmount = parseFloat(jQuery("#BasicSalaryAmount").val().replace(",", ".")) || 0;
            var LeaveTotalAmout = parseFloat(jQuery("#LeaveTotalAmout").val().replace(",", ".")) || 0;
            var RGOTAmount = parseFloat(jQuery("#RGOTAmount").val().replace(",", ".")) || 0;
            var AllowanceAdjs = parseFloat(jQuery("#AllowanceAdjs").val().replace(",", ".")) || 0;
            //var AttAdjs = parseFloat(jQuery("#AttAdjs").val().replace(",", ".")) || 0;
            var GeneralAmount = parseFloat(jQuery("#GeneralAmount").val().replace(",", ".")) || 0;
            var NONGeneralAmount = parseFloat(jQuery("#NONGeneralAmount").val().replace(",", ".")) || 0;

            var NightDiffAmount = parseFloat(jQuery("#NightDiffAmount").val().replace(",", ".")) || 0;

            var HolidayAmount = parseFloat(jQuery("#HolidayAmount").val().replace(",", ".")) || 0;
            var TravelhoursAmount = parseFloat(jQuery("#TravelhoursAmount").val().replace(",", ".")) || 0;
            var AbsensesAmount = parseFloat(jQuery("#AbsensesAmount").val().replace(",", ".")) || 0;
            var TardinessAmount = parseFloat(jQuery("#TardinessAmount").val().replace(",", ".")) || 0;
            var UndertimeAmount = parseFloat(jQuery("#UndertimeAmount").val().replace(",", ".")) || 0;
            var AttAdjs = parseFloat($("#AttAdjs").val().replace(/,/g, '')) || 0;

            var GrossIncome = BasicSalaryAmount + LeaveTotalAmout + RGOTAmount + AllowanceAdjs + AttAdjs + GeneralAmount + NONGeneralAmount + NightDiffAmount + TravelhoursAmount + HolidayAmount;
            var GrossDeduction = AbsensesAmount + TardinessAmount + UndertimeAmount;
            var GrossTotalIncome = GrossIncome - GrossDeduction;
            $('#GrossAmount').val(cutNumber(GrossTotalIncome, 2));

            $('#LoansAmount').val('');
            $('#TaxableAmount').val('');
            $('#Percent').val('');
            $('#NetIncome').val('');
            SSSContribution();
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
                                $('#SSSAmount').val(result.sssee);
                                $('#SSSAdjustment').val(result.ssser);
                                $('#SSSCurrent').val(result.sssec);
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
                                        $('#SSSAmount').val($ee);
                                        $('#SSSAdjustment').val($er);
                                        $('#SSSCurrent').val($ERC);
                                    }
                                    else if ($sssCutOff == 2 && $('#CutOff').val() == 2) {
                                        $('#SSSAmount').val($ee);
                                        $('#SSSAdjustment').val($er);
                                        $('#SSSCurrent').val($ERC);
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
                                $('#PagibigAmount').val(result.pagibigEC);
                                $('#PagibigAdjustment').val(result.pagibigER);
                                $('#PagibigCurrent').val(result.pagibigECC);
                            }
                        }
                        else if ($pagibigType == 2) {
                            if ($pagibigCutOff == 1 && $('#CutOff').val() == 1) {
                                $('#PagibigAmount').val(result.pagibigEC);
                                $('#PagibigAdjustment').val(result.pagibigER);
                                $('#PagibigCurrent').val(result.pagibigECC);
                            }
                            else if ($pagibigCutOff == 2 && $('#CutOff').val() == 2) {
                                $('#PagibigAmount').val(result.pagibigEC);
                                $('#PagibigAdjustment').val(result.pagibigER);
                                $('#PagibigCurrent').val(result.pagibigECC);
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
                                $('#PhilhealthAmount').val(result.philHealthEC);
                                $('#PhilhealthAdjustment').val(result.philHealthER);
                                $('#PhilhealthCurrent').val(result.philHealthECC);
                            }
                            if ($philHealthCutOff == 2 && $('#CutOff').val() == 2) {
                                $('#PhilhealthAmount').val(result.philHealthEC);
                                $('#PhilhealthAdjustment').val(result.philHealthER);
                                $('#PhilhealthCurrent').val(result.philHealthECC);
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
        }
        //ComputeContribution
        $('#ComputeContribution').click(function (e) {
            e.preventDefault();
            var SSSCurrent = parseFloat(jQuery("#SSSAmount").val().replace(",", ".")) || 0;
            var PhilhealthCurrent = parseFloat(jQuery("#PhilhealthAmount").val().replace(",", ".")) || 0;
            var PagibigCurrent = parseFloat(jQuery("#PagibigAmount").val().replace(",", ".")) || 0;

            var TotalContribution = SSSCurrent + PhilhealthCurrent + PagibigCurrent;
            $('#ContributionAmount').val(TotalContribution.toFixed(2));

            //GetSSSLoanRecord();
            //GetPagibigLoanRecord();
            //GetOtherLoanRecord();
        });

        $('#ComputeLoans').click(function (e) {
            e.preventDefault();
            if ($('#GrossAmount').val() == "") { abp.notify.info('Gross pay not computed ', 'GROSS PAY'); return}

            SSSLoanAmount1 = $("#SSSLoanAmount").val().replace(/,/g, '') || 0;
            PagibigLoanAmount1 = $("#PagibigLoanAmount").val().replace(/,/g, '') || 0;
            OtherLoanAmount1 = $("#OtherLoanAmount").val().replace(/,/g, '') || 0;
            TaxHeld1 = $("#TaxHeld").val() || 0;
            OtherDeduction1 = $("#OtherDeduction").val().replace(/,/g, '') || 0;

            LoanAmount = parseFloat(SSSLoanAmount1) + parseFloat(PagibigLoanAmount1) + parseFloat(OtherLoanAmount1) + parseFloat(TaxHeld1) + parseFloat(OtherDeduction1);
            $("#LoansAmount").val(LoanAmount);
            ComputeTaxableIncome();
        });
        function ComputeTaxableIncome() {

            var Gross = parseFloat($("#GrossAmount").val() || 0);
            var Contri = parseFloat($("#ContributionAmount").val() || 0);
            var Loans = parseFloat($("#LoansAmount").val() || 0);
            var NonTax = parseFloat($("#NONGeneralAmount").val() || 0);

            TaxableAmount1 = Gross - Contri - NonTax;
            jQuery('#TaxableAmount').val(TaxableAmount1.toFixed(2));

            TaxAmount();
        }

        function TaxAmount() {
            var $Period = $('#Periodid').val();
            var PayrollRateAmount = $('#RatePerDay').val();
            var TaxableAmount = $('#TaxableAmount').val();

            $('#Percent').val("");
            $('#NetIncome').val("");
            var PAmount = parseFloat(PayrollRateAmount.replace(/,/g, ""));
            var TAmount = parseFloat(TaxableAmount.replace(/,/g, ""));

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

                        var Taxblenet = TaxableAmount;

                        if ($Period != "") {
                            var Taxnet = $('#Percent').val();
                        }
                        else {
                            var Taxnet = 0.00
                        }

                        var Loan = $('#LoansAmount').val();
                        var Net = parseFloat(Taxblenet.replace(/,/g, "")) - parseFloat(Taxnet.replace(/,/g, "")) - parseFloat(Loan.replace(/,/g, ""));
                    }
                    //$('#NetIncome').val(Net.toFixed(2));

                    $('#NetIncome').val(currencyFormat(Net));
                });
            }
            if ($Period != "1") {
                var $id = $('#EmpId').val();
                _empContributionService.getDetailEmpContributions({ empId: $id }).done(function (result) {
                    if (result === null) {
                        $('#Percent').val("");
                        //$('#LoansAmount').val("");
                        var Loan = ($('#LoansAmount').val() || 0);
                        var Tax = (document.getElementById('Percent').value || 0);
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
                                var Tax = document.getElementById('Percent').value;
                                var Net = TaxableAmount - Tax - parseFloat(Loan.replace(/,/g, ""));
                                $('#NetIncome').val(Net.toFixed(2));
                            }
                            else if ($wtaxType == 2) {
                                var Period = $Period;

                                _empAttRecordService.getTax({ compensation: Period, sSSAmount: TaxableAmount }).done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {

                                        var Percent = result.items[i].percent / 100;
                                        var Prescribe = result.items[i].prescribe;
                                        var StartAmount = result.items[i].startamount;

                                        var computeShare = (TaxableAmount - StartAmount) * Percent;
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
                                var Net = TaxableAmount - Tax - parseFloat(Loan.replace(/,/g, ""));
                                $('#NetIncome').val(Net.toFixed(2));
                            }
                        }
                    }

                })
            }

        }

        $('#btnSavePayroll').click(function (e) {
            e.preventDefault();
            if ($('#TaxableAmount').val() == "" && $('#NetIncome').val() == "") { abp.notify.info('Amount pay not computed ', 'AMOUNT PAY'); return }
            Delete();
        });

        function Delete() {
            var Id = $('#PId').val();
            var EmpId = $('#EmpId').val();
            var Attid = $('#attid').val();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Update Payroll Confirmation', 'ezinvmvc'), Id, EmpId, Attid),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _payrollIServices.delete({
                            id: Id, empId: EmpId, attId: Attid
                        }).done(function () {
                            Delete2(Attid, EmpId);
                            save();
                        });
                    }
                }
            );
        }

        function Delete2($a, $b) {
            //AppPayrollOTDetails
            _payrollIServices.updateDelete({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedOT");
            });
            //AppPayrollAllowanceAdjustment
            _payrollIServices.updateDeleteAllowance({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedAll");
            });
            //AppPayrollAttAdjustment
            _payrollIServices.updateDeleteAttendace({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedatt");
            });
            //AppPayrollSSSLoan
            _payrollIServices.updateDeleteSSSLoan({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedsss");
            });
            //AppPayrollPagibigLoan
            _payrollIServices.updateDeletePagibigLoan({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedpgb");
            });
            //AppPayrollOtherLoan
            _payrollIServices.updateDeleteOtherLoan({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedothl");
            });
            //AppPayrollOtherDeduction
            _payrollIServices.updateDeleteOtherDed({ filter: $a + '|' + $b }).done(function (result) {
                console.log("deletedothded");
            });
        }

        function save() {
            if (!_$EmpPayrollRec.valid()) {
                return;
            }
            var disabled = _$EmpPayrollRec.find(':input:disabled').removeAttr('disabled');
            var formdata = _$EmpPayrollRec.serializeFormToObject();


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
                    "description1": formdata.DeptName
                },

                otdetails: [],
                allowanceadj: [],
                pgbdetails: [],
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
                charge["Index"] = h[k][1];
                charge["EmpId"] = h[k][2];
                charge["AttId"] = h[k][3];
                //charge["Date"] = $.now();             
                charge["Description"] = h[k][4];
                charge["Rate"] = h[k][5];
                charge["Hour"] = h[k][6];
                charge["Amount"] = h[k][7];
                charge["Status"] = "Active";
                viewData.otdetails.push(charge);
            }

            //AllowanceTable
            var allowancetable = _$AllowanceTable.DataTable();
            var form_allowancetable = allowancetable.rows().data();
            var l = form_allowancetable;
            for (var m = 0; l.length > m; m++) {
                charge2 = {};
                charge2["EmpId"] = l[m][2];
                charge2["AttId"] = l[m][3];
                charge2["Index"] = l[m][1];
                charge2["Date"] = l[m][4];
                charge2["Description"] = l[m][5];
                charge2["Amount"] = l[m][6];
                charge2["Status"] = "Active";
                viewData.allowanceadj.push(charge2);
            }

            //sssloanTable
            var ssstable = _$sssloanTable.DataTable();
            var form_data = ssstable.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {

                item3 = {};
                item3["EmpId"] = f[i][1];
                item3["AttId"] = f[i][2];
                item3["AppNo"] = f[i][3];
                item3["StartDate"] = '01/01/1900';
                item3["Description"] = f[i][4];
                item3["LoanAmount"] = f[i][5];
                item3["Balance"] = f[i][6];
                item3["Period"] = "";
                item3["Amount"] = f[i][7];
                item3["Status"] = "Active";
                viewData.sssdetails.push(item3);
            }

            //pgbloanTable
            var pgbtable = _$pagibigLoanTable.DataTable();
            var form_pgbtabledata = pgbtable.rows().data();
            var n = form_pgbtabledata;

            for (var o = 0; n.length > o; o++) {

                item2 = {};
                item2["EmpId"] = n[o][1];
                item2["AttId"] = n[o][2];
                item2["AppNo"] = n[o][3];
                item2["StartDate"] = '01/01/1900';
                item2["Description"] = n[o][4];
                item2["LoanAmount"] = n[o][5];
                item2["Balance"] = n[o][6];
                item2["Period"] = "";
                item2["Amount"] = n[o][7];
                item2["Status"] = "Active";
                viewData.pgbdetails.push(item2);
            }

            //OtherLoanTable
            var OtherLoantable = _$OtherLoanmodalTable.DataTable();
            var form_OtherLoantable = OtherLoantable.rows().data();
            var p = form_OtherLoantable;

            for (var a = 0; p.length > a; a++) {
                item4 = {};
                item4["EmpId"] = p[a][1];
                item4["AttId"] = p[a][2];
                item4["AppNo"] = p[a][3];
                item4["StartDate"] = '01/01/1900';
                item4["Description"] = p[a][4];
                item4["LoanAmount"] = p[a][5];
                item4["Balance"] = p[a][6];
                item4["Period"] = "";
                item4["Amount"] = p[a][7];
                item4["Status"] = "Active";
                viewData.othrloandetails.push(item4);
            }

            //dedTable
            var dedtable = _$DeductionTable.DataTable();
            var form_dedtable = dedtable.rows().data();
            var r = form_dedtable;

            for (var b = 0; r.length > b; b++) {
                item5 = {};
                item5["EmpId"] = r[b][1];
                item5["AttId"] = r[b][2];
                item5["Index"] = r[b][3];
                item5["Date"] = r[b][4];
                item5["Description"] = r[b][5];
                item5["Amount"] = r[b][6];
                item5["Status"] = "Active";
                viewData.othrdeddetails.push(item5);
            }

            //AttadjTable
            var Attadjtable = _$AttAdjTable.DataTable();
            var form_Attadjtable = Attadjtable.rows().data();
            var s = form_Attadjtable;

            for (var t = 0; s.length > t; t++) {
                item6 = {};

                item6["Index"] = s[t][1];
                item6["AttId"] = s[t][3];
                item6["EmpId"] = s[t][2];
                item6["DateT"] = s[t][4];
                item6["AdjType"] = s[t][5];
                item6["Plusminus"] = s[t][7];
                item6["AttAdjDescription"] = s[t][9];
                item6["AttAdjAmount"] = s[t][10];
                item6["Description1"] = s[t][11];
                item6["Description2"] = s[t][12];
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

                            window.location.href = abp.appPath + 'Payroll/PayrollReport';
                            //$('#amOut1').val("");
                            //$('#pmIn1').val("");
                            //$('#pmOut1').val("");
                            //GetAttendanceRecord();
                        });
                    }
                }
            );
        }
    });
})(jQuery);
