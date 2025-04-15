using Abp.Runtime.Validation;
using ezinvmvc.Dto;
namespace ezinvmvc.App.Notification.DTO
{
    public class GetUserNotificationsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public bool ForExport { get; set; }

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
