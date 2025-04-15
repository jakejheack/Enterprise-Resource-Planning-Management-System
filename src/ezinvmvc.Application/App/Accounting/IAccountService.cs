using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Accounting.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface IAccountService : IApplicationService
    {
        Task<PagedResultDto<GetAccountOutput>> GetAccountByName(GetAccountListInput input);
        Task CreateAccount(CreateAccountInput input);
        Task UpdateAccount(UpdateAccountInput input);
        Task DeleteAccount(DeleteAccountInput input);
        Task<GetAccountOutput> GetAccount(GetAccountInput input);

        Task<PagedResultDto<GetGeneralLedgerOutput>> GetGeneralLedgers(GetGeneralLedgerInput input);
        Task<PagedResultDto<GetGeneralLedgerOutput>> GetTrialBalance(GetGeneralLedgerInput input);
        Task<PagedResultDto<GetAccountOutput>> GetAccountByNode(GetAccountListInput input);
        Task<PagedResultDto<GetAccountOutput>> GetAccountByParentNode(GetAccountListInput input);

    }
}
