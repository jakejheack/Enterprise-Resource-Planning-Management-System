using ezinvmvc.App.Notification.DTO;
using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
    public class CreateDeliveryReceiptOutput
    {
        public DeliveryReceiptOutput DeliveryReceipt { get; set; }

        public GetNotificationOutput Notif { get; set; }
    }
}
