using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Contribution;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Contribution
{
    public class EmpContributionManager : DomainService, IEmpContributionManager
    {
        private readonly IRepository<EmpContribution> _repository;
        private readonly IDapperRepository<EmpContribution> _repositoryDapper;

        public EmpContributionManager(IRepository<EmpContribution> repository, IDapperRepository<EmpContribution> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(EmpContribution entity)
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

        public async Task<IdentityResult> UpdateAsync(EmpContribution entity)
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

        public async Task<IEnumerable<EmpContribution>> GetAllAsync(string filter)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @empId) and a.status = 'Active'";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@empId", filter);
            try
            {
                IEnumerable<EmpContribution> getAll = await _repositoryDapper.QueryAsync<EmpContribution>("Select * from AppEmpContribution " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<EmpContribution> GetByIdAsync(int Id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == Id);
            if (result != null)
            {
                return await _repository.GetAsync(Id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<EmpContribution> GetDetailAsync(int empId)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @empId) and status = '1'";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@empId", empId);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<EmpContribution>("Select top 1 * from AppEmpContribution " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpContribution>> GetEmpContributionAsync(string filter)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @empId) ";
            string sort = " order by Id desc ";
            var dp = new DynamicParameters();
            dp.Add("@empId", filter);
            try
            {
                IEnumerable<EmpContribution> getAll = await _repositoryDapper.QueryAsync<EmpContribution>("select count(*) Over() AS TotalRows, * from AppEmpContribution " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpContribution>> GetPremiumDeductionListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string attid = "";
            string comp = "";
            string dept = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    comp = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }

            string wc = " where a.IsDeleted = 0 and a.Status = 1 ";
            var dp = new DynamicParameters();

            if (attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where a.AttId = @attid ";
                }
                else
                {
                    wc = wc + " and a.AttId = @attid ";
                }
                dp.Add("@attid", attid);
            }
            if (comp != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where d.id = @comp";
                }
                else
                {
                    wc = wc + " and d.id = @comp ";
                }
                dp.Add("@comp", comp);
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where e.id = @dept";
                }
                else
                {
                    wc = wc + " and e.id = @dept ";
                }
                dp.Add("@dept", dept);
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
                sort = " order by e.name, b.LastName ";
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<EmpContribution> getAll = await _repositoryDapper.QueryAsync<EmpContribution>(" select count(*) Over() AS TotalRows, b.Id as SSSType,d.name as Description4,a.attid as Description3,b.EmployeeCode as PagibigType ,b.LastName +', '+ b.FirstName as Description1,e.name as Description2,a.SSSERAmount as SSSER,a.SSSEEAmount as SSSEE,a.PhilhealthERAmount as PhilHealthER,a.PhilhealthEEAmount as PhilHealthEC,a.PagibigERAmount as PagibigER,a.PagibigEEAmount as PagibigEC,a.TaxHeld as WTaxEC from AppPayroll as a inner join Appemployee as b on a.Empid = b.id inner join (select distinct attendanceid from AppAttendance2 where IsDeleted = 0) as c on c.AttendanceId = a.AttId inner join AppSectors as d on b.SectorsId = d.id inner join AppDepartment as e on b.DepartmentId = e.id " + wc + sort, dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<EmpContribution> getAll = await _repositoryDapper.QueryAsync<EmpContribution>(" select count(*) Over() AS TotalRows, b.Id as SSSType,d.name as Description4,a.attid as Description3,b.EmployeeCode as PagibigType ,b.LastName +', '+ b.FirstName as Description1,e.name as Description2,a.SSSERAmount as SSSER,a.SSSEEAmount as SSSEE,a.PhilhealthERAmount as PhilHealthER,a.PhilhealthEEAmount as PhilHealthEC,a.PagibigERAmount as PagibigER,a.PagibigEEAmount as PagibigEC,a.TaxHeld as WTaxEC from AppPayroll as a inner join Appemployee as b on a.Empid = b.id inner join (select distinct attendanceid from AppAttendance2 where IsDeleted = 0) as c on c.AttendanceId = a.AttId inner join AppSectors as d on b.SectorsId = d.id inner join AppDepartment as e on b.DepartmentId = e.id " + wc + sort, dp);
                    return getAll;
                }

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
