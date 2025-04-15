$(".date-picker").datepicker("update", new Date());
var $month = (new Date().getMonth() + 1);
//var mdayone = ($month.toString().length > 1 ? $month : "0" + $month) + "/01/" + new Date().getFullYear();
var mdayone = "01/01/" + new Date().getFullYear();
$("#DateFrom").val(mdayone);
$('.date-picker').datepicker({
    locale: abp.localization.currentLanguage.name,
    format: 'L'
});
(function () {
    $(function () {
        var _salesOrderService = abp.services.app.salesOrderService;
        var _employeeService = abp.services.app.employeeService;

        $(document).ready(function () {
            getaes();
        });

        function getaes() {
            var aes = $('#AEs');
            aes.empty();
            var empid = $('#h1').val();
            //if (empid === '-1') {
            //    empid = '';
            //}
            aes.append('<option value="" selected disabled>Account Executives</option>');
            _employeeService.getAccountExecutives({ filter: empid }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    aes.append('<option value=' + result.items[i].id + '>' + result.items[i].completeName + '</option>');
                }
                aes.selectpicker('refresh');
            });
        }

        function SalesorderSummarybyAgentId() {
            //$("#Overtime-list").empty();    
            $("#ids").val("");
            _salesOrderService.salesorderSummaryAgentId({ filter: $('#DateFrom').val() + '|' + $('#DateTo').val() }).done(function (result) {
                for (var i = 0; i < result.items.length; i++) {
                    var $id = result.items[i].salesAgentId;
                    var $SalesAgent = result.items[i].SalesAgent;
                    if ($("#ids").val() == "")
                    {
                        $("#ids").val($id);
                    }
                    else
                    {
                        $("#ids").val($("#ids").val() + "," + $id);
                    }
                }
            });
        }

        $('#btnsearch').click(function (e) {
            e.preventDefault();
            SalesorderSummarybyAgentId();
        });

    });
})(jQuery);