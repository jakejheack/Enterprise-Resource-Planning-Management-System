using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using ezinvmvc.App.BioAttendance.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public class Attendance3Manager : DomainService, IAttendance3Manager
    {
        private readonly IRepository<Attendance3> _repository;
        private readonly IDapperRepository<Attendance3> _repositoryDapper;

        public Attendance3Manager(IRepository<Attendance3> repository, IDapperRepository<Attendance3> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }


        public async Task<IdentityResult> CreateAsync(Attendance3 entity)
        {
            var result = _repository.FirstOrDefault(x => x.AttendanceId == entity.AttendanceId);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repository.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

    }
}
