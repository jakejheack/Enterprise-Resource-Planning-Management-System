using ezinvmvc.App.Addresses.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Addresses
{
    public class CityCreateModel
    {
        public CreateCityInput City { get; set; }
        public List<GetProvinceOutput> Provinces { get; set; }
        public List<GetCountryOutput> Countries { get; set; }
    }
}
