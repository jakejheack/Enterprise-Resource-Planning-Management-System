using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Common
{
  public  interface IVehicleTypeManager : IDomainService
    {
        Task<IEnumerable<VehicleType>> GetAllList();
        Task<VehicleType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(VehicleType entity);
        Task<IdentityResult> UpdateAsync(VehicleType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
