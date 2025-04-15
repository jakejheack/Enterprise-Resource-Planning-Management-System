using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollOtherDeductionManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollOtherDeduction entity);
        Task<IEnumerable<PayrollOtherDeduction>> GetListAsync(string filter);
        Task<PayrollOtherDeduction> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollOtherDeduction entity);
        Task<IEnumerable<PayrollOtherDeduction>> UpdateDelete(string filter);
    }
}
