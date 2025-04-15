using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmpAttRecords.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmpAttRecords
{
    public interface IEmpAttRecordService : IApplicationService
    {
        Task<int> CreateEmpAttAsync(CreateEmpAttInput empAttInput);

        Task<PagedResultDto<GetEmpAttListOutput>> GetEmpAtt(GetEmpAttListInput input);

        Task<PagedResultDto<GetEmpAttRecordListOutput>> GetEmpAttRecordAsync(GetEmpAttListInput input);

        Task DeleteEmpAttId(DeleteAttIdInput input);

        Task UpdateEmployeeLoansAsync(UpdateEmpAttDetailsInput input);

        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpGetBasicSalaryCurrent(PayrollListInput input);
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpBasicSalaryAdjustment(PayrollListInput input);
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpAbsensesCurrent(PayrollListInput input);
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpTardinessCurrent(PayrollListInput input);
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetUndertimeCurrent(PayrollListInput input);
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetRGOTCurrentAsync(PayrollListInput input);

        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetSSSAsync(PayrollListInput input);
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetPhilHealthAsync();
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetPagibigAsync();

        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetTaxAsync(PayrollListInput input);

        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetLoanAmountAsync(PayrollListInput input);

        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetTaxDailyAsync(PayrollListInput input);

        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetLoanListAsync(GetEmpAttListInput input);

        //Wilson 01092024
        Task<PagedResultDto<GetEmpAttPayrollOutput>> GetLoanAmountAppAsync(PayrollListInput input);

        //Wilson 02152024
        Task<PagedResultDto<GetEmpAttRecordListOutput>> Get201ListAsync(GetEmpAttListInput input);

    }
}
