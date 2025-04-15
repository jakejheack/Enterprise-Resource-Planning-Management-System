using Abp.Application.Services;
using ezinvmvc.App.Leads.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadTaskService : IApplicationService
    {
        Task<IEnumerable<GetLeadTaskOutput>> GetLeadTasks();
        Task CreateLeadTask(CreateLeadTaskInput input);
        Task UpdateLeadTask(UpdateLeadTaskInput input);
        Task DeleteLeadTask(DeleteLeadTaskInput input);
        Task<GetLeadTaskOutput> GetLeadTask(GetLeadTaskInput input);
    }
}
