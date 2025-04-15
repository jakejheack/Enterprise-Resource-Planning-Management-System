function decimalOnly(txt) {
    if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46) {
        var txtbx = document.getElementById(txt);
        var amount = document.getElementById(txt).value;
        var present = 0;
        var count = 0;

        //if (amount.indexOf(".", present) || amount.indexOf(".", present + 1));
        //{}
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

(function ($) {

    var _$table = $('#ItemsTable');
    var _service = abp.services.app.journalEntryService;
    var _companyService = abp.services.app.companyService;

    var _$form = $('form[name=JournalEntryForm]');

    function getcompanies(id) {
        var companies = $('#Companies');
        companies.empty();
        _companyService.getCompanies().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                if (id === result.items[i].id) {
                    companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                    //getseriestype(result.items[i].id);
                }
                else {
                    companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
            }
            companies.selectpicker('refresh');
        });
    }


    var dataTable = _$table.DataTable({
        responsive: true,
        paging: false,
        "bInfo": false,
        searching: false,
        columnDefs: [{
            "visible": false,
            //targets: [6, 7, 8, 9, 10, 11, 12, 13]
        },
        {
            render: $.fn.dataTable.render.number(',', '.', 2),
            className: 'text-right',
            targets: [3, 4]
        },
        {
            orderable: false,
            targets: [0, 1, 2, 3, 4]
        },
        //MARC --WALA KA NA PRICES
        //{
        //    render: $.fn.dataTable.render.number(',', '.', 2),
        //    className: 'text-right',
        //    targets: [3, 4, 5]
        //},
        {
            //className: 'text-center',
            //targets: [2]
        }
        ]
    });

    function getJournalEntry() {
        var $id = $('#Id').val();
        //abp.ui.setBusy(_$form);
        _service.getJournalEntry({ id: $id }).done(function (result) {
            //$('#Id').val(result.id);
            //$('#Prefix').val(result.prefix);
            $('#EntryType').val(result.journalType);
            $('#SeriesTypeId').val(result.code);
            var rtransactiontime = new Date(result.transactionTime);
            var tt = getFormattedDate(rtransactiontime);
            $('#TransactionTime').val(tt);
            $('#ClientName').val(result.company);
            $('#Notes').val(result.notes);
            //$('#DebitTotal').val();
            //$('#CreditTotal').val();

            var debittotal = result.totaldebit;
            var credittotal = result.totaldebit;
            $('#DebitTotal').val(currencyFormat(debittotal));
            $('#CreditTotal').val(currencyFormat(credittotal));

            $('#StatusBadge').text(result.status);

            //alert(result.statusid);

            switch (result.statusId) {
                case 1:
                    $('#StatusBadge').addClass('badge badge-secondary');
                    break;
                case 2:
                    $('#StatusBadge').addClass('badge badge-success');
                   
                    break;
                case 3:
                    $('#StatusBadge').addClass('badge badge-danger');
                   
                    break;
                case 4:
                    $('#StatusBadge').addClass('badge badge-primary');
                    break;
                default:
                    $('#StatusBadge').addClass('badge badge-secondary');
            }

            getJournalEntryItem($id);
            getcompanies(result.companyId);


        });


    };

    function getJournalEntryItem(id) {
        _$table.DataTable().rows().remove().draw(false);
        _service.getJournalEntryItemByParentId({ id: id }).done(function (result) {

            for (var i = 0; i < result.items.length; i++) {
                var $accountName = result.items[i].accountName;
                var $partyName = result.items[i].name;
                var debit = result.items[i].debit;
                var credit = result.items[i].credit;
               
                var newdebit = 0;
                var newcredit = 0;

                if (debit !== "") {
                    newdebit = parseFloat(debit);
                }
                if (credit !== "") {
                    newcredit = parseFloat(credit);
                }

                var datacount = dataTable.rows().count();
                var itemno = datacount + 1;
              
                dataTable.row.add([itemno,
                    '<small><label class="text-muted">' + $accountName + '</label></small>',
                    '<small><label class="text-muted">' + $partyName + '</label></small>',
                    newdebit,
                    newcredit
                ]).draw();

            }
        });
    };
    getJournalEntry();

   

})(jQuery);




