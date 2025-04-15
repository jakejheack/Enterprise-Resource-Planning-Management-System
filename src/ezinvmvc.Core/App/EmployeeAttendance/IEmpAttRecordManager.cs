using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeAttendance
{
    public interface IEmpAttRecordManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(EmpAttRecord entity);
        Task<IEnumerable<EmpAttRecord>> GetEmpAttIdAsync(string filter);
        Task<IEnumerable<EmpAttRecord>> GetEmpAttAsync(string filter);
        Task<IdentityResult> DeleteEmpAttIdAsync(int id);
    }
}
