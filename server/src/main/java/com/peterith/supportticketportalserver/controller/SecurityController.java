package com.peterith.supportticketportalserver.controller;

import com.peterith.supportticketportalserver.dto.AuthenticationInput;
import com.peterith.supportticketportalserver.dto.AuthenticationResponse;
import com.peterith.supportticketportalserver.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class SecurityController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationInput input) {
        try {
            UserDetails userDetails = (UserDetails) authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getUsername(), input.getPassword())).getPrincipal();
            String jws = jwtUtils.generateJWS(userDetails);
            AuthenticationResponse content = AuthenticationResponse.builder().token(jws).build();
            return ResponseEntity.ok(content);
        } catch (AuthenticationException ae) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
