using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.ExpenseItems
{
    public interface IExpenseItemManager : IDomainService
    {
        Task<IEnumerable<ExpenseItem>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<ExpenseItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(ExpenseItem entity);
        Task<IdentityResult> UpdateAsync(ExpenseItem entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<ExpenseItem>> GetByName(string name);

    }
}
