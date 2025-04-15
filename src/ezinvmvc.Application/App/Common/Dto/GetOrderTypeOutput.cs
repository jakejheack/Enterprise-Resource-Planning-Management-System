using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetOrderTypeOutput : Entity<int>
    {
        public string Name { get; set; }
        
        public int CurrencyId { get; set; }
        
        public int ReceivableAccountId { get; set; }
        
        public int ReceivableAccountEntry { get; set; }
        
        public int SalesAccountId { get; set; }
        
        public int SalesAccountEntry { get; set; }
        
        public int SalesDiscountAccountId { get; set; }
        
        public int SalesDiscountAccountEntry { get; set; }
        
        public int SalesReturnAccountId { get; set; }
        
        public int SalesReturnAccountEntry { get; set; }
        
        public int TaxAccountId { get; set; }
        
        public int TaxAccountEntry { get; set; }
        
        public string Currency { get; set; }
    }
}
