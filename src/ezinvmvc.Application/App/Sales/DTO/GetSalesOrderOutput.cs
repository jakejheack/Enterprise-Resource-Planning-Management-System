using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Sales.DTO
{
    public class GetSalesOrderOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }
        
        public DateTime BatchDate { get; set; }

        public DateTime DeliveryTime { get; set; }

        public int ClientId { get; set; }

        public string ClientOrderNo { get; set; }

        public int QuotationId { get; set; }

        public int OrderTypeId { get; set; }

        public int PricingTypeId { get; set; }

        public int SalesAgentId { get; set; }

        public string ContactPerson { get; set; }

        public string ContactNo { get; set; }

        public string DeliveryAddress { get; set; }

        public string BillingAddress { get; set; }

        public string Notes { get; set; }

        public int StatusId { get; set; }

        public int TaxTypeId { get; set; }

        public int PaymentTermId { get; set; }

        public int DeliveryTypeId { get; set; }

        public string WarrantyTypeId { get; set; }
        
        public int DefaultSourceId { get; set; }

        public int DefaultDestinationId { get; set; }

        public decimal SubTotal { get; set; }

        public decimal OtherDiscount { get; set; }

        public decimal OtherCharges { get; set; }

        public decimal NetTotal { get; set; }

        public decimal TaxRate { get; set; }

        public decimal Tax { get; set; }

        public decimal GrandTotal { get; set; }

        public decimal TPC { get; set; }

        public int DeliveryStatusTime { get; set; }

        public string OtherTerms { get; set; }

        public DateTime Deadlines { get; set; }
        
        public int BillingStatusId { get; set; }

        //MARC FOR REVISION 03282024
        public int RevisionNo { get; set; }
        
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