using Abp.Domain.Services;
using ezinvmvc.App.Contribution;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Contribution
{
    public interface IEmpContributionManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(EmpContribution entity);
        Task<IdentityResult> UpdateAsync(EmpContribution entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<EmpContribution> GetDetailAsync(int empId);
        Task<IEnumerable<EmpContribution>> GetAllAsync(string filter);
        Task<EmpContribution> GetByIdAsync(int Id);
        Task<IEnumerable<EmpContribution>> GetEmpContributionAsync(string filter);

        Task<IEnumerable<EmpContribution>> GetPremiumDeductionListAsync(string filter, string sorting, int offset, int fetch, bool forexport);
    }
}
