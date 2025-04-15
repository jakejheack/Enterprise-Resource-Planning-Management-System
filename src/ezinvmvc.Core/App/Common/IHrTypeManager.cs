using Abp.Domain.Services;
using ezinvmvc.App.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IHrTypeManager : IDomainService
    {
        Task<IEnumerable<HRStatus>> GetAllPeriodTypeAsync();
        Task<IEnumerable<HRStatus>> GetAllPeriodRateAsync();
    }
}
