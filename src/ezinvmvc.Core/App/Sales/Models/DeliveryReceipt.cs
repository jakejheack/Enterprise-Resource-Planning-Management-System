using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales
{
    [Table("AppDeliveryReceipt")]
    public class DeliveryReceipt : FullAuditedEntity<int>
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

        [Required]
        public int SalesOrderId { get; set; }

        [Required]
        public int OrderTypeId { get; set; }

        [Required]
        public int PricingTypeId { get; set; }

        [Required]
        public int SalesAgentId { get; set; }

        [Required]
        public int DefaultSourceId { get; set; }

        [Required]
        public string ContactPerson { get; set; }

        [Required]
        public string ContactNo { get; set; }

        [Required]
        public string DeliveryAddress { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
        public string Notes { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int TaxTypeId { get; set; }

        //[Required]
        public int TransporterId { get; set; }

        //[Required]
        public int TransportModeId { get; set; }

        //[Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string TransportReceiptNo { get; set; }

        //[Required]
        public DateTime TransportReceiptTime { get; set; }

        //[Required]
        public int VehicleTypeId { get; set; }

        //[Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string VehicleNo { get; set; }

        //[Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string DriverName { get; set; }

        //[Required]
        public int Distance { get; set; }

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

        public string DrNumber { get; set; }

        [NotMapped]
        public string SalesOrderCode { get; set; }
        [NotMapped]
        public string Client { get; set; }
        [NotMapped]
        public string Agent { get; set; }
        [NotMapped]
        public string Status { get; set; }
        [NotMapped]
        public string ClientOrderNo { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
