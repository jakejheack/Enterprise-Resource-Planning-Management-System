using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IAccountExecutiveService : IApplicationService
    {
        Task<PagedResultDto<GetAccountExecutiveOutput>> GetAccountExecutives(GetAccountExecutiveListInput input);
        Task<int> CreateAccountExecutive(CreateAccountExecutiveInput input);
        Task UpdateAccountExecutive(UpdateAccountExecutiveInput input);
        Task DeleteAccountExecutive(DeleteAccountExecutiveInput input);
        Task<GetAccountExecutiveOutput> GetAccountExecutive(GetAccountExecutiveInput input);
    }
}
