using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IEmployeeDetailsManager : IDomainService
    {
        Task<EmployeeDetails> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(EmployeeDetails entity);
        Task<IdentityResult> UpdateAsync(EmployeeDetails entity);
        Task<IEnumerable<EmployeeDetails>> GetDetailId(int id);
    }
}
