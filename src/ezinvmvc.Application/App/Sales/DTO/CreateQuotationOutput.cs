
using ezinvmvc.App.Notification.DTO;
using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
    public  class CreateQuotationOutput
    {
        public QuotationOutput Quotation { get; set; }
        public GetNotificationOutput Notif { get; set; }
    }
}
