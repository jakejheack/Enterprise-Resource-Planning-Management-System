using Abp.Domain.Services;
using ezinvmvc.App.Addresses.Models;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IAccountExecutiveManager : IDomainService
    {
        Task<IEnumerable<AccountExecutive>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<AccountExecutive> GetByIdAsync(int id);
        Task<AccountExecutive> GetByReferenceIdAsync(int id, string reference);
        Task<IdentityResult> CreateAsync(AccountExecutive entity);
        Task<IdentityResult> UpdateAsync(AccountExecutive entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
