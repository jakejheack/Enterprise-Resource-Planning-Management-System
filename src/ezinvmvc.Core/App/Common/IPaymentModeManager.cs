using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IPaymentModeManager : IDomainService
    {
        Task<IEnumerable<PaymentMode>> GetAllList();
        Task<PaymentMode> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(PaymentMode entity);
        Task<IdentityResult> UpdateAsync(PaymentMode entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<PaymentMode>> GetAllListWithFilterAsync(string filter, string sorting);
    }
}
