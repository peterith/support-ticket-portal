package com.peterith.supportticketportalserver.service;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

public interface TicketService {
    List<TicketDTO> findAll();

    Optional<TicketDTO> findById(Long id);

    TicketDTO create(CreateTicketInput input, String username);

    TicketDTO deleteById(Long id, String username);

    TicketDTO updateById(Long id, UpdateTicketInput input, Authentication authentication);
}
