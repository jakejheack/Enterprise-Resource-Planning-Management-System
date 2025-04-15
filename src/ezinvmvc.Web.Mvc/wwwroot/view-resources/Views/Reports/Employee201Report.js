$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});
function cutNumber(number, digitsAfterDot) {
    const str = `${number}`;

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1);
}

(function () {
    $(function () {
        var _empAttRecordService = abp.services.app.empAttRecordService;
        var _$AttendanceTable = $('#AttendanceTable');
        var _$201Table = $('#201Table');

        $(document).ready(function () {
            get201();
        });
        var dataTable = _$201Table.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    orderable: true,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                },
                {
                    className: 'text-left',
                    //targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25]
                },
                {
                    "visible": true,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                {
                    "visible": false,
                    targets: [8]
                }
            ]
        });
        function get201() {
            var search = $('#SearchBy').val();
            var value = $('#filtername').val();
            var code = "";
            var name = "";
            var position = "";
            var company = "";
            var department = "";

            if (search == "code") {
                code = value;
            }
            if (search == "name") {
                name = value;
            }
            if (search == "position") {
                position = value;
            }
            if (search == "company") {
                company = value;
            }
            if (search == "department") {
                department = value;
            }
            console.log($('#filtername').val());
            _empAttRecordService.get201List({ filter: code + '|' + name + '|' + position + '|' + company + '|' + department }).done(function (result) {
                dataTable.clear().draw();
                for (var i = 0; i < result.items.length; i++) {
                    var $no = result.items[i].no;
                    var $AttRecId = result.items[i].attRecId;
                    var $AttId = result.items[i].attId;
                    var $Days = result.items[i].days;
                    var $in = result.items[i].in;
                    var $Out = result.items[i].out;
                    var $Late = result.items[i].late;
                    var $BasicSalaryCurrent = result.items[i].basicSalaryCurrent;
                    var $BasicSalaryAdjustment = result.items[i].basicSalaryAdjustment;
                    dataTable.row.add([$no, $AttRecId.toUpperCase(), $AttId, $Days, $in, $Out, $Late, currencyFormat($BasicSalaryCurrent), currencyFormat($BasicSalaryAdjustment)]).draw();
                }
            });
        }
        $('#show').click(function (e) {
            e.preventDefault();
            get201();
            $('#AttList').modal('hide');
        });
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('201Table', '201Table', '201Report.xls');
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