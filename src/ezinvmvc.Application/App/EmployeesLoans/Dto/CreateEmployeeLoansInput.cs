using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesLoans.Dto
{
    public class CreateEmployeeLoansInput : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        [Required]
        public int LoanTitle { get; set; }

        public string Status { get; set; }

        public string ApplicationNo { get; set; }

        public string ReceivedBy { get; set; }

        public DateTime? DateReceived { get; set; }

        public string SSSPHILHEALTHNo { get; set; }

        public string TINNo { get; set; }


        [Required]
        public int LoanType { get; set; }


        [Required]
        public int EmployersName { get; set; }

        public string EmployersIDNo { get; set; }

        public string PostalCode { get; set; }

        public string EmployersAddress { get; set; }

        [Required]
        public decimal? LoanAmount { get; set; }

        public DateTime? DateStart { get; set; }

        public DateTime? DateEnd { get; set; }

        public decimal? MonthlyAmortization { get; set; }

        public int DeductionType { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string fullName { get; set; }

        [NotMapped]
        public string Name { get; set; }

        [NotMapped]
        public string FirstName { get; set; }

        [NotMapped]
        public string MiddleName { get; set; }

        [NotMapped]
        public string LastName { get; set; }

        [NotMapped]
        public string Address { get; set; }
        
        [NotMapped]
        public string TIN { get; set; }

        [NotMapped]
        public string LoanTitleName { get; set; }

        [NotMapped]
        public string LoanTypeName { get; set; }
    }
}
