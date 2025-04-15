using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;


namespace ezinvmvc.App.Common.Dto
{
    public class UpdateCompanyInput : Entity<int>
    {
        public CompanyInput company { get; set; }
        //[Required]
        //[StringLength(ezinvmvcConsts.MaxLenght8, ErrorMessage = ezinvmvcConsts.ErrorMessage8)]
        //public string Abbr { get; set; }

        //[Required]
        //[StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        //public string Name { get; set; }

        //[StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        //public string Description { get; set; }

        //public bool IsDefault { get; set; }

        //[Required]
        //public int CurrencyId { get; set; }

        //[Required]
        //public int CashAccountId { get; set; }

        //[Required]
        //public int BankAccountId { get; set; }

        //[Required]
        //public int PayableAccountId { get; set; }

        //[Required]
        //public int ReceivableAccountId { get; set; }

        //[Required]
        //public int TaxAccountId { get; set; }

        //[Required]
        //public int DepositAccountId { get; set; }
    }
}
