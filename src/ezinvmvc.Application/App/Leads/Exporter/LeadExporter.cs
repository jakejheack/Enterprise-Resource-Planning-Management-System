using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.DataExporting.Excel.EpPlus;
using ezinvmvc.Dto;
using ezinvmvc.Storage;
using System.Collections.Generic;

namespace ezinvmvc.App.Leads.Exporting
{
    public class LeadExporter : EpPlusExcelExporterBase, ILeadExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public LeadExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetLeadOutput> clientList)
        {
            return CreateExcelPackage(
                "Leads.xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add("Leads");
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                                    sheet, "Code", "Name", "TelNo", "FaxNo", "MobileNo", "Email", "Address", "Status", "CreationTime");

                    AddObjects(
                        sheet, 2, clientList,
                        _ => _.Code,
                        _ => _.Name,
                        _ => _.TelNo,
                        _ => _.FaxNo,
                        _ => _.MobileNo,
                        _ => _.Email,
                        _ => _.Address,
                        _ => _.Status,
                        _ => _timeZoneConverter.Convert(_.CreationTime, _abpSession.TenantId, _abpSession.GetUserId())
                        );

                    //Formatting cells

                    var lastLoginTimeColumn = sheet.Column(8);
                    lastLoginTimeColumn.Style.Numberformat.Format = "yyyy-mm-dd";

                    var creationTimeColumn = sheet.Column(10);
                    creationTimeColumn.Style.Numberformat.Format = "yyyy-mm-dd";

                    for (var i = 1; i <= 10; i++)
                    {
                        sheet.Column(i).AutoFit();
                    }
                });
        }
    }
}
