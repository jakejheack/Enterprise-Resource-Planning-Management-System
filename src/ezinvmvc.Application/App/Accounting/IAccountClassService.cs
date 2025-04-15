using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Accounting.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface IAccountClassService : IApplicationService
    {
        Task<GetAccountClassOutput> GetAccountClass(GetAccountClassInput input);
        Task<PagedResultDto<GetAccountClassOutput>> GetAccountClasslist();
    }
}
