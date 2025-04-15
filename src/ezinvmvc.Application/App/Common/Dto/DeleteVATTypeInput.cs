using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Common.Dto
{
    public class DeleteVATTypeInput : Entity<int>
    {
        public string Code { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public decimal Rate { get; set; }
    }
}
