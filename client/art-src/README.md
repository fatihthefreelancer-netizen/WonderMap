# Art masters

The PNG exports the chapter art was delivered as. **Nothing here is served.**

`public/` is copied verbatim into `dist/` at build time, so every byte that
sits in it is a byte the browser downloads and a byte the deploy carries. The
same images as WebP are 72% smaller (7.59 MB → 2.14 MB) with no visible
difference at the sizes the game draws them, so `public/` holds the WebP and
the PNG masters live here instead.

To re-export after an edit, write the PNG into the matching folder here and run
the converter: small marks (<= 96px on the long edge) go lossless, everything
else is encoded both ways and the smaller file wins.

`unused/` is art nothing in the code refers to any more — the golden and dusk
market frames from the time-of-day progression that was taken out, plus a
donkey and a sun that were never wired up. Kept because they are good, and
because "unused" has been wrong before.
