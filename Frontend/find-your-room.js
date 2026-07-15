var buildings = {
  "LS": { name: "St. La Salle Hall", nearGate: "Gate 1 (South)", maxFloor: 4 },
  "Y": { name: "Don Enrique Yuchengco Hall", nearGate: "Gate 2 (North)", maxFloor: 9 },
  "SJ": { name: "St. Joseph Hall", nearGate: "Gate 2 (North)", maxFloor: 6 },
  "H": { name: "Henry Sy Sr Hall", nearGate: "Gate 2 (North)", maxFloor: 14 },
  "V": { name: "Velasco Hall", nearGate: "Gate 3 (Velasco)", maxFloor: 5 },
  "SM": { name: "St. Miguel Hall", nearGate: "Gate 4A (Gokongwei)", maxFloor: 4 },
  "G": { name: "Gokongwei Hall", nearGate: "Gate 4A (Gokongwei)", maxFloor: 4 },
  "STRC": { name: "Science & Technology Research Center", nearGate: "Gate 7 (STRC)", maxFloor: 4 },
  "A": { name: "Br. Andrew Gonzalez Hall", nearGate: "Gate 5A (Andrew)", maxFloor: 21 },
  "ER": { name: "Enrique Razon Sports Center", nearGate: "Gate 6 (Razon)", maxFloor: 10 }
};

document.addEventListener('DOMContentLoaded', function() {
    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) {
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        }
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // ===== BACK TO DASHBOARD =====
    const backBtn = document.getElementById('backToDashboardBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard-index.html';
        });
    }
});

function getFloorSuffix(n) {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

async function fetchDirection(buildingCode, gate) {
  try {
    var url = "/api/direction?building=" + encodeURIComponent(buildingCode) + "&gate=" + encodeURIComponent(gate);
    var res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch direction:", err);
    return null;
  }
}

function photoMarkup(image, buildingName, gate) {
  if (!image) {
    return `<div class="directions-photo-placeholder">
      <i class="bi bi-image" style="font-size:2rem; display:block; margin-bottom:8px;"></i>
      No photo available for ${buildingName} from ${gate}
    </div>`;
  }
  return `<img class="directions-photo" src="${image}" alt="Directions to ${buildingName} from ${gate}" loading="lazy" 
            onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'directions-photo-placeholder\'><i class=\'bi bi-image\' style=\'font-size:2rem; display:block; margin-bottom:8px;\'></i>Image failed to load</div>';" />`;
}

function buildCard(roomCode, buildingName, floorText, image, from) {
  var directionText = from ? `from ${from}` : "";
  return `<div class="result-card">
    <div class="result-header">
      <span class="room-badge">${roomCode}</span>
      <div class="result-meta">
        <div class="room-name">${buildingName}</div>
        <div class="room-floor">${floorText}</div>
      </div>
    </div>
    <div class="directions-panel">
      <p class="directions-label">📍 How to get there ${directionText}</p>
      ${photoMarkup(image, buildingName, from)}
    </div>
  </div>`;
}

async function doSearch() {
  var raw = document.getElementById("search-input").value.trim();
  var from = document.getElementById("from-select").value;
  var area = document.getElementById("results-area");

  if (!raw) {
    area.innerHTML = `<div class="text-center text-muted py-4">
      <i class="bi bi-compass" style="font-size: 2.5rem;"></i>
      <p class="mt-2">Enter a room code or building name to get directions.</p>
    </div>`;
    return;
  }

  var upper = raw.toUpperCase();
  var lower = raw.toLowerCase();

  area.innerHTML = "<p class='result-count loading'>Searching…</p>";

  if (/^[A-Z]+\d+$/.test(upper)) {
    var prefix = upper.match(/^[A-Z]+/)[0];
    var digits = upper.match(/\d+$/)[0];

    if (!buildings[prefix]) {
      area.innerHTML = "<div class='no-results'>❌ Building code " + prefix + " is not recognized.</div>";
      return;
    }

    var floorNum = 1;
    if (digits.length > 2) {
      floorNum = parseInt(digits.slice(0, digits.length - 2), 10);
    }
    if (floorNum === 0) floorNum = 1;

    if (floorNum > buildings[prefix].maxFloor) {
      area.innerHTML = "<div class='no-results'>❌ Floor " + floorNum + " does not exist in " + buildings[prefix].name + " (max " + buildings[prefix].maxFloor + " floors).</div>";
      return;
    }

    var floorText = getFloorSuffix(floorNum) + " floor";
    var directionData = await fetchDirection(prefix, from);
    var image = directionData ? directionData.image : null;

    var card = buildCard(upper, buildings[prefix].name, floorText, image, from);
    area.innerHTML = "<p class='result-count'>✅ 1 result found</p>" + card;
    return;
  }

  var matches = [];
  for (var prefix in buildings) {
    if (buildings[prefix].name.toLowerCase().indexOf(lower) !== -1) {
      matches.push(prefix);
    }
  }

  if (matches.length === 0) {
    area.innerHTML = `<div class='no-results'>❌ No results found for "${raw}". Try a room code (e.g. LS305) or a building name (e.g. Henry Sy).</div>`;
    return;
  }

  var directionResults = await Promise.all(matches.map(function(code) {
    return fetchDirection(code, from);
  }));

  var cards = matches.map(function(code, i) {
    var directionData = directionResults[i];
    var image = directionData ? directionData.image : null;
    return buildCard(code, buildings[code].name, "See building directory", image, from);
  }).join("");

  area.innerHTML = "<p class='result-count'>✅ " + matches.length + " result" + (matches.length !== 1 ? "s" : "") + " found</p>" + cards;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("search-btn").addEventListener("click", doSearch);
  document.getElementById("search-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") doSearch();
  });
  document.getElementById("from-select").addEventListener("change", function() {
    if (document.getElementById("search-input").value.trim()) doSearch();
  });
});