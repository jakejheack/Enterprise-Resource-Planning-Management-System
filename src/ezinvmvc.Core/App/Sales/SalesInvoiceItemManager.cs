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
   public class SalesInvoiceItemManager : DomainService, ISalesInvoiceItemManager
    {
        private readonly IRepository<SalesInvoiceItem> _repository;
        private readonly IDapperRepository<SalesInvoiceItem> _repositoryDapper;

        public SalesInvoiceItemManager(IRepository<SalesInvoiceItem> repository, IDapperRepository<SalesInvoiceItem> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(SalesInvoiceItem entity)
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

        public async Task<IEnumerable<SalesInvoiceItem>> GetAllByParentId(int parentid)
        {
            string wc = " Where sii.salesinvoiceid = @parentid and sii.isdeleted = 0 ";

            //MARC IndexNo for arrangement fix 09132022
            //string sort = " order by Id asc";
            string sort = " order by sii.IndexNo asc";
            //MARC IndexNo for arrangement fix 09132022

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesInvoiceItem>(" select sii.*,p.code ProductCode,p.Name ProductName, u.name Unit,p.ExpenseAccountId,p.InventoryAccountId, p.IncomeAccountId, p.ImageName from appsalesinvoiceitem sii with (nolock) inner join appproducts p with (nolock) on p.id = sii.ProductId inner join appunits u with (nolock) on u.id = sii.unitid  " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<SalesInvoiceItem> GetByIdAsync(int id)
        {
            string wc = " Where sii.Id = @Id ";
            string sort = " Order By sii.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<SalesInvoiceItem>(" select sii.* from appsalesinvoiceitem sii with (nolock) " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SalesInvoiceItem entity)
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
