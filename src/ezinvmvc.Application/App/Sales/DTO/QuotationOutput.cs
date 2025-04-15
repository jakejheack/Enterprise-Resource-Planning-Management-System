using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
   public class QuotationOutput : FullAuditedEntity<int>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        public string Prefix { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [Required]
        public string RequestCode { get; set; }

        [Required]
        public int OrderTypeId { get; set; }

        [Required]
        public int SalesAgentId { get; set; }

        [Required]
        public int ContactPersonId { get; set; }

        public string Notes { get; set; }

        public string TermsAndConditions { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int TaxTypeId { get; set; }

        [Required]
        public int PaymentTermId { get; set; }

        [Required]
        public int DeliveryTypeId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
        public string WarrantyTypeId { get; set; }

        [Required]
        public int RevisionNo { get; set; }

        [Required]
        public decimal SubTotal { get; set; }

        [Required]
        public decimal OtherDiscount { get; set; }

        [Required]
        public decimal OtherCharges { get; set; }

        [Required]
        public decimal NetTotal { get; set; }

        [Required]
        public decimal TaxRate { get; set; }

        [Required]
        public decimal Tax { get; set; }

        [Required]
        public decimal GrandTotal { get; set; }

        public decimal PackageCost { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght1024, ErrorMessage = ezinvmvcConsts.ErrorMessage1024)]
        public string OtherTerms { get; set; }

        public DateTime Deadlines { get; set; }

        public string Others { get; set; }

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
