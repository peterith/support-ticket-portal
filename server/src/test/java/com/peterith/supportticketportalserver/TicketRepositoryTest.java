package com.peterith.supportticketportalserver;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;

@SpringBootTest
class TicketRepositoryTest {

    @Autowired
    TicketRepository ticketRepository;

    @AfterEach
    void tearDown() {
        ticketRepository.deleteAll();
    }

    @Test
    void GivenTicketsExist_WhenFindAll_ThenReturnTickets() {
        Ticket ticket1 = Ticket.builder()
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
                .title("Ticket 2")
                .description("Description 2")
                .status(Status.IN_PROGRESS)
                .category(Category.FEATURE_REQUEST)
                .priority(Priority.HIGH)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .updatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .build();

        ticketRepository.saveAll(List.of(ticket1, ticket2));
        List<Ticket> actual = ticketRepository.findAll();
        List<Ticket> expected = List.of(ticket1, ticket2);
        assertThat(actual, is(expected));
    }

    @Test
    void GivenNoTickets_WhenFindAll_ThenReturnEmpty() {
        List<Ticket> actual = ticketRepository.findAll();
        assertThat(actual, is(empty()));
    }

    @Test
    void GivenTicketExists_WhenFindById_ThenReturnTicket() {
        Ticket ticket = Ticket.builder()
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

        ticketRepository.save(ticket);
        Optional<Ticket> actual = ticketRepository.findById(ticket.getId());
        Optional<Ticket> expected = Optional.of(ticket);
        assertThat(actual, is(expected));
    }

    @Test
    void GivenNoTicket_WhenFindById_ThenReturnEmpty() {
        Optional<Ticket> actual = ticketRepository.findById(0L);
        assertThat(actual, is(Optional.empty()));
    }
}
