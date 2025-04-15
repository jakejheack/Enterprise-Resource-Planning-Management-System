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
    public class PayrollOTDetailsServices : ezinvmvcAppServiceBase, IPayrollOTDetailsServices
    {
        private readonly IPayrollOTDetailsManager _Manager;

        public PayrollOTDetailsServices(IPayrollOTDetailsManager payrollOTDetailsManager)
        {
            _Manager = payrollOTDetailsManager;
        }

        public async Task CreateAsync(CreatePayrollOTDetailsInput input)
        {
            PayrollOTDetails output = Mapper.Map<PayrollOTDetails>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollOTDetailsInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollOTDetailsOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollOTDetailsOutput>(listcount, ObjectMapper.Map<List<GetPayrollOTDetailsOutput>>(resultList));
        }

        public async Task<GetPayrollOTDetailsOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollOTDetailsOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollOTDetailsOutput input)
        {
            PayrollOTDetails output = Mapper.Map<UpdatePayrollOTDetailsOutput, PayrollOTDetails>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }


    }
}
