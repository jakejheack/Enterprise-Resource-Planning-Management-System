
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

$('#Add').show();
$('#Update').hide();

$('#AddLeave').show();
$('#UpdateLeave').hide();

$('#SaveItemButton').show();
$('#UpdateItemButton').hide();

$('#SaveLeaveButton').show();
$('#UpdateLeaveButton').hide();

var EmpUserId = document.getElementById("UserId").value;
if (EmpUserId != "")
{
    //alert(EmpUserId);
}
else
{
    alert("NOne");
}


(function () {
    $(function () {

        $('#FilterAttendaceButton').click(function (e) {
            e.preventDefault();

            if ($('#DateFrom').val() === "" || $('#DateTo').val() === "")
            {
                abp.notify.error('DATE (From/To) ISSUE', 'WARNING');
                return;
            }
            else
            {
                var dt = new Date($date);
                $date = getFormattedDate(dt);
            }
        });

    });
})(jQuery);