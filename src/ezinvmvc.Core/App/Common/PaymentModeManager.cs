using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Common
{
   public class PaymentModeManager : DomainService, IPaymentModeManager
    {
        private readonly IRepository<PaymentMode> _repository;
        private readonly IDapperRepository<PaymentMode> _repositorySectorsDapper;

        public PaymentModeManager(IRepository<PaymentMode> repository, IDapperRepository<PaymentMode> repositoryDapper)
        {
            _repository = repository;
            _repositorySectorsDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(PaymentMode entity)
        {
            var result = _repository.FirstOrDefault(x => x.Name == entity.Name);
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

        public async Task<IEnumerable<PaymentMode>> GetAllList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<PaymentMode> GetByIdAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repository.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(PaymentMode entity)
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


        public async Task<IEnumerable<PaymentMode>> GetAllListWithFilterAsync(string filter, string sorting)
        {
            //Dito nko marc
            //Dito baguhin nlng enty nito
            string wc = " Where b.isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (a.Name like @Filter) ";
            }
            string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
                sort = " order by a.Id asc ";
            //}
            var dp = new DynamicParameters();
            dp.Add("@Filter", "%" + filter + "%");
            try
            {
                IEnumerable<PaymentMode> getAll = await _repositorySectorsDapper.QueryAsync<PaymentMode>("select a.*,b.Name as DefaultAccount from appPaymentMode as a inner join appaccount as b on a.DefaultAccountId = b.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
