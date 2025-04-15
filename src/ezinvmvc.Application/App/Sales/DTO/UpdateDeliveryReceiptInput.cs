using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
   public class UpdateDeliveryReceiptInput
    {
        public DeliveryReceiptInput deliveryreceipt { get; set; }
        public List<DeliveryReceiptItemInput> deliveryreceiptitem { get; set; }
        public List<DeliveryReceiptChargeInput> deliveryreceiptcharge { get; set; }
    }
}
