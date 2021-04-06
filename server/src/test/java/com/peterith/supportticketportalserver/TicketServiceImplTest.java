package com.peterith.supportticketportalserver;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;

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
            .build();

    Ticket ticket2 = Ticket.builder()
            .title("Ticket 2")
            .description("Description 2")
            .status(Status.IN_PROGRESS)
            .category(Category.FEATURE_REQUEST)
            .priority(Priority.HIGH)
            .author("Jane Doe")
            .agent("Joe Schmoe")
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
        List<Ticket> actual = ticketService.findAll();
        List<Ticket> expected = List.of(ticket1, ticket2);
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnTicketWhenFindById() {
        Optional<Ticket> actual = ticketService.findById(ticket1.getId());
        Optional<Ticket> expected = Optional.of(ticket1);
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnEmptyWhenFindByIdAndNoTicket() {
        Optional<Ticket> actual = ticketService.findById(0L);
        Optional<Ticket> expected = Optional.empty();
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnTicketWhenCreate() {
        Ticket expected1 = Ticket.builder()
                .title("Ticket 3")
                .description("Description 3")
                .status(Status.OPEN)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .build();

        Ticket actual1 = ticketService.create(expected1);
        assertThat(actual1, is(expected1));

        List<Ticket> actual2 = ticketRepository.findAll();
        List<Ticket> expected2 = List.of(ticket1, ticket2, expected1);
        assertThat(actual2, is(expected2));
    }

    @Test
    void shouldThrowWhenCreateAndFailTitleValidation() {
        Ticket ticket = Ticket.builder()
                .title(" ".repeat(101))
                .description("Description 3")
                .status(Status.OPEN)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.create(ticket));
    }

    @Test
    void shouldThrowWhenCreateAndFailDescriptionValidation() {
        Ticket ticket = Ticket.builder()
                .title("Ticket 3")
                .description(" ".repeat(1001))
                .status(Status.OPEN)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.MEDIUM)
                .author("John Doe")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.create(ticket));
    }

    @Test
    void shouldThrowWhenCreateAndFailAuthorValidation() {
        Ticket ticket = Ticket.builder()
                .title("Ticket 3")
                .description("Description 3")
                .status(Status.OPEN)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.MEDIUM)
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.create(ticket));
    }

    @Test
    void shouldReturnTicketWhenDeleteById() {
        ticketService.deleteById(ticket1.getId());
        List<Ticket> actual = ticketRepository.findAll();
        List<Ticket> expected = List.of(ticket2);
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnTicketWhenUpdateById() {
        Ticket expected1 = Ticket.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        Ticket actual1 = ticketService.updateById(ticket1.getId(), expected1);
        expected1.setUpdatedAt(actual1.getUpdatedAt());
        assertThat(actual1, is(expected1));

        List<Ticket> expected2 = List.of(expected1, ticket2);
        List<Ticket> actual2 = ticketRepository.findAll();
        assertThat(actual2, is(expected2));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndNoTicket() {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();
        assertThrows(NoSuchElementException.class, () -> ticketService.updateById(0L, ticket));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndFailTitleValidation() {
        Ticket ticket = Ticket.builder()
                .title(" ".repeat(101))
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.updateById(ticket1.getId(), ticket));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndFailDescriptionValidation() {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description(" ".repeat(1001))
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.updateById(ticket1.getId(), ticket));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndFailAuthorValidation() {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .agent("Joe Schmoe")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.updateById(ticket1.getId(), ticket));
    }
}
