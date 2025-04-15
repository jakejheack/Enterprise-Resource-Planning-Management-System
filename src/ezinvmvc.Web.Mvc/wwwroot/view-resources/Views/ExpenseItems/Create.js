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

function countChar(val) {
    var len = val.value.length;
    if (len >= 2001) {
        val.value = val.value.substring(0, 2000);
    } else {
        $('#charNum').text(len + '/2000');
    }
}

//Image Upload

$('.custom-file-input').on('change', function () {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(fileName);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#filepreview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#fileinput").change(function () {
    var pattern = /^[ A-Za-z0-9_.,()-]*$/;
    var imageName = $('#fileinput')[0].files[0].name;
    if (!pattern.test(imageName)) {
        $('#fileinput').val(null);
        $('#fileinputlabel').html('Choose file...');
        //$(this).next('.custom-file-label').addClass("selected").html(fileName);
        abp.message.warn("Only A-Z a-z 0-9 ( ) , _ - characters are allowed for file name.");
        return;
    }
    else {
        readURL(this);
    }
});

//Save Button
(function ($) {

    var _expenseItemService = abp.services.app.expenseItemService;
    var _accountService = abp.services.app.accountService;

    var _$form = $('form[name=ExpenseItemForm]');


    // ExpenseAccount Autocomplete
    var getAccounts1 = function (request, response) {
        _accountService.getAccountByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getAccount1() {
        var $Expenseaccountid = $('#ExpenseAccountId').val();
        _accountService.getAccount({ id: $Expenseaccountid }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectAccount1 = function (event, ui) {
        event.preventDefault();
        $("#ExpenseAccountId").val(ui.item ? ui.item.value : "");
        $("#ExpenseAccount").val(ui.item ? ui.item.label : "");

        getAccount1();
        return false;
    };
    var focusAccount1 = function (event, ui) {
        event.preventDefault();
        $("#ExpenseAccountId").val(ui.item.value);
        $("#ExpenseAccount").val(ui.item.label);
    };
    var changeAccount1 = function (event, ui) {
        event.preventDefault();
        $("#ExpenseAccountId").val(ui.item ? ui.item.value : "");
        $("#ExpenseAccount").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#ExpenseAccount").autocomplete({
        source: getAccounts1,
        select: selectAccount1,
        focus: focusAccount1,
        minLength: 2,
        delay: 100,
        change: changeAccount1
    });
    // ExpenseAccount Autocomplete

    function saveExpenseItem() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var formData = new FormData();

        var expenseItem = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

        var actid = expenseItem.ExpenseAccountId;
        if (actid.trim().length <= 0) {
            expenseItem.ExpenseAccountId = 0;
        }

        var $c = expenseItem.Code;

        abp.message.confirm(
            'New Expense Item will be added.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    _expenseItemService.createExpenseItem(expenseItem).done(function (result) {
                        abp.message.success('New Expense Item added successfully', 'Success');
                        window.location.href = abp.appPath + 'ExpenseItems/Edit?id=' + result;

                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });
                }
            }
        );
    }

    //Handle save button click
    $('#SaveExpenseItemButton').click(function (e) {
        e.preventDefault();
        saveExpenseItem();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            saveExpenseItem();
        }
    });

})(jQuery);




