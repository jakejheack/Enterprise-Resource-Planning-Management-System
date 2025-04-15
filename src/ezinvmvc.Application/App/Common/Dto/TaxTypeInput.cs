using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Common.Dto
{
    public class TaxTypeInput : Entity<int>
    {
        [Required]
        public int Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        public decimal Rate { get; set; }

        [Required]
        //1 for vat 2 for ewt
        public int Type { get; set; }

        [Required]
        public int LiabilityAccountId { get; set; }

        [NotMapped]
        public string Accountname { get; set; }
    }
}
