using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.GroupTypes.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.GroupTypes
{
    public interface IGroupTypeService : IApplicationService
    {
        //Task<IEnumerable<GroupType>> GetAllList();
        Task<PagedResultDto<GetGroupTypeOutput>> GetGroupTypes(GetGroupTypeListInput input);
        Task CreateGroupType(CreateGroupTypeInput input);
        Task UpdateGroupType(UpdateGroupTypeInput input);
        Task DeleteGroupType(DeleteGroupTypeInput input);
        Task<IEnumerable<GetGroupTypeGroupOutput>>GetGroupTypeGroup();
    }
}
