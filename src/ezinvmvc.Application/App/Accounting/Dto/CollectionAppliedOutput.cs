using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting.Dto
{
  public  class CollectionAppliedOutput : FullAuditedEntity<int>
    {
        public int CollectionId { get; set; }

        public int SalesInvoiceId { get; set; }

        public DateTime AppliedTime { get; set; }

        public decimal Amount { get; set; }

        public int AgainstAccountId { get; set; }

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

        //Collection EWT
        public decimal EWTAmount { get; set; }
        public int EWTId { get; set; }
        public int EWTAccountId { get; set; }
        [NotMapped]
        public string EWT { get; set; }
        [NotMapped]
        public string EWTAccount { get; set; }

    }
}
