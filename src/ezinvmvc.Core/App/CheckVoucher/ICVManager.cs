using Abp.Domain.Services;
using ezinvmvc.App.CheckVoucher.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CheckVoucher
{
    public interface ICVManager : IDomainService
    {
        Task<IEnumerable<CV>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<CV> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(CV entity);
        Task<IdentityResult> UpdateAsync(CV entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<CV>> GetAP(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<CV>> GetAllByCVParentIdAsync(int parentid);
        //Task<IEnumerable<CV>> GetAllListbyDetails(string filter, string sorting, int offset, int fetch, bool forexport);
        //Task<CV> GetByIdCVAsync(int id);
    }
}
