using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Purchases
{
    class PurchaceOrder
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
        public DateTime DeliveryTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
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
        public int WarrantyTypeId { get; set; }

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
    }
}
