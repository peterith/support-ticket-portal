package com.peterith.supportticketportalserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class TicketController extends Controller<Ticket> {

    @Autowired
    TicketService ticketService;

    @GetMapping("/tickets")
    public ResponseEntity<List<Ticket>> findAll() {
        List<Ticket> tickets = ticketService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(tickets);
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<Ticket> findById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketService.findById(id);
        return ticket.map(toResponseEntity).orElseGet(notFoundResponseEntity);
    }

    @PostMapping("/tickets")
    public ResponseEntity<Ticket> create(@RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.create((ticket));
        return ResponseEntity.status(HttpStatus.OK).body(createdTicket);
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        ticketService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
