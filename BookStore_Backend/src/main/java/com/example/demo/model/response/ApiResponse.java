package com.example.demo.model.response;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String statusCode;
    private String message;
    private T data;

    public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public void ok() {
        this.statusCode = "200";
        this.message="SUCCESS";
    }

    public void ok(T data) {
        this.statusCode = "200";
        this.message="SUCCESS";
        this.data = data;
    }

    public void notFound(){
        this.statusCode = "404";
        this.message="NOT FOUND";
    }

}
