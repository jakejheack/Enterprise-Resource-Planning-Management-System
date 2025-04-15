using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Rfq
{
    public class RfqCreateModel
    {
        public CreateRFQInput RFQ { get; set; }
        public List<GetRFQOutput> RfqOuput { get; set; }
        public List<GetCountryOutput> Countries { get; set; }
        public int EmpId { get; set; }
    }
}
