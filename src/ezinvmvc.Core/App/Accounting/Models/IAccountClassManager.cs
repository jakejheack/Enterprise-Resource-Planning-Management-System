using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting.Models
{
    public interface IAccountClassManager : IDomainService
    {
        Task<IEnumerable<AccountClass>> GetAllList();
        Task<AccountClass> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(AccountClass entity);
        Task<IdentityResult> UpdateAsync(AccountClass entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
