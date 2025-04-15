using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public class TimeSchedManager : DomainService, ITimeSchedManager
    {
        private readonly IRepository<TimeSched> _repositoryTimeSched;
        private readonly IDapperRepository<TimeSched> _repositoryTimeSchedDapper;

        public TimeSchedManager(IRepository<TimeSched> repository, IDapperRepository<TimeSched> repositoryDapper)
        {
            _repositoryTimeSched = repository;
            _repositoryTimeSchedDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(TimeSched entity)
        {
            var result = _repositoryTimeSched.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryTimeSched.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryTimeSched.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryTimeSched.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<TimeSched>> GetAsync()
        {
            string wc = " Where IsDeleted = 0 ";
            string sort = " order by Id asc";
            var dp = new DynamicParameters();
            try
            {
                IEnumerable<TimeSched> getAll = await _repositoryTimeSchedDapper.QueryAsync<TimeSched>("select * from AppTimeSched " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<TimeSched> GetByIdAsync(int id)
        {
            string wc = " Where IsDeleted = 0 And (Id = @id) ";
            string sort = " order by Id asc";
            var dp = new DynamicParameters();
            dp.Add("@id", id);
            try
            {
                var getAll = await _repositoryTimeSchedDapper.QueryAsync<TimeSched>("select * from AppTimeSched " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
