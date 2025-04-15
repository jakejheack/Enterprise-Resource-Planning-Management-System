document.getElementById('RegularDayDescription').readOnly = true; 
document.getElementById('RestDayDescription').readOnly = true;
document.getElementById('SpecialHolidayDescription').readOnly = true; 
document.getElementById('LegalHolidayDescription').readOnly = true; 
document.getElementById('SpecialHolidayRDDescription').readOnly = true; 
document.getElementById('LegalHolidayRDDescription').readOnly = true; 
document.getElementById('DoubleHolidayDescription').readOnly = true;
document.getElementById('DoubleHolidayRDDescription').readOnly = true; 

(function () {
    $(function () {
        var _overtimeRatesService = abp.services.app.overtimeRatesService;

        var _$RatesTable = $('#RatesTable');
        var _$formTableNameId = $('form[name=TableNameId]');
        var _$formOvertimeRateSettings = $('form[name=OvertimeRateSettings]');

        var dataTable = _$RatesTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _overtimeRatesService.getOvertimeRate,
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
                    data: "tableName"
                },
                {
                    orderable: false,
                    targets: 2,
                    class: "text-center",
                    data: { id: "id", tableName: "tableName" },
                    "render": function (data) {
                        return '<a id="edit-RatesTable" title="Edit RatesTable" href="#" class="edit-RatesTable" data-RatesTable-id="' + data.id + '" ><i class="fa fa-lg fa-pencil-square-o"></i></a>&nbsp;|&nbsp;<a id="delete-RatesTable" title="delete RatesTable" href="#" class="delete-RatesTable" data-RatesTable-id="' + data.id + '" ><i class="fa fa-lg fa-trash-o"></i></a>';
                    }
                }
            ]
        });

        $('#RatesTable').on('click', 'a.edit-RatesTable', function (e) {
            e.preventDefault();
            $('#TableId').val("");
            var $id = $(this).attr("data-RatesTable-id");

            _overtimeRatesService.getTop1OvertimeRate({ id: $id }).done(function (result) {
                $('#TableName').val(result.tableName);

                $('#RegularDayDescription').val(result.regularDayDescription);
                $('#RestDayDescription').val(result.restDayDescription);
                $('#SpecialHolidayDescription').val(result.specialHolidayDescription);
                $('#LegalHolidayDescription').val(result.legalHolidayDescription);
                $('#SpecialHolidayRDDescription').val(result.specialHolidayRDDescription);
                $('#LegalHolidayRDDescription').val(result.legalHolidayRDDescription);
                $('#DoubleHolidayDescription').val(result.doubleHolidayDescription);
                $('#DoubleHolidayRDDescription').val(result.doubleHolidayRDDescription);

                $('#RegularDayHours').val(result.regularDayHours);
                $('#RestDayHour').val(result.restDayHour);
                $('#SpecialHolidayHour').val(result.specialHolidayHour);
                $('#LegalHolidayHour').val(result.legalHolidayHour);
                $('#SpecialHolidayRDHour').val(result.specialHolidayRDHour);
                $('#LegalHolidayRDHour').val(result.legalHolidayRDHour);
                $('#DoubleHolidayHour').val(result.doubleHolidayHour);
                $('#DoubleHolidayRDHour').val(result.doubleHolidayRDHour);

                $('#RegularDay').val(result.regularDay);
                $('#RestDay').val(result.restDay);
                $('#SpecialHoliday').val(result.specialHoliday);
                $('#LegalHoliday').val(result.legalHoliday);
                $('#SpecialHolidayRD').val(result.specialHolidayRD);
                $('#LegalHolidayRD').val(result.legalHolidayRD);
                $('#DoubleHoliday').val(result.doubleHoliday);
                $('#DoubleHolidayRD').val(result.doubleHolidayRD);

                $('#RegularDayOT').val(result.regularDayOT);
                $('#RestDayOT').val(result.restDayOT);
                $('#SpecialHolidayOT').val(result.specialHolidayOT);
                $('#LegalHolidayOT').val(result.legalHolidayOT);
                $('#SpecialHolidayRDOT').val(result.specialHolidayRDOT);
                $('#LegalHolidayRDOT').val(result.legalHolidayRDOT);
                $('#DoubleHolidayDOT').val(result.doubleHolidayDOT);
                $('#DoubleHolidayRDOT').val(result.doubleHolidayRDOT);

                $('#RegularDayND').val(result.regularDayND);
                $('#RestDayND').val(result.restDayND);
                $('#SpecialHolidayND').val(result.specialHolidayND);
                $('#LegalHolidayND').val(result.legalHolidayND);
                $('#SpecialHolidayRDND').val(result.specialHolidayRDND);
                $('#LegalHolidayRDND').val(result.legalHolidayRDND);
                $('#DoubleHolidayDND').val(result.doubleHolidayDND);
                $('#DoubleHolidayRDND').val(result.doubleHolidayRDND);

                $('#RegularDayNDOT').val(result.regularDayNDOT);
                $('#RestDayNDOT').val(result.restDayNDOT);
                $('#SpecialHolidayNDOT').val(result.specialHolidayNDOT);
                $('#LegalHolidayNDOT').val(result.legalHolidayNDOT);
                $('#SpecialHolidayRDNDOT').val(result.specialHolidayRDNDOT);
                $('#LegalHolidayRDNDOT').val(result.legalHolidayRDNDOT);
                $('#DoubleHolidayNDOT').val(result.doubleHolidayNDOT);
                $('#DoubleHolidayRDNDOT').val(result.doubleHolidayRDNDOT);
            });


        });

        function GetRatesList() {
            dataTable.ajax.reload();
        }

        function saveRateRecord() {
            if (!_$formTableNameId.valid()) {
                return;
            }
            if (!_$formOvertimeRateSettings.valid()) {
                return;
            }
            var account = _$formTableNameId.serializeFormToObject();  //serializeFormToObject is defined in main.js
            var account2 = _$formOvertimeRateSettings.serializeFormToObject();
            var items = { ...account, ...account2 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formOvertimeRateSettings);
                        _overtimeRatesService.createOvertimeRate(items).done(function () {
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
                            abp.ui.clearBusy(_$formOvertimeRateSettings);
                           
                        });
                    }
                }
            );
            GetRatesList();
        }


        function reset() {
            $('#TableName').val(null);

            $('#RegularDayDescription').val("Regular");
            $('#RestDayDescription').val("Rest Day");
            $('#SpecialHolidayDescription').val("Special Holiday");
            $('#LegalHolidayDescription').val("Legal Holiday");
            $('#SpecialHolidayRDDescription').val("Special Holiday Rest Day");
            $('#LegalHolidayRDDescription').val("Legal Holiday Rest Day");
            $('#DoubleHolidayDescription').val("Double Holiday");
            $('#DoubleHolidayRDDescription').val("Double Holiday Rest Day");

            $('#RegularDayHours').val("1");
            $('#RestDayHour').val("1");
            $('#SpecialHolidayHour').val("1");
            $('#LegalHolidayHour').val("1");
            $('#SpecialHolidayRDHour').val("1");
            $('#LegalHolidayRDHour').val("1");
            $('#DoubleHolidayHour').val("1");
            $('#DoubleHolidayRDHour').val("1");

            $('#RegularDay').val("0.000");
            $('#RestDay').val("0.000");
            $('#SpecialHoliday').val("0.000");
            $('#LegalHoliday').val("0.000");
            $('#SpecialHolidayRD').val("0.000");
            $('#LegalHolidayRD').val("0.000");
            $('#DoubleHoliday').val("0.000");
            $('#DoubleHolidayRD').val("0.000");

            $('#RegularDayOT').val("0.000");
            $('#RestDayOT').val("0.000");
            $('#SpecialHolidayOT').val("0.000");
            $('#LegalHolidayOT').val("0.000");
            $('#SpecialHolidayRDOT').val("0.000");
            $('#LegalHolidayRDOT').val("0.000");
            $('#DoubleHolidayDOT').val("0.000");
            $('#DoubleHolidayRDOT').val("0.000");

            $('#RegularDayND').val("0.000");
            $('#RestDayND').val("0.000");
            $('#SpecialHolidayND').val("0.000");
            $('#LegalHolidayND').val("0.000");
            $('#SpecialHolidayRDND').val("0.000");
            $('#LegalHolidayRDND').val("0.000");
            $('#DoubleHolidayDND').val("0.000");
            $('#DoubleHolidayRDND').val("0.000");

            $('#RegularDayNDOT').val("0.000");
            $('#RestDayNDOT').val("0.000");
            $('#SpecialHolidayNDOT').val("0.000");
            $('#LegalHolidayNDOT').val("0.000");
            $('#SpecialHolidayRDNDOT').val("0.000");
            $('#LegalHolidayRDNDOT').val("0.000");
            $('#DoubleHolidayNDOT').val("0.000");
            $('#DoubleHolidayRDNDOT').val("0.000");
        }

        $('#RateSavebutton').click(function (e) {
            e.preventDefault();
            saveRateRecord();
           
        });

        $('#ShowStandardRateButton').click(function (e) {
            e.preventDefault();

            $('#TableName').val("Standard Rate 1");

            $('#RegularDayDescription').val("Regular");
            $('#RestDayDescription').val("Rest Day");
            $('#SpecialHolidayDescription').val("Special Holiday");
            $('#LegalHolidayDescription').val("Legal Holiday");
            $('#SpecialHolidayRDDescription').val("Special Holiday Rest Day");
            $('#LegalHolidayRDDescription').val("Legal Holiday Rest Day");
            $('#DoubleHolidayDescription').val("Double Holiday");
            $('#DoubleHolidayRDDescription').val("Double Holiday Rest Day");

            $('#RegularDayHours').val("1");
            $('#RestDayHour').val("1");
            $('#SpecialHolidayHour').val("1");
            $('#LegalHolidayHour').val("1");
            $('#SpecialHolidayRDHour').val("1");
            $('#LegalHolidayRDHour').val("1");
            $('#DoubleHolidayHour').val("1");
            $('#DoubleHolidayRDHour').val("1");

            $('#RegularDay').val("0.000");
            $('#RestDay').val("1.300");
            $('#SpecialHoliday').val("0.300");
            $('#LegalHoliday').val("1.000");
            $('#SpecialHolidayRD').val("1.500");
            $('#LegalHolidayRD').val("2.600");
            $('#DoubleHoliday').val("2.600");
            $('#DoubleHolidayRD').val("2.900");

            $('#RegularDayOT').val("1.250");
            $('#RestDayOT').val("1.690");
            $('#SpecialHolidayOT').val("1.690");
            $('#LegalHolidayOT').val("2.600");
            $('#SpecialHolidayRDOT').val("1.950");
            $('#LegalHolidayRDOT').val("3.380");
            $('#DoubleHolidayDOT').val("3.900");
            $('#DoubleHolidayRDOT').val("3.900");

            $('#RegularDayND').val("0.100");
            $('#RestDayND').val("1.430");
            $('#SpecialHolidayND').val("0.430");
            $('#LegalHolidayND').val("1.200");
            $('#SpecialHolidayRDND').val("1.950");
            $('#LegalHolidayRDND').val("2.860");
            $('#DoubleHolidayDND').val("3.300");
            $('#DoubleHolidayRDND').val("4.290");

            $('#RegularDayNDOT').val("1.375");
            $('#RestDayNDOT').val("1.859");
            $('#SpecialHolidayNDOT').val("1.859");
            $('#LegalHolidayNDOT').val("2.860");
            $('#SpecialHolidayRDNDOT').val("2.145");
            $('#LegalHolidayRDNDOT').val("3.718");
            $('#DoubleHolidayNDOT').val("4.290");
            $('#DoubleHolidayRDNDOT').val("5.577");

        });

        $('#RateNewbutton').click(function (e) {
            e.preventDefault();

            $('#TableName').val(null);

            $('#RegularDayDescription').val("Regular");
            $('#RestDayDescription').val("Rest Day");
            $('#SpecialHolidayDescription').val("Special Holiday");
            $('#LegalHolidayDescription').val("Legal Holiday");
            $('#SpecialHolidayRDDescription').val("Special Holiday Rest Day");
            $('#LegalHolidayRDDescription').val("Legal Holiday Rest Day");
            $('#DoubleHolidayDescription').val("Double Holiday");
            $('#DoubleHolidayRDDescription').val("Double Holiday Rest Day");

            $('#RegularDayHours').val("1");
            $('#RestDayHour').val("1");
            $('#SpecialHolidayHour').val("1");
            $('#LegalHolidayHour').val("1");
            $('#SpecialHolidayRDHour').val("1");
            $('#LegalHolidayRDHour').val("1");
            $('#DoubleHolidayHour').val("1");
            $('#DoubleHolidayRDHour').val("1");

            $('#RegularDay').val("0.000");
            $('#RestDay').val("0.000");
            $('#SpecialHoliday').val("0.000");
            $('#LegalHoliday').val("0.000");
            $('#SpecialHolidayRD').val("0.000");
            $('#LegalHolidayRD').val("0.000");
            $('#DoubleHoliday').val("0.000");
            $('#DoubleHolidayRD').val("0.000");

            $('#RegularDayOT').val("0.000");
            $('#RestDayOT').val("0.000");
            $('#SpecialHolidayOT').val("0.000");
            $('#LegalHolidayOT').val("0.000");
            $('#SpecialHolidayRDOT').val("0.000");
            $('#LegalHolidayRDOT').val("0.000");
            $('#DoubleHolidayDOT').val("0.000");
            $('#DoubleHolidayRDOT').val("0.000");

            $('#RegularDayND').val("0.000");
            $('#RestDayND').val("0.000");
            $('#SpecialHolidayND').val("0.000");
            $('#LegalHolidayND').val("0.000");
            $('#SpecialHolidayRDND').val("0.000");
            $('#LegalHolidayRDND').val("0.000");
            $('#DoubleHolidayDND').val("0.000");
            $('#DoubleHolidayRDND').val("0.000");

            $('#RegularDayNDOT').val("0.000");
            $('#RestDayNDOT').val("0.000");
            $('#SpecialHolidayNDOT').val("0.000");
            $('#LegalHolidayNDOT').val("0.000");
            $('#SpecialHolidayRDNDOT').val("0.000");
            $('#LegalHolidayRDNDOT').val("0.000");
            $('#DoubleHolidayNDOT').val("0.000");
            $('#DoubleHolidayRDNDOT').val("0.000");

        });

        // Delete record
        $('#RatesTable').on('click', 'a.delete-RatesTable', function (e) {
            var Id = $(this).attr("data-RatesTable-id");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Delete Overtime Rate Confirmation', 'ezinvmvc'), Id),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _overtimeRatesService.deleteOvertimeRate({
                            id: Id
                        }).done(function () {

                            $.ajax({
                                //url: abp.appPath + 'Employee/RemoveFile?code=' + productCode,
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () { },
                                error: function (e) { }
                            });
                            GetRatesList();
                        });
                    }
                }
            );
        });

    });
})(jQuery);