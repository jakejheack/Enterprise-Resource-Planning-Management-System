using ezinvmvc.App.Vendors.Dto;
using ezinvmvc.Dto;
using System.Collections.Generic;

namespace ezinvmvc.App.Vendors.Exporting
{
    public interface IVendorExporter
    {
        FileDto ExportToFile(List<GetVendorOutput> vendorList);
    }
}
