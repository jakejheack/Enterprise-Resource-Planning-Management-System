using Abp.Domain.Entities;


namespace ezinvmvc.App.Common.Dto
{
  public  class DeleteCompanyInput:Entity<int>
    {
        public string Abbr { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string CompanyAddress { get; set; }

        public bool IsDefault { get; set; }

        public int CurrencyId { get; set; }

        public int CashAccountId { get; set; }

        public int BankAccountId { get; set; }

        public int PayableAccountId { get; set; }

        public int ReceivableAccountId { get; set; }

        public int TaxAccountId { get; set; }

        public int DepositAccountId { get; set; }
    }
}
