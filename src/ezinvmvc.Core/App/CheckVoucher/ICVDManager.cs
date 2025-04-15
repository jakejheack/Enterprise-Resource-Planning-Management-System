using Abp.Domain.Services;
using ezinvmvc.App.CheckVoucher.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CheckVoucher
{
    public interface ICVDManager : IDomainService
    {
        Task<IEnumerable<CVD>> GetAllByParentIdAsync(int parentid);
        Task<CVD> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(CVD entity);
        Task<IdentityResult> UpdateAsync(CVD entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
