using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
   public interface IPricingTypeService : IApplicationService
    {
        Task<PagedResultDto<GetPricingTypeOutput>> GetPricingTypes();
        Task CreatePricingType(CreatePricingTypeInput input);
        Task UpdatePricingType(UpdatePricingTypeInput input);
        Task DeletePricingType(int id);
        Task<GetPricingTypeOutput> GetPricingType(int id);
    }
}
