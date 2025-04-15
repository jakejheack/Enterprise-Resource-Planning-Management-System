using ezinvmvc.App.Leads.Dto;
using ezinvmvc.Dto;
using System.Collections.Generic;

namespace ezinvmvc.App.Leads.Exporting
{
    public interface ILeadExporter
    {
        FileDto ExportToFile(List<GetLeadOutput> leadList);
    }
}
