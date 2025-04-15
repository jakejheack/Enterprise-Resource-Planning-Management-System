using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace ezinvmvc.App.Stocks.DTO
{
    public class StockEntryOutput : FullAuditedEntity<int>
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

        public string Notes { get; set; }

        [NotMapped]
        public string EntryType { get; set; }
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
