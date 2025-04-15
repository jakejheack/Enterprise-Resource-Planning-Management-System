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

namespace ezinvmvc.App.OvertimeRates
{
    public class OTRatesManager : DomainService, IOTRatesManager
    {
        private readonly IRepository<OTRates> _repositoryOTRates;
        private readonly IDapperRepository<OTRates> _repositoryOTRatesDapper;

        public OTRatesManager(IRepository<OTRates> repository, IDapperRepository<OTRates> repositoryDapper)
        {
            _repositoryOTRates = repository;
            _repositoryOTRatesDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateOTRateAsync(OTRates entity)
        {
            var result = _repositoryOTRates.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryOTRates.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteOTRateAsync(int id)
        {
            var result = _repositoryOTRates.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryOTRates.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<OTRates>> GetOTRatesAsync()
        {
            string wc = " Where IsDeleted = 0 ";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            try
            {
                IEnumerable<OTRates> getAll = await _repositoryOTRatesDapper.QueryAsync<OTRates>("select * from AppOTRates " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<OTRates> GetOTRateByIdAsync(int id)
        {
            string wc = " Where IsDeleted = 0 And (Id = @id) ";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@id", id);
            try
            {
                var getAll = await _repositoryOTRatesDapper.QueryAsync<OTRates>("select * from AppOTRates " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<OTRates>> GetPayrollOTList(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string comp = "";
            string dept = "";
            string attid = "";
            string empId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    comp = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dept = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    attid = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    empId = tokens[3].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();
            if (attid != "" && attid != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and Status5 = @attid ";
                }
                else
                {
                    wc = wc + " where Status5 = @attid ";
                }
                dp.Add("@attid", attid);
            }
            if (comp != "" && comp != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where c.Id = @comp ";
                }
                else
                {
                    wc = wc + " and c.Id = @comp ";
                }
                dp.Add("@comp", comp);
            }
            if (dept != "" && dept != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where d.name = @dept ";
                }
                else
                {
                    wc = wc + " and d.name = @dept ";
                }
                dp.Add("@dept", dept);
            }
            
            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where status4 = @empId ";
                }
                else
                {
                    wc = wc + " and status4 = @empId ";
                }
                dp.Add("@empId", empId);
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
                sort = " order by Status1,Status2,Status3 asc ";
            }

            try
            {
                IEnumerable<OTRates> getAll = await _repositoryOTRatesDapper.QueryAsync<OTRates>(" select count(*) Over() AS TotalRows, c.name as Status1,d.name as Status2,b.lastname +', '+b.FirstName as Status3, a.* from " 
                                    + " (SELECT empid as Status4, AttId as Status5, " 
                                    + " MAX(CASE WHEN Description = 'RR' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS Reguralstring, "
                                    + " MAX(CASE WHEN Description = 'RD' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS RestDaystring, "
                                    + " MAX(CASE WHEN Description = 'SH' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS SpecialHolidaystring, "
                                    + " MAX(CASE WHEN Description = 'LH' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS LegalHolidaystring, "
                                    + " MAX(CASE WHEN Description = 'SH RD' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS SpecialHolidayRestdaystring, "
                                    + " MAX(CASE WHEN Description = 'LH RD' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS LegalHolidayRestdaystring, "
                                    + " MAX(CASE WHEN Description = 'RG OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS ReguralOTstring, "
                                    + " MAX(CASE WHEN Description = 'RD OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS RestDayOTstring, "
                                    + " MAX(CASE WHEN Description = 'SH OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS SpecialHolidayOTstring, "
                                    + " MAX(CASE WHEN Description = 'LH OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS LegalHolidayOTstring, "
                                    + " MAX(CASE WHEN Description = 'SHRD OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS SpecialHolidayRestdayOTstring, "
                                    + " MAX(CASE WHEN Description = 'LHRD OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS LegalHolidayRestdayOTstring, "
                                    + " MAX(CASE WHEN Description = 'ND RG' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDReguralstring, "
                                    + " MAX(CASE WHEN Description = 'ND RD' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDRestDaystring, "
                                    + " MAX(CASE WHEN Description = 'ND SH' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDSpecialHolidaystring, "
                                    + " MAX(CASE WHEN Description = 'ND LH' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDLegalHolidaystring, "
                                    + " MAX(CASE WHEN Description = 'NDSH RD' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDSpecialHolidayRestdaystring, "
                                    + " MAX(CASE WHEN Description = 'NDLH RD' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDLegalHolidayRestdaystring, "
                                    + " MAX(CASE WHEN Description = 'NDRG OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDReguralOTstring, "
                                    + " MAX(CASE WHEN Description = 'NDRD OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDRestDayOTstring, "
                                    + " MAX(CASE WHEN Description = 'NDSH OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDSpecialHolidayOTstring, "
                                    + " MAX(CASE WHEN Description = 'NDLH OT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDLegalHolidayOTstring, "
                                    + " MAX(CASE WHEN Description = 'NDSH RDOT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDSpecialHolidayRestdayOTstring, "
                                    + " MAX(CASE WHEN Description = 'NDLH RDOT' THEN CAST(amount AS VARCHAR(10)) + ' | ' + Hour END) AS NDLegalHolidayRestdayOTstring "
                                    + " FROM AppPayrollOTDetails  where IsDeleted = 0  and status = 'Active' GROUP BY empid, AttId) as a " 
                                    + " inner join AppEmployee as b on a.Status4 = b.id " 
                                    + " inner join AppSectors as c on b.SectorsId = c.id " 
                                    + " inner join AppDepartment as d on b.DepartmentId = d.id " + wc + sort, dp);
                           return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
