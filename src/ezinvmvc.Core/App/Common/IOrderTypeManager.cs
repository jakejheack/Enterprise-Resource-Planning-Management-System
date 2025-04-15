using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
  public  interface IOrderTypeManager : IDomainService
    {
        Task<IEnumerable<OrderType>> GetAllList();
        Task<OrderType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(OrderType entity);
        Task<IdentityResult> UpdateAsync(OrderType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
