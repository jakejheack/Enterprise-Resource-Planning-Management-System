using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Sales
{
   public interface IDeliveryReceiptChargeManager : IDomainService
    {
        Task<IEnumerable<DeliveryReceiptCharge>> GetAllByParentId(int parentid);
        Task<DeliveryReceiptCharge> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(DeliveryReceiptCharge entity);
        Task<IdentityResult> UpdateAsync(DeliveryReceiptCharge entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
