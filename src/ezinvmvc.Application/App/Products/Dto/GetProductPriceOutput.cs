using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Products.Dto
{
    public class GetProductPriceOutput : FullAuditedEntityDto<int>
    {
        public int ProductId { get; set; }
        public int UnitId { get; set; }
        public decimal UnitPrice { get; set; }
        public int PricingTypeId { get; set; }

        [NotMapped]
        public string Unit { get; set; }
        [NotMapped]
        public string PricingType { get; set; }
    }
}
