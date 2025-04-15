using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeePayroll.Models;

namespace ezinvmvc.App.EmployeePayroll.Dto
{
    public class PayrollIServices : ezinvmvcAppServiceBase, IPayrollIServices
    {
        private readonly IPayrollManager _Manager;
        private readonly IPayrollOTDetailsManager _payrollOTDetailsManager;
        private readonly IPayrollAllowanceManager _payrollAllowanceManager;
        private readonly IPayrollSSSLoanManager _payrollSSSLoanManager;
        private readonly IPayrollPagibigLoanManager _payrollPagibigLoanManager;
        private readonly IPayrollOtherLoanManager _payrollOtherLoanManager;
        private readonly IPayrollOtherDeductionManager _payrollOtherDeductionManager;
        private readonly IPayrollAttAdjustmentManager _payrollAttAdjustmentManager;

        public PayrollIServices(IPayrollManager payrollManager, IPayrollOTDetailsManager payrollOTDetailsManager, IPayrollAllowanceManager payrollAllowanceManager, IPayrollSSSLoanManager payrollSSSLoanManager, IPayrollPagibigLoanManager payrollPagibigLoanManager, IPayrollOtherLoanManager payrollOtherLoanManager, IPayrollOtherDeductionManager payrollOtherDeductionManager, IPayrollAttAdjustmentManager payrollAttAdjustmentManager)
        {
            _Manager = payrollManager;
            _payrollOTDetailsManager = payrollOTDetailsManager;
            _payrollAllowanceManager = payrollAllowanceManager;
            _payrollSSSLoanManager = payrollSSSLoanManager;
            _payrollPagibigLoanManager = payrollPagibigLoanManager;
            _payrollOtherLoanManager = payrollOtherLoanManager;
            _payrollOtherDeductionManager = payrollOtherDeductionManager;
            _payrollAttAdjustmentManager = payrollAttAdjustmentManager;
        }

        public async Task<int> CreatepayrollAsync(CreatePayroll input)
        {
            Payroll output = Mapper.Map<Payroll>(input.payroll);
            CheckErrors(await _Manager.CreateAsync(output));
            //OTdetails
            try
            {
                foreach (CreatePayrollOTDetailsInput otitem in input.otdetails)
                {
                    otitem.EmpId = output.EmpId;
                    PayrollOTDetails otoutput = Mapper.Map<PayrollOTDetails>(otitem);
                    CheckErrors(await _payrollOTDetailsManager.CreateAsync(otoutput));
                }
            }
            catch (Exception ex)
            {

            }
            //allowance
            try
            {
                foreach (CreatePayrollAllowanceAdjustmentInput allitem in input.allowanceadj)
                {
                    allitem.EmpId = output.EmpId;
                    PayrollAllowanceAdjustment allitemoutput = Mapper.Map<PayrollAllowanceAdjustment>(allitem);
                    CheckErrors(await _payrollAllowanceManager.CreateAsync(allitemoutput));
                }
            }
            catch (Exception ex)
            {

            }

            //sss
            try
            {
                foreach (CreatePayrollSSSLoanInput item in input.sssdetails)
                {
                    item.EmpId = output.EmpId;
                    PayrollSSSLoan sssloanoutput = Mapper.Map<PayrollSSSLoan>(item);
                    CheckErrors(await _payrollSSSLoanManager.CreateAsync(sssloanoutput));
                }
            }
            catch(Exception ex)
            {

            }

            //pgb
            try
            {
                foreach (CreatePayrollPagibigLoanInput pgbitem in input.pgbdetails)
                {
                    pgbitem.EmpId = output.EmpId;
                    PayrollPagibigLoan pgbloanoutput = Mapper.Map<PayrollPagibigLoan>(pgbitem);
                    CheckErrors(await _payrollPagibigLoanManager.CreateAsync(pgbloanoutput));
                }
            }
            catch (Exception ex)
            {

            }

            //othloan
            try
            {
                foreach (CreatePayrollOtherLoanInput othrloanbitem in input.othrloandetails)
                {
                    othrloanbitem.EmpId = output.EmpId;
                    PayrollOtherLoan pgbloanoutput = Mapper.Map<PayrollOtherLoan>(othrloanbitem);
                    CheckErrors(await _payrollOtherLoanManager.CreateAsync(pgbloanoutput));
                }
            }
            catch (Exception ex)
            {

            }

            //othded
            try
            {
                foreach (CreatePayrollOtherDeductionInput deditem in input.othrdeddetails)
                {
                    deditem.EmpId = output.EmpId;
                    PayrollOtherDeduction dedoutput = Mapper.Map<PayrollOtherDeduction>(deditem);
                    CheckErrors(await _payrollOtherDeductionManager.CreateAsync(dedoutput));
                }
            }
            catch (Exception ex)
            {

            }

            //attAdj
            try
            {
                foreach (CreatePayrollAttAdjustmentInput adjditem in input.attadjdetails)
                {
                    adjditem.EmpId = output.EmpId;
                    PayrollAttAdjustment adjoutput = Mapper.Map<PayrollAttAdjustment>(adjditem);
                    CheckErrors(await _payrollAttAdjustmentManager.CreateAsync(adjoutput));
                }
            }
            catch (Exception ex)
            {

            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteAsync(DeletePayrollInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<GetPayrollOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollOutput>(getbyid);
        }

        public async Task<int> UpdateAsync(UpdatePayrollInput input)
        {
            Payroll output = Mapper.Map<UpdatePayrollInput, Payroll>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetPayrollDetailsbyIdAsync(GetEmpPayrollInput input)
        {
            var resultList = await _Manager.GetbyIdDetailsAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetAttendanceListRecordAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetAttendanceRecordAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetPRSummaryAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetPRSummaryListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetSSSSummaryAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetSSSSummaryListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetPhlhltSummaryAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetPhltSummaryListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetPgbSummaryAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetPgbtSummaryListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetAttAdjSummaryAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetAttAdjSummaryListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetPayrollDetailsAsync(GetEmpPayrollListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetPayrollDetailsListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetPayrollOutput>> GetLeaveCountAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetLeaveCountListAsync(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

        //for update delete
        public async Task<PagedResultDto<GetPayrollOTDetailsOutput>> UpdateDeleteAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollOTDetailsManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOTDetailsOutput>(listcount, ObjectMapper.Map<List<GetPayrollOTDetailsOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollAllowanceAdjustmentOutput>> UpdateDeleteAllowanceAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollAllowanceManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollAllowanceAdjustmentOutput>(listcount, ObjectMapper.Map<List<GetPayrollAllowanceAdjustmentOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollAttAdjustmentOutput>> UpdateDeleteAttendaceAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollAttAdjustmentManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollAttAdjustmentOutput>(listcount, ObjectMapper.Map<List<GetPayrollAttAdjustmentOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollSSSLoanOutput>> UpdateDeleteSSSLoanAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollSSSLoanManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollSSSLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollSSSLoanOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollPagibigLoanOutput>> UpdateDeletePagibigLoanAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollPagibigLoanManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollPagibigLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollPagibigLoanOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollOtherLoanOutput>> UpdateDeleteOtherLoanAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollOtherLoanManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOtherLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollOtherLoanOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollOtherDeductionOutput>> UpdateDeleteOtherDedAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _payrollOtherDeductionManager.UpdateDelete(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOtherDeductionOutput>(listcount, ObjectMapper.Map<List<GetPayrollOtherDeductionOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetPayrollOutput>> GetPayrollJournalDetailListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetPayrollJournalDetailAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOutput>(listcount, ObjectMapper.Map<List<GetPayrollOutput>>(resultList));
        }

    }
}
