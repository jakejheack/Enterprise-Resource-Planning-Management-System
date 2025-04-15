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
    public class PaymentTermManager : DomainService, IPaymentTermManager
    {
        private readonly IRepository<PaymentTerm> _repository;
        private readonly IDapperRepository<PaymentTerm> _repositoryDapper;

        public PaymentTermManager(IRepository<PaymentTerm> repository, IDapperRepository<PaymentTerm> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(PaymentTerm entity)
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

        //public async Task<IEnumerable<PaymentTerm>> GetAllList()
        //{
        //    return await _repository.GetAllListAsync();
        //}

        public async Task<IEnumerable<PaymentTerm>> GetAllList()
        {
            string wc = " Where isdeleted = 0";
            string sort = " order by Id asc";
            var dp = new DynamicParameters();
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<PaymentTerm>("Select * from AppPaymentTerms" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<PaymentTerm> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(PaymentTerm entity)
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
