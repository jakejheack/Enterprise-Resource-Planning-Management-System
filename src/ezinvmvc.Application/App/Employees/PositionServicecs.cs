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
    public class PositionService : ezinvmvcAppServiceBase, IPositionService
    {
        private readonly IPositionManager _Manager;
        public PositionService(IPositionManager PositionManager)
        {
            _Manager = PositionManager;
        }

        public async Task CreatePosition(CreatePositionInput input)
        {
            Position output = Mapper.Map<Position>(input);

            CheckErrors(await _Manager.CreatePositionAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeletePosition(DeletePositionInput input)
        {
            CheckErrors(await _Manager.DeletePositionAsync(input.Id));
        }

        public async Task<IEnumerable<GetPositionOutput>> GetAllPositions()
        {
            var getall = await _Manager.GetAllPositions();
            return Mapper.Map<List<GetPositionOutput>>(getall);
        }

        public async Task<PagedResultDto<GetPositionOutput>> GetPosition(GetPositionListInput input)
        {
            var resultList = await _Manager.GetAllPositionsList(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetPositionOutput>(listcount, ObjectMapper.Map<List<GetPositionOutput>>(resultList));
        }

        public async Task UpdatePosition(UpdatePositionInput input)
        {
            Position output = Mapper.Map<UpdatePositionInput, Position>(input);
            CheckErrors(await _Manager.UpdatePositionAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
