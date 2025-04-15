using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;

namespace ezinvmvc.App.Products
{
   public class PricingTypeService : ezinvmvcAppServiceBase, IPricingTypeService
    {
        private readonly IPricingTypeManager _manager;

        public PricingTypeService(IPricingTypeManager manager)
        {
            _manager = manager;
        }

        public async Task CreatePricingType(CreatePricingTypeInput input)
        {
            PricingType output = Mapper.Map<PricingType>(input);
            CheckErrors(await _manager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeletePricingType(int id)
        {
            CheckErrors(await _manager.DeleteAsync(id));
        }

        public async Task<PagedResultDto<GetPricingTypeOutput>> GetPricingTypes()
        {
            var resultList = await _manager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetPricingTypeOutput>(listcount, ObjectMapper.Map<List<GetPricingTypeOutput>>(resultList));
        }

        public async Task<GetPricingTypeOutput> GetPricingType(int id)
        {
            var getbyid = await _manager.GetByIdAsync(id);
            return Mapper.Map<GetPricingTypeOutput>(getbyid);
        }

        public async Task UpdatePricingType(UpdatePricingTypeInput input)
        {
            PricingType output = Mapper.Map<PricingType>(input);
            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
