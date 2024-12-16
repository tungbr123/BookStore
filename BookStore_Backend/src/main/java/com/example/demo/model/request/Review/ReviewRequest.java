package com.example.demo.model.request.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReviewRequest {
    private int productid;
    private int userid;
    private int stars;
    private String content;
    private int orderid;
}
