using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface IPaymentTermManager: IDomainService
    {
        Task<IEnumerable<PaymentTerm>> GetAllList();
        Task<PaymentTerm> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(PaymentTerm entity);
        Task<IdentityResult> UpdateAsync(PaymentTerm entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
