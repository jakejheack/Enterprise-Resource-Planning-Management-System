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
    public class InventoryTypeManager : DomainService, IInventoryTypeManager
    {
        private readonly IRepository<InventoryType> _repository;
        private readonly IDapperRepository<InventoryType> _repositoryDapper;

        public InventoryTypeManager(IRepository<InventoryType> repository, IDapperRepository<InventoryType> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IEnumerable<InventoryType>> GetAllList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<IEnumerable<InventoryType>> GetAllListByCode(int code)
        {
            string wc = " where EntryTypeCode = @EntryTypeCode ";

            string sort = " order by Name asc ";

            var dp = new DynamicParameters();
            dp.Add("@EntryTypeCode", code);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<InventoryType>("select * from AppInventoryType " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
