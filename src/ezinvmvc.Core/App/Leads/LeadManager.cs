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
using Abp.Authorization;
using ezinvmvc.Authorization;
using Abp.Runtime.Session;

namespace ezinvmvc.App.Leads
{
    public class LeadManager : DomainService, ILeadManager
    {
        private readonly IRepository<Lead> _repository;
        private readonly IDapperRepository<Lead> _repositoryDapper;
        private readonly IPermissionChecker _permissionChecker;
        private readonly IAbpSession _session;

        public LeadManager(IRepository<Lead> repository, IDapperRepository<Lead> repositoryDapper, IPermissionChecker permissionChecker, IAbpSession session)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
            _permissionChecker = permissionChecker;
            _session = session;
        }
        public async Task<IdentityResult> CreateAsync(Lead entity)
        {
            var result = _repository.FirstOrDefault(x => x.Code == entity.Code);
            if (result != null)
            {
                throw new UserFriendlyException("Code Already exist!");
            }
            //MARC 10252021 add && x2.AssignedToId != entity.AssignedToId for additional validation
            var result2 = _repository.FirstOrDefault(x2 => (x2.ClientId == entity.ClientId && x2.Project == entity.Project && x2.AssignedToId != entity.AssignedToId));
            if (result2 != null)
            {
                //MARC 10252021 add for other AE for additional validation
                throw new UserFriendlyException("Client and Project Already Exist!");
            }
            var result3 = _repository.FirstOrDefault(x3 => (x3.ClientId == entity.ClientId && x3.ContactPersonId == entity.ContactPersonId && x3.AssignedToId != entity.AssignedToId));
            if (result3 != null)
            {
                throw new UserFriendlyException("Client and Contact Person already Exist!");
            }
            var result4 = _repository.FirstOrDefault(x3 => (x3.ClientId == entity.ClientId && x3.ContactPersonId == entity.ContactPersonId && x3.Project == entity.Project && x3.AssignedToId != entity.AssignedToId));
            if (result4 != null)
            {
                throw new UserFriendlyException("Client's Contact Person and Project Already Exist!");
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

        public async Task<IEnumerable<Lead>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            #region JOMS User Restriction 10212019
            //string[] tokens = filter.Split('|');

            //string clientprojfilter = "";
            //string sourcefilter = "";
            //string taskfilter = "";
            //string startdatefilter = "";
            //string enddatefilter = "";
            //string clientidfilter = "";
            //string statusfilter = "";

            //if (tokens[0].ToString() != "null")
            //{
            //    clientprojfilter = tokens[0].ToString();
            //}
            //if (tokens[1].ToString() != "null")
            //{
            //    sourcefilter = tokens[1].ToString();
            //}
            //if (tokens[2].ToString() != "null")
            //{
            //    taskfilter = tokens[2].ToString();
            //}
            //if (tokens[3].ToString() != "null" && tokens[4].ToString() != "null")
            //{
            //    startdatefilter = tokens[3].ToString();
            //    enddatefilter = tokens[4].ToString();
            //}
            //if(tokens[5].ToString() != "null")
            //{
            //    clientidfilter = tokens[5].ToString();
            //}
            //if (tokens.Length > 6)
            //{
            //    if (tokens[6].ToString() != "null")
            //    {
            //        statusfilter = tokens[6].ToString();
            //    }
            //}

            //var dp = new DynamicParameters();

            //string wc = " Where v.isdeleted = 0 ";
            //if (clientprojfilter != "")
            //{
            //    wc = wc + " And v.code + ' ' + v.Name + ' ' + v.Project like @Filter ";
            //    dp.Add("@Filter", "%" + clientprojfilter + "%");
            //}
            //if (sourcefilter != "")
            //{
            //    wc = wc + " And v.leadsourceid  in (" + sourcefilter + ") ";
            //}
            //if (taskfilter != "")
            //{
            //    wc = wc + " And v.uleadtaskid  in (" + taskfilter + ") ";
            //}

            //if (startdatefilter != "" && enddatefilter != "")
            //{
            //    wc = wc + " And v.leaddate  between @StartDate and @EndDate ";
            //    dp.Add("@StartDate", Convert.ToDateTime(Convert.ToDateTime(startdatefilter).ToString("MM/dd/yyyy") + " 00:00:00"));
            //    dp.Add("@EndDate", Convert.ToDateTime(Convert.ToDateTime(enddatefilter).ToString("MM/dd/yyyy") + " 23:59:59"));
            //}
            //if (clientidfilter != "")
            //{
            //    wc = wc + " And v.ClientId = @clientid ";
            //    dp.Add("@clientid", Convert.ToInt32(clientidfilter));
            //} 
            //if(statusfilter != "")
            //{
            //    wc = wc + " And v.statusId  in (" + statusfilter + ") ";
            //}

            //string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
            //    var firstWord = sorting.Split(' ').First();
            //    var lastWord = sorting.Split(' ').Last();
            //    var firstlupper = firstWord.First().ToString().ToUpper();
            //    var finalfield = firstlupper + firstWord.Substring(1);
            //    sort = " order by " + finalfield + " " + lastWord;
            //}
            //else
            //{
            //    sort = " order by v.id desc ";
            //}
            //try
            //{
            //    if (!forexport)
            //    {
            //        //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
            //        var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() AS TotalRows, v.*, r.FirstName + ' ' + r.MiddleName + ' ' + r.LastName as UAssignedTo FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, isnull((select top 1 Id from appLeadUpdates Where leadid=l.id Order by creationtime desc), 0) as ULeadUpdateId, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 LeadTaskId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.LeadTaskId) as ULeadTaskId, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, isnull((select top 1 AssignedToEmail from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToEmail) as UAssignedToEmail, st.Status from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id INNER JOIN AppStatusTypes st ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join appemployee as r on v.uassignedtoid=r.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
            //        return getAll;
            //    }
            //    else
            //    {
            //        var getAll = await _repositoryDapper.QueryAsync<Lead>("Select count(*) Over() AS TotalRows, v.*, r.FirstName + ' ' + r.MiddleName + ' ' + r.LastName as UAssignedTo FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, isnull((select top 1 Id from appLeadUpdates Where leadid=l.id Order by creationtime desc), 0) as ULeadUpdateId, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 LeadTaskId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.LeadTaskId) as ULeadTaskId, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, isnull((select top 1 AssignedToEmail from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToEmail) as UAssignedToEmail, st.Status from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id INNER JOIN AppStatusTypes st ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join appemployee as r on v.uassignedtoid=r.id " + wc + sort, dp);
            //        return getAll;
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw new UserFriendlyException("Internal Error, " + ex.ToString());
            //}
            #endregion JOMS User Restriction 10212019

            string[] tokens = filter.Split('|');

            string clientprojfilter = "";
            string sourcefilter = "";
            string taskfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";
            string clientidfilter = "";
            string statusfilter = "";
            string accountexecutive = "";
            string aefilter = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    clientprojfilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    sourcefilter = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    taskfilter = tokens[2].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[3].ToString() != "null" && tokens[4].ToString() != "null")
                {
                    startdatefilter = tokens[3].ToString();
                    enddatefilter = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    clientidfilter = tokens[5].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    statusfilter = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    accountexecutive = tokens[7].ToString();
                }
            }
            if (tokens.Length > 8)
            {
                if (tokens[8].ToString() != "null")
                {
                    aefilter = tokens[8].ToString();
                }
            }

            var dp = new DynamicParameters();

            string wc = " Where v.isdeleted = 0 ", qp = "";
            if (clientprojfilter != "")
            {
                wc = wc + " And v.code + ' ' + v.Name + ' ' + v.Project like @Filter ";
                dp.Add("@Filter", "%" + clientprojfilter + "%");
            }
            if (sourcefilter != "")
            {
                wc = wc + " And v.leadsourceid  in (" + sourcefilter + ") ";
            }
            if (taskfilter != "")
            {
                wc = wc + " And v.uleadtaskid  in (" + taskfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And v.leaddate  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(Convert.ToDateTime(startdatefilter).ToString("MM/dd/yyyy") + " 00:00:00"));
                dp.Add("@EndDate", Convert.ToDateTime(Convert.ToDateTime(enddatefilter).ToString("MM/dd/yyyy") + " 23:59:59"));
            }
            if (clientidfilter != "")
            {
                wc = wc + " And v.ClientId = @clientid ";
                dp.Add("@clientid", Convert.ToInt32(clientidfilter));
            }
            if (statusfilter != "")
            {
                wc = wc + " And v.statusId  in (" + statusfilter + ") ";
            }
            if (accountexecutive != "")
            {
                //if (_session.UserId > 2) {
                //    if (!_permissionChecker.IsGranted("") && !_permissionChecker.IsGranted("")) { }
                //}
                if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
                {
                    if (_permissionChecker.IsGranted("CRM.Leads.AccountExecutive"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                         "UNION ALL " +
                         "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                        if (aefilter != "")
                        {
                            wc = wc + " AND r.id in (" + aefilter + ") ";
                        }
                        else
                        {
                            wc = wc + " AND r.id in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";
                        }
                    }
                }
                else
                {
                    if (aefilter != "")
                    {
                        wc = wc + " AND r.id in (" + aefilter + ") ";
                    }
                }
                //wc = wc + " And r.id = @empid ";
                dp.Add("@empid", Convert.ToInt32(accountexecutive));
                dp.Add("@mempid", Convert.ToInt32(accountexecutive));
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
                sort = " order by v.id desc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<Lead>(qp + " select count(*) Over() AS TotalRows, v.*, r.FirstName + ' ' + r.MiddleName + ' ' + r.LastName as UAssignedTo FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 Id from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), 0) as ULeadUpdateId, isnull((select top 1 NextContactDateTime from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 LeadTaskId from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.LeadTaskId) as ULeadTaskId, isnull((select top 1 lt.Name from appLeadUpdates as lu with (nolock) inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, isnull((select top 1 AssignedToEmail from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.AssignedToEmail) as UAssignedToEmail, st.Status from appleads l with (nolock) inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s with (nolock) on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id inner join AppClients c with (nolock) on l.ClientId = c.Id INNER JOIN AppStatusTypes st with (nolock) ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join appemployee as r with (nolock) on v.uassignedtoid=r.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Lead>(qp + " select count(*) Over() AS TotalRows, v.*, r.FirstName + ' ' + r.MiddleName + ' ' + r.LastName as UAssignedTo FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 Id from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), 0) as ULeadUpdateId, isnull((select top 1 NextContactDateTime from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 LeadTaskId from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.LeadTaskId) as ULeadTaskId, isnull((select top 1 lt.Name from appLeadUpdates as lu with (nolock) inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, isnull((select top 1 AssignedToEmail from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.AssignedToEmail) as UAssignedToEmail, st.Status from appleads l with (nolock) inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s with (nolock) on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id inner join AppClients c with (nolock) on l.ClientId = c.Id INNER JOIN AppStatusTypes st with (nolock) ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join appemployee as r with (nolock) on v.uassignedtoid=r.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Lead>> GetAllListforRFQ(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string clientprojfilter = "";
            string accountexecutive = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    clientprojfilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    accountexecutive = tokens[1].ToString();
                }
            }

            var dp = new DynamicParameters();
            //MARC 02172022 no details returned if rfq is revised
            //string wc = " Where v.isdeleted = 0 and v.StatusId = 2 AND r.Id is null ", qp= "";
            string wc = " Where v.isdeleted = 0 and v.StatusId = 2 ", qp = ""; // AND r.Id is null ", qp = "";

            if (clientprojfilter != null && clientprojfilter.Trim() != "")
            {
                wc = wc + " And ((v.Code like @Filter) OR (v.name like @Filter) OR (v.Project like @Filter) OR (v.contactperson like @Filter)) ";
                dp.Add("@Filter", "%" + clientprojfilter + "%");
            }
            if (accountexecutive != "")
            {
                if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
                {
                    if (_permissionChecker.IsGranted("CRM.Leads.AccountExecutive"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                         "UNION ALL " +
                         "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                        wc = wc + " AND e.id in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

                        //wc = wc + " And r.id = @empid ";
                        dp.Add("@empid", Convert.ToInt32(accountexecutive));
                        dp.Add("@mempid", Convert.ToInt32(accountexecutive));
                        //wc = wc + " And e.Id  = @empid ";
                        //dp.Add("@empid", accountexecutive);
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
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<Lead>(qp + "select count(*) Over() AS TotalRows, v.* FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, st.Status from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id inner join AppClients c on l.ClientId = c.Id INNER JOIN AppStatusTypes st ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join apprfq as r on v.id=r.leadid left outer join appemployee as e on v.uassignedtoid=e.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Lead>(qp + "Select count(*) Over() AS TotalRows, v.* FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, st.Status from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id inner join AppClients c on l.ClientId = c.Id INNER JOIN AppStatusTypes st ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join apprfq as r on v.id=r.leadid left outer join appemployee as e on v.uassignedtoid=e.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Lead>> GetAllListforRFQforEdit(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string rfqidfilter = "";
            string clientprojfilter = "";
            string accountexecutive = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    rfqidfilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    clientprojfilter = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    accountexecutive = tokens[2].ToString();
                }
            }

            var dp = new DynamicParameters();
            //MARC 02172022 multiple rfq 
            //string wc = " Where v.isdeleted = 0 and v.StatusId = 2 AND r.Id is null ";
            string wc = " Where v.isdeleted = 0 and v.StatusId = 2 "; // AND r.Id is null ";
            
            //MARC 02172022 no details returned if rfq is revised
            //string wc2 = " Where v2.isdeleted = 0 and r2.StatusId<>5 ", qp = "";
            string wc2 = " Where v2.isdeleted = 0 ", qp = ""; // and r2.StatusId<>5 ", qp = "";
            if (rfqidfilter != null && rfqidfilter.Trim() != "")
            {
                wc2 = wc2 + " And r2.Id  = @rfqid ";
                dp.Add("@rfqid", rfqidfilter);
            }
            if (clientprojfilter != null && clientprojfilter.Trim() != "")
            {
                wc = wc + " And ((v.Code like @Filter) OR (v.name like @Filter) OR (v.Project like @Filter)) ";
                dp.Add("@Filter", "%" + clientprojfilter + "%");
                wc2 = wc2 + " And ((v2.Code like @Filter2) OR (v2.name like @Filter2) OR (v2.Project like @Filter2)) ";
                dp.Add("@Filter2", "%" + clientprojfilter + "%");
            }
            if (accountexecutive != null && accountexecutive.Trim() != "")
            {
                //wc = wc + " And e.Id  = @empid ";
                //dp.Add("@empid", accountexecutive);
                //wc2 = wc2 + " And e2.Id  = @empid2 ";
                //dp.Add("@empid2", accountexecutive);
                if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
                {
                    qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                         "UNION ALL " +
                         "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                    wc = wc + " AND e.id in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";
                    wc2 = wc2 + " AND e2.id in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid2) AS emp) ";
                }
                //wc = wc + " And r.id = @empid ";
                dp.Add("@empid", Convert.ToInt32(accountexecutive));
                dp.Add("@empid2", Convert.ToInt32(accountexecutive));
                dp.Add("@mempid", Convert.ToInt32(accountexecutive));
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
                sort = " order by id asc ";
            }

            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<Lead>(qp + "select count(*) Over() AS TotalRows, v.* FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, st.Status from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id inner join AppClients c on l.ClientId = c.Id INNER JOIN AppStatusTypes st ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join apprfq as r on v.id=r.leadid left outer join appemployee as e on v.uassignedtoid=e.id " + wc + " UNION " +
                        "select count(*) Over() AS TotalRows, v2.* FROM (select l2.*, t2.name as leadtask, s2.name as leadsource, cmp2.Name as Company, c2.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l2.id Order by creationtime desc), l2.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt2.Name from appLeadUpdates as lu2 inner join appleadtask as lt2 on lu2.leadtaskid=lt2.id Where leadid=l2.id Order by creationtime desc), t2.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l2.id Order by creationtime desc), l2.AssignedToId) as UAssignedToId, st2.Status from appleads l2 inner join appleadtask as t2 on l2.leadtaskid = t2.id inner join appleadsource as s2 on l2.leadsourceid=s2.id inner join appcompany as cmp2 on l2.companyid=cmp2.id inner join AppClients c2 on l2.ClientId = c2.Id INNER JOIN AppStatusTypes st2 ON l2.StatusId=st2.Code AND st2.TransactionCode = 104) as v2 left outer join apprfq as r2 on v2.id=r2.leadid left outer join appemployee as e2 on v2.uassignedtoid=e2.id " + wc2 + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Lead>(qp + "Select count(*) Over() AS TotalRows, v.* FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, st.Status from appleads l inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s on l.leadsourceid=s.id inner join appcompany as cmp on l.companyid=cmp.id inner join AppClients c on l.ClientId = c.Id INNER JOIN AppStatusTypes st ON l.StatusId=st.Code AND st.TransactionCode = 104) as v left outer join apprfq as r on v.id=r.leadid left outer join appemployee as e on v.uassignedtoid=e.id " + wc + " UNION " +
                        "select count(*) Over() AS TotalRows, v2.* FROM (select l2.*, t2.name as leadtask, s2.name as leadsource, cmp2.Name as Company, c2.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l2.id Order by creationtime desc), l2.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt2.Name from appLeadUpdates as lu2 inner join appleadtask as lt2 on lu2.leadtaskid=lt2.id Where leadid=l2.id Order by creationtime desc), t2.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=l2.id Order by creationtime desc), l2.AssignedToId) as UAssignedToId, st2.Status from appleads l2 inner join appleadtask as t2 on l2.leadtaskid = t2.id inner join appleadsource as s2 on l2.leadsourceid=s2.id inner join appcompany as cmp2 on l2.companyid=cmp2.id inner join AppClients c2 on l2.ClientId = c2.Id INNER JOIN AppStatusTypes st2 ON l2.StatusId=st2.Code AND st2.TransactionCode = 104) as v2 left outer join apprfq as r2 on v2.id=r2.leadid left outer join appemployee as e2 on v2.uassignedtoid=e2.id " + wc2 + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Lead> GetByIdAsync(int id)
        {
            //var result = _repository.FirstOrDefault(x => x.Id == id);
            //if (result != null)
            //{
            //    return await _repository.GetAsync(id);
            //}
            //else
            //{
            //    throw new UserFriendlyException("No Data Found!");
            //}
            string wc = " Where l.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Lead>(" select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt.Name from appLeadUpdates as lu with (nolock) inner join appleadtask as lt on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 AssignedToId from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), l.AssignedToId) as UAssignedToId, st.Status, emp.FirstName + ' ' + emp.MiddleName + ' ' + emp.LastName AS AssignedTo from appleads l with (nolock) inner join appleadtask as t on l.leadtaskid = t.id inner join appleadsource as s with (nolock) on l.leadsourceid=s.id inner join appcompany as cmp with (nolock) on l.companyid=cmp.id inner join AppClients c with (nolock) on l.ClientId = c.Id INNER JOIN AppStatusTypes st with (nolock) ON l.StatusId=st.Code AND st.TransactionCode = 104 LEFT OUTER JOIN AppEmployee emp with (nolock) ON l.AssignedToId = emp.Id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Lead>> GetLeadDetailsByIdAsync(int id)
        {
            //MARC 02172022 no details returned if rfq is revised
            //string wc = " Where v.isdeleted = 0 and isnull(r.StatusId,0) <> 5 and isnull(q.StatusId,0) <> 5";
            string wc = " Where v.isdeleted = 0 "; //and isnull(r.StatusId,0) <> 5 and isnull(q.StatusId,0) <> 5";
            var dp = new DynamicParameters();
            if (id != 0 && id > 0)
            {
                wc = wc + " And v.Id = @id ";
                dp.Add("@id", id);
            }
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Lead>(" Select count(*) Over() AS TotalRows, v.*, isnull(r.id, 0) as RFQId, isnull(q.id, 0) as QuotationId, isnull(so.id, 0) as SalesOrderId FROM (select l.*, t.name as leadtask, s.name as leadsource, cmp.Name as Company, c.Name ClientName, isnull((select top 1 NextContactDateTime from appLeadUpdates Where leadid=l.id Order by creationtime desc), l.NextContactDateTime) as UNextContactDateTime, isnull((select top 1 lt.Name from appLeadUpdates as lu inner join appleadtask as lt with (nolock) on lu.leadtaskid=lt.id Where leadid=l.id Order by creationtime desc), t.Name) as ULeadTask, isnull((select top 1 Id from appLeadUpdates with (nolock) Where leadid=l.id Order by creationtime desc), 0) as ULeadUpdateId from appleads l inner join appleadtask as t with (nolock) on l.leadtaskid = t.id inner join appleadsource as s with (nolock) on l.leadsourceid=s.id inner join appcompany as cmp with (nolock) on l.companyid=cmp.id inner join AppClients c with (nolock) on l.ClientId = c.Id) as v left outer join apprfq as r with (nolock) on v.id=r.leadid left outer join appquotations q with (nolock) on r.id=q.requestid left outer join appsalesorders so with (nolock) on q.id=so.quotationid " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Lead entity)
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
