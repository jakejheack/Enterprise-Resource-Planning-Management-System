using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using ezinvmvc.Authorization.Users;

namespace ezinvmvc.App.Users
{
    public class UserManager : DomainService, IUsersManager
    {
        private readonly IRepository<Users> _repositoryUsers;
        private readonly IDapperRepository<Users> _repositoryUsersDapper;

        public UserManager(IRepository<Users> repositoryUsers, IDapperRepository<Users> repositoryDapper)
        {
            _repositoryUsers = repositoryUsers;
            _repositoryUsersDapper = repositoryDapper;
        }

        public async Task<Users> GetByIdAsync(int id)
        {
            var result = _repositoryUsers.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryUsers.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Users>> GetAllList(string filter, string sorting, int offset, int fetch)
        {
            string wc = " Where a.isdeleted = '0' and b.Id is null ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (a.UserName like @Filter) ";
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord;
            }
            else
            {
                sort = " order by a.UserName asc ";
            }
            var dp = new DynamicParameters();
            dp.Add("@Filter", "%" + filter + "%");
            try
            {
                IEnumerable<Users> getAll = await _repositoryUsersDapper.QueryAsync<Users>("Select a.* from Abpusers as a left outer join AppEmployee as b on a.Id=b.UserId " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
    
}
