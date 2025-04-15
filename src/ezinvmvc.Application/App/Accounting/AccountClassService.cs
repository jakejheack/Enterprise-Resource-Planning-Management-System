using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting.Dto;
using ezinvmvc.App.Accounting.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public class AccountClassService : ezinvmvcAppServiceBase, IAccountClassService
    {
        private readonly IAccountClassManager _accountClassManager;

        public AccountClassService(IAccountClassManager accountClassManager)
        {
            _accountClassManager = accountClassManager;
        }

        public async Task<GetAccountClassOutput> GetAccountClass(GetAccountClassInput input)
        {
            var getbyid = await _accountClassManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetAccountClassOutput>(getbyid);
          
        }

        public async Task<PagedResultDto<GetAccountClassOutput>> GetAccountClasslist()
        {
            var resultList = await _accountClassManager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetAccountClassOutput>(listcount, ObjectMapper.Map<List<GetAccountClassOutput>>(resultList));
        }
    }
}
