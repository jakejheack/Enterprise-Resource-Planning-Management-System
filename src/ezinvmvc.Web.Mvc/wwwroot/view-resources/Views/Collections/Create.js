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
        var _$arTable = $('#AccountsReceivableTable');
        var _$ledgerTable = $('#LedgerTable');

        function getcompanies() {
            var companies = $('#Companies');
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault === true) {
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
        getcompanies();
        $('#Companies').on('change', function (e) {
            var cashaccountid = $("#Companies option:selected").data('cashaccountid');
            var payableaccountid = $("#Companies option:selected").data('payableaccountid');
            var receivableaccountid = $("#Companies option:selected").data('receivableaccountid');
            var taxaccountid = $("#Companies option:selected").data('taxaccountid');
            var depositaccountid = $("#Companies option:selected").data('depositaccountid');
            $('#DepositAccountId').val(depositaccountid);
            getseriestype($('#Companies').val());
        });
        $('#Series').on('change', function (e) {
            getnextseries($('#Series').val());
        });
        function getseriestype(companyid) {
            var series = $('#Series');
            series.empty();
            _commonService.getSeriesTypesByTransId({ id: 0, transactionCode: 130, companyId: companyid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    series.append('<option value=' + result.items[i].id + '>' + result.items[i].prefix + '</option>');
                    if (i === 0) {
                        getnextseries(result.items[i].id);
                    }
                }
                series.selectpicker('refresh');
            });
        }
        function getnextseries(seriesid) {
            _commonService.getNextSeriesCode({ id: seriesid, transactionCode: 0, companyId: 0 }).done(function (result) {
                $('#SeriesCode').val(result);
            });
        }
        function getpaymentmode() {
            var ordertypes = $('#PaymentModes');
            ordertypes.empty();
            _commonService.getPaymentModes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    console.log(result.items[i])
                    if (i === 0) {
                        var deafaultaccountid = result.items[i].defaultAccountId ;
                        $('#DefaultAccountId').val(deafaultaccountid);
                        console.log(deafaultaccountid);
                        getAccount(deafaultaccountid);
                       
                    }
                    ordertypes.append('<option value=' + result.items[i].id + ' data-defaultaccountid=' + result.items[i].defaultAccountId + ' data-istax=' + result.items[i].isTax + '>' + result.items[i].name + '</option>');
                }
                ordertypes.selectpicker('refresh');
            });
        }
        getpaymentmode();
        function getAccount(accountid) {
            _accountService.getAccount({ id: accountid }).done(function (result) {
                $('#DefaultAccount').val(result.name);
            });
        };
        $('#PaymentModes').on('change', function (e) {
            var accountid = $("#PaymentModes option:selected").data('defaultaccountid');
            $('#DefaultAccountId').val(accountid);
            getAccount(accountid);
        });

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
                getewt($clientid);
            });
        };


        function getewt(clientid) {
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
                getaccountreceivables(clientid);
            });
        }
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
                dataTable.clear().draw();
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

        function getaccountreceivables(id) {
            dataTable.clear().draw();
            _salesInvoiceService.getAccountsReceivable({
                filter: '|||||' + id 
            }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
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
                    var strid2 = 'row-' + i + '-ewt';
                    var strid3 = 'row-' + i + '-ewtdrop';
                    var ewttypes = $('#EWTTypes');
                    var ewtopt = '';
                    $("#EWTTypes option").each(function () {
                        //console.log(this.outerHTML);
                        //alert(this.text + ' ' + this.value);
                        ewtopt += this.outerHTML;
                    });

                    //for (var idx = 0; idx < ewttypes.length; idx++) {
                    //    console.log('length ' + ewttypes.length + ' index - ' + idx);
                    //    console.log('ewttypes value ' + ewttypes.options[idx]);
                    //    ewtopt += ewttypes.options[idx].outerHTML;
                    //}

                    var ewtdrop = '<select id="' + strid3 + '" data-balance=' + $sibalance + ' data-indexno=' + i + ' class="ewtdrop form-control ">' + ewtopt + '</select>';
                    console.log(ewtdrop);

                    dataTable.row.add(['',
                        $sicode,
                        $sidate,
                        $sigrandtotal,
                        $sipaid,
                        $sicredit,
                        $sibalance,
                        '<input id="' + strid + '" data-indexno=' + i + ' data-balance=' + $sibalance + '  onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="0" >',
                        $siid,
                        $sitaxaccountid,
                        $siaraccountid,
                        $sicashaccountid,
                        0,
                        ewtdrop,
                        '<input id="' + strid2 + '" data-indexno=' + i + ' data-balance=' + $sibalance + '  onkeypress="return decimalOnly(this.id);" class="ewt form-control m-input input-sm form-control-sm text-right" type="text" value="0" >',
                        0,
                        0,
                        0]).draw();
                    dataTable.ajax.reload();
                }
                abp.ui.clearBusy(_$form);
            });
        };

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

        var dataTable = _$arTable.DataTable({
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
                    targets: [5, 8, 9, 10, 11, 12, 15, 16, 17]
                },
                {
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'text-right',
                    orderable: false,
                    targets: [3, 4, 5, 6]
                },
                {
                    orderable: false,
                    targets:[13]
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
            temp[7] = '<input id="' + strid + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance +' onkeypress="return decimalOnly(this.id);" class="allocated form-control m-input input-sm form-control-sm text-right" type="text" value="' + $amount+'" >';
            temp[12] = $amount;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeTotal();
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
            var $amount = '' + $('#' + strid).val();

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

            temp[14] = '<input id="' + strid2 + '" data-indexno=' + $indexno + ' data-balance=' + $sibalance + ' onkeypress="return decimalOnly(this.id);" class="ewt form-control m-input input-sm form-control-sm text-right" type="text" value="' + currencyFormat($ewtamt) + '" >';
            temp[15] = $ewtamt;
            _$arTable.dataTable().fnUpdate(temp, $indexno, undefined, false);
            computeTotal();
        });
        
        _$arTable.on('change', '.ewtdrop', function (e) {
            //e.preventDefault();
            var $indexno = '' + $(this).attr("data-indexno");
            var $ewtid = $(this).val();
            console.log('EWTID ' + $ewtid);
            var $sibalance = '' + $(this).attr("data-balance"); //$("#row-" + $indexno + "-ewtdrop option:selected").data('balance');
            var $ewtrate = '' + $("#row-" + $indexno + "-ewtdrop option:selected").data('rate');
            var $ewtactid = '' + $("#row-" + $indexno + "-ewtdrop option:selected").data('accountid');
            $("#row-" + $indexno + "-ewtdrop option:selected").attr("selected",null);
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
            computeTotal();
            
        });

        function computeTotal() {
            var paid = 0;
            if ($('#PaidAmount').val() !== '') {
                paid = parseFloat($('#PaidAmount').val().replace(/,/g, ''));
            }

            var allocatedTotal = 0;
            dataTable.column(12).data()
                .each(function (value, index) {
                    var alloc = value + '';
                    var $allocated = parseFloat(alloc.replace(/,/g, ''));
                    allocatedTotal = allocatedTotal + $allocated;
                });

            var unallocated = paid - allocatedTotal;

            $('#AllocatedTotal').val(currencyFormat(allocatedTotal));
            $('#UnAllocatedTotal').val(currencyFormat(unallocated));

        }

        function generateLedger() {
            var paidamount = $('#PaidAmount').val();

            if (paidamount !== '') {
                paidamount = parseFloat($('#PaidAmount').val().replace(/,/g, ''));
            }
            else{
                paidamount = 0;
            }

            var unappliedamount = $('#UnAllocatedTotal').val();
            if (unappliedamount !== '') {
                unappliedamount = parseFloat($('#UnAllocatedTotal').val().replace(/,/g, ''));
            }
            else{
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
                '',
                defaultaccountid,
                0]).draw();//Cash in Bank
            ctr++;

            if (unappliedamount > 0) {
                dataTableLedger.row.add([ctr,
                    depositaccountid,
                    0,
                    unappliedamount,
                    '',
                    depositaccountid,
                    0]).draw();//Deposit
                ctr++;
            }
         

            var table = _$arTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            for (var i = 0; f.length > i; i++) {
                var allocated = f[i][12];
                var arid = f[i][10];

                if (allocated > 0) {
                    dataTableLedger.row.add([ctr,
                        arid,
                        0,
                        allocated,
                        client,
                        arid,
                        clientid]).draw();//Income
                    ctr++;
                }
            }
        }

        function save() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            generateLedger();

            var $paidamount = $('#PaidAmount').val();
            if ($paidamount === '') {
                $paidamount = 0;
            }
            else {
                $paidamount = parseFloat($paidamount.replace(/,/g, ''));
            }

            var $allocated = $('#AllocatedTotal').val();
            if ($allocated === '') {
                $allocated = 0;
            }
            else {
                $allocated = parseFloat($allocated.replace(/,/g, ''));
            }
            var $unallocated = $('#UnAllocatedTotal').val();
            if ($unallocated === '') {
                $unallocated = 0;
            }
            else {
                $unallocated = parseFloat($unallocated.replace(/,/g, ''));
            }
            if ($paidamount <= 0) {
                return;
            }

            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            var viewData = {
                collection: {
                    "companyId": formdata.CompanyId,
                    "seriesTypeId": formdata.SeriesTypeId,
                    "prefix": $("#Series option:selected").html(),
                    "code": "0",
                    "transactionTime": formdata.TransactionTime,
                    "clientId": formdata.ClientId,
                    "paymentModeId": formdata.PaymentModeId,
                    //MARC
                    "referenceNo": formdata.ReferenceNo,
                    "grandTotal": formdata.PaidAmount,
                    "paymentAccountId": formdata.DefaultAccountId,
                    "depositAccountId": formdata.DepositAccountId,
                    "statusId": 1
                },
                collectionapplied: [],
                generalledger: []
            };
            disabled.attr('disabled', 'disabled');

            //sales order items
            var table = _$arTable.DataTable();
            var form_data = table.rows().data();
            var f = form_data;

            //jsonObj = [];
            for (var i = 0; f.length > i; i++) {

                var prevbalance = f[i][6];
                //var appliedamount = f[i][12];
                var appliedamount = f[i][12] + f[i][15];
                if (appliedamount > 0) {
                    item = {};
                    item["CollectionId"] = "0";
                    item["SalesInvoiceId"] = f[i][8];
                    item["AppliedTime"] = formdata.TransactionTime;
                    item["Amount"] = f[i][12];
                    item["AgainstAccountId"] = f[i][10];
                    item["EWTAmount"] = f[i][15];
                    item["EWTId"] = f[i][16];
                    item["EWTAccountId"] = f[i][17];
                    if (prevbalance === appliedamount) {
                        item["IsFullyPaid"] = true;
                    }
                    else {
                        item["IsFullyPaid"] = false;
                    }
                    viewData.collectionapplied.push(item);
                }
            }
            //ledger
            //var tableledgers = _$ledgerTable.DataTable();
            //var form_dataledger = tableledgers.rows().data();
            //var x = form_dataledger;

            //for (var y = 0; x.length > y; y++) {
            //    var dt = x[y][2] + '';
            //    var ct = x[y][3] + '';
            //    var debit = parseFloat(dt.replace(/,/g, ''));
            //    var credit = parseFloat(ct.replace(/,/g, ''));
            //    ledger = {};
            //    ledger["TransactionTypeId"] = "0";
            //    ledger["TransactionId"] = formdata.Id;
            //    ledger["TransactionCode"] = formdata.Code;
            //    ledger["TransactionTime"] = formdata.TransactionTime;
            //    ledger["AccountId"] = x[y][5];
            //    ledger["Debit"] = x[y][2];
            //    ledger["Credit"] = x[y][3];
            //    if (debit > 0) {
            //        ledger["BaseTypeId"] = "1";
            //    }
            //    else {
            //        ledger["BaseTypeId"] = "2";
            //    }

            //    ledger["Description"] = "";
            //    ledger["CenterTypeId"] = "1";
            //    ledger["PartyId"] = x[y][6];
            //    ledger["ProjectId"] = "0";
            //    var partyid = x[y][6];
            //    if (partyid > 0) {
            //        ledger["PartyName"] = x[y][4];
            //        ledger["PartyCode"] = "105";
            //    }
            //    else {
            //        ledger["PartyName"] = "";
            //        ledger["PartyCode"] = "0";
            //    }
            //    ledger["CompanyId"] = formdata.CompanyId;
            //    viewData.generalledger.push(ledger);
            //}

            abp.message.confirm(
                'New collection will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _collectionService.createCollection(viewData).done(function (result) {
                            if (result === null || result === "0") { return; }
                            abp.message.success('Collection created', 'Success');
                            window.location.href = abp.appPath + 'Collections/Edit?id=' + result;
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        $('#SaveButton').click(function (e) {
            e.preventDefault();
            save();
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



