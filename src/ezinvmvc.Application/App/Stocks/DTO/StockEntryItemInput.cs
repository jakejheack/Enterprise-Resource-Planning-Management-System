using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Stocks.DTO
{
    public class StockEntryItemInput : FullAuditedEntity<int>
    {
        [Required]
        public int StockEntryId { get; set; }

        [Required]
        public int IndexNo { get; set; }

        [Required]
        public int ProductId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
        public string Description { get; set; }

        public decimal QtyRel { get; set; }

        [Required]
        public decimal Qty { get; set; }

        [Required]
        public int UnitId { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        [Required]
        public decimal Total { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string ProductName { get; set; }

        [NotMapped]
        public string ProductDescription { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public string ImageName { get; set; }
    }
}
