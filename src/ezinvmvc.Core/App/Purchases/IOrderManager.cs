using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Purchases
{
    public interface IOrderManager : IDomainService
    {
        Task<IEnumerable<Order>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Order> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Order entity);
        Task<IdentityResult> UpdateAsync(Order entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
