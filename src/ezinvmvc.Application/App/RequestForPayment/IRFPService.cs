using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.RequestForPayment.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.RequestForPayment
{
    public interface IRFPService : IApplicationService
    {
        Task<GetRFPOutput> GetRFP(GetRFPInput input);
        Task<PagedResultDto<RFPOutput>> GetAllRFP(GetRFPListInput input);
        Task<int> CreateRFP(CreateRFPInput input);
        Task<int> UpdateRFP(UpdateRFPInput input);

        Task<PagedResultDto<RFPItemOutput>> GetRFPItemByParentId(GetRFPInput input);
        Task<PagedResultDto<RFPOutput>> Autocomplete(GetRFPListInput input);
    }
}
