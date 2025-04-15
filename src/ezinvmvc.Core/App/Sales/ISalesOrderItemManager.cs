using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface ISalesOrderItemManager : IDomainService
    {
        Task<IEnumerable<SalesOrderItem>> GetAllByParentId(int parentid);
        Task<SalesOrderItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SalesOrderItem entity);
        Task<IdentityResult> UpdateAsync(SalesOrderItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
