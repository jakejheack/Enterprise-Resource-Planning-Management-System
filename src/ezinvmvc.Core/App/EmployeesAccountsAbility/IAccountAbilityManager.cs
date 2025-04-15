using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesAccountsAbility
{
    public interface IAccountAbilityManager : IDomainService
    {
        Task<IEnumerable<AccountAbility>> GetAllAccountAbility(string filter);

        Task<AccountAbility> GetAccountAbilityByIdAsync(int id);

        Task<IdentityResult> CreateAccountAbilityAsync(AccountAbility entity);

        Task<IdentityResult> UpdateAccountAbilityAsync(AccountAbility entity);

        Task<IdentityResult> DeleteAccountAbilityAsync(int id);

        //Task<IEnumerable<AccountAbility>> GetAllAccountAbility();
    }
}
