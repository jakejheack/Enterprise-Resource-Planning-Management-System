using Abp.Domain.Services;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface IRFQOtherDetailsManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(RFQOtherDetails entity);
        Task<IdentityResult> UpdateAsync(RFQOtherDetails entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<RFQOtherDetails> GetByIdAsync(int id);
        Task<IEnumerable<RFQOtherDetails>> GetAllListAsync(int parentid);
    }
}
