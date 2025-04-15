using Abp.Domain.Entities.Auditing;
using System;


namespace ezinvmvc.App.Sales.DTO
{
   public class AccountsReceivableOutput : FullAuditedEntity<int>
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

        public decimal Paid { get; set; }

        public decimal Credit { get; set; }

        public decimal Balance { get; set; }

        public int TaxAccountId { get; set; }

        public int ReceivableAccountId { get; set; }

        public int CashAccountId { get; set; }

        public string Client { get; set; }

        public string Status { get; set; }

        public int TotalRows { get; set; }

        //MULTIPLE SI
        public decimal BillDiscountBalance { get; set; }

        public decimal BillChargesBalance { get; set; }

        public decimal BillTaxBalance { get; set; }

        public decimal BillNetBalance { get; set; }

        public decimal BillSubTotal { get; set; }

        public decimal BillSubBalance { get; set; }

        public decimal BillGrandTotal { get; set; }

        public decimal BillGrandBalance { get; set; }

        public string TaxNo { get; set; }

        public string BusinessStyle { get; set; }

        //COLLECTION EDIT
        public int CollectionId { get; set; }

        public int CollectionAppliedId { get; set; }

        public decimal CollectionAmount { get; set; }

        public decimal CollectionEWTAmount { get; set; }

        public int CollectionEWTId { get; set; }

        public int CollectionEWTAccountId { get; set; }
    }
}
