﻿using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace ezinvmvc.Authorization
{
    public class ezinvmvcAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {

            context.CreatePermission(PermissionNames.Master_Accounts, L("Accounts")); //localized
            context.CreatePermission(PermissionNames.Master_Accounts_Create, L("AccountsCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Accounts_Edit, L("AccountsEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Accounts_Delete, L("AccountsDelete")); //localized
            context.CreatePermission(PermissionNames.Master_Accounts_Export, L("AccountsExport")); //localized


            context.CreatePermission(PermissionNames.Pages_Stock_Summary, L("StockSummary")); //localized
            context.CreatePermission(PermissionNames.Pages_Stock_Card, L("StockCard")); //localized
            context.CreatePermission(PermissionNames.Pages_Stock_Entry, L("StockEntry")); //localized
            context.CreatePermission(PermissionNames.Pages_Stock_Entry_Create, L("StockEntryCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Stock_Entry_Edit, L("StockEntryEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Stock_Entry_Delete, L("StockEntryDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Stock_Entry_Export, L("StockEntryExport")); //localized
            context.CreatePermission(PermissionNames.Pages_Stock_Entry_Submit, L("StockEntrySubmit")); //localized

            context.CreatePermission(PermissionNames.Pages_Quotations, L("Quotations")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_AllAccounts, L("QuotationsAllAccounts")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_AccountExecutive, L("QuotationsAccountExecutive")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_AllAssigned, L("QuotationsAllAssigned")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_SalesCoordinator, L("QuotationsSalesCoordinator")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_Create, L("QuotationsCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_Edit, L("QuotationsEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Quotations_Delete, L("QuotationsDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_Export, L("QuotationsExport")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_Submit, L("QuotationsSubmit")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_ForOrder, L("QuotationsForOrder"));
            context.CreatePermission(PermissionNames.Pages_Quotations_Documents, L("QuotationsDocuments")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_EditPDF, L("QuotationsEditPDF")); //localized
            context.CreatePermission(PermissionNames.Pages_Quotations_SubmitPDF, L("QuotationsSubmitPDF")); //localized

            context.CreatePermission(PermissionNames.Pages_Sales_Orders, L("SalesOrders")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Orders_Create, L("SalesOrdersCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Orders_Edit, L("SalesOrdersEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Orders_ForDelivery, L("SalesOrdersForDelivery")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Orders_Revision, L("SalesOrdersRevision")); //localized
            //context.CreatePermission(PermissionNames.Pages_Sales_Orders_Delete, L("SalesOrdersDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Orders_Export, L("SalesOrdersExport")); //localized

            context.CreatePermission(PermissionNames.Pages_Journal_Entry, L("JournalEntry")); //localized
            context.CreatePermission(PermissionNames.Pages_Journal_Entry_Create, L("JournalEntryCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Journal_Entry_Edit, L("JournalEntryEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Journal_Entry_Delete, L("JournalEntryDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Journal_Entry_Export, L("JournalEntryExport")); //localized

            context.CreatePermission(PermissionNames.Pages_Rfp, L("RFP")); //localized
            //context.CreatePermission(PermissionNames.Pages_Rfp_AllAccounts, L("RFPAllAccounts")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfp_Create, L("RFPCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfp_Edit, L("RFPEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfp_Approve, L("RFPApprove")); //localized
            //context.CreatePermission(PermissionNames.Pages_Rfp_Delete, L("RFPDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfp_Export, L("RFPExport")); //localized
            //context.CreatePermission(PermissionNames.Pages_Rfp_Assign, L("RFPAssign")); //localized

            context.CreatePermission(PermissionNames.Pages_Cv, L("CV")); //localized
            //context.CreatePermission(PermissionNames.Pages_Cv_AllAccounts, L("CVAllAccounts"));
            context.CreatePermission(PermissionNames.Pages_Cv_Create, L("CVCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Cv_Edit, L("CVEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Cv_Delete, L("CVDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Cv_Export, L("CVExport")); //localized

            context.CreatePermission(PermissionNames.Pages_CashVoucher, L("CashVoucher")); //localized
            //context.CreatePermission(PermissionNames.Pages_CashVoucher_AllAccounts, L("CashVoucherAllAccounts"));
            context.CreatePermission(PermissionNames.Pages_CashVoucher_Create, L("CashVoucherCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_CashVoucher_Edit, L("CashVoucherEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_CashVoucher_Delete, L("CashVoucherDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_CashVoucher_Export, L("CashVoucherExport")); //localized

            context.CreatePermission(PermissionNames.Pages_Purchase_Orders, L("PurchaseOrders")); //localized
            context.CreatePermission(PermissionNames.Pages_Invoices, L("Invoices")); //localized

            context.CreatePermission(PermissionNames.Pages_Rfq, L("RFQ")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_AllAccounts, L("RFQAllAccounts")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_AccountExecutive, L("RFQAccountExecutive")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_AllAssigned, L("RFQAllAssigned")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_SalesCoordinator, L("RFQSalesCoordinator")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_Create, L("RFQCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_Edit, L("RFQEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Rfq_Delete, L("RFQDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_Export, L("RFQExport")); //localized
            context.CreatePermission(PermissionNames.Pages_Rfq_Assign, L("RFQAssign")); //localized

            context.CreatePermission(PermissionNames.Pages_Assignment, L("Assignment")); //localized
            context.CreatePermission(PermissionNames.Pages_Assignment_AllAccounts, L("AssignAllAccounts")); //localized
            context.CreatePermission(PermissionNames.Pages_Assignment_Create, L("AssignmentCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Assignment_Edit, L("AssignmentEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Assignment_Delete, L("AssignmentDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Assignment_Export, L("AssignmentExport")); //localized

            context.CreatePermission(PermissionNames.Pages_StockTransfers, L("StockTransfers")); //localized

            context.CreatePermission(PermissionNames.Pages_Users, L("Users")); //localized
            context.CreatePermission(PermissionNames.Pages_Users_Create, L("UsersCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Users_Edit, L("UsersEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_Users_Delete, L("UsersDelete")); //localized

            context.CreatePermission(PermissionNames.Master_Roles, L("Roles")); //localized
            context.CreatePermission(PermissionNames.Master_Roles_Create, L("RolesCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Roles_Edit, L("RolesEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Roles_Delete, L("RolesDelete")); //localized

            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host); //localized

            context.CreatePermission(PermissionNames.Master_Warehouse, L("Warehouse")); //localized
            context.CreatePermission(PermissionNames.Master_Warehouse_Create, L("WarehouseCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Warehouse_Edit, L("WarehouseEdit")); //localized
            //context.CreatePermission(PermissionNames.Master_Warehouse_Delete, L("WarehouseDelete")); //localized

            //context.CreatePermission(PermissionNames.Master_Buyers, L("Buyers"));

            context.CreatePermission(PermissionNames.Master_Clients, L("Clients")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_AllAccounts, L("ClientsAllAccounts")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_AccountExecutive, L("ClientsAccountExecutive")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_Create, L("ClientCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_Details, L("ClientDetails")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_Edit, L("ClientEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_Approve, L("ClientApprove")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_Delete, L("ClientDelete")); //localized
            context.CreatePermission(PermissionNames.Master_Clients_Export, L("ClientExport")); //localized
            context.CreatePermission(PermissionNames.Client_ContactPerson_Edit, L("ClientContactPersonEdit")); //localized
            context.CreatePermission(PermissionNames.Client_ContactPerson_Delete, L("ClientContactPersonDelete")); //localized

            context.CreatePermission(PermissionNames.CRM_Leads, L("Leads"));  //localized
            context.CreatePermission(PermissionNames.CRM_Leads_AllAccounts, L("LeadsAllAccounts")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_AccountExecutive, L("LeadsAccountExecutive")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_Create, L("LeadCreate")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_Edit, L("LeadEdit")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_Approve, L("LeadApprove")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_Close, L("LeadClose")); //localized
            //context.CreatePermission(PermissionNames.CRM_Leads_Delete, L("LeadDelete")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_Updates, L("LeadUpdates")); //localized
            context.CreatePermission(PermissionNames.CRM_Leads_Export, L("LeadExport")); //localized

            context.CreatePermission(PermissionNames.Master_Vendors, L("Vendors")); //localized

            context.CreatePermission(PermissionNames.Master_Vendors_Create, L("VendorCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Vendors_Edit, L("VendorEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Vendors_Delete, L("VendorDelete")); //localized
            context.CreatePermission(PermissionNames.Master_Vendors_Export, L("VendorExport")); //localized

            context.CreatePermission(PermissionNames.Master_Products, L("Products")); //localized
            context.CreatePermission(PermissionNames.Master_Products_Create, L("ProductCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Products_Edit, L("ProductEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Products_Delete, L("ProductDelete")); //localized
            context.CreatePermission(PermissionNames.Master_Products_Export, L("ProductExport")); //localized

            context.CreatePermission(PermissionNames.Master_ExpenseItems, L("ExpenseItems")); //localized
            context.CreatePermission(PermissionNames.Master_ExpenseItems_Create, L("ExpenseItemCreate")); //localized
            context.CreatePermission(PermissionNames.Master_ExpenseItems_Edit, L("ExpenseItemEdit")); //localized
            context.CreatePermission(PermissionNames.Master_ExpenseItems_Delete, L("ExpenseItemDelete")); //localized
            context.CreatePermission(PermissionNames.Master_ExpenseItems_Export, L("ExpenseItemExport")); //localized

            context.CreatePermission(PermissionNames.Master_Employees, L("Employees")); //localized
            context.CreatePermission(PermissionNames.Master_Employees_Create, L("EmployeesCreate")); //localized
            context.CreatePermission(PermissionNames.Master_Employees_Edit, L("EmployeesEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Employees_Delete, L("EmployeesDelete")); //localized
            context.CreatePermission(PermissionNames.Master_Employees_Export, L("EmployeesExport")); //localized
            context.CreatePermission(PermissionNames.Pages_Accounts_Ability, L("AccountsAbility")); //localized
            context.CreatePermission(PermissionNames.Pages_Employee_Records, L("EmployeesRecords")); //localized
            context.CreatePermission(PermissionNames.Pages_Employee_Salary_Rates, L("EmployeePayrollRate")); //localized
            context.CreatePermission(PermissionNames.Pages_Employee_Allowance, L("EmployeeAllowance")); //localized
            context.CreatePermission(PermissionNames.Pages_Employee_OTRates, L("EmployeeOTRates")); //localized
            context.CreatePermission(PermissionNames.Payroll_Rate, L("PayrollRate")); //localized
            context.CreatePermission(PermissionNames.Pages_Overtime_Rates, L("OTRate")); //localized
            context.CreatePermission(PermissionNames.Pages_Employee_Loan, L("EmployeeLoan")); //localized

            context.CreatePermission(PermissionNames.Pages_Attendance, L("Attendance")); //localized
            context.CreatePermission(PermissionNames.Pages_Attendance2, L("Attendance2")); //localized
            context.CreatePermission(PermissionNames.Pages_Adjustment, L("Adjustment")); //localized
            context.CreatePermission(PermissionNames.Pages_EmpAttendance, L("EmployeeAttendance")); //localized
            context.CreatePermission(PermissionNames.Pages_AttendanceApprover, L("AttendanceApprover")); //localized

            context.CreatePermission(PermissionNames.Master_GroupTypes, L("GroupTypes")); //localized

            context.CreatePermission(PermissionNames.Pages_Sales_Invoice, L("SalesInvoice")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Invoice_Create, L("SalesInvoiceCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Invoice_Edit, L("SalesInvoiceEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_Sales_Invoice_Export, L("SalesInvoiceExport")); //localized

            context.CreatePermission(PermissionNames.Pages_Delivery_Receipt, L("DeliveryReceipt")); //localized
            context.CreatePermission(PermissionNames.Pages_Delivery_Receipt_Create, L("DeliveryReceiptCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Delivery_Receipt_Edit, L("DeliveryReceiptEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_Delivery_Receipt_Submit, L("DeliveryReceiptSubmit")); //localized
            context.CreatePermission(PermissionNames.Pages_Delivery_Receipt_Export, L("DeliveryReceiptExport")); //localized

            context.CreatePermission(PermissionNames.Pages_Collections, L("Collection")); //localized
            context.CreatePermission(PermissionNames.Pages_Collections_Export, L("CollectionExport")); //localized
            context.CreatePermission(PermissionNames.Pages_Collections_Create, L("CollectionCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Collections_Edit, L("CollectionEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Collections_Delete, L("CollectionDelete")); //localized

            context.CreatePermission(PermissionNames.Pages_Accounts_Payable, L("AccountPayable")); //localized
            context.CreatePermission(PermissionNames.Pages_Accounts_Receivable, L("AccountReceivable")); //localized
            context.CreatePermission(PermissionNames.Pages_General_Ledger, L("GeneralLedger")); //localized
            context.CreatePermission(PermissionNames.Pages_Payroll, L("Payroll")); //localized
            context.CreatePermission(PermissionNames.Payroll_Entry, L("PayrollEntry")); //localized
            context.CreatePermission(PermissionNames.Payroll_Report, L("PayrollReport")); //localized


            context.CreatePermission(PermissionNames.Pages_Company, L("Company")); //localized
            context.CreatePermission(PermissionNames.Pages_Company_AllAccounts, L("CompanyAllAccounts")); //localized
            context.CreatePermission(PermissionNames.Pages_Company_Create, L("CompanyCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_Company_Edit, L("CompanyEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_Company_Delete, L("CompanyDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Company_Export, L("CompanyExport")); //localized

            context.CreatePermission(PermissionNames.Pages_ChartAccount, L("ChartAccount")); //localized
            context.CreatePermission(PermissionNames.Pages_ChartAccount_Create, L("ChartAccountCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_ChartAccount_Edit, L("ChartAccountEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_ChartAccount_Delete, L("ChartAccountDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_ChartAccount_Export, L("ChartAccountExport")); //localized

            context.CreatePermission(PermissionNames.Pages_TaxType, L("TaxType")); //localized
            context.CreatePermission(PermissionNames.Pages_TaxType_Create, L("TaxTypeCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_TaxType_Edit, L("TaxTypeEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_TaxType_Delete, L("TaxTypeDelete")); //localized

            context.CreatePermission(PermissionNames.Pages_SeriesType, L("SeriesType")); //localized
            //context.CreatePermission(PermissionNames.Pages_SeriesType_Create, L("SeriesTypeCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_SeriesType_Edit, L("SeriesTypeEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_SeriesType_Delete, L("SeriesTypeDelete")); //localized

            context.CreatePermission(PermissionNames.Pages_PaymentTerm, L("PaymentTerm")); //localized
            context.CreatePermission(PermissionNames.Pages_PaymentTerm_Create, L("PaymentTermCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_PaymentTerm_Edit, L("PaymentTermEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_TaxType_Delete, L("TaxTypeDelete")); //localized

            context.CreatePermission(PermissionNames.Pages_WarrantyType, L("WarrantyType")); //localized
            context.CreatePermission(PermissionNames.Pages_WarrantyType_Create, L("WarrantyTypeCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_WarrantyType_Edit, L("WarrantyTypeEdit")); //localized
            //context.CreatePermission(PermissionNames.Pages_TaxType_Delete, L("TaxTypeDelete")); //localized
            
            context.CreatePermission(PermissionNames.Pages_PaymentMode, L("PaymentMode")); //localized
            context.CreatePermission(PermissionNames.Pages_PaymentMode_Create, L("PaymentModeCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_PaymentMode_Edit, L("PaymentModeEdit")); //localized
            context.CreatePermission(PermissionNames.Payroll_Akcnowledgement, L("PayrollAkcnowledgement")); //localized
            context.CreatePermission(PermissionNames.Acknowledgement_NetPayPrint, L("AcknowledgementNetPayPrint")); //localized

            context.CreatePermission(PermissionNames.AttAdjReport, L("AttAdjReport")); //localized
            context.CreatePermission(PermissionNames.PRSummaryReport, L("PRSummaryReport")); //localized
            context.CreatePermission(PermissionNames.SSSummaryReport, L("SSSummaryReport")); //localized
            context.CreatePermission(PermissionNames.PhltSummaryReport, L("PhltSummaryReport")); //localized
            context.CreatePermission(PermissionNames.PgbSummaryReport, L("PgbSummaryReport")); //localized
            context.CreatePermission(PermissionNames.OTAdjSummaryReport, L("OTAdjSummaryReport")); //localized
            context.CreatePermission(PermissionNames.LoanSummaryReport, L("LoanSummaryReport")); //localized
            context.CreatePermission(PermissionNames.AttAdjSummaryReport, L("AttAdjSummaryReport")); //localized
            context.CreatePermission(PermissionNames.PayrollDetailReport, L("PayrollDetailReport")); //localized
            context.CreatePermission(PermissionNames.SalesOrderReport, L("SalesOrderReport")); //localized
            context.CreatePermission(PermissionNames.Pages_TPC_Update, L("TPCUpdate")); //localized
            context.CreatePermission(PermissionNames.SalesOrderSummaryReport, L("SalesOrderSummaryReport")); //localized
            context.CreatePermission(PermissionNames.Month13, L("Month13")); //localized
            context.CreatePermission(PermissionNames.PayrollJournalDetails, L("PayrollJournalDetails")); //localized
            context.CreatePermission(PermissionNames.Employee201Report, L("Employee201Report")); //localized
            context.CreatePermission(PermissionNames.EmployeeMasterListReport, L("EmployeeMasterListReport")); //localized
            context.CreatePermission(PermissionNames.RateMasterListReport, L("RateMasterListReport")); //localized
            context.CreatePermission(PermissionNames.LoanCollectionList, L("LoanCollectionList")); //localized
            context.CreatePermission(PermissionNames.LoanSummaryReportList, L("LoanSummaryReportList")); //localized
            context.CreatePermission(PermissionNames.PremiumDeductionReport, L("PremiumDeductionReport")); //localized
            context.CreatePermission(PermissionNames.OTSummaryReport, L("OTSummaryReport")); //localized

            context.CreatePermission(PermissionNames.Pages_OrderType, L("OrderType")); //localized
            context.CreatePermission(PermissionNames.Pages_OrderType_Create, L("OrderTypeCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_OrderType_Edit, L("OrderTypeEdit")); //localized

            context.CreatePermission(PermissionNames.Pages_ChargeType, L("ChargeType")); //localized
            context.CreatePermission(PermissionNames.Pages_ChargeType_Create, L("ChargeTypeCreate")); //localized
            context.CreatePermission(PermissionNames.Pages_ChargeType_Edit, L("ChargeTypeEdit")); //localized
            context.CreatePermission(PermissionNames.Pages_Payroll_Edit, L("PagesPayrollEdit")); //localized

            context.CreatePermission(PermissionNames.Master_Employee_Loan_Edit, L("EmployeeLoanEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Employee_Loan_Delete, L("EmployeeLoanDelete")); //localized
            context.CreatePermission(PermissionNames.Pages_Dashboard_Traffic, L("DashboardTraffic")); //localized

            context.CreatePermission(PermissionNames.Master_Allowance_Edit, L("AllowanceEdit")); //localized
            context.CreatePermission(PermissionNames.Master_Allowance_Delete, L("AllowanceDelete")); //localized

        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, ezinvmvcConsts.LocalizationSourceName);
        }
    }
}
