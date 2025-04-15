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
   public class SalesOrderItemManager : DomainService, ISalesOrderItemManager
    {
        private readonly IRepository<SalesOrderItem> _repository;
        private readonly IDapperRepository<SalesOrderItem> _repositoryDapper;

        public SalesOrderItemManager(IRepository<SalesOrderItem> repository, IDapperRepository<SalesOrderItem> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(SalesOrderItem entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repository.InsertAndGetIdAsync(entity);
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

        public async Task<IEnumerable<SalesOrderItem>> GetAllByParentId(int parentid)
        {
            string wc = " Where soi.salesorderid = @parentid and soi.isdeleted = 0 ";

            //MARC IndexNo for arrangement fix 09132022
            //string sort = " order by Id asc";
            string sort = " order by soi.IndexNo asc";
            //MARC IndexNo for arrangement fix 09132022

            //string retQty = ", isnull(tmpReturn.ReturnQty, 0) ReturnQty ";
            //string returns = " left outer join (select dri.salesorderitemid, sum(sei.qty) returnqty from appstockentryitem sei inner join appstockentry se on sei.stockentryid=se.id left outer join (select salesorderitemid, productid from AppDeliveryReceiptItem where deliveryreceiptid=(select id from appdeliveryreceipt where salesorderid = @parentid)) dri on dri.productid=sei.productid where se.defaultdestinationid = (select id from appdeliveryreceipt where salesorderid = @parentid) group by salesorderitemid) tmpReturn on soi.id=tmpReturn.salesorderitemid ";


            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {

                //var getAll = await _repositoryDapper.QueryAsync<SalesOrderItem>("select soi.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId from appsalesorderitems soi inner join appproducts p on p.id = soi.ProductId inner join appunits u on u.id = soi.unitid " + wc + sort, dp);
                //MARC 09/01/2021
                //var getAll = await _repositoryDapper.QueryAsync<SalesOrderItem>("select soi.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId, isnull(tmpDel.DeliveryQty  ,0) DeliveryQty, p.ImageName from appsalesorderitems soi inner join appproducts p on p.id = soi.ProductId inner join appunits u on u.id = soi.unitid left outer join(select SalesOrderItemId, sum(qty) DeliveryQty from AppDeliveryReceiptItem group by SalesOrderItemId) tmpDel on tmpDel.SalesOrderItemId = soi.Id  " + wc + sort, dp);
                //var getAll = await _repositoryDapper.QueryAsync<SalesOrderItem>("select soi.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId, isnull(tmpDel.DeliveryQty  ,0) DeliveryQty, p.ImageName from appsalesorderitems soi inner join appproducts p on p.id = soi.ProductId inner join appunits u on u.id = soi.unitid left outer join(select SalesOrderItemId, sum(isnull(deliveredQty, qty)) DeliveryQty from AppDeliveryReceiptItem group by SalesOrderItemId) tmpDel on tmpDel.SalesOrderItemId = soi.Id  " + wc + sort, dp);
                //var getAll = await _repositoryDapper.QueryAsync<SalesOrderItem>("select soi.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId, isnull(tmpDel.DeliveryQty  ,0) DeliveryQty, p.ImageName from appsalesorderitems soi inner join appproducts p on p.id = soi.ProductId inner join appunits u on u.id = soi.unitid left outer join (select salesorderitemid, sum(deliveryqty) as DeliveryQty from (select b.SalesOrderItemId, case when a.statusid = 2 then sum(DeliveredQty) else sum(qty) end DeliveryQty from appdeliveryreceipt a inner join AppDeliveryReceiptItem b on a.id=b.DeliveryReceiptId group by a.StatusId, b.SalesOrderItemId) as dr group by SalesOrderItemId) tmpDel on tmpDel.SalesOrderItemId = soi.Id  " + wc + sort, dp);
                var getAll = await _repositoryDapper.QueryAsync<SalesOrderItem>(" select soi.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId, isnull(tmpDel.DeliveryQty  ,0) DeliveryQty, p.ImageName from appsalesorderitems soi with (nolock) inner join appproducts p on p.id = soi.ProductId inner join appunits u with (nolock) on u.id = soi.unitid left outer join (select salesorderitemid, sum(deliveryqty) as DeliveryQty from (select b.SalesOrderItemId, case when a.statusid = 2 then sum(DeliveredQty) else sum(qty) end DeliveryQty from appdeliveryreceipt a with (nolock) inner join AppDeliveryReceiptItem b with (nolock) on a.id=b.DeliveryReceiptId group by a.StatusId, b.SalesOrderItemId) as dr group by SalesOrderItemId) tmpDel  on tmpDel.SalesOrderItemId = soi.Id " + wc + sort, dp);

                //END MARC 09/01/2021
                //var getAll = await _repositoryDapper.QueryAsync<SalesOrderItem>("select soi.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId, isnull(tmpDel.DeliveryQty  ,0) DeliveryQty" + retQty + ", p.ImageName from appsalesorderitems soi inner join appproducts p on p.id = soi.ProductId inner join appunits u on u.id = soi.unitid left outer join(select SalesOrderItemId, sum(qty) DeliveryQty from AppDeliveryReceiptItem group by SalesOrderItemId) tmpDel on tmpDel.SalesOrderItemId = soi.Id " + returns + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<SalesOrderItem> GetByIdAsync(int id)
        {
            string wc = " Where soi.Id = @Id ";
            string sort = " Order By soi.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<SalesOrderItem>("select soi.* from appsalesorderitems soi " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SalesOrderItem entity)
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
