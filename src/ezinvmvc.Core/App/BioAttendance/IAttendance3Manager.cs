using Abp.Domain.Services;
using ezinvmvc.App.BioAttendance.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IAttendance3Manager : IDomainService
    {
        Task<IdentityResult> CreateAsync(Attendance3 entity);
    }
}
