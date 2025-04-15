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
        var _bioAttendanceService = abp.services.app.bioAtt2Service;
        var _employeeLoansService = abp.services.app.employeeLoansService;
        var _$AttendanceTable = $('#AttendanceTable');
        var _$AttadjTable = $('#AttadjTable');
        var _$PgbTable = $('#PgbTable');
        var _$OthTable = $('#OthTable');
        var _$hiddenform = $('form[name=hiddenform]');

        $(document).ready(function () {

            $('#dept').val();
            $('#attid').val();
        });

        var dataTable = _$AttadjTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _employeeLoansService.getEmpLoanSSSList,
                inputFilter: function () {
                    var $a = $('#id').val();
                    var $b = '1';

                    return {
                        filter: $a + '|' + $b
                    };
                }
            },
            columnDefs: [

                {
                    className: 'control responsive',

                    visible: true,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    orderable: false,
                    visible: false,
                    targets: 1,
                    data: "empId"
                },

                {
                    orderable: false,
                    visible: true,
                    targets: 2,
                    data: { loanTitleName: "loanTitleName", loanTypeName: "loanTypeName" },
                    "render": function (data) {
                        var $loanTitleName = data.loanTitleName;
                        var $loanTypeName = data.loanTypeName;
                        return $loanTitleName + "/" + $loanTypeName;
                    },
                    class: "text-nowrap"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "applicationNo"
                },
                {
                    orderable: false,
                    visible: false ,
                    targets: 4,
                    data: "fullName"
                },
                {
                    visible: true,
                    orderable: false,
                    targets: 5,
                    data: "loanAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    orderable: false,
                    targets: 6,
                    data: "dateStart",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    targets: 7,
                    data: "dateEnd",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    visible: true,
                    targets: 8,
                    data: "monthlyAmortization",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {visible: false,
                    orderable: false,
                    targets: 9,
                    data: "dateReceived",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    targets: 10,
                    class: "text-center",
                    data: { id: "id", loanAmount: "loanAmount", dateStart: "dateStart", dateEnd: "dateEnd", monthlyAmortization: "monthlyAmortization", dateReceived: "dateReceived" },
                    "render": function (data) {
                        return '<a id="select-EmployeeLoan" title="Print Loan Certificate" href="#" class="select-EmployeeLoan" data-EmployeeLoan-id="' + data.id + '" data-EmployeeLoan-loanamount="' + data.loanAmount + '" data-EmployeeLoan-dateStart="' + data.dateStart + '"data-EmployeeLoan-dateEnd="' + data.dateEnd + '" data-EmployeeLoan-monthlyAmortization="' + data.monthlyAmortization + '" data-EmployeeLoan-dateReceived="' + data.dateReceived + '"><i class="fa fa-lg fa-print"></i></a>';
                    }
                }
            ]
            ,
            footerCallback: function (row, data, start, end, display) {
                let api = this.api();
                //Remove the formatting to get integer data for summation
                let intVal = function (i) {
                    return typeof i === 'string'
                        ? i.replace(/[\$,]/g, '') * 1
                        : typeof i === 'number'
                            ? i
                            : 0;
                };
                // Total over all pages               
                total = api.column(8).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(8, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(8).footer().innerHTML = currencyFormat(total);
            }
        });

        $('#AttadjTable').on('click', 'a.select-EmployeeLoan', function (e) {
            e.preventDefault();
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            var EmployeeLoanId = $(this).attr("data-EmployeeLoan-id");
            var loanAmount = $(this).attr("data-EmployeeLoan-loanAmount");
            const actualNumber = +loanAmount.replace(/,/g, '')
            const LOAN = actualNumber.toLocaleString('en-US', { maximumFractionDigits: 2 })

            var start = $(this).attr("data-EmployeeLoan-dateStart");
            //var dS = new Date(start);
            //var $datestart = (dS.getMonth() + 1) + "/" + dS.getDate() + "/" + dS.getFullYear();
            var dS = new Date(start);
            var $datestart = dS.toLocaleDateString('en-US', options);

            var End = $(this).attr("data-EmployeeLoan-dateEnd");
            var dE = new Date(End);
            //var $dateEnd = (dE.getMonth() + 1) + "/" + dE.getDate() + "/" + dE.getFullYear();
            var $dateEnd = dE.toLocaleDateString('en-US', options);

            var $monthlypayment = $(this).attr("data-EmployeeLoan-monthlyAmortization");
            const actualpayment = +$monthlypayment.replace(/,/g, '')
            const $monthlyAmortization = actualpayment.toLocaleString('en-US', { maximumFractionDigits: 2 })


            var $paid = $(this).attr("data-EmployeeLoan-dateReceived");
            var dP = new Date($paid);
            //var $datepaid = (dP.getMonth() + 1) + "/" + dP.getDate() + "/" + dP.getFullYear();
            var $datepaid = dP.toLocaleDateString('en-US', options);
            //const d = new Date(dP);
            var $monthpaid = dP.toLocaleString('en-US', { month: 'long' });

            var $SSS = $('#SSS').val();
            var $PHLT = $('#PHLT').val();
            var $PGB = $('#PGB').val();
            var $TIN = $('#TIN').val();
            var $DateH = $('#DateR').val();
            var dH = new Date($DateH);
            var $DateR = dH.toLocaleDateString('en-US', options);

            var $FName = $('#FName').val();
            var d = new Date(Date.now());
            var $datenow = d.toLocaleDateString('en-US', options);

            var win = window.open('');
            var printContents = ` <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        
                        body {
                            overflow: visible;
                            font-size: medium;
                            page-break-after: always;
                            margin-top: 20px;
                            font-family:sans-serif;
                            }   
                        }      
                    </style>`;
            //printContents += '<link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" />';
            printContents += '</head><body>';
            printContents += '<div class="page-header">';
            printContents += $datenow;
            printContents += '</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding-top:50px;text-align:center;font-size: xx-large;">Certificate of SSS Loan Payment</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 50px 150px 50px 150px;text-align:left;">To Whom it May Concern:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;">This is to certify that MFT INTERNATIONAL CORP with SSS# has remitted the following monthly payment to our employee:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;">' + $FName + ' with sss# ' + $SSS + '</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;"> ';
            printContents += '<table style="width:100%;">';
            printContents += '<thead><tr><th style="width:25%; text-align: center;">Total Loan Amount</th><th style="width:25%;text-align: center;">Start Date</th><th style="width:25%;text-align: center;">End Date</th><th style="width:25%;text-align: center;">Amortization</th></tr></thead > ';
            printContents += '<tbody><tr><td style="text-align: center;">' + LOAN + '</td><td style="text-align: center;">' + $datestart + '</td><td style="text-align: center;">' + $dateEnd + '</td><td style="text-align: center;">' + $monthlyAmortization + '</td></tr></tbody> ';
            printContents += '</table > ';
            printContents += '</div > ';

            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;"> ';
            printContents += '<table style="width:100%;">';
            printContents += '<thead><tr><th style="width:25%; text-align: center;"">Month</th><th style="width:25%; text-align: center;"">Amount Paid</th><th style="width:25%; text-align: center;"">Receipt No.</th><th style="width:25%; text-align: center;"">Date Paid</th></tr></thead > ';
            printContents += '<tbody><tr><td style="text-align: center;">' + $monthpaid + '</td><td style="text-align: center;">' + $monthlyAmortization + '</td><td style="text-align: center;"></td><td style="text-align: center;">' + $datepaid + '</td></tr></tbody> ';
            printContents += '</table > ';
            printContents += '</div > ';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 50px 150px 300px 150px;text-align:left;">Furthermore, Mr.\\ Ms. \\Mrs. ' + $FName + ' is employed in this company since ' + $DateR + ' up to present.</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;">Certified true & Correct</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 0px 150px;text-align:left;">Prepaired By:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 0px 150px;text-align:left;">Anna Liza Tubice</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 300px 150px;text-align:left;">HR Admin Supervisor</div>';
            printContents += '<div class="page-footer" style="text-align: end;">Not valid w/o company seal</div>';
            printContents += '</body></html>';


            win.document.write(printContents);

        });

        function GetAttendanceTable() {
            dataTable.ajax.reload();
        }

        $('#GetEmployeeButton').click(function (e) {
            GetTable();
        });

        var dataTable2 = _$AttendanceTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": true,
            listAction: {
                ajaxFunction: _employeeLoansService.getEmpLoanListCert,
                inputFilter: function () {
                    
                    var $a = 'null';
                    var $b = 'null';
                    var $c = 'null';
                    if ($('#SearchBy').val() == "CompleteName") {
                        $b = $('#EmployeeTableFilter').val();
                    }
                    else if ($('#SearchBy').val() == "Department") {
                        $c = $('#EmployeeTableFilter').val();
                    }
                    else if ($('#SearchBy').val() == "Company") {
                        $a = $('#EmployeeTableFilter').val();
                    }
                    return {
                        filter: $a + '|' + $b + '|' + $c 
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
                    visible: true,
                    orderable: false,
                    targets: 1,
                    data: "empId"
                },
                {
                    orderable: true,
                    targets: 2,
                    data: "name"
                },
                {
                    orderable: true,
                    targets: 3,
                    data: "tin"
                },
                {
                    orderable: true,
                    targets: 4,
                    data: "fullName"
                },
                {
                    orderable: true,
                    targets: 5,
                    data: { firstName: "firstName"},
                    "render": function (data) {
                        var $firstName = data.firstName;
                        return $firstName.toUpperCase();
                    },
                    orderData: 7
                },
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { empId: "empId", name: "name", firstName: "firstName", fullName: "fullName", tin: "tin", sssphilhealthNo: "sssphilhealthNo", middleName: "middleName", lastName: "lastName", tinNo: "tinNo", dateReceived: "dateReceived"},
                    "render": function (data) {
                        return '<a id="view-attendanceId" title="View Data" class="view-attendanceId btn btn-outline-primary btn-sm" data-attendanceId-id="' + data.empId + '" data-attendanceId-name="' + data.name + '" data-attendanceId-firstName="' + data.firstName + '"data-attendanceId-fullName="' + data.fullName + '" data-attendanceId-tin="' + data.tin + '" data-attendanceId-sssphilhealthNo="' + data.sssphilhealthNo + '" data-attendanceId-middleName="' + data.middleName + '" data-attendanceId-lastName="' + data.lastName + '" data-attendanceId-tinNo="' + data.tinNo + '" data-attendanceId-dateReceived="' + data.dateReceived + '" data-dismiss="modal"><i class="fa fa-md fa-search"></i></a> ';
                    }
                },
                {
                    visible: false,
                    targets: 7,
                    data: "sssphilhealthNo"
                },
                {
                    visible: false,
                    targets: 8,
                    data: "middleName"
                },
                {
                    visible: false,
                    targets: 9,
                    data: "lastName"
                },
                {
                    visible: false,
                    targets: 10,
                    data: "tinNo"
                },
                {
                    visible: false,
                    targets: 11,
                    data: "dateReceived",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },

            ],
        });

        function GetTable() {
            dataTable2.ajax.reload();
        }
        
        $('#AttendanceTable').on('click', 'a.view-attendanceId', function (e) {
            e.preventDefault();
            $('#id').val("");
            $('#comp').val("");
            $('#dept').val("");
            $('#Name').val("");
            var $Id = $(this).attr("data-attendanceId-id");
            var $company = $(this).attr("data-attendanceId-name");
            var $firstName = $(this).attr("data-attendanceId-firstName");
            var $fullName = $(this).attr("data-attendanceId-fullName");
            var $tin = $(this).attr("data-attendanceId-tin");
            var $sssphilhealthNo = $(this).attr("data-attendanceId-sssphilhealthNo");
            var $middleName = $(this).attr("data-attendanceId-middleName");
            var $lastName = $(this).attr("data-attendanceId-lastName");
            var $tinNo = $(this).attr("data-attendanceId-tinNo");
            var $dateReceived = $(this).attr("data-attendanceId-dateReceived");

            $('#id').val($Id);
            $('#SSS').val($sssphilhealthNo);
            $('#PHLT').val($middleName);
            $('#PGB').val($lastName);
            $('#TIN').val($tinNo);
            $('#DateR').val($dateReceived);
            $('#FName').val($fullName);
            $('#Name').html($tin+" - "+ $fullName.toUpperCase() + " / " + $firstName);
            //GetAttendanceTable();
            GetSSSTotalAmount($Id, 1);
        });

        function GetSSSTotalAmount(Id, LoanTitle) {
            //var $id = $('#EmpId').val();
            $('#totalsssamount').html("");

            _employeeLoansService.getEmpLoanSSS({ filter: Id + '|' + LoanTitle }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $LoanAmount = result.items[i].loanAmount;
                    $('#totalsssamount').html(currencyFormat($LoanAmount));
                }
            });
            GetPgbTotalAmount($('#id').val(), 2);
        }

        $('#AttendanceTable').on('click', 'a.view-attendanceId', function (e) {
            e.preventDefault();
            $('#attid').val("");
            $('#dept').val("");
            $('#Cutoff').html("");
            $('#coveredDate').html("");
            var Id = $(this).attr("data-attendanceId-id");
            var company = $(this).attr("data-attendanceId-companyName");
            var endDate = $(this).attr("data-attendanceId-endDate");
            var dateT = $(this).attr("data-attendanceId-dateT");

            var $endDate = new Date(endDate);
            var Tenddate = getFormattedDate($endDate);

            var $dateT = new Date(dateT);
            var SDate = getFormattedDate($dateT);

            var today = new Date(SDate);
            var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var month = today.getMonth();
            var monthName = monthNames[month];
            $('#attid').val(Id);
            $('#dept').val(company);

            $('#coveredDate').html("Covered&nbsp;Date&nbsp;:&nbsp;[&nbsp;" + SDate + " - " + Tenddate + "&nbsp;]");
            //$('#Company').html("MFT&nbsp;INTERNATIONAL&nbsp;CORP&nbsp;-&nbsp;(" + company.toUpperCase() + ")");
            GetAttendanceTable();

            //_bioAttendanceService.getById({ attendanceId: Id }).done(function (result) {
            //    var cutc = result.enTitlement;
            //    if (cutc == "1") {
            //        $('#Cutoff').html("First Half of&nbsp;" + monthName + "&nbsp;" + today.getFullYear());
            //    }
            //    if (cutc == "2") {
            //        $('#Cutoff').html("Second Half of&nbsp;" + monthName + "&nbsp;" + today.getFullYear());
            //    }
            //})
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('AttadjTable', 'AttadjTable', 'LoanSummaryReport.xls');
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

        function GetPgbTotalAmount(Id, LoanTitle) {
            //var $id = $('#EmpId').val();
            $('#totalpgbamount').html("");

            _employeeLoansService.getEmpLoanPgb({ filter: Id + '|' + LoanTitle }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $LoanAmount = result.items[i].loanAmount;
                    $('#totalpgbamount').html(currencyFormat($LoanAmount));
                }
            });
            GetpgbAttendanceTable();
            GetOthTotalAmount($('#id').val(), 3);

        }

        var pgbdataTable = _$PgbTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _employeeLoansService.getEmpLoanPgbList,
                inputFilter: function () {
                    var $a = $('#id').val();
                    var $b = '2';

                    return {
                        filter: $a + '|' + $b
                    };
                }
            },
            columnDefs: [

                {
                    className: 'control responsive',

                    visible: true,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    orderable: false,
                    visible: false,
                    targets: 1,
                    data: "empId"
                },

                {
                    orderable: false,
                    visible: true,
                    targets: 2,
                    data: { loanTitleName: "loanTitleName", loanTypeName: "loanTypeName" },
                    "render": function (data) {
                        var $loanTitleName = data.loanTitleName;
                        var $loanTypeName = data.loanTypeName;
                        return $loanTitleName + "/" + $loanTypeName;
                    },
                    class: "text-nowrap"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "applicationNo"
                },
                {
                    orderable: false,
                    visible: false,
                    targets: 4,
                    data: "fullName"
                },
                {
                    visible: true,
                    orderable: false,
                    targets: 5,
                    data: "loanAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    orderable: false,
                    targets: 6,
                    data: "dateStart",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    targets: 7,
                    data: "dateEnd",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    visible: true,
                    targets: 8,
                    data: "monthlyAmortization",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    visible: false,
                    orderable: false,
                    targets: 9,
                    data: "dateReceived",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    targets: 10,
                    class: "text-center",
                    data: { id: "id", loanAmount: "loanAmount", dateStart: "dateStart", dateEnd: "dateEnd", monthlyAmortization: "monthlyAmortization", dateReceived: "dateReceived" },
                    "render": function (data) {
                        return '<a id="select-PgbEmployeeLoan" title="Print Loan Certificate" href="#" class="select-PgbEmployeeLoan" data-PgbEmployeeLoan-id="' + data.id + '" data-PgbEmployeeLoan-loanamount="' + data.loanAmount + '" data-PgbEmployeeLoan-dateStart="' + data.dateStart + '"data-PgbEmployeeLoan-dateEnd="' + data.dateEnd + '" data-PgbEmployeeLoan-monthlyAmortization="' + data.monthlyAmortization + '" data-PgbEmployeeLoan-dateReceived="' + data.dateReceived + '"><i class="fa fa-lg fa-print"></i></a>';
                    }
                }
            ]
            ,
            footerCallback: function (row, data, start, end, display) {
                let api = this.api();
                //Remove the formatting to get integer data for summation
                let intVal = function (i) {
                    return typeof i === 'string'
                        ? i.replace(/[\$,]/g, '') * 1
                        : typeof i === 'number'
                            ? i
                            : 0;
                };
                // Total over all pages               
                total = api.column(8).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(8, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(8).footer().innerHTML = currencyFormat(total);
            }
        });

        $('#PgbTable').on('click', 'a.select-PgbEmployeeLoan', function (e) {
            e.preventDefault();
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            var EmployeeLoanId = $(this).attr("data-PgbEmployeeLoan-id");
            var loanAmount = $(this).attr("data-PgbEmployeeLoan-loanAmount");
            const actualNumber = +loanAmount.replace(/,/g, '')
            const LOAN = actualNumber.toLocaleString('en-US', { maximumFractionDigits: 2 })

            var start = $(this).attr("data-PgbEmployeeLoan-dateStart");
            //var dS = new Date(start);
            //var $datestart = (dS.getMonth() + 1) + "/" + dS.getDate() + "/" + dS.getFullYear();
            var dS = new Date(start);
            var $datestart = dS.toLocaleDateString('en-US', options);

            var End = $(this).attr("data-PgbEmployeeLoan-dateEnd");
            var dE = new Date(End);
            //var $dateEnd = (dE.getMonth() + 1) + "/" + dE.getDate() + "/" + dE.getFullYear();
            var $dateEnd = dE.toLocaleDateString('en-US', options);

            var $monthlypayment = $(this).attr("data-PgbEmployeeLoan-monthlyAmortization");
            const actualpayment = +$monthlypayment.replace(/,/g, '')
            const $monthlyAmortization = actualpayment.toLocaleString('en-US', { maximumFractionDigits: 2 })


            var $paid = $(this).attr("data-PgbEmployeeLoan-dateReceived");
            var dP = new Date($paid);
            //var $datepaid = (dP.getMonth() + 1) + "/" + dP.getDate() + "/" + dP.getFullYear();
            var $datepaid = dP.toLocaleDateString('en-US', options);
            //const d = new Date(dP);
            var $monthpaid = dP.toLocaleString('en-US', { month: 'long' });

            var $SSS = $('#SSS').val();
            var $PHLT = $('#PHLT').val();
            var $PGB = $('#PGB').val();
            var $TIN = $('#TIN').val();
            var $DateH = $('#DateR').val();
            var dH = new Date($DateH);
            var $DateR = dH.toLocaleDateString('en-US', options);

            var $FName = $('#FName').val();
            var d = new Date(Date.now());
            var $datenow = d.toLocaleDateString('en-US', options);

            var win = window.open('');
            var printContents = ` <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        
                        body {
                            overflow: visible;
                            font-size: medium;
                            page-break-after: always;
                            margin-top: 20px;
                            font-family:sans-serif;
                            }   
                        }      
                    </style>`;
            //printContents += '<link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" />';
            printContents += '</head><body>';
            printContents += '<div class="page-header">';
            printContents += $datenow;
            printContents += '</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding-top:50px;text-align:center;font-size: xx-large;">Certificate of Pag-Ibig Loan Payment</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 50px 150px 50px 150px;text-align:left;">To Whom it May Concern:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;">This is to certify that MFT INTERNATIONAL CORP with Pag-Ibig No. has remitted the following monthly payment to our employee:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;">' + $FName + ' with Pag-Ibig no. ' + $PGB + '</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;"> ';
            printContents += '<table style="width:100%;">';
            printContents += '<thead><tr><th style="width:25%; text-align: center;">Total Loan Amount</th><th style="width:25%;text-align: center;">Start Date</th><th style="width:25%;text-align: center;">End Date</th><th style="width:25%;text-align: center;">Amortization</th></tr></thead > ';
            printContents += '<tbody><tr><td style="text-align: center;">' + LOAN + '</td><td style="text-align: center;">' + $datestart + '</td><td style="text-align: center;">' + $dateEnd + '</td><td style="text-align: center;">' + $monthlyAmortization + '</td></tr></tbody> ';
            printContents += '</table > ';
            printContents += '</div > ';

            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;"> ';
            printContents += '<table style="width:100%;">';
            printContents += '<thead><tr><th style="width:25%; text-align: center;"">Month</th><th style="width:25%; text-align: center;"">Amount Paid</th><th style="width:25%; text-align: center;"">Receipt No.</th><th style="width:25%; text-align: center;"">Date Paid</th></tr></thead > ';
            printContents += '<tbody><tr><td style="text-align: center;">' + $monthpaid + '</td><td style="text-align: center;">' + $monthlyAmortization + '</td><td style="text-align: center;"></td><td style="text-align: center;">' + $datepaid + '</td></tr></tbody> ';
            printContents += '</table > ';
            printContents += '</div > ';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 50px 150px 300px 150px;text-align:left;">Furthermore, Mr.\\ Ms. \\Mrs. ' + $FName + ' is employed in this company since ' + $DateR + ' up to present.</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;">Certified true & Correct</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 0px 150px;text-align:left;">Prepaired By:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 0px 150px;text-align:left;">Anna Liza Tubice</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 300px 150px;text-align:left;">HR Admin Supervisor</div>';
            printContents += '<div class="page-footer" style="text-align: end;">Not valid w/o company seal</div>';
            printContents += '</body></html>';


            win.document.write(printContents);

        });


        function GetpgbAttendanceTable() {
            pgbdataTable.ajax.reload();
        }

        function GetOthTotalAmount(Id, LoanTitle) {
            //var $id = $('#EmpId').val();
            $('#totalothamount').html("");

            _employeeLoansService.getEmpLoanOth({ filter: Id + '|' + LoanTitle }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $LoanAmount = result.items[i].loanAmount;
                    $('#totalothamount').html(currencyFormat($LoanAmount));
                }
            });
            GetothAttendanceTable();
        }

        var othdataTable = _$OthTable.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _employeeLoansService.getEmpLoanOthList,
                inputFilter: function () {
                    var $a = $('#id').val();
                    var $b = '3';

                    return {
                        filter: $a + '|' + $b
                    };
                }
            },
            columnDefs: [

                {
                    className: 'control responsive',

                    visible: true,
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    orderable: false,
                    visible: false,
                    targets: 1,
                    data: "empId"
                },

                {
                    orderable: false,
                    visible: true,
                    targets: 2,
                    data: { loanTitleName: "loanTitleName", loanTypeName: "loanTypeName" },
                    "render": function (data) {
                        var $loanTitleName = data.loanTitleName;
                        var $loanTypeName = data.loanTypeName;
                        return $loanTitleName + "/" + $loanTypeName;
                    },
                    class: "text-nowrap"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "applicationNo"
                },
                {
                    orderable: false,
                    visible: false,
                    targets: 4,
                    data: "fullName"
                },
                {
                    visible: true,
                    orderable: false,
                    targets: 5,
                    data: "loanAmount",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    orderable: false,
                    targets: 6,
                    data: "dateStart",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    targets: 7,
                    data: "dateEnd",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    visible: true,
                    targets: 8,
                    data: "monthlyAmortization",
                    render: function (data) {
                        return currencyFormat(data);
                    }
                },
                {
                    visible: false,
                    orderable: false,
                    targets: 9,
                    data: "dateReceived",
                    "render": function (data) {
                        var dt = new Date(data);
                        return getFormattedDate(dt);
                    }
                },
                {
                    orderable: false,
                    targets: 10,
                    class: "text-center",
                    data: { id: "id", loanAmount: "loanAmount", dateStart: "dateStart", dateEnd: "dateEnd", monthlyAmortization: "monthlyAmortization", dateReceived: "dateReceived" },
                    "render": function (data) {
                        return '<a id="select-OthEmployeeLoan" title="Print Loan Certificate" href="#" class="select-OthEmployeeLoan" data-OthEmployeeLoan-id="' + data.id + '" data-OthEmployeeLoan-loanamount="' + data.loanAmount + '" data-OthEmployeeLoan-dateStart="' + data.dateStart + '"data-OthEmployeeLoan-dateEnd="' + data.dateEnd + '" data-OthEmployeeLoan-monthlyAmortization="' + data.monthlyAmortization + '" data-OthEmployeeLoan-dateReceived="' + data.dateReceived + '"><i class="fa fa-lg fa-print"></i></a>';
                    }
                }
            ]
            ,
            footerCallback: function (row, data, start, end, display) {
                let api = this.api();
                //Remove the formatting to get integer data for summation
                let intVal = function (i) {
                    return typeof i === 'string'
                        ? i.replace(/[\$,]/g, '') * 1
                        : typeof i === 'number'
                            ? i
                            : 0;
                };
                // Total over all pages               
                total = api.column(8).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                pageTotal = api.column(8, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
                api.column(8).footer().innerHTML = currencyFormat(total);
            }

        });

        $('#OthTable').on('click', 'a.select-OthEmployeeLoan', function (e) {
            e.preventDefault();
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            var EmployeeLoanId = $(this).attr("data-OthEmployeeLoan-id");
            var loanAmount = $(this).attr("data-OthEmployeeLoan-loanAmount");
            const actualNumber = +loanAmount.replace(/,/g, '')
            const LOAN = actualNumber.toLocaleString('en-US', { maximumFractionDigits: 2 })

            var start = $(this).attr("data-OthEmployeeLoan-dateStart");
            //var dS = new Date(start);
            //var $datestart = (dS.getMonth() + 1) + "/" + dS.getDate() + "/" + dS.getFullYear();
            var dS = new Date(start);
            var $datestart = dS.toLocaleDateString('en-US', options);

            var End = $(this).attr("data-OthEmployeeLoan-dateEnd");
            var dE = new Date(End);
            //var $dateEnd = (dE.getMonth() + 1) + "/" + dE.getDate() + "/" + dE.getFullYear();
            var $dateEnd = dE.toLocaleDateString('en-US', options);

            var $monthlypayment = $(this).attr("data-OthEmployeeLoan-monthlyAmortization");
            const actualpayment = +$monthlypayment.replace(/,/g, '')
            const $monthlyAmortization = actualpayment.toLocaleString('en-US', { maximumFractionDigits: 2 })


            var $paid = $(this).attr("data-OthEmployeeLoan-dateReceived");
            var dP = new Date($paid);
            //var $datepaid = (dP.getMonth() + 1) + "/" + dP.getDate() + "/" + dP.getFullYear();
            var $datepaid = dP.toLocaleDateString('en-US', options);
            //const d = new Date(dP);
            var $monthpaid = dP.toLocaleString('en-US', { month: 'long' });

            var $SSS = $('#SSS').val();
            var $PHLT = $('#PHLT').val();
            var $PGB = $('#PGB').val();
            var $TIN = $('#TIN').val();
            var $DateH = $('#DateR').val();
            var dH = new Date($DateH);
            var $DateR = dH.toLocaleDateString('en-US', options);

            var $FName = $('#FName').val();
            var d = new Date(Date.now());
            var $datenow = d.toLocaleDateString('en-US', options);

            var win = window.open('');
            var printContents = ` <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        
                        body {
                            overflow: visible;
                            font-size: medium;
                            page-break-after: always;
                            margin-top: 20px;
                            font-family:sans-serif;
                            }   
                        }      
                    </style>`;
            //printContents += '<link href="' + abp.appPath + 'fonts/fakereceipt/fakereceipt.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" /><link href="' + abp.appPath + 'css/invoice.css" type="text/css" rel="stylesheet" media="all" asp-append-version="true" />';
            printContents += '</head><body>';
            printContents += '<div class="page-header">';
            printContents += $datenow;
            printContents += '</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding-top:50px;text-align:center;font-size: xx-large;">Certificate of Company Loan Payment</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 50px 150px 50px 150px;text-align:left;">To Whom it May Concern:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;">This is to certify that MFT INTERNATIONAL CORP with TIN# has remitted the following monthly payment to our employee:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;">' + $FName + ' with TIN# ' + $TIN + '</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;"> ';
            printContents += '<table style="width:100%;">';
            printContents += '<thead><tr><th style="width:25%; text-align: center;">Total Loan Amount</th><th style="width:25%;text-align: center;">Start Date</th><th style="width:25%;text-align: center;">End Date</th><th style="width:25%;text-align: center;">Amortization</th></tr></thead > ';
            printContents += '<tbody><tr><td style="text-align: center;">' + LOAN + '</td><td style="text-align: center;">' + $datestart + '</td><td style="text-align: center;">' + $dateEnd + '</td><td style="text-align: center;">' + $monthlyAmortization + '</td></tr></tbody> ';
            printContents += '</table > ';
            printContents += '</div > ';

            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;font-weight:700;"> ';
            printContents += '<table style="width:100%;">';
            printContents += '<thead><tr><th style="width:25%; text-align: center;"">Month</th><th style="width:25%; text-align: center;"">Amount Paid</th><th style="width:25%; text-align: center;"">Receipt No.</th><th style="width:25%; text-align: center;"">Date Paid</th></tr></thead > ';
            printContents += '<tbody><tr><td style="text-align: center;">' + $monthpaid + '</td><td style="text-align: center;">' + $monthlyAmortization + '</td><td style="text-align: center;"></td><td style="text-align: center;">' + $datepaid + '</td></tr></tbody> ';
            printContents += '</table > ';
            printContents += '</div > ';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 50px 150px 300px 150px;text-align:left;">Furthermore, Mr.\\ Ms. \\Mrs. ' + $FName + ' is employed in this company since ' + $DateR + ' up to present.</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 50px 150px;text-align:left;">Certified true & Correct</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 0px 150px;text-align:left;">Prepaired By:</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 0px 150px;text-align:left;">Anna Liza Tubice</div>';
            printContents += '<div class="col-md-12 col-xl-12" style="padding: 0px 150px 300px 150px;text-align:left;">HR Admin Supervisor</div>';
            printContents += '<div class="page-footer" style="text-align: end;">Not valid w/o company seal</div>';
            printContents += '</body></html>';


            win.document.write(printContents);

        });


        function GetothAttendanceTable() {
            othdataTable.ajax.reload();
        }

    });
})(jQuery);