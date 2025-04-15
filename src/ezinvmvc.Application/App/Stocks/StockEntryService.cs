using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Common;
using ezinvmvc.App.Stocks.DTO;
using ezinvmvc.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.Stocks
{
    [AbpAuthorize(PermissionNames.Pages_Stock_Entry)]
    public class StockEntryService : ezinvmvcAppServiceBase, IStockEntryService
    {
        private readonly IStockEntryManager _stockEntryManager;
        private readonly IStockEntryItemManager _stockEntryItemManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IStockCardManager _stockEntryCardManager;

        public StockEntryService(IStockEntryManager stockEntryManager, IStockEntryItemManager stockEntryItemManager, ISeriesTypeManager seriesTypeManager, IStockCardManager stockEntryCardManager)
        {
            _stockEntryManager = stockEntryManager;
            _stockEntryItemManager = stockEntryItemManager;
            _seriesTypeManager = seriesTypeManager;
            _stockEntryCardManager = stockEntryCardManager;
        }

        public async Task<int> CreateStockEntry(CreateStockEntryInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.stockentry.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.stockentry.Code = seriescode;
            //series
            StockEntry orderoutput = Mapper.Map<StockEntry>(input.stockentry);
            CheckErrors(await _stockEntryManager.CreateAsync(orderoutput));

            foreach (StockEntryItemInput item in input.stockentryitem)
            {
                item.StockEntryId = orderoutput.Id;
                StockEntryItem orderitemoutput = Mapper.Map<StockEntryItem>(item);
                CheckErrors(await _stockEntryItemManager.CreateAsync(orderitemoutput));
            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return orderoutput.Id;
        }

        public async Task<PagedResultDto<StockEntryOutput>> GetStockEntries(GetStockEntriesInput input)
        {
            var resultList = await _stockEntryManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<StockEntryOutput>(listcount, ObjectMapper.Map<List<StockEntryOutput>>(resultList));
        }

        public async Task<GetStockEntryOutput> GetStockEntry(GetStockEntryInput input)
        {
            var getbyid = await _stockEntryManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetStockEntryOutput>(getbyid);
        }

        public async Task<int> UpdateStockEntry(UpdateStockEntryInput input)
        {
            var returnint = 0;

            StockEntry updateparent = Mapper.Map<StockEntry>(input.stockentry);
            CheckErrors(await _stockEntryManager.UpdateAsync(updateparent));
            returnint = updateparent.Id;
            foreach (StockEntryItemInput item in input.stockentryitem)
            {
                item.StockEntryId = updateparent.Id;
                if (updateparent.StatusId == 2)
                {
                    item.QtyRel = item.Qty;
                }
                StockEntryItem itemoutput = Mapper.Map<StockEntryItem>(item);
                if (item.IsDeleted == true)
                {
                    CheckErrors(await _stockEntryItemManager.DeleteAsync(itemoutput.Id));
                }
                else
                {
                    if (item.Id > 0)
                    {
                        CheckErrors(await _stockEntryItemManager.UpdateAsync(itemoutput));
                    }
                    else
                    {
                        CheckErrors(await _stockEntryItemManager.CreateAsync(itemoutput));
                    }
                }

                if (updateparent.StatusId == 3)
                {
                    var seriestype = await _seriesTypeManager.GetByIdAsync(input.stockentry.SeriesTypeId);
                    var qtyout = itemoutput.Qty;
                    if (input.stockentry.EntryTypeId == 1)
                    {
                        var qty = itemoutput.Qty;
                        qty = qty * -1;
                        var warehouseid = input.stockentry.DefaultSourceId;
                        var stockcard = new StockCard
                        {
                            TransactionCode = input.stockentry.Code,
                            TransactionTypeId = seriestype.TransactionId,
                            TransactionId = itemoutput.StockEntryId,
                            TransactionItemId = itemoutput.Id,
                            TransactionTime = input.stockentry.TransactionTime,
                            ProductId = itemoutput.ProductId,
                            Qty = qty,
                            UnitId = itemoutput.UnitId,
                            WarehouseId = input.stockentry.DefaultSourceId
                        };
                        CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                    }
                    if (input.stockentry.EntryTypeId == 2)
                    {
                        var qty = itemoutput.Qty;
                        var warehouseid = input.stockentry.DefaultSourceId;
                        var stockcard = new StockCard
                        {
                            TransactionCode = input.stockentry.Code,
                            TransactionTypeId = seriestype.TransactionId,
                            TransactionId = itemoutput.StockEntryId,
                            TransactionItemId = itemoutput.Id,
                            TransactionTime = input.stockentry.TransactionTime,
                            ProductId = itemoutput.ProductId,
                            Qty = qty,
                            UnitId = itemoutput.UnitId,
                            WarehouseId = input.stockentry.DefaultSourceId
                        };
                        CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                    }
                    if (input.stockentry.EntryTypeId == 3)
                    {
                        var qty = itemoutput.Qty;
                        qty = qty * -1;
                        var warehouseid = input.stockentry.DefaultSourceId;
                        var stockcardout = new StockCard
                        {
                            TransactionCode = input.stockentry.Code,
                            TransactionTypeId = seriestype.TransactionId,
                            TransactionId = itemoutput.StockEntryId,
                            TransactionItemId = itemoutput.Id,
                            TransactionTime = input.stockentry.TransactionTime,
                            ProductId = itemoutput.ProductId,
                            Qty = qty,
                            UnitId = itemoutput.UnitId,
                            WarehouseId = input.stockentry.DefaultSourceId
                        };
                        CheckErrors(await _stockEntryCardManager.CreateAsync(stockcardout));

                        var stockcardin = new StockCard
                        {
                            TransactionCode = input.stockentry.Code,
                            TransactionTypeId = seriestype.TransactionId,
                            TransactionId = itemoutput.StockEntryId,
                            TransactionItemId = itemoutput.Id,
                            TransactionTime = input.stockentry.TransactionTime,
                            ProductId = itemoutput.ProductId,
                            Qty = itemoutput.Qty,
                            UnitId = itemoutput.UnitId,
                            WarehouseId = input.stockentry.DefaultDestinationId
                        };
                        CheckErrors(await _stockEntryCardManager.CreateAsync(stockcardin));
                    }
                }
            }
            await CurrentUnitOfWork.SaveChangesAsync();
            return returnint;
        }

        public async Task<PagedResultDto<StockEntryItemOutput>> GetStockEntryItemByParentId(GetStockEntryInput input)
        {
            var resultList = await _stockEntryItemManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<StockEntryItemOutput>(listcount, ObjectMapper.Map<List<StockEntryItemOutput>>(resultList));
        }

        public async Task<PagedResultDto<StockCardOutput>> GetStockCards(GetStockEntriesInput input)
        {
            var resultList = await _stockEntryCardManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<StockCardOutput>(listcount, ObjectMapper.Map<List<StockCardOutput>>(resultList));
        }
        public async Task<PagedResultDto<StockSummaryOutput>> GetStockSummary(GetStockEntriesInput input)
        {
            var resultList = await _stockEntryCardManager.GetAllSummary(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<StockSummaryOutput>(listcount, ObjectMapper.Map<List<StockSummaryOutput>>(resultList));
        }
    }
}
