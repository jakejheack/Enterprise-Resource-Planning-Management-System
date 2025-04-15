using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface ISeriesTypeManager : IDomainService
    {
        Task<IEnumerable<SeriesType>> GetAllList();
        Task<IEnumerable<SeriesType>> GetAllListFiltered(int id, int transactionid, int companyid);
        Task<SeriesType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SeriesType entity);
        Task<IdentityResult> UpdateAsync(SeriesType entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<SeriesType>> GetAllListByTransId(int transactionid, int companyid);

        Task<IEnumerable<SeriesType>> GetAllListFilteredCross(int id, int id2, int transactionid, int companyid);

    }
}
