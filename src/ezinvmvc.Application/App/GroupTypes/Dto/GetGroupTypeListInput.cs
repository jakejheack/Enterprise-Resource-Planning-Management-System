using Abp.Runtime.Validation;
using ezinvmvc.Dto;

namespace ezinvmvc.App.GroupTypes.Dto
{
    public class GetGroupTypeListInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

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
