using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Vendors.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.Vendors
{
   public interface IVendorService : IApplicationService
    {
        Task<PagedResultDto<GetVendorOutput>> GetVendors(GetVendorListInput input);
        Task CreateVendor(CreateVendorInput input);
        Task UpdateVendor(UpdateVendorInput input);
        Task DeleteVendor(DeleteVendorInput input);
        Task<GetVendorOutput> GetVendor(GetVendorInput input);
    }
}
