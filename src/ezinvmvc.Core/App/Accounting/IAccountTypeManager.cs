using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
   public interface IAccountTypeManager : IDomainService
    {
        Task<IEnumerable<AccountType>> GetAllList();
        Task<AccountType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(AccountType entity);
        Task<IdentityResult> UpdateAsync(AccountType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
