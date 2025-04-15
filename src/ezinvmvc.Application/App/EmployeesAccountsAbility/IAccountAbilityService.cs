using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesAccountsAbility.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesAccountsAbility
{
    public interface IAccountAbilityService : IApplicationService
    {
        Task<PagedResultDto<GetAccountAbilityOutput>> GetAccountsAbility(GetAccountAblityListInput input);
        Task CreateAccoutAbility(CreateAccoutnAbilityInput input);
        Task UpdateAccoutAbility(UpdateAccountAbilityInput input);
        Task DeleteAccoutAbility(DeleteAccountAbilityInput input);
        //Task<IEnumerable<GetAccountAbilityOutput>> GetAlltAccountsAbility();
    }
}
