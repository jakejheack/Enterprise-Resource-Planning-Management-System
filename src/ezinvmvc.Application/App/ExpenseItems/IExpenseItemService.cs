using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.ExpenseItems.Dto;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.ExpenseItems
{
    public interface IExpenseItemService : IApplicationService
    {
        Task<PagedResultDto<GetExpenseItemOutput>> GetExpenseItems(GetExpenseItemListInput input);
        Task<PagedResultDto<GetExpenseItemOutput>> GetExpenseItemByName(GetExpenseItemListInput input);
        Task<int> CreateExpenseItem(CreateExpenseItemInput input);
        Task UpdateExpenseItem(UpdateExpenseItemInput input);
        Task DeleteExpenseItem(DeleteExpenseItemInput input);
        Task<GetExpenseItemOutput> GetExpenseItem(GetExpenseItemInput input);
    }
}
