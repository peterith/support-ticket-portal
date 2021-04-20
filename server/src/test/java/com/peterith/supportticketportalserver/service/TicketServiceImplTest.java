package com.peterith.supportticketportalserver.service;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import com.peterith.supportticketportalserver.exception.AgentNotFoundException;
import com.peterith.supportticketportalserver.exception.AuthorNotFoundException;
import com.peterith.supportticketportalserver.exception.ForbiddenException;
import com.peterith.supportticketportalserver.model.*;
import com.peterith.supportticketportalserver.repository.TicketRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class TicketServiceImplTest {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    TicketService ticketService;

    User author = User.builder().id(1L).username("noobMaster").password("{noop}password").role(Role.CLIENT).build();
    User agent = User.builder().id(2L).username("agent007").password("{noop}password").role(Role.AGENT).build();

    Ticket ticket = Ticket.builder()
            .title("Ticket 1")
            .description("Description 1")
            .status(Status.OPEN)
            .category(Category.BUG)
            .priority(Priority.MEDIUM)
            .author(author)
            .agent(agent)
            .build();

    @BeforeEach
    void setUp() {
        ticketRepository.save(ticket);
    }

    @AfterEach
    void tearDown() {
        ticketRepository.deleteAll();
    }

    @Test
    void shouldReturnTicketsWhenFindAll() {
        ArrayList<TicketDTO> actual = (ArrayList<TicketDTO>) ticketService.findAll();

        assertThat(actual, hasSize(1));
        assertThat(actual.get(0).getId(), is(ticket.getId()));
        assertThat(actual.get(0).getTitle(), is(ticket.getTitle()));
        assertThat(actual.get(0).getDescription(), is(ticket.getDescription()));
        assertThat(actual.get(0).getStatus(), is(ticket.getStatus()));
        assertThat(actual.get(0).getCategory(), is(ticket.getCategory()));
        assertThat(actual.get(0).getPriority(), is(ticket.getPriority()));
        assertThat(actual.get(0).getAuthor(), is(ticket.getAuthor().getUsername()));
        assertThat(actual.get(0).getAgent(), is(ticket.getAgent().getUsername()));
        assertThat(actual.get(0).getCreatedAt(), is(ticket.getCreatedAt()));
        assertThat(actual.get(0).getUpdatedAt(), is(ticket.getUpdatedAt()));
    }

    @Test
    void shouldReturnTicketWhenFindById() {
        Optional<TicketDTO> actual = ticketService.findById(ticket.getId());

        assertThat(actual.get().getId(), is(ticket.getId()));
        assertThat(actual.get().getTitle(), is(ticket.getTitle()));
        assertThat(actual.get().getDescription(), is(ticket.getDescription()));
        assertThat(actual.get().getStatus(), is(ticket.getStatus()));
        assertThat(actual.get().getCategory(), is(ticket.getCategory()));
        assertThat(actual.get().getPriority(), is(ticket.getPriority()));
        assertThat(actual.get().getAuthor(), is(ticket.getAuthor().getUsername()));
        assertThat(actual.get().getAgent(), is(ticket.getAgent().getUsername()));
        assertThat(actual.get().getCreatedAt(), is(ticket.getCreatedAt()));
        assertThat(actual.get().getUpdatedAt(), is(ticket.getUpdatedAt()));
    }

    @Test
    void shouldReturnEmptyWhenFindByIdAndNoTicket() {
        Optional<TicketDTO> actual = ticketService.findById(0L);
        Optional expected = Optional.empty();
        assertThat(actual, is(expected));
    }

    @Test
    void shouldReturnTicketWhenCreate() throws AuthorNotFoundException {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        TicketDTO actual1 = ticketService.create(input, author.getUsername());
        assertThat(actual1.getTitle(), is(input.getTitle()));
        assertThat(actual1.getDescription(), is(input.getDescription()));
        assertThat(actual1.getStatus(), is(Status.OPEN));
        assertThat(actual1.getCategory(), is(input.getCategory()));
        assertThat(actual1.getPriority(), is(Priority.MEDIUM));
        assertThat(actual1.getAuthor(), is(author.getUsername()));
        assertThat(actual1.getAgent(), is(nullValue()));
        assertThat(actual1.getCreatedAt(), isA(LocalDateTime.class));
        assertThat(actual1.getUpdatedAt(), isA(LocalDateTime.class));

        Optional<Ticket> actual2 = ticketRepository.findById(actual1.getId());
        assertThat(actual2.get().getTitle(), is(input.getTitle()));
        assertThat(actual2.get().getDescription(), is(input.getDescription()));
        assertThat(actual2.get().getStatus(), is(Status.OPEN));
        assertThat(actual2.get().getCategory(), is(input.getCategory()));
        assertThat(actual2.get().getPriority(), is(Priority.MEDIUM));
        assertThat(actual2.get().getAuthor(), is(author));
        assertThat(actual2.get().getAgent(), is(nullValue()));
        assertThat(actual2.get().getCreatedAt(), isA(LocalDateTime.class));
        assertThat(actual2.get().getUpdatedAt(), isA(LocalDateTime.class));
    }

    @Test
    void shouldThrowWhenCreateAndFailTitleValidation() {
        CreateTicketInput input = CreateTicketInput.builder()
                .title(" ".repeat(101))
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.create(input, author.getUsername()));
    }

    @Test
    void shouldThrowWhenCreateAndFailDescriptionValidation() {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description(" ".repeat(1001))
                .category(Category.FEATURE_REQUEST)
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.create(input, author.getUsername()));
    }

    @Test
    void shouldThrowWhenCreateAndFailAuthorValidation() {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        assertThrows(AuthorNotFoundException.class, () -> ticketService.create(input, "unknown"));
    }

    @Test
    void shouldDeleteTicketWhenDeleteById() {
        TicketDTO actual1 = ticketService.deleteById(ticket.getId(), ticket.getAuthor().getUsername());
        assertThat(actual1.getTitle(), is(ticket.getTitle()));
        assertThat(actual1.getDescription(), is(ticket.getDescription()));
        assertThat(actual1.getStatus(), is(ticket.getStatus()));
        assertThat(actual1.getCategory(), is(ticket.getCategory()));
        assertThat(actual1.getPriority(), is(ticket.getPriority()));
        assertThat(actual1.getAuthor(), is(ticket.getAuthor().getUsername()));
        assertThat(actual1.getAgent(), is(ticket.getAgent().getUsername()));
        assertThat(actual1.getCreatedAt(), is(ticket.getCreatedAt()));
        assertThat(actual1.getUpdatedAt(), is(ticket.getUpdatedAt()));

        List<Ticket> actual2 = ticketRepository.findAll();
        List<Ticket> expected = List.of();
        assertThat(actual2, is(expected));
    }

    @Test
    void shouldThrowWhenDeleteByIdAndNoTicket() {
        assertThrows(NoSuchElementException.class, () -> ticketService.deleteById(0L, agent.getUsername()));
    }

    @Test
    void shouldThrowWhenDeleteByIdAndUnauthorized() {
        assertThrows(ForbiddenException.class, () -> ticketService.deleteById(ticket.getId(), agent.getUsername()));
    }

    @Test
    void shouldReturnTicketWhenUpdateById() throws AgentNotFoundException {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.IN_PROGRESS)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        TicketDTO actual1 = ticketService.updateById(ticket.getId(), input);
        assertThat(actual1.getTitle(), is(input.getTitle()));
        assertThat(actual1.getDescription(), is(input.getDescription()));
        assertThat(actual1.getStatus(), is(input.getStatus()));
        assertThat(actual1.getCategory(), is(input.getCategory()));
        assertThat(actual1.getPriority(), is(input.getPriority()));
        assertThat(actual1.getAuthor(), is(ticket.getAuthor().getUsername()));
        assertThat(actual1.getAgent(), is(input.getAgent()));
        assertThat(actual1.getCreatedAt(), is(ticket.getCreatedAt()));
        assertThat(actual1.getUpdatedAt(), isA(LocalDateTime.class));

        Optional<Ticket> actual2 = ticketRepository.findById(actual1.getId());
        assertThat(actual2.get().getTitle(), is(input.getTitle()));
        assertThat(actual2.get().getDescription(), is(input.getDescription()));
        assertThat(actual2.get().getStatus(), is(input.getStatus()));
        assertThat(actual2.get().getCategory(), is(input.getCategory()));
        assertThat(actual2.get().getPriority(), is(input.getPriority()));
        assertThat(actual2.get().getAuthor(), is(author));
        assertThat(actual2.get().getAgent(), is(agent));
        assertThat(actual2.get().getCreatedAt(), is(ticket.getCreatedAt()));
        assertThat(actual2.get().getUpdatedAt(), isA(LocalDateTime.class));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndNoTicket() {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.IN_PROGRESS)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        assertThrows(NoSuchElementException.class, () -> ticketService.updateById(0L, input));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndFailTitleValidation() {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title(" ".repeat(101))
                .description("New Description 1")
                .status(Status.IN_PROGRESS)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.updateById(ticket.getId(), input));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndFailDescriptionValidation() {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description(" ".repeat(1001))
                .status(Status.IN_PROGRESS)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        assertThrows(ConstraintViolationException.class, () -> ticketService.updateById(ticket.getId(), input));
    }

    @Test
    void shouldThrowWhenUpdateByIdAndFailAuthorValidation() {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.IN_PROGRESS)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("unknown")
                .build();

        assertThrows(AgentNotFoundException.class, () -> ticketService.updateById(ticket.getId(), input));
    }
}
