package com.peterith.supportticketportalserver;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@SpringBootTest
class TicketServiceImplTest {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    TicketService ticketService;

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

    @BeforeEach
    void setUp() {
        ticketRepository.saveAll(List.of(ticket1, ticket2));
    }

    @AfterEach
    void tearDown() {
        ticketRepository.deleteAll();
    }

    @Test
    void shouldReturnTicketsWhenFindAll() {
        List<Ticket> expected = List.of(ticket1, ticket2);
        List<Ticket> actual = ticketService.findAll();
        System.out.println(actual);
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnTicketWhenFindById() {
        Optional<Ticket> expected = Optional.of(ticket1);
        Optional<Ticket> actual = ticketService.findById(ticket1.getId());
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnEmptyWhenFindByIdAndNoTicket() {
        Optional<Ticket> actual = ticketService.findById(0L);
        assertThat(actual, is(Optional.empty()));
    }

    @Test
    void shouldReturnTicketWhenCreate() {
        Ticket expected = Ticket.builder()
                .title("Ticket 3")
                .description("Description 3")
                .status(Status.OPEN)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .updatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS))
                .build();

        Ticket actual = ticketService.create(expected);
        assertThat(actual, is(expected));
    }
}
