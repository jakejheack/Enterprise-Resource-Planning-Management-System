using Abp.Runtime.Validation;
using ezinvmvc.Dto;

namespace ezinvmvc.App.Leads.Dto
{
    public class GetLeadUpdateListByLeadIdInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public int Filter { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "";
            }
            if (Filter == 0)
            {
                Filter = 0;
            }
        }
    }
}
