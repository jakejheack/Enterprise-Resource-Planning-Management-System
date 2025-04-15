using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
   public interface IAccountManager : IDomainService
    {
        Task<IEnumerable<Account>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Account> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Account entity);
        Task<IdentityResult> UpdateAsync(Account entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<Account>> GetByName(string name);
        Task<IEnumerable<Account>> GetByNode(string node);
        Task<IEnumerable<Account>> GetByParentNode(string parentnode);

    }
}
