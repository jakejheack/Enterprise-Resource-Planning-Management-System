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
    public class PayrollAttAdjustmentServices : ezinvmvcAppServiceBase, IPayrollAttAdjustmentServices
    {
        private readonly IPayrollAttAdjustmentManager _Manager;

        public PayrollAttAdjustmentServices(IPayrollAttAdjustmentManager payrollAttAdjustmentManager)
        {
            _Manager = payrollAttAdjustmentManager;
        }

        public async Task CreateAsync(CreatePayrollAttAdjustmentInput input)
        {
            PayrollAttAdjustment output = Mapper.Map<PayrollAttAdjustment>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollAttAdjustmentInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollAttAdjustmentOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollAttAdjustmentOutput>(listcount, ObjectMapper.Map<List<GetPayrollAttAdjustmentOutput>>(resultList));
        }

        public async Task<GetPayrollAttAdjustmentOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollAttAdjustmentOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollAttAdjustmentInput input)
        {
            PayrollAttAdjustment output = Mapper.Map<UpdatePayrollAttAdjustmentInput, PayrollAttAdjustment>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
