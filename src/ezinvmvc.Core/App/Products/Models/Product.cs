using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Products
{
    [Table("AppProducts")]
    public class Product : FullAuditedEntity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght3072, ErrorMessage = ezinvmvcConsts.ErrorMessage3072)]
        public string Description { get; set; }

        public int CategoryId { get; set; }

        public int BrandId { get; set; }

        public int UnitId { get; set; }

        public int CostingTypeId { get; set; }

        public int AlertLevel { get; set; }

        public int VendorId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
        public string ImageName { get; set; }

        public int ExpenseAccountId { get; set; }

        public int IncomeAccountId { get; set; }

        public int InventoryAccountId { get; set; }

        [NotMapped]
        public string Category { get; set; }
        [NotMapped]
        public string Brand { get; set; }
        [NotMapped]
        public string Unit { get; set; }
        [NotMapped]
        public string CostingType { get; set; }
        [NotMapped]
        public string Vendor { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
