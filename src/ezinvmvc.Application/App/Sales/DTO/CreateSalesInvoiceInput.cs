using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
  public  class CreateSalesInvoiceInput
    {
        public SalesInvoiceInput salesinvoice { get; set; }
        public List<SalesInvoiceItemInput> salesinvoiceitems { get; set; }
        public List<SalesInvoiceChargeInput> salesinvoicecharges { get; set; }
    }
}
