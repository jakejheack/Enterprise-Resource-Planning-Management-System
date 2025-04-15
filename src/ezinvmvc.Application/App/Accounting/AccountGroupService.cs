using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting.Dto;

namespace ezinvmvc.App.Accounting
{
    public class AccountGroupService : ezinvmvcAppServiceBase, IAccountGroupService
    {
        private readonly IAccountGroupManager _accountGroupManager;

        public AccountGroupService(IAccountGroupManager accountGroupManager)
        {
            _accountGroupManager = accountGroupManager;
        }

        public async Task<GetAccountGroupOutput> GetAccountGroup(GetAccountGroupInput input)
        {
            var getbyid = await _accountGroupManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetAccountGroupOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetAccountGroupOutput>> GetAccountGrouplist()
        {
            var resultList = await _accountGroupManager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetAccountGroupOutput>(listcount, ObjectMapper.Map<List<GetAccountGroupOutput>>(resultList));
        }
    }
}
