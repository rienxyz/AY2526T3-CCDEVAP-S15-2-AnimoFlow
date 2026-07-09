var buildings = {
    "LS": { name: "St. La Salle Hall",
            nearGate: "Gate 1 (South)",
            maxFloor: 4},
    "Y": { name: "Don Enrique Yuchengco Hall",
            nearGate: "Gate 2 (North)",
            maxFloor: 9},
    "SJ": { name: "St. Joseph Hall",
            nearGate: "Gate 2 (North)",
            maxFloor: 6},
    "H": { name: "Henry Sy Sr Hall",
            nearGate: "Gate 2 (North)",
            maxFloor: 14},
    "V": { name: "Velasco Hall",
            nearGate: "Gate 3 (Velasco)",
            maxFloor: 5},
    "SM": { name: "St. Miguel Hall",
            nearGate: "Gate 4A (Gokongwei)",
            maxFloor: 4},
    "G": { name: "Gokongwei Hall",
            nearGate: "Gate 4A (Gokongwei)",
            maxFloor: 4},
    "STRC": { name: "Science & Technology Research Center",
            nearGate: "Gate 7 (STRC)",
            maxFloor: 4},
    "A": { name: "Br. Andrew Gonzalez Hall",
            nearGate: "Gate 5A (Andrew)",
            maxFloor: 21},
    "ER": { name: "Enrique Razon Sports Center",
            nearGate: "Gate 6 (Razon)",
            maxFloor: 10}
};
  
function getFloorSuffix(n) {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
 
function getDirection(buildingObj, floorNum, from) {
  switch(from){
    case "Gate 1 (South)": 
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "As you enter the gate, you'll be in the building. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchengco Hall":
          return "As you enter the gate, turn right walking through the covered walk of St. La Salle Hall. Then turn left to Don Enrique Yuchengco Hall, Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Joseph Hall":
          return "As you enter the gate, turn right walking through the covered walk of St. La Salle Hall. Then turn left, passing Don Enrique Yuchengco Hall. After that turn right, into the St. Joseph Hall. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Henry Sy Sr Hall":
          return "As you enter the gate, turn right walking through the covered walk of St. La Salle Hall. Then turn left, once you're in central plaza turn right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator.";
        case "Velsaco Hall":
          return "As you enter the gate, turn right walking through the covered walk of St. La Salle Hall. Walking out of the building to pass Henry Sy Sr Hall, across should be Velasco Hall. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Miguel Hall":
          return "Outside Gate 1, head north going to Gate 3 (Velsaco). As you enter, pass by Velasco Hall and St. Miguell Hall should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Outside Gate 1, head north going to Gate 4A (Gokongwei). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Science & Technology Research Center":
          return "Outside Gate 1, head north passing Gate 4A (Gokongwei). Turn left at Castro Street, as you contine Science & Technology Research Center should be in front of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Br. Andrew Gonzalez Hall":
          return "Outside Gate 1, head north going to Gate 5A (Andrew). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Enrique Razon Sports Center":
          return "Outside Gate 1, head north passing Gate 4A (Gokongwei). Turn left at Castro Street, then turn right to Calleagno. Straight ahead, next to 7/11 store, Enrique Razon Sports Center should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
      }
    break;
    case "Gate 2 (North)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "As you enter the gate, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "As you enter the gate, turn left then turn right in covered walk of St. La Salle Hall. Once you're at Central Plaza, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Joseph Hall":
          return "As you enter the gate, turn left then turn right in covered walk of St. La Salle Hall. Once you're at Central Plaza, keep going straight in to the St. Joseph Hall. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Henry Sy Sr Hall":
          return "As you enter the gate, turn left then turn right in covered walk of St. La Salle Hall. Then go to Cory Aquino Democratic Space. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator.";
        case "Velasco Hall":
          return "As you enter the gate, turn right then the building should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Miguel Hall":
          return "As you enter the gate, turn right then walk pass through Velasco hall. Turn left once passed, then straight ahead the building should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Outside Gate 2, head north going to Gate 4A (Gokongwei). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Science & Technologo Research Center":
          return "Outside Gate 2, head north passing Gate 4A (Gokongwei). Turn left at Castro Street, as you contine Science & Technology Research Center should be in front of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Br. Andrew Gonzalez Hall":
          return "Outside Gate 2, head north going to Gate 5A (Andrew). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Enrique Razon Sports Center":
          return "Outside Gate 2, head north passing Gate 4A (Gokongwei). Turn left at Castro Street, then turn right to Calleagno. Straight ahead, next to 7/11 store, Enrique Razon Sports Center should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
      }
    break;
    case "Gate 3 (Velasco)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "Outside Gate 3, head south going to Gate 1 (South). As you enter the gate, you'll be in the building. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "As you enter the gate, walk straight ahead going through Br Bloemen Hall then turn left as you leave the hall. Then walk straight up until Central Plaza and the building should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Joseph Hall":
          return "As you enter the gate, walk straight passing Br Bloemen Hall then the hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
        case "Henry Sy Sr Hall":
          return "As you enter the gate, walk straight passing Velsco hall then turn left going to Cory Aquino Democratic Space. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator";
        case "Velasco Hall":
          return "As you enter the gate, Velasco Hall should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Miguel Hall":
          return "As you enter the gate, walk straight passing Velasco hall then the building should be on you right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "Gokongwei Hall":
          return "Outside Gate 3, head north going to Gate 4A (Gokongwei). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Science & Technologo Research Center":
          return "Outside Gate 3, head north passing Gate 4A (Gokongwei). Turn left at Castro Street, as you contine Science & Technology Research Center should be in front of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Br. Andrew Gonzalez Hall":
          return "Outside Gate 3, head north going to Gate 5A (Andrew). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Enrique Razon Sports Center":
          return "Outside Gate 3, head north passing Gate 4A (Gokongwei). Turn left at Castro Street, then turn right to Calleagno. Straight ahead, next to 7/11 store, Enrique Razon Sports Center should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
      }
    break;
    case "Gate 4A (Gokongwei)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "Outside Gate 4A, head south then enter through Gate 2 (North). As you enter the gate, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "Outside Gate 4A, head south then enter through Gate 2 (North). As you enter the gate, turn left then turn right in covered walk of St. La Salle Hall. Once you're at Central Plaza, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Joseph Hall":
          return "Outside Gate 4A, head south then enter through Gate 3 (Velasco). As you enter the gate, walk straight passing Br Bloemen Hall then the hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Henry Sy Sr Hall":
          return "Outside Gate 4A, head south then enter through Gate 3 (Velasco). As you enter the gate, walk straight passing Velsco hall then turn left going to Cory Aquino Demoratic Space. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator";
        case "Velasco Hall":
          return "Outside Gate 4A, head south then enter through Gate 3 (Velasco). Velasco Hall should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Miguel Hall":
          return "Head inside the gate then exit through Gate 4B. Then enter Gate 8, as you enter the building should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Head inside the gate. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
        case "Science & Technologo Research Center":
          return "Head inside the gate then exit through Gate 4B. Turn right until you pass Agno, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "Br. Andrew Gonzalez Hall":
          return "Outside Gate 4A, head north then enter through Gate 5A (Andrew). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "Enrique Razon Sports Center":
          return "Outside Gate 4A, head north then turn left to Castro Street. Then turn right to Calleagno, straight ahead, next to 7/11 store, Enrique Razon Sports Center should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator. ";
      }
    break;
    case "Gate 5A (Andrew)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "Outside Gate 5A, head south then enter through Gate 2 (North). As you enter the gate, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "Outside Gate 5A, head south then enter through Gate 2 (North). As you enter the gate, turn left then turn right in covered walk of St. La Salle Hall. Once you're at Central Plaza, the building should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Joseph Hall":
          return "Outside Gate 5A, head south then enter through Gate 3 (Velasco). As you enter the gate, walk straight passing Br Bloemen Hall then the hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Henry Sy Sr Hall":
          return "Outside Gate 5A, head south then enter through Gate 3 (Velasco). As you enter the gate, walk straight passing Velsco hall then turn left going to Cory Aquino Demoratic Space. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator";
        case "Velasco Hall":
          return "Outside Gate 5A, head south then enter through Gate 3 (Velasco). Velasco Hall should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "St. Miguel Hall":
          return "Head inside the gate then exit through Gate 5B. Then turn left to enter Gate 8, as you enter, the building should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Outside Gate 5A, head sout then enter throuhg Gate 4A (Gokongwei). Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Science & Technologo Research Center":
          return "Head inside the gate then exit through Gate 5B. Turn left then the building should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Br. Andrew Gonzalez Hall":
          return "Head inside the gate. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "Enrique Razon Sports Center":
          return "Head inside the gate, then exit through Gate 5B. Razon should be just right across the biulding. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
      }
    break;
    case "Gate 6 (Razon)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "Outside Gate 6, head south and enter Gate 8. Keep going straight until you pass Henry Sy Sr Hall, then St. La Salle Hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "Outside Gate 6, head south and enter Gate 8. Keep going straight until you're at Central Plaza, then Yuchenco Hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Joseph Hall":
          return "Outside Gate 6, head south and enter Gate 8. Then turn right until St. Joseph Hall. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Henry Sy Sr Hall":
          return "Outside Gate 6, head south and enter Gate 8. Keep going straight until you're at Cory Aquino Democratic Space.  Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator.";
        case "Velasco Hall":
          return "Outside Gate 6, head south and enter Gate 8. As you enter the gate, Velasco hall should be right across. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Miguel Hall":
          return "Outside Gate 6, head south and enter Gate 8. St. Miguel Hall should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Outside Gate 6, head south and enter Gate 4B on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
        case "Science & Technologo Research Center":
          return "Outside Gate 6, head south and enter Gate 7 on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Br. Andrew Gonzalez Hall":
          return "Br. Andrew Gonzalez Hall is just across the gate. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Enrique Razon Sports Center":
          return "Head inside the gate, once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs ro elevator";
      }
    break;
    case "Gate 7 (STRC)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "Outside Gate 7, head south and enter Gate 8. Keep going straight until you pass Henry Sy Sr Hall, then St. La Salle Hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "Outside Gate 7, head south and enter Gate 8. Keep going straight until you're at Central Plaza, then Yuchenco Hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Joseph Hall":
          return "Outside Gate 7, head south and enter Gate 8. Then turn right and go straight until St. Joseph Hall. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Henry Sy Sr Hall":
          return "Outside Gate 7, head south and enter Gate 8. Keep going straight until you're at Cory Aquino Democratic Space.  Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator.";
        case "Velasco Hall":
          return "Outside Gate 7, head south and enter Gate 8. As you enter the gate, Velasco hall should be right across. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Miguel Hall":
          return "Outside Gate 7, head south and enter Gate 8. St. Miguel Hall should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Outside Gate 7, head south and enter Gate 4B on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
        case "Science & Technologo Research Center":
          return "Head inside the gate, once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "Br. Andrew Gonzalez Hall":
          return "Outside Gate 7, head north then Br. Andrew Gonzalez Hall should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
        case "Enrique Razon Sports Center":
          return "Outside Gate 7, head north then Enrique Razon Sports Center should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
      }
    break;
    case "Gate 8 (Agno)":
      switch(buildingObj.name){
        case "St. La Salle Hall":
          return "Enter Gate 8 and keep going straight until you pass Henry Sy Sr Hall, then St. La Salle Hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Don Enrique Yuchenco Hall":
          return "Enter Gate 8 and keep going straight until you're at Central Plaza, then Yuchenco Hall should be infront of you. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Joseph Hall":
          return "Enter Gate 8, then turn right and go stright until St. Joseph Hall. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Henry Sy Sr Hall":
          return "Enter Gate 8 and keep going straight until you're at Cory Aquino Democratic Space. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs, escalator, or elevator.";
        case "Velasco Hall":
          return "Enter Gate 8 and as you enter the gate, Velasco hall should be right across. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator";
        case "St. Miguel Hall":
          return "Enter Gate 8, St. Miguel Hall should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Gokongwei Hall":
          return "Outside Gate 8, right across should be Gate 4B. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs.";
        case "Science & Technologo Research Center":
          return "Outside Gate 8, head north right across Castro Street, STRC should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs or elevator.";
        case "Br. Andrew Gonzalez Hall":
          return "Outside Gate 8, head north Br. Andrew Gonzalez Hall should be on your right. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
        case "Enrique Razon Sports Center":
          return "Outside Gate 8, head north then Enrique Razon Sports Center should be on your left. Once inside, go to the " + getFloorSuffix(floorNum) + " floor via the stairs";
      }
    break;
  }
}

  function buildCard(roomCode, buildingName, floorText, direction, from) {
    return "<div class='result-card'>" +
      "<div class='result-header'>" +
        "<span class='room-badge'>" + roomCode + "</span>" +
        "<div class='result-meta'>" +
          "<div class='room-name'>" + buildingName + "</div>" +
          "<div class='room-floor'>" + floorText + "</div>" +
        "</div>" +
      "</div>" +
      "<div class='directions-panel'>" +
        "<p class='directions-label'>How to get there from " + from + "</p>" +
        "<p class='directions-text'>" + direction + "</p>" +
      "</div>" +
    "</div>";
  }
  
  function doSearch() {
    var raw  = document.getElementById("search-input").value.trim();
    var from = document.getElementById("from-select").value;
    var area = document.getElementById("results-area");
  
    if (!raw) { area.innerHTML = ""; return; }
  
    var upper = raw.toUpperCase();
    var lower = raw.toLowerCase();
    var cards = "";
    var count = 0;
  
    if (/^[A-Z]+\d+$/.test(upper)) {
      var prefix = upper.match(/^[A-Z]+/)[0];
      var digits = upper.match(/\d+$/)[0];
  
      if (!buildings[prefix]) {
        area.innerHTML = "<div class='no-results'>Building code " + prefix + " is not recognized.</div>";
        return;
      }
      
      if (digits[0] > buildings[prefix].maxFloor){
        area.innerHTML = "<div class='no-results'>Building floor " + " is not recognized.</div>";
        return;
      }

      var floorNum = 1;
      if (digits.length > 2) {
        floorNum = parseInt(digits.slice(0, digits.length - 2), 10);
      }
      if (floorNum === 0) floorNum = 1;
      
      if (floorNum > buildings[prefix].maxFloor){
        area.innerHTML = "<div class='no-results'>Building floor " + " is not recognized.</div>";
        return;
      }

      var floorText = getFloorSuffix(floorNum) + " floor";
      var direction = getDirection(buildings[prefix], floorNum, from);
  
      cards += buildCard(upper, buildings[prefix].name, floorText, direction, from);
      count = 1;
    } else {
      for (var prefix in buildings) {
        if (buildings[prefix].name.toLowerCase().indexOf(lower) !== -1) {
          var direction = getDirection(buildings[prefix], 1, from);
          cards += buildCard(prefix + "", buildings[prefix].name, "See building directory", direction, from);
          count++;
        }
      }
    }
  
    // No matches found
    if (count === 0) {
      area.innerHTML = "<div class='no-results'>No results found for" + raw + ". Try a room code (e.g. LS305) or a building name (e.g. Henry Sy).</div>";
      return;
    }
  
    area.innerHTML = "<p class='result-count'>" + count + " result" + (count !== 1 ? "s" : "") + " found</p>" + cards;
  }
  
  // Event listeners
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-btn").addEventListener("click", doSearch);
  
    document.getElementById("search-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") doSearch();
    });
  
    document.getElementById("from-select").addEventListener("change", function () {
      if (document.getElementById("search-input").value.trim()) doSearch();
    });
  });