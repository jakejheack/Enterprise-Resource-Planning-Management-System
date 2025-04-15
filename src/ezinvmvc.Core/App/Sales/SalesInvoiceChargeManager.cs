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
   public class SalesInvoiceChargeManager : DomainService, ISalesInvoiceChargeManager
    {
        private readonly IRepository<SalesInvoiceCharge> _repository;
        private readonly IDapperRepository<SalesInvoiceCharge> _repositoryDapper;

        public SalesInvoiceChargeManager(IRepository<SalesInvoiceCharge> repository, IDapperRepository<SalesInvoiceCharge> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(SalesInvoiceCharge entity)
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

        public async Task<IEnumerable<SalesInvoiceCharge>> GetAllByParentId(int parentid)
        {
            string wc = " Where sic.salesinvoiceid = @parentid and sic.isdeleted = 0 ";
            string wc2 = "where sic2.salesinvoiceid != @parentid2 and si2.IsDeleted = 0 and si2.StatusId < 5 ";

            string sort = " order by sic.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            dp.Add("@parentid2", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesInvoiceCharge>(" select sic.*, ct.name ChargeType, ct.RevenueAccountId, isnull(billedtotal,0) BilledTotal, Total - (isnull(billedtotal,0)) Balance from appsalesinvoicecharge sic with (nolock) inner join AppSalesInvoice si with (nolock) on sic.SalesInvoiceId=si.id inner join appchargetypes ct with (nolock) on ct.id = sic.chargetypeid " +
                    "left outer join (select si2.salesorderid, sum(billtotal) billedtotal from AppSalesInvoiceCharge sic2 inner join AppSalesInvoice si2 on sic2.SalesInvoiceId=si2.id " + wc2 + " group by si2.SalesOrderId) tmpsi on si.SalesOrderId = tmpsi.SalesOrderId " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<SalesInvoiceCharge> GetByIdAsync(int id)
        {
            string wc = " Where sic.Id = @Id ";
            string sort = " Order By sic.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<SalesInvoiceCharge>(" select sic.* from appsalesinvoicecharge sic with (nolock) " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SalesInvoiceCharge entity)
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
