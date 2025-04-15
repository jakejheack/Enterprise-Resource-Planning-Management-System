using Abp.Domain.Services;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public  interface ITasksManager : IDomainService
    {
        Task<IEnumerable<Tasks>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        //Task<IEnumerable<Tasks>> GetAllListforTasks(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Tasks> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Tasks entity);
        Task<IdentityResult> UpdateAsync(Tasks entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<Tasks>> GetAllByParentIdAsync(int parentid);
    }
}
