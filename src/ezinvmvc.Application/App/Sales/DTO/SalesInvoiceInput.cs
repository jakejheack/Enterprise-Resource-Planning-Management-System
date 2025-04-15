using System;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class SalesInvoiceInput : FullAuditedEntity<int>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght8, ErrorMessage = ezinvmvcConsts.ErrorMessage8)]
        public string Prefix { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Code { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string ClientOrderNo { get; set; }

        [Required]
        public int SalesOrderId { get; set; }

        [Required]
        public int OrderTypeId { get; set; }

        [Required]
        public int SalesAgentId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
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

        [Required]
        public int TaxAccountId { get; set; }

        [Required]
        public int ReceivableAccountId { get; set; }

        [Required]
        public int CashAccountId { get; set; }
        
        public string OtherTerms { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght3072, ErrorMessage = ezinvmvcConsts.ErrorMessage3072)]
        public string LotDescription { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string TaxNo { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string BusinessStyle { get; set; }

        //MULTIPLE SI
        [Required]
        public decimal Percentage { get; set; }
        [Required]
        public decimal BillOtherDiscount { get; set; }
        [Required]
        public decimal BillOtherCharges { get; set; }
        [Required]
        public decimal BillTax { get; set; }
        [Required]
        public decimal BillNetTotal { get; set; }
        [Required]
        public decimal BillSubTotal { get; set; }
        [Required]
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
