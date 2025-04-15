using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Notification.Models;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Notification
{
    public class NotificationManager : DomainService, INotificationManager
    {
        private readonly IRepository<Models.Notification> _repository;
        private readonly IDapperRepository<Models.Notification> _repositoryDapper;
        public NotificationManager(IRepository<Models.Notification> repository, IDapperRepository<Models.Notification> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(Models.Notification entity)
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

        public async Task<IEnumerable<Models.Notification>> GetAll()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<IEnumerable<Models.Notification>> GetAllList(string filter, string sorting)
        {
            string wc = "";// " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " Where id = @Filter ";
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                sort = " order by Id asc ";
            }
            var dp = new DynamicParameters();
            dp.Add("@Filter", "%" + filter + "%");
            try
            {
                IEnumerable<Models.Notification> getAll = await _repositoryDapper.QueryAsync<Models.Notification>("Select * from AppNotification with (nolock) " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Models.Notification> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(Models.Notification entity)
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
