function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

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

        var _companyService = abp.services.app.companyService;
        var _commonService = abp.services.app.commonService;
        var _clientService = abp.services.app.clientService;
        var _salesInvoiceService = abp.services.app.salesInvoiceService;
        var _accountService = abp.services.app.accountService;
        var _collectionService = abp.services.app.collectionService;

        var _$form = $('form[name=CollectionForm]');
        var _$table = $('#ListTable');
        var _$arTable = $('#AccountsReceivableTable');
        var _$ledgerTable = $('#LedgerTable');

        getcollection();
        function getcollection() {
            $("#SubmitButton").attr("hidden", true);
            abp.ui.setBusy(_$form);
            var $id = $('#Id').val();
            console.log($id);
            _collectionService.getCollection({ id: $id }).done(function (result) {
                console.log(result);
                var qtransactiontime = new Date(result.transactionTime);
                var colgrandtotal = currencyFormat(result.grandTotal);
                $('#Code').val(result.code);
                $('#SeriesCode').val(result.code);
                $('#Prefix').val(result.prefix);
                $('#SeriesTypeId').val(result.seriesTypeId);
                $('#Companies').val(result.companyId);
                $('#ClientId').val(result.clientId);
                $('#ClientName').val(result.client);
                $('#TransactionTime').val(getFormattedDate(qtransactiontime));
                $('#SalesOrderCode').val(result.referenceCode);
                $('#PaidAmount').val(colgrandtotal);
                $('#ReferenceNo').val(result.referenceNo);
                $('#StatusBadge').text(result.status);
                switch (result.statusId) {
                    case 1:
                        $('#StatusBadge').addClass('badge badge-secondary');
                        if ($('#SaveButton').length) {
                            $('#SaveButton').removeAttr('hidden');
                        }
                        if ($('#SubmitButton').length) {
                            $('#SubmitButton').removeAttr('hidden');
                        }
                        break;
                    case 2:
                        $('#StatusBadge').addClass('badge badge-success');
                        if ($('#ActionButton').length) {
                            $('#ActionButton').removeAttr('hidden');
                        }
                        break;
                    case 3:
                        $('#StatusBadge').addClass('badge badge-danger');
                        //if ($('#SubmitButton').length) {
                        //    $('#SubmitButton').removeAttr('hidden');
                        //}
                        //break;
                    case 4:
                        $('#StatusBadge').addClass('badge badge-primary');
                        break;
                    case 5:
                        $('#StatusBadge').addClass('badge badge-info');
                        break;
                    case 6:
                        $('#StatusBadge').addClass('badge badge-warning');
                        break;
                    default:
                        $('#StatusBadge').addClass('badge badge-secondary');
                }
                getcompanies(result.companyId);
                getpaymentmode(result.paymentModeId);
                
                //dataTable.clear().draw();
                if (result.statusId.toString() == "1") {
                    $('#divAR').show();
                    $('#divApplied').hide();
                    getewt(result.clientId, result.id);
                }
                else {
                    $('#divAR').hide();
                    $('#divApplied').show();
                    getcollectionapplied(result.id);
                }
                //getaccountreceivables(result.clientId, result.id);
                //updateARtable();
                //$('#PaymentModes').prop('disabled', 'disabled');
                $('#Companies').prop('disabled', 'disabled');
                $('#Series').prop('disabled', 'disabled');
            });
        };

        function getewt(clientid, collectionid) {
            var taxtypes = $('#EWTTypes');
            taxtypes.empty();
            taxtypes.append('<option data-accountid=0 data-rate=0 value="0">None</option>');
            _commonService.getTaxTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].type == 2) {
                        //if (id === result.items[i].id) {
                        //    taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-code=' + result.items[i].code + ' selected>' + result.items[i].name + '</option>');
                        //}
                        //else {
                        taxtypes.append('<option value=' + result.items[i].id + ' data-rate=' + result.items[i].rate + ' data-accountid =' + result.items[i].liabilityAccountId + ' data-code=' + result.items[i].code + '>' + result.items[i].name + '</option>');
                        //}
                    }
                }
                taxtypes.selectpicker('refresh');
            }).always(function () {
                getaccountreceivables(clientid, collectionid);
            });
        }

        function getcollectionapplied(id) {
            _collectionService.getCollectionAppliedByParentId({ id: id }).done(function (result) {

                for (var i = 0; i < result.items.length; i++) {
                    var $colid = result.items[i].id;
                    var colappliedtime = new Date(result.items[i].appliedTime);
                    var $colappliedtime = getFormattedDate(colappliedtime);
                    var $colsalesinvoiceid = result.items[i].salesInvoiceId;
                    var $colsalesinvoicecode = result.items[i].salesInvoiceCode;
                    var colsalesinvoicetime = new Date(result.items[i].salesInvoiceTime);
                    var $colsalesinvoicetime = getFormattedDate(colsalesinvoicetime);
                    var colsitotal = result.items[i].salesInvoiceTotal + '';
                    var $colsitotal = parseFloat(colsitotal.replace(/,/g, ''));
                    var colamount = result.items[i].amount + '';
                    var $colamount = parseFloat(colamount.replace(/,/g, ''));
                    var $colaccountid = result.items[i].againstAccountId;
                    var $colaccount = result.items[i].account;
                    var $colstatus = result.items[i].status;
                    var $colisfullypaid = result.items[i].isFullyPaid;

                    dataTable.row.add(['',
                        $colsalesinvoicecode,
                        $colsalesinvoicetime,
                        $colsitotal,
                        $colaccount,
                        $colstatus,
                        $colappliedtime,
                        $colamount,
                        $colid,
                        $colsalesinvoiceid,
                        $colaccountid,
                        $colisfullypaid
                      ]).draw();

                }
                computeTotal();
                abp.ui.clearBusy(_$form);
            });
        }
        function getcompanies(id) {
            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (id === result.items[i].id) {
                        companies.append('<option value=' + result.items[i].id + ' data-depositaccountid=' + result.items[i].depositAccountId + ' data-bankaccountid=' + result.items[i].bankAccountId + ' data-cashaccountid=' + result.items[i].cashAccountId + ' data-payableaccountid=' + result.items[i].payableAccountId + ' data-receivableaccountid=' + result.items[i].receivableAccountId + ' data-taxaccountid=' + result.items[i].taxAccountId + ' selected>' + result.items[i].name + '</option>');
                        $('#DepositAccountId').val(result.items[i].depositAccountId);
                        getseriestype(result.items[i].id);
                    }
                    else {
                        companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                companies.selectpicker('refresh');
            });
        }
        function getseriestype(companyid) {
            var series = $('#Series');
            series.empty();
            _commonService.getSeriesTypesByTransId({ id: 0, transactionCode: 130, companyId: companyid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
                    //if (i === 0) {
                    //    getnextseries(result.items[i].id);
                    //}
                }
                series.selectpicker('refresh');
            });
        }
        function getnextseries(seriesid) {
            _commonService.getNextSeriesCode({ id: seriesid, transactionCode: 0, companyId: 0 }).done(function (result) {
                $('#SeriesCode').val(result);
            });
        }
        function getpaymentmode(id) {
            var ordertypes = $('#PaymentModes');
            ordertypes.empty();
            _commonService.getPaymentModes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {

                    if (id === result.items[i].id) {
                        ordertypes.append('<option value=' + result.items[i].id + ' data-defaultaccountid=' + result.items[i].defaultAccountId + ' data-istax=' + result.items[i].isTax + ' selected>' + result.items[i].name + '</option>');
                        var deafaultaccountid = result.items[i].defaultAccountId;
                        $('#DefaultAccountId').val(deafaultaccountid);
                        getAccount(deafaultaccountid);
                    }
                    else {
                        ordertypes.append('<option value=' + result.items[i].id + ' data-defaultaccountid=' + result.items[i].defaultAccountId + ' data-istax=' + result.items[i].isTax + '>' + result.items[i].name + '</option>');
                    }
                }
                ordertypes.selectpicker('refresh');
            });
        }
        function getAccount(accountid) {
            _accountService.getAccount({ id: accountid }).done(function (result) {
                $('#DefaultAccount').val(result.name);
            });
        };

      
        function getaccountreceivables(clientid, collectionid) {
            dataTable.clear().draw();
            _salesInvoiceService.getAccountsReceivable({
                filter: '|||||' + clientid + '|' + collectionid + '|' + collectionid
            }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].id;
                    var $sicode = result.items[i].code;
                    var $sidate = result.items[i].transactionTime;
                    var tt = new Date(result.items[i].transactionTime);
                    $sidate = getFormattedDate(tt);
                    //MULTIPLE SI
                    //var $sigrandtotal = result.items[i].grandTotal;
                    var $sigrandtotal = result.items[i].billGrandTotal;
                    var $sipaid = result.items[i].paid;
                    var $sicredit = result.items[i].credit;
                    var $sibalance = result.items[i].balance;
                    var $siid = result.items[i].id;
                    var $sitaxaccountid = result.items[i].taxAccountId;
                    var $siaraccountid = result.items[i].receivableAccountId;
                    var $sicashaccountid = result.items[i].cashAccountId;
                    var strid = 'row-' + i + '-allocated';
                    //EDIT COLLECTION
                    var strid2 = 'row-' + i + '-ewt';
                    var strid3 = 'row-' + i + '-ewtdrop';
                    var ewttypes = $('#EWTTypes');
                    var ewtopt = '';

                    var $colid = result.items[i].collectionId;
                    var $colapid = result.items[i].collectionAppliedId;
                    var $colamt = result.items[i].collectionAmount;
                    var $ewtamt = result.items[i].collectionEWTAmount;
                    var $ewtid = result.items[i].collectionEWTId;
                    var $ewtactid = result.items[i].collectionEWTAccountId;

                    $("#EWTTypes option").each(function () {
                        //console.log(this.outerHTML);
                        //alert(this.text + ' ' + this.value);
                        console.log(this.value + ' - ' + $ewtid);
                        if (this.value === $ewtid.toString()) {
                            this.setAttribute('selected', 'selected');
                        }
                        else {
                            this.removeAttribute('selected', 'selected');
                        }
                        ewtopt += this.outerHTML;
                    });
                    

                    var ewtdrop = '<select id="' + strid3 + '" data-balance=' + $sibalance + ' data-indexno=' + i + ' class="ewtdrop form-control ">' + ewtopt + '</select>';

                    //dataTableAR.row.add(['', $sicode, $sidate, $sigrandtotal, $sipaid, $sicredit, $sibalance, '<input id="' + strid + '" data-indexno=' + i + ' data-balance=' + $sibalance + '  onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="0">', $siid, $sitaxaccountid, $siaraccountid, $sicashaccountid, 0]).draw();
                    dataTableAR.row.add(['',
                        $sicode,
                        $sidate,
                        $sigrandtotal,
                        $sipaid,
                        $sicredit,
                        $sibalance,
                        '<input id="' + strid + '" data-indexno=' + i + ' data-balance=' + $sibalance + '  onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($colamt) + '" >',
                        $siid,
                        $sitaxaccountid,
                        $siaraccountid,
                        $sicashaccountid,
                        $colamt,
                        ewtdrop,
                        '<input id="' + strid2 + '" data-indexno=' + i + ' data-balance=' + $sibalance + '  onkeypress="return decimalOnly(this.id);" class="ewt form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($ewtamt) + '" >',
                        $ewtamt,
                        $ewtid,
                        $ewtactid,
                        $colapid]).draw();
                    dataTableAR.ajax.reload();
                }
                computeARTotal();
                abp.ui.clearBusy(_$form);
            });
        };
        //Client Autocomplete
        var getclients = function (request, response) {
            _clientService.getClients({ filter: request.term }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getclient() {
            var $clientid = $('#ClientId').val();
            _clientService.getClient({ id: $clientid }).done(function (result) {
                $('#ClientAddress').val(result.address);
                $('#DeliveryAddress').val(result.address);
                $('#ClientEmail').val(result.email);
                getaccountreceivables($clientid);
            });
        };
        var selectclient = function (event, ui) {
            event.preventDefault();
            $("#ClientId").val(ui.item ? ui.item.value : "");
            $("#ClientName").val(ui.item ? ui.item.label : "");
            getclient();
            return false;
        };
        var focusclient = function (event, ui) {
            event.preventDefault();
            $("#ClientId").val(ui.item.value);
            $("#ClientName").val(ui.item.label);
        };
        var changeclient = function (event, ui) {
            event.preventDefault();
            $("#ClientId").val(ui.item ? ui.item.value : "");
            $("#ClientName").val(ui.item ? ui.item.label : "");
            if (ui.item === null) {
                $('#ClientAddress').val("");
                $('#ClientEmail').val("");
            }
        };
        $("#ClientName").autocomplete({
            source: getclients,
            select: selectclient,
            focus: focusclient,
            minLength: 2,
            delay: 100,
            change: changeclient
        });

       
        //Client Autocomplete
        var dataTableLedger = _$ledgerTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [5, 6]
            },
            {
                orderable: false,
                targets: [0, 1, 2, 3, 4, 5]
            },
            {
                render: $.fn.dataTable.render.number(',', '.', 2),
                className: 'text-right',
                targets: [2, 3]
            }
            ]
        });

        var dataTable = _$table.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
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
                    "visible": false,
                    targets: [8, 9, 10, 11]
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    orderable: false,
                    targets: [3, 7]
                }
                ,
                {
                    className: 'text-center',
                    targets: [4]
                }
            ]
        });

      
        var dataTableAR = _$arTable.DataTable({
            responsive: true,
            paging: false,
            "bInfo": false,
            searching: false,
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
                    "visible": false,
                    targets: [5, 8, 9, 10, 11, 12, 15, 16, 17, 18]
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    orderable: false,
                    targets: [3, 4, 5, 6]
                },
                {
                    orderable: false,
                    targets: [13]
                },
                {
                    className: 'text-right',
                    orderable: false,
                    targets: [7, 14]
                }
            ]
        });
    
        $('#PaidAmount').on('change', function (e) {
            computeTotal();
        });

        function updateARtable() {
            var table = _$arTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;
            for (var i = 0; f.length > i; i++) {

                var $sibalance = '' + f[i][6];
                var $indexno = i;
                var strid = 'row-' + $indexno + '-allocated';
                var temp = table.row(i).data();

                temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="0" >';
                temp[12] = 0;
                _$arTable.dataTable().fnUpdate(temp, i, undefined, false);
            }
        }

        function updateARTable() {
            var $sibalance = '' + $(this).attr("data-balance");
            var $indexno = $(this).attr("data-indexno");
            var strid = 'row-' + $indexno + '-allocated';

            var table = _$arTable.DataTable();
            var temp = table.row($indexno).data();
            temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="0" >';
            temp[12] = 0;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
        }

        //_$arTable.on('change', '.allocated', function (e) {
        //    e.preventDefault();
        //    var $sibalance = '' + $(this).attr("data-balance");

        //    $sibalance = parseFloat($sibalance.replace(/,/g, ''));

        //    var $unallocated = $('#UnAllocatedTotal').val() + '';
        //    if ($unallocated === '') {
        //        $unallocated = 0;
        //    }
        //    else {
        //        $unallocated = parseFloat($unallocated.replace(/,/g, ''));
        //    }

        //    var $amount = $(this).val() + '';
        //    var $indexno = $(this).attr("data-indexno");
        //    var strid = 'row-' + $indexno + '-allocated';

        //    if ($amount === '') {
        //        $amount = 0;
        //    }
        //    else {
        //        $amount = parseFloat($amount.replace(/,/g, ''));
        //    }

        //    if ($amount > $sibalance) {
        //        $amount = $sibalance;
        //    }

        //    if ($amount > $unallocated) {
        //        $amount = $unallocated;
        //    }

        //    var table = _$arTable.DataTable();
        //    var temp = table.row($indexno).data();
        //    temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance +' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + $amount+'" >';
        //    temp[12] = $amount;
        //    _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
        //    computeARTotal();
        //});


        _$arTable.on('change', '.allocated', function (e) {
            e.preventDefault();
            var $sibalance = '' + $(this).attr("data-balance");
            var $indexno = $(this).attr("data-indexno");

            $sibalance = parseFloat($sibalance.replace(/,/g, ''));

            var table = _$arTable.DataTable();
            var temp = table.row($indexno).data();
            temp[12] = 0;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeTotal();

            var $unallocated = $('#UnAllocatedTotal').val();
            if ($unallocated === '') {
                $unallocated = 0;
            }
            else {
                $unallocated = parseFloat($unallocated.replace(/,/g, ''));
            }

            var $amount = $(this).val();
            var strid = 'row-' + $indexno + '-allocated';
            var strid2 = 'row-' + $indexno + '-ewt';
            var $ewtamt = '' + $('#' + strid2).val();

            if ($ewtamt === '') {
                $ewtamt = 0;
            }
            else {
                $ewtamt = parseFloat($ewtamt.replace(/,/g, ''));
            }

            if ($amount === '') {
                $amount = 0;
            }
            else {
                $amount = parseFloat($amount.replace(/,/g, ''));
            }

            var $total = $amount + $ewtamt;
            if ($total > 0) {
                if ($total > $sibalance) {
                    $amount = $sibalance - $ewtamt;
                }
            }

            if ($amount > $unallocated) {
                $amount = $unallocated;
            }


            table = _$arTable.DataTable();
            temp = table.row($indexno).data();
            temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + $amount + '" >';
            temp[12] = $amount;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeARTotal();
        });

        _$arTable.on('change', '.ewt', function (e) {
            e.preventDefault();
            var $sibalance = '' + $(this).attr("data-balance");
            var $indexno = $(this).attr("data-indexno");

            $sibalance = parseFloat($sibalance.replace(/,/g, ''));

            var table = _$arTable.DataTable();
            var temp = table.row($indexno).data();
            temp[12] = 0;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeTotal();

            var $unallocated = $('#UnAllocatedTotal').val();
            if ($unallocated === '') {
                $unallocated = 0;
            }
            else {
                $unallocated = parseFloat($unallocated.replace(/,/g, ''));
            }

            var $ewtamt = $(this).val();
            var strid = 'row-' + $indexno + '-allocated';
            var strid2 = 'row-' + $indexno + '-ewt';
            var strid3 = 'row-' + $indexno + '-ewtdrop';
            var $amount = '' + $('#' + strid).val();

            var ewtdrop = '' + $('#' + strid3).val();

            if (ewtdrop != "0") {
                if ($ewtamt === '') {
                    $ewtamt = 0;
                }
                else {
                    $ewtamt = parseFloat($ewtamt.replace(/,/g, ''));
                }
            }
            else {
                $ewtamt = 0;
            }

            if ($amount === '') {
                $amount = 0;
            }
            else {
                $amount = parseFloat($amount.replace(/,/g, ''));
            }

            var $total = $amount + $ewtamt;
            if ($total > 0) {
                if ($total > $sibalance) {
                    $amount = $sibalance - $ewtamt;
                }
            }

            if ($amount > $unallocated) {
                $amount = $unallocated;
            }


            table = _$arTable.DataTable();
            temp = table.row($indexno).data();
            temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + $amount + '" >';
            temp[12] = $amount;

            temp[14] = '<input id="' + strid2 + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="ewt form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($ewtamt) + '" >';
            temp[15] = $ewtamt;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeARTotal();
        });

        _$arTable.on('change', '.ewtdrop', function (e) {
            //e.preventDefault();
            var $indexno = '' + $(this).attr("data-indexno");
            var $ewtid = $(this).val();
            console.log('EWTID ' + $ewtid);
            var $sibalance = '' + $(this).attr("data-balance"); //$("#row-" + $indexno + "-ewtdrop option:selected").data('balance');
            var $ewtrate = '' + $("#row-" + $indexno + "-ewtdrop option:selected").data('rate');
            var $ewtactid = '' + $("#row-" + $indexno + "-ewtdrop option:selected").data('accountid');
            $("#row-" + $indexno + "-ewtdrop option:selected").attr("selected", null);
            console.log($("#row-" + $indexno + "-ewtdrop").innerHTML);
            console.log('$sibalance ' + $sibalance);
            console.log('$ewtrate ' + $ewtrate);
            console.log('$ewtactid ' + $ewtactid);
            $ewtrate = parseFloat($ewtrate.replace(/,/g, '')) - 1;
            $sibalance = parseFloat($sibalance.replace(/,/g, ''));
            var $ewtamt = $sibalance * $ewtrate;
            console.log('ewtamt ' + $ewtamt);

            var table = _$arTable.DataTable();
            var temp = table.row($indexno).data();
            temp[12] = 0;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeTotal();

            var $unallocated = $('#UnAllocatedTotal').val();
            if ($unallocated === '') {
                $unallocated = 0;
            }
            else {
                $unallocated = parseFloat($unallocated.replace(/,/g, ''));
            }

            //var $indexno = $(this).attr("data-indexno");
            var strid = 'row-' + $indexno + '-allocated';
            var strid2 = 'row-' + $indexno + '-ewt';
            var $amount = $('#' + strid).val();
            console.log(strid);
            console.log($amount);
            if ($amount === '') {
                $amount = 0;
            }
            else {
                $amount = parseFloat($amount.replace(/,/g, ''));
            }

            var $total = $amount + $ewtamt;
            if ($total > 0) {
                if ($total > $sibalance) {
                    $amount = $sibalance - $ewtamt;
                }
            }

            if ($amount > $unallocated) {
                $amount = $unallocated;
            }

            table = _$arTable.DataTable();
            temp = table.row($indexno).data();
            temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($amount) + '" >';
            temp[12] = $amount;

            var strid3 = 'row-' + $indexno + '-ewtdrop';
            var ewttypes = $('#EWTTypes');
            var ewtopt = '';
            $("#EWTTypes option").each(function () {
                //console.log(this.outerHTML);
                //alert(this.text + ' ' + this.value);
                console.log(this.value + ' ' + $ewtid);
                if (this.value === $ewtid) {
                    this.setAttribute('selected', 'selected');
                }
                else {
                    this.removeAttribute('selected', 'selected');
                }
                ewtopt += this.outerHTML;
            });

            var ewtdrop = '<select id="' + strid3 + '" data-balance=' + $sibalance + ' data-indexno=' + $indexno + ' class="ewtdrop form-control ">' + ewtopt + '</select>';

            temp[13] = ewtdrop;

            temp[14] = '<input id="' + strid2 + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="ewt form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($ewtamt) + '" >';
            temp[15] = $ewtamt;
            temp[16] = $ewtid;
            temp[17] = $ewtactid;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeARTotal();

        });
        function computeTotal() {
            var paid = 0;
            if ($('#PaidAmount').val() !== '') {
                paid = parseFloat($('#PaidAmount').val().replace(/,/g, ''));
            }
            var allocatedTotal = 0;
            dataTable.column(7).data()
                .each(function (value, index) {
                    var $allocated = '' + value;
                    $allocated = parseFloat($allocated.replace(/,/g, ''));
                    allocatedTotal = allocatedTotal + $allocated;
                });

            var unallocated = paid - allocatedTotal;
            $('#AllocatedTotal').val(currencyFormat(allocatedTotal));
            $('#UnAllocatedTotal').val(currencyFormat(unallocated));
        }
        function computeARTotal() {
            var paid = 0;
            if ($('#PaidAmount').val() !== '') {
                paid = parseFloat($('#PaidAmount').val().replace(/,/g, ''));
            }
            var allocatedTotal = 0;
            dataTableAR.column(12).data()
                .each(function (value, index) {
                    var $allocated = '' + value;
                    $allocated = parseFloat($allocated.replace(/,/g, ''));
                    allocatedTotal = allocatedTotal + $allocated;
                });

            var unallocated = paid - allocatedTotal;
            $('#AllocatedTotal').val(currencyFormat(allocatedTotal));
            $('#UnAllocatedTotal').val(currencyFormat(unallocated));
        }
        function generateLedger() {
            //var paidamount = $('#AllocationTotal').val();
            
            //if (paidamount !== '') {
            //    paidamount = parseFloat($('#AllocationTotal').val().replace(/,/g, ''));
            //}
            //else{
            //    paidamount = 0;
            //}
            var paidamount = $('#PaidAmount').val();

            if (paidamount !== '') {
                paidamount = parseFloat($('#PaidAmount').val().replace(/,/g, ''));
            }
            else {
                paidamount = 0;
            }

            var unappliedamount = $('#UnAllocatedTotal').val();
            if (unappliedamount !== '') {
                unappliedamount = parseFloat($('#UnAllocatedTotal').val().replace(/,/g, ''));
            }
            else {
                unappliedamount = 0;
            }

            var depositaccountid = $('#DepositAccountId').val();
            var defaultaccountid = $('#DefaultAccountId').val();

            var clientid = $('#ClientId').val();
            var client = $('#ClientName').val();

            if (paidamount <= 0) {
                return;
            }

            dataTableLedger.clear().draw();
            var ctr = 1;
            dataTableLedger.row.add([ctr,
                defaultaccountid,
                paidamount,
                0,
                client,
                defaultaccountid,
                clientid]).draw();//Deposit - Debit
            ctr++;

            if (unappliedamount > 0) {
                dataTableLedger.row.add([ctr,
                    depositaccountid,
                    0,
                    unappliedamount,
                    client,
                    depositaccountid,
                    clientid]).draw();//Deposit
                ctr++;
            }

            var table = _$arTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {
                var allocated = f[i][12];
                var arid = f[i][10];

                var ewt = f[i][15];
                var ewtid = f[i][16];
                var ewtactid = f[i][17];

                if (allocated > 0) {
                    dataTableLedger.row.add([ctr,
                        arid,
                        0,
                        allocated + ewt,
                        client,
                        arid,
                        clientid]).draw();//Income
                    ctr++;
                }
                if (ewt > 0 && ewtid > 0) {
                    dataTableLedger.row.add([ctr,
                        arid,
                        ewt,
                        0,
                        client,
                        ewtactid,
                        clientid]).draw();//Income
                    ctr++;
                }
            }
        }

        function save(statusid) {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            if (statusid == "2") {
                generateLedger();
            }


            var $allocationamount = $('#AllocationTotal').val() + '';
            if ($allocationamount === '') {
                $allocationamount = 0;
            }
            else {
                $allocationamount = parseFloat($allocationamount.replace(/,/g, ''));
            }


            var $paidamount = $('#PaidAmount').val() + '';
            if ($paidamount === '') {
                $paidamount = 0;
            }
            else {
                $paidamount = parseFloat($paidamount.replace(/,/g, ''));
            }

            var $allocated = $('#AllocatedTotal').val() + '';
            if ($allocated === '') {
                $allocated = 0;
            }
            else {
                $allocated = parseFloat($allocated.replace(/,/g, ''));
            }
            var $unallocated = $('#UnAllocatedTotal').val() + '';
            if ($unallocated === '') {
                $unallocated = 0;
            }
            else {
                $unallocated = parseFloat($unallocated.replace(/,/g, ''));
            }
            if ($paidamount <= 0) {
                return;
            }
            if ($allocationamount <= 0) {
                abp.message.warn('No amount to be applied', 'Warning');
                return;
            }

            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var viewData = {
                collection: {
                    "id": formdata.Id,
                    "code": formdata.Code,
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "paymentModeId": formdata.PaymentModeId,
                    //MARC
                    "referenceNo": formdata.ReferenceNo,
                    "grandTotal": formdata.PaidAmount,
                    "paymentAccountId": formdata.DefaultAccountId,
                    "depositAccountId": formdata.DepositAccountId,
                    "statusId": statusid
                },
                collectionapplied: [],
                generalledger: []
            };
            disabled.attr('disabled', 'disabled');
            
            //items
            var table = _$arTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            //jsonObj = [];
            for (var i = 0; f.length > i; i++) {
                var prevbalance = f[i][6];
                var appliedamount = f[i][12];
                var totalappliedamount = f[i][12] + f[i][15];
                var colapid = f[i][18];
                if (colapid > 0) {
                    if (appliedamount > 0) {
                        item = {};
                        item["CollectionId"] = formdata.Id;
                        item["SalesInvoiceId"] = f[i][8];
                        item["AppliedTime"] = formdata.TransactionTime;
                        item["Amount"] = f[i][12];
                        item["AgainstAccountId"] = f[i][10];
                        item["EWTAmount"] = f[i][15];
                        item["EWTId"] = f[i][16];
                        item["EWTAccountId"] = f[i][17];
                        item["Id"] = f[i][18];
                        //if (prevbalance === appliedamount) {
                        if (prevbalance === totalappliedamount) {
                            item["IsFullyPaid"] = true;
                        }
                        else {
                            item["IsFullyPaid"] = false;
                        }
                        viewData.collectionapplied.push(item);
                    }
                    else {
                        item = {};
                        item["CollectionId"] = formdata.Id;
                        item["SalesInvoiceId"] = f[i][8];
                        item["AppliedTime"] = formdata.TransactionTime;
                        item["Amount"] = f[i][12];
                        item["AgainstAccountId"] = f[i][10];
                        item["EWTAmount"] = f[i][15];
                        item["EWTId"] = f[i][16];
                        item["EWTAccountId"] = f[i][17];
                        item["Id"] = f[i][18];
                        item["IsDeleted"] = 1;
                        //if (prevbalance === appliedamount) {
                        if (prevbalance === totalappliedamount) {
                            item["IsFullyPaid"] = true;
                        }
                        else {
                            item["IsFullyPaid"] = false;
                        }
                        viewData.collectionapplied.push(item);
                    }
                }
                else {
                    if (appliedamount > 0) {
                        item = {};
                        item["CollectionId"] = formdata.Id;
                        item["SalesInvoiceId"] = f[i][8];
                        item["AppliedTime"] = formdata.TransactionTime;
                        item["Amount"] = f[i][12];
                        item["AgainstAccountId"] = f[i][10];
                        item["EWTAmount"] = f[i][15];
                        item["EWTId"] = f[i][16];
                        item["EWTAccountId"] = f[i][17];
                        item["Id"] = f[i][18];
                        //if (prevbalance === appliedamount) {
                        if (prevbalance === totalappliedamount) {
                            item["IsFullyPaid"] = true;
                        }
                        else {
                            item["IsFullyPaid"] = false;
                        }
                        viewData.collectionapplied.push(item);
                    }
                }
            }
            //ledger
            var tableledgers = _$ledgerTable.DataTable();
            var form_dataledger = tableledgers.rows().data();
            var x = form_dataledger;

            for (var y = 0; x.length > y; y++) {
                var dt = x[y][2] + '';
                var ct = x[y][3] + '';
                var debit = parseFloat(dt.replace(/,/g, ''));
                var credit = parseFloat(ct.replace(/,/g, ''));
                ledger = {};
                ledger["TransactionTypeId"] = "0";
                ledger["TransactionId"] = formdata.Id;
                ledger["TransactionCode"] = formdata.Code;
                ledger["TransactionTime"] = formdata.TransactionTime;
                ledger["AccountId"] = x[y][5];
                ledger["Debit"] = x[y][2];
                ledger["Credit"] = x[y][3];
                if (debit > 0) {
                    ledger["BaseTypeId"] = "1";
                }
                else {
                    ledger["BaseTypeId"] = "2";
                }

                ledger["Description"] = "";
                ledger["CenterTypeId"] = "1";
                ledger["PartyId"] = x[y][6];
                ledger["ProjectId"] = "0";
                var partyid = x[y][6];
                if (partyid > 0) {
                    ledger["PartyName"] = x[y][4];
                    ledger["PartyCode"] = "105";
                }
                else {
                    ledger["PartyName"] = "";
                    ledger["PartyCode"] = "0";
                }
                ledger["CompanyId"] = formdata.CompanyId;
                viewData.generalledger.push(ledger);
            }

            abp.message.confirm(
                'Collection will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _collectionService.updateCollection(viewData).done(function (result) {
                            if (result === null || result === "0") { return; }
                            abp.message.success('Collection updated.', 'Success');
                            setTimeout(function () {
                                location.reload(true);
                            }, 2000);
                            //window.location.href = abp.appPath + 'Collections/Edit?id=' + result;
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        $('#SaveButton').click(function (e) {
            e.preventDefault();
            save("1");
        });

        $('#SubmitButton').click(function (e) {
            e.preventDefault();
            save("2");
        });
        
        // Delete product unit record

        $('#TaxTypes').on('change', function (e) {
            computeTotal();
        });
        $('#AddItemButton').click(function (e) {
            e.preventDefault();
            addnewitem();
        });
        //Datatable Add
    });
})();



