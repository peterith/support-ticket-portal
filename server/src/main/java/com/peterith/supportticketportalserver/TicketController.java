package com.peterith.supportticketportalserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class TicketController {

    @Autowired
    TicketService ticketService;

    @GetMapping("/tickets")
    public ResponseEntity<List<Ticket>> findAll() {
        List<Ticket> tickets = ticketService.findAll();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<Ticket> findById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketService.findById(id);
        return ticket.map(t -> ResponseEntity.ok(t)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/tickets")
    public ResponseEntity create(@RequestBody Ticket ticket) {
        try {
            Ticket createdTicket = ticketService.create(ticket);
            return ResponseEntity.ok(createdTicket);
        } catch (ConstraintViolationException cve) {
            String constraintViolations = getConstraintViolations(cve);
            return ResponseEntity.unprocessableEntity().body(constraintViolations);
        }
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        ticketService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/tickets/{id}")
    public ResponseEntity updateById(@PathVariable Long id, @RequestBody Ticket ticket) {
        try {
            Ticket updatedTicket = ticketService.updateById(id, ticket);
            return ResponseEntity.ok(updatedTicket);
        } catch (NoSuchElementException nsee) {
            return ResponseEntity.notFound().build();
        } catch (ConstraintViolationException cve) {
            String constraintViolations = getConstraintViolations(cve);
            return ResponseEntity.unprocessableEntity().body(constraintViolations);
        }
    }

    private String getConstraintViolations(ConstraintViolationException cve) {
        return cve.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining());
    }
}
