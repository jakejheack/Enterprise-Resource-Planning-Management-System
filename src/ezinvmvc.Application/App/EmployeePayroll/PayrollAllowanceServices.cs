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
    public class PayrollAllowanceServices : ezinvmvcAppServiceBase, IPayrollAllowanceServices
    {
        private readonly IPayrollAllowanceManager _Manager;

        public PayrollAllowanceServices(IPayrollAllowanceManager payrollAllowanceManager)
        {
            _Manager = payrollAllowanceManager;
        }

        public async Task CreateAsync(CreatePayrollAllowanceAdjustmentInput input)
        {
            PayrollAllowanceAdjustment output = Mapper.Map<PayrollAllowanceAdjustment>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollAllowanceAdjustmentInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollAllowanceAdjustmentOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollAllowanceAdjustmentOutput>(listcount, ObjectMapper.Map<List<GetPayrollAllowanceAdjustmentOutput>>(resultList));
        }

        public async Task<GetPayrollAllowanceAdjustmentOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollAllowanceAdjustmentOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollAllowanceAdjustmentInput input)
        {
            PayrollAllowanceAdjustment output = Mapper.Map<UpdatePayrollAllowanceAdjustmentInput, PayrollAllowanceAdjustment>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
