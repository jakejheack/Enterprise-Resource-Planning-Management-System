using ezinvmvc.App.Leads.Dto;
using ezinvmvc.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Leads.Exporter
{
    public interface ILeadUpdateExporter
    {
        FileDto ExportToFile(List<GetLeadUpdateOutput> leadUpdateList);
    }
}
