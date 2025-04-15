
(function () {
    $(function () {

        var _$table = $('#PaymentTermTable');
        var _service = abp.services.app.commonService;

        var _$formCreate = $('form[name=PaymentTermCreateForm]');
        var _$formEdit = $('form[name=PaymentTermEditForm]');
        var _$modalCreate = $('#PaymentTermCreateModal');
        var _$modalEdit = $('#PaymentTermEditModal');

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getPaymentTerms
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
                    data: "name"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "noOfDays"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: { isAdvance: "isAdvance" },
                    "render": function (data) {
                        var ret = "No";
                        if (data.isAdvance) {
                            ret = "Yes";
                        }
                        return ret;
                    }
                },
                {
                    orderable: false,
                    targets: 4,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-taxttpye" title="edit" href="#" class="edit-taxttpye" data-taxttpye-id="' + data.id + '" data-toggle="modal" data-target="#TaxTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-company" title="delete" href="#" class="delete-taxttpye" data-taxttpye-id="' + data.id + '" data-taxttpye-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-paymentterms" title="edit" href="#" class="edit-paymentterms" data-paymentterms-id="' + data.id + '" data-toggle="modal" data-target="#PaymentTermEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-paymentterms" title="delete" href="#" class="delete-paymentterms" data-paymentterms-id="' + data.id + '" data-paymentterms-code="' + data.code + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.PaymentTerm.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Pages.PaymentTerm.Delete")) {
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
        $('#PaymentTermTable').on('click', 'a.edit-paymentterms', function (e) {
            var paymenttermsId = $(this).attr("data-paymentterms-id");
            $('#Id').val(paymenttermsId);
            getPaymentTerms(paymenttermsId);
        });

        // Delete record
        _$table.on('click', 'a.delete-paymentterms', function (e) {
            var id = $(this).attr("data-paymentterms-id");
            //var name = $(this).attr("data-company-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeletePaymentTermsConfirmation', 'ezinvmvc'), ''),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deletePaymentTerm({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });

        function getPaymentTerms(id) {
            _service.getPaymentTerm({ id: id }).done(function (result) {
                $('#Ename').val(result.name);
                $('#Edays').val(result.noOfDays);
                $('#Eadv').prop('checked', result.isAdvance);
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
                'New Payment Term will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalCreate);
                        _service.createPaymentTerm(create).done(function () {
                            abp.notify.success('Tax Type created', 'Success');
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
            console.log(formdata);
            var viewData = {
                    "id": formdata.Id,
                    "Name": formdata.Ename,
                    "noOfDays": formdata.Edays,
                    "isAdvance": formdata.Eadv
            };
            disabled.attr('disabled', 'disabled');

            console.log(viewData);
            abp.message.confirm(
                'Payment Term will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _service.updatePaymentTerm(viewData).done(function () {
                            abp.notify.success('Payment Term has been successfully updated', 'Success');
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
