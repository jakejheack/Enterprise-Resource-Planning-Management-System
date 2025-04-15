using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees.Models;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Employees
{
    [AbpAuthorize(PermissionNames.Master_Employees)]
    public class DivisionService : ezinvmvcAppServiceBase, IDivisionService
    {
        private readonly IDivsionManager _Manager;

        public DivisionService(IDivsionManager DivisionManager)
        {
            _Manager = DivisionManager;
        }

        public async Task CreateDivision(CreateDivisionInput input)
        {
            Division output = Mapper.Map<Division>(input);

            CheckErrors(await _Manager.CreateDivisionAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteDivision(DeleteDivisionInput input)
        {
            CheckErrors(await _Manager.DeleteDivisionAsync(input.Id));
        }

        public async Task<IEnumerable<GetDivisionOutput>> GetAllDivisions()
        {
            var getall = await _Manager.GetAllDivisions();
            return Mapper.Map<List<GetDivisionOutput>>(getall);
        }

        public async Task<PagedResultDto<GetDivisionOutput>> GetDivision(GetDivisionListInput input)
        {
            var resultList = await _Manager.GetAllDivisionList(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetDivisionOutput>(listcount, ObjectMapper.Map<List<GetDivisionOutput>>(resultList));
        }

        public async Task UpdateDivision(UpdateDivisionInput input)
        {
            Division output = Mapper.Map<UpdateDivisionInput, Division>(input);
            CheckErrors(await _Manager.UpdateDivisionAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
