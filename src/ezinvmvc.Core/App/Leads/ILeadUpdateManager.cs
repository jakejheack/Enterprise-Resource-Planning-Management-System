using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadUpdateManager : IDomainService
    {
        Task<IEnumerable<LeadUpdate>> GetAllListByLeadId(int leadid, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<LeadUpdate>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<LeadUpdate> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(LeadUpdate entity);
        Task<IdentityResult> UpdateAsync(LeadUpdate entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
