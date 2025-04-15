using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using AutoMapper;
using ezinvmvc.App.Common.Dto;
using Microsoft.AspNetCore.Identity;


namespace ezinvmvc.App.Common
{
    public class CommonService : ezinvmvcAppServiceBase, ICommonService
    {
        private readonly ISeriesTypeManager _manager;
        private readonly IOrderTypeManager _managerOrderType;
        private readonly IPaymentTermManager _managerPaymentTerm;
        private readonly ITaxTypeManager _managerTaxType;
        private readonly IChargeTypeManager _managerChargeType;
        private readonly IDeliveryTypeManager _managerDeliveryType;
        private readonly IWarrantyTypeManager _managerWarrantyType;
        private readonly IEntryTypeManager _managerEntryType;
        private readonly ITransactionManager _managerTransaction;
        private readonly IPaymentModeManager _managerPaymentMode;
        private readonly ITransportModeManager _managerTransportMode;
        private readonly IVehicleTypeManager _managerVehicleType;
        private readonly IInventoryTypeManager _managerInventoryType;
        private readonly ICurrencyManager _managerCurrency;

        public CommonService(ISeriesTypeManager manager, IOrderTypeManager managerOrderType, IPaymentTermManager managerPaymentTerm, ITaxTypeManager managerTaxType, IChargeTypeManager managerChargeType, IDeliveryTypeManager managerDeliveryType, IWarrantyTypeManager managerWarrantyType, IEntryTypeManager managerEntryType, ITransactionManager managerTransaction, IPaymentModeManager managerPaymentMode, ITransportModeManager managerTransportMode, IVehicleTypeManager managerVehicleType, IInventoryTypeManager managerInventoryType, ICurrencyManager managerCurrency)
        {
            _manager = manager;
            _managerOrderType = managerOrderType;
            _managerPaymentTerm = managerPaymentTerm;
            _managerTaxType = managerTaxType;
            _managerChargeType = managerChargeType;
            _managerDeliveryType = managerDeliveryType;
            _managerWarrantyType = managerWarrantyType;
            _managerEntryType = managerEntryType;
            _managerTransaction = managerTransaction;
            _managerPaymentMode = managerPaymentMode;
            _managerTransportMode = managerTransportMode;
            _managerVehicleType = managerVehicleType;
            _managerInventoryType = managerInventoryType;
            _managerCurrency = managerCurrency;
        }

        public async Task<PagedResultDto<GetInventoryTypeOutput>> GetInventoryTypes()
        {
            var resultList = await _managerInventoryType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetInventoryTypeOutput>(listcount, ObjectMapper.Map<List<GetInventoryTypeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetInventoryTypeOutput>> GetInventoryTypesFiltered(GetInventoryTypeInput input)
        {
            var resultList = await _managerInventoryType.GetAllListByCode(input.EntryTypeCode);
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetInventoryTypeOutput>(listcount, ObjectMapper.Map<List<GetInventoryTypeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetVehicleTypeOutput>> GetVehicleTypes()
        {
            var resultList = await _managerVehicleType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetVehicleTypeOutput>(listcount, ObjectMapper.Map<List<GetVehicleTypeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetTransportModeOutput>> GetTransportModes()
        {
            var resultList = await _managerTransportMode.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetTransportModeOutput>(listcount, ObjectMapper.Map<List<GetTransportModeOutput>>(resultList));
        }

        //Transactions
        public async Task<PagedResultDto<GetTransactionOutput>> GetTransactions()
        {
            var resultList = await _managerTransaction.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetTransactionOutput>(listcount, ObjectMapper.Map<List<GetTransactionOutput>>(resultList));
        }

        //Entry Type
        public async Task CreateEntryType(CreateCodeNameInput input)
        {
            EntryType output = Mapper.Map<EntryType>(input);

            CheckErrors(await _managerEntryType.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteEntryType(DeleteCodeNameInput input)
        {
            CheckErrors(await _managerEntryType.DeleteAsync(input.Id));
        }
        public async Task<GetCodeNameOutput> GetEntryType(GetCodeNameInput input)
        {
            var getbyid = await _managerEntryType.GetByIdAsync(input.Id);
            return Mapper.Map<GetCodeNameOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetCodeNameOutput>> GetEntryTypes()
        {
            var resultList = await _managerEntryType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetCodeNameOutput>(listcount, ObjectMapper.Map<List<GetCodeNameOutput>>(resultList));
        }
        public async Task UpdateEntryType(UpdateCodeNameInput input)
        {
            EntryType output = Mapper.Map<UpdateCodeNameInput, EntryType>(input);

            CheckErrors(await _managerEntryType.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Warranty Type
        public async Task CreateWarrantyType(CreateWarrantyTypeInput input)
        {
            WarrantyType output = Mapper.Map<WarrantyType>(input);

            CheckErrors(await _managerWarrantyType.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteWarrantyType(DeleteWarrantyTypeInput input)
        {
            CheckErrors(await _managerWarrantyType.DeleteAsync(input.Id));
        }
        public async Task<GetWarrantyTypeOutput> GetWarrantyType(GetWarrantyTypeInput input)
        {
            var getbyid = await _managerWarrantyType.GetByIdAsync(input.Id);
            return Mapper.Map<GetWarrantyTypeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetWarrantyTypeOutput>> GetWarrantyTypes()
        {
            var resultList = await _managerWarrantyType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetWarrantyTypeOutput>(listcount, ObjectMapper.Map<List<GetWarrantyTypeOutput>>(resultList));
        }
        public async Task UpdateWarrantyType(UpdateWarrantyTypeInput input)
        {
            WarrantyType output = Mapper.Map<UpdateWarrantyTypeInput, WarrantyType>(input);

            CheckErrors(await _managerWarrantyType.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Delivery Type
        public async Task CreateDeliveryType(CreateDeliveryTypeInput input)
        {
            DeliveryType output = Mapper.Map<DeliveryType>(input);

            CheckErrors(await _managerDeliveryType.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteDeliveryType(DeleteDeliveryTypeInput input)
        {
            CheckErrors(await _managerDeliveryType.DeleteAsync(input.Id));
        }
        public async Task<GetDeliveryTypeOutput> GetDeliveryType(GetDeliveryTypeInput input)
        {
            var getbyid = await _managerDeliveryType.GetByIdAsync(input.Id);
            return Mapper.Map<GetDeliveryTypeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetDeliveryTypeOutput>> GetDeliveryTypes()
        {
            var resultList = await _managerDeliveryType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetDeliveryTypeOutput>(listcount, ObjectMapper.Map<List<GetDeliveryTypeOutput>>(resultList));
        }
        public async Task UpdateDeliveryType(UpdateDeliveryTypeInput input)
        {
            DeliveryType output = Mapper.Map<UpdateDeliveryTypeInput, DeliveryType>(input);

            CheckErrors(await _managerDeliveryType.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Charge Type
        public async Task CreateChargeType(CreateChargeTypeInput input)
        {
            ChargeType output = Mapper.Map<ChargeType>(input);

            CheckErrors(await _managerChargeType.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteChargeType(DeleteChargeTypeInput input)
        {
            CheckErrors(await _managerChargeType.DeleteAsync(input.Id));
        }
        public async Task<GetChargeTypeOutput> GetChargeType(GetChargeTypeInput input)
        {
            var getbyid = await _managerChargeType.GetByIdAsync(input.Id);
            return Mapper.Map<GetChargeTypeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetChargeTypeOutput>> GetChargeTypes()
        {
            var resultList = await _managerChargeType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetChargeTypeOutput>(listcount, ObjectMapper.Map<List<GetChargeTypeOutput>>(resultList));
        }
        public async Task UpdateChargeType(UpdateChargeTypeInput input)
        {
            ChargeType output = Mapper.Map<UpdateChargeTypeInput, ChargeType>(input);

            CheckErrors(await _managerChargeType.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Tax Type
        public async Task CreateTaxType(CreateTaxTypeInput input)
        {
            TaxType output = Mapper.Map<TaxType>(input);

            CheckErrors(await _managerTaxType.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteTaxType(DeleteTaxTypeInput input)
        {
            CheckErrors(await _managerTaxType.DeleteAsync(input.Id));
        }
        public async Task<GetTaxTypeOutput> GetTaxType(GetTaxTypeInput input)
        {
            var getbyid = await _managerTaxType.GetByIdAsync(input.Id);
            return Mapper.Map<GetTaxTypeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetTaxTypeOutput>> GetTaxTypes()
        {
            var resultList = await _managerTaxType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetTaxTypeOutput>(listcount, ObjectMapper.Map<List<GetTaxTypeOutput>>(resultList));
        }
        public async Task UpdateTaxType(UpdateTaxTypeInput input)
        {
            TaxType output = Mapper.Map<UpdateTaxTypeInput, TaxType>(input);

            CheckErrors(await _managerTaxType.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Payment Term
        public async Task CreatePaymentTerm(CreatePaymentTermInput input)
        {
            PaymentTerm output = Mapper.Map<PaymentTerm>(input);

            CheckErrors(await _managerPaymentTerm.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeletePaymentTerm(DeletePaymentTermInput input)
        {
            CheckErrors(await _managerPaymentTerm.DeleteAsync(input.Id));
        }
        public async Task<GetPaymentTermOutput> GetPaymentTerm(GetPaymentTermInput input)
        {
            var getbyid = await _managerPaymentTerm.GetByIdAsync(input.Id);
            return Mapper.Map<GetPaymentTermOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetPaymentTermOutput>> GetPaymentTerms()
        {
            var resultList = await _managerPaymentTerm.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetPaymentTermOutput>(listcount, ObjectMapper.Map<List<GetPaymentTermOutput>>(resultList));
        }
        public async Task UpdatePaymentTerm(UpdatePaymentTermInput input)
        {
            PaymentTerm output = Mapper.Map<UpdatePaymentTermInput, PaymentTerm>(input);

            CheckErrors(await _managerPaymentTerm.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Order Type
        public async Task CreateOrderType(CreateOrderTypeInput input)
        {
            OrderType output = Mapper.Map<OrderType>(input);

            CheckErrors(await _managerOrderType.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteOrderType(DeleteOrderTypeInput input)
        {
            CheckErrors(await _managerOrderType.DeleteAsync(input.Id));
        }
        public async Task<GetOrderTypeOutput> GetOrderType(GetOrderTypeInput input)
        {
            var getbyid = await _managerOrderType.GetByIdAsync(input.Id);
            return Mapper.Map<GetOrderTypeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetOrderTypeOutput>> GetOrderTypes()
        {
            var resultList = await _managerOrderType.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetOrderTypeOutput>(listcount, ObjectMapper.Map<List<GetOrderTypeOutput>>(resultList));
        }
        public async Task UpdateOrderType(UpdateOrderTypeInput input)
        {
            OrderType output = Mapper.Map<UpdateOrderTypeInput, OrderType>(input);

            CheckErrors(await _managerOrderType.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Series Type
        public async Task CreateSeriesType(CreateSeriesTypeInput input)
        {
            SeriesType output = Mapper.Map<SeriesType>(input);

            CheckErrors(await _manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteSeriesType(DeleteSeriesTypeInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }
        public async Task<GetSeriesTypeOutput> GetSeriesType(GetSeriesTypeInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetSeriesTypeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypes()
        {
            var resultList = await _manager.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetSeriesTypeOutput>(listcount, ObjectMapper.Map<List<GetSeriesTypeOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypesFiltered(GetSeriesTypeInput input)
        {
            var resultList = await _manager.GetAllListFiltered(input.Id, input.TransactionCode, input.CompanyId);
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetSeriesTypeOutput>(listcount, ObjectMapper.Map<List<GetSeriesTypeOutput>>(resultList));
        }
        public async Task UpdateSeriesType(UpdateSeriesTypeInput input)
        {
            SeriesType output = Mapper.Map<UpdateSeriesTypeInput, SeriesType>(input);

            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypesByTransId(GetSeriesTypeInput input)
        {
            var resultList = await _manager.GetAllListByTransId(input.TransactionCode, input.CompanyId);
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetSeriesTypeOutput>(listcount, ObjectMapper.Map<List<GetSeriesTypeOutput>>(resultList));
        }

        public async Task<string> GetNextSeriesCode(GetSeriesTypeInput input)
        {
            string seriescode = "0";
            var seriestype = await _manager.GetByIdAsync(input.Id);
            int nextseries = seriestype.LastSeries + 1;
            seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            return seriescode;
        }
        public async Task<PagedResultDto<GetSeriesTypeOutput>> GetSeriesTypesFilteredCross(GetSeriesTypeInputCross input)
        {
            var resultList = await _manager.GetAllListFilteredCross(input.Id, input.Id2, input.TransactionCode, input.CompanyId);
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetSeriesTypeOutput>(listcount, ObjectMapper.Map<List<GetSeriesTypeOutput>>(resultList));
        }
        
        //Currency
        public async Task CreateCurrency(CreateCurrencyInput input)
        {
            Currency output = Mapper.Map<Currency>(input);

            CheckErrors(await _managerCurrency.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteCurrency(DeleteCurrencyInput input)
        {
            CheckErrors(await _managerCurrency.DeleteAsync(input.Id));
        }
        public async Task<GetCurrencyOutput> GetCurrency(GetCurrencyInput input)
        {
            var getbyid = await _managerCurrency.GetByIdAsync(input.Id);
            return Mapper.Map<GetCurrencyOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetCurrencyOutput>> GetCurrencies()
        {
            var resultList = await _managerCurrency.GetAllList();
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetCurrencyOutput>(listcount, ObjectMapper.Map<List<GetCurrencyOutput>>(resultList));
        }
        public async Task UpdateCurrency(UpdateCurrencyInput input)
        {
            Currency output = Mapper.Map<UpdateCurrencyInput, Currency>(input);

            CheckErrors(await _managerCurrency.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Payment Modes
        public async Task CreatePaymentMode(CreatePaymentModeInput input)
        {
            PaymentMode output = Mapper.Map<PaymentMode>(input);

            CheckErrors(await _managerPaymentMode.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeletePaymentMode(DeletePaymentModeInput input)
        {
            CheckErrors(await _managerPaymentMode.DeleteAsync(input.Id));
        }
        public async Task<GetPaymentModeOutput> GetPaymentMode(GetPaymentModeInput input)
        {
            var getbyid = await _managerPaymentMode.GetByIdAsync(input.Id);
            return Mapper.Map<GetPaymentModeOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetPaymentModeOutput>> GetPaymentModes()
        {
            var resultList = await _managerPaymentMode.GetAllListWithFilterAsync("", "");
            int listcount = 0;
            listcount = resultList.Count();
            return new PagedResultDto<GetPaymentModeOutput>(listcount, ObjectMapper.Map<List<GetPaymentModeOutput>>(resultList));
        }
        public async Task UpdatePaymentMode(UpdatePaymentModeInput input)
        {
            PaymentMode output = Mapper.Map<UpdatePaymentModeInput, PaymentMode>(input);

            CheckErrors(await _managerPaymentMode.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
