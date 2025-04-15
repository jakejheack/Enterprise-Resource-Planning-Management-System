using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class SalesOrderInput : FullAuditedEntity<int>
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
        public DateTime BatchDate { get; set; }

        [Required]
        public DateTime DeliveryTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        public string ClientOrderNo { get; set; }

        [Required]
        public int QuotationId { get; set; }

        [Required]
        public int OrderTypeId { get; set; }

        [Required]
        public int PricingTypeId { get; set; }

        [Required]
        public int SalesAgentId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string ContactPerson { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string ContactNo { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string DeliveryAddress { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string BillingAddress { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Notes { get; set; }

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
        public int DefaultSourceId { get; set; }

        public int DefaultDestinationId { get; set; }

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

        public decimal TPC { get; set; }

        public int DeliveryStatusTime { get; set; }

        public string OtherTerms { get; set; }

        public DateTime Deadlines { get; set; }

        [Required]
        public int BillingStatusId { get; set; }

        //MARC FOR REVISION 03282024
        [Required]
        public int RevisionNo { get; set; }

        [Required]
        public int StatusPreRevision { get; set; }

        public string RevisionReason { get; set; }
        //MARC FOR REVISION 03282024

        [NotMapped]
        public string SalesAgent { get; set; }
        [NotMapped]
        public string QuotationCode { get; set; }
        [NotMapped]
        public string Client { get; set; }
        [NotMapped]
        public string Status { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }

        //wilson
        [NotMapped]
        public string LCode { get; set; }
        [NotMapped]
        public DateTime aLastModificationTime { get; set; }
        [NotMapped]
        public string LName { get; set; }
        [NotMapped]
        public string LProject { get; set; }
        [NotMapped]
        public string LStatus { get; set; }

        [NotMapped]
        public string RCode { get; set; }
        [NotMapped]
        public DateTime RTime { get; set; }
        [NotMapped]
        public DateTime bLastModificationTime { get; set; }
        [NotMapped]
        public string RStatus { get; set; }
        [NotMapped]
        public string RLeadId { get; set; }

        [NotMapped]
        public string QCode { get; set; }
        [NotMapped]
        public DateTime QTime { get; set; }
        [NotMapped]
        public DateTime cLastModificationTime { get; set; }
        [NotMapped]
        public string QStatus { get; set; }
        [NotMapped]
        public string QReqId { get; set; }

        [NotMapped]
        public string SCode { get; set; }
        [NotMapped]
        public DateTime STime { get; set; }
        [NotMapped]
        public DateTime dLastModificationTime { get; set; }
        [NotMapped]
        public string SStatus { get; set; }
        [NotMapped]
        public string SQid { get; set; }

        [NotMapped]
        public string DCode { get; set; }
        [NotMapped]
        public DateTime DTime { get; set; }
        [NotMapped]
        public DateTime eLastModificationTime { get; set; }
        [NotMapped]
        public string DStatue { get; set; }
        [NotMapped]
        public string DSid { get; set; }

        [NotMapped]
        public string ICode { get; set; }
        [NotMapped]
        public DateTime ITime { get; set; }
        [NotMapped]
        public DateTime fLastModificationTime { get; set; }
        [NotMapped]
        public string IStatus { get; set; }
        [NotMapped]
        public string ISid { get; set; }

        //for SI
        [NotMapped]
        public decimal BillOtherDiscount { get; set; }
        [NotMapped]
        public decimal BillOtherCharges { get; set; }
        [NotMapped]
        public decimal BillTax { get; set; }
        [NotMapped]
        public decimal BillNetTotal { get; set; }
        [NotMapped]
        public decimal BillSubTotal { get; set; }
        [NotMapped]
        public decimal BillSubBalance { get; set; }
        [NotMapped]
        public decimal BillGrandTotal { get; set; }
        [NotMapped]
        public decimal BillGrandBalance { get; set; }
        [NotMapped]
        public string TaxNo { get; set; }
        [NotMapped]
        public string BusinessStyle { get; set; }

    }
}