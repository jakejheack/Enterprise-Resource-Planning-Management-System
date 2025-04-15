$(".date-picker").datepicker("update", new Date());
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
var $month = (new Date().getMonth() + 1);
var mdayone = ($month.length > 1 ? $month : $month) + "/01/" + new Date().getFullYear();
$('#DateFrom').val(mdayone);
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});


$('select').selectpicker();

abp.ui.block();
$("#PartyEmployee").hide();
$("#PartyClient").show();
$("#PartyVendor").hide();

(function () {
    $(function () {

        var _companyService = abp.services.app.companyService;
        var _accountService = abp.services.app.accountService;
        var _vendorService = abp.services.app.vendorService;
        var _clientService = abp.services.app.clientService;
        var _employeeService = abp.services.app.employeeService;
        var _$Table = $('#ListTable');
        var _$Table2 = $('#ListTable2');

        abp.ui.unblock();

        function getcompanies() {
            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault === true) {
                        companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    }
                    else {
                        companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                companies.selectpicker('refresh');
            });
        }
        getcompanies();

        $('#Type').change(function (e) {
            $sel = $(this).children("option:selected").val();
            if ($sel === "105") {
                $("#PartyClient").show();
                $("#PartyEmployee").hide();
                $("#PartyVendor").hide();
            }
            else if ($sel=== "108") {
                $("#PartyEmployee").show();
                $("#PartyClient").hide();
                $("#PartyVendor").hide();
            }
            else {
                $("#PartyVendor").show();
                $("#PartyClient").hide();
                $("#PartyEmployee").hide();
            }
        });

        //Account Autocomplete
        var getAccounts = function (request, response) {
            _accountService.getAccountByName({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccount() {
            var $accountid = $('#AccountId').val();
            _accountService.getAccount({ id: $accountid }).done(function (result) {
            });
        };
        var selectAccount = function (event, ui) {
            event.preventDefault();
            $("#AccountId").val(ui.item ? ui.item.value : "");
            $("#Account").val(ui.item ? ui.item.label : "");

            getAccount();
            return false;
        };
        var focusAccount = function (event, ui) {
            event.preventDefault();
            $("#AccountId").val(ui.item.value);
            $("#Account").val(ui.item.label);
        };
        var changeAccount = function (event, ui) {
            event.preventDefault();
            $("#AccountId").val(ui.item ? ui.item.value : "");
            $("#Account").val(ui.item ? ui.item.label : "");
        };
        $("#Account").autocomplete({
            source: getAccounts,
            select: selectAccount,
            focus: focusAccount,
            minLength: 2,
            delay: 100,
            change: changeAccount
        });
        //Account Autocomplete

        //Party Client Autocomplete
        var getclients1 = function (request, response) {
            _clientService.getClients({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getclient1() {
            var $partyId = $('#PartyId').val();
            _clientService.getClientDetails({ id: $partyId }).done(function (result) {
                $('#PartyCode').val(result[0].code);
            });
        };
        var selectclient1 = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item ? ui.item.value : "");
            $("#PartyClient").val(ui.item ? ui.item.label : "");
            getclient1();
            return false;
        };
        var focusclient1 = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item.value);
            $("#PartyClient").val(ui.item.label);
        };
        var changeclient1 = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item ? ui.item.value : "");
            $("#PartyClient").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#PartyClient').val('');
            }
        };
        $("#PartyClient").autocomplete({
            source: getclients1,
            select: selectclient1,
            focus: focusclient1,
            minLength: 2,
            delay: 100,
            change: changeclient1
        });
        //Party Client Autocomplete

        //Party Employee Autocomplete
        var getemployees = function (request, response) {
            _employeeService.getAllSalescordinator({ filter: "CompleteName|" + request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.completeName,
                        value: el.id
                    };
                }));
            });
        };
        function getemployee() {
            $id = $("#PartyId").val();
            _employeeService.getEmployee({ id: $id }).done(function (result) {
                $('#PartyCode').val(result.employeeCode);
            });
        };
        var selectemployee = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item ? ui.item.value : "");
            $("#PartyEmployee").val(ui.item ? ui.item.label : "");
            getemployee();
            return false;
        };
        var focusemployee = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item.value);
            $("#PartyEmployee").val(ui.item.label);
        };
        var changeemployee = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item ? ui.item.value : "");
            $("#PartyEmployee").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#PartyEmployee').val('');
            }
        };
        $("#PartyEmployee").autocomplete({
            source: getemployees,
            select: selectemployee,
            focus: focusemployee,
            minLength: 2,
            delay: 100,
            change: changeemployee
        });
        //Party Employee Autocomplete


        //Party Vendor Autocomplete
        var getvendors = function (request, response) {
            _vendorService.getVendors({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        var selectvendor = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item ? ui.item.value : "");
            $("#PartyVendor").val(ui.item ? ui.item.label : "");
            return false;
        };
        var focusvendor = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item.value);
            $("#PartyVendor").val(ui.item.label);
        };
        var changevendor = function (event, ui) {
            event.preventDefault();
            $("#PartyId").val(ui.item ? ui.item.value : "");
            $("#PartyVendor").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#PartyVendor').val('');
            }
        };
        $("#PartyVendor").autocomplete({
            source: getvendors,
            select: selectvendor,
            focus: focusvendor,
            minLength: 2,
            delay: 100,
            change: changevendor
        });
        //Party Vendor Autocomplete
        var dataTable = _$Table.DataTable({
            responsive: true,
            paging: true,
            searching: false,
            serverSide:true,
            //"footerCallback": function (tfoot, data, start, end, display) {
            //    var api = this.api();
            //    var p = api.column(3).data().reduce(function (a, b) {
            //        return a + b;
            //    }, 0)
            //    $(api.column(3).footer()).html(currencyFormat(p));
            //    var p2 = api.column(4).data().reduce(function (a, b) {
            //        return a + b;
            //    }, 0)
            //    $(api.column(4).footer()).html(currencyFormat(p2));
            //},
            listAction: {
                ajaxFunction: _accountService.getGeneralLedgers,
                inputFilter: function () {
                    var $companyid = $('#Companies').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $accountid = $('#AccountId').val();
                    var $transcode = $('#SearchFilter').val();
                    var $projectid = 'null';
                    var $partycode = $('#Type').val();
                    var $partyid = $('#PartyId').val();

                    if ($companyid === '') {
                        $companyid = 'null';
                    }
                    if ($accountid === '') {
                        $accountid = 'null';
                    }
                    if ($transcode === '') {
                        $transcode = 'null';
                    }
                    if ($partyid === '') {
                        $partyid = 'null';
                        $partycode = 'null';
                    }
                    return {
                        filter: $companyid + '|' + $datefrom + '|' + $dateto + '|' + $accountid + '|' + $transcode + '|' + $projectid + '|' + $partycode + '|' + $partyid,
                        maxResultCount: 1000
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
                    "data": "transactionTime",
                    "render": function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 2,
                    data: "account"
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    data: "debit",
                    targets: 3
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    data: "credit",
                    targets: 4
                },
                {
                    targets: 5,
                    data: "transactionType"
                },
                {
                    targets: 6,
                    data: "transactionCode"
                },
                {
                    targets: 7,
                    data: "partyType"
                },
                {
                    targets: 8,
                    data: "partyName"
                },
                {
                    "visible": false,
                    targets: 9,
                    data: "id"
                },
                {
                    "visible": false,
                    targets: 10,
                    data: "accountId"
                }
            ]
        });

        var dataTable2 = _$Table2.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            "footerCallback": function (tfoot, data, start, end, display) {
                var api = this.api();
                var p = api.column(3).data().reduce(function (a, b) {
                    return a + b;
                }, 0)
                $(api.column(3).footer()).html(currencyFormat(p));
                var p2 = api.column(4).data().reduce(function (a, b) {
                    return a + b;
                }, 0)
                $(api.column(4).footer()).html(currencyFormat(p2));
            },
            listAction: {
                ajaxFunction: _accountService.getGeneralLedgers,
                inputFilter: function () {
                    var $companyid = $('#Companies').val();
                    var $datefrom = $('#DateFrom').val();
                    var $dateto = $('#DateTo').val();
                    var $accountid = $('#AccountId').val();
                    var $transcode = $('#SearchFilter').val();
                    var $projectid = 'null';
                    var $partycode = $('#Type').val();
                    var $partyid = $('#PartyId').val();

                    if ($companyid === '') {
                        $companyid = 'null';
                    }
                    if ($accountid === '') {
                        $accountid = 'null';
                    }
                    if ($transcode === '') {
                        $transcode = 'null';
                    }
                    if ($partyid === '') {
                        $partyid = 'null';
                        $partycode = 'null';
                    }
                    return {
                        filter: $companyid + '|' + $datefrom + '|' + $dateto + '|' + $accountid + '|' + $transcode + '|' + $projectid + '|' + $partycode + '|' + $partyid,
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
                    "data": "transactionTime",
                    "render": function (data) {
                        var tt = new Date(data);
                        return getFormattedDate(tt);
                    }
                },
                {
                    targets: 2,
                    data: "account"
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    data: "debit",
                    targets: 3
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    data: "credit",
                    targets: 4
                },
                {
                    targets: 5,
                    data: "transactionType"
                },
                {
                    targets: 6,
                    data: "transactionCode"
                },
                {
                    targets: 7,
                    data: "partyType"
                },
                {
                    targets: 8,
                    data: "partyName"
                }
            ]
        });

        // View record
        _$Table.on('click', 'a.view-quotation', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-quotation-id");
            window.location.href = abp.appPath + 'Quotations/Details?id=' + clientId;
        });

        // Edit record
        _$Table.on('click', 'a.edit', function (e) {
            e.preventDefault();
            var orderId = $(this).attr("data-id");
            window.location.href = abp.appPath + 'StockEntry/Edit?id=' + orderId;
        });
        function getDataList() {
            _salesInvoiceService.getSalesInvoiceChargesByParentId({ id: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $sqccid = result.items[i].id;
                    var $sqcchargetypeid = result.items[i].chargeTypeId;
                    var $sqcchargetype = result.items[i].chargeType;
                    var $sqcrate = result.items[i].rate;
                    var $sqcamount = result.items[i].amount;
                    var $sqctotal = result.items[i].total;
                    var $sqcrevenueaccountid = result.items[i].revenueAccountId;
                    var sqcdatacount = dataTableCharges.rows().count();
                    var sqcitemno = sqcdatacount + 1;
                    dataTableCharges.row.add([sqcitemno,
                        $sqcchargetype,
                        $sqcrate,
                        $sqcamount, $sqctotal, '', $sqcchargetypeid, $sqcrevenueaccountid, $sqccid]).draw();
                }
                abp.ui.clearBusy(_$form);
            });
        };

        function getDataList() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getDataList();
        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getDataList();
        });

        $('#SearchFilter').focus();

        $("#Warehouses").change(function () {
            getDataList();
        });

        $("#Categories").change(function () {
            getDataList();
        });

        $("#Brands").change(function () {
            getDataList();
        });


        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ListTable2', 'General Ledger', 'GeneralLedger.xls');
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

    });
})();
