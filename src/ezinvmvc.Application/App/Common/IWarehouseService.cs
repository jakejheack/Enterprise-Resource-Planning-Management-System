using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IWarehouseService : IApplicationService
    {
        Task<PagedResultDto<GetWarehouseOutput>> GetWarehouses();
        Task CreateWarehouse(CreateWarehouseInput input);
        Task<int> CreateTempWarehouse(CreateWarehouseInput input);
        Task UpdateWarehouse(UpdateWarehouseInput input);
        Task DeleteWarehouse(DeleteWarehouseInput input);
        Task<GetWarehouseOutput> GetWarehouse(GetWarehouseInput input);
    }
}
