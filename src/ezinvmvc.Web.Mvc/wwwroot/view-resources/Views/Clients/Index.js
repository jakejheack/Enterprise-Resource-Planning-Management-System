// Clients
(function () {
    $(function () {

        var _$table = $('#ClientsTable');
        var _$table2 = $('#ClientsTable2');
        var _service = abp.services.app.clientService;
        var _employeeService = abp.services.app.employeeService;
        var _$modal = $('#ClientCreateModal');
        var _$form = _$modal.find('form');

        var _permissions = {
            create: abp.auth.hasPermission('Master.Clients.Create'),
            edit: abp.auth.hasPermission('Master.Clients.Edit'),
            'delete': abp.auth.hasPermission('Master.Clients.Delete')
        };

        var _aes = null;
        function getaesunderme() {
            var empid = $('#h1').val();
           
            _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
                _aes = result.items;
            });
        }

        function getaes() {
            var aes = $('#AEs');
            aes.empty();
            var empid = $('#h1').val();
            var aeFilter = $('#AEFilter').val();
            //if (empid === '-1') {
            //    empid = '';
            //}
            aes.append('<option value="" selected disabled>Account Executives</option>');
            if (aeFilter == 1) {
                aes.selectpicker('refresh');
                return;
            }
            if (aeFilter == 3) {
                empid = '';
            }
            _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    aes.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                }
                aes.selectpicker('refresh');
            });
        }

        $("#AEFilter").change(function () {
            getaes();
        });

        getaes();
        getaesunderme();

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getClients,
                inputFilter: function () {
                    var $s = $('#SearchFilter').val();
                    var $statusid = $('#StatusTypes').val();
                    var $accountstypefilter = $('#AEFilter').val();
                    var $accountexecutive = 'null';
                    var $accountexecutivefilter = 'null';
                    //if (!abp.auth.isGranted("Master.Clients.AllAccounts")) {
                    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    var empidfilter = $('#h1Filter').val();
                    var $aefilter = $('#AEs').val();
                    //if ($accountstypefilter == 1) {
                    //    $aefilter = empid;
                    //}
                    console.log(empid);
                    $accountexecutive = empid;
                    $accountexecutivefilter = empidfilter;
                    //}
                    return {
                        filter: $s + '|' + $statusid + '|' + $accountexecutive + '|' +  $aefilter + '|' + $accountstypefilter
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
                    orderData: 7,
                    targets: 1,
                    data: { id: "id", code: "code" },
                    render: function (data) {
                        return '<a id="view-client" title="view" href="#" class="view-client" data-client-id="' + data.id + '" data-client-code="' + data.code + '">' + data.code + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "name",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
                },
                {
                    targets: 3,
                    data: "industry"
                },
                {
                    targets: 4,
                    data: "completeAddress",
                    render: function (data) {
                        return "<div class='text-wrap width-200'>" + data + "</div>";
                    }
                },
                {
                    orderData: 8,
                    targets: 5,
                    data: { status: "status", statusid: "statusId" },
                    "render": function (data) {
                        if (data.statusId === 1) {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 2) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 3) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 4) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                },
                {
                    orderable: false,
                    targets: 6,
                    class: "text-center",
                    data: { id: "id", name: "name", assignedToId: "assignedToId"},
                    "render": function (data) {
                        var edit = '<a id="edit-client" title="edit" href="#" class="edit-client" data-client-id="' + data.id + '"><i class="fa fa-pencil-square-o"></i></a>';
                        var del = '<a id="delete-client" title="delete" href="#" class="delete-client" data-client-id="' + data.id + '" data-client-name="' + data.name + '"><i class="fa fa-trash"></i></a>';
                        var ret = '';
                        if (abp.auth.isGranted("Master.Clients.Edit")) {
                            //ret += edit;
                            //_employeeService.getAccountExecutives({ filter: data.assignedToid }).done(function (result) {
                            //console.log(data.assignedToId);
                                for (var i = 0; i < _aes.length; i++) {
                                    if (_aes[i].id == data.assignedToId) {
                                       // console.log(_aes[i]);
                                        ret += edit;
                                    }
                                    //aes.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                                }
                            //});
                        }
                        if (abp.auth.isGranted("Master.Clients.Delete")) {
                            ret += (ret.trim().length > 0 ? '|' + del : del);
                        }
                        return ret;
                    }
                },
                {
                    visible: false,
                    targets: 7,
                    data: "code"
                },
                {
                    visible: false,
                    targets: 8,
                    data: "statusId"
                }
            ]
        });

        var dataTable2 = _$table2.DataTable({
            paging: false,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _service.getClients,
                inputFilter: function () {
                    var $s = $('#SearchFilter').val();
                    var $statusid = $('#StatusTypes').val();
                    var $accountstypefilter = $('#AEFilter').val();
                    var $accountexecutive = 'null';
                    var $accountexecutivefilter = 'null';
                    //if (!abp.auth.isGranted("Master.Clients.AllAccounts")) {
                    var empid = $('#h1').val(); //getUserEmployee(abp.session.userId);
                    var empidfilter = $('#h1Filter').val();
                    var $aefilter = $('#AEs').val();
                    //if ($accountstypefilter == 1) {
                    //    $aefilter = empid;
                    //}
                    console.log(empid);
                    $accountexecutive = empid;
                    $accountexecutivefilter = empidfilter;
                    //}
                    return {
                        filter: $s + '|' + $statusid + '|' + $accountexecutive + '|' + $aefilter + '|' + $accountstypefilter,
                        forExport: true
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
                    targets: 1,
                    data: { id: "id", code: "code" },
                    render: function (data) {
                        return '<a id="view-client" title="view" href="#" class="view-client" data-client-id="' + data.id + '" data-client-code="' + data.code + '">' + data.code + '</i></a>';
                    }
                },
                {
                    targets: 2,
                    data: "name"
                },
                {
                    targets: 3,
                    data: "industry"
                },
                {
                    targets: 4,
                    data: "completeAddress"
                },
                {
                    targets: 5,
                    data: "city"
                },
                {
                    targets: 6,
                    data: "province"
                },
                {
                    targets: 7,
                    data: "country"
                },
                {
                    targets: 8,
                    data: { status: "status", statusid: "statusId" },
                    "render": function (data) {
                        if (data.statusId === 1) {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                        else if (data.statusId === 2) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 3) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 4) {
                            return '<span class="badge badge-success">' + data.status + '</span>';
                        }
                        else if (data.statusId === 5) {
                            return '<span class="badge badge-danger">' + data.status + '</span>';
                        }
                        else {
                            return '<span class="badge badge-secondary">' + data.status + '</span>';
                        }
                    }
                }
            ]
        });
       
        function getAll() {
            dataTable.ajax.reload();
            dataTable2.ajax.reload();
        }

        $('#SearchButton').click(function (e) {
            e.preventDefault();
            getAll();
        });

        $('#SearchFilter').on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            e.preventDefault();
            getAll();
        });

        $("#StatusTypes").change(function () {
            getAll();
        });

        $('#SearchFilter').focus();

        // Save record
        function save() {
            if (!_$form.valid()) {
                return;
            }
            var client = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js
            abp.ui.setBusy(_$modal);
            _service.createClient(client).done(function () {
                _$form.trigger("reset");
                _$modal.modal('hide');
                getAll();
            }).always(function () {
                abp.ui.clearBusy(_$modal);
            });
        }

        _$form.find('button[type="submit"]').click(function (e) {
            e.preventDefault();
            save();
        });

        _$form.find('input').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                save();
            }
        });

        _$form.find('select').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                save();
            }
        });
        _$modal.on('shown.bs.modal', function () {
            _$form.find('input[type=text]:first').focus();
        });

        // View record
        _$table.on('click', 'a.view-client', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-client-id");
            if (abp.auth.isGranted("Master.Clients.Details")) {
                window.location.href = abp.appPath + 'Clients/Details?id=' + clientId;
            }
        });

        // Edit record
        _$table.on('click', 'a.edit-client', function (e) {
            e.preventDefault();
            var clientId = $(this).attr("data-client-id");
            window.location.href = abp.appPath + 'Clients/Edit?id=' + clientId;
        });

        // Delete record
        _$table.on('click', 'a.delete-client', function (e) {
            var id = $(this).attr("data-client-id");
            var name = $(this).attr("data-client-name");

            e.preventDefault();
            abp.message.confirm(
                abp.utils.formatString(abp.localization.localize('DeleteClientConfirmation', 'ezinvmvc'), name),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _service.deleteClient({
                            id: id
                        }).done(function () {
                            getAll();
                        });
                    }
                }
            );
        });


        //$('#ExportToExcelButton').click(function (e) {
        //    e.preventDefault();

        //    _service.getClientsToExcel({})
        //        .done(function (result) {
        //            app.downloadTempFile(result);
        //        });
        //});


        //$('#ExportButton').click(function () {
        //    _service
        //        .getClientsToExcel({})
        //        .done(function (result) {
        //            app.downloadTempFile(result);
        //        });
        //});


        $('#ExportToExcelButton').click(function (e) {
            e.preventDefault();
            tableToExcel('ClientsTable2', 'Clients', 'Clients.xls');
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