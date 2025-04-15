using ezinvmvc.Roles.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Sales
{
    public class QuotationListViewModel
    {
        public string FilterText { get; set; }

        public int EmpId { get; set; }
    }
}
