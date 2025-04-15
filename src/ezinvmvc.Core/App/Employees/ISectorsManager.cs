using Abp.Domain.Services;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface ISectorsManager : IDomainService
    {
        Task<IEnumerable<Sectors>> GetAllSectorsList(string filter, string sorting);

        Task<Sectors> GetSectorsByIdAsync(int id);

        Task<IdentityResult> CreateSectorsAsync(Sectors entity);

        Task<IdentityResult> UpdateSectorsAsync(Sectors entity);

        Task<IdentityResult> DeleteSectorsAsync(int id);

        Task<IEnumerable<Sectors>> GetAllSectors();
    }
}
