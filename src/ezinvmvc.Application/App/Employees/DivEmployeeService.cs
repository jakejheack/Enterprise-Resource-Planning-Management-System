using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees.Models;
using ezinvmvc.Authorization;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    [AbpAuthorize(PermissionNames.Master_Employees)]
    public class DivEmployeeService : ezinvmvcAppServiceBase, IDivEmployeeService
    {
        private readonly IDivEmployeeManager _Manager;

        public DivEmployeeService(IDivEmployeeManager DivEmployeeManager)
        {
            _Manager = DivEmployeeManager;
        }

        public async Task CreateDivEmployee(CreateDivEmployeeInput input)
        {
            DivEmployee output = Mapper.Map<DivEmployee>(input);

            CheckErrors(await _Manager.CreateDivEmployeeAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteDivEmployee(DeleteDivEmployeeInput input)
        {
            CheckErrors(await _Manager.DeleteDivEmployeeAsync(input.Id));
        }

        public async Task<IEnumerable<GetDivEmployeeOutput>> GetAllDivEmployees()
        {
            var getall = await _Manager.GetAllDivEmployee();
            return Mapper.Map<List<GetDivEmployeeOutput>>(getall);
        }

        public async Task<PagedResultDto<GetDivEmployeeOutput>> GetDivEmployee(GetDivEmployeeListInput input)
        {
            var resultList = await _Manager.GetAllDivEmployeeList(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetDivEmployeeOutput>(listcount, ObjectMapper.Map<List<GetDivEmployeeOutput>>(resultList));
        }

        public async Task UpdateDivEmployee(UpdateDivEmployeeInput input)
        {
            DivEmployee output = Mapper.Map<UpdateDivEmployeeInput, DivEmployee>(input);
            CheckErrors(await _Manager.UpdateDivEmployeeAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
