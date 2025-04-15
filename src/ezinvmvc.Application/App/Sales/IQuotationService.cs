using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface IQuotationService : IApplicationService
    {
        Task<CreateQuotationOutput> CreateQuotation(CreateQuotationInput input);
        Task<PagedResultDto<QuotationOutput>> GetQuotations(GetQuotationsInput input);
        Task<IEnumerable<QuotationOutput>> GetQuotationRevisions(GetQuotationsInput input);
        Task<GetQuotationOutput> GetQuotation(GetQuotationInput input);
        Task<CreateQuotationOutput> UpdateQuotation(UpdateQuotationInput input);


        Task<PagedResultDto<QuotationItemOutput>> GetQuotationItemsByParentId(GetQuotationInput input);
        Task<PagedResultDto<QuotationChargeOutput>> GetQuotationChargesByParentId(GetQuotationInput input);

        Task<PagedResultDto<GetQuotationOtherItemOutput>> GetRfqOtherDetailsByParentId(GetQuotationOtherItemInput input);
        Task DeleteAsync(DeleteQuotationOtherItemInput input);
        Task CreateRFQOtherDetails(QuotationOtherItemInput input);
        Task UpdateRFQOtherDetails(QuotationOtherItemInput input);
    }
}
