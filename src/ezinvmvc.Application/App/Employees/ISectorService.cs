using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface ISectorService : IApplicationService
    {
        Task<PagedResultDto<GetSectorOutput>> GetSector(GetSectorListInput input);
        Task CreateSector(CreateSectorInput input);
        Task UpdateSector(UpdateSectorInput input);
        Task DeleteSector(DeleteSectorInput input);
        Task<IEnumerable<GetSectorOutput>> GetAllSectors();
    }
}
