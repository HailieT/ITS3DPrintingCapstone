/* ============================================================
   LAYOUT PHOTOS — Edit this file to place photos on the page.

   banner  — photo used as the background of the title area (header).
             A dark garnet overlay is added so the title stays readable.
             Leave src "" to keep the plain garnet gradient.
   left    — photos stacked down the left side of the page.
   right   — photos stacked down the right side of the page.

   Each photo: { src, alt }
     src — path to the image, e.g. "assets/images/banner.jpg"
           Leave "" to show a dashed placeholder box.
     alt — short description for screen readers.
           Use "" if the photo is purely decorative.

   Add or remove entries in left/right to change how many show.
   Side photos only appear on screens at least 1200px wide.
   Tip: banner works best at about 1600x500 px; side photos at
   about 360x480 px (3:4, portrait).
   ============================================================ */

window.LAYOUT_IMAGES = {
  banner: { src: "assets/images/KooiImage.jfif", alt: "" },

  left: [
    { src: "assets/images/RiseImage1.jfif", alt: "" },
    { src: "", alt: "" },
  ],

  right: [
    { src: "", alt: "" },
    { src: "", alt: "" },
  ],
};
