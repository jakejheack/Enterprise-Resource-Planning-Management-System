using Abp.Domain.Services;
using ezinvmvc.App.EmployeesLoans.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public interface ILoanTypeManager : IDomainService
    {
        Task<IdentityResult> CreateLoanTypeAsync(LoanType entity);
        Task<IEnumerable<LoanType>> GetLoanTypeIdAsync(int TitleId);
    }
}
