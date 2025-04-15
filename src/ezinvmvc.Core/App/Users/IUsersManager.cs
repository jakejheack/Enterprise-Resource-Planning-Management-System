using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Users
{
    public interface IUsersManager : IDomainService
    {
        Task<Users> GetByIdAsync(int id);
        Task<IEnumerable<Users>> GetAllList(string filter, string sorting, int offset, int fetch);
    }
}
