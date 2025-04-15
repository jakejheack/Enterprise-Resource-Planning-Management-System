using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Addresses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class AddressService : ezinvmvcAppServiceBase, IAddressService
    {
        private readonly IAddressManager _addressManager;

        public AddressService(IAddressManager addressManager)
        {
            _addressManager = addressManager;
        }

        public async Task<int> CreateAddress(CreateAddressInput input)
        {
            Address output = Mapper.Map<Address>(input);
            CheckErrors(await _addressManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteAddress(DeleteAddressInput input)
        {
            CheckErrors(await _addressManager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetAddressOutput>> GetAddresses(GetAddressListInput input)
        {
            var resultList = await _addressManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAddressOutput>(listcount, ObjectMapper.Map<List<GetAddressOutput>>(resultList));
        }

        public async Task<GetAddressOutput> GetAddress(GetAddressInput input)
        {
            var getbyid = await _addressManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetAddressOutput>(getbyid);
        }

        public async Task UpdateAddress(UpdateAddressInput input)
        {
            Address output = Mapper.Map<Address>(input);
            CheckErrors(await _addressManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
