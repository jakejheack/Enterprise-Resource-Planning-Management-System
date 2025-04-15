using Abp.Domain.Services;
using ezinvmvc.App.Common.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IAttAdjustmentManager : IDomainService
    {
        Task<IEnumerable<AttAdjustmentTypes>> GetAllListAsync();
    }
}
