using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public class RFQDetailsManager : DomainService, IRFQDetailsManager
    {
        private readonly IRepository<RFQDetails> _repository;
        private readonly IDapperRepository<RFQDetails> _repositoryDapper;

        public RFQDetailsManager(IRepository<RFQDetails> repository, IDapperRepository<RFQDetails> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(RFQDetails entity)
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

        public async Task<IEnumerable<RFQDetails>> GetAllByParentIdAsync(int parentid)
        {
            string wc = " Where rfqd.rfqid = @parentid and rfqd.isdeleted = 0 ";

            string sort = " order by rfqd.Indexno asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                ////var getAll = await _repositoryDapper.QueryAsync<RFQDetails>("select rfqd.*,p.code ProductCode, u.name Unit from apprfqdetails rfqd inner join appproducts p on p.id = rfqd.ProductId inner join appunits u on u.id = rfqd.unitid " + wc + sort, dp);
                var getAll = await _repositoryDapper.QueryAsync<RFQDetails>(" select rfqd.*,p.code ProductCode, u.name as Unit,p.Name as RFQCode from apprfqdetails rfqd with (nolock) left outer join appproducts p with (nolock) on p.id = rfqd.ProductId left outer join appunits u with (nolock) on u.id = rfqd.unitid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<RFQDetails> GetByIdAsync(int id)
        {
            string wc = " Where rfqd.Id = @Id ";
            string sort = " Order By rfqd.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<RFQDetails>(" select rfqd.* from apprfqdetails rfqd with (nolock)  " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(RFQDetails entity)
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
