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
    public class DeliveryReceiptChargeManager : DomainService, IDeliveryReceiptChargeManager
    {
        private readonly IRepository<DeliveryReceiptCharge> _repository;
        private readonly IDapperRepository<DeliveryReceiptCharge> _repositoryDapper;

        public DeliveryReceiptChargeManager(IRepository<DeliveryReceiptCharge> repository, IDapperRepository<DeliveryReceiptCharge> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(DeliveryReceiptCharge entity)
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

        public async Task<IEnumerable<DeliveryReceiptCharge>> GetAllByParentId(int parentid)
        {
            string wc = " Where drc.deliveryreceiptid = @parentid and drc.isdeleted = 0 ";

            string sort = " order by drc.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<DeliveryReceiptCharge>(" select drc.*, ct.name ChargeType from appdeliveryreceiptcharge drc with (nolock) inner join appchargetypes ct with (nolock) on ct.id = drc.chargetypeid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<DeliveryReceiptCharge> GetByIdAsync(int id)
        {
            string wc = " Where drc.Id = @Id ";
            string sort = " Order By drc.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<DeliveryReceiptCharge>(" select drc.* from appdeliveryreceiptcharge drc with (nolock) " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(DeliveryReceiptCharge entity)
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
