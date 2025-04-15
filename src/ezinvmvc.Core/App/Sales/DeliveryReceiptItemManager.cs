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
    public class DeliveryReceiptItemManager : DomainService, IDeliveryReceiptItemManager
    {
        private readonly IRepository<DeliveryReceiptItem> _repository;
        private readonly IDapperRepository<DeliveryReceiptItem> _repositoryDapper;

        public DeliveryReceiptItemManager(IRepository<DeliveryReceiptItem> repository, IDapperRepository<DeliveryReceiptItem> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(DeliveryReceiptItem entity)
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

        public async Task<IEnumerable<DeliveryReceiptItem>> GetAllByParentId(int parentid)
        {
            string wc = " Where dri.deliveryreceiptid = @parentid and dri.isdeleted = 0 ";

            //MARC IndexNo for arrangement fix 09132022
            //string sort = " order by dri.Id asc";
            string sort = " order by dri.IndexNo asc";
            //MARC IndexNo for arrangement fix 09132022

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<DeliveryReceiptItem>(" select dri.*,p.code ProductCode, u.name Unit,p.name ProductName, p.description ProductDescription, p.ImageName  from appdeliveryreceiptitem dri with (nolock) inner join appproducts p with (nolock) on p.id = dri.ProductId inner join appunits u with (nolock) on u.id = dri.unitid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<DeliveryReceiptItem> GetByIdAsync(int id)
        {
            string wc = " Where qi.Id = @Id ";
            string sort = " Order By qi.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<DeliveryReceiptItem>(" select dri.* from appdeliveryreceiptitem dri with (nolock) " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(DeliveryReceiptItem entity)
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
