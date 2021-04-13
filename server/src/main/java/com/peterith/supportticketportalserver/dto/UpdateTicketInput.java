package com.peterith.supportticketportalserver.dto;

import com.peterith.supportticketportalserver.model.Category;
import com.peterith.supportticketportalserver.model.Priority;
import com.peterith.supportticketportalserver.model.Status;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class UpdateTicketInput {

    @NonNull
    private String title;

    private String description;

    @NonNull
    private Status status;

    @NonNull
    private Category category;

    @NonNull
    private Priority priority;

    private String agent;


}
