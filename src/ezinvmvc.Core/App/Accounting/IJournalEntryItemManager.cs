using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface IJournalEntryItemManager : IDomainService
    {
        Task<IEnumerable<JournalEntryItem>> GetAllByParentIdAsync(int parentid);
        Task<JournalEntryItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(JournalEntryItem entity);
        Task<IdentityResult> UpdateAsync(JournalEntryItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
