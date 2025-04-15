using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadTaskManager : IDomainService
    {
        Task<IEnumerable<LeadTask>> GetAllList();
        Task<LeadTask> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(LeadTask entity);
        Task<IdentityResult> UpdateAsync(LeadTask entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
