using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Common
{
    public  class SeriesTypeManager : DomainService, ISeriesTypeManager
    {
        private readonly IRepository<SeriesType> _repository;
        private readonly IDapperRepository<SeriesType> _repositoryDapper;

        public SeriesTypeManager(IRepository<SeriesType> repository, IDapperRepository<SeriesType> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(SeriesType entity)
        {
            var result = _repository.FirstOrDefault(x => x.Prefix == entity.Prefix);
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

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repository.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<SeriesType>> GetAllList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<IEnumerable<SeriesType>> GetAllListByTransId(int transactioncode, int companyid)
        {
            string wc = " where st.companyid = @companyid and t.code = @transactioncode ";

            string sort = " order by prefix asc ";

            var dp = new DynamicParameters();
            dp.Add("@companyid", companyid);
            dp.Add("@transactioncode", transactioncode);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SeriesType>("select st.* from appseriestype st inner join apptransactions t on t.id = st.transactionid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<SeriesType> GetByIdAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repository.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<SeriesType>> GetAllListFiltered(int Id, int TransactionCode, int CompanyId)
        {
            string wc = ""; //" Where isdeleted = 0 ";
            var dp = new DynamicParameters();
            if (Id > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.Id = @id) ";
                }
                else
                {
                    wc = wc + " And (v.Id = @id) ";
                }
                dp.Add("@id", Id);
            }
            if (TransactionCode > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (t.Code = @transcode) ";
                }
                else
                {
                    wc = wc + " And (T.Code = @transcode) ";
                }
                dp.Add("@transcode", TransactionCode);
            }
            if (CompanyId > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.CompanyId = @compid) ";
                }
                else
                {
                    wc = wc + " And (v.CompanyId = @compid) ";
                }
                dp.Add("@compid", CompanyId);
            }
            string sort = "";
            
                sort = " order by v.id asc ";
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SeriesType>("select v.*, t.Name as TransactionName FROM appseriestype as v inner join apptransactions as t on v.transactionid=t.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SeriesType entity)
        {
            try
            {
                await _repository.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<SeriesType>> GetAllListFilteredCross(int Id, int Id2, int TransactionCode, int CompanyId)
        {
            string wc = ""; //" Where isdeleted = 0 ";
            var dp = new DynamicParameters();
            if (Id > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.Id = @id) or (v.Id = @id2)  ";
                }
                else
                {
                    wc = wc + " And (v.Id = @id) or (v.Id = @id2) ";
                }
                dp.Add("@id", Id);
                dp.Add("@id2", Id2);
            }
            if (TransactionCode > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (t.Code = @transcode) ";
                }
                else
                {
                    wc = wc + " And (T.Code = @transcode) ";
                }
                dp.Add("@transcode", TransactionCode);
            }
            if (CompanyId > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.CompanyId = @compid) ";
                }
                else
                {
                    wc = wc + " And (v.CompanyId = @compid) ";
                }
                dp.Add("@compid", CompanyId);
            }
            string sort = "";

            sort = " order by v.id asc ";
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SeriesType>("select v.* FROM appseriestype as v inner join apptransactions as t on v.transactionid=t.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
