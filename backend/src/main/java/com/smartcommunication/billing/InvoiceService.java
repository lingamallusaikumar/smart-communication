package com.smartcommunication.billing;

import com.smartcommunication.customers.Customer;
import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.deals.Deal;
import com.smartcommunication.deals.DealRepository;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@Transactional
public class InvoiceService {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");

    private final InvoiceRepository invoiceRepository;
    private final InvoiceLineItemRepository lineItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final OrganizationRepository organizationRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          InvoiceLineItemRepository lineItemRepository,
                          ProductRepository productRepository,
                          CustomerRepository customerRepository,
                          DealRepository dealRepository,
                          OrganizationRepository organizationRepository) {
        this.invoiceRepository = invoiceRepository;
        this.lineItemRepository = lineItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Invoice> getAllInvoices(UUID orgId) {
        return invoiceRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public Invoice getInvoiceById(UUID id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
    }

    public Invoice createInvoice(Invoice invoice, UUID orgId, UUID customerId, UUID dealId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found: " + orgId));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));

        invoice.setOrganization(org);
        invoice.setCustomer(customer);

        if (dealId != null) {
            Deal deal = dealRepository.findById(dealId).orElse(null);
            invoice.setDeal(deal);
        }

        invoice.setInvoiceNumber(generateInvoiceNumber(orgId));
        invoice.setStatus("DRAFT");
        if (invoice.getIssueDate() == null) {
            invoice.setIssueDate(LocalDate.now());
        }
        if (invoice.getDueDate() == null) {
            invoice.setDueDate(LocalDate.now().plusDays(30));
        }
        invoice.setCreatedAt(ZonedDateTime.now());
        invoice.setUpdatedAt(ZonedDateTime.now());

        recalculateTotals(invoice);
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoiceStatus(UUID id, String status) {
        Invoice invoice = getInvoiceById(id);
        String oldStatus = invoice.getStatus();

        List<String> validStatuses = List.of("DRAFT", "SENT", "PAID", "CANCELLED", "OVERDUE");
        if (!validStatuses.contains(status)) {
            throw new RuntimeException("Invalid invoice status: " + status + ". Valid: " + validStatuses);
        }

        if ("PAID".equals(oldStatus) && !"CANCELLED".equals(status)) {
            throw new RuntimeException("Cannot change status of a PAID invoice to " + status);
        }
        if ("CANCELLED".equals(oldStatus)) {
            throw new RuntimeException("Cannot change status of a CANCELLED invoice");
        }

        invoice.setStatus(status);
        invoice.setUpdatedAt(ZonedDateTime.now());
        return invoiceRepository.save(invoice);
    }

    public Invoice addLineItem(UUID invoiceId, InvoiceLineItem item, UUID productId) {
        Invoice invoice = getInvoiceById(invoiceId);

        if (productId != null) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
            item.setProduct(product);
            if (item.getDescription() == null || item.getDescription().isBlank()) {
                item.setDescription(product.getName());
            }
            if (item.getUnitPrice().compareTo(BigDecimal.ZERO) == 0) {
                item.setUnitPrice(product.getUnitPrice());
            }
        }

        BigDecimal lineTotal = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
        item.setTotal(lineTotal.setScale(2, RoundingMode.HALF_UP));

        invoice.addLineItem(item);
        recalculateTotals(invoice);
        invoice.setUpdatedAt(ZonedDateTime.now());
        return invoiceRepository.save(invoice);
    }

    public Invoice removeLineItem(UUID invoiceId, UUID lineItemId) {
        Invoice invoice = getInvoiceById(invoiceId);
        InvoiceLineItem item = lineItemRepository.findById(lineItemId)
                .orElseThrow(() -> new RuntimeException("Line item not found: " + lineItemId));

        invoice.removeLineItem(item);
        lineItemRepository.delete(item);
        recalculateTotals(invoice);
        invoice.setUpdatedAt(ZonedDateTime.now());
        return invoiceRepository.save(invoice);
    }

    public void recalculateTotals(Invoice invoice) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (InvoiceLineItem item : invoice.getLineItems()) {
            BigDecimal lineTotal = item.getUnitPrice()
                    .multiply(new BigDecimal(item.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            item.setTotal(lineTotal);
            subtotal = subtotal.add(lineTotal);
        }
        BigDecimal taxTotal = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = subtotal.add(taxTotal).setScale(2, RoundingMode.HALF_UP);

        invoice.setSubtotal(subtotal);
        invoice.setTaxTotal(taxTotal);
        invoice.setGrandTotal(grandTotal);
    }

    public String generateInvoiceNumber(UUID orgId) {
        long count = invoiceRepository.countByOrganizationId(orgId);
        return "INV-" + String.format("%05d", count + 1001);
    }

    public List<Invoice> getInvoicesByStatus(UUID orgId, String status) {
        return invoiceRepository.findByOrganizationIdAndStatus(orgId, status);
    }

    public List<Invoice> getInvoicesByCustomer(UUID orgId, UUID customerId) {
        return invoiceRepository.findByOrganizationIdAndCustomerId(orgId, customerId);
    }

    public Map<String, Object> getBillingMetrics(UUID orgId) {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalInvoices", invoiceRepository.countByOrganizationId(orgId));
        metrics.put("draftCount", invoiceRepository.countByOrganizationIdAndStatus(orgId, "DRAFT"));
        metrics.put("sentCount", invoiceRepository.countByOrganizationIdAndStatus(orgId, "SENT"));
        metrics.put("paidCount", invoiceRepository.countByOrganizationIdAndStatus(orgId, "PAID"));
        metrics.put("overdueCount", invoiceRepository.countByOrganizationIdAndStatus(orgId, "OVERDUE"));
        metrics.put("cancelledCount", invoiceRepository.countByOrganizationIdAndStatus(orgId, "CANCELLED"));
        metrics.put("totalRevenue", invoiceRepository.sumGrandTotalByOrganizationId(orgId));
        metrics.put("paidRevenue", invoiceRepository.sumGrandTotalByOrganizationIdAndStatus(orgId, "PAID"));
        metrics.put("pendingRevenue", invoiceRepository.sumGrandTotalByOrganizationIdAndStatus(orgId, "SENT"));
        metrics.put("overdueRevenue", invoiceRepository.sumGrandTotalByOrganizationIdAndStatus(orgId, "OVERDUE"));
        return metrics;
    }
}
