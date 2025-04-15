using Abp.Domain.Services;
using ezinvmvc.App.EmployeesAllowance.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesAllowance
{
    public interface IEmployeeAllowanceManager
    {
        Task<IEnumerable<EmployeeAllowances>> GetAllEmployeeAllowancesAsync(string filter);

        Task<IEnumerable<EmployeeAllowances>> GetAllTop1EmployeeAllowancesAsync(int empId);

        Task<IEnumerable<EmployeeAllowances>> GetTop1EmpAllowancesAsync(int empId);
        
        Task<IEnumerable<EmployeeAllowances>> GetNonTaxEmpAllowancesAsync(int empId);

        Task<IEnumerable<EmployeeAllowances>> UpdateEmployeeAllowancesByIdAsync(int empId);

        Task<EmployeeAllowances> GetEmployeeAllowancesByIdAsync(int id);

        Task<IdentityResult> CreateEmployeeAllowancesAsync(EmployeeAllowances entity);

        Task<IdentityResult> UpdateEmployeeAllowancesAsync(EmployeeAllowances entity);

        Task<IdentityResult> DeleteEmployeeAllowancesAsync(int id);
    }
}
