using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.App.Notification.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadService : IApplicationService
    {
        Task<PagedResultDto<GetLeadOutput>> GetLeads(GetLeadListInput input);
        Task<PagedResultDto<GetLeadOutput>> GetLeadsforRFQ(GetLeadListInput input);
        Task<PagedResultDto<GetLeadOutput>> GetLeadsforRFQforEdit(GetLeadListInput input);
        Task<IEnumerable<GetLeadOutput>> GetLeadDetails(GetLeadInput input);
        Task<CreateLeadOutput> CreateLead(CreateLeadInput input);
        Task<CreateLeadOutput> UpdateLead(UpdateLeadInput input);
        Task DeleteLead(DeleteLeadInput input);
        Task<GetLeadOutput> GetLead(GetLeadInput input);
    }
}
