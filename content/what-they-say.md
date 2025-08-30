---
layout: layouts/default
date: 2025-04-26
modified: 
author: ScanGov
title: "What they say"
description: "What people say about ScanGov."
---

<div class="container mt-4">
  <div class="row post">
    <div class="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"></div>
    <div class="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
      {% for item in quotes %}
        <div class="card-quote border-bottom my-2 py-4">
          <div class="card-body px-2">
            <blockquote>
              <p>&ldquo;{{ item.quote | safe }}&rdquo;</p>
            </blockquote>
            <div class="card-footer text-secondary text-end">
              {{ item.name }}<br>
              {{ item.title }}<br>
              {%- if item["org-link"] %}
                <a href="{{ item["org-link"] }}" target="_blank">{{ item.org }}</a>
              {%- else %}
                {{ item.org }}
              {%- endif -%}
            </div>
          </div>
        </div>
      {% endfor %}
    </div>
    <div class="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"></div>
  </div>
</div>