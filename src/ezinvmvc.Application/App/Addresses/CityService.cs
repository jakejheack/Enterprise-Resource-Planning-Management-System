using AutoMapper;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Addresses.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class CityService : ezinvmvcAppServiceBase, ICityService
    {
        private readonly ICityManager _cityManager;

        public CityService(ICityManager cityManager)
        {
            _cityManager = cityManager;
        }

        public async Task<int> CreateCity(CreateCityInput input)
        {
            City output = Mapper.Map<City>(input);
            CheckErrors(await _cityManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteCity(DeleteCityInput input)
        {
            CheckErrors(await _cityManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetCityOutput>> GetCitys()
        {
            var getall = await _cityManager.GetAllList();
            return Mapper.Map<List<GetCityOutput>>(getall);
        }

        public async Task<GetCityOutput> GetCity(GetCityInput input)
        {
            var getbyid = await _cityManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCityOutput>(getbyid);
        }

        public async Task UpdateCity(UpdateCityInput input)
        {
            City output = Mapper.Map<City>(input);
            CheckErrors(await _cityManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
