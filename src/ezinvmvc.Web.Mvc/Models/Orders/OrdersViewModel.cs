using Abp;
using Abp.Application.Services.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Orders
{
    public class OrdersViewModel
    {   public string FilterText { get; set; }
        public List<NameValue<string>> Status { get; set; }
    }
}
