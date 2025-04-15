using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public class AccountExecutiveService : ezinvmvcAppServiceBase, IAccountExecutiveService
    {
        private readonly IAccountExecutiveManager _accountExecutiveManager;

        public AccountExecutiveService(IAccountExecutiveManager accountExecutiveManager)
        {
            _accountExecutiveManager = accountExecutiveManager;
        }

        public async Task<int> CreateAccountExecutive(CreateAccountExecutiveInput input)
        {
            AccountExecutive output = Mapper.Map<AccountExecutive>(input);
            CheckErrors(await _accountExecutiveManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteAccountExecutive(DeleteAccountExecutiveInput input)
        {
            CheckErrors(await _accountExecutiveManager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetAccountExecutiveOutput>> GetAccountExecutives(GetAccountExecutiveListInput input)
        {
            var resultList = await _accountExecutiveManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAccountExecutiveOutput>(listcount, ObjectMapper.Map<List<GetAccountExecutiveOutput>>(resultList));
        }

        public async Task<GetAccountExecutiveOutput> GetAccountExecutive(GetAccountExecutiveInput input)
        {
            var getbyid = await _accountExecutiveManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetAccountExecutiveOutput>(getbyid);
        }

        public async Task UpdateAccountExecutive(UpdateAccountExecutiveInput input)
        {
            AccountExecutive output = Mapper.Map<AccountExecutive>(input);
            CheckErrors(await _accountExecutiveManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
