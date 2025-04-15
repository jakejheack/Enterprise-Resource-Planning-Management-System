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
   public class SalesOrderChargeManager : DomainService, ISalesOrderChargeManager
    {
        private readonly IRepository<SalesOrderCharge> _repository;
        private readonly IDapperRepository<SalesOrderCharge> _repositoryDapper;

        public SalesOrderChargeManager(IRepository<SalesOrderCharge> repository, IDapperRepository<SalesOrderCharge> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(SalesOrderCharge entity)
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

        public async Task<IEnumerable<SalesOrderCharge>> GetAllByParentId(int parentid)
        {
            string wc = " Where soc.salesorderid = @parentid and soc.isdeleted = 0 ";

            string sort = " order by soc.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesOrderCharge>(" select soc.*,ct.RevenueAccountId, ct.name ChargeType,isnull(tmpDel.DeliveryRate  ,0) DeliveryRate, isnull(billedtotal,0) BillTotal, Total - isnull(billedtotal,0) Balance from appsalesordercharges soc with (nolock) inner join appchargetypes ct with (nolock) on ct.id = soc.chargetypeid left outer join(select SalesOrderChargeId, sum(Rate) DeliveryRate from AppDeliveryReceiptCharge with (nolock) group by SalesOrderChargeId) tmpDel on tmpDel.SalesOrderChargeId = soc.Id " +
                    "left outer join (select si.salesorderid, sum(billtotal) billedtotal from AppSalesInvoiceCharge sic inner join AppSalesInvoice si on sic.SalesInvoiceId=si.id where si.IsDeleted = 0 and si.StatusId < 5 group by si.SalesOrderId) tmpsi on soc.salesorderid=tmpsi.salesorderid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<SalesOrderCharge> GetByIdAsync(int id)
        {
            string wc = " Where soc.Id = @Id ";
            string sort = " Order By soc.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<SalesOrderCharge>(" select soc.* from appsalesordercharges soc with (nolock) " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SalesOrderCharge entity)
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
