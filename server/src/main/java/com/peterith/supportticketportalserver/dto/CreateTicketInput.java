package com.peterith.supportticketportalserver.dto;

import com.peterith.supportticketportalserver.model.Category;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class CreateTicketInput {

    @NonNull
    private String title;

    private String description;

    @NonNull
    private Category category;
}
