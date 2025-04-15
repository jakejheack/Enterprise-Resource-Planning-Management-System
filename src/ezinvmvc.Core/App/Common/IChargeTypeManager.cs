using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
 public   interface IChargeTypeManager : IDomainService
    {
        Task<IEnumerable<ChargeType>> GetAllList();
        Task<ChargeType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(ChargeType entity);
        Task<IdentityResult> UpdateAsync(ChargeType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
