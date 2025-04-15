using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Accounting.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface IJournalEntryService : IApplicationService
    {
        Task<GetJournalEntryOutput> GetJournalEntry(GetJournalEntryInput input);
        Task<PagedResultDto<JournalEntryOutput>> GetAllJournalEntry(GetJournalEntryListInput input);
        Task<int> CreateJournalEntry(CreateJournalEntryInput input);
        Task<int> UpdateJournalEntry(UpdateJournalEntryInput input);

        Task<PagedResultDto<JournalEntryItemOutput>> GetJournalEntryItemByParentId(GetJournalEntryInput input);

    }
}
