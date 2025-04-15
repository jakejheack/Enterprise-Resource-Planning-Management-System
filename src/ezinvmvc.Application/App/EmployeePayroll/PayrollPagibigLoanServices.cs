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
    public class PayrollPagibigLoanServices : ezinvmvcAppServiceBase, IPayrollPagibigLoanServices
    {
        private readonly IPayrollPagibigLoanManager _Manager;

        public PayrollPagibigLoanServices(IPayrollPagibigLoanManager payrollPagibigLoanManager)
        {
            _Manager = payrollPagibigLoanManager;
        }

        public async Task CreateAsync(CreatePayrollPagibigLoanInput input)
        {
            PayrollPagibigLoan output = Mapper.Map<PayrollPagibigLoan>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollPagibigLoanInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollPagibigLoanOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollPagibigLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollPagibigLoanOutput>>(resultList));

        }

        public async Task<GetPayrollPagibigLoanOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollPagibigLoanOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollPagibigLoanInput input)
        {
            PayrollPagibigLoan output = Mapper.Map<UpdatePayrollPagibigLoanInput, PayrollPagibigLoan>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
