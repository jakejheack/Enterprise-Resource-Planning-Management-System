
using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Employees.Dto
{
    public class CreateEmployeeInput : FullAuditedEntity<int>
    {
        public string EmployeeCode { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string FirstName { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string MiddleName { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string LastName { get; set; }

        public string Gender { get; set; }

        public DateTime? BirthDate { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Address { get; set; }

        public string TelNo { get; set; }

        public string CellNo { get; set; }

        public string Email { get; set; }

        public string CivilStatus { get; set; }

        public string Remarks { get; set; }

        public string AccountId { get; set; }

        public string Photo { get; set; }

        public string UserImagePath { get; set; }

        public int StatusId { get; set; }

        [NotMapped]
        public string Status { get; set; }

        public bool IsAgent { get; set; }

        public int UserId { get; set; }

        public int ManagerId { get; set; }

        public int ExecId { get; set; }

        //Details

        public string Bank { get; set; }

        public string BankNo { get; set; }

        public string TIN { get; set; }

        public string SSS { get; set; }

        public string PhilHealthNo { get; set; }

        public string PagIbigNo { get; set; }

        public DateTime? HireDate { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public DateTime? ReleasedDate { get; set; }

        public DateTime? DateRegular { get; set; }

        public DateTime? DateResigned { get; set; }

        public DateTime? DateTerminated { get; set; }

        //CopmanyDetails

        public int CompanyId { get; set; }

        public int WarehouseId { get; set; }

        public int BranchId { get; set; }

        public int DepartmentId { get; set; }

        public int DivisionId { get; set; }

        public int SectorsId { get; set; }

        public int PositionId { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string CompleteName { get; set; }

        [NotMapped]
        public string Dept { get; set; }

        [NotMapped]
        public string Div { get; set; }

        [NotMapped]
        public string Sect { get; set; }

        [NotMapped]
        public string Post { get; set; }

        //Details
        public string Name { get; set; }

        public string Relation { get; set; }

        public string ContactNum { get; set; }

        public string Address2 { get; set; }

        //Fathers
        public string FathersName { get; set; }

        public string FathersAddress { get; set; }

        public string FathersContactNum { get; set; }

        //Mothers
        public string MothersName { get; set; }

        public string MothersAddress { get; set; }

        public string MothersContactNum { get; set; }

        //Spouse
        public string SpouseName { get; set; }

        public string SpouseAddress { get; set; }

        public string SpouseContactNum { get; set; }

        //Dependents
        public string D1Name { get; set; }

        public string D1Address { get; set; }

        public string D1Status { get; set; }

        public string D2Name { get; set; }

        public string D2Address { get; set; }

        public string D2Status { get; set; }

        public string D3Name { get; set; }

        public string D3Address { get; set; }

        public string D3Status { get; set; }

        public string D4Name { get; set; }

        public string D4Address { get; set; }

        public string D4Status { get; set; }

        //Attaintment

        public string Primary { get; set; }

        public DateTime? PrimaryDateGrad { get; set; }

        public string Secondary { get; set; }

        public DateTime? SecondaryDateGrad { get; set; }

        public string Course { get; set; }

        public DateTime? CourseDateGrad { get; set; }

        //Users with no employeeid
        [NotMapped]
        public long UserUserId { get; set; }

        [NotMapped]
        public string UserName { get; set; }

        [NotMapped]
        public string UserEmailAddress { get; set; }

        [NotMapped]
        public string UserFullName { get; set; }

        public decimal Quota { get; set; }

        public int EmptypeId { get; set; }

        public int EmpSalarytypeId { get; set; }

    }
}
