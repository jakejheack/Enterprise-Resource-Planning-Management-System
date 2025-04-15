using Abp.Application.Navigation;
using Abp.Localization;
using ezinvmvc.Authorization;

namespace ezinvmvc.Web.Startup
{
    /// <summary>
    /// This class defines menus for the application.
    /// </summary>
    public class ezinvmvcNavigationProvider : NavigationProvider
    {
        public override void SetNavigation(INavigationProviderContext context)
        {
            context.Manager.MainMenu
                .AddItem
                (
                    new MenuItemDefinition(
                        "Purchases",
                        L("Purchases"),
                        icon: "cart-plus")
                          .AddItem
                    (
                        new MenuItemDefinition(
                        "Orders",
                        new FixedLocalizableString("Orders"),
                        url: "Orders",
                        icon: "truck",
                        requiredPermissionName: PermissionNames.Pages_Purchase_Orders)
                    )
                )
                .AddItem
                (
                    new MenuItemDefinition(
                        "CRM",
                        new FixedLocalizableString("CRM"),
                        icon: "users")
                        .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Leads,
                        L("Leads"),
                        url: "Leads",
                        icon: "users",
                        requiredPermissionName: PermissionNames.CRM_Leads)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.RFQ,
                        new FixedLocalizableString("RFQ"),
                        url: "RFQ",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Rfq
                        )
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Quotations"),
                        url: "Quotations",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Quotations)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Assignment,
                        new FixedLocalizableString("Assignment List"),
                        url: "Assignment",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Assignment
                        )
                    )
                )
                .AddItem
                (
                    new MenuItemDefinition(
                        "Sales",
                        L("Sales"),
                        icon: "tags")
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Sales_Orders,
                        new FixedLocalizableString("Orders"),
                        url: "SalesOrders",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Sales_Orders)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Sales_Orders,
                        new FixedLocalizableString("Delivery Receipts"),
                        url: "DeliveryReceipt",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Delivery_Receipt)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Sales_Invoice,
                        new FixedLocalizableString("Invoices"),
                        url: "SalesInvoice",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Sales_Invoice)
                    )

                )
                 .AddItem
                (
                    new MenuItemDefinition(
                        "Accounting",
                         new FixedLocalizableString("Accounting"),
                        icon: "money")
                         .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Collections,
                        new FixedLocalizableString("Collections"),
                        url: "Collections",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Collections)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Journal Entry"),
                        url: "JournalEntry",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Journal_Entry)
                    ).AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Accounts_Receivable,
                        new FixedLocalizableString("Receivables"),
                        url: "AccountsReceivable",
                        icon: "book",
                        requiredPermissionName: PermissionNames.Pages_Accounts_Receivable)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.General_Ledger,
                        new FixedLocalizableString("General Ledger"),
                        url: "GeneralLedger",
                        icon: "book",
                        requiredPermissionName: PermissionNames.Pages_General_Ledger)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.General_Ledger,
                        new FixedLocalizableString("Trial Balance"),
                        url: "TrialBalance",
                        icon: "book",
                        requiredPermissionName: PermissionNames.Pages_General_Ledger)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Request For Payment"),
                        url: "RFP",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Rfp)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Check Voucher"),
                        url: "CV",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Cv)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Cash Voucher"),
                        url: "CashVoucher",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_CashVoucher)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Payables"),
                        url: "AccountPayable",
                        icon: "file-text-o",
                        requiredPermissionName: PermissionNames.Pages_Accounts_Payable)
                    )

                )
                .AddItem
                (
                    new MenuItemDefinition(
                        "Stocks",
                        L("Stocks"),
                        icon: "cubes")
                    .AddItem
                    (
                            new MenuItemDefinition(
                            PageNames.Roles,
                            new FixedLocalizableString("Stock Entry"),
                            url: "StockEntry",
                            icon: "paper-plane-o",
                            requiredPermissionName: PermissionNames.Pages_Stock_Entry)
                    )
                     .AddItem
                    (
                            new MenuItemDefinition(
                            PageNames.Stock_Card,
                            new FixedLocalizableString("Stock Card"),
                            url: "StockCard",
                            icon: "bar-chart-o",
                            requiredPermissionName: PermissionNames.Pages_Stock_Card)
                    )
                      .AddItem
                    (
                            new MenuItemDefinition(
                            PageNames.Stock_Summary,
                            new FixedLocalizableString("Stock Summary"),
                            url: "StockSummary",
                            icon: "bar-chart-o",
                            requiredPermissionName: PermissionNames.Pages_Stock_Summary)
                    )
                )
                //.AddItem
                //(
                //    new MenuItemDefinition("Recruitment", new FixedLocalizableString("Recruitment"), icon: "male")
                //    .AddItem
                //    (
                //        new MenuItemDefinition(
                //        PageNames.Roles,
                //        new FixedLocalizableString("Job Description"),
                //        url: "JobDescription",
                //        icon: "male",
                //        requiredPermissionName: PermissionNames.Pages_JobDescription)
                //    )
                //    .AddItem
                //    (
                //        new MenuItemDefinition(
                //        PageNames.Roles,
                //        new FixedLocalizableString("Interview"),
                //        url: "Recruitment",
                //        icon: "male",
                //        requiredPermissionName: PermissionNames.Pages_EmployeeApp)
                //    )
                //    .AddItem
                //    (
                //        new MenuItemDefinition(
                //        PageNames.Roles,
                //        new FixedLocalizableString("Examination"),
                //        url: "Recruitment",
                //        icon: "male",
                //        requiredPermissionName: PermissionNames.Pages_EmployeeApp)
                //    )
                //    .AddItem
                //    (
                //        new MenuItemDefinition(
                //        PageNames.Roles,
                //        new FixedLocalizableString("Applicant Tracker"),
                //        url: "Recruitment",
                //        icon: "male",
                //        requiredPermissionName: PermissionNames.Pages_EmployeeApp)
                //    )
                //    .AddItem
                //    (
                //        new MenuItemDefinition(
                //        PageNames.Roles,
                //        new FixedLocalizableString("Evaluation"),
                //        url: "Recruitment",
                //        icon: "male",
                //        requiredPermissionName: PermissionNames.Pages_EmployeeApp)
                //    )
                //)

                .AddItem
                (
                    new MenuItemDefinition(
                        "Human Resource",
                        new FixedLocalizableString("Human Resource"),
                        icon: "user")
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Employees"),
                        url: "Employees",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Master_Employees)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Accountability"),
                        url: "EmployeesAccountsAbility",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Accounts_Ability)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Employee Records"),
                        url: "EmployeeRecords",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Employee_Records)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Employee Rates"),
                        url: "EmployeePayrollRate",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Employee_Salary_Rates)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Payroll Rate"),
                        url: "EmployeePayrollRate/PayrollRate",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Payroll_Rate)
                    )
                    
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Allowances"),
                        url: "EmployeeAllowance",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Employee_Allowance)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("OT Rates"),
                        url: "EmployeeOTRates",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Employee_OTRates)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Employee Loan"),
                        url: "EmployeeLoans",
                        icon: "fa fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Employee_Loan)
                    )
                )
                .AddItem
                (
                    new MenuItemDefinition(
                        "Timekeeping",
                        new FixedLocalizableString("Timekeeping"),
                        icon: "clock-o")
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Attendance"),
                        url: "Attendance/Index2",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Attendance2)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Adjustment"),
                        url: "EmployeeBioAtt/Adjustment",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Adjustment)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Emp Attendance"),
                        url: "EmployeeBioAtt",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_EmpAttendance)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Att Approver"),
                        url: "EmpAttApprover",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_AttendanceApprover)
                    )
                )
                .AddItem
                (
                    new MenuItemDefinition(
                        "Payroll",
                        new FixedLocalizableString("Payroll"),
                        icon: "calendar-o")
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Payroll"),
                        url: "Payroll",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Pages_Payroll)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PayrollEntry,
                        new FixedLocalizableString("Payroll Entry"),
                        url: "Payroll/Payroll",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Payroll_Entry)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PayrollReport,
                        new FixedLocalizableString("Payroll Report"),
                        url: "Payroll/PayrollReport",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Payroll_Report)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PayrollReport,
                        new FixedLocalizableString("Payroll Acknowledge"),
                        url: "Payroll/PayrollAkcnowledgement",
                        icon: "fa-puzzle-piece",
                        requiredPermissionName: PermissionNames.Payroll_Akcnowledgement)
                    )
                )
                .AddItem
                (
                    new MenuItemDefinition(
                    "Reports",
                    L("Reports"),
                    icon: "bar-chart-o")

                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.EmployeeMasterListReport,
                        new FixedLocalizableString("Employee MasterList"),
                        url: "Reports/EmployeeMasterListReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.EmployeeMasterListReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.RateMasterListReport,
                        new FixedLocalizableString("Rate MasterList"),
                        url: "Reports/RateMasterListReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.RateMasterListReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PayrollJournalDetails,
                        new FixedLocalizableString("Payroll Journal"),
                        url: "Reports/PayrollJournalDetails",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.PayrollJournalDetails)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.AttAdjReport,
                        new FixedLocalizableString("Att Adj Report"),
                        url: "Reports/AttAdjReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.AttAdjReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PRSummaryReport,
                        new FixedLocalizableString("Payroll Contribution Report"),
                        url: "Reports/PRSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.PRSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PayrollDetailReport,
                        new FixedLocalizableString("Payroll Detail Report"),
                        url: "Reports/PayrollDetailReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.PayrollDetailReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PRSummaryReport,
                        new FixedLocalizableString("SSS Summary"),
                        url: "Reports/SSSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.SSSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PhltSummaryReport,
                        new FixedLocalizableString("PhilHealth Summary"),
                        url: "Reports/PhltSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.PhltSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PgbSummaryReport,
                        new FixedLocalizableString("PagIbig Summary"),
                        url: "Reports/PgbSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.PgbSummaryReport)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.PremiumDeductionReport,
                        new FixedLocalizableString("Premium Deduction"),
                        url: "Reports/PremiumDeductionReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.PremiumDeductionReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.OTAdjSummaryReport,
                        new FixedLocalizableString("OT Adj Summary"),
                        url: "Reports/OTAdjSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.OTAdjSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.OTSummaryReport,
                        new FixedLocalizableString("OT Summary Report"),
                        url: "Reports/OTSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.OTSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.LoanSummaryReport,
                        new FixedLocalizableString("Emp Loan Summary"),
                        url: "Reports/LoanSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.LoanSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.LoanCollectionList,
                        new FixedLocalizableString("Loan Collection List"),
                        url: "Reports/LoanCollectionList",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.LoanCollectionList)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.LoanSummaryReportList,
                        new FixedLocalizableString("Loan Summary Report"),
                        url: "Reports/LoanSummaryReportList",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.LoanSummaryReportList)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.AttAdjSummaryReport,
                        new FixedLocalizableString("Att Summary"),
                        url: "Reports/AttAdjSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.AttAdjSummaryReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.SalesOrderReport,
                        new FixedLocalizableString("Sales Order Report"),
                        url: "Reports/SalesOrderReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.SalesOrderReport)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.SalesOrderSummaryReport,
                        new FixedLocalizableString("Sales Summary"),
                        url: "Reports/SalesOrderSummaryReport",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.SalesOrderSummaryReport)
                    )

                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Month13,
                        new FixedLocalizableString("201 Report"),
                        url: "Reports/Employee201Report",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Employee201Report)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Month13,
                        new FixedLocalizableString("13thMonth Report"),
                        url: "Reports/Month13",
                        icon: "puzzle-piece",
                        requiredPermissionName: PermissionNames.Month13)
                    )
                )
                .AddItem
                (
                    new MenuItemDefinition(
                        "Master Data",
                        L("MasterData"),
                        icon: "cogs")
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        L("Users"),
                        url: "Users",
                        icon: "users",
                        requiredPermissionName: PermissionNames.Pages_Users)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        L("Roles"),
                        url: "Roles",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Master_Roles)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Warehouses,
                        new FixedLocalizableString("Warehouse"),
                        url: "Warehouse",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Master_Warehouse)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Clients,
                        new FixedLocalizableString("Clients"),
                        url: "Clients",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Master_Clients)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Vendors,
                        new FixedLocalizableString("Vendors"),
                        url: "Vendors",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Master_Vendors)
                    )
                     .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Products"),
                        url: "Products",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Master_Products)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Overtime Table"),
                        url: "OTRate",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_Overtime_Rates)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Company"),
                        url: "Company",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_Company)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Chart of Account"),
                        url: "ChartofAccount",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_ChartAccount)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Expense Items"),
                        url: "ExpenseItems",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Master_ExpenseItems)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Order Type"),
                        url: "OrderTypes",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_Company)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Tax Type"),
                        url: "TaxType",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_TaxType)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Charge Type"),
                        url: "ChargeType",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_ChargeType)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Payment Term"),
                        url: "PaymentTerms",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_PaymentTerm)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Warranty Type"),
                        url: "WarrantyType",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_WarrantyType)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Payment Mode"),
                        url: "PaymentMode",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_PaymentMode)
                    )
                    .AddItem
                    (
                        new MenuItemDefinition(
                        PageNames.Roles,
                        new FixedLocalizableString("Series Type"),
                        url: "SeriesType",
                        icon: "user-circle-o",
                        requiredPermissionName: PermissionNames.Pages_SeriesType)
                    )
                );
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, ezinvmvcConsts.LocalizationSourceName);
        }
    }
}
