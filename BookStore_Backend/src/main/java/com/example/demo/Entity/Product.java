package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression.DateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "Product")
@Builder
public class Product implements Serializable{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
	private Long id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "price")
	private int price;
	
	@Column(name = "promotional_price")
	private int promotional_price;
	
	@Column(name = "quantity")
	private int quantity;
	
	@Column(name = "sold")
	private int sold;
	
	@Column(name = "Image")
	private String image;
	
	@Column(name="rating")
	private float rating;
	
	@Column(name = "translator")
	private String translator;
	
	@Column(name = "supplier")
	private String supplier;
	
	@Column(name = "publisher")
	private String publisher;
	
	@Column(name = "published_date")
	private int published_date;
	
	@Column(name = "pages")
	private int pages;
	
	@Column(name = "weight")
	private int weight;
	
}
