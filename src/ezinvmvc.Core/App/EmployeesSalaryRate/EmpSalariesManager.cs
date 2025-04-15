using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public class EmpSalariesManager : DomainService, IEmpSalariesManager
    {
        private readonly IRepository<EmpSalaries> _repository;
        private readonly IDapperRepository<EmpSalaries> _repositoryDapper;

        public EmpSalariesManager(IRepository<EmpSalaries> repository, IDapperRepository<EmpSalaries> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmpSalariesAsync(EmpSalaries entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repository.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmpSalariesAsync(int id)
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

        public async Task<EmpSalaries> GetEmpSalariesByIdAsync(int id)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @Filter) ";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<EmpSalaries>("Select top 1 * from appEmpSalaries " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpSalaries>> GetEmpSalariesAsync(string filter)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @Filter) ";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", filter);
            try
            {
                IEnumerable<EmpSalaries> getAll = await _repositoryDapper.QueryAsync<EmpSalaries>("select count(*) Over() AS TotalRows, * from appEmpSalaries " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateEmpSalariesAsync(EmpSalaries entity)
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

        public async Task<EmpSalaries> GetEmpSalIdAsync(int id)
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

        public async Task<IEnumerable<EmpSalaries>> GetOtListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    empid = tokens[4].ToString();
                }
            }
            string wc = " ";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and d.DateRecorded between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where d.DateRecorded between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and d.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where d.Department = @dept2 ";
                }
                dp.Add("@dept2", dept);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.attid = @Attid";
                    wc2 = wc2 + " where AttendanceId = @Attid";
                }
                else
                {
                    wc = wc + " and a.attid = @Attid ";
                    wc2 = wc2 + " where AttendanceId = @Attid";
                }
                dp.Add("@Attid", Attid);
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
                sort = " order by d.DateRecorded desc ";
            }

            try
            {
                IEnumerable<EmpSalaries> getAll = await _repositoryDapper.QueryAsync<EmpSalaries>(" select a.Empid,a.Attid as aYear,d.DateRecorded as StartDate,d.Department as Amonth,b.EmployeeCode as halfmonth,b.LastName + ' ' + b.FirstName + ' ' + b.MiddleName as aWeek,c.PayrollRatePerDay,a.Description as aDay,a.Rate as PayrollRatePerHour,a.Hour as Description,a.Amount as Undertime from AppPayrollOTDetails as a left outer join appemployee as b on a.empid = b.id left outer join (select * from appEmpSalaries where IsDeleted = '0') as c on a.empid = c.empid left outer join (select no, attendanceid, Department,DateRecorded from appAttendance2 "+ wc2 + " group by no, attendanceid, Department,DateRecorded) as d on b.EmployeeCode = d.no " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
