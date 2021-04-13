package com.peterith.supportticketportalserver.dto;

import com.peterith.supportticketportalserver.model.Category;
import com.peterith.supportticketportalserver.model.Priority;
import com.peterith.supportticketportalserver.model.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketDTO {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private Category category;
    private Priority priority;
    private String author;
    private String agent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
