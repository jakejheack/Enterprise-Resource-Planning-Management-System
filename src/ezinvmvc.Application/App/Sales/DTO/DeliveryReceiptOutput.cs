using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
   public class DeliveryReceiptOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int ClientId { get; set; }

        public int SalesOrderId { get; set; }

        public int OrderTypeId { get; set; }

        public int PricingTypeId { get; set; }

        public int SalesAgentId { get; set; }

        public int DefaultSourceId { get; set; }

        public string ContactPerson { get; set; }

        public string ContactNo { get; set; }

        public string DeliveryAddress { get; set; }

        public string Notes { get; set; }

        public int StatusId { get; set; }

        public int TaxTypeId { get; set; }

        public int TransporterId { get; set; }

        public int TransportModeId { get; set; }

        public string TransportReceiptNo { get; set; }

        public DateTime TransportReceiptTime { get; set; }

        public int VehicleTypeId { get; set; }

        public string VehicleNo { get; set; }

        public string DriverName { get; set; }

        public int Distance { get; set; }

        public decimal SubTotal { get; set; }

        public decimal OtherDiscount { get; set; }

        public decimal OtherCharges { get; set; }

        public decimal NetTotal { get; set; }

        public decimal TaxRate { get; set; }

        public decimal Tax { get; set; }

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
