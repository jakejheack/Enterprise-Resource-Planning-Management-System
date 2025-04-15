using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.DataExporting.Excel.EpPlus;
using ezinvmvc.Dto;
using ezinvmvc.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Employees.Exporting
{
    public class EmployeeExporter : EpPlusExcelExporterBase, IEmpolyeeExporter
    {
        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public EmployeeExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager)
            : base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetEmployeeOutput> EmployeeList)
        {
            return CreateExcelPackage(
                "Employee.xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add("Employee");
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                        sheet, "EmpId", "FirstName", "MiddleName", "LastName");

                    AddObjects(
                        sheet, 2, EmployeeList,
                        _ => _.EmployeeCode,
                        _ => _.FirstName,
                        _ => _.MiddleName,
                        _ => _.LastName,
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
