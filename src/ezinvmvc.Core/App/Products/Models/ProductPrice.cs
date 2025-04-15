using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Products
{
    [Table("AppProductPrice")]
    public class ProductPrice : FullAuditedEntity<int>
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int UnitId { get; set; }
        [Required]
        public decimal UnitPrice { get; set; }
        [Required]
        public int PricingTypeId { get; set; }

        [NotMapped]
        public string Unit { get; set; }
        [NotMapped]
        public string PricingType { get; set; }
    }
}
