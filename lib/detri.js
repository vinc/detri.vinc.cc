if (typeof require === 'function') {
  var sprintf = require('sprintf-js').sprintf; // TODO: Remove this dependency
}

(function () { 'use strict';
  var Find = {
    J2000: 2451545.0009,

    sin: function(deg) {
      return Math.sin(deg * Math.PI / 180);
    },

    unixToJulian: function(unix) {
      return ((unix / 1000) / 86400) + 2440587.5;
    },

    julianToUnix: function(julian) {
      return 1000 * (julian - 2440587.5) * 86400;
    },

    // Equations from Wikipedia: https://en.wikipedia.org/wiki/Sunrise_equation
    julianTransit: function(date, latitude, longitude) {
      var lon = -longitude;

      // Julian Date
      var julianDate = this.unixToJulian(+date);

      // Julian Cycle
      var n = Math.floor(julianDate - this.J2000 - lon / 360 + 0.50);

      // Approximate Solar Noon
      var noon = this.J2000 + n + lon / 360;

      // Solar Mean Anomaly
      var anomaly = (357.5291 + 0.98560028 * (noon - this.J2000)) % 360;

      // Equation of the Center
      var center = 1.9148 * this.sin(1 * anomaly)
                 + 0.0200 * this.sin(2 * anomaly)
                 + 0.0003 * this.sin(3 * anomaly);

      // Ecliptic Longitude
      var eclipticLongitude = (anomaly + center + 102.9372 + 180) % 360;

      // Solar Transit
      var transit = noon
          + 0.0053 * this.sin(anomaly)
          - 0.0069 * this.sin(2 * eclipticLongitude);

      return transit;
    },

    noon: function(date, latitude, longitude) {
      var h = this.julianTransit(date, latitude, longitude);

      return new Date(this.julianToUnix(h));
    },

    midnight: function(date, latitude, longitude) {
      var h = this.julianTransit(date, latitude, longitude) - 0.5;

      return new Date(this.julianToUnix(h));
    }
  }

  function Detri(ephemeris, timestamp, latitude, longitude) {
    var newMoons = ephemeris.new_moons.slice();
    var solstices = ephemeris.solstices.slice();
    var t = 0;
    var d = 0;
    var m = 0;
    var y = 1;

    // A mean solar day is currently about 86400002 milliseconds long but the
    // duration of the apparent solar day varies during the year.
    var lat = latitude;
    var lon = longitude;
    var now = new Date(timestamp);
    var tom = new Date(timestamp + 86400000);
    var midnight = Find.midnight(now, lat, lon);

    if (midnight > now) { // FIXME: Bug during a few minutes before midnight
      midnight = Find.midnight(new Date(now - 86400000), lat, lon);
      tom = new Date(timestamp);
    }
    var duration = Find.midnight(tom, lat, lon) - midnight;

    var newMoon = newMoons.shift();
    var solstice = solstices.shift();
    var solsticeCount = 0;

    while (t < midnight) {
      t += 86400000;
      if (solstice < t + 86400000) {
        solsticeCount++;
        solstice = solstices.shift();
      }
      if (newMoon < t + 86400000) {
        if (solsticeCount == 2) {
          solsticeCount = 0;
          m = 0;
          y++;
        }
        m++;
        d = 0;
        newMoon = newMoons.shift();
      }
      d++;
    }

    var elapsed = (now - midnight) / duration;

    this.year = y;
    this.month = m;
    this.day = d;
    this.centiday = (elapsed * 100);
    this.breath = (elapsed * 10000) % 100;
    this.beat = (elapsed * 100000) % 1000;
  }

  Detri.prototype.toDate = function() {
    var y = this.year;
    var m = this.month;
    var d = this.day;
    return sprintf('%02d:%02d:%02d', y, m, d);
  }

  Detri.prototype.toTime = function() {
    var c = this.centiday;
    var b = this.breath;
    return sprintf('%02d:%02d', c, b);
  }

  Detri.prototype.toString = function() {
    var date = this.toDate();
    var time = this.toTime();
    return sprintf('%s:%s', date, time);
  }

  if (typeof define === 'function' && define.amd) {
    define(Detri); // AMD
  } else if (typeof module !== 'undefined') {
    module.exports = Detri; // Node
  } else {
    window.Detri = Detri; // Browser
  }
}());
