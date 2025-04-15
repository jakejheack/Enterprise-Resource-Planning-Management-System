//Role Index

(function () {
    $(function () {
        var _roleService = abp.services.app.role;
        var _$rolesTable = $('#RolesTable');
        var _$modal = $('#RoleCreateModal');
        var _$form = _$modal.find('form');

        _$form.validate({
        });

        $('#RefreshButton').click(function () {
            refreshRoleList();
        });

        $('.delete-role').click(function () {
            var roleId = $(this).attr("data-role-id");
            var roleName = $(this).attr('data-role-name');

            deleteRole(roleId, roleName);
        });

        // Edit record
        $('#RolesTable').on('click', 'a.edit-role', function (e) {
            var roleId = $(this).attr("data-role-id");
            e.preventDefault();
            $.ajax({
                url: abp.appPath + 'Roles/EditRoleModal?roleId=' + roleId,
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    $('#RoleEditModal div.modal-content').html(content);
                },
                error: function (e) { }
            });
        });
        // Delete record
        $('#RolesTable').on('click', 'a.delete-role', function (e) {
            var roleId = $(this).attr("data-role-id");
            var roleName = $(this).attr("data-role-name");
            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('AreYouSureWantToDelete', 'ezinvmvc'), roleName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _roleService.delete({
                            id: roleId
                        }).done(function () {
                            refreshRoleList();
                        });
                    }
                }
            );
        });
       
        _$form.find('button[type="submit"]').click(function (e) {
            e.preventDefault();

            if (!_$form.valid()) {
                abp.message.warn('Please check all required fields.', 'Ooops! Record not saved.');
                return;
            }

            var role = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
            role.permissions = [];
            var _$permissionCheckboxes = $("input[name='permission']:checked");
            if (_$permissionCheckboxes) {
                for (var permissionIndex = 0; permissionIndex < _$permissionCheckboxes.length; permissionIndex++) {
                    var _$permissionCheckbox = $(_$permissionCheckboxes[permissionIndex]);
                    role.permissions.push(_$permissionCheckbox.val());
                }
            }

            abp.ui.setBusy(_$modal);
            _roleService.create(role).done(function () {
                _$modal.modal('hide');
                getRoles();
            }).always(function () {
                abp.ui.clearBusy(_$modal);
            });
        });

        _$modal.on('shown.bs.modal', function () {
            _$modal.find('input:not([type=hidden]):first').focus();
        });

        function refreshRoleList() {
            getRoles(); //reload page to see new role!
        }

        var dataTable = _$rolesTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _roleService.getRoles,
                permission: ''
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
                    data: "displayName"
                },
                {
                    orderable: false,
                    targets: 3,
                    class:"text-center",
                    data: { id: "id", name: "name" },
                    "render": function (data)
                    {
                        //return '<a id="edit-role" title="edit" href="#" class="edit-role" data-role-id="' + data.id + '" data-toggle="modal" data-target="#RoleEditModal"><i class="fa fa-pencil-square-o"></i></a>|<a id="delete-role" title="delete" href="#" class="delete-role" data-role-id="' + data.id + '" data-role-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var edit = '<a id="edit-role" title="edit" href="#" class="edit-role" data-role-id="' + data.id + '" data-toggle="modal" data-target="#RoleEditModal"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-role" title="delete" href="#" class="delete-role" data-role-id="' + data.id + '" data-role-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.Roles.Edit")) {
                            ret += edit;
                        }
                        if (abp.auth.isGranted("Master.Roles.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                }
            ]
        });

        function getRoles() {
            dataTable.ajax.reload();
        }

		
	});
})();