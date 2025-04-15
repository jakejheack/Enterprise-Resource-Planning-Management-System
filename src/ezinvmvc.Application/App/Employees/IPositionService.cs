using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IPositionService : IApplicationService
    {
        Task<PagedResultDto<GetPositionOutput>> GetPosition(GetPositionListInput input);
        Task CreatePosition(CreatePositionInput input);
        Task UpdatePosition(UpdatePositionInput input);
        Task DeletePosition(DeletePositionInput input);
        Task<IEnumerable<GetPositionOutput>> GetAllPositions();
    }
}
