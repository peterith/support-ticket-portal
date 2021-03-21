package com.peterith.supportticketportalserver;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.peterith.supportticketportalserver.TestUtils.toJSONString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TicketControllerTest {

    @MockBean
    TicketService ticketService;

    @Autowired
    MockMvc mockMvc;

    @Test
    void GivenTicketsExist_WhenFindAll_ThenReturnTickets() throws Exception {
        Ticket ticket1 = Ticket.builder()
                .id(1L)
                .title("Ticket 1")
                .description("Description 2")
                .status(Status.OPEN)
                .category(Category.BUG)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .agent("Joe Bloggs")
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .updatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .build();

        Ticket ticket2 = Ticket.builder()
                .id(2L)
                .title("Ticket 2")
                .description("Description 2")
                .status(Status.IN_PROGRESS)
                .category(Category.FEATURE_REQUEST)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .updatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .build();

        List<Ticket> tickets = List.of(ticket1, ticket2);
        String expected = toJSONString(tickets);
        when(ticketService.findAll()).thenReturn(tickets);

        mockMvc.perform(get("/tickets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expected));
    }

    @Test
    void GivenNoTickets_WhenFindAll_ThenReturnEmpty() throws Exception {
        when(ticketService.findAll()).thenReturn(new ArrayList());

        mockMvc.perform(get("/tickets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("[]"));
    }

    @Test
    void GivenTicketExists_WhenFindById_ThenReturnTicket() throws Exception {
        Ticket ticket = Ticket.builder()
                .id(1L)
                .title("Ticket 1")
                .description("Description 1")
                .status(Status.OPEN)
                .category(Category.BUG)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .agent("Joe Bloggs")
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .updatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .build();

        String expected = toJSONString(ticket);
        when(ticketService.findById(eq(1L))).thenReturn(Optional.of(ticket));

        mockMvc.perform(get("/tickets/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expected));
    }

    @Test
    void GivenNoTicket_WhenFindById_ThenReturnEmpty() throws Exception {
        when(ticketService.findById(eq(1L))).thenReturn(Optional.empty());
        mockMvc.perform(get("/tickets/1")).andExpect(status().isNotFound());
    }
}
