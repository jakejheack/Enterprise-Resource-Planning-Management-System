using AutoMapper;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Addresses.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class CountryService : ezinvmvcAppServiceBase, ICountryService
    {
        private readonly ICountryManager _countryManager;

        public CountryService(ICountryManager countryManager)
        {
            _countryManager = countryManager;
        }

        public async Task<int> CreateCountry(CreateCountryInput input)
        {
            Country output = Mapper.Map<Country>(input);
            output.IsDefault = false;
            CheckErrors(await _countryManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteCountry(DeleteCountryInput input)
        {
            CheckErrors(await _countryManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetCountryOutput>> GetCountrys()
        {
            var getall = await _countryManager.GetAllList();
            return Mapper.Map<List<GetCountryOutput>>(getall);
        }

        public async Task<GetCountryOutput> GetCountry(GetCountryInput input)
        {
            var getbyid = await _countryManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCountryOutput>(getbyid);
        }

        public async Task<IEnumerable<GetProvinceOutput>> GetProvinces(GetCountryInput input)
        {
            var getall = await _countryManager.GetProvinces(input.Id);
            return Mapper.Map<List<GetProvinceOutput>>(getall);
        }

        public async Task UpdateCountry(UpdateCountryInput input)
        {
            Country output = Mapper.Map<Country>(input);
            CheckErrors(await _countryManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
