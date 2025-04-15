using ezinvmvc.App.Addresses.Dto;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.Web.Models.Addresses
{
    public class ProvinceCreateModel
    {
        public CreateProvinceInput Province { get; set; }

        public List<GetCountryOutput> Countries { get; set; }
    }
}
