using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting.Dto;
using ezinvmvc.App.Common;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public class JournalEntryService : ezinvmvcAppServiceBase, IJournalEntryService
    {
        private readonly IJournalEntryManager _journalEntryManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IJournalEntryItemManager _journalEntryItemManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;

        public JournalEntryService(IJournalEntryManager journalEntryManager, ISeriesTypeManager seriesTypeManager, IJournalEntryItemManager journalEntryItemManager, IGeneralLedgerManager generalLedgerManager)
        {
            _journalEntryManager = journalEntryManager;
            _journalEntryItemManager = journalEntryItemManager;
            _seriesTypeManager = seriesTypeManager;
            _generalLedgerManager = generalLedgerManager;
        }

        public async Task<int> CreateJournalEntry(CreateJournalEntryInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.JournalEntry.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.JournalEntry.Code = seriescode;
            //series
            JournalEntry output = Mapper.Map<JournalEntry>(input.JournalEntry);
            CheckErrors(await _journalEntryManager.CreateAsync(output));

            foreach (JournalEntryItemInput item in input.JournalEntryItems)
            {
                item.JournalEntryId = output.Id;
                JournalEntryItem itemoutput = Mapper.Map<JournalEntryItem>(item);
                CheckErrors(await _journalEntryItemManager.CreateAsync(itemoutput));
            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task<PagedResultDto<JournalEntryOutput>> GetAllJournalEntry(GetJournalEntryListInput input)
        {
            var resultList = await _journalEntryManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<JournalEntryOutput>(listcount, ObjectMapper.Map<List<JournalEntryOutput>>(resultList));
        }

        public async Task<GetJournalEntryOutput> GetJournalEntry(GetJournalEntryInput input)
        {
            var getbyid = await _journalEntryManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetJournalEntryOutput>(getbyid);
        }

        public async Task<PagedResultDto<JournalEntryItemOutput>> GetJournalEntryItemByParentId(GetJournalEntryInput input)
        {
            var resultList = await _journalEntryItemManager.GetAllByParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<JournalEntryItemOutput>(listcount, ObjectMapper.Map<List<JournalEntryItemOutput>>(resultList));
        }

        public async Task<int> UpdateJournalEntry(UpdateJournalEntryInput input)
        {
            JournalEntry output = Mapper.Map<JournalEntry>(input.JournalEntry);
            CheckErrors(await _journalEntryManager.UpdateAsync(output));

            foreach (JournalEntryItemInput item in input.JournalEntryItems)
            {
                item.JournalEntryId = output.Id;
                JournalEntryItem itemoutput = Mapper.Map<JournalEntryItem>(item);
                if (item.IsDeleted == true)
                {
                    CheckErrors(await _journalEntryItemManager.DeleteAsync(itemoutput.Id));
                }
                else
                {
                    if (item.Id > 0)
                    {
                        CheckErrors(await _journalEntryItemManager.UpdateAsync(itemoutput));
                    }
                    else
                    {
                        CheckErrors(await _journalEntryItemManager.CreateAsync(itemoutput));
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
                    ledger.TransactionTypeId = seriestype.TransactionId; // output.SeriesTypeId;
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
