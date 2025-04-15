using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.ContactPersons
{
    [Table("AppContactPersons")]
    public class ContactPerson : FullAuditedEntity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Reference { get; set; }

        [Required]
        public int ReferenceId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Title { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string LastName { get; set; }

        public DateTime Birthday { get; set; } = Convert.ToDateTime("01/01/1900 00:00:00");
        
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Position { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string TelNo { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
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
