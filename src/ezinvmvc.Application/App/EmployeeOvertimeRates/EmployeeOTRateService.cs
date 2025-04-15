using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeeOvertimeRates.Dto;
using ezinvmvc.App.EmployeeOvertimeRates.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeOvertimeRates
{
    public class EmployeeOTRateService : ezinvmvcAppServiceBase, IEmployeeOTRateService
    {
        private readonly IEmployeeOTRateManager _Manager;

        public EmployeeOTRateService(IEmployeeOTRateManager employeeOTRateManager)
        {
            _Manager = employeeOTRateManager;
        }

        public async Task CreateEmployeeOTRates(CreateEmployeeOTRatesInput input)
        {
            EmployeeOTRates output = Mapper.Map<EmployeeOTRates>(input);

            CheckErrors(await _Manager.CreateEmployeeOTRatesAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeOTRatesAsync(DeleteEmployeeOTRateInput input)
        {
            CheckErrors(await _Manager.DeleteEmployeeOTRatesAsync(input.Id));
        }

        public async Task<PagedResultDto<EmployeeOTRatesOutput>> GetEmployeeOTRatesAsync(GetEmployeeOTRatesListInput input)
        {
            var resultList = await _Manager.GetAllEmployeeOTRatesAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<EmployeeOTRatesOutput>(listcount, ObjectMapper.Map<List<EmployeeOTRatesOutput>>(resultList));
        }

        public async Task<EmployeeOTRatesOutput> GetTop1EmployeeOTRatesAsync(GetEmployeeOTRatesInput input)
        {
            var getbyid = await _Manager.GetTop1EmployeeOTRatesAsync(input.EmpId);
            return Mapper.Map<EmployeeOTRatesOutput>(getbyid); 
        }

        public async Task<EmployeeOTRatesOutput> UpdateEmployeeOTRatesAsync(GetEmployeeOTRatesInput input)
        {
            var getbyid = await _Manager.UpdateAllEmployeeOTRatesAsync(input.EmpId);
            return Mapper.Map<EmployeeOTRatesOutput>(getbyid);
        }

    }
}
