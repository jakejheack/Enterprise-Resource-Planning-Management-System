using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadSourceManager : IDomainService
    {
        Task<IEnumerable<LeadSource>> GetAllList();
        Task<LeadSource> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(LeadSource entity);
        Task<IdentityResult> UpdateAsync(LeadSource entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
