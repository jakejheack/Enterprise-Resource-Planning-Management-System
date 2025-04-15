using Abp.Domain.Services;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IPositionManager : IDomainService
    {
        Task<IEnumerable<Position>> GetAllPositionsList(string filter, string sorting);

        Task<Position> GetPositiontByIdAsync(int id);

        Task<IdentityResult> CreatePositionAsync(Position entity);

        Task<IdentityResult> UpdatePositionAsync(Position entity);

        Task<IdentityResult> DeletePositionAsync(int id);

        Task<IEnumerable<Position>> GetAllPositions();
    }
}
