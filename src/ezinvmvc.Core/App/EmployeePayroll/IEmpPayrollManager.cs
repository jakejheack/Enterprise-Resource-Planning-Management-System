using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IEmpPayrollManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(EmpPayroll entity);
        Task<IEnumerable<EmpPayroll>> GetEmpPayrollAsync(string filter);
        Task<IdentityResult> DeleteEmpPayrollAsync(int id);
        Task<IdentityResult> UpdateEmpPayrollsAsync(EmpPayroll entity);
        Task<IEnumerable<EmpPayroll>> GetEmp13thMonthPayAsync(string filter, string sorting);

    }
}
