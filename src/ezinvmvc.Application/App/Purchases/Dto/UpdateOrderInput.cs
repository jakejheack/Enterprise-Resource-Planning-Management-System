
using System.Collections.Generic;

namespace ezinvmvc.App.Purchases.Dto
{
    public class UpdateOrderInput
    {
        public OrderInput OrderInputs { get; set; }
        public List<OrderItemInput> OrderItemInputs { get; set; }
    }
}
