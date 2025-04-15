using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface IJournalEntryManager : IDomainService
    {
        Task<IEnumerable<JournalEntry>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<JournalEntry> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(JournalEntry entity);
        Task<IdentityResult> UpdateAsync(JournalEntry entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
