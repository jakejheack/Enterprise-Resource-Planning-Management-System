using AutoMapper;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Addresses.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class ProvinceService : ezinvmvcAppServiceBase, IProvinceService
    {
        private readonly IProvinceManager _provinceManager;

        public ProvinceService(IProvinceManager provinceManager)
        {
            _provinceManager = provinceManager;
        }

        public async Task<int> CreateProvince(CreateProvinceInput input)
        {
            Province output = Mapper.Map<Province>(input);
            CheckErrors(await _provinceManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteProvince(DeleteProvinceInput input)
        {
            CheckErrors(await _provinceManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetProvinceOutput>> GetProvinces()
        {
            var getall = await _provinceManager.GetAllList();
            return Mapper.Map<List<GetProvinceOutput>>(getall);
        }

        public async Task<GetProvinceOutput> GetProvince(GetProvinceInput input)
        {
            var getbyid = await _provinceManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetProvinceOutput>(getbyid);
        }

        public async Task<IEnumerable<GetCityOutput>> GetCities(GetProvinceInput input)
        {
            var getall = await _provinceManager.GetCities(input.Id);
            return Mapper.Map<List<GetCityOutput>>(getall);
        }

        public async Task UpdateProvince(UpdateProvinceInput input)
        {
            Province output = Mapper.Map<Province>(input);
            CheckErrors(await _provinceManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
