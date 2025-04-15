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

namespace ezinvmvc.App.CashVoucher
{
    public class CashVoucherManager : DomainService, ICashVoucherManager
    {
        private readonly IRepository<CashVoucher> _repository;
        private readonly IDapperRepository<CashVoucher> _repositoryDapper;

        public CashVoucherManager(IRepository<CashVoucher> repository, IDapperRepository<CashVoucher> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(CashVoucher entity)
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

        public async Task<IEnumerable<CashVoucher>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string tfilter = "", code = "", datefrom = "", dateto = "";
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
            //if (tokens.Length > 4)
            //{
            //    if (tokens[4].ToString() != "null")
            //    {
            //        statustypes = tokens[4];
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

            string wc = " Where a.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And (a.Code like @Filter) ";
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
            //if (statustypes != null && statustypes.Trim() != "" && statustypes.Trim() != "null")
            //{
            //    statustypes = "'" + statustypes.Replace(",", "','") + "'";
            //    wc = wc + " And a.statusid  in (" + statustypes + ") ";
            //}
            //if (clientid != null && clientid.Trim() != "" && clientid.Trim() != "null")
            //{
            //    wc = wc + " And a.ClientId = @clientid ";
            //    dp.Add("@clientid", clientid);
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
                sort = " order by a.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<CashVoucher>("select count(*) over() Totalrows, a.* FROM ( select je.*, st.Status, d.Name Company, Jei.debit Totaldebit, pt.Name from AppCashVoucher as je  inner join appstatustypes as st on st.Code = je.StatusId and st.TransactionCode = 112 inner join AppCompany as d on d.Id = je.CompanyId inner join (select CashVoucherId, sum(Debit) debit from AppCashVoucherItem group by CashVoucherId) as Jei on Jei.CashVoucherId = je.Id left outer join (select id, code , 'Clients' PartyType, Name from appclients as clients union select id, employeecode code, 'Employees' PatyType, Employee.FirstName +' ' + Employee.MiddleName+' ' + Employee.LastName  Name from AppEmployee as Employee union select id, '' code, 'Vendors' PartyType, Name from AppVendors as vendors) as pt on pt.Id = je.PartyId and je.PartyType = pt.PartyType) as a  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<CashVoucher>("select count(*) over() Totalrows, a.* FROM ( select je.*, st.Status, d.Name Company, Jei.debit Totaldebit, pt.Name from AppCashVoucher as je  inner join appstatustypes as st on st.Code = je.StatusId and st.TransactionCode = 112 inner join AppCompany as d on d.Id = je.CompanyId inner join (select CashVoucherId, sum(Debit) debit from AppCashVoucherItem group by CashVoucherId) as Jei on Jei.CashVoucherId = je.Id left outer join (select id, code , 'Clients' PartyType, Name from appclients as clients union select id, employeecode code, 'Employees' PatyType, Employee.FirstName +' ' + Employee.MiddleName+' ' + Employee.LastName  Name from AppEmployee as Employee union select id, '' code, 'Vendors' PartyType, Name from AppVendors as vendors) as pt on pt.Id = je.PartyId and je.PartyType = pt.PartyType) as a    " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<CashVoucher> GetByIdAsync(int id)
        {
            string wc = " Where a.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<CashVoucher>("select count(*) over() Totalrows, a.* FROM ( select je.*, st.Status, d.Name Company, Jei.debit Totaldebit, pt.Name from AppCashVoucher as je  inner join appstatustypes as st on st.Code = je.StatusId and st.TransactionCode = 112 inner join AppCompany as d on d.Id = je.CompanyId inner join (select CashVoucherId, sum(Debit) debit from AppCashVoucherItem group by CashVoucherId) as Jei on Jei.CashVoucherId = je.Id  left outer join (select id, code , 'Clients' PartyType, Name from appclients as clients union select id, employeecode code, 'Employees' PatyType, Employee.FirstName +' ' + Employee.MiddleName+' ' + Employee.LastName  Name from AppEmployee as Employee union select id, '' code, 'Vendors' PartyType, Name from AppVendors as vendors) as pt on pt.Id = je.PartyId and je.PartyType = pt.PartyType) as a " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(CashVoucher entity)
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
