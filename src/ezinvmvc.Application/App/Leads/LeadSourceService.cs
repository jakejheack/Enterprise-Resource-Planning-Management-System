using AutoMapper;
using ezinvmvc.App.Leads.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public class LeadSourceService : ezinvmvcAppServiceBase, ILeadSourceService
    {
        private readonly ILeadSourceManager _leadSourceManager;

        public LeadSourceService(ILeadSourceManager leadSourceManager)
        {
            _leadSourceManager = leadSourceManager;
        }

        public async Task CreateLeadSource(CreateLeadSourceInput input)
        {
            LeadSource output = Mapper.Map<LeadSource>(input);

            CheckErrors(await _leadSourceManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteLeadSource(DeleteLeadSourceInput input)
        {
            CheckErrors(await _leadSourceManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetLeadSourceOutput>> GetLeadSources()
        {
            var getall = await _leadSourceManager.GetAllList();
            return Mapper.Map<List<GetLeadSourceOutput>>(getall);
        }

        public async Task<GetLeadSourceOutput> GetLeadSource(GetLeadSourceInput input)
        {
            var getbyid = await _leadSourceManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetLeadSourceOutput>(getbyid);
        }

        public async Task UpdateLeadSource(UpdateLeadSourceInput input)
        {
            LeadSource output = Mapper.Map<UpdateLeadSourceInput, LeadSource>(input);
            CheckErrors(await _leadSourceManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
