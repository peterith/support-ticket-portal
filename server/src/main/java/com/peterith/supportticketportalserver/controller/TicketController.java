package com.peterith.supportticketportalserver.controller;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import com.peterith.supportticketportalserver.exception.AgentNotFoundException;
import com.peterith.supportticketportalserver.exception.AuthorNotFoundException;
import com.peterith.supportticketportalserver.security.MyUserDetails;
import com.peterith.supportticketportalserver.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        List<TicketDTO> dtos = ticketService.findAll();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/tickets")
    public ResponseEntity createTicket(@RequestBody CreateTicketInput input) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            TicketDTO dto = ticketService.create(input, username);
            return ResponseEntity.ok(dto);
        } catch (ConstraintViolationException cve) {
            String constraintViolations = getConstraintViolations(cve);
            return ResponseEntity.unprocessableEntity().body(constraintViolations);
        } catch (AuthorNotFoundException anfe) {
            return ResponseEntity.unprocessableEntity().body("author: unknown username");
        }
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<TicketDTO> getTicket(@PathVariable Long id) {
        Optional<TicketDTO> dto = ticketService.findById(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity deleteTicket(@PathVariable Long id) {
        ticketService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/tickets/{id}")
    public ResponseEntity updateTicket(@PathVariable Long id, @RequestBody UpdateTicketInput input) {
        try {
            TicketDTO dto = ticketService.updateById(id, input);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException nsee) {
            return ResponseEntity.notFound().build();
        } catch (ConstraintViolationException cve) {
            String constraintViolations = getConstraintViolations(cve);
            return ResponseEntity.unprocessableEntity().body(constraintViolations);
        } catch (AgentNotFoundException anfe) {
            return ResponseEntity.unprocessableEntity().body("agent: unknown username");
        }
    }

    private String getConstraintViolations(ConstraintViolationException cve) {
        return cve.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining());
    }
}
