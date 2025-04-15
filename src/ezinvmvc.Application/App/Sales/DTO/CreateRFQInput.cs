
using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Sales.Dto;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class CreateRFQInput : FullAuditedEntity<int>
    {
        //public SalesOrderInput salesorder { get; set; }
        //public List<SalesOrderItemInput> salesorderitems { get; set; }

        public RFQInput rfq { get; set; }
        public List<RFQDetailsInput> rfqdetails { get; set; }
        public List<RFQOtherDetailsInput> rfqotherdetails { get; set; }

    }
}
