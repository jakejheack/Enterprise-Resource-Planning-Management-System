using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Sales.DTO
{
   public class SalesInvoiceOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int ClientId { get; set; }

        public string ClientOrderNo { get; set; }

        public int SalesOrderId { get; set; }

        public int OrderTypeId { get; set; }

        public int SalesAgentId { get; set; }

        public string Notes { get; set; }

        public int StatusId { get; set; }

        public int TaxTypeId { get; set; }

        public int PaymentTermId { get; set; }

        public int DeliveryTypeId { get; set; }

        public string WarrantyTypeId { get; set; }

        public decimal SubTotal { get; set; }

        public decimal OtherDiscount { get; set; }

        public decimal OtherCharges { get; set; }

        public decimal NetTotal { get; set; }

        public decimal TaxRate { get; set; }

        public decimal Tax { get; set; }

        public decimal GrandTotal { get; set; }

        public int TaxAccountId { get; set; }

        public int ReceivableAccountId { get; set; }

        public int CashAccountId { get; set; }

        public string OtherTerms { get; set; }
        
        public string LotDescription { get; set; }
        
        public string TaxNo { get; set; }
        
        public string BusinessStyle { get; set; }

        //MULTIPLE SI
        public decimal Percentage { get; set; }

        public decimal BillOtherDiscount { get; set; }

        public decimal BillOtherCharges { get; set; }

        public decimal BillTax { get; set; }

        public decimal BillNetTotal { get; set; }

        public decimal BillSubTotal { get; set; }

        public decimal BillGrandTotal { get; set; }

        [NotMapped]
        public decimal BillDiscountBalance { get; set; }
        [NotMapped]
        public decimal BillChargesBalance { get; set; }
        [NotMapped]
        public decimal BillTaxBalance { get; set; }
        [NotMapped]
        public decimal BillNetBalance { get; set; }
        [NotMapped]
        public decimal BilledSubTotal { get; set; }
        [NotMapped]
        public decimal BillSubBalance { get; set; }
        [NotMapped]
        public decimal BilledGrandTotal { get; set; }
        [NotMapped]
        public decimal BillGrandBalance { get; set; }
        //[NotMapped]
        //public string TaxNo { get; set; }
        //[NotMapped]
        //public string BusinessStyle { get; set; }

        [NotMapped]
        public string SalesOrderCode { get; set; }
        [NotMapped]
        public string Client { get; set; }
        [NotMapped]
        public string Status { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
