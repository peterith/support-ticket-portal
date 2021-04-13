package com.peterith.supportticketportalserver.service;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import com.peterith.supportticketportalserver.exception.AgentNotFoundException;
import com.peterith.supportticketportalserver.exception.AuthorNotFoundException;

import java.util.List;
import java.util.Optional;

public interface TicketService {
    List<TicketDTO> findAll();

    Optional<TicketDTO> findById(Long id);

    TicketDTO create(CreateTicketInput input, String username) throws AuthorNotFoundException;

    void deleteById(Long id);

    TicketDTO updateById(Long id, UpdateTicketInput input) throws AgentNotFoundException;
}
