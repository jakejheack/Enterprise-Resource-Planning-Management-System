using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public class EmpPayrollManager : DomainService, IEmpPayrollManager
    {
        private readonly IRepository<EmpPayroll> _repository;
        private readonly IDapperRepository<EmpPayroll> _repositoryDapper;

        public EmpPayrollManager(IRepository<EmpPayroll> repository, IDapperRepository<EmpPayroll> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(EmpPayroll entity)
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

        public async Task<IdentityResult> DeleteEmpPayrollAsync(int id)
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

        public async Task<IdentityResult> UpdateEmpPayrollsAsync(EmpPayroll entity)
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

        public Task<IEnumerable<EmpPayroll>> GetEmpPayrollAsync(string filter)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<EmpPayroll>> GetEmp13thMonthPayAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string Year = "";
            string Comp = "";
            string EmpId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    Year = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    Comp = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    EmpId = tokens[2].ToString();
                }
            }

            string wc = " where a.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (Year != "")
            {
                wc = wc + " and Year = @Year ";
                dp.Add("@Year", Year);
            }
            if (Comp != "")
            {
                wc = wc + " and e.name = @Comp ";
                dp.Add("@Comp", Comp);
            }
            if (EmpId != "")
            {
                wc = wc + " and EmpId = @EmpId ";
                dp.Add("@EmpId", EmpId);
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
                sort = " order by AttId asc ";
            }
            try
            {
                IEnumerable<EmpPayroll> getAll = await _repositoryDapper.QueryAsync<EmpPayroll>(" Select d1.EmpId,d1.Company as PayrollMonthly,d1.EmployeeCode as status,d1.Name as AttId,d1.Description3 as PayrollPeriod ,d1.Year as Period, "
                                                + " max(case when d1.Description3 in (1)then Monthly end) BasicSalaryCurrent,"
                                                + " max(case when d1.Description3 in (2)then Monthly end) BasicSalaryAdjustment,"
                                                + " max(case when d1.Description3 in (3)then Monthly end) BasicSalaryAmount,"
                                                + " max(case when d1.Description3 in (4)then Monthly end) AbsensesCurrent, "
                                                + " max(case when d1.Description3 in (5)then Monthly end) AbsensesAdjustment,"
                                                + " max(case when d1.Description3 in (6)then Monthly end) AbsensesAmount,"
                                                + " max(case when d1.Description3 in (7)then Monthly end) TardinessAmount,"
                                                + " max(case when d1.Description3 in (8)then Monthly end) UndertimeAdjustment,"
                                                + " max(case when d1.Description3 in (9)then Monthly end) UndertimeAmount,"
                                                + " max(case when d1.Description3 in (10)then Monthly end) RGOTCurrent,"
                                                + " max(case when d1.Description3 in (11)then Monthly end) RGOTAdjustment,"
                                                + " max(case when d1.Description3 in (12)then Monthly end) RGOTAmount "
                                                + " from "
                                                + " (select  d.EmpId, d.EmployeeCode, d.Name,d.Company, d.Description3, d.Year, sum(gross) as Monthly "
                                                + " from( "
                                                + " select a.AttId, a.EmpId,c.EmployeeCode, c.LastName + ', ' + c.FirstName as Name,e.Name as Company, a.Description3, Year, CAST(GrossAmount AS DECIMAL(10, 2)) as GrossAmount, AbsensesAmount, LeaveTotalAmout, RGOTAmount, TardinessAmount, UndertimeAmount, isnull(b.AttAdjAmount, 0.00) as AttAdjAmount, AllowanceAdjs, GeneralAmount, NONGeneralAmount,"
                                                + " CAST(GrossAmount AS DECIMAL(10, 2)) - CAST(GeneralAmount AS DECIMAL(10, 2)) - CAST(AllowanceAdjs AS DECIMAL(10, 2)) - CAST(NONGeneralAmount AS DECIMAL(10, 2)) - isnull(b.AttAdjAmount, 0.00) as gross from AppPayroll as a with(nolock) "
                                                + " left outer join "
                                                + " (select sum(case when(CAST(AttAdjAmount AS DECIMAL(10, 2))) > 0 then CAST(AttAdjAmount AS DECIMAL(10, 2)) else CAST(AttAdjAmount AS DECIMAL(10, 2)) * -1  end) as AttAdjAmount, "
                                                + " EmpId, AttId from AppPayrollAttAdjustment where AdjType in (7, 8) group by EmpId, AttId) as b on b.EmpId = a.EmpId and b.AttId = a.AttId "
                                                + " left outer join  AppEmployee as c on a.EmpId = c.id  left outer join AppSectors as e on c.SectorsId = e.id" + wc + " ) as d group by d.EmpId,d.Company,EmployeeCode, d.Name, d.Description3, d.Year) as d1 group by d1.EmpId,d1.Company,d1.EmployeeCode, d1.Name, d1.Description3, d1.Year " + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
