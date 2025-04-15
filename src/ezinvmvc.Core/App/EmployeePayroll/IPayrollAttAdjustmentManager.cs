using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollAttAdjustmentManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollAttAdjustment entity);
        Task<IEnumerable<PayrollAttAdjustment>> GetListAsync(string filter);
        Task<PayrollAttAdjustment> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollAttAdjustment entity);
        Task<IEnumerable<PayrollAttAdjustment>> UpdateDelete(string filter);
    }
}
