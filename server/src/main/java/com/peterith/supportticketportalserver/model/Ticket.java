package com.peterith.supportticketportalserver.model;

import com.peterith.supportticketportalserver.dto.CreateTicketInput;
import com.peterith.supportticketportalserver.dto.TicketDTO;
import com.peterith.supportticketportalserver.dto.UpdateTicketInput;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 5, max = 100)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    @NotNull
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Category category;

    @NotNull
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @NotNull
    @ManyToOne
    private User author;

    @ManyToOne
    private User agent;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Ticket(CreateTicketInput input, User author) {
        this.title = input.getTitle();
        this.description = input.getDescription();
        this.category = input.getCategory();
        this.author = author;
    }

    public void update(UpdateTicketInput input) {
        this.title = input.getTitle();
        this.description = input.getDescription();
        this.status = input.getStatus();
        this.category = input.getCategory();
        this.priority = input.getPriority();
    }

    public void update(UpdateTicketInput input, User agent) {
        update(input);
        this.agent = agent;
    }

    public TicketDTO toDTO() {
        TicketDTO ticketDTO = TicketDTO.builder()
                .id(id)
                .title(title)
                .description(description)
                .status(status)
                .category(category)
                .priority(priority)
                .author(author.getUsername())
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();

        if (agent != null) {
            ticketDTO.setAgent(agent.getUsername());
        }

        return ticketDTO;
    }
}
