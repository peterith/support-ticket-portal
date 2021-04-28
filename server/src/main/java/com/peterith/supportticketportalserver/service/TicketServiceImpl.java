package com.peterith.supportticketportalserver.service;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import com.peterith.supportticketportalserver.exception.AgentNotFoundException;
import com.peterith.supportticketportalserver.exception.AuthorNotFoundException;
import com.peterith.supportticketportalserver.exception.ForbiddenException;
import com.peterith.supportticketportalserver.model.Role;
import com.peterith.supportticketportalserver.model.Status;
import com.peterith.supportticketportalserver.model.Ticket;
import com.peterith.supportticketportalserver.model.User;
import com.peterith.supportticketportalserver.repository.TicketRepository;
import com.peterith.supportticketportalserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public List<TicketDTO> findAll() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream().map(ticket -> ticket.toDTO()).collect(Collectors.toList());
    }

    @Override
    public Optional<TicketDTO> findById(Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ticket.map(t -> t.toDTO());
    }

    @Override
    public TicketDTO create(CreateTicketInput input, String username) {
        Optional<User> optionalAuthor = userRepository.findByUsername(username);

        return optionalAuthor.map(author -> {
            Ticket ticket = new Ticket(input, author);
            return ticketRepository.save(ticket).toDTO();
        }).orElseThrow(AuthorNotFoundException::new);
    }

    @Override
    public TicketDTO deleteById(Long id, String username) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        Ticket ticket = optionalTicket.orElseThrow();

        if (!ticket.getAuthor().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        ticketRepository.delete(ticket);
        return ticket.toDTO();
    }

    @Override
    public TicketDTO updateById(Long id, UpdateTicketInput input, Authentication authentication) {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(id);
            Ticket ticket = optionalTicket.orElseThrow();
            validateUpdatedTicket(ticket, input, authentication);

            if (input.getAgent() == null) {
                ticket.update(input);
            } else {
                Optional<User> optionalAgent = userRepository.findByUsername(input.getAgent());
                User agent = optionalAgent.orElseThrow(AgentNotFoundException::new);
                ticket.update(input, agent);
            }

            return ticketRepository.save(ticket).toDTO();
        } catch (TransactionSystemException e) {
            return throwTransactionRootCause(e);
        }
    }

    private void validateUpdatedTicket(Ticket ticket, UpdateTicketInput input, Authentication authentication) {
        if (isForbiddenTicketStatus(input.getStatus(), authentication) ||
                isNonAuthorUpdate(ticket, input, authentication)) {
            throw new ForbiddenException();
        }

    }

    private boolean isNonAuthorUpdate(Ticket ticket, UpdateTicketInput input, Authentication authentication) {
        return !ticket.getAuthor().getUsername().equals(authentication.getName()) &&
                (!ticket.getTitle().equals(input.getTitle()) ||
                        !ticket.getDescription().equals(input.getDescription()) ||
                        ticket.getCategory() != input.getCategory() ||
                        ticket.getPriority() != input.getPriority());
    }

    private boolean isForbiddenTicketStatus(Status status, Authentication authentication) {
        return (authenticationHasRole(authentication, Role.CLIENT) && isForbiddenTicketStatusForClient(status)) ||
                authenticationHasRole(authentication, Role.AGENT) && isForbiddenTicketStatusForAgent(status);
    }

    private boolean authenticationHasRole(Authentication authentication, Role role) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_" + role));
    }

    private boolean isForbiddenTicketStatusForClient(Status status) {
        return status == Status.IN_PROGRESS || status == Status.RESOLVED;
    }

    private boolean isForbiddenTicketStatusForAgent(Status status) {
        return status == Status.CLOSED;
    }


    private <T> T throwTransactionRootCause(TransactionSystemException e) {
        Throwable rootCause = e.getRootCause();

        if (rootCause instanceof ConstraintViolationException) {
            throw (ConstraintViolationException) rootCause;
        }

        throw e;
    }
}
