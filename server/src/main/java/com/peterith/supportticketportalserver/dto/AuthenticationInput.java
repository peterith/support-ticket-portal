package com.peterith.supportticketportalserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationInput {
    private String username;
    private String password;
}
