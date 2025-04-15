using Abp.Domain.Services;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(Payroll entity);
        Task<IdentityResult> UpdateAsync(Payroll entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<Payroll>> GetListAsync(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Payroll> GetbyIdAsync(int id);
        Task<IEnumerable<Payroll>> GetbyIdDetailsAsync(int id);
        Task<IEnumerable<Payroll>> GetAttendanceRecordAsync(string filter, string sorting);
        Task<IEnumerable<Payroll>> GetPRSummaryListAsync(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Payroll>> GetSSSSummaryListAsync(string filter, string sorting);
        Task<IEnumerable<Payroll>> GetPhltSummaryListAsync(string filter, string sorting);
        Task<IEnumerable<Payroll>> GetPgbtSummaryListAsync(string filter, string sorting);

        Task<IEnumerable<Payroll>> GetAttAdjSummaryListAsync(string filter, string sorting);

        Task<IEnumerable<Payroll>> GetPayrollDetailsListAsync(string filter, string sorting);
        Task<IEnumerable<Payroll>> GetLeaveCountListAsync(string filter);
        Task<IEnumerable<Payroll>> GetPayrollJournalDetailAsync(string filter, string sorting);
    }
}
