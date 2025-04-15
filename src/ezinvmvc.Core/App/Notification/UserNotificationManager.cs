using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Notification.Models;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Notification
{
    public class UserNotificationManager : DomainService, IUserNotificationManager
    {
        private readonly IRepository<UserNotification> _repository;
        private readonly IDapperRepository<UserNotification> _repositoryDapper;
        private readonly IDapperRepository<Employee> _repositoryUsersDapper;

        public UserNotificationManager(IRepository<UserNotification> repository, IDapperRepository<UserNotification> repositoryDapper, IDapperRepository<Employee> repositoryUsersDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
            _repositoryUsersDapper = repositoryUsersDapper;
        }

        public async Task<IdentityResult> CreateAsync(UserNotification entity)
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

        public async Task<IEnumerable<UserNotification>> GetAll()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<IEnumerable<UserNotification>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string wc = "";// " Where isdeleted = 0 ";
            string[] flist = filter.Split('|');

            var dp = new DynamicParameters();
            if(flist[0] != "null" && flist[0].Trim() != "")
            {
                if (flist[0] != "0")
                {
                    wc += " Where id = @id ";
                    dp.Add("@id", filter);
                }
                if (flist.Length > 1)
                {
                    wc += (wc.Length > 0 ? " And " : " Where ") + " UserId = @userid ";
                    dp.Add("@userid", flist[1]);
                    if(flist.Length > 2)
                    {
                        wc += (wc.Length > 0 ? " And " : " Where ") + " State = @state ";
                        dp.Add("@state", flist[2]);
                    }
                }
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                sort = " order by Id desc ";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<UserNotification>(" Select count(*) Over() TotalRows, a.*, b.Message, b.TransactionId, b.TransactionCode, b.Action, c.UserName from AppUserNotification a with (nolock) inner join AppNotification b with (nolock) on a.NotificationId=b.Id inner join AbpUsers c with (nolock) on b.CreatorUserId=c.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<UserNotification>(" Select count(*) Over() TotalRows, a.*, b.Message, b.TransactionId, b.TransactionCode, b.Action, c.UserName from AppUserNotification a with (nolock) inner join AppNotification b with (nolock) on a.NotificationId=b.Id inner join AbpUsers c with (nolock) on b.CreatorUserId=c.Id  " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<UserNotification> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(UserNotification entity)
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

        public async Task<IEnumerable<Employee>> GetUsersByPermissionList(string filter, string sorting)
        {
            string newfilter = "", wc = " WHERE a.isdeleted = 0  AND d.IsGranted = 1 ", hc = "";// " Where isdeleted = 0 ";
            string[] flist = filter.Split('|');

            var dp = new DynamicParameters();
            if (flist.Length > 1)
            {
                hc = " having count(id) > " + (flist.Length - 1) + " ";
                for (int i = 0; i < flist.Length; i++)
                {
                    if (flist.Length == i + 1)
                    {
                        newfilter += "'" + flist[i] + "'";
                    }
                    else
                    {
                        newfilter += "'" + flist[i] + "',";
                    }
                }
                wc += " AND d.Name in (" + newfilter + ") ";
            }
            else
            {
                wc += " AND d.Name = @Filter ";
                dp.Add("@Filter", filter);
            }
            //string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
            //    sort = " order by Id asc ";
            //}
            try
            {
                //IEnumerable<Employee> getAll = await _repositoryDapper.QueryAsync<Employee>("select a.*, b.username from appemployee a inner join (select distinct id, username from (select a.id, a.Name username, c.Name rolename, d.Name, " + 
                //    " d.roleid from abpusers a inner join AbpUserRoles b on a.id=b.UserId inner join abproles c on b.RoleId = c.id inner join AbpPermissions d on c.id = d.RoleId " +
                //    //where a.isdeleted = 0 and d.Name in ('CRM.Leads.Approve', 'CRM.Leads.AllAccounts') and d.IsGranted = 1) 
                //    wc + " ) as a group by id, username, roleid " + hc + " ) b on a.userid=b.id ", dp);
                //return getAll;
                IEnumerable<Employee> getAll = await _repositoryDapper.QueryAsync<Employee>("select a.*, b.username from appemployee a with (nolock) inner join (select distinct id, username from (select a.id, a.Name username, c.Name rolename, d.Name, " +
                " d.roleid from abpusers a with (nolock) inner join AbpUserRoles b with (nolock) on a.id=b.UserId inner join abproles c with (nolock) on b.RoleId = c.id inner join AbpPermissions d with (nolock) on c.id = d.RoleId " +
                wc + " ) as a group by id, username, roleid " + hc + " ) b on a.userid=b.id ", dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<UserNotification>> MarkAllRead(int id)
        {
            string wc = " WHERE Userid = @uid ";
            var dp = new DynamicParameters();
            dp.Add("@uid", id);
            try
            {
                    var getAll = await _repositoryDapper.QueryAsync<UserNotification>("Update AppUserNotification set State = 1 " + wc, dp);
                    return getAll;
                
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
