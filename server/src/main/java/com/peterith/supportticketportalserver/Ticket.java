package com.peterith.supportticketportalserver;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Status status;

    @NotNull
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Category category;

    @NotNull
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Priority priority;

    @NotNull
    @Column(length = 100)
    private String author;

    @Column(length = 100)
    private String agent;

    @NotNull
    private LocalDateTime createdAt;

    @NotNull
    private LocalDateTime updatedAt;
}
