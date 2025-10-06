// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.querySelector(".sidebar");
  const notifIcon = document.getElementById("notifIcon");
  const notifDropdown = document.getElementById("notificationsDropdown");
  const notifList = document.getElementById("notificationsList");
  const notifEmpty = notifDropdown ? notifDropdown.querySelector(".dropdown-empty") : null;
  const notifBadgeEl = document.getElementById("notifBadge");
  const statusBarEl = document.getElementById("statusBar");
  const statusIconEl = document.getElementById("statusIcon");
  const statusMessageEl = document.getElementById("statusMessage");
  const defaultStatusIcon = statusIconEl ? (statusIconEl.textContent || "check_circle").trim() || "check_circle" : "check_circle";
  const defaultStatusMessage = statusMessageEl ? statusMessageEl.textContent.trim() : "";
  const defaultStatusLinks = {};
  const STATUS_SEVERITY_CLASSES = new Set(["success", "info", "warning", "danger"]);
  const DEFAULT_COPYRIGHT_YEAR = 2025;
  const DEFAULT_PROFILE_DROPDOWNS = {
    profile: {
      sections: [
        {
          title: "I do",
          items: [
            "User research & usability testing",
            "Information architecture & flows",
            "Wireframes, prototypes, and design systems",
            "Data-informed decisions and KPIs",
            "Collaborative delivery with eng/product"
          ]
        },
        {
          title: "I don't",
          items: [
            "Design without user validation",
            "Dark patterns or deceptive UX",
            "Over-polish at the expense of clarity",
            "Bloated process without outcomes"
          ]
        }
      ]
    },
    ux: {
      sections: [
        {
          items: [
            "User-centered Design",
            "Qualitative User Research",
            "Contextual Inquiry",
            "Discovery, Ideation & Prioritization",
            "Rapid Prototyping",
            "Design Thinking",
            "Cross-platform/Mobile Design",
            "Usability Testing & Design Validation",
            "Journey mapping & IA",
            "Accessibility (WCAG)"
          ]
        }
      ]
    },
    fd: {
      sections: [
        {
          items: [
            "HTML5, CSS3, JS/TS",
            "React, component systems",
            "Design tokens & theming",
            "Performance & accessibility",
            "Tooling & CI basics"
          ]
        }
      ]
    },
    ag: {
      sections: [
        {
          items: [
            "Sprint planning, reviews, retrospectives",
            "Backlog refinement & prioritization",
            "User stories & acceptance criteria",
            "Estimation (story points), velocity, burndown",
            "Impediment removal & team facilitation",
            "Scrum/Agile UX"
          ]
        }
      ]
    },
    ai: {
      sections: [
        {
          items: [
            "LLM product UX",
            "Prompt design & evaluation",
            "Ethics & guardrails",
            "Data visualization"
          ]
        }
      ]
    },
    leadership: {
      sections: [
        {
          items: [
            "Team Leadership & Development",
            "Stakeholder Management",
            "Creative Direction",
            "Digital Product Transformation",
            "Vision, strategy, and storytelling",
            "Cross-Functional Collaboration",
            "Culture of outcomes and learning"
          ]
        }
      ]
    }
  };

  const renderStatusMessage = (message, links) => {
    if (!statusMessageEl) return;
    statusMessageEl.innerHTML = "";
    const normalizedMessage = typeof message === "string" ? message : defaultStatusMessage;
    if (!normalizedMessage) return;

    const tokens = normalizedMessage.split(/(\{\{[^}]+\}\})/g);

    tokens.forEach((token) => {
      if (!token) return;
      const placeholderMatch = token.match(/^\{\{([^}]+)\}\}$/);
      if (!placeholderMatch) {
        statusMessageEl.appendChild(document.createTextNode(token));
        return;
      }

      const [keyRaw, labelRaw] = placeholderMatch[1]
        .split("|")
        .map((part) => part.trim());
      const key = keyRaw || "";
      if (!key) {
        statusMessageEl.appendChild(document.createTextNode(token));
        return;
      }

      const linkEntry = links && typeof links === "object" ? links[key] : undefined;
      if (!linkEntry) {
        statusMessageEl.appendChild(document.createTextNode(labelRaw || key));
        return;
      }

      const href = typeof linkEntry === "string" ? linkEntry : linkEntry?.href;
      const label = labelRaw || (typeof linkEntry === "object" && (linkEntry.label || linkEntry.text)) || key;

      if (!href) {
        statusMessageEl.appendChild(document.createTextNode(label));
        return;
      }

      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.classList.add("status-link");
      anchor.textContent = label;

      if (typeof linkEntry === "object" && linkEntry.target) {
        anchor.target = linkEntry.target;
      } else if (/^https?:/i.test(href)) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }

      if (typeof linkEntry === "object" && linkEntry.rel) {
        anchor.rel = linkEntry.rel;
      }

      statusMessageEl.appendChild(anchor);
    });
  };

  const applyProfileDropdowns = (dropdownData) => {
    const containers = document.querySelectorAll("[data-profile-key]");
    if (!containers.length) return;

    containers.forEach((container) => {
      const key = container.getAttribute("data-profile-key");
      if (!key) return;
      const entry = dropdownData?.[key] || DEFAULT_PROFILE_DROPDOWNS[key];
      const sections = entry && Array.isArray(entry.sections) ? entry.sections : [];

      container.innerHTML = "";

      sections.forEach((section) => {
        const items = Array.isArray(section?.items) ? section.items : [];
        if (!items.length) return;

        const sectionEl = document.createElement("div");
        const isTextOnly = key !== "profile";
        sectionEl.classList.add("dropdown-section");
        if (isTextOnly) {
          sectionEl.classList.add("dropdown-section--text");
        }

        if (section.title) {
          const headerEl = document.createElement("div");
          headerEl.classList.add("dropdown-subheader");
          headerEl.textContent = section.title;
          sectionEl.appendChild(headerEl);
        }

        if (sectionEl.classList.contains("dropdown-section--text")) {
          items.forEach((item) => {
            if (item == null) return;
            const paragraph = document.createElement("p");
            paragraph.classList.add("dropdown-text");
            paragraph.textContent = item;
            sectionEl.appendChild(paragraph);
          });
        } else {
          const listEl = document.createElement("ul");
          items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            listEl.appendChild(li);
          });
          sectionEl.appendChild(listEl);
        }

        container.appendChild(sectionEl);
      });
    });
  };

  const applySiteMeta = (siteMeta) => {
    const year = Number.isFinite(siteMeta?.copyrightYear)
      ? siteMeta.copyrightYear
      : DEFAULT_COPYRIGHT_YEAR;
    document.querySelectorAll(".copyright-text").forEach((el) => {
      el.textContent = `© ${year} Designed and developed by Jeremy T Freeman`;
    });
  };

  // Helpers to manage notifications UI
  const renderNotifications = (items = []) => {
    if (!notifList || !notifEmpty) return;
    // Clear current list
    notifList.innerHTML = "";
    // Populate
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.text || String(item);
      notifList.appendChild(li);
    });
    // Toggle empty state
    const hasItems = items.length > 0;
    notifEmpty.style.display = hasItems ? "none" : "block";
    // Update badge (keep as a dot when there are any unread, hide when none)
    if (notifBadgeEl) {
      notifBadgeEl.style.display = hasItems ? "inline-block" : "none";
      notifBadgeEl.setAttribute(
        "aria-label",
        hasItems ? `${items.length} unread notification${items.length > 1 ? "s" : ""}` : "No unread notifications"
      );
    }
  };

  // Load notifications from JSON file
  const NOTIF_JSON_URL = "data/notifications.json";
  const PROFILE_DROPDOWNS_URL = "data/profile-dropdowns.json";
  const SITE_META_URL = "data/site-meta.json";

  const loadAppData = async () => {
    const [notifResult, profileResult, metaResult] = await Promise.allSettled([
      fetch(NOTIF_JSON_URL, { cache: "no-store" }),
      fetch(PROFILE_DROPDOWNS_URL, { cache: "no-store" }),
      fetch(SITE_META_URL, { cache: "no-store" })
    ]);

    let notifications = [];
    let statusConfig;
    if (notifResult.status === "fulfilled" && notifResult.value.ok) {
      try {
        const notifData = await notifResult.value.json();
        notifications = Array.isArray(notifData)
          ? notifData
          : Array.isArray(notifData?.notifications)
            ? notifData.notifications
            : [];
        statusConfig = notifData && typeof notifData === "object" && !Array.isArray(notifData)
          ? notifData.statusBar
          : undefined;
      } catch (err) {
        console.warn("Failed to parse notifications JSON", err);
      }
    } else {
      console.warn("Notifications JSON load failed", notifResult.reason || (notifResult.value && notifResult.value.status));
    }

    renderNotifications(notifications);
    applyStatusBarSettings(statusConfig);

    let dropdownConfig;
    if (profileResult.status === "fulfilled" && profileResult.value.ok) {
      try {
        dropdownConfig = await profileResult.value.json();
      } catch (err) {
        console.warn("Failed to parse profile dropdown JSON", err);
      }
    } else if (profileResult.status !== "fulfilled") {
      console.warn("Profile dropdown JSON load failed", profileResult.reason || (profileResult.value && profileResult.value.status));
    }

    applyProfileDropdowns(dropdownConfig);

    let siteMeta;
    if (metaResult.status === "fulfilled" && metaResult.value.ok) {
      try {
        siteMeta = await metaResult.value.json();
      } catch (err) {
        console.warn("Failed to parse site meta JSON", err);
      }
    } else if (metaResult.status !== "fulfilled") {
      console.warn("Site meta JSON load failed", metaResult.reason || (metaResult.value && metaResult.value.status));
    }

    applySiteMeta(siteMeta);

    return {
      notifications,
      statusConfig,
      dropdownConfig,
      siteMeta,
    };
  };

  const applyStatusBarSettings = (statusData) => {
    if (!statusBarEl) return;
    const enabled = statusData?.enabled;
    if (enabled === false) {
      statusBarEl.classList.remove("fade-out");
      statusBarEl.style.display = "none";
      document.documentElement.style.setProperty("--status-bar-height", "0px");
      return;
    }

    const icon = statusData?.icon || defaultStatusIcon;
    const message = statusData?.message || defaultStatusMessage;
    const links = statusData?.links || defaultStatusLinks;
    const severityInput = typeof statusData?.severity === "string" ? statusData.severity.trim().toLowerCase() : "";
    const severity = STATUS_SEVERITY_CLASSES.has(severityInput)
      ? severityInput
      : "";
    const schedule = statusData?.schedule;
    const autoDismissMs = typeof statusData?.autoDismissMs === "number" ? statusData.autoDismissMs : null;
    const persistent = statusData?.persistent === true;

    if (statusIconEl) {
      statusIconEl.textContent = icon;
    }
    renderStatusMessage(message, links);

    statusBarEl.style.display = "";
    statusBarEl.classList.remove("fade-out");

    statusBarEl.classList.remove(
      "severity-success",
      "severity-info",
      "severity-warning",
      "severity-danger"
    );
    if (severity) {
      statusBarEl.classList.add(`severity-${severity}`);
    }

    const statusCloseBtn = document.getElementById("statusClose");
    if (statusCloseBtn) {
      statusCloseBtn.style.display = persistent ? "none" : "";
      statusCloseBtn.setAttribute("aria-hidden", persistent ? "true" : "false");
      statusCloseBtn.tabIndex = persistent ? -1 : 0;
    }
    statusBarEl.classList.toggle("is-persistent", persistent);

    const parseDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.valueOf()) ? null : date;
    };

    if (schedule && (schedule.start || schedule.end)) {
      const now = new Date();
      const startDate = parseDate(schedule.start);
      const endDate = parseDate(schedule.end);
      const startOk = startDate ? now >= startDate : true;
      const endOk = endDate ? now <= endDate : true;
      if (!startOk || !endOk) {
        statusBarEl.style.display = "none";
        document.documentElement.style.setProperty("--status-bar-height", "0px");
        StatusBarController.clearTimer();
        return;
      }
    }

    if (persistent) {
      StatusBarController.clearTimer();
    } else if (autoDismissMs && autoDismissMs > 0) {
      StatusBarController.scheduleDismiss(autoDismissMs);
    } else {
      StatusBarController.clearTimer();
    }

    requestAnimationFrame(() => {
      const height = statusBarEl.offsetHeight || 0;
      document.documentElement.style.setProperty("--status-bar-height", `${height}px`);
    });
  };

  // Expose simple API on window for future updates and reload
  let latestDataSnapshot = {
    notifications: [],
    statusConfig: undefined,
    dropdownConfig: undefined,
    siteMeta: undefined,
  };

  const NotificationsUI = {
    set: (items) => {
      latestDataSnapshot.notifications = items || [];
      renderNotifications(latestDataSnapshot.notifications);
    },
    add: (item) => {
      const current = Array.from(notifList?.querySelectorAll("li") || []).map((li) => ({ text: li.textContent }));
      current.push(typeof item === "string" ? { text: item } : item);
      latestDataSnapshot.notifications = current;
      renderNotifications(current);
    },
    clear: () => {
      latestDataSnapshot.notifications = [];
      renderNotifications([]);
    },
    reload: () => loadAppData().then((snapshot) => {
      latestDataSnapshot = snapshot;
    }),
  };
  window.NotificationsUI = NotificationsUI;

  const StatusBarController = {
    autoDismissTimer: null,
    clearTimer() {
      if (this.autoDismissTimer) {
        clearTimeout(this.autoDismissTimer);
        this.autoDismissTimer = null;
      }
    },
    scheduleDismiss(durationMs) {
      const ms = Number(durationMs);
      if (!statusBarEl || !Number.isFinite(ms) || ms <= 0) return;
      this.clearTimer();
      this.autoDismissTimer = setTimeout(() => {
        closeStatusBar();
      }, ms);
    },
  };

  const closeStatusBar = () => {
    if (!statusBarEl) return;
    statusBarEl.classList.add("fade-out");
    StatusBarController.clearTimer();
    setTimeout(() => {
      statusBarEl.style.display = "none";
      document.documentElement.style.setProperty("--status-bar-height", "0px");
    }, 300);
  };

  window.StatusBarUI = {
    close: closeStatusBar,
    clearTimer: () => StatusBarController.clearTimer(),
    scheduleDismiss: (ms) => StatusBarController.scheduleDismiss(ms),
  };

  applyProfileDropdowns();
  // Initial load
  loadAppData().then((snapshot) => {
    latestDataSnapshot = snapshot;
  });
  const profileIcon = document.getElementById("profileIcon");
  const profileDropdown = document.getElementById("profileDropdown");
  // Collect all profile icons with dropdowns
  const profileIconPairs = Array.from(
    document.querySelectorAll(".profile-icon")
  )
    .map((icon) => ({ icon, dd: icon.querySelector(".dropdown") }))
    .filter((p) => p.dd);

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      // Update Material icon and aria state
      const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
      const isOpen = sidebar.classList.contains("open");
      mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (icon) icon.textContent = isOpen ? "close" : "menu";
      // Lock/unlock background scroll
      document.body.classList.toggle("no-scroll", isOpen);
    });
  }

  // Notifications dropdown toggle
  if (notifIcon && notifDropdown) {
    notifIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      // Close profile dropdown if open
      if (profileDropdown) {
        profileDropdown.classList.remove("open");
        profileDropdown.setAttribute("aria-hidden", "true");
      }
      const isOpen = notifDropdown.classList.toggle("open");
      notifDropdown.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });
  }

  // Profile dropdown toggle
  // Generic profile icon dropdown toggles
  if (profileIconPairs.length) {
    profileIconPairs.forEach(({ icon, dd }) => {
      icon.addEventListener("click", function (e) {
        e.stopPropagation();
        // Close notifications dropdown if open
        if (notifDropdown) {
          notifDropdown.classList.remove("open");
          notifDropdown.setAttribute("aria-hidden", "true");
        }
        // Close other profile dropdowns
        profileIconPairs.forEach(({ dd: other }) => {
          if (other !== dd) {
            other.classList.remove("open");
            other.setAttribute("aria-hidden", "true");
          }
        });
        const isOpen = dd.classList.toggle("open");
        dd.setAttribute("aria-hidden", isOpen ? "false" : "true");
      });
    });
  }
});

// Status bar close functionality
document.addEventListener("DOMContentLoaded", function () {
  const statusClose = document.getElementById("statusClose");
  const statusBar = document.getElementById("statusBar");

  if (statusClose && statusBar) {
    // Helper to update a CSS variable for status bar height
    const updateStatusBarHeight = () => {
      const isHidden = window.getComputedStyle(statusBar).display === "none";
      const h = isHidden ? 0 : statusBar.offsetHeight || 0;
      document.documentElement.style.setProperty("--status-bar-height", `${h}px`);
    };
    // Initialize on load
    updateStatusBarHeight();

    statusClose.addEventListener("click", function () {
      window.StatusBarUI?.close();
    });

    // Recalculate on resize in case the bar wraps text
    window.addEventListener("resize", updateStatusBarHeight);
  }
});

// Filter button functionality
document.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      this.classList.remove("filter-glow");
      // Force reflow so clicking the same button retriggers the animation
      void this.offsetWidth;
      this.classList.add("filter-glow");
      const handleAnimationEnd = () => {
        this.classList.remove("filter-glow");
      };
      this.addEventListener("animationend", handleAnimationEnd, { once: true });
    });
  });
});

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href") || "";
      const isHash = href.startsWith("#") || href === "";
      if (isHash) {
        e.preventDefault();
        // Optional: smooth scroll could go here
      }

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Close mobile menu if open
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        const mobileMenuBtn = document.getElementById("mobileMenuBtn");
        if (mobileMenuBtn) {
          mobileMenuBtn.setAttribute("aria-expanded", "false");
          const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
          if (icon) icon.textContent = "menu";
        }
        document.body.classList.remove("no-scroll");
      }
    });
  });
});

// CTA button functionality
document.addEventListener("DOMContentLoaded", function () {
  const ctaButton = document.querySelector(".cta-button");

  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      // You can add actual functionality here, like opening a contact form
      alert("Get in touch functionality would be implemented here!");
    });
  }
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  const sidebar = document.querySelector(".sidebar");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (
    sidebar &&
    mobileMenuBtn &&
    !sidebar.contains(e.target) &&
    !mobileMenuBtn.contains(e.target) &&
    sidebar.classList.contains("open")
  ) {
    sidebar.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = "menu";
    document.body.classList.remove("no-scroll");
  }

  // Close notifications dropdown when clicking outside
  const notifDropdown = document.getElementById("notificationsDropdown");
  const notifIcon = document.getElementById("notifIcon");
  if (
    notifDropdown &&
    notifIcon &&
    notifDropdown.classList.contains("open") &&
    !notifIcon.contains(e.target)
  ) {
    notifDropdown.classList.remove("open");
    notifDropdown.setAttribute("aria-hidden", "true");
  }

  // Close profile dropdown when clicking outside
  document
    .querySelectorAll(".profile-icon .dropdown.open")
    .forEach((openDd) => {
      const parentIcon = openDd.closest(".profile-icon");
      if (parentIcon && !parentIcon.contains(e.target)) {
        openDd.classList.remove("open");
        openDd.setAttribute("aria-hidden", "true");
      }
    });
});

// Handle window resize
window.addEventListener("resize", function () {
  const sidebar = document.querySelector(".sidebar");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (window.innerWidth > 768 && sidebar && mobileMenuBtn) {
    // Close mobile menu on desktop
    sidebar.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = "menu";
    document.body.classList.remove("no-scroll");
  }
});
