using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting;
using ezinvmvc.App.Common;
using ezinvmvc.App.RequestForPayment.Dto;
using ezinvmvc.App.RequestForPayment.Models;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.RequestForPayment
{
    public class RFPService : ezinvmvcAppServiceBase, IRFPService
    {
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IRFPManager _rfpManager;
        private readonly IRFPItemManager _rfpitemManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;

        public RFPService(IRFPManager rfpManager, ISeriesTypeManager seriesTypeManager, IRFPItemManager rfpitemManager, IGeneralLedgerManager generalLedgerManager)
        {
            _rfpManager = rfpManager;
            _rfpitemManager = rfpitemManager;
            _seriesTypeManager = seriesTypeManager;
            _generalLedgerManager = generalLedgerManager;
        }

        public async Task<PagedResultDto<RFPOutput>> Autocomplete(GetRFPListInput input)
        {
            var resultList = await _rfpManager.Autocomplete(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<RFPOutput>(listcount, ObjectMapper.Map<List<RFPOutput>>(resultList));
        }

        public async Task<int> CreateRFP(CreateRFPInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.RFP.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.RFP.Code = seriescode;
            //series
            RFP output = Mapper.Map<RFP>(input.RFP);
            CheckErrors(await _rfpManager.CreateAsync(output));

            foreach (RFPItemInput item in input.RFPItems)
            {
                item.RequestId = output.Id;
                RFPItem itemoutput = Mapper.Map<RFPItem>(item);
                CheckErrors(await _rfpitemManager.CreateAsync(itemoutput));
            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task<PagedResultDto<RFPOutput>> GetAllRFP(GetRFPListInput input)
        {
            var resultList = await _rfpManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<RFPOutput>(listcount, ObjectMapper.Map<List<RFPOutput>>(resultList));
        }

        public async Task<GetRFPOutput> GetRFP(GetRFPInput input)
        {
            var getbyid = await _rfpManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetRFPOutput>(getbyid);
        }

        public async Task<PagedResultDto<RFPItemOutput>> GetRFPItemByParentId(GetRFPInput input)
        {
            var resultList = await _rfpitemManager.GetAllByParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<RFPItemOutput>(listcount, ObjectMapper.Map<List<RFPItemOutput>>(resultList));
        }

        public async Task<int> UpdateRFP(UpdateRFPInput input)
        {
            RFP output = Mapper.Map<RFP>(input.RFP);
            CheckErrors(await _rfpManager.UpdateAsync(output));

            foreach (RFPItemInput item in input.RFPItems)
            {
                item.RequestId = output.Id;
                RFPItem itemoutput = Mapper.Map<RFPItem>(item);
                if (item.IsDeleted == true)
                {
                    CheckErrors(await _rfpitemManager.DeleteAsync(itemoutput.Id));
                }
                else
                {
                    if (item.Id > 0)
                    {
                        CheckErrors(await _rfpitemManager.UpdateAsync(itemoutput));
                    }
                    else
                    {
                        CheckErrors(await _rfpitemManager.CreateAsync(itemoutput));
                    }
                }

            }

            var seriestype = await _seriesTypeManager.GetByIdAsync(input.RFP.SeriesTypeId);
            if (output.StatusId == 2)
            {
                foreach (GeneralLedgerInput ledger in input.generalledger)
                {
                    ledger.TransactionId = output.Id;
                    ledger.TransactionTypeId = seriestype.TransactionId;
                    GeneralLedger orderitemoutput = Mapper.Map<GeneralLedger>(ledger);
                    if (ledger.IsDeleted == true)
                    {
                        CheckErrors(await _generalLedgerManager.DeleteAsync(orderitemoutput.Id));
                    }
                    else
                    {
                        if (ledger.Id > 0)
                        {
                            CheckErrors(await _generalLedgerManager.UpdateAsync(orderitemoutput));
                        }
                        else
                        {
                            CheckErrors(await _generalLedgerManager.CreateAsync(orderitemoutput));
                        }
                    }
                }
            }
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }
    }
}
