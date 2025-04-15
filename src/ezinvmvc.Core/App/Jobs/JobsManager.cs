using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Jobs
{
    public class JobsManager : DomainService, IJobsManager
    {
        private readonly IRepository<Jobs> _repositoryJobs;
        private readonly IDapperRepository<Jobs> _repositoryJobssDapper;

        public JobsManager(IRepository<Jobs> repository, IDapperRepository<Jobs> repositoryDapper)
        {
            _repositoryJobs = repository;
            _repositoryJobssDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateJobsAsync(Jobs entity)
        {
            var result = _repositoryJobs.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryJobs.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteJobsAsync(int id)
        {
            var result = _repositoryJobs.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryJobs.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Jobs>> GetJobsAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string seachby = "0";
            string description = "0";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "0")
                {
                    seachby = tokens[0];
                }
                if (tokens[1].ToString() != "0")
                {
                    description = tokens[1];
                }
            }

            var dp = new DynamicParameters();
            string wc = " Where IsDeleted = '0' and status = 'Active' ";

            if (seachby == "JobTitle")
            {
                wc = wc + " And (JobTitle like @description) ";
                dp.Add("@description", "%" + description + "%");
            }
            if (seachby == "Department")
            {
                wc = wc + " And (Department like @description) ";
                dp.Add("@description", "%" + description + "%");
            }
            if (seachby == "Position")
            {
                wc = wc + " And (Position like @description) ";
                dp.Add("@description", "%" + description + "%");
            }
           
            string sort = " order by Creationtime desc ";
            try
            {
                IEnumerable<Jobs> getAll = await _repositoryJobssDapper.QueryAsync<Jobs>("select count(*) Over() AS TotalRows, * from AppJobs " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Jobs> GetJobsByIdAsync(int id)
        {
            var result = _repositoryJobs.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryJobs.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateJobsAsync(Jobs entity)
        {
            try
            {
                await _repositoryJobs.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Jobs>> UpdateJobsByIdAsync(int id)
        {
            string wc = " Where IsDeleted = 0 And (id = @Filter)";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", id);
            try
            {
                IEnumerable<Jobs> getAll = await _repositoryJobssDapper.QueryAsync<Jobs>("Update AppJobs set Status = 'InActive' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
