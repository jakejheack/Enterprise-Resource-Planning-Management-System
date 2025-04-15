using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Products.Dto
{
    public class CreateProductInput : FullAuditedEntityDto<int>
    {
        [Required]
        public string Code { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public int BrandId { get; set; }

        public int UnitId { get; set; }

        public int CostingTypeId { get; set; }

        public int AlertLevel { get; set; }

        public string ImageName { get; set; }

        public int VendorId { get; set; }

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
