package com.peterith.supportticketportalserver.controller;

import com.peterith.supportticketportalserver.dto.AuthenticationInput;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static com.peterith.supportticketportalserver.util.TestUtils.toJSONString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void shouldReturnOkWhenAuthenticate() throws Exception {
        AuthenticationInput input = AuthenticationInput.builder().username("noobMaster").password("password").build();
        String content = toJSONString(input);

        mockMvc.perform(post("/authenticate").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("token").isString());
    }

    @Test
    void shouldReturnUnauthorizedWhenAuthenticateAndBadCredentials() throws Exception {
        AuthenticationInput input = AuthenticationInput.builder().username("unknown").password("password").build();
        String content = toJSONString(input);

        mockMvc.perform(post("/authenticate").contentType(MediaType.APPLICATION_JSON).content(content))
                .andExpect(status().isUnauthorized());
    }
}