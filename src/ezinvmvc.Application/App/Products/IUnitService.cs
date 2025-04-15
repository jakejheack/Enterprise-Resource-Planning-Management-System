using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
   public interface IUnitService : IApplicationService
    {
        Task<PagedResultDto<GetUnitOutput>> GetUnits();
        Task CreateUnit(CreateUnitInput input);
        Task UpdateUnit(UpdateUnitInput input);
        Task DeleteUnit(DeleteUnitInput input);
        Task<GetUnitOutput> GetUnit(GetUnitInput input);
    }
}
