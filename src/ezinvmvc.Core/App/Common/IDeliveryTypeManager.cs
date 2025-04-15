using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Common
{
  public interface IDeliveryTypeManager : IDomainService
    {
        Task<IEnumerable<DeliveryType>> GetAllList();
        Task<DeliveryType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(DeliveryType entity);
        Task<IdentityResult> UpdateAsync(DeliveryType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
