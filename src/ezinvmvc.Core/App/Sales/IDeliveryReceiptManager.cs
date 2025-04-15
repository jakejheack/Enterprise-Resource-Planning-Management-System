using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface IDeliveryReceiptManager : IDomainService
    {
        Task<IEnumerable<DeliveryReceipt>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<DeliveryReceipt> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(DeliveryReceipt entity);
        Task<IdentityResult> UpdateAsync(DeliveryReceipt entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
