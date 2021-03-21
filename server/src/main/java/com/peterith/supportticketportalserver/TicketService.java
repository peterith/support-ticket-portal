package com.peterith.supportticketportalserver;

import java.util.List;
import java.util.Optional;

public interface TicketService<Ticket> {
    List<Ticket> findAll();

    Optional<Ticket> findById(Long id);
}
