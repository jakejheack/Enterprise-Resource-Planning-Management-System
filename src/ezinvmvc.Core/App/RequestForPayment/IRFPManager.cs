using Abp.Domain.Services;
using ezinvmvc.App.RequestForPayment.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.RequestForPayment
{
    public interface IRFPManager : IDomainService
    {
        Task<IEnumerable<RFP>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<RFP> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(RFP entity);
        Task<IdentityResult> UpdateAsync(RFP entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<RFP>> Autocomplete(string filter, string sorting, int offset, int fetch, bool forexport);
    }
}
