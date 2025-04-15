using Abp.Domain.Services;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface IQuotationOtherItemsManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(QuotationOtherItem entity);
        Task<IdentityResult> UpdateAsync(QuotationOtherItem entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<RFQOtherDetails> GetByIdAsync(int id);
        Task<IEnumerable<QuotationOtherItem>> GetAllListAsync(int parentid);
    }
}
