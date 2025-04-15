using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Accounting
{
    [AbpAuthorize(PermissionNames.Master_Accounts)]
    public class AccountService : ezinvmvcAppServiceBase, IAccountService
    {
        private readonly IAccountManager _accountManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;

        public AccountService(IAccountManager accountManager, IGeneralLedgerManager generalLedgerManager)
        {
            _accountManager = accountManager;
            _generalLedgerManager = generalLedgerManager;
        }

        public async Task CreateAccount(CreateAccountInput input)
        {
            Account output = Mapper.Map<Account>(input.account);

            CheckErrors(await _accountManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAccount(DeleteAccountInput input)
        {
            CheckErrors(await _accountManager.DeleteAsync(input.Id));
        }

        public async Task<GetAccountOutput> GetAccount(GetAccountInput input)
        {
            var getbyid = await _accountManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetAccountOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetAccountOutput>> GetAccountByName(GetAccountListInput input)
        {
            var resultList = await _accountManager.GetByName(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetAccountOutput>(listcount, ObjectMapper.Map<List<GetAccountOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetAccountOutput>> GetAccounts(GetAccountListInput input)
        {
            var resultList = await _accountManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAccountOutput>(listcount, ObjectMapper.Map<List<GetAccountOutput>>(resultList));
        }

        public async Task UpdateAccount(UpdateAccountInput input)
        {
            Account output = Mapper.Map<Account>(input.account);

            CheckErrors(await _accountManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetGeneralLedgerOutput>> GetGeneralLedgers(GetGeneralLedgerInput input)
        {
            //input.MaxResultCount = 1000000;
            var resultList = await _generalLedgerManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetGeneralLedgerOutput>(listcount, ObjectMapper.Map<List<GetGeneralLedgerOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetAccountOutput>> GetAccountByNode(GetAccountListInput input)
        {
            var resultList = await _accountManager.GetByNode(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetAccountOutput>(listcount, ObjectMapper.Map<List<GetAccountOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetAccountOutput>> GetAccountByParentNode(GetAccountListInput input)
        {
            var resultList = await _accountManager.GetByParentNode(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetAccountOutput>(listcount, ObjectMapper.Map<List<GetAccountOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetGeneralLedgerOutput>> GetTrialBalance(GetGeneralLedgerInput input)
        {
            input.MaxResultCount = 1000;
            var resultList = await _generalLedgerManager.GetTrialBalance(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetGeneralLedgerOutput>(listcount, ObjectMapper.Map<List<GetGeneralLedgerOutput>>(resultList));
        }
    }
}
