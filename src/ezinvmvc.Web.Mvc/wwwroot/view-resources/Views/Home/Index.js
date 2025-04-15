$(function ($) {
    ////Widgets count
    //$('.count-to').countTo();

    ////Sales count to
    //$('.sales-count-to').countTo({
    //    formatter: function (value, options) {
    //        return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ' ').replace('.', ',');
    //    }
    //});

    showMessage();

    //initRealTimeChart();
    //initDonutChart();
    //initSparkline();

    $(".date-picker").datepicker("update", new Date());
    $('.date-picker').datepicker({
        locale: abp.localization.currentLanguage.name,
        format: 'L'
    });
    var $month = (new Date().getMonth() + 1);
    //var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
    var mdayone = $month + "/01/" + new Date().getFullYear();
    $('#DateFrom').val(mdayone);

    $('.datetime-picker').datepicker({
        locale: abp.localization.currentLanguage.name,
        format: 'L LT'
    });

    $(function () {
        var _salesOrderService = abp.services.app.salesOrderService;
        var _leadService = abp.services.app.leadService;
        var _rfqService = abp.services.app.rFQService;
        var _quotationService = abp.services.app.quotationService;
        var _deliveryReceiptService = abp.services.app.deliveryReceiptService;
        var _salesInvoiceService = abp.services.app.salesInvoiceService;

        var _$itemsTable = $('#ItemsTable');

        //$(document).ready(function () {
        //    $('#ItemsTable').DataTable({
        //        scrollY: 200,
        //        scrollX: true,
        //    });
        //});

        $('#btnsearch').click(function (e) {
            e.preventDefault();

            var table = $('#ItemsTable').DataTable();table.clear().draw();
            getdashitems();
        });

        getdashitems();

        var dataTable = _$itemsTable.DataTable({
            //scrollCollapse: true,
            responsive: false,
            paging: true,
            "bInfo": true,
            searching: false,
            columnDefs: [{
                "visible": false,
                targets: [0, 3, 4, 9, 13, 17, 21, 25]
            },
            {
                orderable: true,
                targets: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            },
            {
                className: 'text-center'
                //targets: [2]
            }
            ]
        });


        function getdashitems() {
            if (abp.auth.isGranted('Pages.Dashboard.Traffic')) {
                var dfrom = $('#DateFrom').val();
                var dto = $('#DateTo').val();
                _salesOrderService.dashboard({ filter: dfrom + '|' + dto + '|' + "" + '|' + "" }).done(function (result) {
                    //console.log(result.items);
                    for (var i = 0; i < result.items.length; i++) {
                        var $lcode = result.items[i].lCode;
                        if (result.items[i].aLastModificationTime == "0001-01-01T00:00:00") {
                            var $LtransactionTime = result.items[i].transactionTime;
                        }
                        else {
                            var $LtransactionTime = result.items[i].aLastModificationTime;
                        }
                        var $LName = result.items[i].lName;
                        var $LProject = result.items[i].lProject;
                        var $LStatus = result.items[i].lStatus

                        var $rCode = result.items[i].rCode;
                        if (result.items[i].bLastModificationTime == "0001-01-01T00:00:00") {
                            var $rTime = result.items[i].rTime;
                        }
                        else {
                            var $rTime = result.items[i].bLastModificationTime;
                        }
                        var $rStatus = result.items[i].rStatus;
                        var $rLeadId = result.items[i].rLeadId;

                        var $qCode = result.items[i].qCode;
                        if (result.items[i].cLastModificationTime == "0001-01-01T00:00:00" || result.items[i].cLastModificationTime != "") {

                            var $qTime = result.items[i].qTime;
                        }
                        else {
                            var $qTime = result.items[i].cLastModificationTime;
                        }
                        var $qStatus = result.items[i].qStatus;
                        var $qReqId = result.items[i].qReqId;

                        var $sCode = result.items[i].sCode;
                        if (result.items[i].dLastModificationTime == "0001-01-01T00:00:00") {
                            var $sTime = result.items[i].sTime;
                        }
                        else {
                            var $sTime = result.items[i].dLastModificationTime;
                        }
                        var $sTatus = result.items[i].sStatus;
                        //console.log(result.items[i].sStatus);
                        var $sQid = result.items[i].sQid;

                        var $dCode = result.items[i].dCode;
                        var $sCode = result.items[i].sCode;
                        if (result.items[i].dLastModificationTime == "0001-01-01T00:00:00") {
                            var $dTime = result.items[i].dTime;
                        }
                        else {
                            var $dTime = result.items[i].eLastModificationTime;
                        }
                        var $dStatue = result.items[i].dStatue;
                        var $dSid = result.items[i].dSid;

                        var $iCode = result.items[i].iCode;
                        if (result.items[i].dLastModificationTime == "0001-01-01T00:00:00") {
                            var $iTime = result.items[i].iTime;
                        }
                        else {
                            var $iTime = result.items[i].fLastModificationTime;
                        }
                        var $iStatus = result.items[i].iStatus;
                        var $iSid = result.items[i].iSid;


                        if ($LtransactionTime == "0001-01-01T00:00:00") {
                            var LtransactionTime2 = "";
                        }
                        else {
                            var dt = new Date($LtransactionTime);
                            var LtransactionTime2 = getFormattedDate(dt);
                        }

                        if ($rTime == "0001-01-01T00:00:00") {
                            var Rtime2 = "";
                        }
                        else {
                            var dt = new Date($rTime);
                            var Rtime2 = getFormattedDate(dt);
                        }

                        if ($qTime == "0001-01-01T00:00:00") {
                            var Qtime2 = "";
                        }
                        else {
                            var dt = new Date($qTime);
                            var Qtime2 = getFormattedDate(dt);
                        }

                        if ($sTime == "0001-01-01T00:00:00") {
                            var Stime2 = "";
                        }
                        else {
                            var dt = new Date($sTime);
                            var Stime2 = getFormattedDate(dt);
                        }

                        if ($dTime == "0001-01-01T00:00:00") {
                            var Dtime2 = "";
                        }
                        else {
                            var dt = new Date($dTime);
                            var Dtime2 = getFormattedDate(dt);
                        }

                        if ($iTime == "0001-01-01T00:00:00") {
                            var Itime2 = "";
                        }
                        else {
                            var dt = new Date($iTime);
                            var Itime2 = getFormattedDate(dt);
                        }

                        var soidatacount = dataTable.rows().count();
                        var soiitemno = soidatacount + 1;

                        dataTable.row.add([soiitemno,
                            //'<a href="#" class="btn-link">' + $soireference + '</a><br /><small><label class="text-muted">' + $soiproductname + '</label></small>',
                            //'<label class="text-muted">' + $soiquantity + '</label>&nbsp;<label class="text-muted">' + $soiunit + '</label>',
                            $lcode,
                            LtransactionTime2,
                            $LName,
                            $LProject,
                            $LStatus,

                            $rCode,
                            Rtime2,
                            $rStatus,
                            $rLeadId,

                            $qCode,
                            Qtime2,
                            $qStatus,
                            $qReqId,

                            $sCode,
                            Stime2,
                            $sTatus,
                            $sQid,

                            $dCode,
                            Dtime2,
                            $dStatue,
                            $dSid,

                            $iCode,
                            Itime2,
                            $iStatus,
                            $iSid
                            //'<a id="edit-item" class="edit-item" title="edit" href="#" data-toggle="modal" data-target="#ItemEditModal" data-itemno="' + soiitemno + '"  data-id="' + $soiproductid + '" data-unitid="' + $soiunitid + '" data-perdesc="' + $soiperdescription + '" data-qty="' + $soiquantity + '" data-price="' + soiprice + '" data-disc1="' + soidisc1 + '" data-disc2="' + soidisc2 + '" data-disc3="' + soidisc3 + '" data-dtype1="' + parseInt($soidtype1) + '" data-dtype2="' + parseInt($soidtype2) + '" data-dtype3="' + parseInt($soidtype3) + '" data-groupname="" data-reference="' + $soiproductcode + '" data-disctotal="' + soitotaldiscount + '"><i class="fa fa-edit"></i></a>&nbsp;<a id="delete-item" class="delete-item" title="delete" href="#" ><i class="fa fa-trash"></i></a>',
                            //$soiproductid, $soiperdescription, $soiquantity, $soiunitid, soidisc1, parseInt($soidtype1), soidisc2, parseInt($soidtype2), soidisc3, parseInt($soidtype3), $soireference, $soiid
                        ]).draw();
                    }
                });
            }
        }

        getLeadsForApproval();

        function getLeadsForApproval() {

            if (abp.auth.isGranted('CRM.Leads') && abp.auth.isGranted('CRM.Leads.Approve')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _leadService.getLeads({ filter: 'null|null|null|null|null|null|1|' + empid + '|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#leadcount').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getRFQForAssignment();

        function getRFQForAssignment() {
            if (abp.auth.isGranted('Pages.Rfq') && abp.auth.isGranted('Pages.Rfq.Assign')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _rfqService.getRFQs({ filter: 'null|null|null|null|2|null|' + empid + '|null', forExport : true })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            var toassign = 0;
                            for (var i = 0; i < res.items.length; i++) {
                                //console.log(res.items[i]);
                                if (res.items[i].astatus === 0 && res.items[i].assignedid === 0) {
                                    toassign++;
                                }
                            }
                            $('#arfqcount').html(toassign);
                        }
                    });
            }
        }

        getRFQForRevision();

        function getRFQForRevision() {
            if (abp.auth.isGranted('Pages.Rfq') && abp.auth.isGranted('Pages.Rfq.Edit')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _rfqService.getRFQs({ filter: 'null|null|null|null|3|null|' + empid + '|null', forExport: true })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#revrfqcount').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getRFQAssigned();

        function getRFQAssigned(){
            if (abp.auth.isGranted('Pages.Rfq') && abp.auth.isGranted('Pages.Quotations.Create')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _rfqService.getRFQsforQuotation({ filter: 'rfq|' + empid })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#rfqtoquote').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getQuotationSubmitted();

        function getQuotationSubmitted() {
            if (abp.auth.isGranted('Pages.Quotations') && abp.auth.isGranted('Pages.Quotations.ForOrder')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _quotationService.getQuotations({ filter: 'null|null|2|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#subquote').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getQuotationForRevision();

        function getQuotationForRevision() {
            if (abp.auth.isGranted('Pages.Quotations') && abp.auth.isGranted('Pages.Quotations.Edit')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _quotationService.getQuotations({ filter: 'null|null|3|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#revquote').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getQuotationForOrder();

        function getQuotationForOrder() {
            if (abp.auth.isGranted('Pages.Quotations') && abp.auth.isGranted('Pages.Sales.Orders.Create')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _quotationService.getQuotations({ filter: 'null|null|6|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#quotetoorder').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getOrderSubmitted();

        function getOrderSubmitted() {
            if (abp.auth.isGranted('Pages.Sales.Orders') && abp.auth.isGranted('Pages.Sales.Orders.ForDelivery')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _salesOrderService.getSalesOrders({ filter: 'null|null|2|null|null|null|null|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#ordersub').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getOrderForDelivery();

        function getOrderForDelivery() {
            if (abp.auth.isGranted('Pages.Sales.Orders') && abp.auth.isGranted('Pages.Delivery.Receipt.Create')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _salesOrderService.getSalesOrders({ filter: 'null|null|3|null|null|null|null|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#orderdel').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getDeliveryOpen();

        function getDeliveryOpen(){
            if (abp.auth.isGranted('Pages.Delivery.Receipt') && abp.auth.isGranted('Pages.Delivery.Receipt.Edit')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _deliveryReceiptService.getDeliveryReceipts({ filter: 'null|null|1|null|null|null' })
                    .done(function (res) {
                        //console.log(res.items);
                        if (res.items.length > 0) {
                            $('#delopen').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getOrderDelivered();

        function getOrderDelivered() {
            if (abp.auth.isGranted('Pages.Sales.Orders') && abp.auth.isGranted('Pages.Sales.Create')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _salesOrderService.getSalesOrders({ filter: 'null|null|4|null|null|null|null|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#ordertosi').html(res.items[0].totalRows);
                        }
                    });
            }
        }

        getInvoiceUnpaid();

        function getInvoiceUnpaid() {
            
            if (abp.auth.isGranted('Pages.Sales.Orders') && abp.auth.isGranted('Pages.Collections.Create')) {
                var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                //    console.log(empid);
                _salesInvoiceService.getSalesInvoices({ filter: 'null|null|2|null|null' })
                    .done(function (res) {
                        if (res.items.length > 0) {
                            $('#siunpaid').html(res.items[0].totalRows);
                        }
                    });
            }
        }
    });

});

function showMessage() {
    var msg = $("#hfMessage").val();
    var ttl = $("#hfMessageTitle").val();
    console.log(msg + " :)");
    console.log(ttl + " :(");
    if (msg.trim().length > 0 && ttl.trim().length > 0) {
        console.log(msg.trim().length);
        console.log(ttl.trim().length);
        console.log(msg.trim().length > 0);
        console.log(ttl.trim().length > 0);
        abp.message.info(msg, ttl);
    }
}

var realtime = 'on';
function initRealTimeChart() {
    //Real time ==========================================================================================
    var plot = $.plot('#real_time_chart', [getRandomData()], {
        series: {
            shadowSize: 0,
            color: 'rgb(0, 188, 212)'
        },
        grid: {
            borderColor: '#f3f3f3',
            borderWidth: 1,
            tickColor: '#f3f3f3'
        },
        lines: {
            fill: true
        },
        yaxis: {
            min: 0,
            max: 100
        },
        xaxis: {
            min: 0,
            max: 100
        }
    });

    function updateRealTime() {
        plot.setData([getRandomData()]);
        plot.draw();

        var timeout;
        if (realtime === 'on') {
            timeout = setTimeout(updateRealTime, 320);
        } else {
            clearTimeout(timeout);
        }
    }

    updateRealTime();

    $('#realtime').on('change', function () {
        realtime = this.checked ? 'on' : 'off';
        updateRealTime();
    });
    //====================================================================================================
}

function initSparkline() {
    $(".sparkline").each(function () {
        var $this = $(this);
        $this.sparkline('html', $this.data());
    });
}

function initDonutChart() {
    Morris.Donut({
        element: 'donut_chart',
        data: [{
                label: 'Chrome',
                value: 37
            }, {
                label: 'Firefox',
                value: 30
            }, {
                label: 'Safari',
                value: 18
            }, {
                label: 'Opera',
                value: 12
            },
            {
                label: 'Other',
                value: 3
            }],
        colors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)', 'rgb(96, 125, 139)'],
        formatter: function (y) {
            return y + '%'
        }
    });
}

var data = [], totalPoints = 110;
function getRandomData() {
    if (data.length > 0) data = data.slice(1);

    while (data.length < totalPoints) {
        var prev = data.length > 0 ? data[data.length - 1] : 50, y = prev + Math.random() * 10 - 5;
        if (y < 0) { y = 0; } else if (y > 100) { y = 100; }

        data.push(y);
    }

    var res = [];
    for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]]);
    }

    return res;
}