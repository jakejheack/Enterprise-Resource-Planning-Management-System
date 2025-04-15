using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class GetQuotationOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int ClientId { get; set; }

        public int RequestId { get; set; }

        public string RequestCode { get; set; }

        public int OrderTypeId { get; set; }

        public int SalesAgentId { get; set; }

        public int ContactPersonId { get; set; }

        public string Notes { get; set; }

        public string TermsAndConditions { get; set; }

        public int StatusId { get; set; }

        public int TaxTypeId { get; set; }

        public int PaymentTermId { get; set; }

        public int DeliveryTypeId { get; set; }

        public string WarrantyTypeId { get; set; }

        public int RevisionNo { get; set; }

        public decimal SubTotal { get; set; }

        public decimal OtherDiscount { get; set; }

        public decimal OtherCharges { get; set; }

        public decimal NetTotal { get; set; }

        public decimal TaxRate { get; set; }

        public decimal Tax { get; set; }

        public decimal GrandTotal { get; set; }

        public decimal PackageCost { get; set; }

        public string OtherTerms { get; set; }

        public DateTime Deadlines { get; set; }

        public string Others { get; set; }

        //[NotMapped]
        //public string RequestCode { get; set; }
        [NotMapped]
        public string Client { get; set; }
        [NotMapped]
        public string Agent { get; set; }
        [NotMapped]
        public string AgentPosition { get; set; }
        [NotMapped]
        public string Manager { get; set; }
        [NotMapped]
        public string ManagerPosition { get; set; }
        [NotMapped]
        public string Status { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
