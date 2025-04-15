using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface ICommonService : IApplicationService
    {

        Task<PagedResultDto<GetInventoryTypeOutput>> GetInventoryTypes();
        Task<PagedResultDto<GetInventoryTypeOutput>> GetInventoryTypesFiltered(GetInventoryTypeInput input);

        Task<PagedResultDto<GetTransportModeOutput>> GetTransportModes();
        Task<PagedResultDto<GetVehicleTypeOutput>> GetVehicleTypes();
        Task<PagedResultDto<GetTransactionOutput>> GetTransactions();

        //Entry Type 
        Task<PagedResultDto<GetCodeNameOutput>> GetEntryTypes();
        Task CreateEntryType(CreateCodeNameInput input);
        Task UpdateEntryType(UpdateCodeNameInput input);
        Task DeleteEntryType(DeleteCodeNameInput input);
        Task<GetCodeNameOutput> GetEntryType(GetCodeNameInput input);

        //Warranty Type 
        Task<PagedResultDto<GetWarrantyTypeOutput>> GetWarrantyTypes();
        Task CreateWarrantyType(CreateWarrantyTypeInput input);
        Task UpdateWarrantyType(UpdateWarrantyTypeInput input);
        Task DeleteWarrantyType(DeleteWarrantyTypeInput input);
        Task<GetWarrantyTypeOutput> GetWarrantyType(GetWarrantyTypeInput input);


        //Delivery Type 
        Task<PagedResultDto<GetDeliveryTypeOutput>> GetDeliveryTypes();
        Task CreateDeliveryType(CreateDeliveryTypeInput input);
        Task UpdateDeliveryType(UpdateDeliveryTypeInput input);
        Task DeleteDeliveryType(DeleteDeliveryTypeInput input);
        Task<GetDeliveryTypeOutput> GetDeliveryType(GetDeliveryTypeInput input);

        //Charge Type 
        Task<PagedResultDto<GetChargeTypeOutput>> GetChargeTypes();
        Task CreateChargeType(CreateChargeTypeInput input);
        Task UpdateChargeType(UpdateChargeTypeInput input);
        Task DeleteChargeType(DeleteChargeTypeInput input);
        Task<GetChargeTypeOutput> GetChargeType(GetChargeTypeInput input);

        //Tax Type 
        Task<PagedResultDto<GetTaxTypeOutput>> GetTaxTypes();
        Task CreateTaxType(CreateTaxTypeInput input);
        Task UpdateTaxType(UpdateTaxTypeInput input);
        Task DeleteTaxType(DeleteTaxTypeInput input);
        Task<GetTaxTypeOutput> GetTaxType(GetTaxTypeInput input);

        //Payment Terms 
        Task<PagedResultDto<GetPaymentTermOutput>> GetPaymentTerms();
        Task CreatePaymentTerm(CreatePaymentTermInput input);
        Task UpdatePaymentTerm(UpdatePaymentTermInput input);
        Task DeletePaymentTerm(DeletePaymentTermInput input);
        Task<GetPaymentTermOutput> GetPaymentTerm(GetPaymentTermInput input);

        //Order Type
        Task<PagedResultDto<GetOrderTypeOutput>> GetOrderTypes();
        Task CreateOrderType(CreateOrderTypeInput input);
        Task UpdateOrderType(UpdateOrderTypeInput input);
        Task DeleteOrderType(DeleteOrderTypeInput input);
        Task<GetOrderTypeOutput> GetOrderType(GetOrderTypeInput input);

        //SeriesType
        Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypes();
        Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypesFiltered(GetSeriesTypeInput input);
        Task CreateSeriesType(CreateSeriesTypeInput input);
        Task UpdateSeriesType(UpdateSeriesTypeInput input);
        Task DeleteSeriesType(DeleteSeriesTypeInput input);
        Task<GetSeriesTypeOutput> GetSeriesType(GetSeriesTypeInput input);
        Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypesFilteredCross(GetSeriesTypeInputCross input);

        Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypesByTransId(GetSeriesTypeInput input);
        Task<string> GetNextSeriesCode(GetSeriesTypeInput input);

        //Currency Type
        Task<PagedResultDto<GetCurrencyOutput>> GetCurrencies();
        Task CreateCurrency(CreateCurrencyInput input);
        Task UpdateCurrency(UpdateCurrencyInput input);
        Task DeleteCurrency(DeleteCurrencyInput input);
        Task<GetCurrencyOutput> GetCurrency(GetCurrencyInput input);

        //Payment Mode
        Task<PagedResultDto<GetPaymentModeOutput>> GetPaymentModes();
        Task CreatePaymentMode(CreatePaymentModeInput input);
        Task UpdatePaymentMode(UpdatePaymentModeInput input);
        Task DeletePaymentMode(DeletePaymentModeInput input);
        Task<GetPaymentModeOutput> GetPaymentMode(GetPaymentModeInput input);
    }
}
