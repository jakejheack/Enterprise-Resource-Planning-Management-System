using Abp.Authorization;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.ContactPersons
{
    public class ContactPersonManager : DomainService, IContactPersonManager
    {
        private readonly IRepository<ContactPerson> _repository;
        private readonly IDapperRepository<ContactPerson> _repositoryDapper;
        private readonly IPermissionChecker _permissionChecker;

        public ContactPersonManager(IRepository<ContactPerson> repository, IDapperRepository<ContactPerson> repositoryDapper, IPermissionChecker permissionChecker)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
            _permissionChecker = permissionChecker;
        }

        public async Task<IdentityResult> CreateAsync(ContactPerson entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            //MARC 10/24/2021 dupllicate fix
            var result2 = _repository.FirstOrDefault(x => x.FirstName == entity.FirstName && x.LastName == entity.LastName && x.Reference == entity.Reference && x.ReferenceId==entity.ReferenceId);
            if (result2 != null)
            {
                throw new UserFriendlyException("The Name " + entity.FirstName + " " + entity.LastName + " Already exist for this client!");
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

        public async Task<IEnumerable<ContactPerson>> GetAllList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<ContactPerson> GetByIdAsync(int id)
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

        public async Task<IEnumerable<ContactPerson>> GetAllListFiltered(int Id, string Reference, int ReferenceId, string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string wc = " Where v.isdeleted = 0 ", qp = "";
            string join = "";
            var dp = new DynamicParameters();
            if (Id > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.Id = @id) ";
                }
                else
                {
                    wc = wc + " And (v.Id = @id) ";
                }
                dp.Add("@id", Id);
            }
            if (Reference != null || string.IsNullOrEmpty(Reference.Trim()))
            {
                if (Reference.ToUpper() == "Client".ToUpper())
                {
                    join = join + " inner join appclients as r on v.referenceid=r.id ";
                }
            }
            if (ReferenceId > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (r.Id = @refid) ";
                }
                else
                {
                    wc = wc + " And (r.Id = @refid) ";
                }
                dp.Add("@refid", ReferenceId);
            }

            string[] tokens = filter.Split('|');
            string likefilter = "", accountexecutive = "";
            if(tokens.Length > 0) {
                likefilter = tokens[0];
            }
            if(tokens.Length > 1)
            {
                accountexecutive = tokens[1];
            }
            if (likefilter != null && likefilter.Trim() != "")
            {
                wc = wc + " And ((v.Title + ' ' + v.FirstName + ' ' + v.LastName) like @Filter) ";
                dp.Add("@Filter", "%" + likefilter + "%");
            }

            if (accountexecutive != "")
            {
                //wc = wc + " And v.AssignedToId = @empid ";
                //dp.Add("@empid", Convert.ToInt32(accountexecutive));
                if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
                {
                    if (_permissionChecker.IsGranted("CRM.Leads.AccountExecutive"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                         "UNION ALL " +
                         "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                        wc = wc + " AND v.CreatorUserId in (Select UserId FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

                        //wc = wc + " And r.id = @empid ";
                        dp.Add("@empid", Convert.ToInt32(accountexecutive));
                        dp.Add("@mempid", Convert.ToInt32(accountexecutive));
                    }
                }
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
                sort = " order by v.id asc ";
            }
            try
            {
                //var getAll = await _repositoryDapper.QueryAsync<ContactPerson>("select count(*) Over() TotalRows, v.*, v.Title + ' ' + v.FirstName + ' ' + v.LastName AS FullName, r.Code as ReferenceCode, r.Name as ReferenceName FROM appcontactpersons as v " + join + " " + wc + sort, dp);
                var getAll = await _repositoryDapper.QueryAsync<ContactPerson>(qp + "select count(*) Over() TotalRows, v.*, v.Title + ' ' + v.FirstName + ' ' + v.LastName AS FullName, r.Code as ReferenceCode, r.Name as ReferenceName FROM appcontactpersons as v " + join + " " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(ContactPerson entity)
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
