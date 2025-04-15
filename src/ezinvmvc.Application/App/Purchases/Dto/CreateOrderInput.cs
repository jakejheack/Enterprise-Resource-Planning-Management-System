using System;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace ezinvmvc.App.Purchases.Dto
{
    public class CreateOrderInput
    {
        public OrderInput OrderInputs { get; set; }
        public List<OrderItemInput> OrderItemInputs { get; set; }
    }
}
