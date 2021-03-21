package com.peterith.supportticketportalserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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
}
