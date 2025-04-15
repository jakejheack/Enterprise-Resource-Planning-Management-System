using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace ezinvmvc.App.Stocks.DTO
{
    public class GetStockEntryOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int EntryTypeId { get; set; }
        public int InventoryTypeId { get; set; }

        public int DefaultSourceId { get; set; } //Warehouse

        public int DefaultDestinationId { get; set; } //Warehouse

        public int StatusId { get; set; }

        //MARC 09/13/2021
        public string ContactPerson { get; set; }

        public string ContactNo { get; set; }

        public string DeliveryAddress { get; set; }

        public int TransporterId { get; set; }

        public int TransportModeId { get; set; }
        
        public string TransportReceiptNo { get; set; }

        public DateTime TransportReceiptTime { get; set; }

        public int VehicleTypeId { get; set; }
        
        public string VehicleNo { get; set; }
        
        public string DriverName { get; set; }

        public int Distance { get; set; }

        public string DrNumber { get; set; }
        //END

        public string Notes { get; set; }

        [NotMapped]
        public int EntryType { get; set; }
        [NotMapped]
        public string InventoryType { get; set; }
        [NotMapped]
        public string DefaultSource { get; set; }

        [NotMapped]
        public string DefaultDestination { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
