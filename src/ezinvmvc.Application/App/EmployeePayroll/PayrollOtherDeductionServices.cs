using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeePayroll.Dto;
using ezinvmvc.App.EmployeePayroll.Models;

namespace ezinvmvc.App.EmployeePayroll
{
    public class PayrollOtherDeductionServices : ezinvmvcAppServiceBase, IPayrollOtherDeductionServices
    {
        private readonly IPayrollOtherDeductionManager _Manager;

        public PayrollOtherDeductionServices(IPayrollOtherDeductionManager payrollOtherDeductionManager)
        {
            _Manager = payrollOtherDeductionManager;
        }

        public async Task CreateAsync(CreatePayrollOtherDeductionInput input)
        {
            PayrollOtherDeduction output = Mapper.Map<PayrollOtherDeduction>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollAllowanceAdjustmentInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollOtherDeductionOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOtherDeductionOutput>(listcount, ObjectMapper.Map<List<GetPayrollOtherDeductionOutput>>(resultList));

        }

        public async Task<GetPayrollOtherDeductionOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollOtherDeductionOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollOtherDeductionInput input)
        {
            PayrollOtherDeduction output = Mapper.Map<UpdatePayrollOtherDeductionInput, PayrollOtherDeduction>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
