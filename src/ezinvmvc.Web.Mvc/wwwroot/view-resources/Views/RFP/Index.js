
$(".date-picker").datepicker("update", new Date());
var $month = (new Date().getMonth() + 1);
var mdayone = "01/01/" + new Date().getFullYear();
$("#DateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
(function () {
    $(function () {

        var _$table = $('#RFPTable');
        var _$table2 = $('#RFPTable2');
        var _service = abp.services.app.rFPService
        var _employeeService = abp.services.app.employeeService;

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getAllRFP,
                inputFilter: function () {
                    //var $s = $('#SearchFilter').val();
                    //return {
                    //    filter: $s
                    //};
                    var $id = $('#SearchFilter').val();
                    var $code = '  ';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    //var $statusid = $('#StatusTypes').val();
                    var $statusid = "null";
                    var $clientid = '  ';
                    var $accountexecutive = 'null';
                    //if (!abp.auth.isGranted("Pages.Rfq.AllAccounts")) {
                    //    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    //    console.log(empid);
                    //    $accountexecutive = empid;
                    //}
                    //else {
                    //    console.log($accountexecutive);
                    //}
                    return {
                        //filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid + '|' + $accountexecutive
                        filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto
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
                    orderData: 11,
                    targets: 1,
                    data: { id: "id", code: "code" },
                    "render": function (data) {
                        return '<a id="view-rfp" title="view" href="#" class="view-rfp" data-rfp-id="' + data.id + '" data-rfp-code="' + data.code + '">' + data.code + '</i></a>';
                    }
                }
                ,
                {
                    visible: false,
                    orderData: 12,
                    targets: 2,
                    data: "requestCode"
                }
                ,
                {
                    targets: 3,
                    data: "transactionTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 4,
                    data: "client"
                },
                {
                    orderable: false,
                    targets: 5,
                    data: "notes"
                },
                {
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: 6,
                    data: "grandTotal"
                },
                {
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { status: "status", statusid: "statusId" },
                    "render": function (data) {
                        if (data.statusId === 1) {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 2) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 3) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else if (data.statusId === 4) {
                            return '<span class="badge badge-primary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-info">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                },
                {
                    orderable: false,
                    targets: 8,
                    class: "text-center",
                    data: { id: "id" },
                    "render": function (data) {
                        //return '<a id="edit-rfp" title="edit" href="#" class="edit-rfp" data-rfp-id="' + data.id + '" data-rfp-code="' + data.code + '"  data-rfp-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-rfp" title="delete" href="#" class="delete-rfp" data-rfp-id="' + data.id + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-rfp" title="edit" href="#" class="edit-rfp" data-rfp-id="' + data.id + '" data-rfp-code="' + data.code + '"  data-rfp-status="' + data.status + '" data-toggle="modal" data-target="#ClientEditModal"  ><i class="fa fa-pencil-square-o"></i></a>';
                        //var del = '<a id="delete-rfp" title="delete" href="#" class="delete-rfp" data-rfp-id="' + data.id + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Rfp.Edit")) {
                            ret += edit;
                        }
                        //if (abp.auth.isGranted("Master.Products.Delete")) {
                        //    ret += (ret.trim().length > 0 ? '|' + del : del);
                        //}
                        return ret;
                    }
                },
                {
                    visible: false,
                    targets: 9,
                    data: "code"
                },
                {
                    visible: false,
                    targets: 10,
                    data: "statusId"
                }
                ,
                {
                    visible: false,
                    targets: 11,
                    data: "code"
                }
                ,
                {
                    visible: false,
                    targets: 12,
                    data: "requestCode"
                }
                
            ]
        });

        var dataTable2 = _$table2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getAllRFP,
                inputFilter: function () {
                    //var $s = $('#SearchFilter').val();
                    //return {
                    //    filter: $s
                    //};
                    var $id = $('#SearchFilter').val();
                    var $code = '  ';
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    //var $statusid = $('#StatusTypes').val();
                    var $statusid = "null";
                    var $clientid = '  ';
                    var $accountexecutive = 'null';
                    //if (!abp.auth.isGranted("Pages.Rfq.AllAccounts")) {
                    //    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    //    console.log(empid);
                    //    $accountexecutive = empid;
                    //}
                    //else {
                    //    console.log($accountexecutive);
                    //}
                    return {
                        //filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto + '|' + $statusid + '|' + $clientid + '|' + $accountexecutive
                        filter: $id + '|' + $code + '|' + $datefrom + '|' + $dateto,
                        forExport: true
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
                    targets: 1,
                    data: { id: "id", code: "code" },
                    "render": function (data) {
                        return '<a id="view-rfp" title="view" href="#" class="view-rfp" data-rfp-id="' + data.id + '" data-rfp-code="' + data.code + '">' + data.code + '</i></a>';
                    }
                }
                ,
                {
                    visible: false,
                    targets: 2,
                    data: "requestCode"
                }
                ,
                {
                    targets: 3,
                    data: "transactionTime",
                    render: function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 4,
                    data: "client"
                },
                {
                    orderable: false,
                    targets: 5,
                    data: "notes"
                },
                {
                    orderable: false,
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    targets: 6,
                    data: "grandTotal"
                },
                {
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { status: "status", statusid: "statusId" },
                    "render": function (data) {
                        if (data.statusId === 1) {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 2) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 3) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else if (data.statusId === 4) {
                            return '<span class="badge badge-primary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-info">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                }

            ]
        });


        // View record
        //_$table.on('click', 'a.view-rfq', function (e) {
        //    e.preventDefault();
        //    var clientId = $(this).attr("data-rfq-id");
        //    window.location.href = abp.appPath + 'RFQ/Details?id=' + clientId;
        //});


        //_$table.on('click', 'a.edit-rfq', function (e) {
        //    e.preventDefault();
        //    var rfqid = $(this).attr("data-rfq-id");
        //    var rfqstatus = $(this).attr("data-rfq-status");
        //    abp.message.confirm(
        //        abp.utils.formatString(abp.localization.localize('EditRFQConfirmation', 'ezinvmvc'), name),
        //        function (isConfirmed) {
        //            if (isConfirmed) {
        //                if (rfqstatus === "Approved") {
        //                    abp.message.error('Status has been approved!', 'Failed');
        //                    return;
        //                }
        //                else {
        //                    window.location.href = abp.appPath + 'RFQ/Edit?id=' + rfqid;
        //                }

        //            }
        //        }
        //    );
        //});

        //_$table.on('click', 'a.approve-rfq', function (e) {
        //    e.preventDefault();
        //    var rfqid = $(this).attr("data-rfq-id");
        //    getrfq(rfqid);
        //    abp.message.confirm(
        //        abp.utils.formatString(abp.localization.localize('ApproveRFQConfirmation', 'ezinvmvc'), name),
        //        function (isConfirmed) {
        //            if (isConfirmed) {
        //                //_service.deleteRfqInput({
        //                //    id: id
        //                //    getrfq(id);
        //                //}).done(function () {
        //                //    getAll();
        //                //});
        //                approvedRfq();
        //            }
        //        }
        //    );

        //});

        //$('#RfqTable').on('click', 'a.delete-rfq', function (e) {
        //    var id = $(this).attr("data-rfq-id");
        //    var name = $(this).attr("data-rfq-projectname");

        //    e.preventDefault();
        //    abp.message.confirm(
        //        abp.utils.formatString(abp.localization.localize('DeleteRFQConfirmation', 'ezinvmvc'), name),
        //        function (isConfirmed) {
        //            if (isConfirmed) {
        //                _service.deleteRfqInput({
        //                    id: id
        //                }).done(function () {
        //                    getAll();
        //                });
        //            }
        //        }
        //    );
        //});

        //$('#btnassign').click(function (e) {
        //    e.preventDefault();
        //    assign();


        //});


        function getAll() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getAll();

        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getAll();
        });

        //Edit Record
        _$table.on('click', 'a.edit-rfp', function (e) {
            e.preventDefault();
            var Id = $(this).attr("data-rfp-id");
            var Code = $(this).attr("data-rfp-code");
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Edit Request For Payment. ' + Code, 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        window.location.href = abp.appPath + 'RFP/Edit?id=' + Id;
                    }
                }
            );
        });

        $('#SearchFilter').focus();

        // View record
        _$table.on('click', 'a.view-rfp', function (e) {
            e.preventDefault();
            var Id = $(this).attr("data-rfp-id");
            window.location.href = abp.appPath + 'RFP/Details?id=' + Id;
        });

        //Edit Record
        _$table.on('click', 'a.edit-journal', function (e) {
            e.preventDefault();
            var Id = $(this).attr("data-journal-id");
            var Code = $(this).attr("data-journal-code");
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('Edit Journal Entry. ' + Code, 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        window.location.href = abp.appPath + 'JournalEntry/Edit?id=' + Id;
                    }
                }
            );
        });

        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('RFPTable2', 'Request For Payment', 'RequestForPayment.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) {
                    return window.btoa(decodeURIComponent(encodeURIComponent(s.replace(/[\u00A0-\u2666]/g, function (c) {
                        return '&#' + c.charCodeAt(0) + ';';
                    }).replace(/[\u{0080}-\u{FFFF}]/gu, ""))))
                }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

        //Delete record

        //_$table.on('click', 'a.delete-journal', function (e) {
        //    e.preventDefault();
        //    var Id = $(this).attr("data-journal-id");
        //    abp.message.confirm(
        //        abp.utils.formatString(abp.localization.localize('Edit Journal Entry', 'ezinvmvc'), name),
        //        function (isConfirmed) {
        //            _service.deleteRfqInput({
        //                id: id
        //            }).done(function () {
        //                getAll();
        //            });
        //        }
        //    );
        //});

    });
})();
