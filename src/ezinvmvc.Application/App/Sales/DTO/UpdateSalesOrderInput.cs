using System.Collections.Generic;

namespace ezinvmvc.App.Sales.DTO
{
    public class UpdateSalesOrderInput
    {
        public SalesOrderInput salesorder { get; set; }
        public List<SalesOrderItemInput> salesorderitems { get; set; }
        public List<SalesOrderChargeInput> salesordercharges { get; set; }
    }
}
