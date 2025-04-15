using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesRecords.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public class EmployeeAttendanceManager : DomainService, IEmployeeAttendanceManager
    {
        private readonly IRepository<EmployeeAttendance> _repositoryEmployeeAttendance;
        private readonly IDapperRepository<EmployeeAttendance> _repositoryEmployeeAttendanceDapper;

        public EmployeeAttendanceManager(IRepository<EmployeeAttendance> repository, IDapperRepository<EmployeeAttendance> repositoryDapper)
        {
            _repositoryEmployeeAttendance = repository;
            _repositoryEmployeeAttendanceDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeeAttendanceAsync(EmployeeAttendance entity)
        {
            var result = _repositoryEmployeeAttendance.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeAttendance.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmployeeAttendancesAsync(int id)
        {
            var result = _repositoryEmployeeAttendance.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeAttendance.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<EmployeeAttendance>> GetAllEmployeeAttendanceAsync(string filter)
        {
            string[] tokens = filter.Split('|');            
            string dddatefrom = "";
            string dddateto = "";
            string ddstatus = "";
            string ddempid = "";

            
            if (tokens[0].ToString() != "null")
            {
                dddatefrom = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                dddateto = tokens[1].ToString();
            }
            if (tokens[2].ToString() != "null")
            {
                ddstatus = tokens[2].ToString();
            }
            if (tokens[3].ToString() != "null")
            {
                ddempid = tokens[3].ToString();
            }

            var dp = new DynamicParameters();
            string wc = " Where isdeleted = 0 ";
            //if (filter != null && filter.Trim() != "")
            //{
            //    wc = wc + " And (EmpId = @Filter) ";
            //}
            if (dddatefrom != "" && dddateto != "")
            {
                wc = wc + " and date between @dddatefrom and @dddateto ";
            }
            if (ddstatus != "")
            {
                wc = wc + " and status = @ddstatus ";
            }
            if (ddempid != "")
            {
                wc = wc + " and empid = @ddempid ";
            }
            dp.Add("@dddatefrom", dddatefrom);
            dp.Add("@dddateto", dddateto);
            dp.Add("@ddstatus", ddstatus);
            dp.Add("@ddempid", ddempid);

            try
            {
                IEnumerable<EmployeeAttendance> getAll = await _repositoryEmployeeAttendanceDapper.QueryAsync<EmployeeAttendance>("Select * from appEmployeeAttendance " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<EmployeeAttendance> GetEmployeeAttendanceByIdAsync(int id)
        {
            var result = _repositoryEmployeeAttendance.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryEmployeeAttendance.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateEmployeeAttendanceAsync(EmployeeAttendance entity)
        {
            try
            {
                await _repositoryEmployeeAttendance.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
