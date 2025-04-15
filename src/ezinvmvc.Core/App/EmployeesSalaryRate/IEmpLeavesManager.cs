using Abp.Domain.Services;
using ezinvmvc.App.EmployeesSalaryRate.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public interface IEmpLeavesManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(EmpLeaves entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(EmpLeaves entity);
        Task<IEnumerable<EmpLeaves>> GetAllAsync(string filter);
        Task<IEnumerable<EmpLeaves>> GetSickLeaveAsync(string filter);
        Task<IEnumerable<EmpLeaves>> GetVacationLeaveAsync(string filter);
        Task<IEnumerable<EmpLeaves>> GetPaternityLeaveAsync(string filter);
        Task<IEnumerable<EmpLeaves>> GetIncentiveLeaveAsync(string filter);
        Task<EmpLeaves> GetByIdAsync(int id);

    }
}
