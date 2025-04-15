using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface ISalesOrderChargeManager : IDomainService
    {
        Task<IEnumerable<SalesOrderCharge>> GetAllByParentId(int parentid);
        Task<SalesOrderCharge> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SalesOrderCharge entity);
        Task<IdentityResult> UpdateAsync(SalesOrderCharge entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
