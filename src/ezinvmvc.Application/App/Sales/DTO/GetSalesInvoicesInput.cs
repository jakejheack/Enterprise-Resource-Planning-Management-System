using Abp.Runtime.Validation;
using ezinvmvc.Dto;

namespace ezinvmvc.App.Sales.DTO
{
    public class GetSalesInvoicesInput : PagedAndSortedInputDto, IShouldNormalize
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