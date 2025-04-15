using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting 
{
  public  interface IGeneralLedgerManager : IDomainService
    {
        Task<IEnumerable<GeneralLedger>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<GeneralLedger>> GetAllByParentId(int parentid);
        Task<GeneralLedger> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(GeneralLedger entity);
        Task<IdentityResult> UpdateAsync(GeneralLedger entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<GeneralLedger>> GetTrialBalance(string filter, string sorting, int offset, int fetch, bool forexport);
    }
}
