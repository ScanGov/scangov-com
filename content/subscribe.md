---
layout: layouts/cards
date: 2025-08-08
modified: 
author: ScanGov
title: "Subscribe"
description: "Sign up for ScanGov newsletters."
permalink: /subscribe/
---

<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card-group">
        {% for item in subscribe %}
          <div class="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 d-flex align-items-stretch">
            <div class="card mx-2 my-2 pt-2">
              <div class="card-body">
                {% if item.icon %}
                  <i class="{{ item.icon }} fa-lg d-block mb-2" aria-hidden="true"></i>
                {% endif %}
                <h2 class="h4 mb-2 mt-3">{{ item.title }}</h2>
                {% if item.description %}
                  <p class="card-text small">{{ item.description }}</p>
                {% endif %}
                {% if item.link %}
                  <a href="{{ item.link }}" class="stretched-link" target="_blank" rel="noopener" aria-label="Subscribe to {{ item.title }}"></a>
                {% endif %}
              </div>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>
