using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{

    [AbpAuthorize(PermissionNames.Master_Employees)]
    public class EmployeeDetailsService : ezinvmvcAppServiceBase, IEmployeeDetailsService
    {
        private readonly IEmployeeDetailsManager _Manager;

        public EmployeeDetailsService(IEmployeeDetailsManager EmployeeDetailManager)
        {
            _Manager = EmployeeDetailManager;
        }

        public async Task<GetEmployeeDetailsOutput> GetEmployeeDetail(GetEmployeeDetailsInput input)
        {
            var getbyid = await _Manager.GetByIdAsync(input.EmployeeId);
            return Mapper.Map<GetEmployeeDetailsOutput>(getbyid);
        } 
        
        public async Task CreateEmployeeDetails(CreateEmployeeDetailsInput input)
        {
            EmployeeDetails output = Mapper.Map<EmployeeDetails>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task UpdateEmployeeDetails(UpdateEmployeeDetailsInput input)
        {
            EmployeeDetails output = Mapper.Map<UpdateEmployeeDetailsInput, EmployeeDetails>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<GetEmployeeDetailsOutput>> GetDetailId(GetEmployeeDetailsInput input)
        {
            var getbyid = await _Manager.GetDetailId(input.EmployeeId);
            return Mapper.Map<List<GetEmployeeDetailsOutput>>(getbyid);
        }
    }
}
