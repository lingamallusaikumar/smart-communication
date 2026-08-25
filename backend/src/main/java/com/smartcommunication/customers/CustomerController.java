package com.smartcommunication.customers;

import com.smartcommunication.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable UUID id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer,
                                                    @RequestParam(required = false) UUID companyId,
                                                    @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(customerService.createCustomer(customer, companyId, currentUser));
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<List<CustomerNote>> getNotes(@PathVariable UUID id) {
        return ResponseEntity.ok(customerService.getCustomerNotes(id));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<CustomerNote> addNote(@PathVariable UUID id,
                                                @RequestBody Map<String, String> body,
                                                @AuthenticationPrincipal User currentUser) {
        String content = body.get("content");
        return ResponseEntity.ok(customerService.addCustomerNote(id, content, currentUser));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<CustomerActivity>> getTimeline(@PathVariable UUID id) {
        return ResponseEntity.ok(customerService.getCustomerTimeline(id));
    }
}
