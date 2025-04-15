
using System.Collections.Generic;

namespace ezinvmvc.App.Purchases.Dto
{
    public class GetOrderOutput
    {
        public OrderOutput Order { get; set; }
        public List<OrderItemOutput> OrderItems { get; set; }
    }
}
