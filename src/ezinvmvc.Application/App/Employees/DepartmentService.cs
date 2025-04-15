using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Employees
{
    [AbpAuthorize(PermissionNames.Master_Employees)]
    public class DepartmentService : ezinvmvcAppServiceBase, IDepartmentService
    {
        private readonly IDepartmentManager _Manager;

        public DepartmentService(IDepartmentManager DepartmentManager)
        {
            _Manager = DepartmentManager;
        }

        public async Task CreateGroupType(CreateDepartmentInput input)
        {
            Department output = Mapper.Map<Department>(input);

            CheckErrors(await _Manager.CreateDepartmentAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteGroupType(DeleteDepartmentInput input)
        {
            CheckErrors(await _Manager.DeleteDepartmentAsync(input.Id));
        }

        public async Task<IEnumerable<GetDepartmentOutput>> GetAllDepartment()
        {
            var getall = await _Manager.GetAllDepartment();
            return Mapper.Map<List<GetDepartmentOutput>>(getall);
        }

        public async Task<PagedResultDto<GetDepartmentOutput>> GetDepartments(GetDepartmentListInput input)
        {
            var resultList = await _Manager.GetAllDepartmentList(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetDepartmentOutput>(listcount, ObjectMapper.Map<List<GetDepartmentOutput>>(resultList));
        }

        public async Task UpdateGroupType(UpdateDepartmentInput input)
        {
            Department output = Mapper.Map<UpdateDepartmentInput, Department>(input);
            CheckErrors(await _Manager.UpdateDepartmentAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
