package com.peterith.supportticketportalserver.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public String generateJWS(UserDetails userDetails) {
        SimpleGrantedAuthority authority = (SimpleGrantedAuthority) userDetails.getAuthorities().toArray()[0];
        String role = authority.getAuthority().substring(5);
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setExpiration(Date.from(Instant.now().plus(Duration.ofDays(7))))
                .setIssuedAt(Date.from(Instant.now()))
                .claim("role", role)
                .signWith(getSecretKey())
                .compact();
    }

    public String extractUsernameFromRequestHeader(String header) {
        String jws = header.substring(7);
        return Jwts.parserBuilder().setSigningKey(getSecretKey()).build().parseClaimsJws(jws).getBody().getSubject();
    }

    private Key getSecretKey() {
        byte[] decodedSecret = Base64.getDecoder().decode(jwtSecret);
        return Keys.hmacShaKeyFor(decodedSecret);
    }
}
