/* =============================================================================
   About — the restaurant's story, a few highlights, a feature photo and a
   small gallery of dishes.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.about = {
    render: function (config) {
      var about = config.about;
      if (!about) return "";
      var img = config.images.about;
      var gallery = config.images.gallery || [];

      return html`<section class="section about-section" id="about" aria-labelledby="about-title">
        <div class="container about__grid">
          <div class="about__text">
            <p class="eyebrow">${about.eyebrow || "Our story"}</p>
            <h2 id="about-title">${about.heading}</h2>
            ${(about.paragraphs || []).map(function (p) {
              return html`<p>${p}</p>`;
            })}
            ${RL.demoNote(config, about.demoNote || "Fictional story written for this demo. Real websites only use details the owner provides and approves.")}
          </div>

          ${img
            ? html`<figure class="about__media">
                <img src="${img.src}" alt="${img.alt}" width="1200" height="900" loading="lazy" decoding="async"
                  style="object-position: ${img.position || "50% 50%"}" />
              </figure>`
            : ""}

          ${about.highlights && about.highlights.length
            ? html`<ul class="highlights">${about.highlights.map(function (h) {
                return html`<li class="highlight">
                  <h3 class="highlight__title">${h.title}</h3>
                  <p>${h.text}</p>
                </li>`;
              })}</ul>`
            : ""}
        </div>

        ${gallery.length
          ? html`<div class="container gallery-wrap">
              <h3 class="gallery__title">${about.galleryHeading || "Gallery"}</h3>
              <ul class="gallery" tabindex="0" aria-label="${about.galleryHeading || "Photo gallery"}">
                ${gallery.map(function (g) {
                  return html`<li class="gallery__item">
                    <figure>
                      <img src="${g.src}" alt="${g.alt}" width="800" height="800" loading="lazy" decoding="async" />
                      ${g.caption ? html`<figcaption>${g.caption}</figcaption>` : ""}
                    </figure>
                  </li>`;
                })}
              </ul>
              ${RL.demoNote(config, "Photos are CC0 stock images used as placeholders. Each client's site uses photos they own or are licensed to use.")}
            </div>`
          : ""}
      </section>`;
    },
  };
})(window.RL);
