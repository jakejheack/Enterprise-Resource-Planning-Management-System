using System.Threading.Tasks;
using Abp.Application.Services;
using ezinvmvc.Sessions.Dto;

namespace ezinvmvc.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
