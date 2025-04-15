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
    public class SectorService : ezinvmvcAppServiceBase, ISectorService
    {
        private readonly ISectorsManager _Manager;

        public SectorService(ISectorsManager SectorManager)
        {
            _Manager = SectorManager;
        }

        public async Task CreateSector(CreateSectorInput input)
        {
            Sectors output = Mapper.Map<Sectors>(input);

            CheckErrors(await _Manager.CreateSectorsAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteSector(DeleteSectorInput input)
        {
            CheckErrors(await _Manager.DeleteSectorsAsync(input.Id));
        }

        public async Task<IEnumerable<GetSectorOutput>> GetAllSectors()
        {
            var getall = await _Manager.GetAllSectors();
            return Mapper.Map<List<GetSectorOutput>>(getall);
        }

        public async Task<PagedResultDto<GetSectorOutput>> GetSector(GetSectorListInput input)
        {
            var resultList = await _Manager.GetAllSectorsList(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetSectorOutput>(listcount, ObjectMapper.Map<List<GetSectorOutput>>(resultList));

        }

        public async Task UpdateSector(UpdateSectorInput input)
        {
            Sectors output = Mapper.Map<UpdateSectorInput, Sectors>(input);
            CheckErrors(await _Manager.UpdateSectorsAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
