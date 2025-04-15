using Abp.Domain.Services;
using ezinvmvc.App.Employees;
using ezinvmvc.App.EmployeesLoans.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public interface IEmployeeLoansManager : IDomainService
    {
        Task<IdentityResult> CreateEmployeeLoansAsync(EmployeeLoans entity);
        Task<IdentityResult> UpdateEmployeeLoansAsync(EmployeeLoans entity);
        Task<IdentityResult> DeleteEmployeeLoansAsync(int id);

        Task<IEnumerable<EmployeeLoans>> GetEmployeeDetailAsync(int empId);
        Task<IEnumerable<EmployeeLoans>> GetAllEmployeeLoansAsync(string filter);
        Task<IEnumerable<EmployeeLoans>> GetEmployeeLoansIdAsync(int Id);
        Task<IEnumerable<EmployeeLoans>> GetLoanListAsync(string filter, string sorting);

        Task<IEnumerable<EmployeeLoans>> ForceclosedloanAsync(int Id);
        Task<IEnumerable<EmployeeLoans>> GetEmpLoanListAsync(string filter, string sorting, int offset, int fetch, bool forexport);

        Task<IEnumerable<EmployeeLoans>> GetEmpLoanSSSAsync(string filter, string sorting);
        Task<IEnumerable<EmployeeLoans>> GetEmpLoanSSSListAsync(string filter, string sorting);

        Task<IEnumerable<EmployeeLoans>> GetEmpLoanPgbAsync(string filter, string sorting);
        Task<IEnumerable<EmployeeLoans>> GetEmpLoanPgbListAsync(string filter, string sorting);

        Task<IEnumerable<EmployeeLoans>> GetEmpLoanOthAsync(string filter, string sorting);
        Task<IEnumerable<EmployeeLoans>> GetEmpLoanOthListAsync(string filter, string sorting);

        Task<IEnumerable<EmployeeLoans>> GetLoanSummaryReportListAsync(string filter, string sorting, int offset, int fetch, bool forexport);

        Task<IEnumerable<EmployeeLoans>> GetEmpLoanCertListAsync(string filter, string sorting, int offset, int fetch, bool forexport);

    }
}
