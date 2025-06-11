---
layout: layouts/default
title: "What they say"
date: 2025-04-26
modified: 
author: ScanGov
description: "What people say about ScanGov."
---

<div class="container mt-4">
    <div class="row post">
        <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"></div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
            {% for item in quotes %}
            <div class="card-quote border-bottom my-2 py-4">
                <div class="card-body px-2">
                    <blockquote>
                        <p>&ldquo;{{ item.quote | safe }}&rdquo;</p>
                    </blockquote>
                    <footer class="text-secondary text-end">
                        {{ item.name }}<br>{{ item.title }}<br>{{ item.org }}</footer>
                </div>
            </div>
            {% endfor %}
        </div>
        <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"></div>
    </div>
</div>
