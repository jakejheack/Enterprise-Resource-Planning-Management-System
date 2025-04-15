using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public class RFQOtherDetailsManager : DomainService, IRFQOtherDetailsManager
    {
        private readonly IRepository<RFQOtherDetails> _repository;
        private readonly IDapperRepository<RFQOtherDetails> _repositoryDapper;

        public RFQOtherDetailsManager(IRepository<RFQOtherDetails> repository, IDapperRepository<RFQOtherDetails> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(RFQOtherDetails entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
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

        public async Task<IEnumerable<RFQOtherDetails>> GetAllListAsync(int parentid)
        {
            string wc = " Where rfqid = @parentid and isdeleted = 0 ";

            string sort = " order by id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<RFQOtherDetails>(" select * from AppRFQOtherDetails  with (nolock) " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public Task<RFQOtherDetails> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IdentityResult> UpdateAsync(RFQOtherDetails entity)
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
    }
}
