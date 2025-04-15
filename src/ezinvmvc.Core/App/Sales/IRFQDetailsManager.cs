using Abp.Domain.Services;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface IRFQDetailsManager : IDomainService
    {
        Task<IEnumerable<RFQDetails>> GetAllByParentIdAsync(int parentid);
        Task<RFQDetails> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(RFQDetails entity);
        Task<IdentityResult> UpdateAsync(RFQDetails entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
