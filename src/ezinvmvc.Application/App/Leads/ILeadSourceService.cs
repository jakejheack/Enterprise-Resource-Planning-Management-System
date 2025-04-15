using Abp.Application.Services;
using ezinvmvc.App.Leads.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadSourceService : IApplicationService
    {
        Task<IEnumerable<GetLeadSourceOutput>> GetLeadSources();
        Task CreateLeadSource(CreateLeadSourceInput input);
        Task UpdateLeadSource(UpdateLeadSourceInput input);
        Task DeleteLeadSource(DeleteLeadSourceInput input);
        Task<GetLeadSourceOutput> GetLeadSource(GetLeadSourceInput input);
    }
}
