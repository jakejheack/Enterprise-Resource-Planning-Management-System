using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.GroupTypes.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.GroupTypes
{
    public class GroupTypeService : ezinvmvcAppServiceBase, IGroupTypeService
    {
        private readonly IGroupTypeManager _Manager;

        public GroupTypeService(IGroupTypeManager GroupTypeManager)
        {
            _Manager = GroupTypeManager;
        }

        public async Task CreateGroupType(CreateGroupTypeInput input)
        {
            GroupType output = Mapper.Map<GroupType>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteGroupType(DeleteGroupTypeInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<GetGroupTypeOutput> GetGroupType(GetGroupTypeInput input)
        {
            var getbyid = await _Manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetGroupTypeOutput>(getbyid);
        }

        public async Task<IEnumerable<GetGroupTypeGroupOutput>> GetGroupTypeGroup()
        {
            var getall = await _Manager.GetAll();
            return Mapper.Map<List<GetGroupTypeGroupOutput>>(getall);
        }

        public async Task<PagedResultDto<GetGroupTypeOutput>> GetGroupTypes(GetGroupTypeListInput input)
        {
            var resultList = await _Manager.GetAllList(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetGroupTypeOutput>(listcount, ObjectMapper.Map<List<GetGroupTypeOutput>>(resultList));
        }
        
        public async Task UpdateGroupType(UpdateGroupTypeInput input)
        {
            GroupType output = Mapper.Map<UpdateGroupTypeInput, GroupType>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

    }
   
}
