using Abp.Application.Services.Dto;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.ContactPersons.Dto
{
    public class UpdateContactPersonInput : FullAuditedEntityDto<int?>
    {
        [Required]
        public string Reference { get; set; }

        [Required]
        public int ReferenceId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public DateTime Birthday { get; set; } = Convert.ToDateTime("01/01/1900 00:00:00");

        [Required]
        public string Position { get; set; }

        [Required]
        public string TelNo { get; set; }

        [Required]
        public string MobileNo { get; set; }

        [Required]
        [EmailAddress]
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
