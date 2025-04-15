using Abp.Domain.Services;
using ezinvmvc.App.CheckVoucher.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CashVoucher
{
    public interface ICashVoucherManager : IDomainService
    {
        Task<IEnumerable<CashVoucher>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<CashVoucher> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(CashVoucher entity);
        Task<IdentityResult> UpdateAsync(CashVoucher entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
