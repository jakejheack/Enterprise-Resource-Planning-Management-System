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
    public class SalesOrderManager : DomainService, ISalesOrderManager
    {
        private readonly IRepository<SalesOrder> _repository;
        private readonly IDapperRepository<SalesOrder> _repositoryDapper;
        private readonly IPermissionChecker _permissionChecker;

        public SalesOrderManager(IRepository<SalesOrder> repository, IDapperRepository<SalesOrder> repositoryDapper, IPermissionChecker permissionChecker)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
            _permissionChecker = permissionChecker;
        }

        public async Task<IdentityResult> CreateAsync(SalesOrder entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
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

        public async Task<IEnumerable<SalesOrder>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string idfilter = "";
            string clientfilter = "";
            string statusfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";
            string clientidfilter = "";
            string salesagent = "";
            string salesagentid = "";
            string aefilter = "";
            string leadidfilter = "";
            //MARC SO QuotationRevision 06032024
            string quotidfilter = "";

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
                    salesagent = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    salesagentid = tokens[7].ToString();
                }
            }
            if (tokens.Length > 8)
            {
                if (tokens[8].ToString() != "null")
                {
                    aefilter = tokens[8].ToString();
                }
            }
            if (tokens.Length > 9)
            {
                if (tokens[9].ToString() != "null")
                {
                    leadidfilter = tokens[9].ToString();
                }
            }
            //MARC SO QuotationRevision 06032024
            if (tokens.Length > 10)
            {
                if (tokens[10].ToString() != "null")
                {
                    quotidfilter = tokens[10].ToString();
                }
            }

            string wc = " Where so.isdeleted = 0 ", qp = "";
            var dp = new DynamicParameters();

            if (idfilter != "" && idfilter.Trim() != null & idfilter.Trim() != "null")
            {
                wc = wc + " And (so.code like @Id OR c.name like @Id)";
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
                wc = wc + " And so.statusid  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And so.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", startdatefilter);
                dp.Add("@EndDate", enddatefilter);
            }
            if(clientidfilter != "")
            {
                wc = wc + " And so.ClientId = @ClientId ";
                dp.Add("@ClientId", clientidfilter);
            }
            if (salesagent != "")
            {
                wc = wc + " And (e.FirstName like @SalesAgent Or e.MiddleName like @SalesAgent Or e.LastName like @SalesAgent)";
                dp.Add("@SalesAgent", "%" + salesagent + "%");
            }
            if (salesagentid != "")
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
                            wc = wc + " AND so.SalesAgentId in (" + aefilter + ") ";
                        }
                        else
                        {
                            wc = wc + " AND so.SalesAgentId in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";
                        }
                    }
                }
                else
                {
                    if (aefilter != "")
                    {
                        wc = wc + " AND so.SalesAgentId in (" + aefilter + ") ";
                    }
                }
                //wc = wc + " And r.id = @empid ";
                dp.Add("@empid", Convert.ToInt32(salesagentid));
                dp.Add("@mempid", Convert.ToInt32(salesagentid));
                //wc = wc + " And so.SalesAgentId = @SalesAgentId ";
                //dp.Add("@SalesAgentId", salesagentid);
            }
            if (leadidfilter.Trim() != "" && leadidfilter.Trim() != "null")
            {
                wc = wc + " And so.QuotationId in (Select Id from AppQuotations Where RequestId in (Select id From AppRFQ where LeadId = @LeadId)) ";
                dp.Add("@LeadId", leadidfilter);
            }
            //MARC SO QuotationRevision 06032024
            if (quotidfilter.Trim() != "" && leadidfilter.Trim() != "null")
            {
                wc = wc + " And so.QuotationId = @QuotId and so.StatusId!=7 "; //Status 7 is revised
                dp.Add("@QuotId", quotidfilter);
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
                sort = " order by Id asc";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(qp + " select count(*) Over() TotalRows,so.*,c.Name Client, c.BusinessStyle, c.TaxNo,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF, 	CONVERT(VARCHAR(10), DeliveryTime, 101) DeliveryTimeF,e.FirstName + ' ' + e.LastName SalesAgent, " +
                                                                                "isnull(tmpsi.billedcharges, 0) BillOtherCharges,isnull(tmpsi.billeddiscount, 0) BillOtherDiscount,isnull(tmpsi.billednettotal, 0) BillNetTotal,isnull(tmpsi.billedtax, 0) BillTax, isnull(tmpsi.billedsubtotal, 0) BillSubTotal, SubTotal - isnull(tmpsi.billedsubtotal, 0) BillSubBalance,isnull(tmpsi.billedgrandtotal, 0) BillGrandTotal, GrandTotal - isnull(tmpsi.billedgrandtotal, 0) BillGrandBalance " +
                                                                                "from appsalesorders so with (nolock) inner join appclients c with (nolock) on c.id = so.clientid inner join appseriestype st with (nolock) on st.id = so.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = so.StatusId and ss.transactioncode = 101 inner join AppEmployee e on e.Id = so.SalesAgentId " +
                                                                                "left outer join (select salesorderid, sum(billothercharges) billedcharges, sum(billotherdiscount) billedDiscount, sum(billnettotal) billednettotal, sum(billtax) billedtax, sum(billsubtotal) billedsubtotal, sum(billgrandtotal) billedgrandtotal from appsalesinvoice where isdeleted = 0 and statusid < 5 group by SalesOrderId) tmpsi on so.id = tmpsi.salesorderid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(qp + " select count(*) Over() TotalRows,so.*,c.Name Client, c.BusinessStyle, c.TaxNo,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF, 	CONVERT(VARCHAR(10), DeliveryTime, 101) DeliveryTimeF,e.FirstName + ' ' + e.LastName SalesAgent, " +
                                                                                "isnull(tmpsi.billedcharges, 0) BillOtherCharges,isnull(tmpsi.billeddiscount, 0) BillOtherDiscount,isnull(tmpsi.billednettotal, 0) BillNetTotal,isnull(tmpsi.billedtax, 0) BillTax, isnull(tmpsi.billedsubtotal, 0) BillSubTotal, SubTotal - isnull(tmpsi.billedsubtotal, 0) BillSubBalance,isnull(tmpsi.billedgrandtotal, 0) BillGrandTotal, GrandTotal - isnull(tmpsi.billedgrandtotal, 0) BillGrandBalance " +
                                                                                "from appsalesorders so with (nolock) inner join appclients c with (nolock) on c.id = so.clientid inner join appseriestype st with (nolock) on st.id = so.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = so.StatusId and ss.transactioncode = 101 inner join AppEmployee e on e.Id = so.SalesAgentId " +
                                                                                "left outer join (select salesorderid, sum(billothercharges) billedcharges, sum(billotherdiscount) billedDiscount, sum(billnettotal) billednettotal, sum(billtax) billedtax, sum(billsubtotal) billedsubtotal, sum(billgrandtotal) billedgrandtotal from appsalesinvoice where isdeleted = 0 and statusid < 5 group by SalesOrderId) tmpsi on so.id = tmpsi.salesorderid " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetAllRevisionList(string filter, string sorting)
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

            string wc = " Where so.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (codefilter != "")
            {
                wc = wc + " And so.Code = @Code ";
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
                sort = " order by so.Id asc";
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
                var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(" select count(*) Over() TotalRows,so.*,c.Name Client, c.BusinessStyle, c.TaxNo,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF, 	CONVERT(VARCHAR(10), DeliveryTime, 101) DeliveryTimeF,e.FirstName + ' ' + e.LastName SalesAgent , " +
                                                                                "isnull(tmpsi.billedcharges, 0) BillOtherCharges,isnull(tmpsi.billeddiscount, 0) BillOtherDiscount,isnull(tmpsi.billednettotal, 0) BillNetTotal,isnull(tmpsi.billedtax, 0) BillTax, isnull(tmpsi.billedsubtotal, 0) BillSubTotal, SubTotal - isnull(tmpsi.billedsubtotal, 0) BillSubBalance,isnull(tmpsi.billedgrandtotal, 0) BillGrandTotal, GrandTotal - isnull(tmpsi.billedgrandtotal, 0) BillGrandBalance " +
                                                                                "from appsalesorders as so with (nolock) inner join appclients c on c.id = so.clientid inner join appseriestype st with (nolock) on  st.id = so.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = so.StatusId and ss.transactioncode = 101 inner join AppEmployee as e with (nolock) on e.Id = so.SalesAgentId " +
                                                                                "left outer join (select salesorderid, sum(billothercharges) billedcharges, sum(billotherdiscount) billedDiscount, sum(billnettotal) billednettotal, sum(billtax) billedtax, sum(billsubtotal) billedsubtotal, sum(billgrandtotal) billedgrandtotal from appsalesinvoice where isdeleted = 0 and statusid < 5 group by SalesOrderId) tmpsi on so.id = tmpsi.salesorderid " + wc + sort, dp);
                return getAll;
                //}
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<SalesOrder> GetByIdAsync(int id)
        {
            string wc = " Where so.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(" select count(*) Over() TotalRows,so.*,c.Name Client, c.BusinessStyle, c.TaxNo,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF, 	CONVERT(VARCHAR(10), DeliveryTime, 101) DeliveryTimeF,e.FirstName + ' ' + e.LastName SalesAgent , " +
                                                                                "isnull(tmpsi.billedcharges, 0) BillOtherCharges,isnull(tmpsi.billeddiscount, 0) BillOtherDiscount,isnull(tmpsi.billednettotal, 0) BillNetTotal,isnull(tmpsi.billedtax, 0) BillTax, isnull(tmpsi.billedsubtotal, 0) BillSubTotal, SubTotal - isnull(tmpsi.billedsubtotal, 0) BillSubBalance,isnull(tmpsi.billedgrandtotal, 0) BillGrandTotal, GrandTotal - isnull(tmpsi.billedgrandtotal, 0) BillGrandBalance " +
                                                                                "from appsalesorders as so with (nolock) inner join appclients c on c.id = so.clientid inner join appseriestype st with (nolock) on  st.id = so.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = so.StatusId and ss.transactioncode = 101 inner join AppEmployee as e with (nolock) on e.Id = so.SalesAgentId " +
                                                                                "left outer join (select salesorderid, sum(billothercharges) billedcharges, sum(billotherdiscount) billedDiscount, sum(billnettotal) billednettotal, sum(billtax) billedtax, sum(billsubtotal) billedsubtotal, sum(billgrandtotal) billedgrandtotal from appsalesinvoice where isdeleted = 0 and statusid < 5 group by SalesOrderId) tmpsi on so.id = tmpsi.salesorderid " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SalesOrder entity)
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

        public async Task<IEnumerable<SalesOrder>> GetSalesOrderReportListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string datestart = "";
            string dateend = "";
            string types = "";
            string search = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    datestart = tokens[0].ToString();
                    dateend = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    types = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    search = tokens[3].ToString();
                }
            }

            string wc = " Where SO.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (datestart != "" && dateend != "")
            {
                wc = wc + " And SO.TransactionTime between @StartDate and @EndDate ";
                dp.Add("@StartDate", datestart);
                dp.Add("@EndDate", dateend);
            }
            if (types == "")
            {
                wc = wc + " ";
            }
            if (types == "1")
            {
                if (search != "")
                {
                    wc = wc + " and MG.FirstName like @search or MG.LastName like @search ";
                    dp.Add("@search", "%" + search + "%");
                }
                else
                {
                    wc = wc + " ";
                }

            }
            if (types == "2")
            {
                if (search != "")
                {
                    wc = wc + " and SO.SalesAgent like @search ";
                    dp.Add("@search", "%" + search + "%");
                }
                else
                {
                    wc = wc + " ";
                }
            }
            if (types == "3")
            {
                if (search != "")
                {
                    wc = wc + " and SO.Client like @search ";
                    dp.Add("@search", "%" + search + "%");
                }
                else
                {
                    wc = wc + " ";
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
                sort = "order by SO.TransactionTime desc";
            }

            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesOrder>("select count(*) Over() AS TotalRows,SO.*,MG.FirstName+' '+MG.LastName as Status from (select a.*, b.name as Client,c.FirstName+' '+c.LastName as SalesAgent,c.Managerid as QuotationCode  from AppsalesOrders as a with (nolock) inner join AppClients as b with (nolock) on a.Clientid = b.Id inner join AppEmployee as c with (nolock) on  a.SalesAgentId = c.id )as SO inner join AppEmployee as MG with (nolock) on MG.Id = (CASE WHEN SO.QuotationCode = 0 THEN SO.SalesAgentId ELSE SO.QuotationCode END) " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(" select count(*) Over() AS TotalRows,SO.*,MG.FirstName+' '+MG.LastName as Status from (select a.*, b.name as Client,c.FirstName+' '+c.LastName as SalesAgent,c.Managerid as QuotationCode  from AppsalesOrders as a with (nolock) inner join AppClients as b with (nolock) on a.Clientid = b.Id inner join AppEmployee as c with (nolock) on  a.SalesAgentId = c.id )as SO inner join AppEmployee as MG with (nolock) on MG.Id = (CASE WHEN SO.QuotationCode = 0 THEN SO.SalesAgentId ELSE SO.QuotationCode END) " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<SalesOrder>> UpdateTpcasync(string filter)
        {
            string[] tokens = filter.Split('|');

            string soid = "";
            string tpc = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    soid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    tpc = tokens[1].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if (soid != "")
            {
                wc = wc + " set tpc = @tpc Where isdeleted = 0 And code = @soid ";
                dp.Add("@soid", soid);
                dp.Add("@tpc", tpc);
            }
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesOrder>( "update appsalesorders" + wc , dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<SalesOrder>> UpdateQDiscountAync(string filter)
        {
            string[] tokens = filter.Split('|');

            string code = "";
            string dscnt = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    code = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dscnt = tokens[1].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if (code != "")
            {
                wc = wc + " set Discount = @dscnt Where code in (select RequestCode as code from AppQuotations with (nolock) where code = @code) and IsDeleted = 0 ";
                dp.Add("@code", code);
                dp.Add("@dscnt", dscnt);
            }
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesOrder>("update AppRFQ " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesorderSummaryAgentId(string filter)
        {
            string[] tokens = filter.Split('|');

            string startdate = "";
            string enddate = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    startdate = tokens[0].ToString();
                    enddate = tokens[1].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if (startdate != "" && enddate != "")
            {
                wc = wc + " where a.isdeleted = 0 and a.DeliveryTime between @StartDate and @EndDate group by Salesagentid,b.FirstName";
                dp.Add("@StartDate", Convert.ToDateTime(Convert.ToDateTime(startdate).ToString("MM/dd/yyyy") + " 00:00:00"));
                dp.Add("@EndDate", Convert.ToDateTime(Convert.ToDateTime(enddate).ToString("MM/dd/yyyy") + " 23:59:59"));
            }
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesOrder>("select Salesagentid,b.FirstName as SalesAgent from Appsalesorders as a with (nolock) inner join appemployee as b with (nolock) on a.Salesagentid = b.id " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<SalesOrder> GetSalesorderAgentDivision(int id)
        {
            string wc = "  where a.id = @id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesOrder>("select a.id,a.EmployeeCode,a.DivisionId,b.Name as Status from appEmployee as a with (nolock) inner join AppDivEmployee as b with (nolock) on a.DivisionId = b.Id  " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetDashboardListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string datestart = "";
            string dateend = "";
            string reference = "";
            string code = "";
            string status = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    datestart = tokens[0].ToString();
                    dateend = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    reference = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    code = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    status = tokens[4].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();

            if (datestart != "" && dateend != "")
            {
                wc = wc + " where a.LeadDate between @StartDate and @EndDate ";
                dp.Add("@StartDate", datestart);
                dp.Add("@EndDate", dateend);
            }
            if (reference == "")
            {
                wc = wc + " ";
            }
            if (code == "")
            {
                //if (search != "")
                //{
                //    wc = wc + " and MG.FirstName like @search or MG.LastName like @search ";
                //    dp.Add("@search", "%" + search + "%");
                //}
                //else
                //{
                //    wc = wc + " ";
                //}

            }
            if (status == "")
            {
                //if (search != "")
                //{
                //    wc = wc + " and SO.SalesAgent like @search ";
                //    dp.Add("@search", "%" + search + "%");
                //}
                //else
                //{
                //    wc = wc + " ";
                //}
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
                sort = " order by a.Code desc ";
            }

            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(" select	count(*) Over() TotalRows,a.Code as LCode,a.LeadDate as TransactionTime,a.LastModificationTime as aLastModificationTime,a.Name as LName,a.Project as LProject,astats.Status as LStatus, " +
                                                                                " b.code as RCode, b.TransactionTime as RTime, b.LastModificationTime as bLastModificationTime, b.Status as RStatus, b.LeadId as RLeadId, " +
                                                                                " c.code as QCode, c.TransactionTime as QTime, c.LastModificationTime as cLastModificationTime, c.Status as QStatus, c.RequestId as QReqId, " +
                                                                                " d.code as SCode, d.TransactionTime as STime, d.LastModificationTime as dLastModificationTime, d.Status as SStatus, d.QuotationId as SQid, " +
                                                                                " e.code as DCode, e.TransactionTime as DTime, e.LastModificationTime as eLastModificationTime, e.Status as DStatue, e.SalesOrderId as DSid, " +
                                                                                " f.code as ICode, f.TransactionTime as ITime, f.LastModificationTime as fLastModificationTime, f.Status as IStatus, f.SalesOrderId as ISid" +
                                            " from AppLeads as a with (nolock) " +
                                            " inner join AppStatusTypes as astats on a.StatusId = astats.Code and a.IsDeleted = 0 and astats.TransactionCode = 104 and a.StatusId not in ('4') " +
                                            " Left Outer join(select bb.code, bb.TransactionTime, bb.LastModificationTime, bb.StatusId, bb.id, bb.LeadId, bbstats.Status from AppRFQ as bb with (nolock) inner join AppStatusTypes as bbstats on bb.StatusId = bbstats.Code and bb.IsDeleted = 0 and bbstats.TransactionCode = 100 and bb.StatusId not in ('5', '8')) as b on a.Id = b.LeadId " +
                                            " Left Outer join(select cc.code, cc.TransactionTime, cc.LastModificationTime, cc.StatusId, cc.id, cc.RequestId, ccstats.Status from AppQuotations as cc with (nolock) inner join AppStatusTypes as ccstats on cc.StatusId = ccstats.Code and cc.IsDeleted = 0 and ccstats.TransactionCode = 100 and cc.StatusId not in ('5', '8')) as c on b.id = c.RequestId " +
                                            " Left Outer join(select dd.code, dd.TransactionTime, dd.LastModificationTime, dd.StatusId, dd.id, dd.QuotationId, ddstats.Status from AppSalesOrders as dd with (nolock) inner join AppStatusTypes as ddstats on dd.StatusId = ddstats.Code and dd.IsDeleted = 0 and ddstats.TransactionCode = 101) as d on c.id = d.QuotationId " +
                                            " Left Outer join(select ee.code, ee.TransactionTime, ee.LastModificationTime, ee.StatusId, ee.id, ee.SalesOrderId, eestats.Status from AppDeliveryReceipt as ee with (nolock) inner join AppStatusTypes as eestats on ee.StatusId = eestats.Code and ee.IsDeleted = 0 and eestats.TransactionCode = 100) as e on d.id = e.SalesOrderId " +
                                            " Left Outer join(select ff.code, ff.TransactionTime, ff.LastModificationTime, ff.StatusId, ff.id, ff.SalesOrderId, ffstats.Status from AppSalesInvoice as ff with (nolock) inner join AppStatusTypes as ffstats on ff.StatusId = ffstats.Code and ff.IsDeleted = 0 and ffstats.TransactionCode = 103) as f on d.id = f.SalesOrderId " +
                                             wc + sort, dp);
                                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesOrder>(" select	count(*) Over() TotalRows,a.Code as LCode,a.LeadDate as TransactionTime,a.LastModificationTime as aLastModificationTime,a.Name as LName,a.Project as LProject,astats.Status as LStatus, " +
                                                                               " b.code as RCode, b.TransactionTime as RTime, b.LastModificationTime as bLastModificationTime, b.Status as RStatus, b.LeadId as RLeadId, " +
                                                                               " c.code as QCode, c.TransactionTime as QTime, c.LastModificationTime as cLastModificationTime, c.Status as QStatus, c.RequestId as QReqId, " +
                                                                               " d.code as SCode, d.TransactionTime as STime, d.LastModificationTime as dLastModificationTime, d.Status as SStatus, d.QuotationId as SQid, " +
                                                                               " e.code as DCode, e.TransactionTime as DTime, e.LastModificationTime as eLastModificationTime, e.Status as DStatue, e.SalesOrderId as DSid, " +
                                                                               " f.code as ICode, f.TransactionTime as ITime, f.LastModificationTime as fLastModificationTime, f.Status as IStatus, f.SalesOrderId as ISid" +
                                           " from AppLeads as a with (nolock) " +
                                           " inner join AppStatusTypes as astats on a.StatusId = astats.Code and a.IsDeleted = 0 and astats.TransactionCode = 104 and a.StatusId not in ('4') " +
                                           " Left Outer join(select bb.code, bb.TransactionTime, bb.LastModificationTime, bb.StatusId, bb.id, bb.LeadId, bbstats.Status from AppRFQ as bb with (nolock) inner join AppStatusTypes as bbstats on bb.StatusId = bbstats.Code and bb.IsDeleted = 0 and bbstats.TransactionCode = 100 and bb.StatusId not in ('5', '8')) as b on a.Id = b.LeadId " +
                                           " Left Outer join(select cc.code, cc.TransactionTime, cc.LastModificationTime, cc.StatusId, cc.id, cc.RequestId, ccstats.Status from AppQuotations as cc with (nolock) inner join AppStatusTypes as ccstats on cc.StatusId = ccstats.Code and cc.IsDeleted = 0 and ccstats.TransactionCode = 100 and cc.StatusId not in ('5', '8')) as c on b.id = c.RequestId " +
                                           " Left Outer join(select dd.code, dd.TransactionTime, dd.LastModificationTime, dd.StatusId, dd.id, dd.QuotationId, ddstats.Status from AppSalesOrders as dd with (nolock) inner join AppStatusTypes as ddstats on dd.StatusId = ddstats.Code and dd.IsDeleted = 0 and ddstats.TransactionCode = 101) as d on c.id = d.QuotationId " +
                                           " Left Outer join(select ee.code, ee.TransactionTime, ee.LastModificationTime, ee.StatusId, ee.id, ee.SalesOrderId, eestats.Status from AppDeliveryReceipt as ee with (nolock) inner join AppStatusTypes as eestats on ee.StatusId = eestats.Code and ee.IsDeleted = 0 and eestats.TransactionCode = 100) as e on d.id = e.SalesOrderId " +
                                           " Left Outer join(select ff.code, ff.TransactionTime, ff.LastModificationTime, ff.StatusId, ff.id, ff.SalesOrderId, ffstats.Status from AppSalesInvoice as ff with (nolock) inner join AppStatusTypes as ffstats on ff.StatusId = ffstats.Code and ff.IsDeleted = 0 and ffstats.TransactionCode = 103) as f on d.id = f.SalesOrderId " +
                                             wc + sort, dp); return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
