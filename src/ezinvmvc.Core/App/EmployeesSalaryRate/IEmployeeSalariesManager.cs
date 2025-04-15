using Abp.Domain.Services;
using ezinvmvc.App.EmployeesSalaryRate.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public interface IEmployeeSalariesManager : IDomainService
    {
        Task<IEnumerable<EmployeeSalaries>> GetAllEmployeeSalariesAsync(string filter);

        Task<IEnumerable<EmployeeSalaries>> GetAllTop1EmployeeSalariesAsync(int empId);

        Task<EmployeeSalaries> GetEmployeeSalariesByIdAsync(int id);

        Task<IdentityResult> CreateEmployeeSalariesAsync(EmployeeSalaries entity);

        Task<IdentityResult> UpdateEmployeeSalariesAsync(EmployeeSalaries entity);

        Task<IdentityResult> DeleteEmployeeSalariesAsync(int id);

        Task<IEnumerable<EmployeeSalaries>> GetTop1EmpSalariesAsync(int empId);
    }
}
