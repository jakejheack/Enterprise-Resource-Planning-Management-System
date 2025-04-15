
$(".date-picker").datepicker();
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
$('.datetime-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L LT'
});

$('select').selectpicker();


(function () {
    $(function () {
        var _jobsService = abp.services.app.jobsService;
        var _$JOform = $('form[name=JOCreateForm]');

        var _$table = $('#JobTable');

        var dataTable = _$table.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            searching: false,
            listAction: {
                ajaxFunction: _jobsService.getJobs,
                inputFilter: function () {
                    var $p = $('#JOTableFilter').val();
                    var $c = $('#SearchBy').val();
                    if ($p === '') {
                        $p = 'null';
                    }
                    return {
                        filter: $c + '|' + $p
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
                    data: "jobTitle"
                },
                {
                    targets: 2,
                    data: "department"
                },
                {
                    targets: 3,
                    data: "position"
                },
                {
                    targets: 4,
                    data: "description"
                },
                {
                    visible: false,
                    targets: 5,
                    data: "responsibilities"
                },
                {
                    visible: false,
                    targets: 6,
                    data: "requiredSkills"
                },
                {
                    targets: 7,
                    data: "education"
                },
                {
                    targets: 8,
                    data: "status"
                },
                {
                    orderable: false,
                    targets: 9,
                    class: "text-center",
                    data: { id: "id", jobTitle: "jobTitle" },
                    "render": function (data) {
                        return '<a id="edit-Jobs" title="View Items" href="#" class="edit-Jobs" data-Jobs-id="' + data.id + '"data-Jobs-jobTitle="' + data.jobTitle + '"><i class="fa fa-flickr"></i></a>';
                    }
                }
            ]
        });

        $('#GetJOButton').click(function (e) {
            dataTable.ajax.reload();
        });

        $('#submit').click(function (e) {
            e.preventDefault();
            saveJO();
        });


        function saveJO() {
            if (!_$JOform.valid()) {
                return;
            }
            var Record1 = _$JOform.serializeFormToObject();
            var items = { ...Record1 };
            abp.message.confirm(
                'New Record will be added.',
                'Are you sure?',
                function (isConfirmed) {
                    if (isConfirmed) {
                        abp.ui.setBusy(_$JOform);
                        _jobsService.createJobs(items).done(function () {
                            $.ajax({
                                type: 'POST',
                                processData: false,
                                contentType: false,
                                success: function () {
                                    abp.notify.success('New Record added successfully', 'Success');
                                },
                                error: function (e) { }
                            });
                        }).always(function () {
                            abp.ui.clearBusy(_$JOform);
                            dataTable.ajax.reload();
                        });
                    }
                }
            );
        }

    });
})();