var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path == 'background-to-popup') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})}
  }
})();

var load = function () {
  var whitelist = document.getElementById("whitelist");
  whitelist.addEventListener("change", function (e) {
    var value = e.target ? e.target.value : '';
    background.send("popup-data", {"name": "bypassList", "whitelist": value});
  });
  /*  */
  document.addEventListener("click", function (e) {
    var id = e.target ? e.target.getAttribute("id") : null;
    if (id && id !== "whitelist") background.send("popup-data", {"name": id});
  });
  /*  */
  background.send("load");
  window.removeEventListener("load", load, false);
};

background.receive("tor-data", function (e) {
  var ON = document.getElementById("ON");
  var OFF = document.getElementById("OFF");
  var status = document.getElementById("status");
  var whitelist = document.getElementById("whitelist");
  /*  */
  status.textContent = e.log;
	whitelist.value = e.whitelist;
  /*  */
  if (e.id === "CHECK") e.id = "ON";
  if (e.id === "ON" || e.id === "OFF") {
    ON.removeAttribute("type");
    OFF.removeAttribute("type");
	  document.getElementById(e.id).setAttribute("type", "active");
  }
});

window.addEventListener("load", load, false);
