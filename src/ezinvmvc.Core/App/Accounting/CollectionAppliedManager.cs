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

namespace ezinvmvc.App.Accounting
{
   public class CollectionAppliedManager : DomainService, ICollectionAppliedManager
    {
        private readonly IRepository<CollectionApplied> _repository;
        private readonly IDapperRepository<CollectionApplied> _repositoryDapper;

        public CollectionAppliedManager(IRepository<CollectionApplied> repository, IDapperRepository<CollectionApplied> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(CollectionApplied entity)
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

        public async Task<IEnumerable<CollectionApplied>> GetAllByParentId(int parentid)
        {
            string wc = " Where colap.collectionid = @parentid and colap.isdeleted = 0 ";
            string sort = " order by colap.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                //EWT
                //var getAll = await _repositoryDapper.QueryAsync<CollectionApplied>("select colap.*, CASE WHEN IsFullyPaid = 1 THEN 'Full' ELSE 'Partial' END Status, si.Code SalesInvoiceCode, a.Name Account,si.TransactionTime SalesInvoiceTime,si.GrandTotal SalesInvoiceTotal from AppCollectionApplied colap inner join AppSalesInvoice si on si.Id = colap.SalesInvoiceId inner join AppAccount a on a.Id = colap.AgainstAccountId  " + wc + sort, dp);
                var getAll = await _repositoryDapper.QueryAsync<CollectionApplied>("select colap.*, CASE WHEN IsFullyPaid = 1 THEN 'Full' ELSE 'Partial' END Status, si.Code SalesInvoiceCode, a.Name Account,si.TransactionTime SalesInvoiceTime,si.BillGrandTotal SalesInvoiceTotal " + //si.GrandTotal SalesInvoiceTotal " +
                                                                                   ", isnull(tt.Name, '') ewt, isnull(ewta.Name, '') ewtAccount " +
                                                                                   "from AppCollectionApplied colap inner join AppSalesInvoice si on si.Id = colap.SalesInvoiceId inner join AppAccount a on a.Id = colap.AgainstAccountId  " +
                                                                                   "left outer join AppTaxTypes tt on colap.ewtid=tt.id left outer join AppAccount ewta on ewta.id=colap.ewtaccountid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<CollectionApplied> GetByIdAsync(int id)
        {
            string wc = " Where colap.Id = @Id ";
            string sort = " Order By colap.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<CollectionApplied>("select colap.* " +
                                                                                   ", isnull(tt.Name, '') ewt, isnull(ewta.Name, '') ewtAccount " +
                                                                                   "from appcollectinapplied colap " +
                                                                                   "left outer join AppTaxTypes tt on colap.ewtid=tt.id left outer join AppAccount ewta on ewta.id=colap.ewtaccountid " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(CollectionApplied entity)
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
