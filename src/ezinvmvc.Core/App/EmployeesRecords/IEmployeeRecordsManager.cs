using Abp.Domain.Services;
using ezinvmvc.App.EmployeesRecords.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmployeeRecordsManager : IDomainService
    {
        Task<IEnumerable<EmployeeRecords>> GetAllEmployeesRecordsAsync(string filter);

        Task<EmployeeRecords> GetEmployeesRecordsByIdAsync(int id);

        Task<IdentityResult> CreateEmployeesRecordsAsync(EmployeeRecords entity);

        Task<IdentityResult> UpdateEmployeesRecordsAsync(EmployeeRecords entity);

        Task<IdentityResult> DeleteEmployeesRecordsAsync(int id);
    }
}
