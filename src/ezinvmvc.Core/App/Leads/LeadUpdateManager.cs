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

namespace ezinvmvc.App.Leads
{
    public class LeadUpdateManager : DomainService, ILeadUpdateManager
    {
        private readonly IRepository<LeadUpdate> _repository;
        private readonly IDapperRepository<LeadUpdate> _repositoryDapper;

        public LeadUpdateManager(IRepository<LeadUpdate> repository, IDapperRepository<LeadUpdate> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(LeadUpdate entity)
        {
            //var result = _repository.FirstOrDefault(x => x.Name == entity.Name);
            //if (result != null)
            //{
            //    throw new UserFriendlyException("Already exist!");
            //}
            //else
            //{
                await _repository.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            //}
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

        public async Task<IEnumerable<LeadUpdate>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {


            string wc = " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (v.name like @Filter) ";
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
            var dp = new DynamicParameters();
            dp.Add("@Filter", "%" + filter + "%");
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<LeadUpdate>(" select count(*) Over() AS TotalRows, v.* FROM (select l.*, t.name as leadtask, s.name as leadsource from appleads l with (nolock) inner join appleadtask as t with (nolock) on l.leadtaskid = t.id inner join appleadsource as s with (nolock) on l.leadsourceid=s.id) as v " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<LeadUpdate>(" select count(*) Over() AS TotalRows, v.* FROM (select l.*, t.name as leadtask, s.name as leadsource from appleads l with (nolock) inner join appleadtask as t with (nolock) on l.leadtaskid = t.id inner join appleadsource as s with (nolock) on l.leadsourceid=s.id) as v " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<LeadUpdate>> GetAllListByLeadId(int leadid, string sorting, int offset, int fetch, bool forexport)
        {


            string wc = " Where isdeleted = 0 ";
            if (leadid != 0)
            {
                wc = wc + " And (v.leadid = @Filter) ";
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord + ", id desc";
            }
            else
            {
                sort = " order by leadupdatedate desc, id desc ";
            }
            var dp = new DynamicParameters();
            dp.Add("@Filter", leadid);
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<LeadUpdate>("select count(*) Over() AS TotalRows, v.* FROM (SELECT 0 as id, l.IsDeleted, l.LeadDate as leadupdatedate, l.id as leadid, l.LeadTaskId, l.notes, l.AssignedToId, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName as AssignedTo, " +
                                                                                "l.AssignedToEmail, l.NextContactDateTime, l.code as leadcode, l.name as leadname, l.project as leadproject, t.name as leadtask, s.name as leadsource from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner " +
                                                                                "join appleadsource as s on l.leadsourceid = s.id inner join AppEmployee as e on l.AssignedToId = e.id " +
                                                                                "UNION " +
                                                                                "select lu.id, lu.IsDeleted, lu.leadupdatedate, lu.leadid, lu.LeadTaskId, lu.notes, lu.AssignedToId, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName as AssignedTo, lu.AssignedToEmail, lu.NextContactDateTime, l.Code as leadCode, " + 
                                                                                "l.Name as LeadName, l.Project AS LeadProject, t.name as leadtask, s.name as leadsource from appleadupdates as lu inner join appleads l on lu.leadid = l.id inner join appleadtask as t on lu.leadtaskid = t.id inner join appleadsource as s " +
                                                                                "on l.leadsourceid = s.id inner join AppEmployee as e on lu.AssignedToId = e.id) as v " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<LeadUpdate>("select count(*) Over() AS TotalRows, v.* FROM (SELECT l.IsDeleted, l.LeadDate as leadupdatedate, l.id as leadid, l.LeadTaskId, l.notes, l.AssignedToId, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName as AssignedTo, " +
                                                                                "l.AssignedToEmail, l.NextContactDateTime, l.code as leadcode, l.name as leadname, l.project as leadproject, t.name as leadtask, s.name as leadsource from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner " +
                                                                                "join appleadsource as s on l.leadsourceid = s.id inner join AppEmployee as e on l.AssignedToId = e.id " +
                                                                                "UNION " +
                                                                                "select lu.IsDeleted, lu.leadupdatedate, lu.leadid, lu.LeadTaskId, lu.notes, lu.AssignedToId, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName as AssignedTo, lu.AssignedToEmail, lu.NextContactDateTime, l.Code as leadCode, " +
                                                                                "l.Name as LeadName, l.Project AS LeadProject, t.name as leadtask, s.name as leadsource from appleadupdates as lu inner join appleads l on lu.leadid = l.id inner join appleadtask as t on lu.leadtaskid = t.id inner join appleadsource as s " +
                                                                                "on l.leadsourceid = s.id inner join AppEmployee as e on lu.AssignedToId = e.id) as v " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<LeadUpdate> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(LeadUpdate entity)
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
