using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.ExpenseItems.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.ExpenseItems
{
    [AbpAuthorize(PermissionNames.Master_ExpenseItems)]
    public class ExpenseItemService : ezinvmvcAppServiceBase, IExpenseItemService
    {
        private readonly IExpenseItemManager _expenseItemManager;

        public ExpenseItemService(IExpenseItemManager expenseItemManager) //, IExpenseItemUnitManager productUnitManager)
        {
            _expenseItemManager = expenseItemManager;
        }

        public async Task<int> CreateExpenseItem(CreateExpenseItemInput input)
        {
            ExpenseItem output = Mapper.Map<ExpenseItem>(input);
            CheckErrors(await _expenseItemManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }
        public async Task DeleteExpenseItem(DeleteExpenseItemInput input)
        {
            CheckErrors(await _expenseItemManager.DeleteAsync(input.Id));
        }
        public async Task<PagedResultDto<GetExpenseItemOutput>> GetExpenseItems(GetExpenseItemListInput input)
        {
            var resultList = await _expenseItemManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetExpenseItemOutput>(listcount, ObjectMapper.Map<List<GetExpenseItemOutput>>(resultList));
        }

        public async Task<GetExpenseItemOutput> GetExpenseItem(GetExpenseItemInput input)
        {
            var getbyid = await _expenseItemManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetExpenseItemOutput>(getbyid);
        }
        public async Task UpdateExpenseItem(UpdateExpenseItemInput input)
        {
            ExpenseItem output = Mapper.Map<UpdateExpenseItemInput, ExpenseItem>(input);

            CheckErrors(await _expenseItemManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task<PagedResultDto<GetExpenseItemOutput>> GetExpenseItemByName(GetExpenseItemListInput input)
        {
            var resultList = await _expenseItemManager.GetByName(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetExpenseItemOutput>(listcount, ObjectMapper.Map<List<GetExpenseItemOutput>>(resultList));
        }
    }
}
