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
   public class QuotationChargeManager : DomainService, IQuotationChargeManager
    {
        private readonly IRepository<QuotationCharge> _repository;
        private readonly IDapperRepository<QuotationCharge> _repositoryDapper;

        public QuotationChargeManager(IRepository<QuotationCharge> repository, IDapperRepository<QuotationCharge> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(QuotationCharge entity)
        {
            await _repository.InsertAndGetIdAsync(entity);
            return IdentityResult.Success;
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

        public async Task<IEnumerable<QuotationCharge>> GetAllByParentId(int parentid)
        {
            string wc = " Where qc.quotationid = @parentid and qc.isdeleted = 0 ";

            string sort = " order by qc.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<QuotationCharge>(" select qc.*, ct.name ChargeType from appquotationcharges qc with (nolock) inner join appchargetypes ct with (nolock) on ct.id = qc.chargetypeid  " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<QuotationCharge> GetByIdAsync(int id)
        {
            string wc = " Where qc.Id = @Id ";
            string sort = " Order By qc.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<QuotationCharge>(" select qc.* from appquotationcharges qc with (nolock) " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(QuotationCharge entity)
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
