using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.Dto;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface IRFQService : IApplicationService
    {
        Task<GetRFQOutput> GetRFQ(GetRFQInput input);
        Task<PagedResultDto<RFQOutput>> GetRFQs(GetRFQListInput input);
        Task<IEnumerable<RFQOutput>> GetRFQRevisions(GetRFQListInput input);
        Task<PagedResultDto<RFQOutput>> GetRFQsforQuotation(GetRFQListInput input);
        Task<CreateRFQOutput> CreateRFQ(CreateRFQInput input);
        Task<CreateRFQOutput> UpdateRfq(UpdateRFQInput input);

        Task<PagedResultDto<RFQDetailsOutput>> GetRfqDetailsByParentId(GetRFQInput input);

        Task<PagedResultDto<RFQOtherDetailsOutput>> GetRfqOtherDetailsByParentId(GetRFQInput input);
        Task DeleteAsync(DeleteRFQOtherDetailsInput input);
        Task CreateRFQOtherDetails(RFQOtherDetailsInput input);
        Task UpdateRFQOtherDetails(RFQOtherDetailsInput input);

    }
}
