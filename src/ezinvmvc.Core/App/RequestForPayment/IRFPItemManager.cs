using Abp.Domain.Services;
using ezinvmvc.App.RequestForPayment.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.RequestForPayment
{
    public interface IRFPItemManager : IDomainService
    {
        Task<IEnumerable<RFPItem>> GetAllByParentIdAsync(int parentid);
        Task<RFPItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(RFPItem entity);
        Task<IdentityResult> UpdateAsync(RFPItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
