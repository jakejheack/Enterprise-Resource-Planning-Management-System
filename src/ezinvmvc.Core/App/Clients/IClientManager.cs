using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Clients
{
    public interface IClientManager : IDomainService
    {
        Task<IEnumerable<Client>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Client>> GetAllClientList();
        Task<Client> GetByIdAsync(int id);
        Task<Client> GetBillingAddressAsync(int id);
        Task<Client> GetSIBillingAddressAsync(int id);
        Task<IEnumerable<Client>> GetDetailsByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Client entity);
        Task<IdentityResult> UpdateAsync(Client entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
