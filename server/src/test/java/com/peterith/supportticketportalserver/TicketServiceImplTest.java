package com.peterith.supportticketportalserver;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SpringBootTest
class TicketServiceImplTest {

    @MockBean
    TicketRepository ticketRepository;

    @Autowired
    TicketService ticketService;

    @Test
    void GivenTicketsExist_WhenFindAll_ThenReturnTickets() {
        Ticket ticket1 = Ticket.builder()
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

        List<Ticket> expected = List.of(ticket1, ticket2);
        when(ticketRepository.findAll()).thenReturn(expected);
        List<Ticket> actual = ticketService.findAll();
        assertThat(actual, is(expected));
    }

    @Test
    void GivenNoTickets_WhenFindAll_ThenReturnEmpty() {
        when(ticketRepository.findAll()).thenReturn(new ArrayList<>());
        List<Ticket> actual = ticketService.findAll();
        assertThat(actual, is(empty()));
    }

    @Test
    void GivenTicketExists_WhenFindById_ThenReturnTicket() {
        Ticket ticket = Ticket.builder()
                .id(1L)
                .title("Ticket 1")
                .description("Description")
                .status(Status.OPEN)
                .category(Category.BUG)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .agent("Joe Bloggs")
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .updatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .build();

        Optional<Ticket> expected = Optional.of(ticket);
        when(ticketRepository.findById(eq(1L))).thenReturn(expected);
        Optional<Ticket> actual = ticketService.findById(1L);
        assertThat(actual, is(expected));
    }

    @Test
    void GivenNoTicket_WhenFindById_ThenReturnEmpty() {
        when(ticketRepository.findById(eq(1L))).thenReturn(Optional.empty());
        Optional<Ticket> actual = ticketService.findById(1L);
        assertThat(actual, is(Optional.empty()));
    }
}
