using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting.Dto;

namespace ezinvmvc.App.Accounting
{
    public class AccountTypeService : ezinvmvcAppServiceBase, IAccountTypeService
    {
        private readonly IAccountTypeManager _accountTypeManager;

        public AccountTypeService(IAccountTypeManager accountTypeManager)
        {
            _accountTypeManager = accountTypeManager;
        }

        public async Task<GetAccountTypeOutput> GetAccountType(GetAccountTypeInput input)
        {
            var getbyid = await _accountTypeManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetAccountTypeOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetAccountTypeOutput>> GetAccountTypelist()
        {
            var resultList = await _accountTypeManager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetAccountTypeOutput>(listcount, ObjectMapper.Map<List<GetAccountTypeOutput>>(resultList));
        }
    }
}
