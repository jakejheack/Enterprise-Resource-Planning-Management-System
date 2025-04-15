$(".date-picker").datepicker();
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
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

(function () {
    $(function () {

        var _bioAttendanceService = abp.services.app.bioAttendanceService;
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _employeeSalariesService = abp.services.app.employeeSalariesService;
        var _employeeAllowanceService = abp.services.app.employeeAllowanceService;
        var _empPayrollService = abp.services.app.empPayrollService;

        var _$AttendanceTable = $('#AttendanceTable');
        var _$EmpAttIdTable = $('#EmpAttIdTable');

        var _$EmpPayrollRec = $('form[name=EmpPayrollRec]');
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
                        return '<a id="edit-attendanceId" title="Select AttendanceId" href="#" class="edit-attendanceId" data-attendanceId-id="' + data.attendanceId + '" data-attendanceId-company="' + data.company + '"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        $('#AttendanceTable').on('click', 'a.edit-attendanceId', function (e) {
            e.preventDefault();
            $('#attid').val("");
            var $attid = $(this).attr("data-attendanceId-id");
            $('#attid').val($attid);
            GetAttendanceRecord();

        });

        function GetAttendanceRecord() {
            dataTableatt.ajax.reload();
        }
        var dataTableatt = _$EmpAttIdTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _empAttRecordService.getEmpAttRec,
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
                    visible: false,
                    targets: 1,
                    data: "empId"
                },
                {
                    visible: true,
                    targets: 2,
                    data: "completeName"
                },
                {
                    visible: true,
                    targets: 3,
                    data: "empCode"
                },
                {
                    visible: true,
                    targets: 4,
                    data: "attId"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "date",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    visible: false,
                    targets: 6,
                    data: "dateRecStart",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    visible: false,
                    targets: 7,
                    data: "dateRecEnd",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    visible: false,
                    targets: 8,
                    data: "status"
                },

                {
                    orderable: false,
                    targets: 9,
                    class: "text-center",
                    data: { id: "id", empId: "empId", attId: "attId", completeName: "completeName" },
                    "render": function (data) {
                        return '<a id="View-attendanceId" title="View Record" href="#" class="View-attendanceId" data-attendanceId-id="' + data.id + '" data-attendanceId-empId="' + data.empId + '"  data-attendanceId-attId="' + data.attId + '" data-completeName-attId="' + data.completeName + '"><i class="fa fa-lg fa-pencil-square-o color-blue"></i></a>';
                    }
                }
            ]
        });

        function GetEmployeeRec(Id) {
            $('#Id').val("0");
            $('#EmpCode').val("0");
            $('#Department').val("0");
            $('#CivilStatus').val("");
            $('#PayrollPeriod').val("");
            $('#PayrollRate').val("0.00");
            _employeeSalariesService.getTop1EmpSalary({ empId: Id, }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    $('#Id').val(result.items[i].empId);
                    $('#EmpCode').val(result.items[i].employeeCode);
                    $('#Department').val(result.items[i].deptId);
                    $('#DeptName').val(result.items[i].deptName);
                    $('#CivilStatus').val(result.items[i].civilStatus);
                    $('#PayrollMonthly').val(result.items[i].payrollRatePerMonth.toFixed(2));
                    $('#PayrollPeriod').val(result.items[i].payrollP + " / " + result.items[i].payrollR);
                    $('#Period').val(result.items[i].payrollP);
                    $('#RGOTAdjustment').val(currencyFormat(result.items[i].payrollRatePerHour));
                    $('#UndertimeAdjustment').val(currencyFormat(result.items[i].payrollRatePerHour));
                    $('#TardinessDeductionLate').val(result.items[i].deductionLate);
                    var sonettotal = currencyFormat(result.items[i].payrollRatePerDay);
                    $('#PayrollRate').val(sonettotal);
                    var MinLate = result.items[i].minLate;
                    if (MinLate != "") {
                        var dtt = new Date(result.items[i].minLate);
                        PHoursUndertime = getFormattedTime(dtt);
                        var h = ("0" + dtt.getHours()).slice(-2);
                        var m = ("0" + dtt.getMinutes()).slice(-2);
                        var s = ("0" + dtt.getSeconds()).slice(-2);
                        var UnTime = etime = "00" + ":" + m;

                        $('#TardinessAjustment').val(UnTime);
                    }
                    else { $('#TardinessAjustment').val("0:00"); }
                }
            });
        }

        $('#EmpAttIdTable').on('click', 'a.View-attendanceId', function (e) {
            e.preventDefault();
            clearText1();
            clearText2();

            var $id = $(this).attr("data-attendanceId-id");
            var $EmpId = $(this).attr("data-attendanceId-EmpId");
            var $attId = $(this).attr("data-attendanceId-attId");
            var $completeName = $(this).attr("data-completeName-attId");

            $('#Id').val($id);
            $('#EmpId').val($EmpId);
            $('#attid').val($attId);
            $('#FullName').val($completeName);
            GetEmployeeRec($EmpId);

            GetBasicSalaryCurrentRecord($EmpId, $attId);
            GetEmpBasicSalaryAdjustmentRecord($EmpId, $attId);
            GetAbsensesCurrentRecord($EmpId, $attId);
            GetUndertimeCurrentRecord($EmpId, $attId);
            GetTardinessCurrentRecord($EmpId, $attId);
            GetRGOTCurrentRecord($EmpId, $attId);
            GetGeneralAmountRecord($EmpId);
            GetNonGeneralAmountRecord($EmpId);
            GetSSSLoanRecord($EmpId, 1)
            GetPagibigLoanRecord($EmpId, 2)
            GetOthersLoanRecord($EmpId, 3)


        });

        function GetBasicSalaryCurrentRecord(EmpId, AttId) {
            $('#BasicSalaryCurrent').val('0');
            _empAttRecordService.getEmpGetBasicSalaryCurrent({ empId: EmpId, attRecId: AttId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    $('#BasicSalaryCurrent').val(result.items[i].basicSalaryCurrent);
                }
            });
        }

        function GetEmpBasicSalaryAdjustmentRecord(EmpId, AttId) {
            $('#BasicSalaryAdjustment').val('0');
            _empAttRecordService.getEmpBasicSalaryAdjustment({ empId: EmpId, attRecId: AttId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    $('#BasicSalaryAdjustment').val(result.items[i].basicSalaryAdjustment);
                }
            });
        }

        function GetAbsensesCurrentRecord(EmpId, AttId) {
            $('#AbsensesCurrent').val('0');
            _empAttRecordService.getEmpAbsensesCurrent({ empId: EmpId, attRecId: AttId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //var $AbsensesCurrent = currencyFormat(result.items[i].absensesCurrent);
                    $('#AbsensesCurrent').val(result.items[i].absensesCurrent);

                }
            });
        }

        function GetTardinessCurrentRecord(EmpId, AttId) {

            $('#TardinessCurrent').val('00:00');
            _empAttRecordService.getEmpTardinessCurrent({ empId: EmpId, attRecId: AttId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $tardinessCurrent = result.items[i].tardinessCurrent;
                    $('#TardinessCurrent').val($tardinessCurrent);
                }
            });
        }

        function GetUndertimeCurrentRecord(EmpId, AttId) {
            _empAttRecordService.getUndertimeCurrent({ empId: EmpId, attRecId: AttId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $undertimeCurrent = result.items[i].undertimeCurrent;
                    $('#UndertimeCurrent').val($undertimeCurrent);
                }
            });
        }

        function GetRGOTCurrentRecord(EmpId, AttId) {
            _empAttRecordService.getRGOTCurrent({ empId: EmpId, attRecId: AttId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $rgotCurrent = result.items[i].rgotCurrent;
                    $('#RGOTCurrent').val($rgotCurrent);
                }
            });
        }

        function GetGeneralAmountRecord(EmpId) {
            $('#GeneralAmount').val('0.00')
            $('#GeneralCurrent').val('0.00')
            _employeeAllowanceService.getTop1EmpAllowance({ empId: EmpId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    $('#GeneralAmount').val(result.items[i].empAllowance);
                }
            });
        }
        function GetNonGeneralAmountRecord(EmpId) {
            $('#NONGeneralAdjustment').val('0.00')
            $('#NONGeneralAmount').val('0.00')
            $('#NONGeneralCurrent').val('0.00')
            _employeeAllowanceService.getNonTaxEmpAllowance({ empId: EmpId }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    $('#NONGeneralAmount').val(result.items[i].empAllowance);
                }
            });
        }

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
                    var GrossAmount = $('#PayrollMonthly').val();
                    var PhilHealth = Percent / 100;
                    var TotaPhilHealthContri = parseFloat(GrossAmount.replace(/,/g, "")) * PhilHealth;

                    $('#PhilhealthCurrent').val(TotaPhilHealthContri / 2);
                    var TotaPhilHealthShare = (TotaPhilHealthContri / 2);
                    $('#PhilhealthAmount').val(TotaPhilHealthShare / 2);
                    $('#PhilhealthAdjustment').val(TotaPhilHealthShare / 2);
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

        $('#Compute').click(function (e) {
            e.preventDefault();
            ComputeBasicSalaryAmount();
            ComputeAbsensesAmount();
        });
        function clearText1() {
            $('#id').val("0");
            $('#EmpId').val("");
            $('#attid').val("");
            $('#FullName').val("");
            $('#EmpCode').val("0");
            $('#Department').val("0");
            $('#CivilStatus').val("");
            $('#PayrollPeriod').val("");
            $('#BasicSalaryCurrent').val("0.00");
            $('#BasicSalaryAdjustment').val("0")
            $('#AbsensesCurrent').val("0");
            $('#TardinessCurrent').val("0:00");
            $('#UndertimeCurrent').val("0:00");
            $('#RGOTCurrent').val("0");
            $('#PayrollMonthly').val("0.00");
            $('#Period').val("");
            $('#SSSAmount').val("0.00");
            
            $('#NONGeneralCurrent').val('0.00')
            $('#GeneralAmount').val('0.00')
            $('#GeneralCurrent').val('0.00')
        }

        function clearText2() {
            $('#BasicSalaryAmount').val("0.00");
            $('#AbsensesAmount').val("0.00");
            $('#TardinessAmount').val("0.00");
            $('#UndertimeAmount').val("0.00");
            $('#RGOTAmount').val("0.00");
            $('#GeneralAmount').val("0.00");
            $('#NONGeneralAmount').val("0.00");
            $('#BasicSalaryAdjustment').val("0.00");
            $('#AbsensesAdjustment').val("0.00");
            $('#TardinessAjustment').val("0:00");
            $('#UndertimeAdjustment').val("0.00");
            $('#RGOTAdjustment').val("0.00");
            $('#GeneralAdjustment').val("0.00");
            $('#TardinessDeductionLate').val("0.00");
            $('#UndertimeAdjustment').val("0.00");
            $('#GrossAmount').val("0:00");
            $('#ContributionAmount').val("0:00");
            $('#SSSLoanAmount').val("0.00");
            $('#SSSAmount').val("0.00");
            $('#PagibigLoanAmount').val("0.00");
            $('#OtherLoanAmount').val("0.00");
            $('#TaxableAmount').val("0.00");
            $('#TaxAmount').val("0.00");
            $('#Percent').val("0.00");
            $('#NetIncome').val("0.00");
            $('#Period').val("");
            $('#LoansAmount').val("0.00");

            $('#SSSCurrent').val("0.00");
            $('#SSSAdjustment').val("0.00");
            $('#SSSAmount').val("0.00");
            $('#PhilhealthCurrent').val("0.00");
            $('#PhilhealthAdjustment').val("0.00");
            $('#PhilhealthAmount').val("0.00");
            $('#PagibigCurrent').val("0.00");
            $('#PagibigAjustment').val("0.00");
            $('#PagibigAmount').val("0.00");
        }

        function ComputeBasicSalaryAmount() {
            var PayrollRate = $('#PayrollRate').val();
            var BasicSalaryCurrent = $('#BasicSalaryCurrent').val();
            var BasicSalaryAdjustment = $('#BasicSalaryAdjustment').val();
            var BasicSalaryCount = parseFloat(BasicSalaryCurrent.replace(/,/g, "")) + parseFloat(BasicSalaryAdjustment.replace(/,/g, ""));
            var BasicSalaryAmount = parseFloat(PayrollRate.replace(/,/g, "")) * BasicSalaryCount;
            $('#BasicSalaryAmount').val(BasicSalaryAmount.toFixed(2));
        }

        function ComputeAbsensesAmount() {
            var PayrollRate = $('#PayrollRate').val();
            var AbsensesCurrent = $('#AbsensesCurrent').val();
            var $AbsensesAmount = parseFloat(PayrollRate.replace(/,/g, "")) * parseFloat(AbsensesCurrent.replace(/,/g, ""));
            $('#AbsensesAmount').val($AbsensesAmount.toFixed(2));

            var hms = $('#TardinessCurrent').val();   // your input string
            if (hms != "") {
                var a = hms.split(':'); // split it at the colons
                var minutes = (+a[0]) * 60 + (+a[1]);
                var bLate = $('#TardinessDeductionLate').val();
                var btt = $('#TardinessAjustment').val();
                var bhour = btt.split(':');
                var bminutes = (+bhour[1]);
                if (bminutes != "0") {
                    var min = bminutes;
                }
                else {
                    var min = 1;
                }
                var bCompMinute = (minutes / min) * bLate;
                $('#TardinessAmount').val(bCompMinute.toFixed(2));
            }
            else {
                $('#TardinessAmount').val("0.00");
            }
            var cPerhour = $('#UndertimeAdjustment').val();
            var ctt = $('#UndertimeCurrent').val();
            var chour = ctt.split(':');
            var cminutes = (+chour[0] * cPerhour);
            $('#UndertimeAmount').val(cminutes.toFixed(2));

            var dRGOT = $('#RGOTAdjustment').val();
            var ctt = $('#RGOTCurrent').val();
            var RGOTAmount = dRGOT * ctt;
            $('#RGOTAmount').val(RGOTAmount.toFixed(2));

            amount1 = parseFloat(jQuery("#BasicSalaryAmount").val());
            amount2 = parseFloat(jQuery("#AbsensesAmount").val());
            amount3 = parseFloat(jQuery("#TardinessAmount").val());
            amount4 = parseFloat(jQuery("#UndertimeAmount").val());
            amount5 = parseFloat(jQuery("#RGOTAmount").val());
            amount6 = parseFloat(jQuery("#GeneralAmount").val());
            amount7 = parseFloat(jQuery("#NONGeneralAmount").val());

            Gross = (amount1 + amount5 + amount6 + amount7) - (amount2 + amount3 + amount4);
            jQuery('#GrossAmount').val(Gross.toFixed(2));

            var $sssamount = $('#PayrollMonthly').val();


            GetSSSRecord($sssamount);
            GetPhilHealthRecord();
            GetPagibigRecord();
        }

        $('#ComputeContribution').click(function (e) {
            e.preventDefault();
            SSSAmount1 = parseFloat(jQuery("#SSSAmount").val());
            PhilhealthAmount1 = parseFloat(jQuery("#PhilhealthAmount").val());
            PagibigAmount1 = parseFloat(jQuery("#PagibigAmount").val());

            ContributionAmount = SSSAmount1 + PhilhealthAmount1 + PagibigAmount1;
            jQuery('#ContributionAmount').val(ContributionAmount.toFixed(2));

            
        });

        $('#ComputeLoans').click(function (e) {
            e.preventDefault();
            SSSLoanAmount1 = parseFloat(jQuery("#SSSLoanAmount").val());
            PagibigLoanAmount1 = parseFloat(jQuery("#PagibigLoanAmount").val());
            OtherLoanAmount1 = parseFloat(jQuery("#OtherLoanAmount").val());

            LoanAmount = SSSLoanAmount1 + PagibigLoanAmount1 + OtherLoanAmount1;
            jQuery('#LoansAmount').val(LoanAmount.toFixed(2));

           
            ComputeTaxableIncome();
            TaxAmount();
        });

        function GetSSSLoanRecord(EmpId, LoanTitle) {
            _empAttRecordService.getLoanAmount({ empId: EmpId, loanTitle: LoanTitle }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //var sssLoanCurrent = result.items[i].sssLoanCurrent;
                    jQuery('#SSSLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2)); 
                    jQuery('#SSSLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#SSSLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));  
                }
            });
        }
        function GetPagibigLoanRecord(EmpId, LoanTitle) {
            _empAttRecordService.getLoanAmount({ empId: EmpId, loanTitle: LoanTitle }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //var sssLoanCurrent = result.items[i].sssLoanCurrent;
                    jQuery('#PagibigLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#PagibigLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#PagibigLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
            });
        }
        function GetOthersLoanRecord(EmpId, LoanTitle) {
            _empAttRecordService.getLoanAmount({ empId: EmpId, loanTitle: LoanTitle }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    //var sssLoanCurrent = result.items[i].sssLoanCurrent;
                    jQuery('#OtherLoanCurrent').val(result.items[i].sssLoanCurrent.toFixed(2));
                    jQuery('#OtherLoanAdjustment').val(result.items[i].sssLoanAdjustment.toFixed(2));
                    jQuery('#OtherLoanAmount').val(result.items[i].sssLoanAmount.toFixed(2));
                }
            });
        }
        function ComputeTaxableIncome() {

            var Gross = parseFloat(jQuery("#GrossAmount").val());
            var Contri = parseFloat(jQuery("#ContributionAmount").val());
            var Loans = parseFloat(jQuery("#LoansAmount").val());
            var NonTax = parseFloat(jQuery("#NONGeneralAmount").val());

            TaxableAmount1 = Gross - Contri - Loans - NonTax ;
            jQuery('#TaxableAmount').val(TaxableAmount1.toFixed(2));
        }

        function TaxAmount() {
            var $Period = $('#Period').val();
            var PayrollRateAmount = $('#PayrollRate').val();
            var TaxableAmount = $('#TaxableAmount').val();

            var PAmount = parseFloat(PayrollRateAmount.replace(/,/g, ""));
            var TAmount = parseFloat(TaxableAmount.replace(/,/g, ""));

            if ($Period == "Daily") {
                _empAttRecordService.getTaxDaily({ compensation: $Period, sSSAmount: PAmount }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var Percent = result.items[i].percent / 100;
                        var Prescribe = result.items[i].prescribe;
                        var StartAmount = result.items[i].startamount;

                        var Excess = PAmount - StartAmount;
                        var ExcessTimePercent = (Excess * Percent);

                        var BasicSalaryCurrent = $('#BasicSalaryCurrent').val();
                        var BasicSalaryAdjustment = $('#BasicSalaryAdjustment').val();
                        var BasicAbsensesCurrent = $('#AbsensesCurrent').val();
                        var BasicSalaryCount = parseFloat(BasicSalaryCurrent.replace(/,/g, "")) + parseFloat(BasicSalaryAdjustment.replace(/,/g, "")) - parseFloat(BasicAbsensesCurrent.replace(/,/g, ""));

                        var TaxPerDay =  ExcessTimePercent + Prescribe;
                        var Attendance = BasicSalaryCount;

                        $('#Percent').val(TaxPerDay * Attendance);

                        var Taxblenet = $('#TaxableAmount').val();

                        if ($Period != "") {
                            var Taxnet = $('#Percent').val();
                        }
                        else {
                            var Taxnet = 0.00
                        }

                        var Loan = $('#LoansAmount').val();
                        var Net = parseFloat(Taxblenet.replace(/,/g, "")) - parseFloat(Taxnet.replace(/,/g, "")) - parseFloat(Loan.replace(/,/g, "")) ;
                    }
                    //$('#NetIncome').val(Net.toFixed(2));

                    $('#NetIncome').val(currencyFormat(Net));
                });
            }
            if ($Period != "Daily")
            {
                _empAttRecordService.getTax({ compensation: $Period, sSSAmount: TAmount }).done(function (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        var Percent = result.items[i].percent / 100;
                        var Prescribe = result.items[i].prescribe;
                        var StartAmount = result.items[i].startamount;

                        if ($Period != "")
                        {
                            var Taxnet = Percent;
                        }
                        else
                        {
                            var Taxnet = 0.00;
                        }

                        var Excess = TAmount - StartAmount;
                        var ExcessTimePercent = (Excess * Taxnet);                        
                        var Tax = ExcessTimePercent + Prescribe;
                        $('#Percent').val(Tax.toFixed(2));

                        var Loan = $('#LoansAmount').val();

                        var Net = TAmount - Tax - parseFloat(Loan.replace(/,/g, "")) ;
                        $('#NetIncome').val(currencyFormat(Net));
                        //$('#NetIncome').val(Net.toFixed(2));
                    }
                });
            }

        }

        $('#btnSavePayroll').click(function (e) {
            e.preventDefault();
            saveRateRecord();

        });

        function saveRateRecord() {
            if (!_$EmpPayrollRec.valid())
            {
                return;
            }
            var account = _$EmpPayrollRec.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var items = { ...account };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$EmpPayrollRec);
                        _empPayrollService.createEmpPayroll(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.message.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$EmpPayrollRec);

                        });
                    }
                }
            );
        }
    });
})(jQuery);
