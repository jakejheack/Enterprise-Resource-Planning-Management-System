using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using ezinvmvc.Authorization.Roles;
using ezinvmvc.Authorization.Users;
using ezinvmvc.MultiTenancy;
using ezinvmvc.App.Products;
using ezinvmvc.App.Stocks;
using ezinvmvc.App.Common;
using ezinvmvc.App.Vendors;
using ezinvmvc.App.Purchases;
using ezinvmvc.App.Employees;
using ezinvmvc.App.GroupTypes;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Leads;
using ezinvmvc.App.Addresses.Models;
using ezinvmvc.App.Sales.Models;
using ezinvmvc.App.Sales;
using ezinvmvc.App.Employees.Models;
using ezinvmvc.App.EmployeesAccountsAbility;
using ezinvmvc.App.ContactPersons;
using ezinvmvc.App.EmployeesRecords.Models;
using ezinvmvc.App.EmployeesSalaryRate.Models;
using ezinvmvc.App.EmployeesAllowance.Models;
using ezinvmvc.App.OvertimeRates;
using ezinvmvc.App.EmployeeOvertimeRates.Models;
using ezinvmvc.App.EmployeesLoans.Models;
using ezinvmvc.App.Common.Models;
using ezinvmvc.App.BioAttendance.Models;
using ezinvmvc.App.Accounting;
using ezinvmvc.App.EmployeeAttendance;
using ezinvmvc.App.EmployeesRecords;
using ezinvmvc.App.EmployeeRestday.Models;
using ezinvmvc.App.EmployeePayroll.Models;
using ezinvmvc.App.Contribution;
using ezinvmvc.App.RequestForPayment.Models;
using ezinvmvc.App.CheckVoucher.Models;
using ezinvmvc.App.EmployeesSalaryRate;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.App.CashVoucher;
using ezinvmvc.App.ExpenseItems;

namespace ezinvmvc.EntityFrameworkCore
{
    public class ezinvmvcDbContext : AbpZeroDbContext<Tenant, Role, User, ezinvmvcDbContext>
    {
        /* Accounting */
        public virtual DbSet<AccountType> AccountTypes { get; set; }
        public virtual DbSet<AccountClass> AccountClasses { get; set; }
        public virtual DbSet<AccountGroup> AccountGroup { get; set; }
        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<JournalType> JournalTypes { get; set; }
        public virtual DbSet<JournalEntry> JournalEntries { get; set; }
        public virtual DbSet<JournalEntryItem> JournalEntryItems { get; set; }
        public virtual DbSet<GeneralLedger> GeneralLedgers { get; set; }
        public virtual DbSet<Collection> Collections { get; set; }
        public virtual DbSet<CollectionApplied> CollectionApplied { get; set; }

        /* Accounting */
        /* Common */
        public virtual DbSet<EntryType> EntryTypes { get; set; }
        public virtual DbSet<WarrantyType> WarrantyTypes { get; set; }
        public virtual DbSet<DeliveryType> DeliveryTypes { get; set; }
        public virtual DbSet<ChargeType> ChargeTypes { get; set; }
        public virtual DbSet<StatusType> StatusTypes { get; set; }
        public virtual DbSet<PaymentTerm> PaymentTerms { get; set; }
        public virtual DbSet<OrderType> OrderTypes { get; set; }
        public virtual DbSet<TaxType> TaxTypes { get; set; }
        public virtual DbSet<Currency> Currencies { get; set; }
        public virtual DbSet<SeriesType> SeriesTypes { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<Operation> Operations { get; set; }
        public virtual DbSet<PaymentMode> PaymentMode { get; set; }
        public virtual DbSet<TransportMode> TransportMode { get; set; }
        public virtual DbSet<VehicleType> VehicleType { get; set; }
        public virtual DbSet<InventoryType> InventoryType { get; set; }
        /* Common */

        /* Master Data */
        public virtual DbSet<Unit> Units { get; set; }
        public virtual DbSet<ProductUnit> ProductUnits { get; set; }
        public virtual DbSet<PricingType> PricingTypes { get; set; }
        public virtual DbSet<ProductPrice> ProductPrices { get; set; }
        public virtual DbSet<CostingType> CostingTypes { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<Warehouse> Warehouses { get; set; }
        public virtual DbSet<VATType> VATTypes { get; set; }
        public virtual DbSet<Vendor> Vendors { get; set; }
        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<OvertimeRate> OvertimeRate { get; set; }
        /* Master Data */

        /* Stock */
        public virtual DbSet<StockEntry> StockEntries { get; set; }
        public virtual DbSet<StockEntryItem> StockEntryItems { get; set; }
        public virtual DbSet<StockCard> StockCards { get; set; }
        public virtual DbSet<StockMovement> StockMovement { get; set; }
        /* Stock */

        /* CRM */
        public virtual DbSet<Lead> Leads { get; set; }
        public virtual DbSet<LeadUpdate> LeadUpdates { get; set; }
        public virtual DbSet<LeadSource> LeadSources { get; set; }
        public virtual DbSet<LeadTask> LeadTasks { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<Address> Addresses { get; set; }
        public virtual DbSet<AccountExecutive> AccountExecutives { get; set; }
        public virtual DbSet<Industry> Industries { get; set; }
        public virtual DbSet<ContactPerson> ContactPersons { get; set; }


        /* Purchases */
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<OrderItem> OrderItems { get; set; }
        /* Purchases */

        /* Sales */
        public virtual DbSet<Quotation> Quotations { get; set; }
        public virtual DbSet<QuotationItem> QuotationItems { get; set; }
        public virtual DbSet<QuotationCharge> QuotationCharges { get; set; }
        public virtual DbSet<SalesOrder> SalesOrders { get; set; }
        public virtual DbSet<SalesOrderItem> SalesOrderItems { get; set; }
        public virtual DbSet<SalesOrderCharge> SalesOrderCharges { get; set; }
        public virtual DbSet<SalesInvoice> SalesInvoices { get; set; }
        public virtual DbSet<SalesInvoiceItem> SalesInvoiceItems { get; set; }
        public virtual DbSet<SalesInvoiceCharge> SalesInvoiceCharges { get; set; }
        public virtual DbSet<DeliveryReceipt> DeliveryReceipts { get; set; }
        public virtual DbSet<DeliveryReceiptItem> DeliveryReceiptItems { get; set; }
        public virtual DbSet<DeliveryReceiptCharge> DeliveryReceiptCharges { get; set; }
        public virtual DbSet<RFQ> RFQ { get; set; }
        public virtual DbSet<RFQDetails> RFQDetails { get; set; }
        public virtual DbSet<Tasks> Tasks { get; set; }
        public virtual DbSet<AssignStatusTypes> AssignStatusTypes { get; set; }
        public virtual DbSet<RFQOtherDetails> RFQOtherDetails { get; set; }
        public virtual DbSet<QuotationOtherItem> QuotationOtherItem { get; set; }
        /* Sales */

        /* Accounting */
        public virtual DbSet<JournalEntryStatusTypes> JournalEntryStatusTypes { get; set; }
        public virtual DbSet<RFP> RFP { get; set; }
        public virtual DbSet<RFPItem> RFPItem { get; set; }
        public virtual DbSet<CV> CV { get; set; }
        public virtual DbSet<CVD> CVD { get; set; }
        public virtual DbSet<CashVoucher> CashVoucher { get; set; }
        public virtual DbSet<CashVoucherItem> CashVoucherItem { get; set; }

        //123
        /* Accounting */

        /* HR */
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeDetails> EmployeeDetails { get; set; }
        public virtual DbSet<AccountAbility> AccountAbility { get; set; }
        public virtual DbSet<EmployeeRecords> EmployeeRecords { get; set; }
        public virtual DbSet<EmployeeAttendance> EmployeeAttendance { get; set; }
        public virtual DbSet<EmployeeLeaves> EmployeeLeaves { get; set; }
        public virtual DbSet<EmployeeSalaries> EmployeeSalaries { get; set; }
        public virtual DbSet<EmpSalaries> EmpSalaries { get; set; }
        public virtual DbSet<EmployeeAllowances> EmployeeAllowances { get; set; }
        public virtual DbSet<EmployeeOTRates> EmployeeOTRates { get; set; }
        public virtual DbSet<OTRates> OTRates { get; set; }

        public virtual DbSet<TimeSched> TimeSched { get; set; }
        public virtual DbSet<EmployeeLoans> EmployeeLoans { get; set; }
        public virtual DbSet<LoanType> LoanType { get; set; }
        public virtual DbSet<LoanTitle> LoanTitle { get; set; }
        public virtual DbSet<HRStatus> HRStatus { get; set; }
        public virtual DbSet<Attendance> Attendance { get; set; }
        public virtual DbSet<Attendance2> Attendance2 { get; set; }
        public virtual DbSet<Attendance3> Attendance3 { get; set; }
        public virtual DbSet<Holidays> Holidays { get; set; }
        public virtual DbSet<EmpAttRecord> EmpAttRecord { get; set; }
        public virtual DbSet<EmpAttRecordDetail> EmpAttRecordDetail { get; set; }
        public virtual DbSet<EmployeeRestday> EmployeeRestday { get; set; }
        public virtual DbSet<PagIbig> PagIbig { get; set; }
        public virtual DbSet<PhilHealth> PhilHealth { get; set; }
        public virtual DbSet<SSS> SSS { get; set; }
        public virtual DbSet<Tax> Tax { get; set; }
        public virtual DbSet<EmpPayroll> EmpPayroll { get; set; }
        public virtual DbSet<EmpContribution> EmpContribution { get; set; }
        public virtual DbSet<PayrollOTDetails> PayrollOTDetails { get; set; }
        public virtual DbSet<Payroll> Payroll { get; set; }
        public virtual DbSet<PayrollAllowanceAdjustment> PayrollAllowanceAdjustment { get; set; }
        public virtual DbSet<PayrollSSSLoan> PayrollSSSLoan { get; set; }
        public virtual DbSet<PayrollPagibigLoan> PayrollPagibigLoan { get; set; }
        public virtual DbSet<PayrollOtherDeduction> PayrollOtherDeduction { get; set; }
        public virtual DbSet<PayrollOtherLoan> PayrollOtherLoan { get; set; }
        public virtual DbSet<AttAdjustmentTypes> AttAdjustmentTypes { get; set; }
        public virtual DbSet<PayrollAttAdjustment> PayrollAttAdjustment { get; set; }
        /* HR */

        /* DEPARTMENT */
        public virtual DbSet<Department> Department { get; set; }
        public virtual DbSet<Division> Division { get; set; }
        public virtual DbSet<Sectors> Sector { get; set; }
        public virtual DbSet<Position> Position { get; set; }
        public virtual DbSet<DivEmployee> DivEmployee { get; set; }
        /* DEPARTMENT */

        /* GroupTypes */
        public virtual DbSet<GroupType> GroupTypes { get; set; }
        /* GroupTypes */

        /* GroupTypes */
        public virtual DbSet<EmpLeaves> EmpLeaves { get; set; }
        /* GroupTypes */

        public virtual DbSet<Documents> Documents { get; set; }

        public virtual DbSet<Notification> Notification { get; set; }

        public virtual DbSet<UserNotification> UserNotification { get; set; }

        public virtual DbSet<ExpenseItem> ExpenseItem { get; set; }

        public ezinvmvcDbContext(DbContextOptions<ezinvmvcDbContext> options)
            : base(options)
        {
        }
    }
}
