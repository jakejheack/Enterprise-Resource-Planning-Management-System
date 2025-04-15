using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IVATTypeManager : IDomainService
    {
        Task<IEnumerable<VATType>> GetAllList();
        Task<VATType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(VATType entity);
        Task<IdentityResult> UpdateAsync(VATType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
