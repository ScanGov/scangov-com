---
layout: "layouts/default"
date: 2025-08-30
modified:
author: ScanGov
title: Thank you!
description: We look forward to meeting with you.
permalink: /demo-confirm/
sitemap: false
---

<div class="container">
  <div class="row">
    <div class="col-12">
      <h2>Connect with us</h2>
      <div class="card-group">
        {% if site.discord %}
        <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 d-flex align-items-stretch">
          <div class="card mx-2 my-2 pt-2">
            <div class="card-body">
              <i class="fa-brands fa-discord fa-lg d-block mb-2" aria-hidden="true"></i>
              <h3 class="h4 mb-2 mt-3"><a href="{{ site.discord }}" class="stretched-link" target="_blank" rel="noopener">Discord</a></h3>
            </div>
          </div>
        </div>
        {% endif %}
        {% if site.substack %}
        <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 d-flex align-items-stretch">
          <div class="card mx-2 my-2 pt-2">
            <div class="card-body">
              <i class="fa-solid fa-envelope-open-text fa-lg d-block mb-2" aria-hidden="true"></i>
              <h3 class="h4 mb-2 mt-3"><a href="{{ site.substack }}" class="stretched-link" target="_blank" rel="noopener">Substack</a></h3>
            </div>
          </div>
        </div>
        {% endif %}
        {% if site.linkedin %}
        <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 d-flex align-items-stretch">
          <div class="card mx-2 my-2 pt-2">
            <div class="card-body">
              <i class="fa-brands fa-linkedin fa-lg d-block mb-2" aria-hidden="true"></i>
              <h3 class="h4 mb-2 mt-3"><a href="{{ site.linkedin }}" class="stretched-link" target="_blank" rel="noopener">LinkedIn</a></h3>
            </div>
          </div>
        </div>
        {% endif %}
        {% if site.youtube %}
        <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 d-flex align-items-stretch">
          <div class="card mx-2 my-2 pt-2">
            <div class="card-body">
              <i class="fa-brands fa-youtube fa-lg d-block mb-2" aria-hidden="true"></i>
              <h3 class="h4 mb-2 mt-3"><a href="{{ site.youtube }}" class="stretched-link" target="_blank" rel="noopener">YouTube</a></h3>
            </div>
          </div>
        </div>
        {% endif %}
        {% if site.github %}
        <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 d-flex align-items-stretch">
          <div class="card mx-2 my-2 pt-2">
            <div class="card-body">
              <i class="fa-brands fa-github fa-lg d-block mb-2" aria-hidden="true"></i>
              <h3 class="h4 mb-2 mt-3"><a href="{{ site.github }}" class="stretched-link" target="_blank" rel="noopener">GitHub</a></h3>
            </div>
          </div>
        </div>
        {% endif %}
        {% if site.rss %}
        <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 d-flex align-items-stretch">
          <div class="card mx-2 my-2 pt-2">
            <div class="card-body">
              <i class="fa-solid fa-rss fa-lg d-block mb-2" aria-hidden="true"></i>
              <h3 class="h4 mb-2 mt-3"><a href="{{ site.rss }}" class="stretched-link" target="_blank" rel="noopener">RSS</a></h3>
            </div>
          </div>
        </div>
        {% endif %}
      </div>
    </div>
  </div>
</div>
