using ezinvmvc.App.Clients.Dto;
using ezinvmvc.Dto;
using System.Collections.Generic;

namespace ezinvmvc.App.Clients.Exporting
{
    public interface IClientExporter
    {
        FileDto ExportToFile(List<GetClientOutput> clientList);
    }
}
