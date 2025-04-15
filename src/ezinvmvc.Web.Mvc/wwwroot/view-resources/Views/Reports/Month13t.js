$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

(function () {
    $(function () {
        var _empPayrollService = abp.services.app.empPayrollService;
        var _$13monthTable = $('#13monthTable');

        //$(document).ready(function ()
        //{
        //    //$('#dept').val();
        //    //$('#attid').val();
        //});

        var dataTable = _$13monthTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [
                {
                    visible: false,
                    targets: [0, 1, 2, 5,6]
                },
                {
                    visible: true,
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,20]
                }
                //{
                //    orderable: true,
                //    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
                //}
            ]
        });

        $('#btnshow').click(function (e) {
            $('#AttList').modal('hide');
            var $Comp = $('#Comp').val();
            var $Year = $('#SearchBy').val();
            $('#coveredDate').html($Year);
            $('#Company').html($Comp);
           Get13monthPayroll();
        });
        function Get13monthPayroll() {
            $('#13monthTable').dataTable().fnClearTable();
            _empPayrollService.get13thmonth({ filter: $('#SearchBy').val() + "|" + $('#Comp').val() + "|"+ "" }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $empId = result.items[i].empId;
                    var $company = result.items[i].payrollMonthly;
                    var $code = result.items[i].status;
                    var $name = result.items[i].attId;
                    var $month = result.items[i].payrollPeriod;
                    var $year = result.items[i].period;
                    var $jan = result.items[i].basicSalaryCurrent;
                    var $feb = result.items[i].basicSalaryAdjustment;
                    var $mar = result.items[i].basicSalaryAmount;
                    var $apr = result.items[i].absensesCurrent;
                    var $may = result.items[i].absensesAdjustment;
                    var $jun = result.items[i].absensesAmount;
                    var $jul = result.items[i].tardinessAmount;
                    var $aug = result.items[i].undertimeAdjustment;
                    var $sept = result.items[i].undertimeAmount;
                    var $oct = result.items[i].rgotCurrent;
                    var $nov = result.items[i].rgotAdjustment;
                    var $dec = result.items[i].rgotAmount;

                    var $amount = ($jan + $feb + $mar + $apr + $may + $jun + $jul + $aug + $sept + $oct + $nov + $dec) / 12;
                    var datacount = dataTable.rows().count();
                    var itemno = datacount + 1;
                    //dataTable.row.add([itemno, $empId, $company, $code, $name, $month, $year, currencyFormat($jan), currencyFormat($feb), currencyFormat($mar), currencyFormat($apr), currencyFormat($may), currencyFormat($jun), currencyFormat($jul), currencyFormat($aug), currencyFormat($sept), currencyFormat($oct), currencyFormat($nov), currencyFormat($dec), currencyFormat($amount), '<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-jan="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-price="' + soiprice + '" data-disc1="' + soidisc1 + '" data-disc2="' + soidisc2 + '" data-disc3="' + soidisc3 + '" data-dtype1="' + parseInt($soidtype1) + '" data-dtype2="' + parseInt($soidtype2) + '" data-dtype3="' + parseInt($soidtype3) + '" data-groupname="" data-reference="' + $soiproductcode + '" data-disctotal="' + soitotaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>']).draw();
                    dataTable.row.add([itemno, $empId, $company, $code, $name, $month, $year, currencyFormat($jan), currencyFormat($feb), currencyFormat($mar), currencyFormat($apr), currencyFormat($may), currencyFormat($jun), currencyFormat($jul), currencyFormat($aug), currencyFormat($sept), currencyFormat($oct), currencyFormat($nov), currencyFormat($dec), currencyFormat($amount), '<a id="edit-print" class="edit-print" title="Print" href="#" data-company="' + $company + '" data-code="' + $code + '"data-year="' + $year + '"data-name="' + $name + '" data-jan="' + $jan + '" data-feb="' + $feb + '" data-mar="' + $mar + '" data-apr="' + $apr + '" data-may="' + $may + '" data-jun="' + $jun + '" data-jul="' + $jul + '" data-aug="' + $aug + '" data-sept="' + $sept + '" data-oct="' + $oct + '" data-nov="' + $nov + '" data-dec="' + $dec + '" data-final="' + currencyFormat($amount) + '"><i class="fa fa-print"></i></a>']).draw();
                }
            })

        }
        _$13monthTable.on('click', 'a.edit-print', function (e) {
            e.preventDefault();
            var $company = $(this).attr("data-company");
            var $code = $(this).attr("data-code");
            var $year = $(this).attr("data-year");
            var $name = $(this).attr("data-name");
            var $jan = $(this).attr("data-jan");
            var $feb = $(this).attr("data-feb");
            var $mar = $(this).attr("data-mar");
            var $apr = $(this).attr("data-apr");
            var $may = $(this).attr("data-may");
            var $jun = $(this).attr("data-jun");
            var $jul = $(this).attr("data-jul");
            var $aug = $(this).attr("data-aug");
            var $sept = $(this).attr("data-sept");
            var $oct = $(this).attr("data-oct");
            var $nov = $(this).attr("data-nov");
            var $dec = $(this).attr("data-dec");
            var $final = $(this).attr("data-final");  
            console.log($name);

            var $Company2 = $('#Comp').val();
            var $coveredDate2 = $('#SearchBy').val();
            var win = window.open('');
            var printContents = `<!DOCTYPE html>
                                <html>
                                <head>
                                    <!-- Edited by Erwin -->
                                    <link href="${abp.appPath}css/bootstrap.min.css" rel="stylesheet" asp-append-version="true"/>
                                    <style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; margin-top:1.5in; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } .xfooter {width: 970px; position: absolute; height:4.5in; bottom: 0;  }</style>
                                    <style>

                                        @font-face {
                                            font-family: 'Roboto Slab';
                                            src: url('${abp.appPath}fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf');
                                        }

                                        table , td, th {
	                                        border: 1px solid #e8e8e8;
	                                        border-collapse: collapse;
                                        }
                                        td, th {
	                                        padding: 3px;
	                                        width: 30px;
	                                        height: 25px;
                                        }
                                        th {
	                                        background: #f0e6cc;
                                        }
                                        .even {
	                                        background: #fbf8f0;
                                        }
                                        .odd {
	                                        background: #fefcf9;
                                        }
                                    </style>

                                    <title>PRINT PAYSLIP</title>
                                </head><body>
                                `;
            printContents += '<div style="text-align: center; font-weight: 700; width:50%; font-size: 12px;">MFT INTERNATIONAL CORP</div>';
            printContents += '<div style="text-align: center; font-weight: 700; font-size: x-small; width:50%">13th MONTH PAYSLIP ' + $year + '</div>';

            printContents += '<table style="width: 50%;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-size: 12px;">Employee Name :<br></td>';
            printContents += '<td style="width: 80.0000%; font-size: 12px;">' + $name + '<br></td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-size: 12px;">Employee Code :<br></td>';
            printContents += '<td style="width: 80.0000%;  font-size: 12px;">' + $code + '</td>';
            printContents += '</tr>';
            printContents += '<tr>';
            printContents += '<td style="width: 30.0000%; font-size: 12px;">Department :<br></td>';
            printContents += '<td style="width: 80.0000%;  font-size: 12px;">' + $company + '</td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';


            printContents += '<table style="width: 50%;"><tbody>';
            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;">January<br></td>';
            printContents += '<td style="width: 25%;  font-size: 12px;">' + $jan + '<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">July<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $jul + '<br></td>';
            printContents += '</tr>';

            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;">February<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $feb + '<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">August<br></td>';
            printContents += '<td style="width: 25%;  font-size: 12px;">' + $aug + '<br></td>';
            printContents += '</tr>';

            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;">March<br></td>';
            printContents += '<td style="width: 25%;  font-size: 12px;">' + $mar + '<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">September<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $sept + '<br></td>';
            printContents += '</tr>';

            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;">April<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $apr + '<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">October<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $oct + '<br></td>';
            printContents += '</tr>';

            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;">May<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $may + '<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">November<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $nov + '<br></td>';
            printContents += '</tr>';

            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;">June<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $jun + '<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">December<br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;">' + $dec + '<br></td>';
            printContents += '</tr>';

            printContents += '<tr>';
            printContents += '<td style="width: 25%; font-size: 12px;"><br></td>';
            printContents += '<td style="width: 25%; font-size: 12px;"><br></td>';
            printContents += '<td style="width: 25%;  font-weight: 700; font-size: 12px;">13th Month<br></td>';
            printContents += '<td style="width: 25%; font-weight: 700; font-size: 12px;">' + $final + '<br></td>';
            printContents += '</tr>';
            printContents += '</tbody></table>';
            //Earning
           
            //gross end

            printContents += `</body></html>`;

            win.document.write(printContents);
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('13monthTable', '13monthTable', '13thMonthPay.xls');
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

        //Print
        function printPreviewActual2() {
            var divToPrint = document.getElementById("13monthTable");
            var $Company = $('#Comp').val();
            var $coveredDate = $('#SearchBy').val();
            //NEW
            var win = window.open('');
            win.document.write('<!DOCTYPE html><html><head>');
            win.document.write('<link href="' + abp.appPath + 'css/JournalPayrollPrint.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('<link href="' + abp.appPath + 'css/bootstrap.min.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('<link href="' + abp.appPath + 'css/main.css" rel="stylesheet" asp-append-version="true" />');
            win.document.write('</head>');

            win.document.write('<body>');
            win.document.write('<div class="page-title center" style="text-align:center">');
            win.document.write('<h4>13th Month Report</h4>');
            win.document.write('</div >');
            win.document.write('<div class="page-title center" style="text-align:center;font-size: x-large;">');
            win.document.write($Company + " " + "(" + $coveredDate + ")");
            win.document.write('</div>');

            win.document.write('<div class="center" style="text-align:center">');
            win.document.write(divToPrint.outerHTML);
            win.document.write('</div >');

            win.document.write('</body>');
            win.document.write('</html>');
        }

        $('#PrintActualButton').click(function (e) {
            e.preventDefault();
            printPreviewActual2();
        });
    });
})(jQuery);