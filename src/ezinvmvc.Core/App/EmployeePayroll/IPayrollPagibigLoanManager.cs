using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollPagibigLoanManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollPagibigLoan entity);
        Task<IEnumerable<PayrollPagibigLoan>> GetListAsync(string filter);
        Task<PayrollPagibigLoan> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollPagibigLoan entity);
        Task<IEnumerable<PayrollPagibigLoan>> UpdateDelete(string filter);
    }
}
