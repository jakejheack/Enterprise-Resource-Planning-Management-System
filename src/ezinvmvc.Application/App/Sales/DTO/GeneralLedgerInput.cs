using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
   public class GeneralLedgerInput : FullAuditedEntity<int>
    {
        public int TransactionTypeId { get; set; }

        public int TransactionId { get; set; }

        public string TransactionCode { get; set; }

        public DateTime TransactionTime { get; set; }

        public int AccountId { get; set; }

        public decimal Debit { get; set; }

        public decimal Credit { get; set; }

        public int BaseTypeId { get; set; }

        public string Description { get; set; }

        public int CenterTypeId { get; set; }

        public int PartyId { get; set; }

        public int PartyCode { get; set; }

        public string PartyName { get; set; }

        public int ProjectId { get; set; }

        public int CompanyId { get; set; }

        [NotMapped]
        public string Account { get; set; }

        [NotMapped]
        public string BaseType { get; set; }

        [NotMapped]
        public string CenterType { get; set; }

        [NotMapped]
        public string PartyType { get; set; }

        [NotMapped]
        public string TransactionType { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public int tt_key { get; set; }

        [NotMapped]
        public int tt_parent { get; set; }
    }
}
