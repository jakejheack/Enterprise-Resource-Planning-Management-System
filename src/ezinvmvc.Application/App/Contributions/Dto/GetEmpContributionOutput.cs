using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Contributions.Dto
{
    public class GetEmpContributionOutput : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }

        public bool SssCheck { get; set; }
        public int SSSType { get; set; }
        public int SSSCutOff { get; set; }
        public decimal SSSEE { get; set; }
        public decimal SSSER { get; set; }
        public decimal SSSEC { get; set; }

        public bool Pagibigcheck { get; set; }
        public int PagibigType { get; set; }
        public int PagibigCutOff { get; set; }
        public decimal PagibigEC { get; set; }
        public decimal PagibigER { get; set; }
        public decimal PagibigECC { get; set; }

        public bool PhilHealthcheck { get; set; }
        public int PhilHealthType { get; set; }
        public int PhilHealthCutOff { get; set; }
        public decimal PhilHealthEC { get; set; }
        public decimal PhilHealthER { get; set; }
        public decimal PhilHealthECC { get; set; }

        public bool WTaxcheck { get; set; }
        public int WTaxType { get; set; }
        public int WTaxCutOff { get; set; }
        public decimal WTaxEC { get; set; }
        public decimal WTaxER { get; set; }
        public decimal WTaxECC { get; set; }

        public int Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        //notused
        public string Description1 { get; set; }
        public string Description2 { get; set; }
        public string Description3 { get; set; }
        public string Description4 { get; set; }
        public string Description5 { get; set; }
        public decimal Rate1 { get; set; }
        public decimal Rate2 { get; set; }
        public decimal Rate3 { get; set; }
        public decimal Rate4 { get; set; }
        public decimal Rate5 { get; set; }
    }
}
