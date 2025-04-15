using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.DataExporting.Excel.EpPlus;
using ezinvmvc.Dto;
using ezinvmvc.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Leads.Exporter
{
    public class LeadUpdateExporter : EpPlusExcelExporterBase, ILeadUpdateExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public LeadUpdateExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetLeadUpdateOutput> leadUpdateList)
        {
            return CreateExcelPackage(
                "LeadUpdates.xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add("LeadUdpates");
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                                    sheet, "Code", "Name", "Project", "Task", "Notes", "Next Contact", "CreationTime");

                    AddObjects(
                        sheet, 2, leadUpdateList,
                        _ => _.LeadCode,
                        _ => _.LeadName,
                        _ => _.LeadProject,
                        _ => _.LeadTask,
                        _ => _.Notes,
                        _ => _.NextContactDateTime,
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
