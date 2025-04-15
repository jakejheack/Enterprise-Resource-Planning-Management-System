//Users
(function () {
    $(function() {

        var _userService = abp.services.app.user;
        var _$modal = $('#UserCreateModal');
        var _$form = _$modal.find('form');
        var _$usersTable = $('#UsersTable');

        _$form.validate({
            rules: {
                Password: "required",
                ConfirmPassword: {
                    equalTo: "#Password"
                }
            }
        });

        $('#RefreshButton').click(function () {
            refreshUserList();
        });

        // Edit record
        $('#UsersTable').on('click', 'a.edit-user', function (e) {
            var userId = $(this).attr("data-user-id");

            e.preventDefault();
            $.ajax({
                url: abp.appPath + 'Users/EditUserModal?userId=' + userId,
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    $('#UserEditModal div.modal-content').html(content);
                },
                error: function (e) { }
            });
        });
        // Delete record
        $('#UsersTable').on('click', 'a.delete-user', function (e) {
            var userId = $(this).attr("data-user-id");
            var userName = $(this).attr('data-user-name');

            deleteUser(userId, userName);
        });


        //$('.delete-user').click(function () {
        //    var userId = $(this).attr("data-user-id");
        //    var userName = $(this).attr('data-user-name');

        //    deleteUser(userId, userName);
        //});

        //$('.edit-user').click(function (e) {
        //    var userId = $(this).attr("data-user-id");

        //    e.preventDefault();
        //    $.ajax({
        //        url: abp.appPath + 'Users/EditUserModal?userId=' + userId,
        //        type: 'POST',
        //        contentType: 'application/html',
        //        success: function (content) {
        //            $('#UserEditModal div.modal-content').html(content);
        //        },
        //        error: function (e) { }
        //    });
        //});

        _$form.find('button[type="submit"]').click(function (e) {
            e.preventDefault();

            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var user = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
            user.roleNames = [];
            var _$roleCheckboxes = $("input[name='role']:checked");
            if (_$roleCheckboxes) {
                for (var roleIndex = 0; roleIndex < _$roleCheckboxes.length; roleIndex++) {
                    var _$roleCheckbox = $(_$roleCheckboxes[roleIndex]);
                    user.roleNames.push(_$roleCheckbox.val());
                }
            }

            abp.ui.setBusy(_$modal);
            _userService.create(user).done(function () {
                _$modal.modal('hide');
                getUsers();
            }).always(function () {
                abp.ui.clearBusy(_$modal);
            });
        });

        _$modal.on('shown.bs.modal', function () {
            _$modal.find('input:not([type=hidden]):first').focus();
        });

        function refreshUserList() {
            getUsers(); //reload page to see new user!
        }

        var dataTable = _$usersTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _userService.getAll,
                inputFilter: function () {
                    var $r = $('#lbRoles').val();
                    var $u = $('#UserTableFilter').val();
                    return {
                        filter: $u
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
                    data: "userName"
                },
                {
                    orderable: false,
                    targets: 2,
                    data: "fullName"
                },
                {
                    orderable: false,
                    targets: 3,
                    data: "emailAddress"
                },
                {
                    orderable: false,
                    targets: 4,
                    data: "isActive"
                },
                {
                    orderable: false,
                    targets: 5,
                    class: "text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data) {
                        //return '<a id="edit-user" title="edit" href="#" class="edit-user" data-user-id="' + data.id + '" data-toggle="modal" data-target="#UserEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-user" title="delete" href="#" class="delete-user" data-user-id="' + data.id + '" data-user-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-user" title="edit" href="#" class="edit-user" data-user-id="' + data.id + '" data-toggle="modal" data-target="#UserEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-user" title="delete" href="#" class="delete-user" data-user-id="' + data.id + '" data-user-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Pages.Users.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Pages.Users.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });

        function getUsers() {
            dataTable.ajax.reload();
        }

        function deleteUser(userId, userName) {
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('AreYouSureWantToDelete', 'ezinvmvc'), userName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _userService.delete({
                            id: userId
                        }).done(function () {
                            refreshUserList();
                        });
                    }
                }
            );
        }

        $("#lbRoles").change(function () {
            getUsers();
        });
    });
})();