using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Accounting.Dto
{
    public class AccountInput : FullAuditedEntityDto<int>
    {
        [Required]
        public int Node { get; set; }

        [Required]
        public int ParentNode { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }

        [Required]
        public int AccountClassId { get; set; }

        [Required]
        public int AccountTypeId { get; set; }

        [Required]
        public int AccountGroupId { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int IsChild { get; set; }

        [Required]
        public int IsActive { get; set; }
        //Not Mapped

        [NotMapped]
        public string AccountClass { get; set; }

        [NotMapped]
        public string AccountBase { get; set; }

        [NotMapped]
        public string AccountType { get; set; }

        [NotMapped]
        public string AccountGroup { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string CompanyAbbr { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public int tt_key { get; set; }

        [NotMapped]
        public int tt_parent { get; set; }
    }
}
