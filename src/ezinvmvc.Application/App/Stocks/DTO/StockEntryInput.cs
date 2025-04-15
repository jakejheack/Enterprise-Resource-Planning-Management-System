using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace ezinvmvc.App.Stocks.DTO
{
    public class StockEntryInput : FullAuditedEntity<int>
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
        public int EntryTypeId { get; set; }

        [Required]
        public int InventoryTypeId { get; set; }

        [Required]
        public int DefaultSourceId { get; set; } 

        [Required]
        public int DefaultDestinationId { get; set; }

        [Required]
        public int StatusId { get; set; }

        //MARC 09/13/2021
        public string ContactPerson { get; set; }

        public string ContactNo { get; set; }

        public string DeliveryAddress { get; set; }

        public int TransporterId { get; set; }

        public int TransportModeId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string TransportReceiptNo { get; set; }

        public DateTime TransportReceiptTime { get; set; }

        public int VehicleTypeId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string VehicleNo { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string DriverName { get; set; }

        public int Distance { get; set; }

        public string DrNumber { get; set; }
        //END

        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
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
