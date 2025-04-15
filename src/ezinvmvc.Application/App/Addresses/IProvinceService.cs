using Abp.Application.Services;
using ezinvmvc.App.Addresses.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface IProvinceService : IApplicationService
    {
        Task<IEnumerable<GetProvinceOutput>> GetProvinces();
        Task<IEnumerable<GetCityOutput>> GetCities(GetProvinceInput input);
        Task<int> CreateProvince(CreateProvinceInput input);
        Task UpdateProvince(UpdateProvinceInput input);
        Task DeleteProvince(DeleteProvinceInput input);
        Task<GetProvinceOutput> GetProvince(GetProvinceInput input);
    }
}
