
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
    readURL(this);
});//Image Upload


(function () {
    $(function () {

        var _$unitsTable = $('#UnitsTable');
        var _$priceTable = $('#PriceTable');

        var _productService = abp.services.app.productService;
        var _productPriceService = abp.services.app.productPriceService;
        var _pricingTypeService = abp.services.app.pricingTypeService;

        var _$form = $('form[name=ProductForm]');
        var $productid = $('#Id').val();

        function getproductunits() {
            var priceunits = $('#PriceUnits');
            priceunits.empty();
            _productService.getProductUnits({
                id: $productid
            }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    priceunits.append('<option value=' + result.items[i].unitId + '>' + result.items[i].unit + '</option>');
                }
                priceunits.selectpicker('refresh');
            });
        }

        function getpricingtype() {

            var pricingtypes = $('#PricingTypes');
            pricingtypes.empty();
            _pricingTypeService.getPricingTypes().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    pricingtypes.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                }
                pricingtypes.selectpicker('refresh');
            });
        }

        getproductunits();

        getpricingtype();


        var dataTableUnits = _$unitsTable.DataTable({
            paging: false,
            retrieve: true,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _productService.getProductUnits,
                inputFilter: function () {
                    //var $productid = $('#Id').val();
                    return {
                        id: $productid
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
                    orderable: false,
                    targets: 1,
                    data: "unit"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "conversion"
                },
                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { unitId: "unitId" },
                    "render": function (data) {
                        var $productunitid = parseInt($('#UnitId').val(), 10);
                        if (data.unitId === $productunitid) {
                            return '<i class="fa fa-star-o"></i>';
                        }
                        else {
                            return '';
                        }

                    }
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", unit: "unit", conversion: "conversion" },
                    "render": function (data) {
                        return '<a id="edit-productunit" title="edit" href="#" class="edit-productunit" data-productunit-id="' + data.id + '" data-toggle="modal" data-target="#ProductUnitEditModal" ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-productunit" title="delete" href="#" class="delete-productunit" data-productunit-id="' + data.id + '" data-productunit-name="' + data.unit + '" data-productunit-conversion="' + data.conversion + '"><i class="fa fa-trash"></i></a>';
                    }
                },
                {
                    targets: 5,
                    "visible": false,
                    "searchable": false,
                    data: "unitId"
                }
            ]
        });

        var dataTablePrice = _$priceTable.DataTable({
            paging: false,
            retrieve: true,
            serverSide: true,
            processing: true,
            searching: false,
            "bInfo": false,
            listAction: {
                ajaxFunction: _productPriceService.getProductPrices,
                inputFilter: function () {
                    //var $productid = $('#Id').val();
                    return {
                        productId: $productid, pricingTypeId: 0, unitId: 0
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
                    orderable: false,
                    targets: 1,
                    data: "pricingType"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "unit"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "unitPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2),
                    className: 'dt-body-right'
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", unit: "unit"},
                    "render": function (data) {
                        return '<a id="delete-productprice" title="delete" href="#" class="delete-productprice" data-productprice-id="' + data.id + '" data-productprice-name="' + data.unit + '"><i class="fa fa-trash"></i></a>';
                    }
                },
                {
                    targets: 5,
                    "visible": false,
                    "searchable": false,
                    data: "unitId"
                }
            ]
        });

        function saveProduct() {
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }
            var formData = new FormData();
            formData.append('file', $('#fileinput')[0].files[0]);


            var $c = $('#Code').val();
            var $oc = $('#OldCode').val();
            var $oimgn = $('#OldImageName').val();
            var product = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

            if ($('#fileinput')[0].files.length !== 0) {
                product.imageName = $('#fileinput')[0].files[0].name;
            }
            else {
                product.imageName = $oimgn;
            }
            abp.message.confirm(
                'New product will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _productService.updateProduct(product).done(function () {
                            $.ajax({
                                url: abp.appPath + 'Products/UpdateFile?code=' + $c + '&oldcode=' + $oc + '&oldimagename=' + $oimgn,
                                type: 'POST',
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.message.success('Product info updated', 'Success');
                                    location.reload(true);
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

        function saveProductUnitAssign() {
            //var $productid = $('#Id').val();
            var $unit = $("#Units option:selected").html();
            var $unitid = $('#Units').val();
            var $conversion = $('#Conversion').val();
            if ($conversion === '') {
                return;
            }
            if ($conversion <= 1)
            {
                abp.message.warn('Conversion must greater than 1', 'Warning');
                return;
            }
            var productunit = {
                ProductId: $productid,
                UnitId: $unitid,
                Conversion: $conversion, 
                Unit: $unit
            };
            abp.message.confirm(
                'New unit will be assign.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _productService.createProductUnit(productunit).done(function () {
                            abp.notify.success('New unit assigned successfully', 'Success');
                            getproductunits();
                            dataTableUnits.ajax.reload();
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        function saveProductPrice() {
            var $pricingtypeid = $('#PricingTypes').val();
            var $priceunitid = $('#PriceUnits').val();
            var $unitprice = $('#UnitPrice').val();
            var $unitname = $("#PriceUnits option:selected").html();
            var $pricingtype = $("#PricingTypes option:selected").html();


            if ($unitprice === '') {
                return;
            }
            if ($unitprice <= 0) {
                abp.message.warn('Conversion must greater than 0', 'Warning');
                return;
            }
            var productprice = {
                ProductId: $productid,
                UnitId: $priceunitid,
                UnitPrice: $unitprice,
                PricingTypeId: $pricingtypeid,
                Unit: $unitname,
                PricingType: $pricingtype
            };
            abp.message.confirm(
                'New price will be add.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _productPriceService.createProductPrice(productprice).done(function () {
                            abp.notify.success('New unit assigned successfully', 'Success');
                            $('#UnitPrice').val('');
                            dataTablePrice.ajax.reload();
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                        });
                    }
                }
            );
        }

        // Edit product unit record
        _$unitsTable.on('click', 'a.edit-productunit', function (e) {
            var id = $(this).attr("data-productunit-id");
            var defaultunitid = $('#UnitId').val();

            e.preventDefault();
            $.ajax({
                url: abp.appPath + 'Products/EditProductUnitModal?id=' + id + '&defaultunitid=' + defaultunitid,
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    $('#ProductUnitEditModal div.modal-content').html(content);
                    $('select').selectpicker();
                },
                error: function (e) { }
            });
        });

        // Delete product unit record
        _$unitsTable.on('click', 'a.delete-productunit', function (e) {
            e.preventDefault();
            var $defaultUnitId = $('#Units').val();
            var $productUnitId = $(this).attr("data-productunit-id");
            var $unitName = $(this).attr("data-productunit-name");
            var $unitConversion = $(this).attr("data-productunit-conversion");

            if ($defaultUnitId === $productUnitId) {
                abp.message.warn('Cannot delete default unit, please update first.', 'Warning');
                return;
            }

            if ($unitConversion <= 1) {
                abp.message.warn('Cannot delete base unit, please update first.', 'Warning');
                return;
            }

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteProductUnitConfirmation', 'ezinvmvc'), $unitName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _productService.deleteProductUnit({
                            id: $productUnitId
                        }).done(function () {
                            abp.notify.warn('Unit assigned has been deleted', 'Warning');
                            dataTableUnits.ajax.reload();
                        });
                    }
                }
            );
        });

        // Delete product price record
        _$priceTable.on('click', 'a.delete-productprice', function (e) {
            e.preventDefault();
            var $productpriceid = $(this).attr("data-productprice-id");
            var $productpriceunit = $(this).attr("data-productprice-name");

            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteProductPriceConfirmation', 'ezinvmvc'), $productpriceunit),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _productPriceService.deleteProductPrice({
                            id: $productpriceid 
                        }).done(function () {
                            abp.notify.warn('Unit price has been deleted', 'Warning');
                            dataTablePrice.ajax.reload();
                        });
                    }
                }
            );
        });
        //Handle save button click
        $('#SaveProductButton').click(function (e) {
            e.preventDefault();
            saveProduct();
        });
        //Handle assign unit button click
        $('#AssignUnitButton').click(function (e) {
            e.preventDefault();
            saveProductUnitAssign();
        });
        //Handle add unit price button click
        $('#AddPriceButton').click(function (e) {
            e.preventDefault();
            saveProductPrice();
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
                    $('#UnitCreateModal div.modal-content').html(content);
                },
                error: function (e) { }
            });
        });

        $('#CreatePricingTypeButton').click(function (e) {
            e.preventDefault();
            $.ajax({
                url: abp.appPath + 'Products/CreatePricingTypeModal',
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    $('#PricingTypeCreateModal div.modal-content').html(content);
                },
                error: function (e) { }
            });
        });
    });
})();


