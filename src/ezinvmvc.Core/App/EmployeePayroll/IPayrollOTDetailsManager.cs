using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollOTDetailsManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(PayrollOTDetails entity);
        Task<IEnumerable<PayrollOTDetails>> GetListAsync(string filter);
        Task<PayrollOTDetails> GetbyIdAsync(int id);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IdentityResult> UpdateAsync(PayrollOTDetails entity);
        Task<IEnumerable<PayrollOTDetails>> UpdateDelete(string filter);
    }
}
