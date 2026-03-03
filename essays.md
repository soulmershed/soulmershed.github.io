---
layout: page
title: Essays
permalink: /essays/
---

A dated archive of essays and research notes.

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <span class="post-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
      <h3>
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      </h3>

      {% if post.excerpt %}
        <p>{{ post.excerpt | strip_html | truncate: 220 }}</p>
      {% endif %}
    </li>
  {% endfor %}
</ul>
