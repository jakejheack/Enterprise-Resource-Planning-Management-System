using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.CheckVoucher.Dto
{
    public class CVDInput : FullAuditedEntity<int>
    {
        [Required]
        public int RequestId { get; set; }

        [Required]
        public int CollectionId { get; set; }

        [Required]
        public string CheckNumber { get; set; }

        [Required]
        public DateTime CheckDate { get; set; }

        [Required]
        public int SalesInvoiceId { get; set; }

        [Required]
        public DateTime AppliedTime { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public int AgainstAccountId { get; set; }

        [Required]
        public bool IsFullyPaid { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public string SalesInvoiceCode { get; set; }

        [NotMapped]
        public DateTime SalesInvoiceTime { get; set; }

        [NotMapped]
        public decimal SalesInvoiceTotal { get; set; }

        [NotMapped]
        public string Account { get; set; }
    }
}
