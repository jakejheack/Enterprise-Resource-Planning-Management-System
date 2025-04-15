using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesSalaryRate.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public class EmpLeavesManager : DomainService, IEmpLeavesManager
    {
        private readonly IRepository<EmpLeaves> _repository;
        private readonly IDapperRepository<EmpLeaves> _repositoryDapper;

        public EmpLeavesManager(IRepository<EmpLeaves> repository, IDapperRepository<EmpLeaves> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(EmpLeaves entity)
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

        public async Task<IEnumerable<EmpLeaves>> GetAllAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "";
            string LeaveId = "";


            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LeaveId = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if (EmpId != "")
            {
                wc = wc + "and empid = @EmpId and [Year] = year(GETDATE()) and IsDeleted = 0 ";
                wc2 = wc2 + " where a.empid = @EmpId and a.IsDeleted = 0 ";

                dp.Add("@EmpId", EmpId);
            }
            if (LeaveId != "")
            {
                wc = wc + " and LeaveId = @LeaveId ";

                dp.Add("@LeaveId", LeaveId);
            }


            string sort = "";
            try
            {
                IEnumerable<EmpLeaves> getAll = await _repositoryDapper.QueryAsync<EmpLeaves>(" select CONVERT(DECIMAL(10, 2), a.SLeave) + CONVERT(DECIMAL(10, 2), a.VLeave) as TotalLeave,isnull((CONVERT(DECIMAL(10, 2), a.SLeave) + CONVERT(DECIMAL(10, 2), a.VLeave)) - CONVERT(DECIMAL(10, 2), b.LeaveUse),TotalLeave) as RemLeave ,a.EmpId, datediff(year ,convert(datetime,c.HireDate),getdate()) as Status from appEmpSalaries as a "
                                                                                            + " left outer join(SELECT SUM(LeaveUse) as LeaveUse, EmpId,[Year] FROM AppPayroll " + wc + " and LeaveId in (1,2) group by EmpId,[Year]) as b on a.EmpId = b.EmpId left outer join appemployee as c on a.EmpId = c.id" + wc2 + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpLeaves>> GetIncentiveLeaveAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "";
            string LeaveId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LeaveId = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if (EmpId != "")
            {
                wc = wc + "and empid = @EmpId and [Year] = year(GETDATE()) and IsDeleted = 0 ";
                wc2 = wc2 + " where a.empid = @EmpId and a.IsDeleted = 0 ";

                dp.Add("@EmpId", EmpId);
            }
            if (LeaveId != "")
            {
                wc = wc + " and LeaveId = @LeaveId ";

                dp.Add("@LeaveId", LeaveId);
            }


            string sort = "";
            try
            {
                IEnumerable<EmpLeaves> getAll = await _repositoryDapper.QueryAsync<EmpLeaves>(" select CONVERT(DECIMAL(10, 2), a.SIL) as TotalLeaves,isnull(CONVERT(DECIMAL(10, 2), a.SIL) - CONVERT(DECIMAL(10, 2), b.LeaveUse),a.SIL) as RemLeave ,a.EmpId,b.LeaveId, datediff(year ,convert(datetime,c.HireDate),getdate()) as Status from appEmpSalaries as a "
                                                                                            + " left outer join(SELECT SUM(LeaveUse) as LeaveUse, EmpId, LeaveId,[Year] FROM AppPayroll " + wc + " group by EmpId, LeaveId,[Year]) as b on a.EmpId = b.EmpId left outer join appemployee as c on a.EmpId = c.id " + wc2 + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpLeaves>> GetPaternityLeaveAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "";
            string LeaveId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LeaveId = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if (EmpId != "")
            {
                wc = wc + "and empid = @EmpId and [Year] = year(GETDATE()) and IsDeleted = 0 ";
                wc2 = wc2 + " where a.empid = @EmpId and a.IsDeleted = 0 ";

                dp.Add("@EmpId", EmpId);
            }
            if (LeaveId != "")
            {
                wc = wc + " and LeaveId = @LeaveId ";

                dp.Add("@LeaveId", LeaveId);
            }


            string sort = "";
            try
            {
                IEnumerable<EmpLeaves> getAll = await _repositoryDapper.QueryAsync<EmpLeaves>(" select CONVERT(DECIMAL(10, 2), a.PL) as TotalLeaves,isnull(CONVERT(DECIMAL(10, 2), a.PL) - CONVERT(DECIMAL(10, 2), b.LeaveUse),a.PL) as RemLeave ,a.EmpId,b.LeaveId, datediff(year ,convert(datetime,c.HireDate),getdate()) as Status from appEmpSalaries as a "
                                                                                            + " left outer join(SELECT SUM(LeaveUse) as LeaveUse, EmpId, LeaveId,[Year] FROM AppPayroll " + wc + " group by EmpId, LeaveId,[Year]) as b on a.EmpId = b.EmpId left outer join appemployee as c on a.EmpId = c.id " + wc2 + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpLeaves>> GetSickLeaveAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "";
            string LeaveId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LeaveId = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if (EmpId != "")
            {
                wc = wc + "and empid = @EmpId and [Year] = year(GETDATE()) and IsDeleted = 0 ";
                wc2 = wc2 + " where a.empid = @EmpId and a.IsDeleted = 0 ";

                dp.Add("@EmpId", EmpId);
            }
            if (LeaveId != "")
            {
                wc = wc + " and LeaveId = @LeaveId ";

                dp.Add("@LeaveId", LeaveId);
            }


            string sort = "";
            try
            {
                IEnumerable<EmpLeaves> getAll = await _repositoryDapper.QueryAsync<EmpLeaves>(" select CONVERT(DECIMAL(10, 2), a.SLeave) as TotalLeaves,isnull(CONVERT(DECIMAL(10, 2), a.SLeave) - CONVERT(DECIMAL(10, 2), b.LeaveUse),a.SLeave) as RemLeave ,a.EmpId,b.LeaveId, datediff(year ,convert(datetime,c.HireDate),getdate()) as Status from appEmpSalaries as a "
                                                                                            + " left outer join(SELECT SUM(LeaveUse) as LeaveUse, EmpId, LeaveId,[Year] FROM AppPayroll " + wc + " group by EmpId, LeaveId,[Year]) as b on a.EmpId = b.EmpId left outer join appemployee as c on a.EmpId = c.id " + wc2 + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpLeaves>> GetVacationLeaveAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "";
            string LeaveId = "";


            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LeaveId = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if (EmpId != "")
            {
                wc = wc + "and empid = @EmpId and [Year] = year(GETDATE()) and IsDeleted = 0 ";
                wc2 = wc2 + " where a.empid = @EmpId and a.IsDeleted = 0 ";

                dp.Add("@EmpId", EmpId);
            }
            if (LeaveId != "")
            {
                wc = wc + " and LeaveId = @LeaveId ";

                dp.Add("@LeaveId", LeaveId);
            }


            string sort = "";
            try
            {
                IEnumerable<EmpLeaves> getAll = await _repositoryDapper.QueryAsync<EmpLeaves>(" select CONVERT(DECIMAL(10, 2), a.vLeave) as TotalLeaves,isnull(CONVERT(DECIMAL(10, 2), a.vLeave) - CONVERT(DECIMAL(10, 2), b.LeaveUse),a.vLeave) as RemLeave ,a.EmpId,b.LeaveId, datediff(year ,convert(datetime,c.HireDate),getdate()) as Status from appEmpSalaries as a "
                                                                                            + " left outer join(SELECT SUM(LeaveUse) as LeaveUse, EmpId, LeaveId,[Year] FROM AppPayroll " + wc + " group by EmpId, LeaveId,[Year]) as b on a.EmpId = b.EmpId left outer join appemployee as c on a.EmpId = c.id " + wc2 + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public Task<EmpLeaves> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> UpdateAsync(EmpLeaves entity)
        {
            throw new NotImplementedException();
        }
    }
}
