using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Addresses.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface IAddressService : IApplicationService
    {
        Task<PagedResultDto<GetAddressOutput>> GetAddresses(GetAddressListInput input);
        Task<int> CreateAddress(CreateAddressInput input);
        Task UpdateAddress(UpdateAddressInput input);
        Task DeleteAddress(DeleteAddressInput input);
        Task<GetAddressOutput> GetAddress(GetAddressInput input);
    }
}
