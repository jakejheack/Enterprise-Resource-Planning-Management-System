using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.DTO
{
    public class DeleteRFQInput : FullAuditedEntityDto<int>
    {
        public int CompanyId { get; set; }

        public string Code { get; set; }
        
        public DateTime TransactionTime { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Type { get; set; }

        public int LeadId { get; set; }

        public string Lead { get; set; }

        public int ClientId { get; set; }

        public string Client { get; set; }

        public int ContactPersonId { get; set; }

        public string ContactPerson { get; set; }

        public string ProjectName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public string TelNo { get; set; }

        public string DeliveryAddress { get; set; }

        public string Remarks { get; set; }

        public string Vat { get; set; }

        public string Discount { get; set; }

        public int StatusId { get; set; }

        public int RevisionNo { get; set; }

        //public string IsRevise { get; set; }

        [NotMapped]
        public int Assignedid { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public string AssignedPerson { get; set; }

        [NotMapped]
        public int Astatus { get; set; }

        [NotMapped]
        public string AccountExecutive { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        public DateTime Deadlines { get; set; }

        public string Others { get; set; }

        [NotMapped]
        public string ClientName { get; set; }
    }
}
