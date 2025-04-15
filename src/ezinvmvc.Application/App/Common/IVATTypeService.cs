using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IVATTypeService : IApplicationService
    {
        Task<IEnumerable<GetVATTypeOutput>> GetVATTypes();
        Task CreateVATType(CreateVATTypeInput input);
        Task UpdateVATType(UpdateVATTypeInput input);
        Task DeleteVATType(DeleteVATTypeInput input);
        Task<GetVATTypeOutput> GetVATType(GetVATTypeInput input);
    }
}
