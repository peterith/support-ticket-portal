package com.peterith.supportticketportalserver;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static com.peterith.supportticketportalserver.TestUtils.toJSONString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TicketControllerTest {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    MockMvc mockMvc;

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
    void shouldReturnOkWhenGetTickets() throws Exception {
        List<Ticket> tickets = List.of(ticket1, ticket2);
        String expected = toJSONString(tickets);

        mockMvc.perform(get("/tickets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expected));
    }

    @Test
    void shouldReturnOkWhenGetTicketById() throws Exception {
        String expected = toJSONString(ticket1);

        mockMvc.perform(get("/tickets/" + ticket1.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expected));
    }

    @Test
    void shouldReturnNotFoundWhenGetTicketByIdAndNoTicket() throws Exception {
        mockMvc.perform(get("/tickets/0")).andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnOkWhenPostTicket() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("Ticket 3")
                .description("Description 3")
                .category(Category.TECHNICAL_ISSUE)
                .author("John Doe")
                .build();

        String expected = toJSONString(ticket);
        System.out.println(expected);
        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(expected))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expected));
    }

    @Test
    void shouldReturnUnprocessableEntityWhenPostTicketAndFailTitleValidation() throws Exception {
        Ticket ticket = Ticket.builder()
                .title(" ".repeat(101))
                .description("Description 3")
                .category(Category.TECHNICAL_ISSUE)
                .author("John Doe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(expected))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void shouldReturnUnprocessableEntityWhenPostTicketAndFailDescriptionValidation() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("Ticket 3")
                .description(" ".repeat(1001))
                .category(Category.TECHNICAL_ISSUE)
                .author("John Doe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(expected))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void shouldReturnUnprocessableEntityWhenPostTicketAndFailAuthorValidation() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("Ticket 3")
                .description("Description 3")
                .category(Category.TECHNICAL_ISSUE)
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(expected))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void shouldReturnOkWhenDeleteTicketById() throws Exception {
        mockMvc.perform(delete("/tickets/" + ticket1.getId())).andExpect(status().isOk());
    }

    @Test
    void shouldReturnOkWhenPutTicketById() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(put("/tickets/" + ticket1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(expected))
                .andExpect(status().isOk())
                .andExpect(content().json(expected));
    }

    @Test
    void shouldReturnNotFoundWhenPutTicketByIdAndNoTicket() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(put("/tickets/0")
                .contentType(MediaType.APPLICATION_JSON)
                .content(expected))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnUnprocessableEntityWhenPutTicketByIdAndFailTitleValidation() throws Exception {
        Ticket ticket = Ticket.builder()
                .title(" ".repeat(101))
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(put("/tickets/" + ticket1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(expected))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void shouldReturnUnprocessableEntityWhenPutTicketByIdAndFailDescriptionValidation() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description(" ".repeat(1001))
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .author("Jane Doe")
                .agent("Joe Schmoe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(put("/tickets/" + ticket1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(expected))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void shouldReturnUnprocessableEntityWhenPutTicketByIdAndFailAuthorValidation() throws Exception {
        Ticket ticket = Ticket.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.ACCOUNT)
                .priority(Priority.LOW)
                .agent("Joe Schmoe")
                .build();

        String expected = toJSONString(ticket);

        mockMvc.perform(put("/tickets/" + ticket1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(expected))
                .andExpect(status().isUnprocessableEntity());
    }
}
