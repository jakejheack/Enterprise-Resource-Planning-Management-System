using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.CheckVoucher.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CheckVoucher
{
    public class CVDManager : DomainService, ICVDManager
    {
        private readonly IRepository<CVD> _repository;
        private readonly IDapperRepository<CVD> _repositoryDapper;

        public CVDManager(IRepository<CVD> repository, IDapperRepository<CVD> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(CVD entity)
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

        public async Task<IEnumerable<CVD>> GetAllByParentIdAsync(int parentid)
        {
            string wc = " Where RFPItem.RequestId = @parentid and RFPItem.isdeleted = 0 ";

            string sort = " order by Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                ////var getAll = await _repositoryDapper.QueryAsync<RFQDetails>("select rfqd.*,p.code ProductCode, u.name Unit from apprfqdetails rfqd inner join appproducts p on p.id = rfqd.ProductId inner join appunits u on u.id = rfqd.unitid " + wc + sort, dp);
                var getAll = await _repositoryDapper.QueryAsync<CVD>("select RFPItem.*,p.code ProductCode, u.name Unit  from AppRFPItem RFPItem left outer join appproducts p on p.id = RFPItem.ProductId left outer join appunits u on u.id = RFPItem.unitid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<CVD> GetByIdAsync(int id)
        {
            string wc = " Where RFPItem.Id = @Id ";
            string sort = " Order By RFPItem.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<CVD>("select RFPItem.* from AppRFPItem RFPItem  " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(CVD entity)
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
