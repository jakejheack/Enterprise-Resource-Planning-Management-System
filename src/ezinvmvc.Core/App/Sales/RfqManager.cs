using Abp.Authorization;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public class RFQManager : DomainService, IRFQManager
    {
        private readonly IRepository<RFQ> _repositoryRfq;
        private readonly IDapperRepository<RFQ> _repositoryRfqDapper;
        private readonly IPermissionChecker _permissionChecker;

        public RFQManager(IRepository<RFQ> repositoryRfq, IDapperRepository<RFQ> repositoryRfqDapper, IPermissionChecker permissionChecker)
        {
            _repositoryRfq = repositoryRfq;
            _repositoryRfqDapper = repositoryRfqDapper;
            _permissionChecker = permissionChecker;
        }

        public async Task<IdentityResult> CreateAsync(RFQ entity)
        {
            var result = _repositoryRfq.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                //from InsertAsync MARC 08092019
                //entity.RevisionNo = 1;
                await _repositoryRfq.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryRfq.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryRfq.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");

            }
        }

        public async Task<IEnumerable<RFQ>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            #region JOMS User Restriction 10212019
            //string[] tokens = filter.Split('|');

            //string tfilter = "", code = "", datefrom = "", dateto = "", statustypes = "", clientid = "";
            //if (tokens.Length > 0)
            //{
            //    tfilter = tokens[0];
            //}
            //else
            //{
            //    tfilter = filter;
            //}
            //if(tokens.Length > 1)
            //{
            //    code = tokens[1];
            //}
            //if(tokens.Length > 3)
            //{
            //    datefrom = tokens[2];
            //    dateto = tokens[3];
            //}
            //if (tokens.Length > 4)
            //{
            //    statustypes = tokens[4];
            //}
            //if(tokens.Length > 5)
            //{
            //    clientid = tokens[5];
            //}

            //string wc = " Where isdeleted = 0 and statusid <> 5";
            //var dp = new DynamicParameters();

            //if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            //{
            //    wc = wc + " And ((a.Code like @Filter) OR (a.Client like @Filter) OR (a.ProjectName like @Filter)) ";
            //    dp.Add("@Filter", "%" + tfilter + "%");
            //}
            //if(code!=null && code.Trim() != "" && code.Trim() != "null")
            //{
            //    wc = wc + " And a.Code = @code ";
            //    dp.Add("@code", code);
            //}
            //if(datefrom != null && datefrom.Trim() != "" && dateto !=null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            //{
            //    wc = wc + " And a.TransactionTime between @datefrom and @dateto ";
            //    dp.Add("@datefrom", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
            //    dp.Add("@dateto", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            //}
            //if (statustypes != null && statustypes.Trim() != "" && statustypes.Trim() != "null")
            //{
            //    statustypes = "'" + statustypes.Replace(",", "','") + "'";
            //    wc = wc + " And a.statusid  in (" + statustypes + ") ";
            //}
            //if (clientid !=null && clientid.Trim() != "" && clientid.Trim() != "null")
            //{
            //    wc = wc + " And a.ClientId = @clientid ";
            //    dp.Add("@clientid", clientid);
            //}

            //string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
            //    var firstWord = sorting.Split(' ').First();
            //    var lastWord = sorting.Split(' ').Last();
            //    var firstlupper = firstWord.First().ToString().ToUpper();
            //    var finalfield = firstlupper + firstWord.Substring(1);
            //    sort = " order by " + finalfield + " " + lastWord;
            //    //sort = " order by a.Projectname asc ";
            //}
            //else
            //{
            //    sort = " order by a.Id asc ";
            //}
            //try
            //{
            //    if (!forexport)
            //    {
            //        //var getAll = await _repositoryDapper.QueryAsync<Vendor>("select count(*) Over() TotalRows,v.* from appvendors v " + wc + sort + " Limit " + offset + "," + fetch, dp);
            //        //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* from AppRFQ a " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
            //        //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, b.Name ClientName, ss.status, a.statusid from AppRFQ a inner join AppCompany b on a.clientid = b.Id inner join appstatustypes ss on ss.code = a.Statusid" + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
            //        var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
            //        return getAll;
            //    }
            //    else
            //    {
            //        //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* from AppRFQ a " + wc + sort, dp);
            //        //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, b.Name ClientName, ss.status, a.statusid from AppRFQ a inner join AppCompany b on a.clientid = b.Id inner join appstatustypes ss on ss.code = a.Statusid" + wc + sort, dp);
            //        var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort, dp);
            //        return getAll;
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw new UserFriendlyException("Internal Error, " + ex.ToString());
            //}
            #endregion  JOMS User Restriction 10212019

            string[] tokens = filter.Split('|');

            string tfilter = "", code = "", datefrom = "", dateto = "", statustypes = "", clientid = "", accountexecutive = "", aefilter = "", leadidfilter = "";
            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    tfilter = tokens[0];
                }
            }
            else
            {
                tfilter = filter;
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    code = tokens[1];
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[2].ToString() != "null" && tokens[3].ToString() != "null")
                {
                    datefrom = tokens[2];
                    dateto = tokens[3];
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    statustypes = tokens[4];
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    clientid = tokens[5];
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    accountexecutive = tokens[6];
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    aefilter = tokens[7];
                }
            }
            if (tokens.Length > 8)
            {
                if (tokens[8].ToString() != "null")
                {
                    leadidfilter = tokens[8];
                }
            }

            string wc = " Where a.isdeleted = 0 and a.statusid <> 5", qp = "";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And ((a.Code like @Filter) OR (a.Client like @Filter) OR (a.ProjectName like @Filter)) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }
            if (code != null && code.Trim() != "" && code.Trim() != "null")
            {
                wc = wc + " And a.Code = @code ";
                dp.Add("@code", code);
            }
            if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            {
                wc = wc + " And a.TransactionTime between @datefrom and @dateto ";
                dp.Add("@datefrom", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@dateto", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (statustypes != null && statustypes.Trim() != "" && statustypes.Trim() != "null")
            {
                statustypes = "'" + statustypes.Replace(",", "','") + "'";
                wc = wc + " And a.statusid  in (" + statustypes + ") ";
            }
            if (clientid != null && clientid.Trim() != "" && clientid.Trim() != "null")
            {
                wc = wc + " And a.ClientId = @clientid ";
                dp.Add("@clientid", clientid);
            }
            if (accountexecutive != null && accountexecutive.Trim() != "" && accountexecutive.Trim() != "null")
            {
                //wc = wc + " And r.id = @empid ";
                //dp.Add("@empid", Convert.ToInt32(accountexecutive));
                bool aefiltermode = true;

                if (!_permissionChecker.IsGranted("Pages.Rfq.AllAssigned"))
                {
                    if (_permissionChecker.IsGranted("Pages.Rfq.SalesCoordinator"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                            "UNION ALL " +
                            "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";

                        wc = wc + " AND t.Employeeid in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

                        //wc = wc + " And r.id = @empid ";
                        dp.Add("@empid", Convert.ToInt32(accountexecutive));
                        dp.Add("@mempid", Convert.ToInt32(accountexecutive));
                        aefiltermode = false;
                    }
                }

                if (!_permissionChecker.IsGranted("Pages.Rfq.AllAccounts"))
                {
                    if (_permissionChecker.IsGranted("Pages.Rfq.AccountExecutive"))
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

                        //wc = wc + " And r.id = @empid ";
                        dp.Add("@empid", Convert.ToInt32(accountexecutive));
                        dp.Add("@mempid", Convert.ToInt32(accountexecutive));
                        aefiltermode = false;
                    }
                }
                
                if(aefiltermode)
                {
                    if (aefilter != "")
                    {
                        wc = wc + " AND r.id in (" + aefilter + ") ";
                    }
                }
            }
            if(leadidfilter.Trim() != "" && leadidfilter.Trim() != "null")
            {
                wc = wc + " And a.LeadId = @LeadId ";
                dp.Add("@LeadId", leadidfilter);
            }

            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord;
                //sort = " order by a.Projectname asc ";
            }
            else
            {
                sort = " order by a.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Vendor>("select count(*) Over() TotalRows,v.* from appvendors v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* from AppRFQ a " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, b.Name ClientName, ss.status, a.statusid from AppRFQ a inner join AppCompany b on a.clientid = b.Id inner join appstatustypes ss on ss.code = a.Statusid" + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.id Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.leadid Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, apt.Name as AssignedPerson FROM (select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.id Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id left outer join apptasks as apt on  a.Id = apt.TransactionCode " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //MARC 08022022 show ae on list
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + "select count(*) over() Totalrows, a.*, t.id as Assignedid, t.Status as Astatus FROM (select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.leadid Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id left outer join AppTasks as t on t.transactioncode = a.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + "select count(*) over() Totalrows, a.*, t.id as Assignedid, t.Status as Astatus, r.FirstName + ' ' + r.MiddleName + ' ' + r.LastName as AccountExecutive FROM (select v.*, b.Name Company, c.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.leadid Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id left outer join AppTasks as t on t.transactioncode = a.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* from AppRFQ a " + wc + sort, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, b.Name ClientName, ss.status, a.statusid from AppRFQ a inner join AppCompany b on a.clientid = b.Id inner join appstatustypes ss on ss.code = a.Statusid" + wc + sort, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM(select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid = v.leadid Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid = c.id left outer join appleads as l on v.leadid = l.id ) as a left outer join appemployee as r on a.uassignedtoid = r.id " + wc + sort, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, apt.Name as AssignedPerson FROM (select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.id Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id  left outer join apptasks as apt on a.Id = apt.TransactionCode " + wc + sort, dp);
                    //MARC 08022022 show ae on list
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + "select count(*) over() Totalrows, a.*, t.id as Assignedid, t.Status as Astatus FROM (select v.*, b.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.leadid Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id left outer join AppTasks as t on t.transactioncode = a.id " + wc + sort, dp);
                    var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + "select count(*) over() Totalrows, a.*, t.id as Assignedid, t.Status as Astatus, r.FirstName + ' ' + r.MiddleName + ' ' + r.LastName as AccountExecutive FROM (select v.*, b.Name Company, c.Name ClientName, ss.status, case when v.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=v.leadid Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106 inner join appclients as c on v.clientid=c.id left outer join appleads as l on v.leadid=l.id ) as a left outer join appemployee as r on a.uassignedtoid=r.id left outer join AppTasks as t on t.transactioncode = a.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<RFQ>> GetAllRevisionList(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string code = "";
            if (tokens.Length > 0)
            {
                code = tokens[0];
            }

            string wc = " Where isdeleted = 0 "; // and statusid <> 5";
            var dp = new DynamicParameters();
            
            if (code != null && code.Trim() != "" && code.Trim() != "null")
            {
                wc = wc + " And a.Code = @code ";
                dp.Add("@code", code);
            }

            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord;
                //sort = " order by a.Projectname asc ";
            }
            else
            {
                sort = " order by a.Id asc ";
            }
            try
            {
                //if (!forexport)
                //{
                //    //var getAll = await _repositoryDapper.QueryAsync<Vendor>("select count(*) Over() TotalRows,v.* from appvendors v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                //    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* from AppRFQ a " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                //    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, b.Name ClientName, ss.status, a.statusid from AppRFQ a inner join AppCompany b on a.clientid = b.Id inner join appstatustypes ss on ss.code = a.Statusid" + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                //    var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                //    return getAll;
                //}
                //else
                //{
                //    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* from AppRFQ a " + wc + sort, dp);
                //    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.*, b.Name ClientName, ss.status, a.statusid from AppRFQ a inner join AppCompany b on a.clientid = b.Id inner join appstatustypes ss on ss.code = a.Statusid" + wc + sort, dp);
                    var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) over() Totalrows, a.* FROM (select v.*, b.Name Company, c.Name ClientName, ss.status from AppRFQ v inner join AppCompany b on v.CompanyId = b.Id inner join AppClients c on v.ClientId = c.Id inner join appstatustypes ss on ss.code = v.Statusid and ss.TransactionCode = 106) as a " + wc + sort, dp);
                    return getAll;
                //}
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<RFQ>> GetAllListforQuotation(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string tfilter = "", accountexecutive = "";
            if (tokens.Length > 0)
            {
                tfilter = tokens[0];
                if(tokens.Length > 1)
                {
                    accountexecutive = tokens[1];
                }
            }
            else
            {
                tfilter = filter;
            }

            string wc = " Where v.isdeleted = 0 and v.statusid = 2 ", qp = "";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "")
            {
                wc = wc + " And ((v.Code like @Filter) OR (v.Client like @Filter) OR (v.ProjectName like @Filter) OR (c.EmployeeId like @Filter)) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }

            if (accountexecutive != null && accountexecutive.Trim() != "" && accountexecutive.Trim() != "null")
            {
                if (!_permissionChecker.IsGranted("Pages.Rfq.AllAssigned"))
                {
                    if (_permissionChecker.IsGranted("Pages.Rfq.SalesCoordinator"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                            "UNION ALL " +
                            "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";

                        wc = wc + " AND c.Employeeid in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

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
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Lead>("select count(*) Over() TotalRows,v.* from appleads v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) Over() AS TotalRows, v.* FROM (select a.*, b.Name Company from AppRFQ a inner join AppCompany b on a.companyid = b.Id) as v left outer join appquotations as q on v.id=q.requestid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("select count(*) Over() AS TotalRows, v.* FROM(select a.*, b.Name Company from AppRFQ a inner join AppCompany b on a.companyid = b.Id) as v left outer join AppTasks as c on c.TransactionCode = v.Id left outer join appquotations as q on v.id = q.requestid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + "select count(*) Over() AS TotalRows, v.* FROM(select a.*, b.Name Company, c.Name ClientName from AppRFQ a inner join AppCompany b on a.companyid = b.Id inner join AppClients c on a.ClientId = c.Id) as v inner join (select apt.*, ape.ExecId from AppTasks as apt inner join appemployee as apE on apt.EmployeeId = apE.Id) as c on c.TransactionCode = v.Id left outer join appquotations as q on v.id = q.requestid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + " select count(*) Over() AS TotalRows, v.* FROM(select a.*, b.Name Company, c.Name ClientName from AppRFQ a with (nolock) inner join AppCompany b with (nolock) on a.companyid = b.Id inner join AppClients c with (nolock) on a.ClientId = c.Id) as v inner join (select apt.*, ape.ExecId from AppTasks as apt inner join appemployee as apE with (nolock) on apt.EmployeeId = apE.Id) as c on c.TransactionCode = v.Id left outer join appquotations as q with (nolock) on v.id = q.requestid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);

                    return getAll;
                }
                else
                {
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>("Select count(*) Over() AS TotalRows, v.* FROM (select a.*, b.Name Company from AppRFQ a inner join AppCompany b on a.companyid = b.Id) as v left outer join appquotations as q on v.id=q.requestid " + wc + sort, dp);
                    //var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + "select count(*) Over() AS TotalRows, v.* FROM(select a.*, b.Name Company, c.Name ClientName from AppRFQ a inner join AppCompany b on a.companyid = b.Id inner join AppClients c on a.ClientId = c.Id) as v inner join (select apt.*, ape.ExecId from AppTasks as apt inner join appemployee as apE on apt.EmployeeId = apE.Id) as c on c.TransactionCode = v.Id left outer join appquotations as q on v.id = q.requestid " + wc + sort, dp);
                    var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(qp + " select count(*) Over() AS TotalRows, v.* FROM(select a.*, b.Name Company, c.Name ClientName from AppRFQ a with (nolock) inner join AppCompany b with (nolock) on a.companyid = b.Id inner join AppClients c with (nolock) on a.ClientId = c.Id) as v inner join (select apt.*, ape.ExecId from AppTasks as apt inner join appemployee as apE with (nolock) on apt.EmployeeId = apE.Id) as c on c.TransactionCode = v.Id left outer join appquotations as q with (nolock) on v.id = q.requestid " + wc + sort, dp);

                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<RFQ> GetByIdAsync(int id)
        {
            //var result = _repositoryRfq.FirstOrDefault(x => x.Id == id);
            //if (result != null)
            //{
            //    return await _repositoryRfq.GetAsync(id);
            //}
            //else
            //{
            //    throw new UserFriendlyException("No Data Found!");
            //}

            string wc = " Where a.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryRfqDapper.QueryAsync<RFQ>(" select count(*) over() Totalrows, a.*, b.Name Company, c.Name ClientName, ss.status , a.statusid from AppRFQ a with (nolock) inner join AppCompany b with (nolock) on a.CompanyId = b.Id inner join AppClients c  with (nolock) on a.ClientId = c.Id inner join appstatustypes ss  with (nolock) on ss.code = a.Statusid and ss.TransactionCode = 106 " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(RFQ entity)
        {
            try
            {

                await _repositoryRfq.UpdateAsync(entity);
                return IdentityResult.Success;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
