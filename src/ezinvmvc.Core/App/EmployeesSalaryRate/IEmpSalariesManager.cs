using Abp.Domain.Services;
using ezinvmvc.App.EmployeesSalaryRate;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public interface IEmpSalariesManager : IDomainService
    {
        Task<IdentityResult> CreateEmpSalariesAsync(EmpSalaries entity);

        Task<IdentityResult> UpdateEmpSalariesAsync(EmpSalaries entity);

        Task<IdentityResult> DeleteEmpSalariesAsync(int id);

        Task<EmpSalaries> GetEmpSalariesByIdAsync(int id);

        Task<IEnumerable<EmpSalaries>> GetEmpSalariesAsync(string filter);

        Task<EmpSalaries> GetEmpSalIdAsync(int id);

        Task<IEnumerable<EmpSalaries>> GetOtListAsync(string filter, string sorting);
    }
}
