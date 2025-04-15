using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using ezinvmvc.App.Addresses.Dto;

namespace ezinvmvc.App.Addresses
{
    public interface ICityService : IApplicationService
    {
        Task<IEnumerable<GetCityOutput>> GetCitys();
        Task<int> CreateCity(CreateCityInput input);
        Task UpdateCity(UpdateCityInput input);
        Task DeleteCity(DeleteCityInput input);
        Task<GetCityOutput> GetCity(GetCityInput input);
    }
}
