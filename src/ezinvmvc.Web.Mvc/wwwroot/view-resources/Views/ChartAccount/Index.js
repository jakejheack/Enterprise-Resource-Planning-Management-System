
(function () {
    $(function () {

        //var _$table = $('#AssignmentTable');\
        var _accountService = abp.services.app.accountService;
        var _accountClassService = abp.services.app.accountClassService;
        var _accountTypeService = abp.services.app.accountTypeService;
        var _accountGroupService = abp.services.app.accountGroupService;
        var _companyService = abp.services.app.companyService;

        var _$form = $('form[name=AccountCreateForm]');
        var _$formEdit = $('form[name=AccountEditForm]');
        var _$modal = $('#AccountCreateModal');
        var _$modalEdit = $('#AccountEditModal');
        var _$table = $('#AccountTable');
        var _$table2 = $('#AccountTable2');
        //var _$itemsTable = $('#ItemsTable');



        function getaccountnode() {
            var header1 = $('#header1');
            header1.empty();
            //var pid = "";
            _accountService.getAccountByNode({ filter: '1' }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    header1.append('<ul value=' + result.items[i].id + ' data-base=' + result.items[i].code + '  data-name=' + result.items[i].name + '><a href="#"><span class="fa fa-file"> ' + result.items[i].name + '</span></a><div id=header2></div></ul >');
                    getaccountparentnode(2);
                }
                //getaccountparentnode(pid);
                header1.selectpicker('refresh');
                //bodysample2();
            });

        }

        function getaccountparentnode(id) {
            var header2 = $('#header2');
            header2.empty();
            _accountService.getAccountByParentNode({ filter: id }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    header2.append('<li value=' + result.items[i].id + '  data-base=' + result.items[i].code + '  data-name=' + result.items[i].name + '><span class="fa fa-file"> ' + result.items[i].name + '</span> <ul id="header3"></li></li></ul >');
                }
                header2.selectpicker('refresh');
                //bodysample2();
            });

        }

        //getaccountnode();
        //function bodysample() {
        //    var header1 = $('#header1');
        //    header1.empty();
        //    _accountTypeService.getAccountTypelist().done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            header1.append('<li value=' + result.items[i].id + ' data-base=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + ' <ul id="header2"></li></li></ul >');
        //        }
        //        header1.selectpicker('refresh');
        //        bodysample2();
        //    });

        //}

        //function bodysample2() {
        //    var header2 = $('#header2');
        //    header2.empty();
        //    _accountClassService.getAccountClasslist().done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            header2.append('<li value=' + result.items[i].id + ' data-base=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + ' <ul id="header3"></li></li></ul >');
        //        }
        //        header2.selectpicker('refresh');
        //        bodysample3();
        //    });
        //}

        //function bodysample3() {
        //    var header3 = $('#header3');
        //    header3.empty();
        //    _accountClassService.getAccountClasslist().done(function (result) {
        //        for (var i = 0; i < result.items.length; i++) {
        //            header3.append('<li value=' + result.items[i].id + ' data-base=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + ' <ul id="header3"></li></li></ul >');
        //        }
        //        header3.selectpicker('refresh');
        //    });
        //}
        //bodysample();

        //MARC DataTable TreeView 10142022
        //var dataTable = _$table.DataTable({
        //    paging: false,
        //    serverSide: true,
        //    processing: true,
        //    searching: false,

        //    listAction: {
        //        ajaxFunction: _accountService.getAccountByName
        //    },
        //    columnDefs: [
        //        {
        //            className: 'control responsive',
        //            orderable: false,
        //            render: function () {
        //                return '';
        //            },
        //            targets: 0
        //        },
        //        {
        //            orderable: false,
        //            targets: 1,
        //            data: "node"
        //        },
        //        {
        //            orderable: false,
        //            targets: 2,
        //            data: "parentNode"
        //        },
        //        {
        //            orderable: false,
        //            targets: 3,
        //            data: "code"
        //        },
        //        {
        //            orderable: false,
        //            targets: 4,
        //            data: "name"
        //        },
        //        {
        //            orderable: false,
        //            targets: 5,
        //            data: "accountClassId"
        //        },
        //        {
        //            orderable: false,
        //            targets: 6,
        //            data: "accountTypeId"
        //        },
        //        {
        //            orderable: false,
        //            targets: 7,
        //            data: "accountGroupId"
        //        },
        //        {
        //            orderable: false,
        //            targets: 8,
        //            data: "isChild"
        //        },
        //        {
        //            orderable: false,
        //            targets: 9,
        //            data: "isActive"
        //        },
        //        {
        //            orderable: false,
        //            targets: 10,
        //            class: "text-center",
        //            data: { id: "id", name: "name" },
        //            "render": function (data) {
        //                //return '<a id="edit-account" title="edit" href="#" class="edit-account" data-account-id="' + data.id + '" ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-account" title="delete" href="#" class="delete-account" data-account-id="' + data.id + '" data-account-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
        //                var edit = '<a id="edit-account" title="edit" href="#" class="edit-account" data-account-id="' + data.id + '" ><i class="fa fa-pencil-square-o"></i></a>';
        //                var del = '<a id="delete-account" title="delete" href="#" class="delete-account" data-account-id="' + data.id + '" data-account-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
        //                var ret = '';
        //                if (abp.auth.isGranted("Pages.ChartAccount.Edit")) {
        //                    ret += edit;
        //                }
        //                if (abp.auth.isGranted("Pages.ChartAccount.Delete")) {
        //                    ret += (ret.trim().length > 0 ? '|' + del : del);
        //                }
        //                return ret;
        //            }
        //        }
        //    ]
        //});


        //MARC DataTable TreeView 10142022



        //Edit Record
        _$table.on('click', 'a.edit-account', function (e) {
            e.preventDefault();
            var Id = $(this).attr("data-account-id");
            $('#Id').val(Id);
            getload(Id);
            _$modalEdit.modal('show');
            //alert(Id);
        });

        //Delete Record
        _$table.on('click', 'a.delete-account', function (e) {
            var id = $(this).attr("data-account-id");
            var name = $(this).attr("data-account-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteAccountConfirmation', 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _accountService.deleteAccount({
                            id: id
                        }).done(function () {
                            //getAll();
                            window.location.reload();
                        });
                    }
                }
            );
        });

        function getload(id) {
            _accountService.getAccount({ id: id }).done(function (result) {

                $('#codeE').val(result.code);
                $('#nameE').val(result.name);
                $('input[type=checkbox][name=IsChildE]').prop('checked', result.isChild);
                $('input[type=checkbox][name=IsActiveE]').prop('checked', result.isActive);

                $('#CompaniesE').val(result.companyId);
                $('#CompaniesE').selectpicker('refresh');

                $('#AccountClassIdE').val(result.accountClassId);
                $('#AccountClassIdE').selectpicker('refresh');
                $('#AccountTypeIdE').val(result.accountTypeId);
                $('#AccountTypeIdE').selectpicker('refresh');
                $('#AccountGroupIdE').val(result.accountGroupId);
                $('#AccountGroupIdE').selectpicker('refresh');
                //alert(result.companyId);

                $('#ParentIdE').val(result.parentNode);
                if (result.parentNode > 0) {
                    getAccountLoad(result.parentNode);
                }
            });
        };

        function getAccountLoad(id) {
            _accountService.getAccount({ id: id }).done(function (result) {
                $('#ParentNameE').val(result.code + ' - ' + result.name);
            });
        }

        function getAll() {
            //MARC DataTable TreeView 10142022
            //dataTable.ajax.reload();
            //_$table.data("treeTable").expandAllRows().redraw();
            //_$table.empty();
            _accountService.getAccounts({ filter: 'null|null|null|null|null', forExport: true }).done(function (result) {
                console.log(result);
                _$table.treeTable({
                    "data": result.items,
                    "responsive": false,
                    "collapsed": false,
                    "columns": [
                        {
                            //className: 'control responsive',
                            //orderable: false,
                            //render: function () {
                            //    return '';
                            //},
                            visible: false,
                            targets: 0,
                            data: "id"
                        },
                        {
                            visible: false,
                            targets: 1,
                            data: "node"
                        },
                        {
                            visible: false,
                            targets: 2,
                            data: "parentNode"
                        },
                        {
                            orderable: false,
                            targets: 3,
                            data: "code"
                        },
                        {
                            orderable: false,
                            targets: 4,
                            data: "name"
                        },
                        {
                            orderable: false,
                            targets: 5,
                            data: "accountClass"
                        },
                        {
                            orderable: false,
                            targets: 6,
                            data: "accountType"
                        },
                        {
                            visible: false,
                            targets: 7,
                            data: "accountGroup"
                        },
                        {
                            visible: false,
                            targets: 8,
                            data: "isChild"
                        },
                        {
                            orderable: false,
                            targets: 9,
                            data: "isActive",
                            render: function (data) {
                                return data ? "Yes" : "No";
                            }
                        },
                        {
                            orderable: false,
                            targets: 10,
                            class: "text-center",
                            data: { id: "id", name: "name" },
                            "render": function (data) {
                                //return '<a id="edit-account" title="edit" href="#" class="edit-account" data-account-id="' + data.id + '" ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-account" title="delete" href="#" class="delete-account" data-account-id="' + data.id + '" data-account-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                                var edit = '<a id="edit-account" title="edit" href="#" class="edit-account" data-account-id="' + data.id + '" ><i class="fa fa-pencil-square-o"></i></a>';
                                //var del = '<a id="delete-account" title="delete" href="#" class="delete-account" data-account-id="' + data.id + '" data-account-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                                var ret = '';
                                if (abp.auth.isGranted("Pages.ChartAccount.Edit")) {
                                    ret += edit;
                                }
                                //if (abp.auth.isGranted("Pages.ChartAccount.Delete")) {
                                //    ret += (ret.trim().length > 0 ? '|' + del : del);
                                //}
                                return ret;
                            }
                        }
                    ],
                    "order": [[1, 'asc']]
                });

                _$table2.treeTable({
                    "paging": false,
                    "data": result.items,
                    "responsive": false,
                    "collapsed": false,
                    "columns": [
                        {
                            //className: 'control responsive',
                            //orderable: false,
                            //render: function () {
                            //    return '';
                            //},
                            visible: false,
                            targets: 0,
                            data: "id"
                        },
                        {
                            visible: false,
                            targets: 1,
                            data: "node"
                        },
                        {
                            visible: false,
                            targets: 2,
                            data: "parentNode"
                        },
                        {
                            orderable: false,
                            targets: 3,
                            data: "code"
                        },
                        {
                            orderable: false,
                            targets: 4,
                            data: "name"
                        },
                        {
                            orderable: false,
                            targets: 5,
                            data: "accountClass"
                        },
                        {
                            orderable: false,
                            targets: 6,
                            data: "accountType"
                        },
                        {
                            visible: false,
                            targets: 7,
                            data: "accountGroup"
                        },
                        {
                            visible: false,
                            targets: 8,
                            data: "isChild"
                        },
                        {
                            orderable: false,
                            targets: 9,
                            data: "isActive",
                            render: function (data) {
                                return data ? "Yes" : "No";
                            }
                        },
                        {
                            visible: false,
                            targets: 10,
                            class: "text-center",
                            data: { id: "id", name: "name" },
                            "render": function (data) {
                                //return '<a id="edit-account" title="edit" href="#" class="edit-account" data-account-id="' + data.id + '" ><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-account" title="delete" href="#" class="delete-account" data-account-id="' + data.id + '" data-account-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                                var edit = '<a id="edit-account" title="edit" href="#" class="edit-account" data-account-id="' + data.id + '" ><i class="fa fa-pencil-square-o"></i></a>';
                                //var del = '<a id="delete-account" title="delete" href="#" class="delete-account" data-account-id="' + data.id + '" data-account-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                                var ret = '';
                                if (abp.auth.isGranted("Pages.ChartAccount.Edit")) {
                                    ret += edit;
                                }
                                //if (abp.auth.isGranted("Pages.ChartAccount.Delete")) {
                                //    ret += (ret.trim().length > 0 ? '|' + del : del);
                                //}
                                return ret;
                            }
                        }
                    ],
                    "order": [[1, 'asc']]
                });
            }).always(function () {
                //_$table.DataTable()
                //    .order([4, 'asc'])
                //    .draw();
            });
        }
        getAll();

        function getcompanies() {
            var companies = $('#Companies');
            abp.ui.block($('#Companies'));
            companies.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault === true) {
                        companies.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                        //getseriestype(result.items[i].id);
                        //$('#AccountsId').val(result.items[i].payableAccountId);
                    }
                    else {
                        companies.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                companies.selectpicker('refresh');
            });
            abp.ui.unblock('#Companies');
        }
        function getcompaniesE() {
            var companiesE = $('#CompaniesE');
            abp.ui.block($('#CompaniesE'));
            companiesE.empty();
            _companyService.getCompanies().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].isDefault === true) {
                        companiesE.append('<option value=' + result.items[i].id + ' selected>' + result.items[i].name + '</option>');
                        //getseriestype(result.items[i].id);
                        //$('#AccountsId').val(result.items[i].payableAccountId);
                    }
                    else {
                        companiesE.append('<option value=' + result.items[i].id + '>' + result.items[i].name + '</option>');
                    }
                }
                companiesE.selectpicker('refresh');
            });
            abp.ui.unblock('#CompaniesE');
        }
        getcompanies();
        getcompaniesE();


        //Load Data
        function getaccountclass() {
            var accountClassId = $('#AccountClassId');
            accountClassId.empty();
            _accountClassService.getAccountClasslist().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    accountClassId.append('<option value=' + result.items[i].id + ' data-base=' + result.items[i].base + ' data-name=' + result.items[i].name + '>' + result.items[i].name + '</option>');
                }
                accountClassId.selectpicker('refresh');
            });
        }
        function getaccounttype() {
            var accountTypeId = $('#AccountTypeId');
            accountTypeId.empty();
            _accountTypeService.getAccountTypelist().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    accountTypeId.append('<option value=' + result.items[i].id + ' data-code=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + '</option>');
                }
                accountTypeId.selectpicker('refresh');
            });
        }
        function getaccountgroup() {
            var accountGroupId = $('#AccountGroupId');
            accountGroupId.empty();
            _accountGroupService.getAccountGrouplist().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    accountGroupId.append('<option value=' + result.items[i].id + ' data-code=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + '</option>');
                }
                accountGroupId.selectpicker('refresh');
            });
        }

        getaccountclass();
        getaccounttype();
        getaccountgroup();


        function getaccountclassE() {
            var accountClassIdE = $('#AccountClassIdE');
            accountClassIdE.empty();
            _accountClassService.getAccountClasslist().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    accountClassIdE.append('<option value=' + result.items[i].id + ' data-base=' + result.items[i].base + ' data-name=' + result.items[i].name + '>' + result.items[i].name + '</option>');
                }
                accountClassIdE.selectpicker('refresh');
            });
        }
        function getaccounttypeE() {
            var accountTypeIdE = $('#AccountTypeIdE');
            accountTypeIdE.empty();
            _accountTypeService.getAccountTypelist().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    accountTypeIdE.append('<option value=' + result.items[i].id + ' data-code=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + '</option>');
                }
                accountTypeIdE.selectpicker('refresh');
            });
        }
        function getaccountgroupE() {
            var accountGroupIdE = $('#AccountGroupIdE');
            accountGroupIdE.empty();
            _accountGroupService.getAccountGrouplist().done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    accountGroupIdE.append('<option value=' + result.items[i].id + ' data-code=' + result.items[i].code + ' data-name=' + result.items[i].name + '>' + result.items[i].name + '</option>');
                }
                accountGroupIdE.selectpicker('refresh');
            });
        }

        getaccountclassE();
        getaccounttypeE();
        getaccountgroupE();
        //Load Data

        function clear() {
            $('#code').val('');
            $('#name').val('');
            $('input[type=checkbox][name=IsActive]').prop('checked', false);
            getaccountclass();
            getaccounttype();
            getaccountgroup();

        }

        function save() {
            if (!_$form.valid()) {
                return;
            }

            var disabled = _$form.find(':input:disabled').removeAttr('disabled');
            var formdata = _$form.serializeFormToObject();

            //if (formdata.DebitTotal !== formdata.CreditTotal) {
            //    abp.notify.warn('Entry type not balance.', 'Warning');
            //    return;
            //}

            var isActive = "";
            if (formdata.IsActive === 'on') {
                isActive = "1";
            }
            else {
                isActive = "0";

            }
            //alert(formdata.CompanyId);
            var viewData = {
                account: {
                    "companyId": formdata.CompanyId,
                    "node": "1",
                    "parentNode": formdata.ParentId.trim().length > 0 ? formdata.ParentId : "0",
                    "code": formdata.Code,
                    "name": formdata.Name,
                    "accountClassId": formdata.AccountClassId,
                    "accountTypeId": formdata.AccountTypeId,
                    "accountGroupId": formdata.AccountGroupId,
                    "isChild": "0",
                    "isActive": isActive,
                }
            };
            disabled.attr('disabled', 'disabled');


            abp.message.confirm(
                'New Account will be created.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$form);
                        _accountService.createAccount(viewData).done(function () {
                            abp.notify.success('Account created', 'Success');
                            _$modal.modal('hide');
                            clear();
                        }).always(function () {
                            abp.ui.clearBusy(_$form);
                            window.location.reload();
                        });
                    }
                }
            );

        }

        function update() {
            if (!_$formEdit.valid()) {
                return;
            }

            var disabled = _$formEdit.find(':input:disabled').removeAttr('disabled');
            var formdataE = _$formEdit.serializeFormToObject();

            //if (formdata.DebitTotal !== formdata.CreditTotal) {
            //    abp.notify.warn('Entry type not balance.', 'Warning');
            //    return;
            //}
            //alert(formdataE.Id);
            var isChild = "";
            if (formdataE.IsChildE === 'on') {
                isChild = "1";
            }
            else {
                isChild = "0";

            }

            var isActive = "";
            if (formdataE.IsActiveE === 'on') {
                isActive = "1";
            }
            else {
                isActive = "0";

            }
            //alert(isActive);
            var viewData = {
                account: {
                    "id": formdataE.Id,
                    "companyId": formdataE.CompanyIdE,
                    "node": "1",
                    "parentNode": formdataE.ParentIdE.trim().length > 0 ? formdataE.ParentIdE : "0",
                    "code": formdataE.CodeE,
                    "name": formdataE.NameE,
                    "accountClassId": formdataE.AccountClassIdE,
                    "accountTypeId": formdataE.AccountTypeIdE,
                    "accountGroupId": formdataE.AccountGroupIdE,
                    "isChild": isChild,
                    "isActive": isActive,
                }
            };
            disabled.attr('disabled', 'disabled');


            abp.message.confirm(
                'New Account will be updated.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$formEdit);
                        _accountService.updateAccount(viewData).done(function () {
                            abp.notify.success('Account updated', 'Success');
                            _$modalEdit.modal('hide');
                            //clear();
                        }).always(function () {
                            abp.ui.clearBusy(_$formEdit);
                            window.location.reload();
                        });
                    }
                }
            );

        }

        $('#submit').click(function (e) {
            e.preventDefault();
            save();
        });

        $('#update').click(function (e) {
            e.preventDefault();
            update();
        });


        $('#expand').on("click", function () {
            _$table.data("treeTable").expandAllRows().redraw();
        });

        $('#collapse').on("click", function () {
            _$table.data("treeTable").collapseAllRows().redraw();
        })

        //Parent Account Autocomplete
        var getAccountsParent = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|1' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code + ' - ' + el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountParent() {
            var $accountidParent = $('#ParentId').val();
            _accountService.getAccount({ id: $accountidParent }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountParent = function (event, ui) {
            event.preventDefault();
            $("#ParentId").val(ui.item ? ui.item.value : "");
            $("#ParentName").val(ui.item ? ui.item.label : "");

            getAccountParent();
            return false;
        };
        var focusAccountParent = function (event, ui) {
            event.preventDefault();
            $("#ParentId").val(ui.item.value);
            $("#ParentName").val(ui.item.label);
        };
        var changeAccountParent = function (event, ui) {
            event.preventDefault();
            $("#ParentId").val(ui.item ? ui.item.value : "");
            $("#ParentName").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#ParentName").autocomplete({
            source: getAccountsParent,
            select: selectAccountParent,
            focus: focusAccountParent,
            minLength: 2,
            delay: 100,
            change: changeAccountParent
        });
        //Parent Account Autocomplete

        //Parent Account Edit Autocomplete
        var getAccountsParentE = function (request, response) {
            _accountService.getAccounts({ filter: 'null|1|null|' + request.term + '|1' }).done(function (result) {
                response($.map(result.items, function (el) {
                    return {
                        label: el.code + ' - ' + el.name,
                        value: el.id
                    };
                }));
            });
        };
        function getAccountParentE() {
            var $accountidParent = $('#ParentIdE').val();
            _accountService.getAccount({ id: $accountidParent }).done(function (result) {
                //$('#Telno').val(result[0].telNo);
                //$('#Phone').val(result[0].mobileNo);
                //$('#Taxno').val(result[0].taxNo);
                //$('#Email').val(result[0].email);
                //$('#Address').val(result[0].completeAddress);
            });
        };
        var selectAccountParentE = function (event, ui) {
            event.preventDefault();
            $("#ParentIdE").val(ui.item ? ui.item.value : "");
            $("#ParentNameE").val(ui.item ? ui.item.label : "");

            if ($('#Id').val() === $('#ParentIdE').val()) {
                $("#ParentIdE").val("");
                $("#ParentNameE").val("");
                abp.message.warn('Can\'t use own account as Parent!', 'Chart of Account')
            }
            //getAccountParentE();
            return false;
        };
        var focusAccountParentE = function (event, ui) {
            event.preventDefault();
            $("#ParentIdE").val(ui.item.value);
            $("#ParentNameE").val(ui.item.label);
        };
        var changeAccountParentE = function (event, ui) {
            event.preventDefault();
            $("#ParentIdE").val(ui.item ? ui.item.value : "");
            $("#ParentNameE").val(ui.item ? ui.item.label : "");
            //if (ui.item === null) {
            //    $('#Telno').val('');
            //    $('#Phone').val('');
            //    $('#Taxno').val('');
            //    $('#Email').val('');
            //    $('#Address').val('');
            //}
        };
        $("#ParentNameE").autocomplete({
            source: getAccountsParentE,
            select: selectAccountParentE,
            focus: focusAccountParentE,
            minLength: 2,
            delay: 100,
            change: changeAccountParentE
        });
        //Parent Account Edit Autocomplete


        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('AccountTable2', 'ChartofAccount', 'ChartofAccount.xls');
        });

        function tableToExcel(table, name, filename) {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
                base64 = function (s) {
                    return window.btoa(decodeURIComponent(encodeURIComponent(s.replace(/[\u00A0-\u2666]/g, function (c) {
                        return '&#' + c.charCodeAt(0) + ';';
                    }).replace(/[\u{0080}-\u{FFFF}]/gu, ""))))
                }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

            if (!table.nodeType) table = document.getElementById(table);
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };

            var link = document.createElement('a');
            link.download = filename;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }
    });
})();