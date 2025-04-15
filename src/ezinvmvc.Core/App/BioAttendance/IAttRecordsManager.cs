using Abp.Domain.Services;
using ezinvmvc.App.BioAttendance.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IAttRecordsManager : IDomainService
    {
        Task<IEnumerable<AttRecords>> GetAttRecAsync(string filter, string sorting);
    }
}
