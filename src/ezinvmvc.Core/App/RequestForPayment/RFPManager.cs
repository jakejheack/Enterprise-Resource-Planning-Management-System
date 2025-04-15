using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.RequestForPayment.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.RequestForPayment
{
    public class RFPManager : DomainService, IRFPManager
    {
        private readonly IRepository<RFP> _repositoryRfp;
        private readonly IDapperRepository<RFP> _repositoryRfpDapper;

        public RFPManager(IRepository<RFP> repositoryRfp, IDapperRepository<RFP> repositoryRfpDapper)
        {
            _repositoryRfp = repositoryRfp;
            _repositoryRfpDapper = repositoryRfpDapper;
        }

        public async Task<IEnumerable<RFP>> Autocomplete(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string tfilter = "", code = "", datefrom = "", dateto = "", client = "";
            //string tfilter = "", code = "", datefrom = "", dateto = "", statustypes = "", clientid = "", accountexecutive = "";
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
                    client = tokens[4];
                }
            }
            //if (tokens.Length > 5)
            //{
            //    if (tokens[5].ToString() != "null")
            //    {
            //        clientid = tokens[5];
            //    }
            //}
            //if (tokens.Length > 6)
            //{
            //    if (tokens[6].ToString() != "null")
            //    {
            //        accountexecutive = tokens[6];
            //    }
            //}

            string wc = " Where RFP.isdeleted = 0 and RFP.StatusId = 2 ";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And (RFP.Code like @Filter) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }
            if (code != null && code.Trim() != "" && code.Trim() != "null")
            {
                wc = wc + " And RFP.requestCode = @code ";
                dp.Add("@code", code);
            }
            if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            {
                wc = wc + " And RFP.TransactionTime between @datefrom and @dateto ";
                dp.Add("@datefrom", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@dateto", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            //if (client != null && client.Trim() != "" && client.Trim() != "null")
            //{
            //    wc = wc + " And RFP.client = @clientid ";
            //    dp.Add("@clientid", client);
            //}
            //if (statustypes != null && statustypes.Trim() != "" && statustypes.Trim() != "null")
            //{
            //    statustypes = "'" + statustypes.Replace(",", "','") + "'";
            //    wc = wc + " And a.statusid  in (" + statustypes + ") ";
            //}

            //if (accountexecutive != null && accountexecutive.Trim() != "" && accountexecutive.Trim() != "null")
            //{
            //    wc = wc + " And r.id = @empid ";
            //    dp.Add("@empid", Convert.ToInt32(accountexecutive));
            //}

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
                sort = " order by RFP.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //vendor
                    var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, RFP.* FROM (select a.*, b.Name company, c.Name Client, d.Status Status FROM AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 110) RFP  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, RFP.* FROM (select a.*, b.Name company, c.Name Client, d.Status Status FROM AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join AppClients c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 110) RFP  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, RFP.* FROM (select a.*, b.Name company, c.Name Client, d.Status Status FROM AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 110) RFP  " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> CreateAsync(RFP entity)
        {
            var result = _repositoryRfp.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryRfp.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryRfp.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryRfp.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");

            }
        }

        public async Task<IEnumerable<RFP>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string tfilter = "", code = "", datefrom = "", dateto = "", client = "";
            //string tfilter = "", code = "", datefrom = "", dateto = "", statustypes = "", clientid = "", accountexecutive = "";
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
                    client = tokens[4];
                }
            }
            //if (tokens.Length > 5)
            //{
            //    if (tokens[5].ToString() != "null")
            //    {
            //        clientid = tokens[5];
            //    }
            //}
            //if (tokens.Length > 6)
            //{
            //    if (tokens[6].ToString() != "null")
            //    {
            //        accountexecutive = tokens[6];
            //    }
            //}

            string wc = " Where RFP.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And (RFP.Code like @Filter) or (RFP.RequestCode like @Filter) or (RFP.Client like @Filter) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }
            if (code != null && code.Trim() != "" && code.Trim() != "null")
            {
                wc = wc + " And RFP.requestCode = @code ";
                dp.Add("@code", code);
            }
            if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            {
                wc = wc + " And RFP.TransactionTime between @datefrom and @dateto ";
                dp.Add("@datefrom", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@dateto", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            //if (client != null && client.Trim() != "" && client.Trim() != "null")
            //{
            //    wc = wc + " And RFP.client = @clientid ";
            //    dp.Add("@clientid", client);
            //}
            //if (statustypes != null && statustypes.Trim() != "" && statustypes.Trim() != "null")
            //{
            //    statustypes = "'" + statustypes.Replace(",", "','") + "'";
            //    wc = wc + " And a.statusid  in (" + statustypes + ") ";
            //}

            //if (accountexecutive != null && accountexecutive.Trim() != "" && accountexecutive.Trim() != "null")
            //{
            //    wc = wc + " And r.id = @empid ";
            //    dp.Add("@empid", Convert.ToInt32(accountexecutive));
            //}

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
                sort = " order by RFP.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, RFP.* FROM (select a.*, b.Name company, c.Name Client, d.Status Status FROM AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join AppClients c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 110) RFP  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, RFP.* FROM (select a.*, b.Name company, c.Name Client, d.Status Status FROM AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 110) RFP  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, RFP.* FROM (select a.*, b.Name company, c.Name Client, d.Status Status FROM AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 110) RFP  " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<RFP> GetByIdAsync(int id)
        {
            string wc = " Where a.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                //var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, a.*, b.Name Company, c.Name Client, ss.status, d.Name TaxStatus from AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join appstatustypes ss on ss.code = a.Statusid and ss.TransactionCode = 110 inner join AppClients c on a.ClientId = c.Id inner join AppTaxTypes d on a.taxtypeid = d.Id " + wc, dp);
                var getAll = await _repositoryRfpDapper.QueryAsync<RFP>("select count(*) over() Totalrows, a.*, b.Name Company, c.Name Client, ss.status, d.Name TaxStatus from AppRFP a inner join AppCompany b on a.CompanyId = b.Id inner join appstatustypes ss on ss.code = a.Statusid and ss.TransactionCode = 110 inner join AppVendors c on a.ClientId = c.Id inner join AppTaxTypes d on a.taxtypeid = d.Id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(RFP entity)
        {
            try
            {
                await _repositoryRfp.UpdateAsync(entity);
                return IdentityResult.Success;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
