using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;


namespace ezinvmvc.App.Products
{
    public class CostingTypeService : ezinvmvcAppServiceBase, ICostingTypeService
    {
        private readonly ICostingTypeManager _manager;

        public CostingTypeService(ICostingTypeManager manager)
        {
            _manager = manager;
        }

        public async Task CreateCostingType(CreateCostingTypeInput input)
        {
            CostingType output = Mapper.Map<CostingType>(input);
            CheckErrors(await _manager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCostingType(DeleteCostingTypeInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetCostingTypeOutput> GetCostingType(GetCostingTypeInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCostingTypeOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetCostingTypeOutput>> GetCostingTypes()
        {
            var resultList = await _manager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetCostingTypeOutput>(listcount, ObjectMapper.Map<List<GetCostingTypeOutput>>(resultList));
        }

        public async Task UpdateCostingType(UpdateCostingTypeInput input)
        {
            CostingType output = Mapper.Map<CostingType>(input);
            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
