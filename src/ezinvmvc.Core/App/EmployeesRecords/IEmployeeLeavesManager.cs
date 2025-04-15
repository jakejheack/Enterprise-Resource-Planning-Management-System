using Abp.Domain.Services;
using ezinvmvc.App.EmployeesRecords.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmployeeLeavesManager : IDomainService
    {
        Task<IEnumerable<EmployeeLeaves>> GetAllEmployeeLeavesAsync(string filter);

        Task<EmployeeLeaves> GetEmployeeLeavesByIdAsync(int id);

        Task<IdentityResult> CreateEmployeeLeavesAsync(EmployeeLeaves entity);

        Task<IdentityResult> UpdateEmployeeLeavesAsync(EmployeeLeaves entity);

        Task<IdentityResult> DeleteEmployeeLeavesAsync(int id);
    }
}
