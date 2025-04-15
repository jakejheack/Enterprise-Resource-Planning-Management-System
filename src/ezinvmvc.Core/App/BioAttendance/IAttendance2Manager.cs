using Abp.Domain.Services;
using ezinvmvc.App.BioAttendance.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IAttendance2Manager : IDomainService
    {
        Task<IdentityResult> CreateAsync(Attendance2 entity);

        Task<IEnumerable<Attendance2>> GetAttendanceAsync(string filter, string sorting, int offset, int fetch);

        Task<IEnumerable<Attendance2>> GetAttIdAsync();

        Task<IEnumerable<Attendance2>> GetAttendanceByIdAsync(string filter, string sorting);

        Task<IdentityResult> DeleteAsync(int id);

        Task<IdentityResult> UpdateAsync(Attendance2 entity);

        //Adjustment Form//

        Task<IEnumerable<Attendance2>> GetAttendanceByAttIdandCompname(string filter, string sorting);

        Task<IEnumerable<Attendance2>> GetAttendanceByNo(string filter, string sorting);

        Task<IdentityResult> CreateTime(Attendance2 entity);

        Task<IEnumerable<Attendance2>> GetAttAdjReport(string filter, string sorting);

        Task<IEnumerable<Attendance2>> GetAttendanceRecordAsync(string filter, string sorting);

        Task<Attendance2> GetAttIdDataAsync(string AttendanceId);

        Task<IEnumerable<Attendance2>> GetAttRecAsync(string filter, string sorting);

        Task<IEnumerable<Attendance2>> GetAttAsync();
    }
}
