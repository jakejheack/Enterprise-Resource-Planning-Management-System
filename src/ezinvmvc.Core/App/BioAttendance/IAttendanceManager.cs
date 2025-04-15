using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using ezinvmvc.App.BioAttendance.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IAttendanceManager : IDomainService
    {
        Task<IdentityResult> CreateAttendanceAsync(Attendance entity);

        Task<IEnumerable<Attendance>> GetAttendanceAsync();

        Task<IEnumerable<Attendance>> GetAttendanceByIdAsync(string filter);

        Task<IEnumerable<Attendance>> GetAttendanceByCodeAsync(string filter);

        Task<IEnumerable<Attendance>> GetAttendance(string filter);

        Task<Attendance> GetTop1AttendanceAscAsync(string AttId);

        Task<Attendance> GetTop1AttendanceDescAsync(string AttId);

        Task<Attendance> GetRestdaycAsync(int EmpId, string Day);

        Task<IEnumerable<Attendance>> GetAttAsync();
    }
}
