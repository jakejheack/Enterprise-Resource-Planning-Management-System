
(function () {
    $(function () {

        var _$table = $('#SeriesTypeTable');
        var _service = abp.services.app.commonService;
        var _accountService = abp.services.app.accountService;

        var _$formCreate = $('form[name=SeriesTypeCreateForm]');
        var _$formEdit = $('form[name=SeriesTypeEditForm]');
        var _$modalCreate = $('#SeriesTypeCreateModal');
        var _$modalEdit = $('#SeriesTypeEditModal');


        //Account Autocomplete
        var getAccountsCash = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountCash() {
            var $accountidCash = $('#LiabilityAccountId').val();
            _accountService.getAccount({ id: $accountidCash }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Seriesno').val(result[0].seriesNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountCash = function (event, ui) {
            event.preventDefault();
            $("#LiabilityAccountId").val(ui.item ? ui.item.value : "");
            $("#LiabilityAccount").val(ui.item ? ui.item.label : "");

            getAccountCash();
            return false;
        };
        var focusAccountCash = function (event, ui) {
            event.preventDefault();
            $("#LiabilityAccountId").val(ui.item.value);
            $("#LiabilityAccount").val(ui.item.label);
        };
        var changeAccountCash = function (event, ui) {
            event.preventDefault();
            $("#LiabilityAccountId").val(ui.item ? ui.item.value : "");
            $("#LiabilityAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Seriesno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#LiabilityAccount").autocomplete({
            source: getAccountsCash,
            select: selectAccountCash,
            focus: focusAccountCash,
            minLength: 2,
            delay: 100,
            change: changeAccountCash
        });
        //Account Autocomplete

        //Account Autocomplete
        var getAccountsCashE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|0' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountCashE() {
            var $accountidCash = $('#EAccountId').val();
            _accountService.getAccount({ id: $accountidCash }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Seriesno').val(result[0].seriesNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#EAccountId").val(ui.item ? ui.item.value : "");
            $("#EAccount").val(ui.item ? ui.item.label : "");

            getAccountCashE();
            return false;
        };
        var focusAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#EAccountId").val(ui.item.value);
            $("#EAccount").val(ui.item.label);
        };
        var changeAccountCashE = function (event, ui) {
            event.preventDefault();
            $("#EAccountId").val(ui.item ? ui.item.value : "");
            $("#EAccount").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Seriesno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#EAccount").autocomplete({
            source: getAccountsCashE,
            select: selectAccountCashE,
            focus: focusAccountCashE,
            minLength: 2,
            delay: 100,
            change: changeAccountCashE
        });
        //Account Autocomplete

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getSeriesTypesFiltered,
                inputFilter: function () {
                    return {
                        id :0, transactionCode : 0, companyId: 0
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
                    data: "transactionName"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "prefix"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "lastSeries"
                },
                {
                    orderable: false,
                    targets: 4,
                    data: "padding"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "transactionId"
                },
                {
                    visible: false,
                    targets: 6,
                    data: "companyId"
                },
                {
                    orderable: false,
                    targets: 7,
                    class: "text-center",
                    data: { id: "id", transactionName: "transactionName" },
                    "render": function (data) {
                        //return '<a id="edit-seriesttpye" title="edit" href="#" class="edit-seriesttpye" data-seriesttpye-id="' + data.id + '" data-toggle="modal" data-target="#SeriesTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-company" title="delete" href="#" class="delete-seriesttpye" data-seriesttpye-id="' + data.id + '" data-seriesttpye-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-seriestype" title="edit" href="#" class="edit-seriestype" data-seriestype-id="' + data.id + '" data-seriestype-code="' + data.transactionName + '" data-toggle="modal" data-target="#SeriesTypeEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-seriestype" title="delete" href="#" class="delete-seriestype" data-seriestype-id="' + data.id + '" data-seriestype-code="' + data.transactionName + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Series.Type.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Pages.Series.Type.Delete")) {
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
        $('#SeriesTypeTable').on('click', 'a.edit-seriestype', function (e) {
            var seriestypeId = $(this).attr("data-seriestype-id");
            var transaction = $(this).attr("data-seriestype-code");
            $('#Id').val(seriestypeId);
            $('#ETransaction').val(transaction);
            getSeriesType(seriestypeId);
        });

        // Delete record
        _$table.on('click', 'a.delete-seriestype', function (e) {
            var id = $(this).attr("data-seriestype-id");
            //var name = $(this).attr("data-company-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteSeriesTypeConfirmation', 'ezinvmvc'), ''),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deleteSeriesType({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });

        function getSeriesType(id) {
            _service.getSeriesType({ id: id }).done(function (result) {
                $('#EPrefix').val(result.prefix);
                $('#ESeries').val(result.lastSeries);
                $('#EPadding').val(result.padding);
                //$('#ETransaction').val(result.transaction);
                $('#ETransactionId').val(result.transactionId);
                $('#ECompanyId').val(result.companyId);
                $('#EType').selectpicker('refresh');
                //getAccountLoad(result.liabilityAccountId);
            });
        };

        function getAccountLoad(accountid) {

            _accountService.getAccount({ id: accountid }).done(function (result) {
                $('#EAccount').val(result.name);
               
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
                'New Series Type will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalCreate);
                        _service.createSeriesType(create).done(function () {
                            abp.notify.success('Series Type created', 'Success');
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
                    "prefix": formdata.EPrefix,
                    "lastSeries": formdata.ESeries,
                    "padding": formdata.EPadding,
                    "transactionId": formdata.ETransactionId,
                    "companyId": formdata.ECompanyId
                   
            };
            disabled.attr('disabled', 'disabled');

            abp.message.confirm(
                'New SeriesType will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$modalEdit);
                        _service.updateSeriesType(viewData).done(function () {
                            abp.notify.success('SeriesType has been successfully updated', 'Success');
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
