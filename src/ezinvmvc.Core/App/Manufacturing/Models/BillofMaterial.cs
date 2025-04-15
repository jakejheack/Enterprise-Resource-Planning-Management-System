using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Manufacturing
{
    [Table("AppBillofMaterials")]
    public class BillofMaterial : FullAuditedEntity<int>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght8, ErrorMessage = ezinvmvcConsts.ErrorMessage8)]
        public string Prefix { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Code { get; set; }

        [Required]
        public int RevisionNo { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Description { get; set; }

        [Required]
        public decimal Qty { get; set; }

        [Required]
        public int UnitId { get; set; }

        [Required]
        public decimal OperationCost { get; set; }

        [Required]
        public decimal MaterialCost { get; set; }

        [Required]
        public decimal ScrapCost { get; set; }

        [Required]
        public decimal TotalCost { get; set; }

    }
}
