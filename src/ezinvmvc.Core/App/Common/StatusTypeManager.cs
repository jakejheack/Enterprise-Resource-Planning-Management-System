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
    public  class StatusTypeManager : DomainService, IStatusTypeManager
    {
        private readonly IRepository<StatusType> _repository;
        private readonly IDapperRepository<StatusType> _repositoryDapper;

        public StatusTypeManager(IRepository<StatusType> repository, IDapperRepository<StatusType> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IEnumerable<StatusType>> GetAllListFiltered(int Id, int TransactionCode, int Code)
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
            if (Code > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.Code = @Code) ";
                }
                else
                {
                    wc = wc + " And (v.Code = @Code) ";
                }
                dp.Add("@Code", Code);
            }
            string sort = "";
            
                sort = " order by v.id asc ";
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<StatusType>("select v.* FROM appstatustypes as v inner join apptransactions as t on v.transactioncode=t.code " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
