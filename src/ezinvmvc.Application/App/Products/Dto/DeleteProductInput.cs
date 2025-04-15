using Abp.Application.Services.Dto;

namespace ezinvmvc.App.Products.Dto
{
    public class DeleteProductInput : FullAuditedEntityDto<int>
    {
        public string Code { get; set; }

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
    }
}
