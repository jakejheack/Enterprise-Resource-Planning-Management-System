using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting;
using ezinvmvc.App.CashVoucher.Dto;
using ezinvmvc.App.CashVoucher;
using ezinvmvc.App.Common;
using ezinvmvc.App.RequestForPayment;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CashVoucher
{
    public class CashVoucherService : ezinvmvcAppServiceBase, ICashVoucherService
    {
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly ICashVoucherManager _cvManager;
        private readonly ICashVoucherItemManager _cvdManager;
        //private readonly IRFPManager _rfpManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;

        public CashVoucherService(ICashVoucherManager cvManager, ISeriesTypeManager seriesTypeManager, ICashVoucherItemManager cvdManager, //IRFPManager rfpManager, 
            IGeneralLedgerManager generalLedgerManager)
        {
            //_rfpManager = rfpManager;
            _cvManager = cvManager;
            _cvdManager = cvdManager;
            _seriesTypeManager = seriesTypeManager;
            _generalLedgerManager = generalLedgerManager;
        }

        public async Task<int> CreateCashVoucher(CreateCashVoucherInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.CashVoucher.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.CashVoucher.Code = seriescode;
            //series
            CashVoucher output = Mapper.Map<CashVoucher>(input.CashVoucher);
            CheckErrors(await _cvManager.CreateAsync(output));

            foreach (CashVoucherItemInput item in input.CashVoucherItems)
            {
                item.CashVoucherId = output.Id;
                CashVoucherItem itemoutput = Mapper.Map<CashVoucherItem>(item);
                CheckErrors(await _cvdManager.CreateAsync(itemoutput));
            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task<PagedResultDto<CashVoucherOutput>> GetAllCashVoucher(GetCashVoucherListInput input)
        {
            var resultList = await _cvManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<CashVoucherOutput>(listcount, ObjectMapper.Map<List<CashVoucherOutput>>(resultList));
        }

        public async Task<GetCashVoucherOutput> GetCashVoucher(GetCashVoucherInput input)
        {
            var getbyid = await _cvManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCashVoucherOutput>(getbyid);
        }

        public async Task<PagedResultDto<CashVoucherItemOutput>> GetCashVoucherItemByParentId(GetCashVoucherInput input)
        {
            var resultList = await _cvdManager.GetAllByParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<CashVoucherItemOutput>(listcount, ObjectMapper.Map<List<CashVoucherItemOutput>>(resultList));
        }

        public async Task<int> UpdateCashVoucher(UpdateCashVoucherInput input)
        {
            CashVoucher output = Mapper.Map<CashVoucher>(input.CashVoucher);
            CheckErrors(await _cvManager.UpdateAsync(output));

            foreach (CashVoucherItemInput item in input.CashVoucherItems)
            {
                item.CashVoucherId = output.Id;
                CashVoucherItem itemoutput = Mapper.Map<CashVoucherItem>(item);
                if (item.IsDeleted == true)
                {
                    CheckErrors(await _cvdManager.DeleteAsync(itemoutput.Id));
                }
                else
                {
                    if (item.Id > 0)
                    {
                        CheckErrors(await _cvdManager.UpdateAsync(itemoutput));
                    }
                    else
                    {
                        CheckErrors(await _cvdManager.CreateAsync(itemoutput));
                    }
                }

            }

            var seriestype = await _seriesTypeManager.GetByIdAsync(output.SeriesTypeId);
            if (output.StatusId == 2)
            {
                foreach (GeneralLedgerInput ledger in input.generalledger)
                {
                    ledger.TransactionId = output.Id;
                    ledger.TransactionCode = output.Code;
                    ledger.TransactionTypeId = seriestype.TransactionId; //output.SeriesTypeId;
                    GeneralLedger orderitemoutput = Mapper.Map<GeneralLedger>(ledger);
                    try
                    {
                        CheckErrors(await _generalLedgerManager.CreateAsync(orderitemoutput));
                    }
                    catch (Exception ex)
                    { }
                }

            }
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;

        }
    }
}
