using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Clients.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Clients
{
   public interface IClientService : IApplicationService
    {
        Task<PagedResultDto<GetClientOutput>> GetClients(GetClientListInput input);
        Task<IEnumerable<GetClientOutput>> GetAllClients();
        Task<int> CreateClient(CreateClientInput input);
        Task UpdateClient(UpdateClientInput input);
        Task DeleteClient(DeleteClientInput input);
        Task<GetClientOutput> GetClient(GetClientInput input);
        Task<GetClientOutput> GetBillingAddressAsync(GetClientInput input);
        Task<GetClientOutput> GetBillingSIAddressAsync(GetClientInput input);
        Task<IEnumerable<GetClientOutput>> GetClientDetails(GetClientInput input);
    }
}
