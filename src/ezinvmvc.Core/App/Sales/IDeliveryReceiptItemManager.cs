using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface IDeliveryReceiptItemManager : IDomainService
    {
        Task<IEnumerable<DeliveryReceiptItem>> GetAllByParentId(int parentid);
        Task<DeliveryReceiptItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(DeliveryReceiptItem entity);
        Task<IdentityResult> UpdateAsync(DeliveryReceiptItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
