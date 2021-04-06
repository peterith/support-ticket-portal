package com.peterith.supportticketportalserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Override
    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    @Override
    public Optional<Ticket> findById(Long id) {
        return ticketRepository.findById(id);
    }

    @Override
    public Ticket create(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    @Override
    public void deleteById(Long id) {
        ticketRepository.deleteById(id);
    }

    @Override
    public Ticket updateById(Long id, Ticket ticket) {
        try {
            Optional<Ticket> existingTicket = findById(id);

            return existingTicket.map((t) -> {
                ticket.setId(id);
                ticket.setCreatedAt(t.getCreatedAt());
                return ticketRepository.save(ticket);
            }).orElseThrow();
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
