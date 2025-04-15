using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting
{
    [Table("AppCollection")]
    public class Collection : FullAuditedEntity<int>
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
        public DateTime TransactionTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        public int PaymentModeId { get; set; }

        [Required]
        public string ReferenceNo { get; set; }

        [Required]
        public decimal GrandTotal { get; set; }

        [Required]
        public int PaymentAccountId { get; set; }

        [Required]
        public int DepositAccountId { get; set; }

        [Required]
        public int ReferenceTypeId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int ReferenceId { get; set; }

        [Required]
        public int ReferenceCode { get; set; }

        [NotMapped]
        public string PaymentMode { get; set; }

        [NotMapped]
        public string Client { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public decimal Allocated { get; set; }

        [NotMapped]
        public decimal Unallocated { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
