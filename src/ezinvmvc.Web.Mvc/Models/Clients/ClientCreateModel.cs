using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Clients.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Clients
{
    public class ClientCreateModel
    {
        public CreateClientInput Client { get; set; }
        public List<GetCountryOutput> Countries { get; set; }
        public List<GetProvinceOutput> Provinces { get; set; }
        public List<GetCityOutput> Cities { get; set; }
        public List<GetIndustryOutput> Industries { get; set; }
        public int EmpId { get; set; }
    }
}
