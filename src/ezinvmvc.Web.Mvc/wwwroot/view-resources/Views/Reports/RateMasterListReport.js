$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});

var $month = (new Date().getMonth() + 1);
var mdayone = $month + "/01/" + new Date().getFullYear();
$('#DateFrom').val(mdayone);

$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

function getISODate(d) {
    // padding function
    var s = function (a, b) { return (1e15 + a + "").slice(-b) };

    // default date parameter
    if (typeof d === 'undefined') {
        d = new Date();
    };

    // return ISO datetime
    return d.getFullYear() + '/' +
        s(d.getMonth() + 1, 2) + '/' +
        s(d.getDate(), 2) + ' ';
}

(function () {
    $(function () {
        var _sectorservices = abp.services.app.sectorService;
        var _positionService = abp.services.app.positionService;
        var _departmentService = abp.services.app.departmentService;
        var _$EmpTable = $('#EmpTable');
        var _employeesservice = abp.services.app.employeeService;

        var sectors = $('#sectors');
        sectors.empty();
        sectors.append('<option value = "" >-- Company --</option > ');
        _sectorservices.getSector({ filter: "" }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                sectors.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            sectors.selectpicker('refresh');
        });
        var Department = $('#Department');
        Department.empty();
        Department.append('<option value = "" >-- Department --</option > ');
        _departmentService.getDepartments({ filter: "" }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                Department.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            Department.selectpicker('refresh');
        });

        var position = $('#Position');
        position.empty();
        position.append('<option value = "" >-- Position --</option > ');
        _positionService.getPosition({ filter: "" }).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                position.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            position.selectpicker('refresh');
        });


        $(document).ready(function () {
            getempmasterlist();
        });
        $('#SearchFilter').click(function (e) {
            e.preventDefault();
            getempmasterlist();
        });
        var dataTable = _$EmpTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [19, 20, 21, 22, 23, 24]
            },
            //{
            //    orderable: false,
            //    targets: [0, 1, 2, 3, 4, 5, 6, 7]
            //},
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [ 10, 11, 12 ,13,14]
            },
            //{
            //    className: 'text-center',
            //    targets: [3]
            //}
            ]
        });

        function getempmasterlist() {
            dataTable.clear().draw();
            var $DateFrom = "";
            var $DateTo = "";
            var $EmployeeCode = $('#EmployeeCode').val();
            var $Employeename = $('#Employeename').val();
            var $sectors = $('#sectors').val();
            var $Department= $('#Department').val();
            var $Position = $('#Position').val();
            var $StatusId = $('#StatusId').val();

            _employeesservice.getAllRateMasterList({ filter: $DateFrom + '|' + $DateTo + '|' + $EmployeeCode + '|' + $Employeename + '|' + $sectors + '|' + $Position + '|' + $StatusId + '|' + $Department }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sect = result.items[i].sect;
                    var $post = result.items[i].post;
                    var $dept = result.items[i].dept;
                    var $sectorsid = result.items[i].sectorsId;
                    var $departmentid = result.items[i].departmentId;
                    var $positionid = result.items[i].positionId;

                    var $employeeCode = result.items[i].employeeCode;
                    var $name = result.items[i].name;
                    var $gender = result.items[i].gender;
                    var $emptypeId = result.items[i].emptypeId;
                    if ($emptypeId == 1) {
                        var $empType = "Regular";
                    }
                    if ($emptypeId == 2) {
                        var $empType = "Probationary";
                    }
                    if ($emptypeId == 3) {
                        var $empType = "Project Base";
                    }

                    var $civilStatus = result.items[i].civilStatus;

                    var Bdate = new Date(result.items[i].birthDate);
                    var $birthDate = getISODate(Bdate);

                    var $sss = result.items[i].sss;
                    var $philHealthNo = result.items[i].philHealthNo;
                    var $pagIbigNo = result.items[i].pagIbigNo;
                    var $tin = result.items[i].tin;
                    var $bankNo = result.items[i].bankNo;

                    var Hdate = new Date(result.items[i].hireDate);
                    var $hireDate = getISODate(Hdate);                    

                    var $managerId = result.items[i].managerId;
                    var $statusId = result.items[i].statusId;
                    if ($statusId == 1) {
                        var $Stats = "Hired";
                    }
                    if ($statusId == 2) {
                        var $Stats = "Resigned";
                    }
                    if ($statusId == 3) {
                        var $Stats = "Terminated";
                    }
                    if ($statusId == 4) {
                        var $Stats = "Rehired";

                    }
                    if ($statusId == 1) {
                        var $Resigned = "";
                    }
                    if ($statusId == 2) {
                        var $dateResigned = "";
                        $dateResigned = result.items[i].dateResigned;
                        if ($dateResigned == null) {
                            var $Resigned = "";
                        }
                        else {
                            var Rdate = new Date($dateResigned);
                            var $Resigned = getISODate(Rdate);
                        }

                    }
                    if ($statusId == 3) {
                        var $dateTerminated = "";
                        var $dateTerminated = result.items[i].dateTerminated;
                        if ($dateTerminated == null) {
                            var $Resigned = "";
                        }
                        else {
                            var Rdate = new Date($dateTerminated);
                            var $Resigned = getISODate(Rdate);
                        }
                    }
                    if ($statusId == 4) {
                        var $Resigned = "";
                    }
                    var $payrollperiod = result.items[i].d1Status;
                    var $monthlyrate = result.items[i].d1Name;
                    var $dailyrate = result.items[i].d1Address;
                    var $hourlyrate = result.items[i].d2Name;
                    var $minrate = result.items[i].d2Address;
                    var $allowance = result.items[i].d2Status;


                    var $datacount = dataTable.rows().count();
                    var $itemno = $datacount + 1;

                    dataTable.row.add([$itemno, $sect, $post, $dept.toUpperCase(), $employeeCode, $name.toUpperCase(), $gender.toUpperCase(), $empType.toUpperCase(), $civilStatus,$payrollperiod, $monthlyrate, $dailyrate, $hourlyrate, $minrate, $allowance, $hireDate, $Resigned, $managerId + " Yrs", $Stats,$birthDate, $sss, $philHealthNo, $pagIbigNo, $tin, $bankNo,]).draw();
                }
            });
        }
        //Export
        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            var dt = new Date($.now());
            tableToExcel('EmpTable', 'EmpTable', 'EmployeeRateMasterListReport.xls');
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
        $('#Print').click(function (e) {
            e.preventDefault();
            printPreviewActual();
        });

        function printPreviewActual() {
            var date = new Date(); 
            var divToPrint = document.getElementById("EmpTable");
            var $rundate = date.toLocaleDateString();

            var $sectors = document.getElementById('sectors').innerHTML;

            //NEW
            var win = window.open('');
            var printContents = `<!DOCTYPE html>
                                <html>
                                <head>
                                    <!-- Edited by Erwin -->
                                   
                                    <style> *, *:before, *:after { - webkit - box - sizing: border - box; -moz - box - sizing: border - box; box - sizing: border - box; } #content-main { height: 11in; margin: 0; margin-top:1.5in; padding: 0; } .table td, .table th {padding: 3px; border-top: 1px solid #FFF; } .xfooter {width: 970px; position: absolute; height:4.5in; bottom: 0;  }</style>
                                    <style>

                                        .sortTable1 td {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        font-size: small;
                                        font-family: sans-serif;
                                        }
                                        .table th, .table td {
                                        padding: 3px;
                                        line-height: 20px;
                                        text-align: left;
                                        vertical-align: top;
                                        border-top: 1px solid #a1a1a1;
                                        border-left: 1px solid #ffffff;
                                        font-size: smaller;
                                        border-collapse:collapse;

                                        }
                                    </style>

                                    <title>EMPLOYEE RATE MASTER LIST</title>
                                </head><body>
                                `;
            printContents += '<div style="text-align: left; font-weight: 700; width:100%; font-size: 12px;font-family: sans-serif;">MFT INTERNATIONAL CORP</div>';
            printContents += '<div style="text-align: left; font-weight: 700; font-size: x-small; width:100%;font-family: sans-serif;">EMPLOYEE RATE MASTER LIST</div>';
            printContents += '<div style="text-align: left; font-weight: 700; width:100%; font-size: 12px;font-family: sans-serif;">RUNDATE :' + $rundate + '</div>';
            //printContents += '<div style="text-align: center; font-weight: 700;">10/26/2023 - 11/10/2023</div>';

            printContents += divToPrint.outerHTML;

            printContents += `</body></html>`;

            win.document.write(printContents);
        }

    });
})(jQuery);