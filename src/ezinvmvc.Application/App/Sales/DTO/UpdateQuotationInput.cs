
using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
    public class UpdateQuotationInput
    {
        public QuotationInput quotation { get; set; }
        public List<QuotationItemInput> quotationitems { get; set; }
        public List<QuotationChargeInput> quotationcharges { get; set; }
    }
}
