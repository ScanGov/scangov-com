---
layout: layouts/default
date: 2025-04-25
modified: 
author: ScanGov
title: "Meet"
description: "Schedule a meeting with ScanGov."
permalink: /meet/
---
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card-group">
        {% for item in schedule %}
          <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-stretch">
            <div class="card p-4 text-center m-2">
              {% if item.icon %}
                <i class="{{ item.icon }} fa-xl mt-2" aria-label="hidden"></i>
              {% endif %}
              <h2 class="h3 mt-3 mb-1">{{ item.title }}</h2>
              {% if item.description %}
                <p class="card-text mt-1 mb-4">{{ item.description }}</p>
              {% endif %}
              {% if item.link %}
                <p>
                  <a href="{{ site.baseurl }}{{ item.link }}" class="btn btn-primary stretched-link">Schedule</a>
                </p>
              {% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>