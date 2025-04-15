using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollIServices : IApplicationService
    {
        Task<int> CreatepayrollAsync(CreatePayroll input);
        Task<int> UpdateAsync(UpdatePayrollInput input);
        Task DeleteAsync(DeletePayrollInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollOutput> GetByIdAsync(GetEmpPayrollInput input);

        Task<PagedResultDto<GetPayrollOutput>> GetPayrollDetailsbyIdAsync(GetEmpPayrollInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetAttendanceListRecordAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetPRSummaryAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetSSSSummaryAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetPhlhltSummaryAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetPgbSummaryAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetAttAdjSummaryAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetPayrollDetailsAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetLeaveCountAsync(GetEmpPayrollListInput input);
        //Delete
        Task<PagedResultDto<GetPayrollOTDetailsOutput>> UpdateDeleteAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollAllowanceAdjustmentOutput>> UpdateDeleteAllowanceAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollAttAdjustmentOutput>> UpdateDeleteAttendaceAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollSSSLoanOutput>> UpdateDeleteSSSLoanAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollPagibigLoanOutput>> UpdateDeletePagibigLoanAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOtherLoanOutput>> UpdateDeleteOtherLoanAsync(GetEmpPayrollListInput input);
        Task<PagedResultDto<GetPayrollOutput>> GetPayrollJournalDetailListAsync(GetEmpPayrollListInput input);


    }
}
