using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Leads
{
    [Table("AppLeadTask")]
    public class LeadTask : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }

        [Required]
        public decimal Rate { get; set; } = Convert.ToDecimal("0.00");
    }
}
