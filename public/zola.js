!(function (e, t, n) {
    var s,
      a = e.getElementsByTagName(t)[0];
    e.getElementById(n) ||
      ((s = e.createElement(t)),
      (s.id = n),
      (s.async = !0),
      (s.src = "https://widget.zola.com/js/widget.js"),
      a.parentNode.insertBefore(s, a));
  })(document, "script", "zola-wjs");
  