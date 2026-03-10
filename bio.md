---
layout: page
title: Biography
permalink: /bio/
---

<style>
/* ======================================
DESKTOP
====================================== */

.bio-content.bio-md-fix{
  margin-left:-70px;
}

.bio-text-block{
  max-width:640px;
  margin:0;
  padding:100px 40px 40px 0;
  color:#f5efe6;
  text-align:left;
  font-family:'EB Garamond', serif;
  box-sizing:border-box;
}

/* ======================================
MOBILE / NARROW SCREEN
====================================== */

@media (max-width:900px){

  .bio-layout{
    display:block !important;
  }

  /* Hide the portrait */

  .bio-photo{
    display:none !important;
  }

  .bio-content.bio-md-fix{
    margin-left:0 !important;
    padding:0 !important;
    display:block !important;
    width:100% !important;
  }

  .bio-text-block{
    max-width:620px !important;
    margin:0 auto !important;
    padding:36px 24px 40px 24px !important;
  }

  .bio-text-block h1{
    font-size:36px !important;
    line-height:1.2 !important;
    letter-spacing:0.10em !important;
    text-align:center !important;
    margin:0 0 18px 0 !important;
    word-break:normal !important;
  }

  .bio-text-block .bio-role{
    font-size:16px !important;
    line-height:1.7 !important;
    letter-spacing:0.08em !important;
    text-align:center !important;
    margin:0 0 26px 0 !important;
  }

  .bio-text-block .bio-p{
    font-size:18px !important;
    line-height:1.75 !important;
    letter-spacing:0.01em !important;
    text-align:left !important;
    margin:0 0 20px 0 !important;
  }

  .bio-text-block .bio-p:last-child{
    margin-bottom:0 !important;
  }
}
</style>

<div class="bio-layout">

  <div class="bio-photo">
    <img src="{{ '/assets/profile.jpg' | relative_url }}" alt="Soulaiman B. Mershed">
  </div>

  <div class="bio-content bio-md-fix">

    <div class="bio-text-block">

      <h1
        style="
          margin:0 0 20px 0;
          font-size:48px;
          font-weight:400;
          letter-spacing:0.18em;
          line-height:1.2;
          color:#f8efe3;
        "
      >
        Soulaiman B. Mershed
      </h1>

      <p
        class="bio-role"
        style="
          margin:0 0 35px 0;
          font-size:20px;
          letter-spacing:0.16em;
          color:#636363;
          line-height:1.8;
        "
      >
        Author exploring cognition, media, and social dynamics..
      </p>

      <p
        class="bio-p"
        style="
          margin:0 0 24px 0;
          font-size:21px;
          line-height:1.9;
          letter-spacing:0.01em;
          color:#f5efe6;
        "
      >
        Soulaiman B. Mershed writes on the intersection of neuroscience,
        behavioral economics, and long-term civilizational thinking.
        His work explores how cognitive architecture interacts with
        modern technological systems.
      </p>

      <p
        class="bio-p"
        style="
          margin:0;
          font-size:21px;
          line-height:1.9;
          letter-spacing:0.01em;
          color:#f5efe6;
        "
      >
        He is currently working on a trilogy examining the relationship
        between human cognition, social structures, and technological
        acceleration.
      </p>
      <p
  class="bio-p"
  style="
    margin:24px 0 0 0;
    font-size:21px;
    line-height:1.9;
    letter-spacing:0.01em;
    color:#f5efe6;
  "
>
  He is building his intellectual body of work through
  <a
    href="/branch-press/"
    style="
      color: #978729;
      text-decoration:none;
      border-bottom:0px solid #ac9c43;
    "
  >
    Branch Press
  </a>,
  the publishing imprint through which his current and forthcoming works are developed.
</p>

    </div>

  </div>

</div>