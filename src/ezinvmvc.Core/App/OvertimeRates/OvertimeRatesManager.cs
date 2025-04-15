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
    public class OvertimeRatesManager : DomainService, IOvertimeRatesManager
    {
        private readonly IRepository<OvertimeRate> _repositoryOvertimeRates;
        private readonly IDapperRepository<OvertimeRate> _repositoryOvertimeRatesDapper;

        public OvertimeRatesManager(IRepository<OvertimeRate> repository, IDapperRepository<OvertimeRate> repositoryDapper)
        {
            _repositoryOvertimeRates = repository;
            _repositoryOvertimeRatesDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateOvertimeRateAsync(OvertimeRate entity)
        {
            var result = _repositoryOvertimeRates.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryOvertimeRates.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteOvertimeRateAsync(int id)
        {
            var result = _repositoryOvertimeRates.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryOvertimeRates.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<OvertimeRate>> GetAllOvertimeRatesAsync()
        {
            string wc = " Where IsDeleted = 0 ";
            //if (filter != null && filter.Trim() != "")
            //{
            //    wc = wc + " And (a.EmpId = @Filter) ";
            //}
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            //dp.Add("@Filter", filter);
            try
            {
                IEnumerable<OvertimeRate> getAll = await _repositoryOvertimeRatesDapper.QueryAsync<OvertimeRate>("select * from AppOvertimeRate " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<OvertimeRate> GetOvertimeRateByIdAsync(int id)
        {
            string wc = " Where IsDeleted = 0 And (Id = @id) ";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@id", id);
            try
            {
                var getAll = await _repositoryOvertimeRatesDapper.QueryAsync<OvertimeRate>("select * from AppOvertimeRate " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateOvertimeRateAsync(OvertimeRate entity)
        {
            try
            {
                await _repositoryOvertimeRates.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
