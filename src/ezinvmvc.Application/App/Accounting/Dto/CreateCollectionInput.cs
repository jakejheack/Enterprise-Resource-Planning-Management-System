using ezinvmvc.App.Sales.DTO;
using System.Collections.Generic;

namespace ezinvmvc.App.Accounting.Dto
{
    public class CreateCollectionInput
    {
        public CollectionInput collection { get; set; }
        public List<CollectionAppliedInput> collectionapplied { get; set; }
        public List<GeneralLedgerInput> generalledger { get; set; }
    }
}
