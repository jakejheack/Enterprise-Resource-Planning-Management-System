using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Purchases
{
    public interface IOrderItemManager : IDomainService
    {
        Task<IEnumerable<OrderItem>> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(OrderItem entity);
        Task<IdentityResult> UpdateAsync(OrderItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
