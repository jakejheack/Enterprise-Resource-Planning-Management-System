using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Accounting.Dto
{
    public class GetAccountTypeOutput : Entity<int>
    {
        public int Code { get; set; }

        public string Name { get; set; }
    }
}
