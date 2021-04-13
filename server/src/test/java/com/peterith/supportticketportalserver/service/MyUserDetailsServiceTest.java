package com.peterith.supportticketportalserver.service;

import com.peterith.supportticketportalserver.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class MyUserDetailsServiceTest {
    @Autowired
    UserDetailsService userDetailsService;

    @Test
    void shouldReturnUserDetailsWhenLoadByUsername() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("noobMaster");

        assertThat(userDetails.getUsername(), is("noobMaster"));
        assertThat(userDetails.getPassword(), is("{noop}password"));
        assertThat(userDetails.getAuthorities(), is(List.of(new SimpleGrantedAuthority(Role.CLIENT.name()))));
    }

    @Test
    void shouldThrowWhenLoadByUsernameAndUnknownUsername() {
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("unknown"));
    }

}