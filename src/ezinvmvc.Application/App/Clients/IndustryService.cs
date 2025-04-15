using AutoMapper;
using ezinvmvc.App.Clients.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Clients
{
    public class IndustryService : ezinvmvcAppServiceBase, IIndustryService
    {
        private readonly IIndustryManager _industryManager;

        public IndustryService(IIndustryManager industryManager)
        {
            _industryManager = industryManager;
        }

        public async Task CreateIndustry(CreateIndustryInput input)
        {
            Industry output = Mapper.Map<Industry>(input);
            CheckErrors(await _industryManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteIndustry(DeleteIndustryInput input)
        {
            CheckErrors(await _industryManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetIndustryOutput>> GetIndustries()
        {
            var getall = await _industryManager.GetAllList();
            return Mapper.Map<List<GetIndustryOutput>>(getall);
        }

        public async Task<GetIndustryOutput> GetIndustry(GetIndustryInput input)
        {
            var getbyid = await _industryManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetIndustryOutput>(getbyid);
        }

        public async Task UpdateIndustry(UpdateIndustryInput input)
        {
            Industry output = Mapper.Map<Industry>(input);
            CheckErrors(await _industryManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
