using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.CheckVoucher.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CheckVoucher
{
    public class CVManager : DomainService, ICVManager
    {
        private readonly IRepository<CV> _repository;
        private readonly IDapperRepository<CV> _repositoryDapper;

        public CVManager(IRepository<CV> repository, IDapperRepository<CV> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(CV entity)
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

        public async Task<IEnumerable<CV>> GetAllByCVParentIdAsync(int parentid)
        {
            string wc = " Where CV.RequestId = @parentid and CV.isdeleted = 0 ";

            string sort = " order by Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                ////var getAll = await _repositoryDapper.QueryAsync<RFQDetails>("select rfqd.*,p.code ProductCode, u.name Unit from apprfqdetails rfqd inner join appproducts p on p.id = rfqd.ProductId inner join appunits u on u.id = rfqd.unitid " + wc + sort, dp);
                //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status, pm.Name PaymentMode FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appClients c on c.id = a.ClientId inner join AppPaymentMode  pm on pm.Id = a.PaymentModeId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV" + wc + sort, dp);
                //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status, pm.Name PaymentMode FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId inner join AppPaymentMode  pm on pm.Id = a.PaymentModeId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV" + wc + sort, dp);
                var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status, pm.Name PaymentMode, t.Name EWTType FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId inner join AppPaymentMode  pm on pm.Id = a.PaymentModeId left outer join apptaxtypes t on t.id=a.EWTTypeId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<CV>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
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
            //if (tokens.Length > 1)
            //{
            //    if (tokens[1].ToString() != "null")
            //    {
            //        code = tokens[1];
            //    }
            //}
            if (tokens.Length > 2)
            {
                if (tokens[1].ToString() != "null" && tokens[2].ToString() != "null")
                {
                    datefrom = tokens[1];
                    dateto = tokens[2];
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    client = tokens[3];
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

            string wc = " Where CV.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And (CV.Code like @Filter) or (CV.Client like @Filter) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }
            //if (code != null && code.Trim() != "" && code.Trim() != "null")
            //{
            //    wc = wc + " And RFP.requestCode = @code ";
            //    dp.Add("@code", code);
            //}
            if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            {
                wc = wc + " And CV.TransactionTime between @datefrom and @dateto ";
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
                sort = " order by CV.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appClients c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status, pm.Name PaymentMode FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appClients c on c.id = a.ClientId inner join AppPaymentMode  pm on pm.Id = a.PaymentModeId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status, pm.Name PaymentMode FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId inner join AppPaymentMode  pm on pm.Id = a.PaymentModeId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status, pm.Name PaymentMode FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join AppVendors c on c.id = a.ClientId inner join AppPaymentMode  pm on pm.Id = a.PaymentModeId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        //public async Task<IEnumerable<CV>> GetAllListbyDetails(string filter, string sorting, int offset, int fetch, bool forexport)
        //{
        //    string[] tokens = filter.Split('|');

        //    string tfilter = "", code = "", datefrom = "", dateto = "", client = "";
        //    //string tfilter = "", code = "", datefrom = "", dateto = "", statustypes = "", clientid = "", accountexecutive = "";
        //    if (tokens.Length > 0)
        //    {
        //        if (tokens[0].ToString() != "null")
        //        {
        //            tfilter = tokens[0];
        //        }
        //    }
        //    else
        //    {
        //        tfilter = filter;
        //    }
        //    //if (tokens.Length > 1)
        //    //{
        //    //    if (tokens[1].ToString() != "null")
        //    //    {
        //    //        code = tokens[1];
        //    //    }
        //    //}
        //    //if (tokens.Length > 2)
        //    //{
        //    //    if (tokens[1].ToString() != "null" && tokens[2].ToString() != "null")
        //    //    {
        //    //        datefrom = tokens[1];
        //    //        dateto = tokens[2];
        //    //    }
        //    //}
        //    //if (tokens.Length > 3)
        //    //{
        //    //    if (tokens[3].ToString() != "null")
        //    //    {
        //    //        client = tokens[3];
        //    //    }
        //    //}
        //    //if (tokens.Length > 5)
        //    //{
        //    //    if (tokens[5].ToString() != "null")
        //    //    {
        //    //        clientid = tokens[5];
        //    //    }
        //    //}
        //    //if (tokens.Length > 6)
        //    //{
        //    //    if (tokens[6].ToString() != "null")
        //    //    {
        //    //        accountexecutive = tokens[6];
        //    //    }
        //    //}

        //    string wc = " Where CV.isdeleted = 0 ";
        //    var dp = new DynamicParameters();

        //    if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
        //    {
        //        wc = wc + " And (CV.RequestId = @Filter) ";
        //        dp.Add("@Filter", "%" + tfilter + "%");
        //    }
        //    //if (code != null && code.Trim() != "" && code.Trim() != "null")
        //    //{
        //    //    wc = wc + " And RFP.requestCode = @code ";
        //    //    dp.Add("@code", code);
        //    //}
        //    //if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
        //    //{
        //    //    wc = wc + " And CV.TransactionTime between @datefrom and @dateto ";
        //    //    dp.Add("@datefrom", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
        //    //    dp.Add("@dateto", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
        //    //}
        //    //if (client != null && client.Trim() != "" && client.Trim() != "null")
        //    //{
        //    //    wc = wc + " And RFP.client = @clientid ";
        //    //    dp.Add("@clientid", client);
        //    //}
        //    //if (statustypes != null && statustypes.Trim() != "" && statustypes.Trim() != "null")
        //    //{
        //    //    statustypes = "'" + statustypes.Replace(",", "','") + "'";
        //    //    wc = wc + " And a.statusid  in (" + statustypes + ") ";
        //    //}

        //    //if (accountexecutive != null && accountexecutive.Trim() != "" && accountexecutive.Trim() != "null")
        //    //{
        //    //    wc = wc + " And r.id = @empid ";
        //    //    dp.Add("@empid", Convert.ToInt32(accountexecutive));
        //    //}

        //    string sort = "";
        //    if (sorting.Trim().Length > 0)
        //    {
        //        var firstWord = sorting.Split(' ').First();
        //        var lastWord = sorting.Split(' ').Last();
        //        var firstlupper = firstWord.First().ToString().ToUpper();
        //        var finalfield = firstlupper + firstWord.Substring(1);
        //        sort = " order by " + finalfield + " " + lastWord;
        //        //sort = " order by a.Projectname asc ";
        //    }
        //    else
        //    {
        //        sort = " order by CV.Id asc ";
        //    }
        //    try
        //    {
        //        if (!forexport)
        //        {
        //            var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appClients c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
        //            return getAll;
        //        }
        //        else
        //        {
        //            var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appClients c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV " + wc + sort, dp);
        //            return getAll;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new UserFriendlyException("Internal Error, " + ex.ToString());
        //    }
        //}

        public async Task<IEnumerable<CV>> GetAP(string filter, string sorting, int offset, int fetch, bool forexport)
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
            //if (tokens.Length > 1)
            //{
            //    if (tokens[1].ToString() != "null")
            //    {
            //        code = tokens[1];
            //    }
            //}
            if (tokens.Length > 2)
            {
                if (tokens[1].ToString() != "null" && tokens[2].ToString() != "null")
                {
                    datefrom = tokens[1];
                    dateto = tokens[2];
                }
            }
            //if (tokens.Length > 4)
            //{
            //    if (tokens[4].ToString() != "null")
            //    {
            //        client = tokens[4];
            //    }
            //}
            //if (tokens.Length > 5)
            //{
            //    if (tokens[5].ToString() != "null")
            //    {
            //        code = tokens[5];
            //    }
            //}
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

            string wc = " Where rfp.isdeleted = 0 and (rfp.GrandTotal - isnull(tmpap.Applied,0)) > 0 ";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And (rfp.Code like @Filter) or (c.Name like @Filter) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }
            //if (code != null && code.Trim() != "" && code.Trim() != "null")
            //{
            //    wc = wc + " And RFP.requestCode = @code ";
            //    dp.Add("@code", code);
            //}
            if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            {
                wc = wc + " And rfp.TransactionTime between @datefrom and @dateto ";
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
                sort = " order by rfp.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) Over() TotalRows,rfp.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit,(rfp.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppRFP rfp inner join AppClients c on c.Id = rfp.ClientId inner join AppStatusTypes st on st.Id = rfp.StatusId left outer join( select cv.StatusId, cv.RequestId, ReferenceId, cv.GrandTotal Applied from appCheckVoucher cv) tmpap on tmpap.ReferenceId = rfp.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) Over() TotalRows,rfp.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit, (rfp.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppRFP rfp inner join AppClients c on c.Id = rfp.ClientId inner join AppStatusTypes st on st.Id = rfp.StatusId left outer join( select cv.RequestId, ReferenceId, sum(cv.GrandTotal) Applied from appCheckVoucher cv group by  cv.RequestId, ReferenceId) tmpap on tmpap.ReferenceId = rfp.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //MARC AP fix 11182022
                    //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) Over() TotalRows,rfp.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit, (rfp.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppRFP rfp inner join AppVendors c on c.Id = rfp.ClientId inner join AppStatusTypes st on st.Id = rfp.StatusId left outer join( select cv.RequestId, ReferenceId, sum(cv.GrandTotal) Applied from appCheckVoucher cv group by  cv.RequestId, ReferenceId) tmpap on tmpap.ReferenceId = rfp.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) Over() TotalRows,rfp.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit, (rfp.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppRFP rfp inner join AppVendors c on c.Id = rfp.ClientId inner join AppStatusTypes st on st.Code = rfp.StatusId and st.TransactionCode = '110' left outer join( select cv.RequestId, ReferenceId, sum(cv.GrandTotal) Applied from appCheckVoucher cv group by  cv.RequestId, ReferenceId) tmpap on tmpap.ReferenceId = rfp.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    //MARC AP fix 11182022
                    //var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) Over() TotalRows,rfp.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit, (rfp.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppRFP rfp inner join AppVendors c on c.Id = rfp.ClientId inner join AppStatusTypes st on st.Id = rfp.StatusId left outer join( select cv.RequestId, ReferenceId, sum(cv.GrandTotal) Applied from appCheckVoucher cv group by  cv.RequestId, ReferenceId) tmpap on tmpap.ReferenceId = rfp.Id  " + wc + sort, dp);
                    var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) Over() TotalRows,rfp.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit, (rfp.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppRFP rfp inner join AppVendors c on c.Id = rfp.ClientId inner join AppStatusTypes st on st.Code = rfp.StatusId and st.TransactionCode = '110' left outer join( select cv.RequestId, ReferenceId, sum(cv.GrandTotal) Applied from appCheckVoucher cv group by  cv.RequestId, ReferenceId) tmpap on tmpap.ReferenceId = rfp.Id  " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<CV> GetByIdAsync(int id)
        {
            string wc = " Where a.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, a.*, b.Name Company, c.Name Client, ss.status from appCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appstatustypes ss on ss.code = a.Statusid and ss.TransactionCode = 111 inner join AppVendors c on a.ClientId = c.Id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        //public async Task<CV> GetByIdCVAsync(int id)
        //{
        //    string wc = " Where CV.RequestId = @Id ";

        //    var dp = new DynamicParameters();
        //    dp.Add("@Id", id);
        //    try
        //    {
        //        var getAll = await _repositoryDapper.QueryAsync<CV>("select count(*) over() Totalrows, CV.* FROM ( select a.*, b.Name company, c.Name Client, d.Status Status FROM AppCheckVoucher a inner join AppCompany b on a.CompanyId = b.Id inner join appClients c on c.id = a.ClientId left outer join appstatustypes d on d.code = a.Statusid and transactioncode = 111) CV   " + wc, dp);

        //        return getAll.FirstOrDefault();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new UserFriendlyException("Internal Error, " + ex.ToString());
        //    }
        //}

        public async Task<IdentityResult> UpdateAsync(CV entity)
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
