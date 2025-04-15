using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollAllowanceManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollAllowanceAdjustment entity);
        Task<IEnumerable<PayrollAllowanceAdjustment>> GetListAsync(string filter);
        Task<PayrollAllowanceAdjustment> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollAllowanceAdjustment entity);
        Task<IEnumerable<PayrollAllowanceAdjustment>> UpdateDelete(string filter);
    }
}
