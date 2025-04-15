using Abp.Domain.Services;
using ezinvmvc.App.EmployeesLoans.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public interface ILoanTitleManager : IDomainService
    {
        Task<IdentityResult> CreateLoanTitleAsync(LoanTitle entity);
        Task<IEnumerable<LoanTitle>> GetLoanTitleIdAsync();
        Task<IEnumerable<LoanTitle>> GetLoanTitleIdDedAsync();
    }
}