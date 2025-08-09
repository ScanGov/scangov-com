---
layout: layouts/cards
title: "Subscribe"
date: 2025-08-08
modified: 
author: ScanGov
description: "Sign up for ScanGov newsletters."
permalink: /subscribe/
---

<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card-group">
        {% for item in subscribe %}
          <div class="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 d-flex align-items-stretch">
            <div class="card p-4 text-center m-2">
              {% if item.image %}
                <img
                  src="/../public/assets/img/pages/{{ item.image }}"
                  class="mt-2 mb-3 img-fluid border rounded shadow stretched-link"
                  alt="{{ item.title }}">
              {% endif %}
              <h2 class="h3 mt-3 mb-1">{{ item.title }}</h2>
              {% if item.description %}
                <p class="card-text mt-1 mb-4">{{ item.description }}</p>
              {% endif %}
              {% if item.link %}
                <p>
                  <a href="{{ site.baseurl }}{{ item.link }}" class="btn btn-primary stretched-link">Subscribe</a>
                </p>
              {% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>