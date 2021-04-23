package com.peterith.supportticketportalserver.controller;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import com.peterith.supportticketportalserver.model.*;
import com.peterith.supportticketportalserver.repository.TicketRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static com.peterith.supportticketportalserver.util.TestUtils.toJSONString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TicketControllerTest {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    MockMvc mockMvc;

    User client = User.builder().id(1L).username("noobMaster").password("{noop}password").role(Role.CLIENT).build();
    User agent = User.builder().id(2L).username("agent007").password("{noop}password").role(Role.AGENT).build();

    Ticket ticket = Ticket.builder()
            .title("Ticket 1")
            .description("Description 1")
            .status(Status.OPEN)
            .category(Category.BUG)
            .priority(Priority.MEDIUM)
            .author(client)
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
    void shouldReturnOkWhenGetTickets() throws Exception {
        mockMvc.perform(get("/tickets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(ticket.getId()))
                .andExpect(jsonPath("$[0].title").value(ticket.getTitle()))
                .andExpect(jsonPath("$[0].description").value(ticket.getDescription()))
                .andExpect(jsonPath("$[0].status").value(ticket.getStatus().name()))
                .andExpect(jsonPath("$[0].category").value(ticket.getCategory().name()))
                .andExpect(jsonPath("$[0].priority").value(ticket.getPriority().name()))
                .andExpect(jsonPath("$[0].author").value(ticket.getAuthor().getUsername()))
                .andExpect(jsonPath("$[0].agent").value(ticket.getAgent().getUsername()))
                .andExpect(jsonPath("$[0].createdAt").isString())
                .andExpect(jsonPath("$[0].updatedAt").isString());
    }

    @Test
    void shouldReturnOkWhenGetTicket() throws Exception {
        mockMvc.perform(get("/tickets/" + ticket.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("id").value(ticket.getId()))
                .andExpect(jsonPath("title").value(ticket.getTitle()))
                .andExpect(jsonPath("description").value(ticket.getDescription()))
                .andExpect(jsonPath("status").value(ticket.getStatus().name()))
                .andExpect(jsonPath("category").value(ticket.getCategory().name()))
                .andExpect(jsonPath("priority").value(ticket.getPriority().name()))
                .andExpect(jsonPath("author").value(ticket.getAuthor().getUsername()))
                .andExpect(jsonPath("agent").value(ticket.getAgent().getUsername()))
                .andExpect(jsonPath("createdAt").isString())
                .andExpect(jsonPath("updatedAt").isString());
    }

    @Test
    void shouldReturnNotFoundWhenGetTicketAndNoTicket() throws Exception {
        mockMvc.perform(get("/tickets/0")).andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnOkWhenCreateTicket() throws Exception {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("id").isNumber())
                .andExpect(jsonPath("title").value(input.getTitle()))
                .andExpect(jsonPath("description").value(input.getDescription()))
                .andExpect(jsonPath("status").value(Status.OPEN.name()))
                .andExpect(jsonPath("category").value(input.getCategory().name()))
                .andExpect(jsonPath("priority").value(Priority.MEDIUM.name()))
                .andExpect(jsonPath("author").value(client.getUsername()))
                .andExpect(jsonPath("createdAt").isString())
                .andExpect(jsonPath("updatedAt").isString());
    }

    @Test
    void shouldReturnUnauthorizedWhenCreateTicketAndUnauthorized() throws Exception {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenCreateTicketAndForbidden() throws Exception {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnUnprocessableEntityWhenCreateTicketAndFailTitleValidation() throws Exception {
        CreateTicketInput input = CreateTicketInput.builder()
                .title(" ".repeat(101))
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnUnprocessableEntityWhenCreateTicketAndFailDescriptionValidation() throws Exception {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description(" ".repeat(1001))
                .category(Category.FEATURE_REQUEST)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "unknown", roles = {"CLIENT"})
    void shouldReturnUnprocessableEntityWhenCreateTicketAndFailAuthorValidation() throws Exception {
        CreateTicketInput input = CreateTicketInput.builder()
                .title("Ticket 2")
                .description("Description 2")
                .category(Category.FEATURE_REQUEST)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(post("/tickets").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnOkWhenDeleteTicket() throws Exception {
        mockMvc.perform(delete("/tickets/" + ticket.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("id").value(ticket.getId()))
                .andExpect(jsonPath("title").value(ticket.getTitle()))
                .andExpect(jsonPath("description").value(ticket.getDescription()))
                .andExpect(jsonPath("status").value(ticket.getStatus().name()))
                .andExpect(jsonPath("category").value(ticket.getCategory().name()))
                .andExpect(jsonPath("priority").value(ticket.getPriority().name()))
                .andExpect(jsonPath("author").value(ticket.getAuthor().getUsername()))
                .andExpect(jsonPath("agent").value(ticket.getAgent().getUsername()))
                .andExpect(jsonPath("createdAt").isString())
                .andExpect(jsonPath("updatedAt").isString());
    }

    @Test
    void shouldReturnUnauthorizedWhenDeleteTicketAndUnauthorized() throws Exception {
        mockMvc.perform(delete("/tickets/0" + ticket.getId())).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnNotFoundWhenDeleteTicketAndNoTicket() throws Exception {
        mockMvc.perform(delete("/tickets/0")).andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenDeleteTicketAndForbidden() throws Exception {
        mockMvc.perform(delete("/tickets/" + ticket.getId())).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnOkWhenUpdateTicket() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("id").value(ticket.getId()))
                .andExpect(jsonPath("title").value(input.getTitle()))
                .andExpect(jsonPath("description").value(input.getDescription()))
                .andExpect(jsonPath("status").value(input.getStatus().name()))
                .andExpect(jsonPath("category").value(input.getCategory().name()))
                .andExpect(jsonPath("priority").value(input.getPriority().name()))
                .andExpect(jsonPath("author").value(ticket.getAuthor().getUsername()))
                .andExpect(jsonPath("agent").value(input.getAgent()))
                .andExpect(jsonPath("createdAt").isString())
                .andExpect(jsonPath("updatedAt").isString());
    }

    @Test
    void shouldReturnUnauthorizedWhenUpdateTicketAndUnauthorized() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnNotFoundWhenUpdateTicketAndNoTicket() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/0").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnUnprocessableEntityWhenUpdateTicketAndFailTitleValidation() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title(" ".repeat(101))
                .description("New Description 1")
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnUnprocessableEntityWhenUpdateTicketAndFailDescriptionValidation() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description(" ".repeat(1001))
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("agent007")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnUnprocessableEntityWhenUpdateTicketAndFailAgentValidation() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("unknown")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "noobMaster", roles = {"CLIENT"})
    void shouldReturnForbiddenWhenUpdateTicketAndForbiddenStatusForClient() throws Exception {
        UpdateTicketInput input1 = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.IN_PROGRESS)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("unknown")
                .build();

        String content1 = toJSONString(input1);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content1))
                .andExpect(status().isForbidden());

        UpdateTicketInput input2 = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.RESOLVED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("unknown")
                .build();

        String content2 = toJSONString(input2);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content2))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenUpdateTicketAndForbiddenStatusForAgent() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("New Description 1")
                .status(Status.CLOSED)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.HIGH)
                .agent("unknown")
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenUpdateTicketTitleByNonAuthor() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("New Ticket 1")
                .description("Description 1")
                .status(Status.OPEN)
                .category(Category.BUG)
                .priority(Priority.MEDIUM)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenUpdateTicketDescriptionByNonAuthor() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("Ticket 1")
                .description("New Description 1")
                .status(Status.OPEN)
                .category(Category.BUG)
                .priority(Priority.MEDIUM)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenUpdateTicketCategoryByNonAuthor() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("Ticket 1")
                .description("Description 1")
                .status(Status.OPEN)
                .category(Category.TECHNICAL_ISSUE)
                .priority(Priority.MEDIUM)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "agent007", roles = {"AGENT"})
    void shouldReturnForbiddenWhenUpdateTicketPriorityByNonAuthor() throws Exception {
        UpdateTicketInput input = UpdateTicketInput.builder()
                .title("Ticket 1")
                .description("Description 1")
                .status(Status.OPEN)
                .category(Category.BUG)
                .priority(Priority.HIGH)
                .build();

        String content = toJSONString(input);

        mockMvc.perform(put("/tickets/" + this.ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(status().isForbidden());
    }
}
