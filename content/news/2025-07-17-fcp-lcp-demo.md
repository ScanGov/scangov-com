---
title: "First Contentful Paint (FCP) + Largest Contentful Paint (LCP) demo"
description: "ScanGov demos how we conduct performance audits related to First Contentful Paint (FCP) and Largest Contentful Paint (LCP)."
date: 2025-07-17
author: aaron-hans
video: 6ElhrWOutL0
eleventyComputed:
  permalink: /news/fcp-lcp-demo/
keywords:
  - performance
  - FCP
  - LCP
  - web vitals
---

I'm gonna go over the steps I took to remedy performance problems on the Scangov site, specifically, front-end choices that needed to be reviewed in order to get a decent first contentful paint and largest contentful paint.

We can see on the ScanGov dashboard that this site has performance problems and these metrics are flagged. The Google Page Speed tool agrees. There are problems in these areas on the standards.scangov.org site. Here's the site. First contentful paint is when something starts being rendered. The visitor can see some part of your site on the page. This might only be the header, and the rest of the page could be blank. That counts. We want to see this occur in 1.8 seconds. Largest contentful paint is a really important metric that's recorded when the biggest section of the page renders. We want to see this happen in 2.5 seconds. This is a pretty simple site. It's built from a data set of government standards mapped to the scans ScanGov runs to get insight into compliance. It was built quickly with Bootstrap and Font Awesome. It doesn't have advanced client side interactivity, so you'd expect getting a high performance score would be a piece of cake. The thing is that these two libraries, Bootstrap and Font Awesome, which are pretty common and fundamental, have large code bases that will block your page rendering if you just include the whole thing in the header, like instructed in their Hello World docs.

So, first thing is, we have to check what's going on in the performance graph each time because my initial hypothesis of the biggest win isn't always right. What we see here is the performance tab of Chrome dev tools. I've got network throttling on, so these steps take a little longer and we can see everything clearly. I'm zoomed in on the beginning of the process.

You might think you use your web application and it seems fast for you, and there's no problem, but everybody gets into situations where they experience performance degradation. You might get your bandwidth throttled on a shared network. Your device may shut down some cores when the battery gets low. Everybody on the train commuting is going through different network connectivity patches, emergencies, and stress networks — and that makes performance even more critical.

## Removing Font Awesome JS

When we're looking at this trace, one thing that jumps out is the largest JavaScript file being delivered to the client, which is the Font Awesome JS. We need to trim these things down in order to meet our performance goals. The requirement here is to preserve all site features. We aren't gonna remove functionality in order to meet performance goals. We need to reorganize resources so that our dependencies aren't unnecessarily wasting people's time and making our site annoying to use.

What we can reach for here is the 11ty Font Awesome library. This is a fantastic tool. This allows us to drop the Font Awesome JavaScript dependency completely and still use all the icons we want. All that client-side JavaScript was doing was inserting SVGs into the page, and with this library, we can now do that at build time instead of render time.

## Inlining CSS with PurgeCSS

The next step is to combine and inline all the CSS. We use PurgeCSS for this. Here's how we implemented it in our 11ty config, so that it's inlined dynamically on every page.

Now let's run another performance check. Painting speed is way better, but it's still above the target thresholds. What we have going on here is all the library JavaScript. This stuff was just thrown in, there's duplication, and we aren't even using anything other than the toggles. So, I can just grab the toggle switch code from Bootstrap and drop everything else.

## Results

Now we're at the thresholds. This is a successful change from totally failing FCP and LCP to cleanly passing both of them. An interesting point is, this has now exposed the behavior of the Google tracking script as a little bit of a problem, and since the contentful paints are so fast, the GA script is hogging the main thread after rendering is complete. This is a less serious problem, but still causing the page to be sluggish if you were clicking on things right away, so we'll address that in the next segment.
