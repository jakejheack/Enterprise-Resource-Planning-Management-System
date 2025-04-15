using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using ezinvmvc.App.Common.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public class HrTypeManager : DomainService, IHrTypeManager
    {
        private readonly IRepository<HRStatus> _repository;
        private readonly IDapperRepository<HRStatus> _repositoryDapper;

        public HrTypeManager(IRepository<HRStatus> repository, IDapperRepository<HRStatus> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IEnumerable<HRStatus>> GetAllPeriodTypeAsync()
        {
            string wc = " Where TypeCode = '1'";
            string sort = " order by Id asc";
            try
            {
                IEnumerable<HRStatus> getAll = await _repositoryDapper.QueryAsync<HRStatus>("select * from AppHRStatusTypes " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<HRStatus>> GetAllPeriodRateAsync()
        {
            string wc = " Where TypeCode = '2'";
            string sort = " order by Id asc";
            try
            {
                IEnumerable<HRStatus> getAll = await _repositoryDapper.QueryAsync<HRStatus>("select * from AppHRStatusTypes " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }

        }
    }
}
