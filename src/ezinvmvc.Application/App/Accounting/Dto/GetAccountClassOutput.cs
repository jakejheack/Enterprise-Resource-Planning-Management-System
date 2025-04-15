using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Accounting.Dto
{
    public class GetAccountClassOutput : Entity<int>
    {
        public string Name { get; set; }

        public int Base { get; set; }
    }
}
