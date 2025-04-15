using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using ezinvmvc.App.Vendors.Dto;
using ezinvmvc.DataExporting.Excel.EpPlus;
using ezinvmvc.Dto;
using ezinvmvc.Storage;
using System.Collections.Generic;

namespace ezinvmvc.App.Vendors.Exporting
{
    public class VendorExporter : EpPlusExcelExporterBase, IVendorExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public VendorExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetVendorOutput> vendorList)
        {
            return CreateExcelPackage(
                "Vendors.xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add("Vendors");
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                        sheet, "Name", "Email", "Phone", "TaxNo", "Address", "City", "Country", "CreationTime");

                    AddObjects(
                        sheet, 2, vendorList,
                        _ => _.Name,
                        _ => _.Email,
                        _ => _.Phone,
                        _ => _.TaxNo,
                        _ => _.Address,
                        _ => _.City,
                        _ => _.Country,
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
