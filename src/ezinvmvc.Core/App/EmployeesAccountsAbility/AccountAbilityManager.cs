using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesAccountsAbility;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesAccountsAbility
{
    public class AccountAbilityManager : DomainService, IAccountAbilityManager
    {
        private readonly IRepository<AccountAbility> _repositoryAccountAbility;
        private readonly IDapperRepository<AccountAbility> _repositoryAccountAbilityDapper;

        public AccountAbilityManager(IRepository<AccountAbility> repository, IDapperRepository<AccountAbility> repositoryDapper)
        {
            _repositoryAccountAbility = repository;
            _repositoryAccountAbilityDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAccountAbilityAsync(AccountAbility entity)
        {
            var result = _repositoryAccountAbility.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryAccountAbility.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAccountAbilityAsync(int id)
        {
            var result = _repositoryAccountAbility.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryAccountAbility.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<AccountAbility> GetAccountAbilityByIdAsync(int id)
        {
            var result = _repositoryAccountAbility.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryAccountAbility.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<AccountAbility>> GetAllAccountAbility(string filter)
        {
            string wc = " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (EmpId = @Filter) ";
            }
            //string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
            //    sort = " order by DateIssue asc ";
            //}
            var dp = new DynamicParameters();
            dp.Add("@Filter",filter);
            try
            {
                IEnumerable<AccountAbility> getAll = await _repositoryAccountAbilityDapper.QueryAsync<AccountAbility>("Select * from AppAccountsAbility " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAccountAbilityAsync(AccountAbility entity)
        {
            try
            {
                await _repositoryAccountAbility.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
