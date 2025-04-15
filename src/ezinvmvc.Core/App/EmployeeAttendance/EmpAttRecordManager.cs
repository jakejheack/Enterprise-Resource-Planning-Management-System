using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.EmployeeAttendance
{
    public class EmpAttRecordManager : DomainService, IEmpAttRecordManager
    {
        private readonly IRepository<EmpAttRecord> _repository;
        private readonly IDapperRepository<EmpAttRecord> _repositoryDapper;

        public EmpAttRecordManager(IRepository<EmpAttRecord> repository, IDapperRepository<EmpAttRecord> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(EmpAttRecord entity)
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

        public async Task<IdentityResult> DeleteEmpAttIdAsync(int id)
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

        public async Task<IEnumerable<EmpAttRecord>> GetEmpAttIdAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "0";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "0")
                {
                    EmpId = tokens[0];
                }
            }

            var dp = new DynamicParameters();
            string wc = " Where IsDeleted = '0'  and status = 'Active' ";

            if (EmpId != "0")
            {
                wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", "0");
            }

            string sort = " order by date desc ";
            try
            {
                IEnumerable<EmpAttRecord> getAll = await _repositoryDapper.QueryAsync<EmpAttRecord>("select count(*) Over() AS TotalRows, * from AppEmployeeAttRecord " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecord>> GetEmpAttAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string AttId = "0";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "0")
                {
                    AttId = tokens[0];
                }
            }

            var dp = new DynamicParameters();
            string wc = " Where a.IsDeleted = '0'  and a.status = 'Active' ";

            if (AttId != "0")
            {
                wc = wc + " And (a.AttId = @AttId) ";
                dp.Add("@AttId", AttId);
            }
            else
            {
                wc = wc + " And (a.AttId = @AttId) ";
                dp.Add("@AttId", "0");
            }

            string sort = " order by CompleteName asc ";
            try
            {
                IEnumerable<EmpAttRecord> getAll = await _repositoryDapper.QueryAsync<EmpAttRecord>("select count(*) Over() AS TotalRows, a.*,b.FirstName + ' '+b.MiddleName +' '+ LastName as CompleteName from AppEmployeeAttRecord as a with (nolock) inner join AppEmployee as b with (nolock) on a.EmpId = b.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
