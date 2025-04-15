using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;

namespace ezinvmvc.App.Products
{
    public class UnitService : ezinvmvcAppServiceBase, IUnitService
    {
        private readonly IUnitManager _manager;

        public UnitService(IUnitManager manager)
        {
            _manager = manager;
        }

        public async Task CreateUnit(CreateUnitInput input)
        {
            Unit output = Mapper.Map<Unit>(input);
            CheckErrors(await _manager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteUnit(DeleteUnitInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetUnitOutput> GetUnit(GetUnitInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetUnitOutput>(getbyid);
        }
          public async Task<PagedResultDto<GetUnitOutput>> GetUnits()
        {
            var resultList = await _manager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetUnitOutput>(listcount, ObjectMapper.Map<List<GetUnitOutput>>(resultList));
        }

        public async Task UpdateUnit(UpdateUnitInput input)
        {
            Unit output = Mapper.Map<Unit>(input);
            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
