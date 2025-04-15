using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Leads.Dto
{
    public class UpdateLeadTaskInput : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        public decimal Rate { get; set; } = Convert.ToDecimal("0.00");
    }
}
