package com.peterith.supportticketportalserver.service;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import com.peterith.supportticketportalserver.exception.AgentNotFoundException;
import com.peterith.supportticketportalserver.exception.AuthorNotFoundException;
import com.peterith.supportticketportalserver.model.Ticket;
import com.peterith.supportticketportalserver.model.User;
import com.peterith.supportticketportalserver.repository.TicketRepository;
import com.peterith.supportticketportalserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public TicketDTO create(CreateTicketInput input, String username) throws AuthorNotFoundException {
        Optional<User> optionalAuthor = userRepository.findByUsername(username);

        return optionalAuthor.map(author -> {
            Ticket ticket = new Ticket(input, author);
            return ticketRepository.save(ticket).toDTO();
        }).orElseThrow(AuthorNotFoundException::new);
    }

    @Override
    public void deleteById(Long id) {
        ticketRepository.deleteById(id);
    }

    @Override
    public TicketDTO updateById(Long id, UpdateTicketInput input) throws AgentNotFoundException {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(id);
            Ticket ticket = optionalTicket.orElseThrow();

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

    private <T> T throwTransactionRootCause(TransactionSystemException e) {
        Throwable rootCause = e.getRootCause();

        if (rootCause instanceof ConstraintViolationException) {
            throw (ConstraintViolationException) rootCause;
        }

        throw e;
    }
}
