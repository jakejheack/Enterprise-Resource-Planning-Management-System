using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollSSSLoanManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollSSSLoan entity);
        Task<IEnumerable<PayrollSSSLoan>> GetListAsync(string filter);
        Task<PayrollSSSLoan> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollSSSLoan entity);
        Task<IEnumerable<PayrollSSSLoan>> UpdateDelete(string filter);
        Task<IEnumerable<PayrollSSSLoan>> GetSSSLoanCollectionListAsync(string filter, string sorting, int offset, int fetch, bool forexport);

    }
}
