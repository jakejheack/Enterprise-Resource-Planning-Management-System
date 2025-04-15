using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Sales
{
    public interface IDeliveryReceiptService : IApplicationService
    {
        Task<CreateDeliveryReceiptOutput> CreateDeliveryReceipt(CreateDeliveryReceiptInput input);
        Task<PagedResultDto<DeliveryReceiptOutput>> GetDeliveryReceipts(GetDeliveryReceiptsInput input);
        Task<DeliveryReceiptOutput> GetDeliveryReceipt(GetDeliveryReceiptInput input);
        Task<CreateDeliveryReceiptOutput> UpdateDeliveryReceipt(UpdateDeliveryReceiptInput input);

        Task<PagedResultDto<DeliveryReceiptItemOutput>> GetDeliveryReceiptItemsByParentId(GetDeliveryReceiptInput input);
        Task<PagedResultDto<DeliveryReceiptChargeOutput>> GetDeliveryReceiptChargesByParentId(GetDeliveryReceiptInput input);
        Task<CreateDeliveryReceiptOutput> UpdateSalesOrderDeliveryStatus(UpdateDeliveryReceiptInput input);
    }
}
