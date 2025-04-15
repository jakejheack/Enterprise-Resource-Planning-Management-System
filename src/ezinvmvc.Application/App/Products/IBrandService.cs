using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface IBrandService : IApplicationService
    {
        Task<PagedResultDto<GetBrandOutput>> GetBrands();
        Task CreateBrand(CreateBrandInput input);
        Task UpdateBrand(UpdateBrandInput input);
        Task DeleteBrand(DeleteBrandInput input);
        Task<GetBrandOutput> GetBrand(GetBrandInput input);
    }
}
