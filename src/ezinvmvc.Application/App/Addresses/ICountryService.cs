using Abp.Application.Services;
using ezinvmvc.App.Addresses.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface ICountryService : IApplicationService
    {
        Task<IEnumerable<GetCountryOutput>> GetCountrys();
        Task<IEnumerable<GetProvinceOutput>> GetProvinces(GetCountryInput input);
        Task<int> CreateCountry(CreateCountryInput input);
        Task UpdateCountry(UpdateCountryInput input);
        Task DeleteCountry(DeleteCountryInput input);
        Task<GetCountryOutput> GetCountry(GetCountryInput input);
    }
}
