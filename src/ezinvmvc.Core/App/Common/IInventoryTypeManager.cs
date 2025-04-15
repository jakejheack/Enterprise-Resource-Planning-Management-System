using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IInventoryTypeManager : IDomainService
    {
        Task<IEnumerable<InventoryType>> GetAllList();
        Task<IEnumerable<InventoryType>> GetAllListByCode(int code);
    }
}
