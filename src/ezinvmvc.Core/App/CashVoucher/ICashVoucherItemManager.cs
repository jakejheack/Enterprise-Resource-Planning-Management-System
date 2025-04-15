using Abp.Domain.Services;
using ezinvmvc.App.CheckVoucher.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CashVoucher
{
    public interface ICashVoucherItemManager : IDomainService
    {
        Task<IEnumerable<CashVoucherItem>> GetAllByParentIdAsync(int parentid);
        Task<CashVoucherItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(CashVoucherItem entity);
        Task<IdentityResult> UpdateAsync(CashVoucherItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
