using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Accounting.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
   public interface ICollectionService : IApplicationService
    {
        Task<int> CreateCollection(CreateCollectionInput input);
        Task<PagedResultDto<CollectionOutput>> GetCollections(GetCollectionsInput input);
        Task<CollectionOutput> GetCollection(GetCollectionInput input);
        Task<int> UpdateCollection(UpdateCollectionInput input);

        Task<PagedResultDto<CollectionAppliedOutput>> GetCollectionAppliedByParentId(GetCollectionInput input);

    }
}
