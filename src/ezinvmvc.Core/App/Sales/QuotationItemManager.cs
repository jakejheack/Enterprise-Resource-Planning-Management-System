using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using Dapper;
using Abp.Dapper.Repositories;
using System;
using System.Linq;

namespace ezinvmvc.App.Sales
{
    public class QuotationItemManager : DomainService, IQuotationItemManager
    {
        private readonly IRepository<QuotationItem> _repository;
        private readonly IDapperRepository<QuotationItem> _repositoryDapper;

        public QuotationItemManager(IRepository<QuotationItem> repository, IDapperRepository<QuotationItem> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(QuotationItem entity)
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

        public async Task<IEnumerable<QuotationItem>> GetAllByParentId(int parentid)
        {
            string wc = " Where qi.quotationid = @parentid and qi.isdeleted = 0 ";

            //MARC IndexNo for arrangement fix 09132022
            //string sort = " order by qi.Id asc";
            string sort = " order by qi.IndexNo,qi.LastModificationTime asc";
            //MARC IndexNo for arrangement fix 09132022

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<QuotationItem>(" select qi.*,p.code ProductCode, u.name Unit,p.name ProductName, p.description ProductDescription, p.ImageName  from appquotationitems qi with (nolock) inner join appproducts p with (nolock) on p.id = qi.ProductId inner join appunits u with (nolock) on u.id = qi.unitid  " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<QuotationItem> GetByIdAsync(int id)
        {
            string wc = " Where qi.Id = @Id ";
            string sort = " Order By qi.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                //var output = await _repositoryDapper.QueryAsync<QuotationItem>("select soi.* from appquotationitems qi " + wc + sort, dp);
                var output = await _repositoryDapper.QueryAsync<QuotationItem>(" select qi.* from appquotationitems qi with (nolock) " + wc + sort, dp);

                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(QuotationItem entity)
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
