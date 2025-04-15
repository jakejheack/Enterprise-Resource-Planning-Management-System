using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmpAttRecords.DTO;
using ezinvmvc.App.EmployeeAttendance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmpAttRecords
{
    public class EmpAttRecordService : ezinvmvcAppServiceBase, IEmpAttRecordService
    {
        private readonly IEmpAttRecordManager _Manager;
        private readonly IEmpAttRecordDetailManager _DetailManager;

        public EmpAttRecordService(IEmpAttRecordManager manager, IEmpAttRecordDetailManager detailManager)
        {
            _Manager = manager;
            _DetailManager = detailManager;
        }

        public async Task<int> CreateEmpAttAsync(CreateEmpAttInput empAttInput)
        {
            EmpAttRecord empAttOutput = Mapper.Map<EmpAttRecord>(empAttInput.EmpAttInputs);

            CheckErrors(await _Manager.CreateAsync(empAttOutput));

            foreach (EmpAttDetailsInput item in empAttInput.EmpAttDetailsInputs)
            {
                item.EmpId = empAttOutput.EmpId;
                EmpAttRecordDetail orderitemoutput = Mapper.Map<EmpAttRecordDetail>(item);
                CheckErrors(await _DetailManager.CreateAsync(orderitemoutput));
            }
            await CurrentUnitOfWork.SaveChangesAsync();

            return empAttOutput.Id;
        }

        public async Task DeleteEmpAttId(DeleteAttIdInput input)
        {
            CheckErrors(await _Manager.DeleteEmpAttIdAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmpAttListOutput>> GetEmpAtt(GetEmpAttListInput input)
        {
            var resultList = await _Manager.GetEmpAttIdAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpAttListOutput>(listcount, ObjectMapper.Map<List<GetEmpAttListOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmpAttListOutput>> GetEmpAttRec(GetEmpAttListInput input)
        {
            var resultList = await _Manager.GetEmpAttAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpAttListOutput>(listcount, ObjectMapper.Map<List<GetEmpAttListOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmpAttRecordListOutput>> GetEmpAttRecordAsync(GetEmpAttListInput input)
        {
            var resultList = await _DetailManager.GetEmpAttDetailAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpAttRecordListOutput>(listcount, ObjectMapper.Map<List<GetEmpAttRecordListOutput>>(resultList));

        }        

        public async Task UpdateEmployeeLoansAsync(UpdateEmpAttDetailsInput input)
        {
            EmpAttRecordDetail output = Mapper.Map<UpdateEmpAttDetailsInput, EmpAttRecordDetail>(input);
            CheckErrors(await _DetailManager.UpdateEmpAttDetailsAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        

        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpGetBasicSalaryCurrent(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetBasicSalaryCurrentAsync(input.EmpId,input.AttRecId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpBasicSalaryAdjustment(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetBasicSalaryAdjustmentAsync(input.EmpId, input.AttRecId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpAbsensesCurrent(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetAbsensesCurrentAsync(input.EmpId, input.AttRecId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetEmpTardinessCurrent(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetTardinessCurrentAsync(input.EmpId, input.AttRecId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetUndertimeCurrent(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetUndertimeCurrentAsync(input.EmpId, input.AttRecId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetRGOTCurrentAsync(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetRGOTCurrentAsync(input.EmpId, input.AttRecId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetSSSAsync(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetSSSCurrentAsync(input.SSSAmount);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetPhilHealthAsync()
        {
            var resultList = await _DetailManager.GetPhilhealthCurrentAsync();
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetPagibigAsync()
        {
            var resultList = await _DetailManager.GetPagIbigCurrentAsync();
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetTaxAsync(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetTaxAmountAsync(input.Compensation,input.SSSAmount);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetLoanAmountAsync(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetLoanAsync(input.EmpId, input.LoanTitle);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetTaxDailyAsync(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetTaxAmountDailyAsync(input.Compensation, input.SSSAmount);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetLoanListAsync(GetEmpAttListInput input)
        {
            var resultList = await _DetailManager.GetLoanListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));

        }

        //wilson 01092024
        public async Task<PagedResultDto<GetEmpAttPayrollOutput>> GetLoanAmountAppAsync(PayrollListInput input)
        {
            var resultList = await _DetailManager.GetLoanAppAsync(input.EmpId, input.LoanTitle, input.DedId);
            int listcount = 0;
            return new PagedResultDto<GetEmpAttPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpAttPayrollOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmpAttRecordListOutput>> Get201ListAsync(GetEmpAttListInput input)
        {
            input.MaxResultCount = 10;
            var resultList = await _DetailManager.Get201ListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpAttRecordListOutput>(listcount, ObjectMapper.Map<List<GetEmpAttRecordListOutput>>(resultList));
        }

    }
}
