using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface ITransactionManager: IDomainService
    {
        Task<IEnumerable<Transaction>> GetAllList();
        Task<Transaction> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Transaction entity);
        Task<IdentityResult> UpdateAsync(Transaction entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
