using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting.Dto
{
    public class CollectionOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int ClientId { get; set; }

        public int PaymentModeId { get; set; }

        public string ReferenceNo { get; set; }

        public decimal GrandTotal { get; set; }

        public int PaymentAccountId { get; set; }

        public int DepositAccountId { get; set; }

        public int ReferenceTypeId { get; set; }

        public int ReferenceId { get; set; }

        public int ReferenceCode { get; set; }

        public int StatusId { get; set; }

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
