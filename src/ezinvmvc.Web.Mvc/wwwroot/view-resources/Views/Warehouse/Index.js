// Warehouse Index

(function () {
    $(function () {
        var _warehouseService = abp.services.app.warehouseService;
        var _$warehouseTable = $('#WarehouseTable');
        var _$modal = $('#WarehouseCreateModal');
        var _$form = _$modal.find('form');

        _$form.validate({
        });

     
        // Edit record
        $('#WarehouseTable').on('click', 'a.edit-warehouse', function (e) {
            var warehouseId = $(this).attr("data-warehouse-id");
            e.preventDefault();
            $.ajax({
                url: abp.appPath + 'Warehouse/Edit?warehouseId=' + warehouseId,
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    $('#WarehouseEditModal div.modal-content').html(content);
                },
                error: function (e) { }
            });
        });

        // Delete record
        $('#WarehouseTable').on('click', 'a.delete-warehouse', function (e) {
            var warehouseId = $(this).attr("data-warehouse-id");
            var warehouseName = $(this).attr("data-warehouse-name");
            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('AreYouSureWantToDelete', 'ezinvmvc'), warehouseName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _warehouseService.deleteWarehouse({
                            id: warehouseId
                        }).done(function () {
                            getWarehouses();
                        });
                    }
                }
            );
        });

        _$form.find('button[type="submit"]').click(function (e) {
            e.preventDefault();
            if ($('[name="IsMain"]:checked').length > 0)
                $('[name="IsMain"]:hidden').val(true);
            if ($('[name="IsTemp"]checked').length > 0) {
                $('[name="IsMain"]:hidden').val(true);
            }
            else {
                $('[name="IsMain"]:hidden').val(false);
            }
            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var warehouse = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

            abp.ui.setBusy(_$modal);
            _warehouseService.createWarehouse(warehouse).done(function () {
                _$modal.modal('hide');
                getWarehouses();
            }).always(function () {
                abp.ui.clearBusy(_$modal);
            });
        });

        _$modal.on('shown.bs.modal', function () {
            _$modal.find('input:not([type=hidden]):first').focus();
        });

        var dataTable = _$warehouseTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _warehouseService.getWarehouses
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
                    data: "abbr"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "name"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "isMain"
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-warehouse" title="edit" href="#" class="edit-warehouse" data-warehouse-id="' + data.id + '" data-toggle="modal" data-target="#WarehouseEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-warehouse" title="delete" href="#" class="delete-warehouse" data-warehouse-id="' + data.id + '" data-warehouse-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-warehouse" title="edit" href="#" class="edit-warehouse" data-warehouse-id="' + data.id + '" data-toggle="modal" data-target="#WarehouseEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-warehouse" title="delete" href="#" class="delete-warehouse" data-warehouse-id="' + data.id + '" data-warehouse-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.Warehouse.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.Warehouse.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });

        function getWarehouses() {
            dataTable.ajax.reload();
        }
    });
})();