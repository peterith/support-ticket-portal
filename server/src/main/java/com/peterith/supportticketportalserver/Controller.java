package com.peterith.supportticketportalserver;

import org.springframework.http.ResponseEntity;

import java.util.function.Function;
import java.util.function.Supplier;

public class Controller<T> {
    Function<T, ResponseEntity<T>> toResponseEntity = t -> ResponseEntity.ok(t);
    Supplier<ResponseEntity<T>> notFoundResponseEntity = () -> ResponseEntity.notFound().build();
}
