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

namespace ezinvmvc.App.Sales
{
    public class QuotationManager : DomainService, IQuotationManager
    {
        private readonly IRepository<Quotation> _repository;
        private readonly IDapperRepository<Quotation> _repositoryDapper;
        private readonly IPermissionChecker _permissionChecker;

        public QuotationManager(IRepository<Quotation> repository, IDapperRepository<Quotation> repositoryDapper, IPermissionChecker permissionChecker)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
            _permissionChecker = permissionChecker;
        }

        public async Task<IdentityResult> CreateAsync(Quotation entity)
        {
            //var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
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

        public async Task<IEnumerable<Quotation>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string idfilter = "";
            string clientfilter = "";
            string statusfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";
            string clientidfilter = "";
            string accountexecutive = "";
            string aefilter = "";
            string leadidfilter = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    idfilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    clientfilter = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    statusfilter = tokens[2].ToString();
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
                    accountexecutive = tokens[6].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    accountexecutive = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    aefilter = tokens[7].ToString();
                }
            }
            if (tokens.Length > 8)
            {
                if (tokens[8].ToString() != "null")
                {
                    leadidfilter = tokens[8].ToString();
                }
            }

            string wc = " Where q.isdeleted = 0 ", qp = "";
            var dp = new DynamicParameters();

            if (idfilter != "")
            {
                wc = wc + " And q.code like @Id ";
                dp.Add("@Id", "%" + idfilter + "%");
            }
            if (clientfilter != "")
            {
                wc = wc + " And c.name like @Client ";
                dp.Add("@Client", "%" + clientfilter + "%");
            }
            if (statusfilter != "")
            {
                statusfilter = "'" + statusfilter.Replace(",", "','") + "'";
                wc = wc + " And q.statusid  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And q.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdatefilter).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddatefilter).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (clientidfilter != "")
            {
                wc = wc + " And q.ClientId = @ClientId ";
                dp.Add("@ClientId", clientidfilter);
            }
            if (accountexecutive.Trim() != "")
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
                //wc = wc + " And r.id = @empid ";
                //dp.Add("@empid", Convert.ToInt32(accountexecutive));
            }
            if (leadidfilter.Trim() != "" && leadidfilter.Trim() != "null")
            {
                wc = wc + " And q.RequestId in (select id from AppRFQ where LeadId = @LeadId) ";
                dp.Add("@LeadId",leadidfilter);
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
                sort = " order by q.Id asc";
            }

            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Quotation>(qp + "select count(*) Over() TotalRows,q.* FROM (select v.*,c.Name Client,ss.Status,e.FirstName +' ' + e.LastName Agent, m.Name AgentPosition, n.FirstName + ' ' + n.LastName Manager, o.Name ManagerPosition, case when rfq.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates Where leadid=rfq.id Order by creationtime desc), l.AssignedToId) else c.AssignedToId end AS UAssignedToId  from appquotations v inner join appclients c on c.id = v.clientid inner join appseriestype st on st.id = v.SeriesTypeId inner join appstatustypes ss on ss.code = v.StatusId and ss.transactioncode = 100 inner join appemployee e on e.id = v.salesagentid inner join apprfq as rfq on v.requestid=rfq.id left outer join appleads as l on rfq.leadid=l.id left outer join appposition as m on e.positionid=m.id left outer join appemployee as n on e.managerid=n.id left outer join appposition as o on n.positionid=o.id) as q left outer join appemployee as r on q.uassignedtoid=r.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryDapper.QueryAsync<Quotation>(qp + " select count(*) Over() TotalRows,q.* FROM (select v.*,c.Name Client,ss.Status,e.FirstName +' ' + e.LastName Agent, m.Name AgentPosition, n.FirstName + ' ' + n.LastName Manager, o.Name ManagerPosition, case when rfq.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates with (nolock) Where leadid=rfq.id Order by creationtime desc), isnull(l.AssignedToId,0)) else isnull(c.AssignedToId,0) end AS UAssignedToId  from appquotations v inner join appclients c with (nolock) on c.id = v.clientid inner join appseriestype st with (nolock) on st.id = v.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = v.StatusId and ss.transactioncode = 100 inner join appemployee e with (nolock) on e.id = v.salesagentid inner join apprfq as rfq with (nolock) on v.requestid=rfq.id left outer join appleads as l with (nolock) on rfq.leadid=l.id left outer join appposition as m with (nolock) on e.positionid=m.id left outer join appemployee as n with (nolock) on e.managerid=n.id left outer join appposition as o with (nolock) on n.positionid=o.id) as q left outer join appemployee as r with (nolock) on q.uassignedtoid=r.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);

                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Quotation>(qp + " select count(*) Over() TotalRows,q.* FROM (select v.*,c.Name Client,ss.Status,e.FirstName +' ' + e.LastName Agent, m.Name AgentPosition, n.FirstName + ' ' + n.LastName Manager, o.Name ManagerPosition, case when rfq.Type = 'Leads' then isnull((select top 1 AssignedToId from appLeadUpdates with (nolock) Where leadid=rfq.id Order by creationtime desc),  isnull(l.AssignedToId,0)) else  isnull(c.AssignedToId,0) end AS UAssignedToId  from appquotations v inner join appclients c with (nolock) on c.id = v.clientid inner join appseriestype st with (nolock) on st.id = v.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = v.StatusId and ss.transactioncode = 100 inner join appemployee e with (nolock) on e.id = v.salesagentid inner join apprfq as rfq with (nolock) on v.requestid=rfq.id left outer join appleads as l with (nolock) on rfq.leadid=l.id left outer join appposition as m with (nolock) on e.positionid=m.id left outer join appemployee as n with (nolock) on e.managerid=n.id left outer join appposition as o with (nolock) on n.positionid=o.id) as q left outer join appemployee as r with (nolock) on q.uassignedtoid=r.id  " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Quotation>> GetAllRevisionList(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            
            string codefilter = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    codefilter = tokens[0].ToString();
                }
            }

            string wc = " Where q.isdeleted = 0 ";
            var dp = new DynamicParameters();
            
            if (codefilter != "")
            {
                wc = wc + " And q.Code = @Code ";
                dp.Add("@Code", codefilter);
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
                sort = " order by q.Id asc";
            }
            
            try
            {
                //if (!forexport)
                //{
                //    var getAll = await _repositoryDapper.QueryAsync<Quotation>("select count(*) Over() TotalRows,q.* FROM (select v.*,c.Name Client,ss.Status,e.FirstName +' ' + e.LastName Agent  from appquotations v inner join appclients c on c.id = v.clientid inner join appseriestype st on st.id = v.SeriesTypeId inner join appstatustypes ss on ss.code = v.StatusId and ss.transactioncode = 100 inner join appemployee e on e.id = v.salesagentid) as q " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                //    return getAll;
                //}
                //else
                //{
                    var getAll = await _repositoryDapper.QueryAsync<Quotation>(" select count(*) Over() TotalRows,q.* FROM (select v.*,c.Name Client,ss.Status,e.FirstName +' ' + e.LastName Agent, m.Name AgentPosition, n.FirstName + ' ' + n.LastName Manager, o.Name ManagerPosition  from appquotations v with (nolock) inner join appclients c with (nolock) on c.id = v.clientid inner join appseriestype st with (nolock) on st.id = v.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = v.StatusId and ss.transactioncode = 100 inner join appemployee e with (nolock) on e.id = v.salesagentid left outer join appposition as m with (nolock) on e.positionid=m.id left outer join appemployee as n with (nolock) on e.managerid=n.id left outer join appposition as o with (nolock) on n.positionid=o.id) as q " + wc + sort, dp);
                    return getAll;
                //}
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Quotation> GetByIdAsync(int id)
        {
            string wc = " Where q.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                //var getAll = await _repositoryDapper.QueryAsync<Quotation>("select count(*) Over() TotalRows,q.*,c.Name Client,ss.Status, RequestCode,e.FirstName +' ' + e.LastName Agent, m.Name AgentPosition, n.FirstName + ' ' + n.LastName Manager, o.Name ManagerPosition  from appquotations q inner join appclients c on c.id = q.clientid inner join appseriestype st on st.id = q.SeriesTypeId inner join appstatustypes ss on ss.code = q.StatusId and ss.transactioncode = 100 inner join appemployee e on e.id = q.salesagentid left outer join appposition as m on e.positionid=m.id left outer join appemployee as n on e.managerid=n.id left outer join appposition as o on n.positionid=o.id " + wc, dp);
                var getAll = await _repositoryDapper.QueryAsync<Quotation>(" select count(*) Over() TotalRows,q.*,c.Name Client,ss.Status, RequestCode,e.FirstName +' ' + e.LastName Agent, m.Name AgentPosition, n.FirstName + ' ' + n.LastName Manager, o.Name ManagerPosition  from appquotations q with (nolock) inner join appclients c on c.id = q.clientid inner join appseriestype st with (nolock) on st.id = q.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = q.StatusId and ss.transactioncode = 100 inner join appemployee e with (nolock) on e.id = q.salesagentid left outer join appposition as m with (nolock) on e.positionid=m.id left outer join appemployee as n with (nolock) on e.managerid=n.id left outer join appposition as o with (nolock) on n.positionid=o.id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Quotation entity)
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
