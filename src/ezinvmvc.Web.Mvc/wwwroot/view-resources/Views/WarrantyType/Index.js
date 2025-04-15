
(function () {
    $(function () {

        var _$table = $('#WarrantyTypeTable');
        var _service = abp.services.app.commonService;
        var _accountService = abp.services.app.accountService;

        var _$formCreate = $('form[name=WarrantyTypeCreateForm]');
        var _$formEdit = $('form[name=WarrantyTypeEditForm]');
        var _$modalCreate = $('#WarrantyTypeCreateModal');
        var _$modalEdit = $('#WarrantyTypeEditModal');

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getWarrantyTypes
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
                    data: "code"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "name"
                },
                {
                    orderable: false,
                    targets: 3,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-warrantyttpye" title="edit" href="#" class="edit-warrantyttpye" data-warrantyttpye-id="' + data.id + '" data-toggle="modal" data-target="#WarrantyTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-company" title="delete" href="#" class="delete-warrantyttpye" data-warrantyttpye-id="' + data.id + '" data-warrantyttpye-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-warrantytype" title="edit" href="#" class="edit-warrantytype" data-warrantytype-id="' + data.id + '" data-toggle="modal" data-target="#WarrantyTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-warrantytype" title="delete" href="#" class="delete-warrantytype" data-warrantytype-id="' + data.id + '" data-warrantytype-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.WarrantyType.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Pages.WarrantyType.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });



        function getAll() {
            dataTable.ajax.reload();
        }
        getAll();

        // Edit record
        $('#WarrantyTypeTable').on('click', 'a.edit-warrantytype', function (e) {
            var warrantytypeId = $(this).attr("data-warrantytype-id");
            $('#Id').val(warrantytypeId);
            getWarrantyType(warrantytypeId);
        });

        // Delete record
        _$table.on('click', 'a.delete-warrantytype', function (e) {
            var id = $(this).attr("data-warrantytype-id");
            //var name = $(this).attr("data-company-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteWarrantyTypeConfirmation', 'ezinvmvc'), ''),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deleteWarrantytType({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });

        function getWarrantyType(id) {
            _service.getWarrantyType({ id: id }).done(function (result) {
                $('#Ecode').val(result.code);
                $('#Ename').val(result.name);
            });
        };

        _$formCreate.find('button[type="submit"]').click(function (e) {
            e.preventDefault();
           
            if (!_$formCreate.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var create = _$formCreate.serializeFormToObject(); //serializeFormToObject is defined in main.js

            abp.message.confirm(
                'New Warranty Type will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalCreate);
                        _service.createWarrantyType(create).done(function () {
                            abp.notify.success('Warranty Type created', 'Success');
                            _$modalCreate.modal('hide');
                            getAll();
                        }).always(function () {
                            abp.ui.clearBusy(_$modalCreate);
                        });
                    }
                }
            );


        });

        function update() {
            if (!_$formEdit.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var disabled = _$formEdit.find(':input:disabled').removeAttr('disabled');
            var formdata = _$formEdit.serializeFormToObject();
           
            var viewData = {
                    "id": formdata.Id,
                    "code": formdata.Ecode,
                    "name": formdata.Ename
            };
            disabled.attr('disabled', 'disabled');

            abp.message.confirm(
                'New Warranty Type will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _service.updateWarrantyType(viewData).done(function () {
                            abp.notify.success('Warranty Type has been successfully updated', 'Success');
                            _$modalEdit.modal('hide');
                            getAll();
                        }).always(function () {
                            abp.ui.clearBusy(_$modalEdit);
                        });

                    }
                }
            );
        }

        $('#update').click(function (e) {
            e.preventDefault();
            update();
        });

    });
})();
