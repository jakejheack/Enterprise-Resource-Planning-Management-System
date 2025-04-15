using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Accounting.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
   public interface IAccountTypeService : IApplicationService
    {
        Task<GetAccountTypeOutput> GetAccountType(GetAccountTypeInput input);
        Task<PagedResultDto<GetAccountTypeOutput>> GetAccountTypelist();
    }
}
