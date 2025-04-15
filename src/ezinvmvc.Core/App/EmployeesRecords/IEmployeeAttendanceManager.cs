using Abp.Domain.Services;
using ezinvmvc.App.EmployeesRecords.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmployeeAttendanceManager : IDomainService
    {
        Task<IEnumerable<EmployeeAttendance>> GetAllEmployeeAttendanceAsync(string filter);

        Task<EmployeeAttendance> GetEmployeeAttendanceByIdAsync(int id);

        Task<IdentityResult> CreateEmployeeAttendanceAsync(EmployeeAttendance entity);

        Task<IdentityResult> UpdateEmployeeAttendanceAsync(EmployeeAttendance entity);

        Task<IdentityResult> DeleteEmployeeAttendancesAsync(int id);
    }
}
