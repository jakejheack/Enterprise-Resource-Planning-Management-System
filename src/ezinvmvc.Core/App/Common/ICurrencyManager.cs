using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface ICurrencyManager : IDomainService
    {
        Task<IEnumerable<Currency>> GetAllList();
        Task<Currency> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Currency entity);
        Task<IdentityResult> UpdateAsync(Currency entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}

