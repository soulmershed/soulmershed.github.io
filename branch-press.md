---
layout: page
title: Branch Press
permalink: /branch-press/
---

<style>
/* =========================================================
BRANCH PRESS PAGE — FULLY CONTROLLABLE
Modify values here to control the page visually
========================================================= */

/* HIDE THE TITLE THAT layout: page ADDS AUTOMATICALLY */
.post-header{
  display:none;
}

/* PAGE SECTION */
.branch-press-page{
  max-width:1100px;
  margin:0 auto;
  padding:80px 32px 100px 32px;
  color:#f5efe6;
  font-family:'EB Garamond', serif;
  box-sizing:border-box;
}

/* LOGO BLOCK */
.branch-press-logo-wrap{
  text-align:center;
  margin:0 0 28px 0;   /* MODIFY: gap below logo */
}

.branch-press-logo{
  display:inline-block;
  width:220px;         /* MODIFY: logo size */
  max-width:80%;
  height:auto;
  border:none;
  box-shadow:none;
}

/* SLOGAN BLOCK */
.branch-press-slogan{
  display:block;
  max-width:900px;      /* keeps the line visually balanced */
  margin:0 auto 48px auto;   /* true horizontal centering */
  text-align:center;

  font-size:1.4rem;
  line-height:1.8;
  letter-spacing:0.18em;
  color:#8f8f8f;
}

.branch-press-kicker{
  display:block;
  text-align:center;
  margin:0 auto 18px auto;
}

/* INTRO BLOCK */
.branch-press-intro{
  max-width:760px;     /* MODIFY: reading width */
  margin:0 auto;
  text-align:left;     /* MODIFY: left / justify / center */
}

.branch-press-intro h1{
  margin:0 0 28px 0;
  font-size:3rem;      /* MODIFY: title size */
  font-weight:400;
  line-height:1.15;
  letter-spacing:0.08em;
  color:#f8efe3;
  text-align:center;   /* MODIFY */
}

.branch-press-intro p{
  margin:0 0 24px 0;   /* MODIFY: paragraph gap */
  font-size:1.35rem;   /* MODIFY: paragraph size */
  line-height:1.9;     /* MODIFY: line spacing */
  letter-spacing:0.01em;
  color:#f5efe6;
}

.branch-press-intro p:last-child{
  margin-bottom:0;
}

/* OPTIONAL SMALL LABEL */
.branch-press-kicker{
  margin:0 0 18px 0;
  text-align:center;
  font-size:0.95rem;
  line-height:1.6;
  letter-spacing:0.22em;
  color:#c6a47a;
  text-transform:uppercase;
}

/* MOBILE */
@media (max-width:900px){

  .branch-press-page{
    padding:42px 22px 60px 22px;
  }

  .branch-press-logo-wrap{
    margin-bottom:22px;
  }

  .branch-press-logo{
    width:170px;
    max-width:75%;
  }

  .branch-press-slogan{
    font-size:1rem;
    line-height:1.7;
    letter-spacing:0.10em;
    margin-bottom:34px;
  }

  .branch-press-intro{
    max-width:none;
  }

  .branch-press-intro h1{
    font-size:2.2rem;
    line-height:1.2;
    letter-spacing:0.05em;
    margin-bottom:22px;
  }

  .branch-press-intro p{
    font-size:1.15rem;
    line-height:1.8;
    margin-bottom:20px;
  }

  .branch-press-kicker{
    font-size:0.85rem;
    letter-spacing:0.14em;
  }
}
</style>

<div class="branch-press-page">

  <div class="branch-press-logo-wrap">
    <img
      class="branch-press-logo"
      src="{{ '/assets/sbmershedpress.png' | relative_url }}"
      alt="Branch Press logo"
    >
  </div>

  <p class="branch-press-slogan">
    Books as tools. Thought as cultivation.
  </p>

  <div class="branch-press-intro">

    <p class="branch-press-kicker">
      Publishing imprint
    </p>

    <h1>{{ page.title }}</h1>

    <p>
      Branch Press is the publishing imprint through which the work of
      Soulaiman B. Mershed is developed, organized, and presented. It is
      conceived not merely as a label for publication, but as a framework
      for cultivating a coherent body of work across books, essays, and
      long-form inquiry.
    </p>

    <p>
      The name reflects a simple but foundational idea: tools shape human
      possibility. A branch belongs among humanity’s earliest tools—modest
      in form, yet profound in implication. In that sense, the press adopts
      the branch as both symbol and principle. Books, too, are tools: they
      extend thought, preserve inquiry, and help structure attention across
      time.
    </p>

    <p>
      Branch Press is dedicated to work at the intersection of cognition,
      systems, technological change, and long-term civilizational thinking.
      Its central aim is to support writing that is intellectually serious,
      structurally coherent, and oriented toward questions whose importance
      extends beyond immediate trends.
    </p>

    <p>
      It serves as the home of current and forthcoming works, including
      <em>The Trilogy of Mind</em>, while also providing a broader
      publishing identity for essays, reflections, and future projects
      developed within the same intellectual horizon.
    </p>

  </div>
</div>