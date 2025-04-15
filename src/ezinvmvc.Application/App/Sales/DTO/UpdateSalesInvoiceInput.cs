using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
    public class UpdateSalesInvoiceInput
    {
        public SalesInvoiceInput salesinvoice { get; set; }
        public List<SalesInvoiceItemInput> salesinvoiceitems { get; set; }
        public List<SalesInvoiceChargeInput> salesinvoicecharges { get; set; }
        public List<GeneralLedgerInput> generalledger { get; set; }
    }
}
