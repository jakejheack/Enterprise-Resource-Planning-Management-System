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

    var _productService = abp.services.app.productService;
    var _categoryService = abp.services.app.categoryService;
    var _brandService = abp.services.app.brandService;
    var _unitService = abp.services.app.unitService;
    var _costingTypeService = abp.services.app.costingTypeService;
    var _vendorService = abp.services.app.vendorService;
    var _accountService = abp.services.app.accountService;

    var _$form = $('form[name=ProductForm]');


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

    // Income Account Autocomplete
    var getAccounts2 = function (request, response) {
        _accountService.getAccountByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getAccount2() {
        var $Incomeaccountid = $('#IncomeAccountId').val();
        _accountService.getAccount({ id: $Incomeaccountid }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectAccount2 = function (event, ui) {
        event.preventDefault();
        $("#IncomeAccountId").val(ui.item ? ui.item.value : "");
        $("#IncomeAccount").val(ui.item ? ui.item.label : "");

        getAccount2();
        return false;
    };
    var focusAccount2 = function (event, ui) {
        event.preventDefault();
        $("#IncomeAccountId").val(ui.item.value);
        $("#IncomeAccount").val(ui.item.label);
    };
    var changeAccount2 = function (event, ui) {
        event.preventDefault();
        $("#IncomeAccountId").val(ui.item ? ui.item.value : "");
        $("#IncomeAccount").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#IncomeAccount").autocomplete({
        source: getAccounts2,
        select: selectAccount2,
        focus: focusAccount2,
        minLength: 2,
        delay: 100,
        change: changeAccount2
    });
    // Income Account Autocomplete

    // Inventory Account Autocomplete
    var getAccounts3 = function (request, response) {
        _accountService.getAccountByName({ filter: request.term }).done(function (result) {
            response($.map(result.items, function (el) {
                return {
                    label: el.name,
                    value: el.id
                };
            }));
        });
    };
    function getAccount3() {
        var $Inventoryaccountid = $('#InventoryAccountId').val();
        _accountService.getAccount({ id: $Inventoryaccountid }).done(function (result) {
            //$('#Telno').val(result[0].telNo);
            //$('#Phone').val(result[0].mobileNo);
            //$('#Taxno').val(result[0].taxNo);
            //$('#Email').val(result[0].email);
            //$('#Address').val(result[0].completeAddress);
        });
    };
    var selectAccount3 = function (event, ui) {
        event.preventDefault();
        $("#InventoryAccountId").val(ui.item ? ui.item.value : "");
        $("#InventoryAccount").val(ui.item ? ui.item.label : "");

        getAccount3();
        return false;
    };
    var focusAccount3 = function (event, ui) {
        event.preventDefault();
        $("#InventoryAccountId").val(ui.item.value);
        $("#InventoryAccount").val(ui.item.label);
    };
    var changeAccount3 = function (event, ui) {
        event.preventDefault();
        $("#InventoryAccountId").val(ui.item ? ui.item.value : "");
        $("#InventoryAccount").val(ui.item ? ui.item.label : "");
        //if (ui.item === null) {
        //    $('#Telno').val('');
        //    $('#Phone').val('');
        //    $('#Taxno').val('');
        //    $('#Email').val('');
        //    $('#Address').val('');
        //}
    };
    $("#InventoryAccount").autocomplete({
        source: getAccounts3,
        select: selectAccount3,
        focus: focusAccount3,
        minLength: 2,
        delay: 100,
        change: changeAccount3
    });
    // Inventory Account Autocomplete

    function getcategories() {
        var selectoptions = $('#lbCategories');
        selectoptions.empty();
        _categoryService.getCategories().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            selectoptions.selectpicker('refresh');
        });
    }
    function getbrands() {
        var selectoptions = $('#lbBrands');
        selectoptions.empty();
        _brandService.getBrands().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            selectoptions.selectpicker('refresh');
        });
    }
    function getunits() {
        var priceunits = $('#UnitId');
        priceunits.empty();
        _unitService.getUnits().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                priceunits.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            priceunits.selectpicker('refresh');
        });
    }
    function getcostingtypes() {
        var selectoptions = $('#CostingTypeId');
        selectoptions.empty();
        _costingTypeService.getCostingTypes().done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            selectoptions.selectpicker('refresh');
        });
    }
    function getvendors() {
        var selectoptions = $('#Vendors');
        selectoptions.empty();
        _vendorService.getVendors({ filter: ''}).done(function (result) {
            for (var i = 0; i < result.items.length; i++) {
                selectoptions.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
            }
            selectoptions.selectpicker('refresh');
        });
    }
    getcategories();
    getbrands();
    getunits();
    getcostingtypes();
    getvendors();

    function saveProduct() {
        if (!_$form.valid()) {
            abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
            return;
        }
        var formData = new FormData();
        formData.append('file', $('#fileinput')[0].files[0]);

        var product = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
        if ($('#fileinput')[0].files.length !== 0)
        {
            product.imageName = $('#fileinput')[0].files[0].name;
        }

        var pattern = /^[ A-Za-z0-9_.,()-]*$/;
        
        if (!pattern.test(product.imageName)) {
            $('#fileinput').val(null);
            $('#fileinputlabel').html('Choose file...');
            //$(this).next('.custom-file-label').addClass("selected").html(fileName);
            abp.message.warn("Only A-Z a-z 0-9 ( ) , _ - characters are allowed for file name.");
            return;
        }

        var $c = product.Code;

        abp.message.confirm(
            'New product will be added.',
            'Are you sure?',
            function (isConfirmed) {
                if (isConfirmed) {
                    abp.ui.setBusy(_$form);
                    _productService.createProduct(product).done(function (result) {
                        $.ajax({
                            url: abp.appPath + 'Products/UploadFile?code=' + result,
                            type: 'POST',
                            data: formData,
                            processData: false, 
                            contentType: false,  
                            success: function () {
                                //$("#ProductForm")[0].reset();
                                //$("#fileinput").val('');
                                //$("#filepreview").attr("src", "../images/default.png");
                                //$("#fileinputlabel").html("Choose file...");
                                abp.message.success('New product added successfully', 'Success');
                                window.location.href = abp.appPath + 'Products/Edit?id=' + result;

                            },
                            error: function (e) { }
                        });
                    }).always(function () {
                        abp.ui.clearBusy(_$form);
                    });
                }
            }
        );
    }

    //Handle save button click
    $('#SaveProductButton').click(function (e) {
        e.preventDefault();
        saveProduct();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            saveProduct();
        }
    });

    $('#CreateCategoryButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Products/CreateCategoryModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#CategoryCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    $('#CreateBrandButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Products/CreateBrandModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                $('#BrandCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    $('#CreateUnitButton').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: abp.appPath + 'Products/CreateUnitModal',
            type: 'POST',
            contentType: 'application/html',
            success: function (content) {
                getunits();
                $('#UnitCreateModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

})(jQuery);




