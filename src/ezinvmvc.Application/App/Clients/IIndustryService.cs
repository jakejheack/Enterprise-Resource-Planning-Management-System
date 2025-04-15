using Abp.Application.Services;
using ezinvmvc.App.Clients.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Clients
{
    public interface IIndustryService : IApplicationService
    {
        Task<IEnumerable<GetIndustryOutput>> GetIndustries();
        Task CreateIndustry(CreateIndustryInput input);
        Task UpdateIndustry(UpdateIndustryInput input);
        Task DeleteIndustry(DeleteIndustryInput input);
        Task<GetIndustryOutput> GetIndustry(GetIndustryInput input);
    }
}
