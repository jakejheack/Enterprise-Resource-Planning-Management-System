using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Manufacturing
{
    [Table("AppBillofMaterialItems")]
    public class BillofMaterialItems : FullAuditedEntity<int>
    {
        [Required]
        public int BoMId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Description { get; set; }

        [Required]
        public decimal MaterialQty { get; set; }

        [Required]
        public int MaterialUnitId { get; set; }

        [Required]
        public decimal MaterialCost { get; set; }

        [Required]
        public decimal Total { get; set; }
    }
}
