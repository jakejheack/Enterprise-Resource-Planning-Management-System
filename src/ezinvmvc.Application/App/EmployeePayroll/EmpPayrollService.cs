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
    public class EmpPayrollService : ezinvmvcAppServiceBase, IEmpPayrollService
    {
        private readonly IEmpPayrollManager _Manager;

        public EmpPayrollService(IEmpPayrollManager empPayrollManager)
        {
            _Manager = empPayrollManager;
        }

        public async Task CreateEmpPayrollAsync(CreateEmpPayrollInput input)
        {
            EmpPayroll output = Mapper.Map<EmpPayroll>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmpPayrollAsync(DeleteEmpPayrollInput input)
        {
            CheckErrors(await _Manager.DeleteEmpPayrollAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmpPayrollOutput>> GetEmpPayrollAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetEmpPayrollAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpPayrollOutput>>(resultList));

        }

        public Task<GetEmpPayrollOutput> UpdateEmpPayrollAsync(GetEmpPayrollInput input)
        {
            throw new NotImplementedException();
        }
        public async Task<PagedResultDto<GetEmpPayrollOutput>> Get13thmonthAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetEmp13thMonthPayAsync(input.Filter,input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetEmpPayrollOutput>(listcount, ObjectMapper.Map<List<GetEmpPayrollOutput>>(resultList));
        }

    }
}
