
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Products
{
    public class ProductViewModel
    {
        public string FilterText { get; set; }
        public List<GetCategoryOutput> Categories { get; set; }
        public List<GetBrandOutput> Brands { get; set; }
        public List<GetUnitOutput> Units { get; set; }
        public List<GetCostingTypeOutput> CostingTypes { get; set; }
        public List<GetPricingTypeOutput> PricingTypes { get; set; }
    }
}
