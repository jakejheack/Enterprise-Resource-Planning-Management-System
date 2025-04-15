using System.Linq;
using Microsoft.EntityFrameworkCore;
using Abp.Configuration;
using Abp.Localization;
using Abp.Net.Mail;
using ezinvmvc.App.Products;
using ezinvmvc.App.Common;
using ezinvmvc.App.Leads;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Addresses.Models;
using ezinvmvc.App.Common.Models;
using ezinvmvc.App.Accounting;
using System;
using ezinvmvc.App.Contribution;
using ezinvmvc.App.EmployeeRestday.Models;
using ezinvmvc.App.EmployeesLoans.Models;
using ezinvmvc.App.EmployeesSalaryRate.Models;
using ezinvmvc.App.EmployeesSalaryRate;

namespace ezinvmvc.EntityFrameworkCore.Seed.Host
{
    public class DefaultSettingsCreator
    {
        private readonly ezinvmvcDbContext _context;

        public DefaultSettingsCreator(ezinvmvcDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            // Emailing
            AddSettingIfNotExists(EmailSettingNames.DefaultFromAddress, "admin@mydomain.com");
            AddSettingIfNotExists(EmailSettingNames.DefaultFromDisplayName, "mydomain.com mailer");

            // Languages
            AddSettingIfNotExists(LocalizationSettingNames.DefaultLanguage, "en");

            // Costing Types
            AddCostingTypeifNotExists();

            // Units
            AddUnitifNotExists();

            // Transactions
            AddTransactionifNotExists();

            // Currencies
            AddCurrencyifNotExists();

            //Company
            AddCompanyifNotExists();

            //Series
            AddSeriesTypesifNotExists();

            // Tax Types
            AddTaxTypeifNotExists();

            //Order Types
            AddOrderTypeifNotExists();

            //Pricing Types
            AddPricingTypeifNotExists();

            //Payment Terms
            AddPaymentTermsifNotExists();

            //Status
            AddStatusTypeifNotExists();

            //Industries
            AddIndustriesIfNotExists();

            //Lead Sources
            AddLeadSourcesIfNotExists();

            //Lead Tasks
            AddLeadTasksIfNotExists();

            //Delivery Types
            AddDeliveryTypeifNotExists();

            //Warranty Types
            AddWarrantyTypeifNotExists();

            //Charge Types
            AddChargeTypeifNotExists();

            //Entry Types
            AddEntryTypeifNotExists();

            //Country
            AddCountryifNotExists();
            
            //HRStatusTypes
            AddHRStatusTypesIfNotExists();

            //AssignStatusTypes
            AddAssignStatusTypesIfNotExists();

            AddAccountClassIfNotExists();

            AddAccountGroupIfNotExists();

            AddAccountTypeIfNotExists();

            AddAccountIfNotExists();

            //HolidaysTypes
            AddHolidaysIfNotExists();

            //Journal Status
            AddJournalEntryStatusTypesIfNotExists();

            //Payment Mode
            AddPaymentModeifNotExists();
            
            //SSS Table
            AddPhilHealthIfNotExists();

            //Pagibig Table
            AddPagIbigIfNotExists();

            //Tax
            AddTaxIfNotExists();

            //RestDay
            AddRestdayIfNotExists();

            //RestDay
            AddLoanTitleIfNotExists();

            //AttAdjustment
            AddAttAdjustmentTypesIfNotExists();

            //Transport Mode
            AddTransportModeifNotExists();

            //Vehicle Type
            AddVehicleTypeifNotExists();

            //Leave Type
            AddLeaveTypeifNotExists();
        }

        private void AddPaymentModeifNotExists()
        {
            if (!_context.PaymentMode.Any())
            {
                var mode1 = new PaymentMode { Name = "Cash", DefaultAccountId = 0, IsTax = false };
                var mode2 = new PaymentMode { Name = "Credit Card", DefaultAccountId = 0, IsTax = false };
                var mode3 = new PaymentMode { Name = "Bank Transfer", DefaultAccountId = 0, IsTax = false };
                var mode4 = new PaymentMode { Name = "CWT", DefaultAccountId = 0, IsTax = true };
                _context.PaymentMode.Add(mode1);
                _context.PaymentMode.Add(mode2);
                _context.PaymentMode.Add(mode3);
                _context.PaymentMode.Add(mode4);
                _context.SaveChanges();
            }
        }

        private void AddSettingIfNotExists(string name, string value, int? tenantId = null)
        {
            if (_context.Settings.IgnoreQueryFilters().Any(s => s.Name == name && s.TenantId == tenantId && s.UserId == null))
            {
                return;
            }
            _context.Settings.Add(new Setting(tenantId, null, name, value));
            _context.SaveChanges();
        }

        private void AddCostingTypeifNotExists()
        {
            if (!_context.CostingTypes.Any())
            {
                var actual = new CostingType { Name = "Actual" };
                var standard = new CostingType { Name = "Standard" };
                _context.CostingTypes.Add(actual);
                _context.CostingTypes.Add(standard);
                _context.SaveChanges();
            }
        }
        private void AddUnitifNotExists()
        {
            if (!_context.Units.Any())
            {
                var pcunit = new Unit { Name = "Pcs" };
                _context.Units.Add(pcunit);
                _context.SaveChanges();
            }
        }
        private void AddTransactionifNotExists()
        {
            if (!_context.Transactions.Any())
            {
                var trans1 = new Transaction { Code = 100, Name = "Quotation" };
                var trans2 = new Transaction { Code = 101, Name = "Sales Order" };
                var trans3 = new Transaction { Code = 102, Name = "Delivery Receipt" };
                var trans4 = new Transaction { Code = 103, Name = "Sales Invoice" };
                var trans5 = new Transaction { Code = 104, Name = "Lead" };
                var trans6 = new Transaction { Code = 105, Name = "Client" };
                var trans7 = new Transaction { Code = 106, Name = "Request For Quotation" };
                var trans8 = new Transaction { Code = 107, Name = "Stock Entry" };
                var trans9 = new Transaction { Code = 108, Name = "Employee" };
                var trans10 = new Transaction { Code = 109, Name = "Journal Entry" };
                var trans120 = new Transaction { Code = 120, Name = "Billing Statement" };
                var trans130 = new Transaction { Code = 130, Name = "Collection" };
                var trans11 = new Transaction { Code = 110, Name = "Request For Payment" };
                var trans12 = new Transaction { Code = 111, Name = "Check Voucher" };

                _context.Transactions.Add(trans1);
                _context.Transactions.Add(trans2);
                _context.Transactions.Add(trans3);
                _context.Transactions.Add(trans4);
                _context.Transactions.Add(trans5);
                _context.Transactions.Add(trans6);
                _context.Transactions.Add(trans7);
                _context.Transactions.Add(trans8);
                _context.Transactions.Add(trans9);
                _context.Transactions.Add(trans10);
                _context.Transactions.Add(trans11);
                _context.Transactions.Add(trans12);
                _context.Transactions.Add(trans120);
                _context.Transactions.Add(trans130);
                _context.SaveChanges();
            }
        }
        private void AddStatusTypeifNotExists()
        {
            if (!_context.StatusTypes.Any())
            {
                //Delivery Receipt Status
                var status10201 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 102 };
                var status10202 = new StatusType { Code = 2, Status = "Delivered", TransactionCode = 102 };
                var status10203 = new StatusType { Code = 3, Status = "Billed", TransactionCode = 102 };
                _context.StatusTypes.Add(status10201);
                _context.StatusTypes.Add(status10202);
                _context.StatusTypes.Add(status10203);

                //Sales Invoice Status
                var status1001 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 103 };
                var status1002 = new StatusType { Code = 2, Status = "Unpaid", TransactionCode = 103 };
                var status1003 = new StatusType { Code = 3, Status = "Paid", TransactionCode = 103 };
                _context.StatusTypes.Add(status1001);
                _context.StatusTypes.Add(status1002);
                _context.StatusTypes.Add(status1003);

                //Sales Order Status
                var status1 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 101 };
                var status2 = new StatusType { Code = 2, Status = "Submitted", TransactionCode = 101 };
                var status3 = new StatusType { Code = 3, Status = "For Delivery", TransactionCode = 101 };
                var status0 = new StatusType { Code = 4, Status = "Delivered", TransactionCode = 101 };
                var statusSO1 = new StatusType { Code = 5, Status = "Completed", TransactionCode = 101 };
                var statusSO2 = new StatusType { Code = 6, Status = "For Revision", TransactionCode = 101 };
                var statusSO3 = new StatusType { Code = 7, Status = "Revised", TransactionCode = 101 };
                _context.StatusTypes.Add(statusSO2);
                _context.StatusTypes.Add(statusSO3);

                //Quotation
                var status4 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 100 };
                var status5 = new StatusType { Code = 2, Status = "Submitted", TransactionCode = 100 };
                var status6 = new StatusType { Code = 3, Status = "For Revision", TransactionCode = 100 };
                var status7 = new StatusType { Code = 4, Status = "Completed", TransactionCode = 100 };
                var status8 = new StatusType { Code = 5, Status = "Revised", TransactionCode = 100 };
                var status14 = new StatusType { Code = 6, Status = "For Order", TransactionCode = 100 };

                //RFQ
                var status9 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 106 };
                var status10 = new StatusType { Code = 2, Status = "Submitted", TransactionCode = 106 };
                var status11 = new StatusType { Code = 3, Status = "For Revision", TransactionCode = 106 };
                var status12 = new StatusType { Code = 4, Status = "Completed", TransactionCode = 106 };
                var status13 = new StatusType { Code = 5, Status = "Revised", TransactionCode = 106 };

                //Client
                var status15 = new StatusType { Code = 1, Status = "For Approval", TransactionCode = 105 };
                var status16 = new StatusType { Code = 2, Status = "Approved", TransactionCode = 105 };
                var status17 = new StatusType { Code = 3, Status = "Leads", TransactionCode = 105 };
                var status18 = new StatusType { Code = 4, Status = "Client", TransactionCode = 105 };
                var status19 = new StatusType { Code = 5, Status = "Disapproved", TransactionCode = 105 };

                //Leads
                var status20 = new StatusType { Code = 1, Status = "For Approval", TransactionCode = 104 };
                var status21 = new StatusType { Code = 2, Status = "Approved", TransactionCode = 104 };
                var status22 = new StatusType { Code = 3, Status = "Disapproved", TransactionCode = 104 };


                //Stock Entry Status
                var status23 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 107 };
                var status24 = new StatusType { Code = 2, Status = "Released", TransactionCode = 107 };
                var status25 = new StatusType { Code = 3, Status = "Completed", TransactionCode = 107 };
                var status26 = new StatusType { Code = 4, Status = "Cancelled", TransactionCode = 107 };

                //Employee Status
                var status27 = new StatusType { Code = 1, Status = "Hired", TransactionCode = 108 };
                var status28 = new StatusType { Code = 2, Status = "Resigned", TransactionCode = 108 };
                var status29 = new StatusType { Code = 3, Status = "Terminated", TransactionCode = 108 };

                //Journal Entry Status
                var status30 = new StatusType { Code = 1, Status = "Draft", TransactionCode = 109 };
                //var status31 = new StatusType { Code = 2, Status = "Approved", TransactionCode = 109 };
                var status31 = new StatusType { Code = 2, Status = "Posted", TransactionCode = 109 };

                //RFP Status
                var status32 = new StatusType { Code = 1, Status = "Pending", TransactionCode = 110 };
                var status33 = new StatusType { Code = 2, Status = "Approved", TransactionCode = 110 };
                var status34 = new StatusType { Code = 3, Status = "Approved", TransactionCode = 110 };

                //CV Status
                var status35 = new StatusType { Code = 1, Status = "Partial", TransactionCode = 111 };
                var status36 = new StatusType { Code = 2, Status = "Paid", TransactionCode = 111 };

                //Sales Order Status
                _context.StatusTypes.Add(status1);
                _context.StatusTypes.Add(status2);
                _context.StatusTypes.Add(status3);
                _context.StatusTypes.Add(status0);

                //Quotation Status
                _context.StatusTypes.Add(status4);
                _context.StatusTypes.Add(status5);
                _context.StatusTypes.Add(status6);
                _context.StatusTypes.Add(status7);
                _context.StatusTypes.Add(status8);
                _context.StatusTypes.Add(status14);

                //Quotation Status
                _context.StatusTypes.Add(status9);
                _context.StatusTypes.Add(status10);
                _context.StatusTypes.Add(status11);
                _context.StatusTypes.Add(status12);
                _context.StatusTypes.Add(status13);

                //Client Status
                _context.StatusTypes.Add(status15);
                _context.StatusTypes.Add(status16);
                _context.StatusTypes.Add(status17);
                _context.StatusTypes.Add(status18);
                _context.StatusTypes.Add(status19);

                //Leads Status
                _context.StatusTypes.Add(status20);
                _context.StatusTypes.Add(status21);
                _context.StatusTypes.Add(status22);

                //Leads Status
                _context.StatusTypes.Add(status23);
                _context.StatusTypes.Add(status24);
                _context.StatusTypes.Add(status25);
                _context.StatusTypes.Add(status26);


                //Employee Status
                _context.StatusTypes.Add(status27);
                _context.StatusTypes.Add(status28);
                _context.StatusTypes.Add(status29);

                //Journal Entry Status
                _context.StatusTypes.Add(status30);
                _context.StatusTypes.Add(status31);
                //_context.StatusTypes.Add(status32);

                //RFP Status
                _context.StatusTypes.Add(status32);
                _context.StatusTypes.Add(status33);
                _context.StatusTypes.Add(status34);

                //CV Status
                _context.StatusTypes.Add(status35);
                _context.StatusTypes.Add(status36);

                //Employee Payroll Period
                //_context.StatusTypes.Add(status30);
                //_context.StatusTypes.Add(status31);
                //_context.StatusTypes.Add(status32);

                //Employee Payroll Rate
                //_context.StatusTypes.Add(status33);
                //_context.StatusTypes.Add(status34);
                //_context.StatusTypes.Add(status35);
                //_context.StatusTypes.Add(status36);
                //_context.StatusTypes.Add(status37);


                _context.SaveChanges();
            }
        }

        private void AddCurrencyifNotExists()
        {
            if (!_context.Currencies.Any())
            {
                var currency1 = new Currency { Name = "PHP", Sign = '₱' };
                var currency2 = new Currency { Name = "USD", Sign = '$' };
                _context.Currencies.Add(currency1);
                _context.Currencies.Add(currency2);
                _context.SaveChanges();
            }
        }

        private void AddCompanyifNotExists()
        {
            if (!_context.Companies.Any())
            {
                var company1 = new Company { Abbr = "MFT", Name = "MFT International Corp.", Description = "Systems Furnitures", IsDefault = true, CurrencyId = 1 };
                _context.Companies.Add(company1);
                _context.SaveChanges();
            }
        }

        private void AddSeriesTypesifNotExists()
        {
            if (!_context.SeriesTypes.Any())
            {
                var series1 = new SeriesType { Prefix = "SQ", LastSeries = 0, Padding = 9, TransactionId = 1, CompanyId = 1 };
                var series2 = new SeriesType { Prefix = "SO", LastSeries = 0, Padding = 9, TransactionId = 2, CompanyId = 1 };
                var series3 = new SeriesType { Prefix = "DR", LastSeries = 0, Padding = 9, TransactionId = 3, CompanyId = 1 };
                var series4 = new SeriesType { Prefix = "SI", LastSeries = 0, Padding = 9, TransactionId = 4, CompanyId = 1 };
                var series5 = new SeriesType { Prefix = "LD", LastSeries = 0, Padding = 9, TransactionId = 5, CompanyId = 1 };
                var series6 = new SeriesType { Prefix = "CT", LastSeries = 0, Padding = 9, TransactionId = 6, CompanyId = 1 };
                var series7 = new SeriesType { Prefix = "RFQ", LastSeries = 0, Padding = 9, TransactionId = 7, CompanyId = 1 };
                var series8 = new SeriesType { Prefix = "SE", LastSeries = 0, Padding = 9, TransactionId = 8, CompanyId = 1 };
                var series9 = new SeriesType { Prefix = "E", LastSeries = 0, Padding = 9, TransactionId = 9, CompanyId = 1 };
                var series10 = new SeriesType { Prefix = "JV", LastSeries = 0, Padding = 9, TransactionId = 10, CompanyId = 1 };
                var series11 = new SeriesType { Prefix = "RFP", LastSeries = 0, Padding = 9, TransactionId = 11, CompanyId = 1 };
                var series12 = new SeriesType { Prefix = "CV", LastSeries = 0, Padding = 9, TransactionId = 12, CompanyId = 1 };
                var series13 = new SeriesType { Prefix = "AR", LastSeries = 0, Padding = 9, TransactionId = 3, CompanyId = 1 };

                _context.SeriesTypes.Add(series1);
                _context.SeriesTypes.Add(series2);
                _context.SeriesTypes.Add(series3);
                _context.SeriesTypes.Add(series4);
                _context.SeriesTypes.Add(series5);
                _context.SeriesTypes.Add(series6);
                _context.SeriesTypes.Add(series7);
                _context.SeriesTypes.Add(series8);
                _context.SeriesTypes.Add(series9);
                _context.SeriesTypes.Add(series10);
                _context.SeriesTypes.Add(series11);
                _context.SeriesTypes.Add(series12);
                _context.SeriesTypes.Add(series13);
                _context.SaveChanges();
            }
        }

        private void AddTaxTypeifNotExists()
        {
            if (!_context.TaxTypes.Any())
            {
                var taxtype1 = new TaxType { Code = 101, Name = "Vat-Inclusive", Rate = decimal.Parse("1.12") };
                var taxtype2 = new TaxType { Code = 102, Name = "Vat-Exempt", Rate = decimal.Parse("1") };
                var taxtype3 = new TaxType { Code = 103, Name = "Zero-Rated", Rate = decimal.Parse("1") };
                var taxtype4 = new TaxType { Code = 104, Name = "Vat-Exclusive", Rate = decimal.Parse("1.12") };

                _context.TaxTypes.Add(taxtype1);
                _context.TaxTypes.Add(taxtype2);
                _context.TaxTypes.Add(taxtype3);
                _context.TaxTypes.Add(taxtype4);
                _context.SaveChanges();
            }
        }
        private void AddOrderTypeifNotExists()
        {
            if (!_context.OrderTypes.Any())
            {
                var type1 = new OrderType { Name = "Sales" };
                _context.OrderTypes.Add(type1);
                _context.SaveChanges();
            }
        }
        private void AddPricingTypeifNotExists()
        {
            if (!_context.PricingTypes.Any())
            {
                var type1 = new PricingType { Name = "Non-Vatable" };
                var type2 = new PricingType { Name = "Vatable" };
                _context.PricingTypes.Add(type1);
                _context.PricingTypes.Add(type2);
                _context.SaveChanges();
            }
        }
        private void AddPaymentTermsifNotExists()
        {
            if (!_context.PaymentTerms.Any())
            {
                var term1 = new PaymentTerm { Name = "COD", NoOfDays = 0, IsAdvance = true };
                var term2 = new PaymentTerm { Name = "7 Days", NoOfDays = 7, IsAdvance = false };
                var term3 = new PaymentTerm { Name = "10 Days", NoOfDays = 10, IsAdvance = false };
                var term4 = new PaymentTerm { Name = "15 Days", NoOfDays = 15, IsAdvance = false };
                var term5 = new PaymentTerm { Name = "20 Days", NoOfDays = 20, IsAdvance = false };
                var term6 = new PaymentTerm { Name = "30 Days", NoOfDays = 30, IsAdvance = false };
                var term7 = new PaymentTerm { Name = "60 Days", NoOfDays = 60, IsAdvance = false };
                var term8 = new PaymentTerm { Name = "90 Days", NoOfDays = 90, IsAdvance = false };
                var term9 = new PaymentTerm { Name = "50% Downpayment, 50% Progress Billing", NoOfDays = 0, IsAdvance = true };
                var term10 = new PaymentTerm { Name = "Acknowledgement Receipt", NoOfDays = 0, IsAdvance = false };
                var term11 = new PaymentTerm { Name = "Government Terms", NoOfDays = 0, IsAdvance = false };
                _context.PaymentTerms.Add(term1);
                _context.PaymentTerms.Add(term2);
                _context.PaymentTerms.Add(term3);
                _context.PaymentTerms.Add(term4);
                _context.PaymentTerms.Add(term5);
                _context.PaymentTerms.Add(term6);
                _context.PaymentTerms.Add(term7);
                _context.PaymentTerms.Add(term8);
                _context.PaymentTerms.Add(term9);
                _context.PaymentTerms.Add(term10);
                _context.PaymentTerms.Add(term11);
                _context.SaveChanges();
            }
        }

        private void AddIndustriesIfNotExists()
        {
            if (!_context.Industries.Any())
            {
                var term0 = new Industry { Name = "Government" };
                var term1 = new Industry { Name = "Services" };
                var term2 = new Industry { Name = "Institutions" };
                var term3 = new Industry { Name = "Industrial" };
                var term4 = new Industry { Name = "Properties" };
                var term5 = new Industry { Name = "Specifiers" };
                _context.Industries.Add(term0);
                _context.Industries.Add(term1);
                _context.Industries.Add(term2);
                _context.Industries.Add(term3);
                _context.Industries.Add(term4);
                _context.Industries.Add(term5);
                _context.SaveChanges();
            }
        }

        private void AddLeadSourcesIfNotExists()
        {
            if (!_context.LeadSources.Any())
            {
                var term0 = new LeadSource { Name = "Direct Marketing" };
                var term1 = new LeadSource { Name = "Networks" };
                var term2 = new LeadSource { Name = "Outbound Calls" };
                var term3 = new LeadSource { Name = "Referrals" };
                var term4 = new LeadSource { Name = "Trade Shows" };
                var term5 = new LeadSource { Name = "Search Engines" };
                var term6 = new LeadSource { Name = "Media" };
                var term7 = new LeadSource { Name = "Inbound Calls" };
                _context.LeadSources.Add(term0);
                _context.LeadSources.Add(term1);
                _context.LeadSources.Add(term2);
                _context.LeadSources.Add(term3);
                _context.LeadSources.Add(term4);
                _context.LeadSources.Add(term5);
                _context.LeadSources.Add(term6);
                _context.LeadSources.Add(term7);
                _context.SaveChanges();
            }
        }

        private void AddLeadTasksIfNotExists()
        {
            if (!_context.LeadTasks.Any())
            {
                var term0 = new LeadTask { Name = "Telemarketing", Rate = 5 };
                var term1 = new LeadTask { Name = "Preliminary Profiling", Rate = 10 };
                var term2 = new LeadTask { Name = "Product Presentation", Rate = 15 };
                var term3 = new LeadTask { Name = "Client Visit", Rate = 20 };
                var term4 = new LeadTask { Name = "Meeting with Requirement / Site Meetings", Rate = 25 };
                var term5 = new LeadTask { Name = "Pre-bid Conference", Rate = 30 };
                var term6 = new LeadTask { Name = "Finalization of Specifications", Rate = 40 };
                var term7 = new LeadTask { Name = "Submission of Bid or Proposal", Rate = 50 };
                _context.LeadTasks.Add(term0);
                _context.LeadTasks.Add(term1);
                _context.LeadTasks.Add(term2);
                _context.LeadTasks.Add(term3);
                _context.LeadTasks.Add(term4);
                _context.LeadTasks.Add(term5);
                _context.LeadTasks.Add(term6);
                _context.LeadTasks.Add(term7);
                _context.SaveChanges();
            }
        }

        private void AddDeliveryTypeifNotExists()
        {
            if (!_context.DeliveryTypes.Any())
            {
                var type1 = new DeliveryType { Code = 1, Name = "Seven (7) Working Days" };
                var type2 = new DeliveryType { Code = 2, Name = "Fourteen (14) Working Days" };
                var type3 = new DeliveryType { Code = 3, Name = "Thirty (30) Working Days" };
                var type4 = new DeliveryType { Code = 4, Name = "Forty Five (45) Working Days" };

                _context.DeliveryTypes.Add(type1);
                _context.DeliveryTypes.Add(type2);
                _context.DeliveryTypes.Add(type3);
                _context.DeliveryTypes.Add(type4);
                _context.SaveChanges();
            }
        }
        private void AddWarrantyTypeifNotExists()
        {
            if (!_context.WarrantyTypes.Any())
            {
                var type1 = new WarrantyType { Code = 1, Name = "1 YEAR (FOR MTO & ACCESSORIES)" };
                var type2 = new WarrantyType { Code = 2, Name = "2 YEARS (CHAIRS, TABLES, CABINETS)" };
                var type3 = new WarrantyType { Code = 3, Name = "5 YEARS (FOR PANELS EXCEPT FOR WEAR AND TEAR)" };

                _context.WarrantyTypes.Add(type1);
                _context.WarrantyTypes.Add(type2);
                _context.WarrantyTypes.Add(type3);
                _context.SaveChanges();
            }
        }

        private void AddChargeTypeifNotExists()
        {
            if (!_context.ChargeTypes.Any())
            {
                var type1 = new ChargeType { Code = 1, Name = "Mobilization Charge" };
                var type2 = new ChargeType { Code = 2, Name = "Surety Bond" };
                var type3 = new ChargeType { Code = 3, Name = "Performance Bond" };
                var type4 = new ChargeType { Code = 4, Name = "Guarantee Bond" };

                _context.ChargeTypes.Add(type1);
                _context.ChargeTypes.Add(type2);
                _context.ChargeTypes.Add(type3);
                _context.ChargeTypes.Add(type4);
                _context.SaveChanges();
            }
        }

        private void AddEntryTypeifNotExists()
        {
            if (!_context.EntryTypes.Any())
            {
                var type1 = new EntryType { Code = 1, Name = "Stock Issue"};
                var type2 = new EntryType { Code = 2, Name = "Stock Receipt" };
                var type3 = new EntryType { Code = 3, Name = "Stock Transfer"};
            
                _context.EntryTypes.Add(type1);
                _context.EntryTypes.Add(type2);
                _context.EntryTypes.Add(type3);
                _context.SaveChanges();
            }
        }
        private void AddTransportModeifNotExists()
        {
            if (!_context.TransportMode.Any())
            {
                var type1 = new TransportMode { Name = "Land" };
                var type2 = new TransportMode { Name = "Air" };
                var type3 = new TransportMode { Name = "Ship" };

                _context.TransportMode.Add(type1);
                _context.TransportMode.Add(type2);
                _context.TransportMode.Add(type3);
                _context.SaveChanges();
            }
        }
        private void AddVehicleTypeifNotExists()
        {
            if (!_context.VehicleType.Any())
            {
                var type1 = new VehicleType { Name = "Regular" };
                var type2 = new VehicleType { Name = "Motorcycle" };
                var type3 = new VehicleType { Name = "Cargo" };

                _context.VehicleType.Add(type1);
                _context.VehicleType.Add(type2);
                _context.VehicleType.Add(type3);
                _context.SaveChanges();
            }
        }
        private void AddCountryifNotExists()
        {
            if (!_context.Countries.Any())
            {
                var type1 = new Country { Code = "PHL", Name = "Philippines", IsDefault = true };

                _context.Countries.Add(type1);
                _context.SaveChanges();
            }
        }
         private void AddHRStatusTypesIfNotExists()
        {
            if (!_context.HRStatus.Any())
            {

                //Employee Payroll Period
                var status16 = new HRStatus { Status = "Daily", TypeCode = 001 };
                var status17 = new HRStatus { Status = "Weekly", TypeCode = 001 };
                var status18 = new HRStatus { Status = "Semi-Monthly", TypeCode = 001 };
                var status19 = new HRStatus { Status = "Monthly", TypeCode = 001 };

                //Employee Payroll Rate
                var status20 = new HRStatus { Status = "Monthly Rate", TypeCode = 002 };
                var status21 = new HRStatus { Status = "Weekly Rate", TypeCode = 002 };
                var status22 = new HRStatus { Status = "Daily Rate", TypeCode = 002 };
                var status23 = new HRStatus { Status = "Hourly Rate", TypeCode = 002 };

                //Employee Payroll Period
                _context.HRStatus.Add(status16);
                _context.HRStatus.Add(status17);
                _context.HRStatus.Add(status18);
                _context.HRStatus.Add(status19);

                //Employee Payroll Rate
                _context.HRStatus.Add(status20);
                _context.HRStatus.Add(status21);
                _context.HRStatus.Add(status22);
                _context.HRStatus.Add(status23);

                _context.SaveChanges();
            }
        }
        
        private void AddAssignStatusTypesIfNotExists()
        {
            if (!_context.AssignStatusTypes.Any())
            {

                //Assigning
                var add1 = new AssignStatusTypes { StatusId = 0, Status = "Pending" };
                var add2 = new AssignStatusTypes { StatusId = 1, Status = "Created" };

                _context.AssignStatusTypes.Add(add1);
                _context.AssignStatusTypes.Add(add2);

                _context.SaveChanges();
            }
        }

        private void AddAccountClassIfNotExists()
        {
            if (!_context.AccountClasses.Any())
            {
                var add1 = new AccountClass { Name = "Assets", Base = 1};
                var add2 = new AccountClass { Name = "Liabilities", Base = 2};
                var add3 = new AccountClass { Name = "Equity", Base = 2};
                var add4 = new AccountClass { Name = "Revenues", Base = 2};
                var add5 = new AccountClass { Name = "Cost of Goods Sold", Base = 1};
                var add6 = new AccountClass { Name = "Expenses", Base = 1 };
                _context.AccountClasses.Add(add1);
                _context.AccountClasses.Add(add2);
                _context.AccountClasses.Add(add3);
                _context.AccountClasses.Add(add4);
                _context.AccountClasses.Add(add5);
                _context.AccountClasses.Add(add6);
                _context.SaveChanges();
            }
        }
  
        private void AddAccountGroupIfNotExists()
        {
            if (!_context.AccountGroup.Any())
            {
                var add1 = new AccountGroup { Code = 1, Name = "Profit and Loss" };
                var add2 = new AccountGroup { Code = 2, Name = "Balance Sheet" };

                _context.AccountGroup.Add(add1);
                _context.AccountGroup.Add(add2);
                _context.SaveChanges();
            }
        }
        private void AddAccountTypeIfNotExists()
        {
            if (!_context.AccountTypes.Any())
            {
                var add0 = new AccountType { Code = 1, Name = "Account" };
                var add1 = new AccountType { Code = 2, Name = "Bank" };
                var add2 = new AccountType { Code = 3, Name = "Cash" };
                var add3 = new AccountType { Code = 4, Name = "Payable" };
                var add4 = new AccountType { Code = 5, Name = "Receivable" };
                var add5 = new AccountType { Code = 6, Name = "Inventory" };
                var add6 = new AccountType { Code = 7, Name = "Tax" };

                _context.AccountTypes.Add(add0);
                _context.AccountTypes.Add(add1);
                _context.AccountTypes.Add(add2);
                _context.AccountTypes.Add(add3);
                _context.AccountTypes.Add(add4);
                _context.AccountTypes.Add(add5);
                _context.AccountTypes.Add(add6);
                _context.SaveChanges();
            }
        }

        private void AddAccountIfNotExists()
        {
            if (!_context.Accounts.Any())
            {
                //Assests//
                var ass1 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Current Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(ass1);

                var ass2 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Other Current Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(ass2);

                var ass3 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Non-Current Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(ass3);

                _context.SaveChanges();

                var assets = _context.Accounts.Where(c => c.AccountClassId == 1).ToList(); //Assets
                foreach (Account account in assets)
                {
                    if (account.Name == "Current Assets")
                    {
                        var curass2 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Cash in Bank", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curass2);

                        var curass3 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Cash in Hand", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curass3);

                        var curass1 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Accounts Receivable", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curass1);

                        var curass4 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Merchandise Inventory", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curass4);
                    }

                    if (account.Name == "Other Current Assets")
                    {
                        var curass2 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Long Term Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curass2);

                        var curass3 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Property, Plant and Equipment", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curass3);
                    }

                    if (account.Name == "Non-Current Assets")
                    {
                        var ncurass2 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Intangible Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(ncurass2);

                        var ncurass3 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Deferred Tax Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(ncurass3);

                        var ncurass4 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Other Non-Current Assets", AccountClassId = 1, AccountTypeId = 1, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(ncurass4);
                    }
                }
                _context.SaveChanges();

                var bankaccounts = _context.Accounts.Where(c => c.Name == "Cash in Bank" && c.AccountClassId == 1).ToList(); //Assets
                foreach (Account account in bankaccounts)
                {
                    var curass1 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "CIB - Bank 1", AccountClassId = 1, AccountTypeId = 2, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curass1);
                }
                var cinaccounts = _context.Accounts.Where(c => c.Name == "Cash in Hand" && c.AccountClassId == 1).ToList(); //Assets
                foreach (Account account in cinaccounts)
                {
                    var curass1 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "Petty Cash Fund", AccountClassId = 1, AccountTypeId = 3, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curass1);
                }

                var arassets = _context.Accounts.Where(c => c.Name == "Accounts Receivable" && c.AccountClassId == 1).ToList(); //Assets
                foreach (Account account in arassets)
                {
                    var curass1 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "A/R Trade", AccountClassId = 1, AccountTypeId = 5, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curass1);
                }

                var miaccounts = _context.Accounts.Where(c => c.Name == "Merchandise Inventory" && c.AccountClassId == 1).ToList(); //Assets
                foreach (Account account in miaccounts)
                {
                    var curass1 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "MI - Finished Goods", AccountClassId = 1, AccountTypeId = 6, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curass1);

                    var curass2 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "MI - Raw Materials", AccountClassId = 1, AccountTypeId = 6, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curass2);
                }

                var otherncurassets = _context.Accounts.Where(c => c.Name == "Other Non-Current Assets" && c.AccountClassId == 1).ToList(); //Assets
                foreach (Account account in otherncurassets)
                {
                    var ncurass1 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "Input Tax", AccountClassId = 1, AccountTypeId = 6, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(ncurass1);

                    var ncurass2 = new Account { ParentNode = account.Id, Node = 3, Code = "0", Name = "Creditable Withholding Tax", AccountClassId = 1, AccountTypeId = 6, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(ncurass2);
                }
                _context.SaveChanges();
                //Assests//

                //Liabilities//
                var lia2 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Current Liabilities", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(lia2);

                var lia1 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Long Term Liabilities", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(lia1);
                _context.SaveChanges();

                var liabilities = _context.Accounts.Where(c => c.AccountClassId == 2).ToList(); 
                foreach (Account account in liabilities)
                {
                    if (account.Name == "Current Liabilities")
                    {
                        var curlia1 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Accounts Payable", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curlia1);

                        var curlia2 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Other Current Liabilities", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curlia2);
                    }
                    if (account.Name == "Long Term Liabilities")
                    {
                        var curlia1 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Mortgages", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curlia1);

                        var curlia2 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Loans", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                        _context.Accounts.Add(curlia2);
                    }
                }
                _context.SaveChanges();

                var apaccounts = _context.Accounts.Where(c => c.Name == "Accounts Payable" && c.AccountClassId == 2).ToList(); //Assets
                foreach (Account account in apaccounts)
                {
                    var curlia1 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "A/P Trade", AccountClassId = 2, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curlia1);
                }
                _context.SaveChanges();

                var otherliaaccounts = _context.Accounts.Where(c => c.Name == "Other Current Liabilities" && c.AccountClassId == 2).ToList(); //Assets
                foreach (Account account in otherliaaccounts)
                {
                    var curlia1 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "VAT Payable", AccountClassId = 2, AccountTypeId = 7, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                    _context.Accounts.Add(curlia1);
                }
                _context.SaveChanges();
                //Liabilities//

                //Equity//
                var equi1 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Capital Stock", AccountClassId = 3, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(equi1);

                var equi2 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Retained Earnings", AccountClassId = 3, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(equi2);

                _context.SaveChanges();

                //Revenue//
                var rev1 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Direct Income", AccountClassId = 4, AccountTypeId = 0, AccountGroupId = 1, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(rev1);

                var rev2 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Indirect Income", AccountClassId = 4, AccountTypeId = 0, AccountGroupId = 1, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(rev2);
                _context.SaveChanges();

                var directrevaccounts = _context.Accounts.Where(c => c.Name == "Direct Income" && c.AccountClassId == 4).ToList(); //Assets
                foreach (Account account in directrevaccounts)
                {
                    var curlia1 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Goods Revenue", AccountClassId = 4, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 1, IsActive = 1 };
                    _context.Accounts.Add(curlia1);

                    var curlia2 = new Account { ParentNode = account.Id, Node = 2, Code = "0", Name = "Service Revenue", AccountClassId = 4, AccountTypeId = 0, AccountGroupId = 2, CompanyId = 1, IsChild = 1, IsActive = 1 };
                    _context.Accounts.Add(curlia2);
                }
                _context.SaveChanges();

                //Expenses//
                var cogs1 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Cost Of Sales", AccountClassId = 5, AccountTypeId = 0, AccountGroupId = 1, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(cogs1);

                var exp1 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Direct Expense", AccountClassId = 6, AccountTypeId = 0, AccountGroupId = 1, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(exp1);

                var exp2 = new Account { ParentNode = 0, Node = 1, Code = "0", Name = "Indirect Expense", AccountClassId = 6, AccountTypeId = 0, AccountGroupId = 1, CompanyId = 1, IsChild = 0, IsActive = 1 };
                _context.Accounts.Add(exp2);
                _context.SaveChanges();

               
            }
        }

        private void AddHolidaysIfNotExists()
        {
            if (!_context.Holidays.Any())
            {
                var holidays1 = new Holidays { Description = "New Year's Day", DateFrom = DateTime.Parse("01/01/2022"), DateTo = DateTime.Parse("01/01/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays2 = new Holidays { Description = "Chinese New Year", DateFrom = DateTime.Parse("02/05/2022"), DateTo = DateTime.Parse("02/05/2022"), Status = "Active", OTRateDescription = "Special Holiday", Rates = 30 };
                var holidays3 = new Holidays { Description = "Labor Day", DateFrom = DateTime.Parse("05/01/2022"), DateTo = DateTime.Parse("05/01/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays4 = new Holidays { Description = "Independence Day", DateFrom = DateTime.Parse("06/12/2022"), DateTo = DateTime.Parse("06/12/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays5 = new Holidays { Description = "National Heroes' Day", DateFrom = DateTime.Parse("08/26/2022"), DateTo = DateTime.Parse("08/26/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays6 = new Holidays { Description = "Bonifacio Day", DateFrom = DateTime.Parse("11/30/2022"), DateTo = DateTime.Parse("11/30/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays7 = new Holidays { Description = "Christmas Day", DateFrom = DateTime.Parse("12/25/2022"), DateTo = DateTime.Parse("12/25/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays8 = new Holidays { Description = "Rizal Day", DateFrom = DateTime.Parse("12/30/2022"), DateTo = DateTime.Parse("12/30/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };

                var holidays9 = new Holidays { Description = "Maundy Thursday", DateFrom = DateTime.Parse("04/18/2022"), DateTo = DateTime.Parse("04/18/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays10 = new Holidays { Description = "Good Friday", DateFrom = DateTime.Parse("04/19/2022"), DateTo = DateTime.Parse("04/19/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 100 };
                var holidays11 = new Holidays { Description = "Eid al-Fitr", DateFrom = DateTime.Parse("06/04/2022"), DateTo = DateTime.Parse("06/05/2022"), Status = "Active", OTRateDescription = "Special Holiday", Rates = 30 };
                var holidays12 = new Holidays { Description = "Eid al-Adha", DateFrom = DateTime.Parse("08/11/2022"), DateTo = DateTime.Parse("08/12/2022"), Status = "Active", OTRateDescription = "Legal Holiday", Rates = 30 };
                var holidays13 = new Holidays { Description = "All Saints' Day", DateFrom = DateTime.Parse("01/11/2022"), DateTo = DateTime.Parse("01/11/2022"), Status = "Active", OTRateDescription = "Special Holiday", Rates = 30 };

                _context.Holidays.Add(holidays1);
                _context.Holidays.Add(holidays2);
                _context.Holidays.Add(holidays3);
                _context.Holidays.Add(holidays4);
                _context.Holidays.Add(holidays5);
                _context.Holidays.Add(holidays6);
                _context.Holidays.Add(holidays7);
                _context.Holidays.Add(holidays8);
                _context.Holidays.Add(holidays9);
                _context.Holidays.Add(holidays10);
                _context.Holidays.Add(holidays11);
                _context.Holidays.Add(holidays12);
                _context.Holidays.Add(holidays13);
                _context.SaveChanges();
            }
        }

        
        private void AddJournalEntryStatusTypesIfNotExists()
        {
            if (!_context.JournalEntryStatusTypes.Any())
            {

                //Journal Status
                var add1 = new JournalEntryStatusTypes { StatusId = 1, Status = "Journal Entry" };
                //var add2 = new JournalEntryStatusTypes { StatusId = 2, Status = "Approved" };
                //var add3 = new JournalEntryStatusTypes { StatusId = 3, Status = "Posted" };

                _context.JournalEntryStatusTypes.Add(add1);
                //_context.JournalEntryStatusTypes.Add(add2);
                //_context.JournalEntryStatusTypes.Add(add3);

                _context.SaveChanges();
            }
        }
         private void AddPhilHealthIfNotExists()
        {
            if (!_context.PhilHealth.Any())
            {
                var PhilHealth1 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic= decimal.Parse("275.00"), Year = "2019", Percent = decimal.Parse("2.75") };
                var PhilHealth2 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic = decimal.Parse("300.00"), Year = "2020", Percent = decimal.Parse("3.00") };
                var PhilHealth3 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic = decimal.Parse("350.00"), Year = "2021", Percent = decimal.Parse("3.50") };
                var PhilHealth4 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic = decimal.Parse("300.00"), Year = "2022", Percent = decimal.Parse("3.00") };
                var PhilHealth5 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic = decimal.Parse("450.00"), Year = "2023", Percent = decimal.Parse("4.50") };
                var PhilHealth6 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic = decimal.Parse("500.00"), Year = "2024", Percent = decimal.Parse("5.00") };
                var PhilHealth7 = new PhilHealth { Name = "PhilHealth", Start = decimal.Parse("1.00"), End = decimal.Parse("10000.00"), basic = decimal.Parse("500.00"), Year = "2025", Percent = decimal.Parse("5.00") };

                _context.PhilHealth.Add(PhilHealth1);
                _context.PhilHealth.Add(PhilHealth2);
                _context.PhilHealth.Add(PhilHealth3);
                _context.PhilHealth.Add(PhilHealth4);
                _context.PhilHealth.Add(PhilHealth5);
                _context.PhilHealth.Add(PhilHealth6);
                _context.PhilHealth.Add(PhilHealth7);
                _context.SaveChanges();
            }
        }


        private void AddAttAdjustmentTypesIfNotExists()
        {
            if (!_context.AttAdjustmentTypes.Any())
            {
                var AttAdjustmentTypes1 = new AttAdjustmentTypes { Types = "Salary" , Status = 1};
                var AttAdjustmentTypes2 = new AttAdjustmentTypes { Types = "Absent", Status = 1 };
                var AttAdjustmentTypes3 = new AttAdjustmentTypes { Types = "Tardiness", Status = 1 };
                var AttAdjustmentTypes4 = new AttAdjustmentTypes { Types = "Undertime", Status = 1 };
                var AttAdjustmentTypes5 = new AttAdjustmentTypes { Types = "Leave", Status = 1 };
                var AttAdjustmentTypes6 = new AttAdjustmentTypes { Types = "Overtime", Status = 1 };
                var AttAdjustmentTypes7 = new AttAdjustmentTypes { Types = "Allowances", Status = 1 };
                var AttAdjustmentTypes8 = new AttAdjustmentTypes { Types = "Others", Status = 1 };
                var AttAdjustmentTypes9 = new AttAdjustmentTypes { Types = "Days", Status = 1 };

                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes1);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes2);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes3);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes4);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes5);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes6);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes7);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes8);
                _context.AttAdjustmentTypes.Add(AttAdjustmentTypes9);
                _context.SaveChanges();
            }
        }

        private void AddPagIbigIfNotExists()
        {
            if (!_context.PagIbig.Any())
            {
                var PagIbig1 = new PagIbig { Name = "PagIbig", Year = "2022", Percent = decimal.Parse("0.02"), Amount = decimal.Parse("100") };

                _context.PagIbig.Add(PagIbig1);
                _context.SaveChanges();
            }
        }

        private void AddRestdayIfNotExists()
        {
            if (!_context.EmployeeRestday.Any())
            {
                var Restday1 = new EmployeeRestday { EmpId = 0, Days = "SUN" };

                _context.EmployeeRestday.Add(Restday1);
                _context.SaveChanges();
            }
        }

        private void AddLoanTitleIfNotExists()
        {
            if (!_context.LoanTitle.Any())
            {
                var LoanTitle1 = new LoanTitle { LoanTitleName = "SSS" };
                var LoanTitle2 = new LoanTitle { LoanTitleName = "PAGIBIG" };
                var LoanTitle3 = new LoanTitle { LoanTitleName = "OTHERS" };

                _context.LoanTitle.Add(LoanTitle1);
                _context.LoanTitle.Add(LoanTitle2);
                _context.LoanTitle.Add(LoanTitle3);
                _context.SaveChanges();
            }
        }

        private void AddTaxIfNotExists()
        {
            if (!_context.Tax.Any())
            {
                var Tax1 = new Tax { Compensation = "1", Startamount = decimal.Parse("0"), EndAmount = decimal.Parse("685.99"), Percent = decimal.Parse("0"), Prescribe = decimal.Parse("0") };
                var Tax2 = new Tax { Compensation = "1", Startamount = decimal.Parse("686"), EndAmount = decimal.Parse("1095.99"), Percent = decimal.Parse("20"), Prescribe = decimal.Parse("0") };
                var Tax3 = new Tax { Compensation = "1", Startamount = decimal.Parse("1096"), EndAmount = decimal.Parse("2191.99"), Percent = decimal.Parse("25"), Prescribe = decimal.Parse("82.19") };
                var Tax4 = new Tax { Compensation = "1", Startamount = decimal.Parse("2192"), EndAmount = decimal.Parse("5478.99"), Percent = decimal.Parse("30"), Prescribe = decimal.Parse("356.16") };
                var Tax5 = new Tax { Compensation = "1", Startamount = decimal.Parse("5479"), EndAmount = decimal.Parse("21917.99"), Percent = decimal.Parse("32"), Prescribe = decimal.Parse("1342.47") };
                var Tax6 = new Tax { Compensation = "1", Startamount = decimal.Parse("21918"), EndAmount = decimal.Parse("1000000"), Percent = decimal.Parse("35"), Prescribe = decimal.Parse("6602.74") };
                var Tax7 = new Tax { Compensation = "2", Startamount = decimal.Parse("0"), EndAmount = decimal.Parse("4808.99"), Percent = decimal.Parse("0"), Prescribe = decimal.Parse("0") };
                var Tax8 = new Tax { Compensation = "2", Startamount = decimal.Parse("4809"), EndAmount = decimal.Parse("7691.99"), Percent = decimal.Parse("20"), Prescribe = decimal.Parse("0") };
                var Tax9 = new Tax { Compensation = "2", Startamount = decimal.Parse("7692"), EndAmount = decimal.Parse("15384.99"), Percent = decimal.Parse("25"), Prescribe = decimal.Parse("576.92") };
                var Tax10 = new Tax { Compensation = "2", Startamount = decimal.Parse("15385"), EndAmount = decimal.Parse("38461.99"), Percent = decimal.Parse("30"), Prescribe = decimal.Parse("2500") };
                var Tax11 = new Tax { Compensation = "2", Startamount = decimal.Parse("38462"), EndAmount = decimal.Parse("153845"), Percent = decimal.Parse("32"), Prescribe = decimal.Parse("9423.08") };
                var Tax12 = new Tax { Compensation = "2", Startamount = decimal.Parse("153845.99"), EndAmount = decimal.Parse("1000000"), Percent = decimal.Parse("35"), Prescribe = decimal.Parse("46346.15") };
                var Tax13 = new Tax { Compensation = "3", Startamount = decimal.Parse("0"), EndAmount = decimal.Parse("10417.99"), Percent = decimal.Parse("0"), Prescribe = decimal.Parse("0") };
                var Tax14 = new Tax { Compensation = "3", Startamount = decimal.Parse("10418"), EndAmount = decimal.Parse("16666.99"), Percent = decimal.Parse("20"), Prescribe = decimal.Parse("0") };
                var Tax15 = new Tax { Compensation = "3", Startamount = decimal.Parse("16667"), EndAmount = decimal.Parse("33332.99"), Percent = decimal.Parse("25"), Prescribe = decimal.Parse("1250") };
                var Tax16 = new Tax { Compensation = "3", Startamount = decimal.Parse("33333"), EndAmount = decimal.Parse("83332.99"), Percent = decimal.Parse("30"), Prescribe = decimal.Parse("5416.67") };
                var Tax17 = new Tax { Compensation = "3", Startamount = decimal.Parse("83333"), EndAmount = decimal.Parse("333332.99"), Percent = decimal.Parse("32"), Prescribe = decimal.Parse("20416.67") };
                var Tax18 = new Tax { Compensation = "3", Startamount = decimal.Parse("333333"), EndAmount = decimal.Parse("1000000"), Percent = decimal.Parse("35"), Prescribe = decimal.Parse("100416.67") };
                var Tax19 = new Tax { Compensation = "4", Startamount = decimal.Parse("0"), EndAmount = decimal.Parse("20833.99"), Percent = decimal.Parse("0"), Prescribe = decimal.Parse("0") };
                var Tax20 = new Tax { Compensation = "4", Startamount = decimal.Parse("20834"), EndAmount = decimal.Parse("33332.99"), Percent = decimal.Parse("20"), Prescribe = decimal.Parse("0") };
                var Tax21 = new Tax { Compensation = "4", Startamount = decimal.Parse("33333"), EndAmount = decimal.Parse("66666.99"), Percent = decimal.Parse("25"), Prescribe = decimal.Parse("2500") };
                var Tax22 = new Tax { Compensation = "4", Startamount = decimal.Parse("66667"), EndAmount = decimal.Parse("166666.99"), Percent = decimal.Parse("30"), Prescribe = decimal.Parse("10833.33") };
                var Tax23 = new Tax { Compensation = "4", Startamount = decimal.Parse("166667"), EndAmount = decimal.Parse("666666.99"), Percent = decimal.Parse("32"), Prescribe = decimal.Parse("40833.33") };
                var Tax24 = new Tax { Compensation = "4", Startamount = decimal.Parse("666667"), EndAmount = decimal.Parse("1000000"), Percent = decimal.Parse("35"), Prescribe = decimal.Parse("200833.33") };

                _context.Tax.Add(Tax1);
                _context.Tax.Add(Tax2);
                _context.Tax.Add(Tax3);
                _context.Tax.Add(Tax4);
                _context.Tax.Add(Tax5);
                _context.Tax.Add(Tax6);
                _context.Tax.Add(Tax7);
                _context.Tax.Add(Tax8);
                _context.Tax.Add(Tax9);
                _context.Tax.Add(Tax10);
                _context.Tax.Add(Tax11);
                _context.Tax.Add(Tax12);
                _context.Tax.Add(Tax13);
                _context.Tax.Add(Tax14);
                _context.Tax.Add(Tax15);
                _context.Tax.Add(Tax16);
                _context.Tax.Add(Tax17);
                _context.Tax.Add(Tax18);
                _context.Tax.Add(Tax19);
                _context.Tax.Add(Tax20);
                _context.Tax.Add(Tax21);
                _context.Tax.Add(Tax22);
                _context.Tax.Add(Tax23);
                _context.Tax.Add(Tax24);

                _context.SaveChanges();
            }

        }

        private void AddLeaveTypeifNotExists()
        {
            if (!_context.EmpLeaves.Any())
            {
                var mode1 = new EmpLeaves { Name = "SICK LEAVE", Status = 0 };
                var mode2 = new EmpLeaves { Name = "VACATION LEAVE", Status = 0 };
                var mode3 = new EmpLeaves { Name = "PATERNITY LEAVE", Status = 0 };
                var mode4 = new EmpLeaves { Name = "INCENTIVE LEAVE", Status = 0 };
                _context.EmpLeaves.Add(mode1);
                _context.EmpLeaves.Add(mode2);
                _context.EmpLeaves.Add(mode3);
                _context.EmpLeaves.Add(mode4);
                _context.SaveChanges();
            }
        }

    }
}
