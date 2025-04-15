using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IStatusTypeManager : IDomainService
    {
        Task<IEnumerable<StatusType>> GetAllListFiltered(int id, int transactionid, int code);

    }
}
