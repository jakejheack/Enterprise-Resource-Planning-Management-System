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


namespace ezinvmvc.App.Accounting
{
    public class GeneralLedgerManager : DomainService, IGeneralLedgerManager
    {
        private readonly IRepository<GeneralLedger> _repository;
        private readonly IDapperRepository<GeneralLedger> _repositoryDapper;
        public GeneralLedgerManager(IRepository<GeneralLedger> repository, IDapperRepository<GeneralLedger> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(GeneralLedger entity)
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

        public async Task<IEnumerable<GeneralLedger>> GetAllByParentId(int parentid)
        {
            string wc = " Where qi.quotationid = @parentid and qi.isdeleted = 0 ";

            string sort = " order by qi.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<GeneralLedger>("" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<GeneralLedger>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string companyid = "";//0
            string startdate = "";//1
            string enddate = "";//2
            string accountid = "";//3
            string transactioncode = "";//4
            string projectid = "";//5
            string partycode = "";//6
            string partyid = "";//7

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    companyid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null" && tokens[2].ToString() != "null")
                {
                    startdate = tokens[1].ToString();
                    enddate = tokens[2].ToString();
                }
            }

            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    accountid = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    transactioncode = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    projectid = tokens[5].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    partycode = tokens[6].ToString();
                }
            }
       
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    partyid = tokens[7].ToString();
                }
            }
       
            string wc = " Where gl.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (companyid != "")
            {
                wc = wc + " And gl.companyid = @companyid ";
                dp.Add("@companyid", companyid);
            }
            if (startdate != "" && enddate != "")
            {
                wc = wc + " And gl.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdate).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddate).ToString("MM/dd/yyyy") + " 23:59:59");
            }

            if (accountid != "")
            {
                wc = wc + " And gl.accountid = @accountid ";
                dp.Add("@accountid", accountid);
            }
            if (transactioncode != "")
            {
                wc = wc + " And gl.transactioncode = @transactioncode ";
                dp.Add("@transactioncode", transactioncode);
            }
            if (projectid != "")
            {
                wc = wc + " And gl.projectid = @projectid ";
                dp.Add("@projectid", projectid);
            }
            if (partycode != "")
            {
                wc = wc + " And gl.partycode = @partycode ";
                dp.Add("@partycode", partycode);
            }
            if (partyid != "")
            {
                wc = wc + " And gl.partyid = @partyid ";
                dp.Add("@partyid", partyid);
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
                sort = " order by gl.Id asc";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<GeneralLedger>("select count(*) Over() TotalRows,gl.*, a.Name Account, CASE WHEN BaseTypeId = 1 THEN 'Debit' ELSE 'Credit' END BaseType, '' CenterType, CASE WHEN PartyCode = 105 THEN 'Client' WHEN  PartyCode = 108 THEN  'Employee' WHEN PartyCode = 200 THEN 'Vendor' ELSE '' END PartyType, t.Name TransactionType  from AppGeneralLedger gl inner join AppAccount a on a.Id = gl.AccountId inner join AppTransactions t on t.Id = gl.TransactionTypeId  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<GeneralLedger>("select count(*) Over() TotalRows,gl.*, a.Name Account, CASE WHEN BaseTypeId = 1 THEN 'Debit' ELSE 'Credit' END BaseType, '' CenterType, CASE WHEN PartyCode = 105 THEN 'Client' WHEN  PartyCode = 108 THEN  'Employee' WHEN PartyCode = 200 THEN 'Vendor' ELSE '' END PartyType, t.Name TransactionType  from AppGeneralLedger gl inner join AppAccount a on a.Id = gl.AccountId inner join AppTransactions t on t.Id = gl.TransactionTypeId " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<GeneralLedger> GetByIdAsync(int id)
        {
            string wc = " Where q.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<GeneralLedger>("" + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<GeneralLedger>> GetTrialBalance(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string companyid = "";//0
            string startdate = "";//1
            string enddate = "";//2
            string accountid = "";//3
            string transactioncode = "";//4
            string projectid = "";//5
            string partycode = "";//6
            string partyid = "";//7

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    companyid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null" && tokens[2].ToString() != "null")
                {
                    startdate = tokens[1].ToString();
                    enddate = tokens[2].ToString();
                }
            }

            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    accountid = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    transactioncode = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    projectid = tokens[5].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    partycode = tokens[6].ToString();
                }
            }

            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    partyid = tokens[7].ToString();
                }
            }

            string wc = " Where a.isdeleted = 0 ";
            string glwc = " Where isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (companyid != "")
            {
                glwc = glwc + " And companyid = @companyid ";
                dp.Add("@companyid", companyid);
            }
            if (startdate != "" && enddate != "")
            {
                glwc = glwc + " And transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdate).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddate).ToString("MM/dd/yyyy") + " 23:59:59");
            }

            if (accountid != "")
            {
                glwc = glwc + " And accountid = @accountid ";
                dp.Add("@accountid", accountid);
            }
            if (transactioncode != "")
            {
                glwc = glwc + " And transactioncode = @transactioncode ";
                dp.Add("@transactioncode", transactioncode);
            }
            if (projectid != "")
            {
                glwc = glwc + " And projectid = @projectid ";
                dp.Add("@projectid", projectid);
            }
            if (partycode != "")
            {
                glwc = glwc + " And partycode = @partycode ";
                dp.Add("@partycode", partycode);
            }
            if (partyid != "")
            {
                glwc = glwc + " And partyid = @partyid ";
                dp.Add("@partyid", partyid);
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
                sort = " order by a.Id asc";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<GeneralLedger>("select  count(*) Over() TotalRows,gl.*, a.name as account, a.Id as tt_key, a.ParentNode as tt_parent, ac.name AccountClass, ac.Base AccountBase,at.Name AccountType, ag.Name AccountGroup, c.Name Company, c.Abbr CompanyAbbr, isnull(debit, 0) as debit, isnull(credit, 0) as credit from appaccount a inner join appaccountclass ac on " +
                                                                                   "ac.id = a.accountclassid inner join appaccounttype at on at.id = a.accounttypeid inner join appaccountgroup ag on ag.id = a.accountgroupid inner join appcompany c on c.id = a.companyid left outer join (select accountid, case when sum(isnull(debit, 0)) > sum(isnull(credit, 0)) then sum(isnull(debit, 0)) - sum(isnull(credit, 0)) else 0 end as debit " +
                                                                                   ",case when sum(isnull(credit, 0)) > sum(isnull(debit, 0)) then sum(isnull(credit, 0)) - sum(isnull(debit, 0)) else 0 end as credit from AppGeneralLedger " + glwc + " group by accountid) as gl on gl.AccountId = a.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<GeneralLedger>("select  count(*) Over() TotalRows,gl.*, a.name as account, a.Id as tt_key, a.ParentNode as tt_parent, ac.name AccountClass, ac.Base AccountBase,at.Name AccountType, ag.Name AccountGroup, c.Name Company, c.Abbr CompanyAbbr, isnull(debit, 0) as debit, isnull(credit, 0) as credit from appaccount a inner join appaccountclass ac on " +
                                                                                   "ac.id = a.accountclassid inner join appaccounttype at on at.id = a.accounttypeid inner join appaccountgroup ag on ag.id = a.accountgroupid inner join appcompany c on c.id = a.companyid left outer join (select accountid, case when sum(isnull(debit, 0)) > sum(isnull(credit, 0)) then sum(isnull(debit, 0)) - sum(isnull(credit, 0)) else 0 end as debit " +
                                                                                   ",case when sum(isnull(credit, 0)) > sum(isnull(debit, 0)) then sum(isnull(credit, 0)) - sum(isnull(debit, 0)) else 0 end as credit from AppGeneralLedger " + glwc + " group by accountid) as gl on gl.AccountId = a.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(GeneralLedger entity)
        {
            await _repository.UpdateAsync(entity);
            return IdentityResult.Success;
        }
    }
}
