using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Leads.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadUpdateService : IApplicationService
    {
        Task<PagedResultDto<GetLeadUpdateOutput>> GetLeadUpdates(GetLeadUpdateListInput input);
        Task<PagedResultDto<GetLeadUpdateOutput>> GetLeadUpdatesByLeadId(GetLeadUpdateListByLeadIdInput input);
        Task<CreateLeadUpdateOutput> CreateLeadUpdate(CreateLeadUpdateInput input);
        Task UpdateLeadUpdate(UpdateLeadUpdateInput input);
        Task DeleteLeadUpdate(DeleteLeadUpdateInput input);
        Task<GetLeadUpdateOutput> GetLeadUpdate(GetLeadUpdateInput input);
    }
}
