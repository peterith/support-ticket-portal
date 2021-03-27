package com.peterith.supportticketportalserver;

import java.util.List;
import java.util.Optional;

public interface TicketService {
    List<Ticket> findAll();

    Optional<Ticket> findById(Long id);

    Ticket create(Ticket ticket);

    void deleteById(Long id);
}
