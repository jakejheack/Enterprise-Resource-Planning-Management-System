using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Purchases.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Dto;


namespace ezinvmvc.App.Purchases
{
    [AbpAuthorize(PermissionNames.Pages_Purchase_Orders)]
    public class OrderService : ezinvmvcAppServiceBase, IOrderService
    {
        private readonly IOrderManager _orderManager;
        private readonly IOrderItemManager _orderItemManager;

        public OrderService(IOrderManager ordermanager, IOrderItemManager orderitemmanager)
        {
            _orderManager = ordermanager;
            _orderItemManager = orderitemmanager;
        }

        public async Task<int> CreateOrder(CreateOrderInput orderinput)
        {
            Order orderoutput = Mapper.Map<Order>(orderinput.OrderInputs);

            CheckErrors(await _orderManager.CreateAsync(orderoutput));

            foreach (OrderItemInput item in orderinput.OrderItemInputs)
            {
                item.OrderId = orderoutput.Id;
                OrderItem orderitemoutput = Mapper.Map<OrderItem>(item);
                CheckErrors(await _orderItemManager.CreateAsync(orderitemoutput));
            }
            await CurrentUnitOfWork.SaveChangesAsync();

            return orderoutput.Id;
        }

        public async Task<GetOrderOutput> GetOrder(GetOrderInput input)
        {
            var getorder = await _orderManager.GetByIdAsync(input.Id);
            var getorderitems = await _orderItemManager.GetByIdAsync(input.Id);

            var output = new GetOrderOutput
            {
                Order = Mapper.Map<OrderOutput>(getorder),
                OrderItems = Mapper.Map<List<OrderItemOutput>>(getorderitems)
            };
            return output;
        }

        public async Task<PagedResultDto<OrderOutput>> GetOrders(GetOrdersInput input)
        {
            var resultList = await _orderManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<OrderOutput>(listcount, ObjectMapper.Map<List<OrderOutput>>(resultList));
        }

        public async Task<int> UpdateOrder(UpdateOrderInput input)
        {
            Order orderoutput = Mapper.Map<Order>(input.OrderInputs);

            CheckErrors(await _orderManager.UpdateAsync(orderoutput));

            foreach (OrderItemInput item in input.OrderItemInputs)
            {
                OrderItem orderitemoutput = Mapper.Map<OrderItem>(item);
                if (item.Id > 0)
                {
                    CheckErrors(await _orderItemManager.UpdateAsync(orderitemoutput));
                }
                else
                {
                    CheckErrors(await _orderItemManager.CreateAsync(orderitemoutput));
                }
            }
            await CurrentUnitOfWork.SaveChangesAsync();

            return orderoutput.Id;
        }
    }
}
