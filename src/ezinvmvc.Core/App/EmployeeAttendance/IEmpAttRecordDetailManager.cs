using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeAttendance
{
    public interface IEmpAttRecordDetailManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(EmpAttRecordDetail entity);
        Task<IEnumerable<EmpAttRecordDetail>> GetEmpAttDetailAsync(string filter);
        Task<IdentityResult> DeleteEmpAttDetailAsync(int id);
        Task<IdentityResult> UpdateEmpAttDetailsAsync(EmpAttRecordDetail entity);

        Task<IEnumerable<EmpAttRecordDetail>> GetBasicSalaryCurrentAsync(int EmpId, string AttRecId);
        Task<IEnumerable<EmpAttRecordDetail>> GetBasicSalaryAdjustmentAsync(int EmpId, string AttRecId);
        Task<IEnumerable<EmpAttRecordDetail>> GetAbsensesCurrentAsync(int EmpId, string AttRecId);
        Task<IEnumerable<EmpAttRecordDetail>> GetTardinessCurrentAsync(int EmpId, string AttRecId);
        Task<IEnumerable<EmpAttRecordDetail>> GetUndertimeCurrentAsync(int EmpId, string AttRecId);
        Task<IEnumerable<EmpAttRecordDetail>> GetRGOTCurrentAsync(int EmpId, string AttRecId);
        Task<IEnumerable<EmpAttRecordDetail>> GetSSSCurrentAsync(decimal SSSAmount);
        Task<IEnumerable<EmpAttRecordDetail>> GetPhilhealthCurrentAsync();
        Task<IEnumerable<EmpAttRecordDetail>> GetPagIbigCurrentAsync();

        Task<IEnumerable<EmpAttRecordDetail>> GetLoanAsync(int EmpId, int LoanTitle);
        Task<IEnumerable<EmpAttRecordDetail>> GetTaxAmountAsync(string compensation, decimal SSSAmount);
        Task<IEnumerable<EmpAttRecordDetail>> GetTaxAmountDailyAsync(string compensation, decimal SSSAmount);


        Task<IEnumerable<EmpAttRecordDetail>> GetLoanListAsync(string filter);

        //wilson 01092024
        Task<IEnumerable<EmpAttRecordDetail>> GetLoanAppAsync(int EmpId, int LoanTitle, int DedId);

        //wilson 02152024
        Task<IEnumerable<EmpAttRecordDetail>> Get201ListAsync(string filter, string sorting);
    }
}
