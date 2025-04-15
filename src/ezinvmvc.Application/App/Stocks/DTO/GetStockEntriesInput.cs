using Abp.Runtime.Validation;
using ezinvmvc.Dto;

namespace ezinvmvc.App.Stocks.DTO
{
 public   class GetStockEntriesInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }
        public bool ForExport { get; set; } = false;

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "";
            }
            if (string.IsNullOrEmpty(Filter))
            {
                Filter = "";
            }
        }
    }
}
