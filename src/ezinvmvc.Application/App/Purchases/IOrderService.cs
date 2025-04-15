using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Purchases.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Purchases
{
    public interface IOrderService : IApplicationService
    {
        Task<int> CreateOrder(CreateOrderInput orderinput);
        Task<GetOrderOutput> GetOrder(GetOrderInput input);
        Task<int> UpdateOrder(UpdateOrderInput input);
        Task<PagedResultDto<OrderOutput>> GetOrders(GetOrdersInput input);
        //Task DeleteVendor(DeleteOrderInput input);
    }
}
