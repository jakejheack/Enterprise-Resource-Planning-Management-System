using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
   public interface IAccountGroupManager : IDomainService
    {
        Task<IEnumerable<AccountGroup>> GetAllList();
        Task<AccountGroup> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(AccountGroup entity);
        Task<IdentityResult> UpdateAsync(AccountGroup entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
