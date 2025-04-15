using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollOtherLoanManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollOtherLoan entity);
        Task<IEnumerable<PayrollOtherLoan>> GetListAsync(string filter);
        Task<PayrollOtherLoan> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollOtherLoan entity);
        Task<IEnumerable<PayrollOtherLoan>> UpdateDelete(string filter);
    }
}
