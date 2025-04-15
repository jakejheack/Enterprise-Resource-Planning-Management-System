using ezinvmvc.App.Products.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Products
{
    public class ProductUnitEditModel
    {
        public UpdateProductUnitInput ProductUnit { get; set; }
        public List<GetUnitOutput> Units { get; set; }
        public int DefaultUnitId { get; set; }
    }
}
