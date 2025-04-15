using Abp.Application.Services.Dto;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.ContactPersons.Dto
{
   public class GetContactPersonOutput : FullAuditedEntityDto<int>
    {
        public string Reference { get; set; }
        
        public int ReferenceId { get; set; }
        
        public string Title { get; set; }
        
        public string FirstName { get; set; }
        
        public string LastName { get; set; }

        public DateTime Birthday { get; set; }
        
        public string Position { get; set; }
        
        public string TelNo { get; set; }
        
        public string MobileNo { get; set; }
        
        public string Email { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string ReferenceCode { get; set; }

        [NotMapped]
        public string ReferenceName { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
