# Third-party software and imagery

## Satellite.js 6.0.1

Source: https://registry.npmjs.org/satellite.js/-/satellite.js-6.0.1.tgz
Project: https://github.com/shashwatak/satellite-js
License: MIT. Full license: src/space/vendor/satellite-LICENSE.md.
Local modification in `json2satrec`: preserves OMM epoch digits below one millisecond; JavaScript Date otherwise truncates them. All other distribution code is unchanged. `src/space/satellites.js` propagates from the high-resolution OMM epoch using elapsed milliseconds, avoiding subtraction of large Julian dates.

## Astronomy Engine 2.1.19

Source: https://registry.npmjs.org/astronomy-engine/-/astronomy-engine-2.1.19.tgz
Project: https://github.com/cosinekitty/astronomy
Copyright (c) 2019–2023 Don Cross. MIT license is preserved in the header of src/space/vendor/astronomy.js. Distribution file unchanged. Used for coordinate rotations and sidereal time, not as the primary planetary position ephemeris.

## Scientific data and images

NASA/JPL DE440s, NAIF pck00011 and naif0012 are redistributed as a limited numerical subset with original source/checksum in src/space/data/ephemeris-meta.js. JPL/Caltech, NASA, and USGS retain their respective credits. No NASA logos are used and no endorsement is implied.

Earth: NASA Blue Marble Next Generation, January 2004, NASA Earth Observatory; resampled to 2048×1024.
Moon: NASA Scientific Visualization Studio / Ernie Wright / LRO-LROC CGI Moon Kit 2025; resampled JPEG.
Other planet visual maps: JPL Solar System Simulator texture archive, credited to the named Caltech/JPL/USGS creators; resized/recompressed. Saturn, Uranus and Neptune maps are representative artwork, not observation-accurate cloud maps.

The exact downloaded URLs and SHA-256 of bundled image files are in assets/space/sources.json. See docs/space-accuracy.md for restrictions and the separation of source-data precision from visual approximations.
