using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.App.Common.Dto;

namespace ezinvmvc.App.Common
{
    [AbpAuthorize(PermissionNames.Master_Warehouse)]
    public class WarehouseService : ezinvmvcAppServiceBase, IWarehouseService
    {
        private readonly IWarehouseManager _warehouseManager;

        public WarehouseService(IWarehouseManager warehouseManager)
        {
            _warehouseManager = warehouseManager;
        }

        public async Task CreateWarehouse(CreateWarehouseInput input)
        {
            Warehouse output = Mapper.Map<Warehouse>(input);

            CheckErrors(await _warehouseManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<int> CreateTempWarehouse(CreateWarehouseInput input)
        {
            Warehouse output = Mapper.Map<Warehouse>(input);

            CheckErrors(await _warehouseManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteWarehouse(DeleteWarehouseInput input)
        {
            CheckErrors(await _warehouseManager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetWarehouseOutput>> GetWarehouses()
        {
            var resultList = await _warehouseManager.GetAllList();
            int listcount = resultList.Count();
            return new PagedResultDto<GetWarehouseOutput>(listcount, ObjectMapper.Map<List<GetWarehouseOutput>>(resultList));
        }

        public async Task<GetWarehouseOutput> GetWarehouse(GetWarehouseInput input)
        {
            var getbyid = await _warehouseManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetWarehouseOutput>(getbyid);
        }

        public async Task UpdateWarehouse(UpdateWarehouseInput input)
        {
            Warehouse output = Mapper.Map<UpdateWarehouseInput, Warehouse>(input);
            CheckErrors(await _warehouseManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
