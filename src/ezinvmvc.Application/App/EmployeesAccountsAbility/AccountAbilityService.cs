using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.EmployeesAccountsAbility.Dto;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.EmployeesAccountsAbility
{

    [AbpAuthorize(PermissionNames.Master_Employees)]
    public class AccountAbilityService : ezinvmvcAppServiceBase, IAccountAbilityService
    {
        private readonly IAccountAbilityManager _Manager;
        public AccountAbilityService(IAccountAbilityManager accountAbilityManager)
        {
            _Manager = accountAbilityManager;
        }

        public async Task CreateAccoutAbility(CreateAccoutnAbilityInput input)
        {
            AccountAbility output = Mapper.Map<AccountAbility>(input);

            CheckErrors(await _Manager.CreateAccountAbilityAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAccoutAbility(DeleteAccountAbilityInput input)
        {
            CheckErrors(await _Manager.DeleteAccountAbilityAsync(input.Id));
        }

        public async Task<PagedResultDto<GetAccountAbilityOutput>> GetAccountsAbility(GetAccountAblityListInput input)
        {
            var resultList = await _Manager.GetAllAccountAbility(input.Filter);
            //var resultList = await _Manager.GetAllAccountAbility(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAccountAbilityOutput>(listcount, ObjectMapper.Map<List<GetAccountAbilityOutput>>(resultList));
        }

        //public Task<IEnumerable<GetAccountAbilityOutput>> GetAlltAccountsAbility()
        //{
        //    throw new NotImplementedException();
        //}

        public async Task UpdateAccoutAbility(UpdateAccountAbilityInput input)
        {
            AccountAbility output = Mapper.Map<UpdateAccountAbilityInput, AccountAbility>(input);
            CheckErrors(await _Manager.UpdateAccountAbilityAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
