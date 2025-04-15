using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface ISalesOrderManager : IDomainService
    {
        Task<IEnumerable<SalesOrder>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<SalesOrder> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SalesOrder entity);
        Task<IdentityResult> UpdateAsync(SalesOrder entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<SalesOrder>> GetSalesOrderReportListAsync(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<SalesOrder>> UpdateTpcasync(string filter);
        Task<IEnumerable<SalesOrder>> UpdateQDiscountAync(string filter);
        Task<IEnumerable<SalesOrder>> GetSalesorderSummaryAgentId(string filter);
        Task<SalesOrder> GetSalesorderAgentDivision(int id);

        Task<IEnumerable<SalesOrder>> GetDashboardListAsync(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<SalesOrder>> GetAllRevisionList(string filter, string sorting);

    }
}
