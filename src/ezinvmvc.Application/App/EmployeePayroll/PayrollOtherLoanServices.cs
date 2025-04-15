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
    public class PayrollOtherLoanServices : ezinvmvcAppServiceBase, IPayrollOtherLoanServices
    {
        private readonly IPayrollOtherLoanManager _Manager;

        public PayrollOtherLoanServices(IPayrollOtherLoanManager payrollOtherLoanManager)
        {
            _Manager = payrollOtherLoanManager;
        }

        public async Task CreateAsync(CreatePayrollOtherLoanInput input)
        {
            PayrollOtherLoan output = Mapper.Map<PayrollOtherLoan>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollOtherLoanInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollOtherLoanOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOtherLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollOtherLoanOutput>>(resultList));

        }

        public async Task<GetPayrollOtherLoanOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollOtherLoanOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollOtherLoanInput input)
        {
            PayrollOtherLoan output = Mapper.Map<UpdatePayrollOtherLoanInput, PayrollOtherLoan>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
