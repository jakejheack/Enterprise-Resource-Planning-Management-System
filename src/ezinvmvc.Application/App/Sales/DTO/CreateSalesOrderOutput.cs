using ezinvmvc.App.Notification.DTO;
using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
  public  class CreateSalesOrderOutput
    {
        public GetSalesOrderOutput SalesOrder { get; set; }

        public GetNotificationOutput Notif { get; set; }
    }
}
