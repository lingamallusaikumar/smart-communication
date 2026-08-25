package com.smartcommunication.billing;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/billing/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfGeneratorService pdfGeneratorService;

    public InvoiceController(InvoiceService invoiceService, PdfGeneratorService pdfGeneratorService) {
        this.invoiceService = invoiceService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices(@RequestParam UUID orgId) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice,
                                                  @RequestParam UUID orgId,
                                                  @RequestParam UUID customerId,
                                                  @RequestParam(required = false) UUID dealId) {
        return ResponseEntity.ok(invoiceService.createInvoice(invoice, orgId, customerId, dealId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Invoice> updateInvoiceStatus(@PathVariable UUID id,
                                                        @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(id, status));
    }

    @PostMapping("/{id}/line-items")
    public ResponseEntity<Invoice> addLineItem(@PathVariable UUID id,
                                                @RequestBody InvoiceLineItem item,
                                                @RequestParam(required = false) UUID productId) {
        return ResponseEntity.ok(invoiceService.addLineItem(id, item, productId));
    }

    @DeleteMapping("/{id}/line-items/{lineItemId}")
    public ResponseEntity<Invoice> removeLineItem(@PathVariable UUID id,
                                                   @PathVariable UUID lineItemId) {
        return ResponseEntity.ok(invoiceService.removeLineItem(id, lineItemId));
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<Invoice>> getInvoicesByStatus(@RequestParam UUID orgId,
                                                              @RequestParam String status) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(orgId, status));
    }

    @GetMapping("/by-customer")
    public ResponseEntity<List<Invoice>> getInvoicesByCustomer(@RequestParam UUID orgId,
                                                                @RequestParam UUID customerId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByCustomer(orgId, customerId));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getBillingMetrics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(invoiceService.getBillingMetrics(orgId));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable UUID id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        byte[] pdfBytes = pdfGeneratorService.generateInvoicePdf(invoice);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", invoice.getInvoiceNumber() + ".pdf");
        headers.setCacheControl("no-cache, no-store, must-revalidate");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
