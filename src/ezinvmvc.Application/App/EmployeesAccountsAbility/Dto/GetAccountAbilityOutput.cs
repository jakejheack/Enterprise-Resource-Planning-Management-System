using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesAccountsAbility.Dto
{
    public class GetAccountAbilityOutput : FullAuditedEntityDto<int>
    {
        public int EmpId { get; set; }

        public DateTime? DatePurchase { get; set; }

        public DateTime? DateIssue { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Particulars { get; set; }

        public decimal Qty { get; set; }

        public decimal Amount { get; set; }

        public string Status { get; set; }

        public DateTime? ReturnedDate { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
