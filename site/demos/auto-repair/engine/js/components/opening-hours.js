/* =============================================================================
   Opening hours component
   - RL.hours.status(config)        → is the restaurant open right now?
   - components.hoursIndicator      → compact "Open now · Closes 9 PM" badge
   - components.hoursTable          → full weekly table (today highlighted)
   Times are calculated in the restaurant's time zone (config.hours.timezone),
   so visitors in other time zones still see the correct status.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;
  var DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  var DISPLAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  var SHORT = { sunday: "Sun", monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat" };
  var MINUTES_PER_DAY = 1440;
  var MINUTES_PER_WEEK = MINUTES_PER_DAY * 7;
  var CLOSING_SOON_MINUTES = 45;

  function toMinutes(hhmm) {
    var parts = String(hhmm).split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || "0", 10);
  }

  function formatTime(minutes) {
    var m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    var h24 = Math.floor(m / 60);
    var min = m % 60;
    if (h24 === 0 && min === 0) return "Midnight";
    if (h24 === 12 && min === 0) return "Noon";
    var h12 = ((h24 + 11) % 12) + 1;
    var suffix = h24 < 12 ? "AM" : "PM";
    return h12 + (min ? ":" + String(min).padStart(2, "0") : "") + " " + suffix;
  }

  function periodsFor(config, day) {
    var weekly = (config.hours && config.hours.weekly) || {};
    return Array.isArray(weekly[day]) ? weekly[day] : [];
  }

  function formatDay(config, day) {
    var periods = periodsFor(config, day);
    if (!periods.length) return "Closed";
    return periods
      .map(function (p) {
        return formatTime(toMinutes(p[0])) + " – " + formatTime(toMinutes(p[1]));
      })
      .join(", ");
  }

  /* Current weekday + minutes past midnight in the restaurant's time zone. */
  function nowInZone(timezone, date) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone || undefined,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(date || new Date());
      var get = function (type) {
        return parts.filter(function (p) {
          return p.type === type;
        })[0].value;
      };
      return {
        dayIndex: DAYS.indexOf(get("weekday").toLowerCase()),
        minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10),
      };
    } catch (err) {
      var d = date || new Date();
      return { dayIndex: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  /* Every opening period as [start, end] minutes from Sunday 00:00. Periods are
     repeated one week before/after so overnight and Sunday→Monday wraps work. */
  function weeklyIntervals(config) {
    var intervals = [];
    DAYS.forEach(function (day, dayIndex) {
      periodsFor(config, day).forEach(function (p) {
        var open = toMinutes(p[0]);
        var close = toMinutes(p[1]);
        if (close <= open) close += MINUTES_PER_DAY; // closes after midnight
        var start = dayIndex * MINUTES_PER_DAY + open;
        var end = dayIndex * MINUTES_PER_DAY + close;
        [-MINUTES_PER_WEEK, 0, MINUTES_PER_WEEK].forEach(function (shift) {
          intervals.push([start + shift, end + shift]);
        });
      });
    });
    return intervals.sort(function (a, b) {
      return a[0] - b[0];
    });
  }

  function hasHours(config) {
    return DAYS.some(function (day) {
      return periodsFor(config, day).length > 0;
    });
  }

  RL.hours = {
    DISPLAY_ORDER: DISPLAY_ORDER,
    formatDay: formatDay,
    formatTime: formatTime,
    hasHours: hasHours,
    nowInZone: nowInZone,

    todayName: function (config) {
      return DAYS[nowInZone(config.hours && config.hours.timezone).dayIndex];
    },

    /* Returns { isOpen, label, detail } describing the current status. */
    status: function (config, date) {
      if (!hasHours(config)) return null;
      var now = nowInZone(config.hours.timezone, date);
      var t = now.dayIndex * MINUTES_PER_DAY + now.minutes;
      var intervals = weeklyIntervals(config);

      for (var i = 0; i < intervals.length; i++) {
        if (t >= intervals[i][0] && t < intervals[i][1]) {
          var minutesLeft = intervals[i][1] - t;
          return {
            isOpen: true,
            closingSoon: minutesLeft <= CLOSING_SOON_MINUTES,
            label: minutesLeft <= CLOSING_SOON_MINUTES ? "Closing soon" : "Open now",
            detail: "Closes " + formatTime(intervals[i][1]),
          };
        }
      }

      var next = intervals.filter(function (iv) {
        return iv[0] > t;
      })[0];
      var detail = "";
      if (next) {
        var dayDiff = Math.floor(next[0] / MINUTES_PER_DAY) - Math.floor(t / MINUTES_PER_DAY);
        var nextDay = DAYS[((Math.floor(next[0] / MINUTES_PER_DAY) % 7) + 7) % 7];
        var when = dayDiff === 0 ? "" : dayDiff === 1 ? "tomorrow " : SHORT[nextDay] + " ";
        detail = "Opens " + when + formatTime(next[0]);
      }
      return { isOpen: false, closingSoon: false, label: "Closed now", detail: detail };
    },

    /* Groups consecutive days with identical hours: "Tue – Thu". */
    grouped: function (config) {
      var groups = [];
      DISPLAY_ORDER.forEach(function (day) {
        var text = formatDay(config, day);
        var last = groups[groups.length - 1];
        if (last && last.text === text) last.days.push(day);
        else groups.push({ days: [day], text: text });
      });
      return groups.map(function (g) {
        var first = SHORT[g.days[0]];
        var label = g.days.length > 1 ? first + " – " + SHORT[g.days[g.days.length - 1]] : first;
        return { label: label, text: g.text };
      });
    },
  };

  /* ---------- Compact indicator (used in the hero) -------------------------*/
  RL.components.hoursIndicator = {
    render: function (config) {
      if (!hasHours(config)) return "";
      return html`<div class="hours-status">
        <p class="hours-indicator" data-hours-indicator aria-live="polite">
          <span class="hours-indicator__dot" aria-hidden="true"></span>
          <span class="hours-indicator__text" data-hours-text>Checking today's hours…</span>
        </p>
        ${RL.demoTag(config, "Sample hours")}
      </div>`;
    },
    init: function (root, config) {
      var el = root.querySelector("[data-hours-indicator]");
      if (!el) return;
      var text = el.querySelector("[data-hours-text]");
      function update() {
        var s = RL.hours.status(config);
        if (!s) return;
        el.classList.toggle("is-open", s.isOpen && !s.closingSoon);
        el.classList.toggle("is-closing", s.closingSoon);
        el.classList.toggle("is-closed", !s.isOpen);
        text.textContent = s.label + (s.detail ? " · " + s.detail : "");
      }
      update();
      setInterval(update, 60 * 1000);
    },
  };

  /* ---------- Weekly table (used in the Visit section) ---------------------*/
  RL.components.hoursTable = {
    render: function (config) {
      if (!hasHours(config)) return "";
      var today = RL.hours.todayName(config);
      var rows = DISPLAY_ORDER.map(function (day) {
        var isToday = day === today;
        return html`<tr class="${isToday ? "is-today" : ""}">
          <th scope="row">${day.charAt(0).toUpperCase() + day.slice(1)}${isToday ? html` <span class="today-label">Today</span>` : ""}</th>
          <td>${formatDay(config, day)}</td>
        </tr>`;
      });
      return html`<table class="hours-table">
        <caption class="visually-hidden">Weekly opening hours</caption>
        <tbody>${rows}</tbody>
      </table>`;
    },
  };
})(window.RL);
