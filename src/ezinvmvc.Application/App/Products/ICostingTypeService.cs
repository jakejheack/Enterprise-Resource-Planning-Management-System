using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Products
{
    public interface ICostingTypeService : IApplicationService
    {
        Task<PagedResultDto<GetCostingTypeOutput>> GetCostingTypes();
        Task CreateCostingType(CreateCostingTypeInput input);
        Task UpdateCostingType(UpdateCostingTypeInput input);
        Task DeleteCostingType(DeleteCostingTypeInput input);
        Task<GetCostingTypeOutput> GetCostingType(GetCostingTypeInput input);
    }
}
