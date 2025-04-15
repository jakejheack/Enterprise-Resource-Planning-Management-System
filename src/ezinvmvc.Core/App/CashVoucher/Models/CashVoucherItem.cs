using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.CashVoucher
{
    [Table("AppCashVoucherItem")]
    public class CashVoucherItem : FullAuditedEntity<int>
    {
        [Required]
        public int CashVoucherId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public decimal Debit { get; set; }

        [Required]
        public decimal Credit { get; set; }

        [Required]
        public int BaseTypeId { get; set; }

        [Required]
        public int Description { get; set; }

        [Required]
        public int CenterTypeId { get; set; }

        [Required]
        public int PartyId { get; set; }

        [Required]
        public string PartyCode { get; set; }

        [Required]
        public string PartyType { get; set; }

        [NotMapped]
        public string AccountName { get; set; }

        [NotMapped]
        public string Name { get; set; }
    }
}
