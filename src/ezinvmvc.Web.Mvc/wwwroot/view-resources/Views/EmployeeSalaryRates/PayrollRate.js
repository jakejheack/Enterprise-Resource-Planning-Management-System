
$(".date-picker").datepicker();
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

$('select').selectpicker();

function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}
function cutNumber(number, digitsAfterDot) {
    const str = `${number}`;

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1);
}
(function () {
    $(function () {

        var _employeesservice = abp.services.app.employeeService;
        var _oTRatesService = abp.services.app.oTRatesService;
        var _timeSchedService = abp.services.app.timeSchedService;
        var _empSalariesServices = abp.services.app.empSalariesServices;
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _hRTypeService = abp.services.app.hRTypeService;
        var _empContributionService = abp.services.app.empContributionService;
        
        var _$Employeestable = $('#EmployeesTable');
        var _$EmpSalaryTable = $('#EmpSalaryTable');
        var _$EmpContributionTable = $('#EmpContributionTable');
        var _$formsaverate = $('form[name=formsaverate]');
        var _$formsaveTimeSChed = $('form[name=formsaveTimeSChed]');
        var _$form = $('form[name=form]');
        var _$frmcontribution = $('form[name=frmcontribution]');
        var _$frmcontributionlist = $('form[name=frmcontributionlist]');

        $(document).ready(function () {
            $('#ViewRate').show();
            $('#AddRate').hide();
            $('#ViewTimeSched').show();
            $('#AddTimeSched').hide();
            $('#BtnDelete').hide();
            $('#BtnSave').show();
            $('#BtnTimeSchedDelete').hide();
            $('#BtnTimeSchedSave').show();
            RateList2();
            //RateList1();
            TimeSchedList2();
            //TimeSchedList1();
        });

        var SalaryPeriod = $('#SalaryPeriod');
        SalaryPeriod.empty();
        _hRTypeService.getAllPeriodRate().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                SalaryPeriod.append('<option value=' + result.items[i].id + '>' + result.items[i].status + '</option>');
            }
            SalaryPeriod.selectpicker('refresh');
            $('#SalaryPeriod').selectpicker('val', 1)
        });

        var payrollTypePeriod = $('#Period');
        payrollTypePeriod.empty();
        _hRTypeService.getAllPeriodRate().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                payrollTypePeriod.append('<option value=' + result.items[i].id + '>' + result.items[i].status + '</option>');
            }
            payrollTypePeriod.selectpicker('refresh'); 
            $('#Period').selectpicker('val', 3)
        });

        //employee Table
        var dataTable = _$Employeestable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _employeesservice.getAllEmp,
                inputFilter: function () {
                    var $p = $('#EmployeeTableFilter').val();
                    var $s = $('#StatusId').val();
                    var $c = $('#SearchBy').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $c + '|' + $p + '|' + $s
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',

                    visible: false,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    targets: 1,
                    data: "employeeCode"
                },
                {
                    targets: 2,
                    data: "completeName"
                },
                {
                    targets: 3,
                    data: "cellNo"
                },
                {
                    targets: 4,
                    data: "dept"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "post"
                },
                {
                    visible: false,
                    targets: 6,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { id: "id", completeName: "completeName", employeeCode: "employeeCode" },
                    "render": function (data) {
                        return '<a id="edit-Employee" title="Edit Employee" href="#" class="edit-Employee" data-Employee-id="' + data.id + '" data-Employee-completeName="' + data.completeName + '" data-Employee-employeeCode="' + data.employeeCode + '" data-dismiss="modal"><i class="fa fa-lg fa-pencil-square-o"></i></a>';
                    }
                }
            ]
        });

        function GetEmployees() {
            dataTable.ajax.reload();
        }

        $('#GetEmployeeButton').click(function (e) {
            e.preventDefault();
            GetEmployees();
        });

        $('#EmployeesTable').on('click', 'a.edit-Employee', function (e) {
            e.preventDefault();
            $('#EmpId').val("");
            $('#completeName').val("");
            var employeeId = $(this).attr("data-Employee-id");
            var completeName = $(this).attr("data-Employee-completeName");
            var employeeCode = $(this).attr("data-Employee-employeeCode");
            $('#EmpCode').val(employeeCode);
            $('#EmpId').val(employeeId);
            $('#completeName').val(completeName);
            $('#StartDate').val("");
            $('#EndtDate').val("");
            $('#Rates').val("");
            $('#SalaryPeriod').selectpicker('val', "1");
            $('#Period').selectpicker('val', "3");
            $('#SSSCutOff').selectpicker('val', "1");
            $('#PagibigCutOff').selectpicker('val', "2");
            $('#PhilHealthCutOff').selectpicker('val', "1");
            $('#WTaxCutOff').selectpicker('val', "3");
            $('#SaveRate').prop("disabled", false);
            GetEmpSalaryList();
            GetEmpContributionList();
            //lockAll();
            //clearAll();
            //GetEmployeeSalary(employeeId);
            //GetEmployeeSalaryHistory();
        });
        //employee Table

         //employee Rates Ot
        function RateList1() { 
        var payrollRateType = $('#PayrollRate');
        payrollRateType.empty();
            _oTRatesService.getAllOTRate().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    payrollRateType.append('<option value=' + result.items[i].id + '>' + result.items[i].rateDescription + '</option>');
                }
                payrollRateType.selectpicker('refresh');
                changerate();
            });
        }

        function RateList2() {
            var payrollRateType2 = $('#PayrollRate2');
            payrollRateType2.empty();
            _oTRatesService.getAllOTRate().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    payrollRateType2.append('<option value=' + result.items[i].id + '>' + result.items[i].rateDescription + '</option>');
                }
                payrollRateType2.selectpicker('refresh');
                //changerate();
            });
        } 
               
        $('#SelectOption').click(function (e) {
            e.preventDefault();
            $('#ViewRate').hide();
            $('#AddRate').show();
            $('#BtnDelete').show();
            $('#BtnSave').hide();
            RateList1();
        });

        $('#AddOption').click(function (e) {
            e.preventDefault();
            $('#ViewRate').show();
            $('#AddRate').hide();
            $('#BtnDelete').hide();
            $('#BtnSave').show();
            clearTextRate();
        });

        $('#BtnSave').click(function (e) {
            e.preventDefault();
            SaveRates();
        });

        function SaveRates() {
            if (!_$formsaverate.valid()) {
                return;
            }
            var items = _$formsaverate.serializeFormToObject();
            if ($('#Regural').val() == "") {
                items.Regural = '0.000';
            }
            if ($('#RestDay').val() == "") {
                items.RestDay = '0.000';
            }
            if ($('#SpecialHoliday').val() == "") {
                items.SpecialHoliday = '0.000';
            }
            if ($('#LegalHoliday').val() == "") {
                items.LegalHoliday = '0.000';
            }
            if ($('#SpecialHolidayRestday').val() == "") {
                items.SpecialHolidayRestday = '0.000';
            }
            if ($('#LegalHolidayRestday').val() == "") {
                items.LegalHolidayRestday = '0.000';
            }


            if ($('#ReguralOT').val() == "") {
                items.ReguralOT = '0.000';
            }
            if ($('#RestDayOT').val() == "") {
                items.RestDayOT = '0.000';
            }
            if ($('#SpecialHolidayOT').val() == "") {
                items.SpecialHolidayOT = '0.000';
            }
            if ($('#LegalHolidayOT').val() == "") {
                items.LegalHolidayOT = '0.000';
            }
            if ($('#SpecialHolidayRestdayOT').val() == "") {
                items.SpecialHolidayRestdayOT = '0.000';
            }
            if ($('#LegalHolidayRestdayOT').val() == "") {
                items.LegalHolidayRestdayOT = '0.000';
            }


            if ($('#NDRegural').val() == "") {
                items.NDRegural = '0.000';
            }
            if ($('#NDRestDay').val() == "") {
                items.RegNDRestDayural = '0.000';
            }
            if ($('#NDSpecialHoliday').val() == "") {
                items.NDSpecialHoliday = '0.000';
            }
            if ($('#NDLegalHoliday').val() == "") {
                items.NDLegalHoliday = '0.000';
            }
            if ($('#NDSpecialHolidayRestday').val() == "") {
                items.NDSpecialHolidayRestday = '0.000';
            }
            if ($('#NDLegalHolidayRestday').val() == "") {
                items.NDLegalHolidayRestday = '0.000';
            }


            if ($('#NDReguralOT').val() == "") {
                items.NDReguralOT = '0.000';
            }
            if ($('#NDRestDayOT').val() == "") {
                items.NDRestDayOT = '0.000';
            }
            if ($('#NDSpecialHolidayOT').val() == "") {
                items.NDSpecialHolidayOT = '0.000';
            }
            if ($('#NDLegalHolidayOT').val() == "") {
                items.NDLegalHolidayOT = '0.000';
            }
            if ($('#NDSpecialHolidayRestdayOT').val() == "") {
                items.NDSpecialHolidayRestdayOT = '0.000';
            }
            if ($('#NDLegalHolidayRestdayOT').val() == "") {
                items.NDLegalHolidayRestdayOT = '0.000';
            }
            items.Status1 = 'Active';


            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formsaverate);
                        _oTRatesService.createOTRate(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formsaverate);
                            $('#CreateRateModal').modal('hide');
                            $('#BtnDelete').show();

                            $('#BtnSave').hide();
                            RateList1();
                            RateList2();
                            clearTextRate();
                        });
                    }
                }
            );
        }

        $('#PayrollRate').change(function (e) {
            e.preventDefault();
            changerate();
        });
        
        function changerate() {
            var $id = $('#PayrollRate').val();
            _oTRatesService.getOTRate({ id: $id }).done(function (result) {
                $('#idrate').val(result.id);
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
            })
        }

        $('#BtnDelete').click(function (e) {
            e.preventDefault();
            DeleteRates();
        });

        function DeleteRates() {
            var $id = $('#idrate').val();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Rates Confirmation', 'ezinvmvc'),$id),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _oTRatesService.deleteOTRate({
                            id: $id
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });
                            RateList1();
                            RateList2();
                            clearTextRate();
                        });
                    }
                }
            );
        }

        function clearTextRate() {
            $('#idrate').val(0);
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

        $('#SalaryPeriod').change(function (e) {
            $('#Rates').val("");
        })

        $('#Rates').keypress(function (e) {
            if (isNaN(this.value + "" + String.fromCharCode(e.charCode))) return false;
        })
        .on("cut copy paste", function (e) {
                e.preventDefault();
            });

        $("#Rates").focusout("change paste keyup", function () {
            changerate2();
        });
        
        $("#aDay").on("change paste keyup", function () {
            changerate2();
        });

        $('#PayrollRate2').change(function () {
            changerate2();
        });

        function changerate2() {
            if ($('#Rates').val() == "" || $('#Rates').val() == "0.00") {
                $.ajax({
                    success: function () {
                        abp.notify.warn("Please fill-up rates", "RATES", { "positionClass": "toast-top-right" });
                    }
                });
            }

            else
            {
                var $id = $('#PayrollRate2').val();
                if ($('#SalaryPeriod').val() == "1") {
                    var $rate = $('#Rates').val() || 0;
                    var $aYear = $('#aYear').val();
                    var $Rates = $rate * $aYear / 12;
                    $('#Rates').val("");
                    $('#Rates').val(currencyFormat($Rates));

                    _oTRatesService.getOTRate({ id: $id }).done(function (result) {
                        //rate com
                        var $aYear = $('#aYear').val();
                        var $aDay = $('#aDay').val();
                        var $Rates = $('#Rates').val();
                        //rate com
                        $('#Payrollrateid').val(result.id);

                        //regular rate com
                        var $Rates2 = parseFloat($('#Rates').val().replace(",", "")) || 0;

                        var $Regural1 = $Rates2 * 12 / $aYear / $aDay;
                        $('#Regural1').val(cutNumber($Regural1, 3));
                        //$('#Regural1').val($Regural1.toFixed(3));

                        var $RestDay = $('#Regural1').val() * result.restDay;
                        //$('#RestDay1').val($RestDay.toFixed(3));
                        $('#RestDay1').val(cutNumber($RestDay, 3));

                        var $SpecialHoliday = $('#Regural1').val() * result.specialHoliday;
                        //$('#SpecialHoliday1').val($SpecialHoliday.toFixed(3));
                        $('#SpecialHoliday1').val(cutNumber($SpecialHoliday, 3));

                        var $LegalHoliday = $('#Regural1').val() * result.legalHoliday;
                        //$('#LegalHoliday1').val($LegalHoliday.toFixed(3));
                        $('#LegalHoliday1').val(cutNumber($LegalHoliday, 3));

                        var $specialHolidayRestday = $('#Regural1').val() * result.specialHolidayRestday;
                        //$('#SpecialHolidayRestday1').val($specialHolidayRestday.toFixed(3));
                        $('#SpecialHolidayRestday1').val(cutNumber($specialHolidayRestday, 3));

                        var $LegalHolidayRestday = $('#Regural1').val() * result.legalHolidayRestday;
                        //$('#LegalHolidayRestday1').val($LegalHolidayRestday.toFixed(3));
                        $('#LegalHolidayRestday1').val(cutNumber($LegalHolidayRestday, 3));

                        var $reguralOT = $('#Regural1').val() * result.reguralOT;
                        //$('#ReguralOT1').val($reguralOT.toFixed(3));
                        $('#ReguralOT1').val(cutNumber($reguralOT, 3));

                        var $restDayOT = $('#Regural1').val() * result.restDayOT;
                        //$('#RestDayOT1').val($restDayOT.toFixed(3));
                        $('#RestDayOT1').val(cutNumber($restDayOT, 3));

                        var $SpecialHolidayOT1 = $('#Regural1').val() * result.specialHolidayOT;
                        //$('#SpecialHolidayOT1').val($SpecialHolidayOT1.toFixed(3));
                        $('#SpecialHolidayOT1').val(cutNumber($SpecialHolidayOT1, 3));

                        var $LegalHolidayOT1 = $('#Regural1').val() * result.legalHolidayOT;
                        //$('#LegalHolidayOT1').val($LegalHolidayOT1.toFixed(3));
                        $('#LegalHolidayOT1').val(cutNumber($LegalHolidayOT1, 3));

                        var $SpecialHolidayRestdayOT1 = $('#Regural1').val() * result.specialHolidayRestdayOT;
                        //$('#SpecialHolidayRestdayOT1').val($SpecialHolidayRestdayOT1.toFixed(3));
                        $('#SpecialHolidayRestdayOT1').val(cutNumber($SpecialHolidayRestdayOT1, 3));

                        var $LegalHolidayRestdayOT1 = $('#Regural1').val() * result.legalHolidayRestdayOT;
                        //$('#LegalHolidayRestdayOT1').val($LegalHolidayRestdayOT1.toFixed(3));
                        $('#LegalHolidayRestdayOT1').val(cutNumber($LegalHolidayRestdayOT1, 3));
                        //regular rate com


                        //ND rate com
                        //var $NDRegural1 = $Regural1 * result.ndRegural + parseFloat(jQuery("#Regural1").val());

                        var $NDRegural1 = $Regural1 * 1.10;
                        //$('#NDRegural1').val($NDRegural1.toFixed(3));
                        $('#NDRegural1').val(cutNumber($NDRegural1, 3));

                        var $NDRestDay1 = $('#NDRegural1').val() * result.ndRestDay;
                        //$('#NDRestDay1').val($NDRestDay1.toFixed(3));
                        $('#NDRestDay1').val(cutNumber($NDRestDay1, 3));

                        var $NDSpecialHoliday1 = $('#NDRegural1').val() * result.ndSpecialHoliday;
                        //$('#NDSpecialHoliday1').val($NDSpecialHoliday1.toFixed(3));
                        $('#NDSpecialHoliday1').val(cutNumber($NDSpecialHoliday1, 3));

                        var $NDLegalHoliday1 = $('#NDRegural1').val() * result.ndLegalHoliday;
                        //$('#NDLegalHoliday1').val($NDLegalHoliday1.toFixed(3));
                        $('#NDLegalHoliday1').val(cutNumber($NDLegalHoliday1, 3));

                        var $NDSpecialHolidayRestday1 = $('#NDRegural1').val() * result.ndSpecialHolidayRestday;
                        //$('#NDSpecialHolidayRestday1').val($NDSpecialHolidayRestday1.toFixed(3));
                        $('#NDSpecialHolidayRestday1').val(cutNumber($NDSpecialHolidayRestday1, 3));

                        var $DLegalHolidayRestday1 = $('#NDRegural1').val() * result.ndLegalHolidayRestday;
                        //$('#NDLegalHolidayRestday1').val($DLegalHolidayRestday1.toFixed(3));
                        $('#NDLegalHolidayRestday1').val(cutNumber($DLegalHolidayRestday1, 3));

                        var $NDReguralOT1 = $('#NDRegural1').val() * result.ndReguralOT;
                        //$('#NDReguralOT1').val($NDReguralOT1.toFixed(3));
                        $('#NDReguralOT1').val(cutNumber($NDReguralOT1, 3));

                        var $NDRestDayOT1 = $('#NDRegural1').val() * result.ndRestDayOT;
                        //$('#NDRestDayOT1').val($NDRestDayOT1.toFixed(3));
                        $('#NDRestDayOT1').val(cutNumber($NDRestDayOT1, 3));

                        var $NDSpecialHolidayOT1 = $('#NDRegural1').val() * result.ndSpecialHolidayOT;
                        //$('#NDSpecialHolidayOT1').val($NDSpecialHolidayOT1.toFixed(3));
                        $('#NDSpecialHolidayOT1').val(cutNumber($NDSpecialHolidayOT1, 3));

                        var $NDLegalHolidayOT1 = $('#NDRegural1').val() * result.ndLegalHolidayOT;
                        //$('#NDLegalHolidayOT1').val($NDLegalHolidayOT1.toFixed(3));
                        $('#NDLegalHolidayOT1').val(cutNumber($NDLegalHolidayOT1, 3));

                        var $NDSpecialHolidayRestdayOT1 = $('#NDRegural1').val() * result.ndSpecialHolidayRestdayOT;
                        //$('#NDSpecialHolidayRestdayOT1').val($NDSpecialHolidayRestdayOT1.toFixed(3));
                        $('#NDSpecialHolidayRestdayOT1').val(cutNumber($NDSpecialHolidayRestdayOT1, 3));

                        var $NDLegalHolidayRestdayOT1 = $('#NDRegural1').val() * result.ndLegalHolidayRestdayOT;
                        //$('#NDLegalHolidayRestdayOT1').val($NDLegalHolidayRestdayOT1.toFixed(3));
                        $('#NDLegalHolidayRestdayOT1').val(cutNumber($NDLegalHolidayRestdayOT1, 3));

                        changerateLate();
                    })
                }
                else {
                    _oTRatesService.getOTRate({ id: $id }).done(function (result) {
                        //rate com

                        var $aYear = $('#aYear').val();
                        var $aDay = $('#aDay').val();
                        var $Rates = $('#Rates').val();

                        //rate com
                        $('#Payrollrateid').val(result.id);

                        //regular rate com
                        var $Regural1 = $Rates * 12 / $aYear / $aDay;
                        $('#Regural1').val(cutNumber($Regural1, 3));
                        //$('#Regural1').val($Regural1.toFixed(3));

                        var $RestDay = $('#Regural1').val() * result.restDay;
                        //$('#RestDay1').val($RestDay.toFixed(3));
                        $('#RestDay1').val(cutNumber($RestDay, 3));

                        var $SpecialHoliday = $('#Regural1').val() * result.specialHoliday;
                        //$('#SpecialHoliday1').val($SpecialHoliday.toFixed(3));
                        $('#SpecialHoliday1').val(cutNumber($SpecialHoliday, 3));

                        var $LegalHoliday = $('#Regural1').val() * result.legalHoliday;
                        //$('#LegalHoliday1').val($LegalHoliday.toFixed(3));
                        $('#LegalHoliday1').val(cutNumber($LegalHoliday, 3));

                        var $specialHolidayRestday = $('#Regural1').val() * result.specialHolidayRestday;
                        //$('#SpecialHolidayRestday1').val($specialHolidayRestday.toFixed(3));
                        $('#SpecialHolidayRestday1').val(cutNumber($specialHolidayRestday, 3));

                        var $LegalHolidayRestday = $('#Regural1').val() * result.legalHolidayRestday;
                        //$('#LegalHolidayRestday1').val($LegalHolidayRestday.toFixed(3));
                        $('#LegalHolidayRestday1').val(cutNumber($LegalHolidayRestday, 3));

                        var $reguralOT = $('#Regural1').val() * result.reguralOT;
                        //$('#ReguralOT1').val($reguralOT.toFixed(3));
                        $('#ReguralOT1').val(cutNumber($reguralOT, 3));

                        var $restDayOT = $('#Regural1').val() * result.restDayOT;
                        //$('#RestDayOT1').val($restDayOT.toFixed(3));
                        $('#RestDayOT1').val(cutNumber($restDayOT, 3));

                        var $SpecialHolidayOT1 = $('#Regural1').val() * result.specialHolidayOT;
                        //$('#SpecialHolidayOT1').val($SpecialHolidayOT1.toFixed(3));
                        $('#SpecialHolidayOT1').val(cutNumber($SpecialHolidayOT1, 3));

                        var $LegalHolidayOT1 = $('#Regural1').val() * result.legalHolidayOT;
                        //$('#LegalHolidayOT1').val($LegalHolidayOT1.toFixed(3));
                        $('#LegalHolidayOT1').val(cutNumber($LegalHolidayOT1, 3));

                        var $SpecialHolidayRestdayOT1 = $('#Regural1').val() * result.specialHolidayRestdayOT;
                        //$('#SpecialHolidayRestdayOT1').val($SpecialHolidayRestdayOT1.toFixed(3));
                        $('#SpecialHolidayRestdayOT1').val(cutNumber($SpecialHolidayRestdayOT1, 3));

                        var $LegalHolidayRestdayOT1 = $('#Regural1').val() * result.legalHolidayRestdayOT;
                        //$('#LegalHolidayRestdayOT1').val($LegalHolidayRestdayOT1.toFixed(3));
                        $('#LegalHolidayRestdayOT1').val(cutNumber($LegalHolidayRestdayOT1, 3));
                        //regular rate com


                        //ND rate com
                        //var $NDRegural1 = $Regural1 * result.ndRegural + parseFloat(jQuery("#Regural1").val());

                        var $NDRegural1 = $Regural1 * 1.10;
                        //$('#NDRegural1').val($NDRegural1.toFixed(3));
                        $('#NDRegural1').val(cutNumber($NDRegural1, 3));

                        var $NDRestDay1 = $('#NDRegural1').val() * result.ndRestDay;
                        //$('#NDRestDay1').val($NDRestDay1.toFixed(3));
                        $('#NDRestDay1').val(cutNumber($NDRestDay1, 3));

                        var $NDSpecialHoliday1 = $('#NDRegural1').val() * result.ndSpecialHoliday;
                        //$('#NDSpecialHoliday1').val($NDSpecialHoliday1.toFixed(3));
                        $('#NDSpecialHoliday1').val(cutNumber($NDSpecialHoliday1, 3));

                        var $NDLegalHoliday1 = $('#NDRegural1').val() * result.ndLegalHoliday;
                        //$('#NDLegalHoliday1').val($NDLegalHoliday1.toFixed(3));
                        $('#NDLegalHoliday1').val(cutNumber($NDLegalHoliday1, 3));

                        var $NDSpecialHolidayRestday1 = $('#NDRegural1').val() * result.ndSpecialHolidayRestday;
                        //$('#NDSpecialHolidayRestday1').val($NDSpecialHolidayRestday1.toFixed(3));
                        $('#NDSpecialHolidayRestday1').val(cutNumber($NDSpecialHolidayRestday1, 3));

                        var $DLegalHolidayRestday1 = $('#NDRegural1').val() * result.ndLegalHolidayRestday;
                        //$('#NDLegalHolidayRestday1').val($DLegalHolidayRestday1.toFixed(3));
                        $('#NDLegalHolidayRestday1').val(cutNumber($DLegalHolidayRestday1, 3));

                        var $NDReguralOT1 = $('#NDRegural1').val() * result.ndReguralOT;
                        //$('#NDReguralOT1').val($NDReguralOT1.toFixed(3));
                        $('#NDReguralOT1').val(cutNumber($NDReguralOT1, 3));

                        var $NDRestDayOT1 = $('#NDRegural1').val() * result.ndRestDayOT;
                        //$('#NDRestDayOT1').val($NDRestDayOT1.toFixed(3));
                        $('#NDRestDayOT1').val(cutNumber($NDRestDayOT1, 3));

                        var $NDSpecialHolidayOT1 = $('#NDRegural1').val() * result.ndSpecialHolidayOT;
                        //$('#NDSpecialHolidayOT1').val($NDSpecialHolidayOT1.toFixed(3));
                        $('#NDSpecialHolidayOT1').val(cutNumber($NDSpecialHolidayOT1, 3));

                        var $NDLegalHolidayOT1 = $('#NDRegural1').val() * result.ndLegalHolidayOT;
                        //$('#NDLegalHolidayOT1').val($NDLegalHolidayOT1.toFixed(3));
                        $('#NDLegalHolidayOT1').val(cutNumber($NDLegalHolidayOT1, 3));

                        var $NDSpecialHolidayRestdayOT1 = $('#NDRegural1').val() * result.ndSpecialHolidayRestdayOT;
                        //$('#NDSpecialHolidayRestdayOT1').val($NDSpecialHolidayRestdayOT1.toFixed(3));
                        $('#NDSpecialHolidayRestdayOT1').val(cutNumber($NDSpecialHolidayRestdayOT1, 3));

                        var $NDLegalHolidayRestdayOT1 = $('#NDRegural1').val() * result.ndLegalHolidayRestdayOT;
                        //$('#NDLegalHolidayRestdayOT1').val($NDLegalHolidayRestdayOT1.toFixed(3));
                        $('#NDLegalHolidayRestdayOT1').val(cutNumber($NDLegalHolidayRestdayOT1, 3));

                        changerateLate();
                    })
}

            }
        }

        $('#aYear').keypress(function (e) {
            changerate2();
        })
               
        $('#Btndismiss').click(function (e) {

            e.preventDefault();
            $('#CreateRateModal').modal('hide');
            //clearTextRate();
        });
         //employee Rates Ot


         //employee Timesched Lates

        $("#amLAteEndIn1").on("change paste keyup", function () {
            changerateLate();
        });

        function changerateLate() {
            var t = $("#amLAteEndIn1").val()
            var pat = /\d+/g;
            var arr = (t.match(pat));
            var min = parseInt(arr[1]);

            var $Laterate = $('#Regural1').val() / 60 * min;

            var $UnderLaterate = $('#Regural1').val() / 60;
            //$('#Laterate').val($Laterate.toFixed(3));
            //$('#Undertime').val($UnderLaterate.toFixed(3));
            //$('#Laterate').val(cutNumber($Laterate, 3)); 
            $('#Laterate').val(cutNumber($UnderLaterate, 3)); 
            $('#Undertime').val(cutNumber($UnderLaterate, 3)); 
            clearContri();
        }

        $('#BtnTimeSchedismiss').click(function (e) {
            e.preventDefault();
            $('#CreateTimeSchedModal').modal('hide');
        });

        $('#SelectTimeSchedOption').click(function (e) {
            e.preventDefault();
            $('#ViewTimeSched').hide();
            $('#AddTimeSched').show();
            $('#BtnTimeSchedDelete').show();
            $('#BtnTimeSchedSave').hide();
        });

        $('#AddTimeSchedOption').click(function (e) {
            e.preventDefault();
            $('#ViewTimeSched').show();
            $('#AddTimeSched').hide();
            $('#BtnTimeSchedDelete').hide();
            $('#BtnTimeSchedSave').show();
        });

        $('#BtnTimeSchedSave').click(function (e) {
            e.preventDefault();
            SaveTimeSched();
        });

        function ClearTimeSched()
        {
            $('#amIn').val();
            $('#breakOut').val();
            $('#breakIn').val();
            $('#pmOut').val();
            $('#amLateIn').val();
            $('#amLAteEndIn').val();
            $('#pmLateIn').val();
            $('#pmLateEndIn').val();
        }

        function SaveTimeSched() {
            if (!_$formsaveTimeSChed.valid()) {
                return;
            }
            var item = _$formsaveTimeSChed.serializeFormToObject();
            abp.ui.setBusy(_$formsaveTimeSChed);

            item.flexiTime = $('#FlexitimeStatus').val();
            item.withOverTime = $('#OTStatus').val();
            item.timeDescription = $('#TimeSchedDescription').val();
            item.amIn = $('#amIn').val();
            item.breakOut = $('#breakOut').val();
            item.breakIn = $('#breakIn').val();
            item.pmOut = $('#pmOut').val();
            item.amLateIn = $('#amLateIn').val();
            item.amLAteEndIn = $('#amLAteEndIn').val();
            item.pmLateIn = $('#pmLateIn').val();
            item.pmLateEndIn = $('#pmLateEndIn').val();
            item.Status1 = 'Active';

            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formsaveTimeSChed);
                        _timeSchedService.createTimeSched(item).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$formsaveTimeSChed);
                            $('#CreateTimeSchedModal').modal('hide');
                            $('#BtnTimeSchedDelete').show();
                            $('#BtnTimeSchedSave').hide();
                            //RateList1();
                            TimeSchedList2();
                            ClearTimeSched();
                        });
                    }
                }
            );
        }

        function TimeSchedList1() {
            var timeSchedOption = $('#TimeSchedOption');
            timeSchedOption.empty();
            _timeSchedService.getAllTimeSched().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    timeSchedOption.append('<option value=' + result.items[i].id + '>' + result.items[i].timeDescription + '</option>');
                }
                timeSchedOption.selectpicker('refresh');
                TimeSChed2();
            });
        }

        function TimeSchedList2() {
            var Timesched1 = $('#Timesched1');
            Timesched1.empty();
            _timeSchedService.getAllTimeSched().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    Timesched1.append('<option value=' + result.items[i].id + '>' + result.items[i].timeDescription + '</option>');
                }
                Timesched1.selectpicker('refresh');
                TimeSChed();
            });
        }
        $('#Timesched1').change(function (e) {
            e.preventDefault();
            TimeSChed();
        });

        function TimeSChed() {
            var $id = $('#Timesched1').val();
            console.log($id);
            _timeSchedService.getTimeSched({ id: $id }).done(function (result) {
                $('#Timesched1id').val(result.id);
                $('#FlexitimeStatus1').val(result.flexiTime);
                $('#OTStatus1').val(result.withOverTime);
                $('#idTimeSchedOption1').val(result.id);
                $('#amIn1').val(result.amIn);
                $('#breakOut1').val(result.breakOut);
                $('#breakIn1').val(result.breakIn);
                $('#pmOut1').val(result.pmOut);
                $('#amLateIn1').val(result.amLateIn);
                $('#amLAteEndIn1').val(result.amLAteEndIn);
                $('#pmLateIn1').val(result.pmLateIn);
                $('#pmLateEndIn1').val(result.pmLateEndIn);
            })
        }

        $("#SelectTimeSchedOption").click(function (e) {
            TimeSchedList1();            
        });
        
        function TimeSChed2() {
            var $id = $('#TimeSchedOption').val();
            _timeSchedService.getTimeSched({ id: $id }).done(function (result) {
                $('#idTimeSchedOption').val(result.id);
                $('#amIn').val(result.amIn);
                $('#breakOut').val(result.breakOut);
                $('#breakIn').val(result.breakIn);
                $('#pmOut').val(result.pmOut);
                $('#amLateIn').val(result.amLateIn);
                $('#amLAteEndIn').val(result.amLAteEndIn);
                $('#pmLateIn').val(result.pmLateIn);
                $('#pmLateEndIn').val(result.pmLateEndIn);
            })
        }

        $("#AddTimeSchedOption").click(function (e) {
            $('#idTimeSchedOption').val(0);            
            $('#TimeSchedDescription').val("");
            $('#amIn').val("");
            $('#breakOut').val("");
            $('#breakIn').val("");
            $('#pmOut').val("");
            $('#amLateIn').val("");
            $('#amLAteEndIn').val("");
            $('#pmLateIn').val("");
            $('#pmLateEndIn').val("");
        });

        $("#SaveRate").click(function (e) {
            Save();
        });

        function Save() {
            if (!_$form.valid()) {
                return;
            }
            var items = _$form.serializeFormToObject();
            items.EmpId = $('#EmpId').val();
            items.SalaryPeriod = $('#SalaryPeriod').val();
            items.PayrollPeriod = $('#Period').val();
            items.StartDate = $('#StartDate').val();
            items.EndDate = $('#EndtDate').val();
            items.TaxWHeld = $('#TaxWHeld').val() || 0;
            items.PayrollRatePerMonth = $('#Rates').val();
            var rateperday = $('#Regural1').val() * $('#aDay').val();
            items.PayrollRatePerDay = rateperday.toString();
            items.PayrollRatePerHour = $('#Regural1').val();
            items.Laterate = $('#Laterate').val();
            items.Undertime = $('#Undertime').val();
            items.aYear = $('#aYear').val();
            items.Amonth = $('#Amonth').val();
            items.halfmonth = $('#halfmonth').val();
            items.aWeek = $('#aWeek').val();
            items.aDay = $('#aDay').val();
            items.aHour = $('#aHour').val();
            items.Payrollrateid = $('#Payrollrateid').val();
            items.Timesched1id = $('#Timesched1id').val();
            items.HolidaySchedid = 0;
            items.Description = "";
            items.sleave = $('#SL').val() || 0;
            items.vleave = $('#VL').val() || 0;
            items.totalLeave = $('#TotalLeave').val() || 0;
            items.workers = $('#Workers').val() || 0;
            items.shift = $('#Shift').val() || 0;
            items.pl = $('#PL').val() || 0;
            items.sil = $('#SIL').val() || 0;

            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _empSalariesServices.createEmployeeSalary(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            GetEmpSalaryList();
                            GetEmpContributionList();
                            $('#SSSCutOff').selectpicker('val', "");
                            $('#PagibigCutOff').selectpicker('val', "");
                            $('#PhilHealthCutOff').selectpicker('val', "");
                            $('#WTaxCutOff').selectpicker('val', "");
                            $('#SaveRate').prop("disabled", true);
                            clearContri();
                            //$('#CreateRateModal').modal('hide');
                            //$('#BtnDelete').show();
                            //$('#BtnSave').hide();
                            //RateList1();
                            //RateList2();
                            //clearTextRate();
                        });
                    }
                }
            );
        }

         //Contribution
        $('#ssscheck').change(function ()
        {
            if ($("[id$='ssscheck'][type='checkbox']:checked").length > 0)
            {
                CheckSSSContribution();
            }
            else
            {
                $('#SSSEC').val("");
                $('#SSSER').val("");
                $('#SSSEE').val("");
                $('#SSSEC').attr('readonly', true);
                $('#SSSER').attr('readonly', true);
                $('#SSSEE').attr('readonly', true);
                $('#WTaxECC').val("");
            }           
        });        
        $("#SSSType").change(function () {
            CheckSSSContribution();
        });
        $("#SSSCutOff").change(function () {
            CheckSSSContribution();
        });
        function CheckSSSContribution() {
            if ($('#ssscheck').prop('checked'))
            {
                if ($('#SSSType').val() == "1")
                {
                    $('#SSSEE').attr('readonly', true);
                    $('#SSSER').attr('readonly', true);
                    $('#SSSEC').attr('readonly', true);
                    if ($('#Rates').val() != "")
                    {
                        if ($('#SSSCutOff').val() != "")
                        {
                            if ($('#Rates').val() != "" && $('#SSSCutOff').val() != "3")
                            {
                                _empAttRecordService.getSSS({ sSSAmount: $('#Rates').val() }).done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {

                                        $('#SSSEC').val("");
                                        $('#SSSER').val("");
                                        $('#SSSEE').val("");
                                        //$('#SSSEC').attr('readonly', false);
                                        var $ee = result.items[i].ee;
                                        var $er = result.items[i].er;
                                        var $ERC = result.items[i].erc;
                                        $('#SSSEC').val($ERC.toFixed(2));
                                        $('#SSSER').val($er.toFixed(2));
                                        $('#SSSEE').val($ee.toFixed(2));

                                        $('#WTaxECC').val("");
                                    }
                                });
                            }
                            else if ($('#Rates').val() != "" && $('#SSSCutOff').val() =="3")
                            {
                                _empAttRecordService.getSSS({ sSSAmount: $('#Rates').val() }).done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {

                                        $('#SSSEC').val("");
                                        $('#SSSER').val("");
                                        $('#SSSEE').val("");
                                        var $ee = result.items[i].ee;
                                        var $er = result.items[i].er;
                                        var $ERC = result.items[i].erc;
                                        $('#SSSEC').val($ERC.toFixed(2) / 2);
                                        $('#SSSER').val($er.toFixed(2) / 2);
                                        $('#SSSEE').val($ee.toFixed(2) / 2);

                                        $('#WTaxECC').val("");
                                    }
                                });
                            }
                            //else
                            //{
                            //    $.ajax({
                            //        success: function () {
                            //            abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                            //        }
                            //    });
                            //}
                        }
                        else
                        {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("No SSS Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                                }
                            });

                        }
                    }
                    else
                    {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                //$('#SSSType').selectpicker('val', "")
                            }
                        });
                    }

                    //WTaxcheckContribution();
                }
                else if ($('#SSSType').val() == "2")
                {
                    $('#SSSEE').attr('readonly', true);
                    $('#SSSER').attr('readonly', true);
                    $('#SSSEC').attr('readonly', true);
                    if ($('#SSSCutOff').val() != "")
                    {
                        if ($('#Rates').val() != "" && $('#SSSCutOff').val() != "3")
                        {
                            $('#SSSEC').val("");
                            $('#SSSER').val("");
                            $('#SSSEE').val("");
                            $('#SSSEC').attr('readonly', true);
                            $('#SSSER').attr('readonly', true);
                            $('#SSSEE').attr('readonly', true);
                            $('#WTaxECC').val("");

                        }
                        else if ($('#Rates').val() != "" && $('#SSSCutOff').val() == "3")
                        {
                            $('#SSSEC').val("");
                            $('#SSSER').val("");
                            $('#SSSEE').val("");
                            $('#SSSEC').attr('readonly', true);
                            $('#SSSER').attr('readonly', true);
                            $('#SSSEE').attr('readonly', true);
                            $('#WTaxECC').val("");
                        }
                        else
                        {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else
                    {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No SSS Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#SSSType').val() == "3")
                {
                    if ($('#SSSCutOff').val() != "")
                    {
                        if ($('#Rates').val() != "" ) {
                            $('#SSSEC').attr('readonly', false);
                            $('#SSSER').attr('readonly', false);
                            $('#SSSEE').attr('readonly', false);
                            $('#SSSEC').val("");
                            $('#SSSER').val("");
                            $('#SSSEE').val("");
                            $('#WTaxECC').val("");
                        }
                        else
                        {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else
                    {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No SSS Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                //else
                //{
                //    $.ajax({
                //        success: function () {
                //            abp.notify.warn("No Type Selected", "Select Type", { "positionClass": "toast-top-right" });
                //        }
                //    });
                //}

            }
            else
            {
                $.ajax({
                    success: function () {
                        abp.notify.warn("Check SSS to Activate", "Select SSS", { "positionClass": "toast-top-right" });
                    }
                });
            }
        }

        $('#Pagibigcheck').change(function () {
            if ($("[id$='Pagibigcheck'][type='checkbox']:checked").length > 0) {
                CheckPagibigcheckContribution();
            }
            else {
                $('#PagibigEC').attr('readonly', false);
                $('#PagibigER').attr('readonly', false);
                $('#PagibigECC').attr('readonly', false);
                $('#PagibigEC').val("");
                $('#PagibigER').val("");
                $('#PagibigECC').val("");
            }
        });
        $("#PagibigType").change(function () {
            CheckPagibigcheckContribution();
        });
        $("#PagibigCutOff").change(function () {
            CheckPagibigcheckContribution();
        });
        function CheckPagibigcheckContribution() {
            if ($('#Pagibigcheck').prop('checked')) {
                if ($('#PagibigType').val() == "1") {
                    $('#PagibigEC').attr('readonly', true);
                    $('#PagibigER').attr('readonly', true);
                    $('#PagibigECC').attr('readonly', true);
                    if ($('#Rates').val() != "") {
                        if ($('#PagibigCutOff').val() != "") {
                            if ($('#Rates').val() != "" && $('#PagibigCutOff').val() != "3") {
                                _empAttRecordService.getPagibig().done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {
                                        var $percent = result.items[i].percent;
                                        var amount = result.items[i].amount;
                                        var $amount = $('#Rates').val();
                                        //var ee = $percent * $amount;
                                        //var er = $percent * $amount;
                                        var ee = amount;
                                        var er = amount;
                                        var computeShare = parseInt(ee) + parseInt(er) ;
                                        $('#PagibigEC').val(currencyFormat(ee));
                                        $('#PagibigER').val(currencyFormat(er));
                                        $('#PagibigECC').val(currencyFormat(computeShare));
                                        $('#WTaxECC').val("");
                                    }
                                });
                            }
                            else if ($('#Rates').val() != "" && $('#PagibigCutOff').val() == "3") {
                                _empAttRecordService.getPagibig().done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {
                                        var $percent = result.items[i].percent;
                                        var amount = result.items[i].amount;
                                        var $amount = $('#Rates').val();
                                        //var ee = $percent * $amount / 2;
                                        //var er = $percent * $amount / 2;
                                        var ee = amount / 2;
                                        var er = amount / 2;
                                        var computeShare = parseInt(ee) + parseInt(er);
                                        $('#PagibigEC').val(ee);
                                        $('#PagibigER').val(er);
                                        $('#PagibigECC').val(computeShare);
                                        $('#WTaxECC').val("");
                                    }
                                });
                            }
                            else {
                                $.ajax({
                                    success: function () {
                                        abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                    }
                                });
                            }
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("No Pagibig Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#PagibigType').val() == "2") {
                    $('#PagibigEC').attr('readonly', true);
                    $('#PagibigER').attr('readonly', true);
                    $('#PagibigECC').attr('readonly', true);
                    if ($('#PagibigCutOff').val() != "") {
                        if ($('#Rates').val() != "" && $('#PagibigCutOff').val() != "3") {
                            $('#PagibigEC').val("");
                            $('#PagibigER').val("");
                            $('#PagibigECC').val("");

                            _empAttRecordService.getPagibig().done(function (result) {
                                for (var i = 0; i < result.items.length; i++) {
                                    var $percent = result.items[i].percent;
                                    var amount = result.items[i].amount;
                                    var $amount = $('#Rates').val();
                                    //var ee = $percent * $amount;
                                    //var er = $percent * $amount;
                                    var ee = amount;
                                    var er = amount;
                                    var computeShare = parseInt(ee) + parseInt(er);
                                    $('#PagibigEC').val(ee);
                                    $('#PagibigER').val(er);
                                    $('#PagibigECC').val(computeShare);
                                    $('#WTaxECC').val("");
                                }
                            });
                        }
                        else if ($('#Rates').val() != "" && $('#PagibigCutOff').val() == "3") {
                            $('#PagibigEC').val("");
                            $('#PagibigER').val("");
                            $('#PagibigECC').val("");
                            $('#PagibigEC').attr('readonly', true);
                            $('#PagibigER').attr('readonly', true);
                            $('#PagibigECC').attr('readonly', true);
                            _empAttRecordService.getPagibig().done(function (result) {
                                for (var i = 0; i < result.items.length; i++) {
                                    var $percent = result.items[i].percent;
                                    var amount = result.items[i].amount;
                                    var $amount = $('#Rates').val();
                                    //var ee = $percent * $amount / 2;
                                    //var er = $percent * $amount / 2;
                                    var ee = amount / 2;
                                    var er = amount / 2;
                                    var computeShare = parseInt(ee) + parseInt(er);
                                    $('#PagibigEC').val(ee);
                                    $('#PagibigER').val(er);
                                    $('#PagibigECC').val(computeShare);
                                    $('#WTaxECC').val("");
                                }
                            });
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No Pagibig Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#PagibigType').val() == "3") {
                    $('#PagibigEC').attr('readonly', false);
                    $('#PagibigER').attr('readonly', false);
                    $('#PagibigECC').attr('readonly', false);
                    if ($('#PagibigCutOff').val() != "") {
                        if ($('#Rates').val() != "") {
                            $('#PagibigEC').val("");
                            $('#PagibigER').val("");
                            $('#PagibigECC').val("");
                            $('#WTaxECC').val("");
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No Pagibig Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else {
                    $.ajax({
                        success: function () {
                            abp.notify.warn("No Type Selected", "Select Type", { "positionClass": "toast-top-right" });
                        }
                    });
                }
            }
            else {
                $.ajax({
                    success: function () {
                        abp.notify.warn("Check PagIbig to Activate", "Select PagIbig", { "positionClass": "toast-top-right" });
                    }
                });
            }

        }

        $('#PhilHealthcheck').change(function () {
            if ($("[id$='PhilHealthcheck'][type='checkbox']:checked").length > 0) {
                PhilHealthcheckContribution();
            }
            else {
                $('#PhilHealthEC').val("");
                $('#PhilHealthER').val("");
                $('#PhilHealthECC').val("");
                $('#PhilHealthEC').attr('readonly', true);
                $('#PhilHealthER').attr('readonly', true);
                $('#PhilHealthECC').attr('readonly', true);
                $('#WTaxECC').val("");
            }
        });
        $("#PhilHealthType").change(function () {
            PhilHealthcheckContribution();
        });
        $("#PhilHealthCutOff").change(function () {
            PhilHealthcheckContribution();
        });
        function PhilHealthcheckContribution() {
            if ($('#PhilHealthcheck').prop('checked')) {
                if ($('#PhilHealthType').val() == "1") {
                    $('#PhilHealthEC').attr('readonly', true);
                    $('#PhilHealthER').attr('readonly', true);
                    $('#PhilHealthECC').attr('readonly', true);
                    if ($('#Rates').val() != "") {
                        if ($('#PhilHealthCutOff').val() != "") {
                            if ($('#Rates').val() != "" && $('#PhilHealthCutOff').val() != "3") {
                                _empAttRecordService.getPhilHealth().done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {
                                        var Percent = result.items[i].percent;
                                        var $start = result.items[i].start;
                                        var $end = result.items[i].end;
                                        var $basic = result.items[i].basic;
                                        var $Percent = Percent / 100;
                                        //var $amount2 = $('#Rates').val();

                                        var $amount = parseFloat($('#Rates').val().replace(",", "")) || 0;
                                        var $ee = $amount * $Percent;
                                        var ee = $ee / 2;
                                        var er = $ee / 2;

                                        var computeShare = ee + er;
                                        $('#PhilHealthEC').val(currencyFormat(ee));
                                        $('#PhilHealthER').val(currencyFormat(er));
                                        $('#PhilHealthECC').val(currencyFormat(computeShare));
                                        $('#WTaxECC').val("");
                                    }
                                });
                            }
                            else if ($('#Rates').val() != "" && $('#PhilHealthCutOff').val() == "3") {
                                _empAttRecordService.getPhilHealth().done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {
                                        var Percent = result.items[i].percent;
                                        var $Percent = Percent / 100;
                                        var $amount2 = $('#Rates').val();

                                        var $amount = parseFloat($('#Rates').val().replace(",", "")) || 0;
                                        var amount3 = cutNumber($amount, 2);

                                        var $ee = amount3 * $Percent;
                                        var ee = $ee / 2;
                                        var er = $ee / 2;

                                        var ee2 = ee / 2;
                                        var er2 = er / 2;

                                        $('#PhilHealthEC').val(currencyFormat(ee2));
                                        $('#PhilHealthER').val(currencyFormat(er2));
                                        var computeShare = ee2 + er2;
                                        $('#PhilHealthECC').val(currencyFormat(computeShare));
                                        $('#WTaxECC').val("");
                                    }
                                });
                            }
                            else {
                                $.ajax({
                                    success: function () {
                                        abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                    }
                                });
                            }
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("No PhilHealth Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#PhilHealthType').val() == "2") {
                    $('#PhilHealthEC').attr('readonly', true);
                    $('#PhilHealthER').attr('readonly', true);
                    $('#PhilHealthECC').attr('readonly', true);
                    if ($('#PhilHealthCutOff').val() != "") {
                        if ($('#Rates').val() != "" && $('#PhilHealthCutOff').val() != "3") {
                            $('#PhilHealthEC').val("");
                            $('#PhilHealthER').val("");
                            $('#PhilHealthECC').val("");
                            $('#WTaxECC').val("");
                        }
                        else if ($('#Rates').val() != "" && $('#PhilHealthCutOff').val() == "3") {
                            $('#PhilHealthEC').val("");
                            $('#PhilHealthER').val("");
                            $('#PhilHealthECC').val("");
                            $('#PhilHealthEC').attr('readonly', true);
                            $('#PhilHealthER').attr('readonly', true);
                            $('#PhilHealthECC').attr('readonly', true);
                            $('#WTaxECC').val("");
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No PhilHealth Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#PhilHealthType').val() == "3") {
                    $('#PhilHealthEC').attr('readonly', false);
                    $('#PhilHealthER').attr('readonly', false);
                    $('#PhilHealthECC').attr('readonly', false);
                    if ($('#PhilHealthCutOff').val() != "") {
                        if ($('#Rates').val() != "") {
                            $('#PhilHealthEC').val("");
                            $('#PhilHealthER').val("");
                            $('#PhilHealthECC').val("");
                            $('#WTaxECC').val("");
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No PhilHealth Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else {
                    $.ajax({
                        success: function () {
                            abp.notify.warn("No PhilHealth Type Selected", "Select Type", { "positionClass": "toast-top-right" });
                        }
                    });
                }
            }
            else {
                $.ajax({
                    success: function () {
                        abp.notify.warn("Check PhilHealth to Activate", "Select PhilHealth", { "positionClass": "toast-top-right" });
                    }
                });
            }

        }

        $("#btnCompute").click(function (e) {
            WTaxcheckContribution();
        });
        $('#WTaxcheck').change(function () {
            if ($("[id$='WTaxcheck'][type='checkbox']:checked").length > 0) {
                WTaxcheckContribution();
            }
            else {
                $('#WTaxER').val("");
                $('#WTaxEC').val("");
                $('#WTaxECC').val("");
                $('#WTaxER').attr('readonly', true);
                //$('#WTaxEC').attr('readonly', true);
                $('#WTaxECC').attr('readonly', false);
            }
        });
        $("#WTaxType").change(function () {
            WTaxcheckContribution();
        });
        $("#WTaxCutOff").change(function () {
            WTaxcheckContribution();
        });
        function WTaxcheckContribution() {
            if ($('#WTaxcheck').prop('checked'))
            {
                if ($('#WTaxType').val() == "1") {
                    if ($('#Rates').val() != "") {
                        if ($('#WTaxCutOff').val() != "") {
                            if ($('#Rates').val() != "" && $('#WTaxCutOff').val() != "3") {                               

                                $('#WTaxER').val("");
                                $('#WTaxEC').val("");
                                $('#WTaxECC').val("");
                                $('#WTaxER').attr('readonly', true);
                                $('#WTaxEC').attr('readonly', true);
                                $('#WTaxECC').attr('readonly', false);

                                var $SSSEE1 = $('#SSSEE').val() || 0;
                                var $PagibigEC1 = $('#PagibigEC').val() || 0;
                                var $PhilHealthEC1 = $('#PhilHealthEC').val() || 0;
                                var rates1 = $('#Rates').val();
                                var TotalContribute1 = parseInt(rates1)-parseInt($SSSEE1) - parseInt($PagibigEC1) - parseInt($PhilHealthEC1) ;
                                var Period1 = $('#Period').val();

                                _empAttRecordService.getTax({ compensation: Period1, sSSAmount: TotalContribute1 }).done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {


                                        var Percent1 = result.items[i].percent / 100;
                                        var Prescribe1 = result.items[i].prescribe;
                                        var StartAmount1 = result.items[i].startamount;

                                        var computeShare1 = (TotalContribute1 - StartAmount1) * Percent1;
                                        var Tax1 = Prescribe1 + computeShare1;
                                        $('#WTaxER').val("");
                                        $('#WTaxEC').val("");
                                        $('#WTaxECC').val(Tax1.toFixed(2));
                                    }
                                });
                            }
                            else if ($('#Rates').val() != "" && $('#WTaxCutOff').val() == "3") {
                                $('#WTaxER').val("");
                                $('#WTaxEC').val("");
                                $('#WTaxECC').val("");
                                $('#WTaxER').attr('readonly', true);
                                $('#WTaxEC').attr('readonly', true);
                                $('#WTaxECC').attr('readonly', false);

                                var $SSSEE = $('#SSSEE').val();
                                var $PagibigEC = $('#PagibigEC').val();
                                var $PhilHealthEC = $('#PhilHealthEC').val();
                                var rates = $('#Rates').val();

                                var TotalContribute = parseInt(rates) - parseInt($SSSEE) - parseInt($PagibigEC) - parseInt($PhilHealthEC);
                                var Period = $('#Period').val();

                                _empAttRecordService.getTax({ compensation: Period, sSSAmount: TotalContribute }).done(function (result) {
                                    for (var i = 0; i < result.items.length; i++) {

                                        var Percent = result.items[i].percent / 100;
                                        var Prescribe = result.items[i].prescribe;
                                        var StartAmount = result.items[i].startamount;

                                        var computeShare = (TotalContribute - StartAmount) * Percent;
                                        var Tax = Prescribe + computeShare/2;
                                        $('#WTaxER').val("");
                                        $('#WTaxEC').val("");
                                        $('#WTaxECC').val(Tax.toFixed(2));
                                    }
                                });
                            }
                            else {
                                $.ajax({
                                    success: function () {
                                        abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                    }
                                });
                            }
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("No Tax Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#WTaxType').val() == "2")
                {
                    if ($('#WTaxCutOff').val() != "") {
                        if ($('#Rates').val() != "" && $('#WTaxCutOff').val() != "3")
                        {
                            $('#WTaxER').val("");
                            $('#WTaxEC').val("");
                            $('#WTaxECC').val("");
                            $('#WTaxER').attr('readonly', true);
                            $('#WTaxEC').attr('readonly', true);
                            $('#WTaxECC').attr('readonly', false);
                        }
                        else if ($('#Rates').val() != "" && $('#WTaxCutOff').val() == "3") {
                            $('#WTaxER').val("");
                            $('#WTaxEC').val("");
                            $('#WTaxECC').val("");
                            $('#WTaxER').attr('readonly', true);
                            $('#WTaxEC').attr('readonly', true);
                            $('#WTaxECC').attr('readonly', false);
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No Tax Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else if ($('#WTaxType').val() == "3") {
                    if ($('#WTaxCutOff').val() != "") {
                        if ($('#Rates').val() != "") {
                            $('#WTaxER').val("");
                            $('#WTaxEC').val("");
                            $('#WTaxECC').val("");
                            $('#WTaxER').attr('readonly', true);
                            $('#WTaxEC').attr('readonly', true);
                            $('#WTaxECC').attr('readonly', false);
                        }
                        else {
                            $.ajax({
                                success: function () {
                                    abp.notify.warn("Required Rates Amount", "NO RATES", { "positionClass": "toast-top-right" });
                                }
                            });
                        }
                    }
                    else {
                        $.ajax({
                            success: function () {
                                abp.notify.warn("No Tax Cut-off Selected", "Select Cut-off", { "positionClass": "toast-top-right" });
                            }
                        });
                    }
                }
                else
                {
                    $.ajax({
                        success: function () {
                            abp.notify.warn("No Tax1 Type Selected", "Select Type", { "positionClass": "toast-top-right" });
                        }
                    });
                }
            }
            else
            {
                $.ajax({
                    success: function () {
                        abp.notify.warn("Check Tax to Activate", "Select Tax", { "positionClass": "toast-top-right" });
                    }
                });
            }

        }

        $("#btnsetContri").click(function (e) {
            Savecontri();
        });

        function Savecontri() {
            if (!_$frmcontribution.valid()) {
                return;
            }
            var items = _$frmcontribution.serializeFormToObject();
            items.EmpId = $('#EmpId').val();

            if ($("[id$='ssscheck'][type='checkbox']:checked").length > 0) { var ssschk = true; } else { var ssschk = false; }
            items.SssCheck = ssschk;
            items.SSSType = $('#SSSType').val();
            items.SSSCutOff = $('#SSSCutOff').val();
            items.SSSEE = $('#SSSEE').val().replace(",", "") || 0;
            items.SSSER = $('#SSSER').val().replace(",", "") || 0;
            items.SSSEC = $('#SSSEC').val().replace(",", "") || 0;

            //Pagibig
            //if ($('#Pagibigcheck').attr('checked')) { var pgbchk = true; } else { var pgbchk = false; }
            if ($("[id$='Pagibigcheck'][type='checkbox']:checked").length > 0) { var pgbchk = true; } else { var pgbchk = false; }
            items.Pagibigcheck = pgbchk;
            items.PagibigType = $('#PagibigType').val();
            items.PagibigCutOff = $('#PagibigCutOff').val();
            items.PagibigEC = $('#PagibigEC').val().replace(",", "") || 0;
            items.PagibigER = $('#PagibigER').val().replace(",", "") || 0;
            items.PagibigECC = $('#PagibigECC').val().replace(",", "") || 0;

            //Philheath
            if ($("[id$='PhilHealthcheck'][type='checkbox']:checked").length > 0) { var phltchk = true; } else { var phltchk = false; }
            items.PhilHealthcheck = phltchk;
            items.PhilHealthType = $('#PhilHealthType').val();
            items.PhilHealthCutOff = $('#PhilHealthCutOff').val();
            items.PhilHealthEC = $('#PhilHealthEC').val().replace(",", "") || 0;
            items.PhilHealthER = $('#PhilHealthER').val().replace(",", "") || 0;
            items.PhilHealthECC = $('#PhilHealthECC').val().replace(",", "") || 0;

            //Tax
            if ($("[id$='WTaxcheck'][type='checkbox']:checked").length > 0) { var txchk = true; } else { var txchk = false; }
            items.WTaxcheck = txchk;
            items.WTaxType = $('#WTaxType').val();
            items.WTaxCutOff = $('#WTaxCutOff').val();
            items.WTaxEC = $('#WTaxEC').val().replace(",", "") || 0;
            items.WTaxER = $('#WTaxER').val().replace(",", "") || 0;
            items.WTaxECC = $('#WTaxECC').val().replace(",", "") || 0;
            items.Status = "1";

            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$frmcontribution);
                        _empContributionService.createEmpContribution(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$frmcontribution);
                            //$('#CreateRateModal').modal('hide');
                            //$('#BtnDelete').show();
                            //$('#BtnSave').hide();
                            //RateList1();
                            //RateList2();
                            //clearTextRate();
                            clearContri();
                            GetEmpContributionList();
                        });
                    }
                }
            );
        }

        //employee Salary Table
        function GetEmpSalaryList() {
            datasalaryTable.ajax.reload();
        }
        var datasalaryTable = _$EmpSalaryTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _empSalariesServices.getEmpSalary,
                inputFilter: function () {
                    var $a = $('#EmpId').val();
                    if ($a === '') {
                        $a = '0';
                    }
                    return {
                        filter: $a
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',

                    visible: false,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },

                {
                    orderable: true,
                    targets: 1,
                    data: "startDate",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: true,
                    targets: 2,
                    data: "endDate",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    targets: 3,
                    data: "payrollRatePerMonth"
                },
                {
                    targets: 4,
                    data: "payrollRatePerDay"
                },
                {
                    visible: true,
                    targets: 5,
                    data: "payrollRatePerHour"
                },               
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id" },
                    "render": function (data) {
                        return '<a id="view-rates" title="View Rates" href="#" class="view-rates" view-rates-id="' + data.id + '" ><i class="fa fa-lg fa-pencil-square-o"></i></a> | <a id="delete-rates" title="Delete Rates" href="#" class="delete-rates" delete-rates-id="' + data.id + '" ><i class="fa fa-lg fa-trash-o"></i></a>';
                    }
                }
            ]
        });
        $('#EmpSalaryTable').on('click', 'a.delete-rates', function (e) {
            e.preventDefault();
            var ratesid = $(this).attr("delete-rates-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Salary', 'ezinvmvc'), ratesid),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _empSalariesServices.deleteEmployeeSalary({
                            id: ratesid
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });

                            GetEmpSalaryList();
                        });
                    }
                }
            );

        });
        $('#EmpSalaryTable').on('click', 'a.view-rates', function (e) {
            e.preventDefault();
            var ratesid = $(this).attr("view-rates-id");
            GetEmpSalaryid(ratesid);

        });
        function GetEmpSalaryid(ratesid) {
            _empSalariesServices.getSalariesId({ id: ratesid }).done(function (result) {
                abp.ui.setBusy(_$form);
                var dt = result.startDate;
                var comp = dt.split('-');
                var y = parseInt(comp[0], 10);
                var m = parseInt(comp[1], 10);
                var d = parseInt(comp[2], 10);
                today = m + '/' + d + '/' + y;

                var dt2 = result.endDate;
                var comp2 = dt2.split('-');
                var y = parseInt(comp2[0], 10);
                var m = parseInt(comp2[1], 10);
                var d = parseInt(comp2[2], 10);
                today2 = m + '/' + d + '/' + y;

                $('#StartDate').val(today);
                $('#EndtDate').val(today2);

                var payrollTypePeriod = $('#Period');
                payrollTypePeriod.selectpicker('refresh'); 
                $('#Period').selectpicker('val', result.payrollPeriod);

                var SalaryPeriod = $('#SalaryPeriod');
                SalaryPeriod.selectpicker('refresh');
                $('#SalaryPeriod').selectpicker('val', result.salaryPeriod);

                $('#SL').val(result.sLeave);
                $('#VL').val(result.vLeave);
                $('#PL').val(result.pl);
                $('#SIL').val(result.sil);
                $('#TotalLeave').val(result.totalLeave);

                $('#Workers').selectpicker('val', result.workers);
                $('#Shift').selectpicker('val', result.shift);

                $('#Rates').val(result.payrollRatePerMonth);
                changerate2();

                abp.ui.clearBusy(_$form);
            })
        }

        //employee Contri
        function GetEmpContributionList() {
            dataContributionTable.ajax.reload();
        }
        var dataContributionTable = _$EmpContributionTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _empContributionService.getEmpContribution,
                inputFilter: function () {
                    var $a = $('#EmpId').val();
                    if ($a === '') {
                        $a = '0';
                    }
                    return {
                        filter: $a
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',

                    visible: false,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    orderable: true,
                    targets: 1,
                    data: { sssType: "sSSType" },
                    "render": function (data) {
                        var $ssstype = data.sssType;
                        if ($ssstype === 1) {
                            return "Basic";
                        }
                        else if ($ssstype === 2) {
                            return "Gross";
                        }
                        else if ($ssstype === 3) {
                            return "Fix";
                        }
                    }
                },
                {
                    orderable: true,
                    targets: 2,
                    data: "sssee"
                },
                {
                    orderable: true,
                    targets: 3,
                    data: { pagibigType: "pagibigType" },
                    "render": function (data) {
                        var $pagibigType = data.pagibigType;
                        if ($pagibigType === 1) {
                            return "Basic";
                        }
                        else if ($pagibigType === 2) {
                            return "Gross";
                        }
                        else if ($pagibigType === 3) {
                            return "Fix";
                        }
                    }
                },
                {
                    orderable: true,
                    targets: 4,
                    data: "pagibigEC"
                },
                {
                    orderable: true,
                    targets: 5,
                    data: { philHealthType: "philHealthType" },
                    "render": function (data) {
                        var $philHealthType = data.philHealthType;
                        if ($philHealthType === 1) {
                            return "Basic";
                        }
                        else if ($philHealthType === 2) {
                            return "Gross";
                        }
                        else if ($philHealthType === 3) {
                            return "Fix";
                        }
                    }
                },
                {
                    targets: 6,
                    data: "philHealthEC"
                },
                {
                    orderable: true,
                    targets: 7,
                    data: { wTaxType: "wTaxType" },
                    "render": function (data) {
                        var $wTaxType = data.wTaxType;
                        if ($wTaxType === 1) {
                            return "Basic";
                        }
                        else if ($wTaxType === 2) {
                            return "Gross";
                        }
                        else if ($wTaxType === 3) {
                            return "Fix";
                        }
                    }
                },
                {
                    targets: 8,
                    data: "wTaxECC"
                },
                {
                    visible: true,
                    targets: 9,
                    data: { status: "status" },
                    "render": function (data) {
                        var $status = data.status;
                        if ($status === 1) {
                            return "Active";
                        }
                        else {
                            return "In-Active";
                        }
                    }
                },
                {
                    orderable: false,
                    targets: 10,
                    class: "text-center",
                    data: { id: "id" },
                    "render": function (data) {
                        return '<a id="view-Contri" title="View Contribution" href="#" class="view-Contri" view-Contri-id="' + data.id + '" ><i class="fa fa-lg fa-pencil-square-o"></i></a> | <a id="delete-Contri" title="Delete Contribution" href="#" class="delete-Contri" delete-Contri-id="' + data.id + '" ><i class="fa fa-lg fa-trash-o"></i></a>';
                    }
                }
            ]
        });
        $('#EmpContributionTable').on('click', 'a.delete-Contri', function (e) {
            e.preventDefault();
            var Contrid = $(this).attr("delete-Contri-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Contribution', 'ezinvmvc'), Contrid),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _empContributionService.deleteEmpContribution({
                            id: Contrid
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });

                            GetEmpContributionList();
                        });
                    }
                }
            );

        });
        $('#EmpContributionTable').on('click', 'a.view-Contri', function (e) {
            e.preventDefault();
            var ratesid = $(this).attr("view-Contri-id");
            GetContributionid(ratesid);

        });
        function GetContributionid(ratesid) {
            _empContributionService.getEmpContributionById({ id: ratesid }).done(function (result) {
                abp.ui.setBusy(_$frmcontribution);
                //$('#SSSType').selectpicker('val', result.sssType);
                $('#SSSCutOff').selectpicker('val', result.sssCutOff);
                $('#SSSEE').val(result.sssee);
                $('#SSSER').val(result.ssser);
                $('#SSSEC').val(result.sssec);
                //$('#PagibigType').selectpicker('val', result.pagibigType);
                $('#PagibigCutOff').selectpicker('val', result.pagibigCutOff);
                $('#PagibigEC').val(result.pagibigEC);
                $('#PagibigER').val(result.pagibigER);
                $('#PagibigECC').val(result.pagibigECC);
                //$('#PhilHealthType').selectpicker('val', result.philHealthType);
                $('#PhilHealthCutOff').selectpicker('val', result.philHealthCutOff);
                $('#PhilHealthEC').val(result.philHealthEC);
                $('#PhilHealthER').val(result.philHealthER);
                $('#PhilHealthECC').val(result.philHealthECC);
                //$('#WTaxType').selectpicker('val', result.wTaxType);
                $('#WTaxCutOff').selectpicker('val', result.wTaxCutOff);
                $('#WTaxER').val(result.wTaxER);
                $('#WTaxEC').val(result.wTaxEC);
                $('#WTaxECC').val(result.wTaxECC);

                abp.ui.clearBusy(_$frmcontribution);
            })
        }

        $('#SL').change(function () {
            changetotalLeave();
        });
        $('#VL').change(function () {
            changetotalLeave();
        });
        $('#PL').change(function () {
            changetotalLeave();
        });
        $('#SIL').change(function () {
            changetotalLeave();
        });

        function changetotalLeave() {
            var $sl = $('#SL').val() || 0;
            var $vl = $('#VL').val() || 0;
            var $pl = $('#PL').val() || 0;
            var $sil = $('#SIL').val() || 0;

            var $totalLeave = roundNumber((parseFloat($sl) + parseFloat($vl)),2);
            $('#TotalLeave').val($totalLeave);
        }

        function clearContri() {
            $('#SSSEC').val("");
            $('#SSSER').val("");
            $('#SSSEE').val("");
            $('#PagibigEC').val("");
            $('#PagibigER').val("");
            $('#PagibigECC').val("");
            $('#PhilHealthEC').val("");
            $('#PhilHealthER').val("");
            $('#PhilHealthECC').val("");
            $('#WTaxEC').val("");
            $('#WTaxECC').val("");

            $('#SSSType').selectpicker('val', "");
            //$('#SSSCutOff').selectpicker('val', "");
            $('#PagibigType').selectpicker('val', "");
            //$('#PagibigCutOff').selectpicker('val', "");
            $('#PhilHealthType').selectpicker('val', "");
            //$('#PhilHealthCutOff').selectpicker('val', "");
            $('#WTaxType').selectpicker('val', "");
            //$('#WTaxCutOff').selectpicker('val', "");
        }

        $('#PagibigER').change(function () {           
            var ee = $('#PagibigEC').val() || 0;
            var er = $('#PagibigER').val() || 0;
            var computeShare = parseInt(ee) + parseInt(er);           
            $('#PagibigECC').val(computeShare);
        });
        $('#PagibigEC').change(function () {
            var ee = $('#PagibigEC').val() || 0;
            var er = $('#PagibigER').val() || 0;
            var computeShare = parseInt(ee) + parseInt(er);
            $('#PagibigECC').val(computeShare);
        });

        $('#PhilHealthEC').change(function () {
            var ee = $('#PhilHealthEC').val() || 0;
            var er = $('#PhilHealthER').val() || 0;
            var computeShare = parseInt(ee) + parseInt(er);
            $('#PhilHealthECC').val(computeShare);
        });
        $('#PhilHealthER').change(function () {
            var ee = $('#PhilHealthEC').val() || 0;
            var er = $('#PhilHealthER').val() || 0;
            var computeShare = parseInt(ee) + parseInt(er);
            $('#PhilHealthECC').val(computeShare);
        });

    })
})(jQuery);
