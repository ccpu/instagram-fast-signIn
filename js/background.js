!(function () {
  function a() {
    var a = navigator.userAgent
        .replace(/\s/g, "")
        .toLowerCase()
        .match(/chrome\/(\d+)/),
      b = a && a[1] && a[1].length && a[1];
    return (b = b && parseInt(b)), !b || isNaN(b) ? !0 : 72 > b;
  }

  function b(a) {
    var b = {};
    chrome.cookies.get(
      {
        url: f,
        name: "csrftoken",
      },
      function (c) {
        c && (b.csrftoken = c.value), "function" == typeof a && a(b);
      }
    );
  }

  function c(a, b) {
    if (
      ((a = a || [
        "sessionid",
        "ds_user_id",
        "csrftoken",
        "urlgen",
        "fr",
        "ig_pr",
        "ig_vh",
        "ig_vw",
        "mid",
        "rur",
      ]),
      a.length)
    ) {
      var d = a.splice(0, 1)[0];
      chrome.cookies.remove(
        {
          url: f,
          name: d,
        },
        function () {
          c(a, b);
        }
      );
    } else "function" == typeof b && b();
  }
  var d = {},
    e = !a();
  !localStorage.storageMigrated &&
    chrome.storage.local.get("usersData", function (a) {
      if (
        ((localStorage.storageMigrated = 1), a.usersData && a.usersData.length)
      ) {
        var b = a.usersData;
        chrome.storage.sync.set({
          usersData: b,
        });
      }
    });
  var f = "https://www.instagram.com",
    g = !0,
    h = {},
    i = {
      requestsSeriesData: {},
      addTime: null,
      addRequestsListener: function () {
        var a = i;
        a.removeAllListeners(),
          (a.requestsSeriesData = {}),
          (a.addTime = Date.now()),
          a.addOnBeforeSendHeadersListener(),
          a.addOnHeadersReceivedListener(),
          setTimeout(function () {
            Date.now() > a.addTime + 28e3 && a.removeAllListeners();
          }, 3e4);
      },
      removeAllListeners: function () {
        var a = i;
        a.removeOnBeforeSendHeadersListener(),
          a.removeOnHeadersReceivedListener(),
          (a.requestsSeriesData = {}),
          (a.addTime = 0);
      },
      onBeforeSendHeadersListener: function (a) {
        var b = i,
          c = a.requestHeaders,
          e = !1,
          g = !1,
          h = !1,
          j = "",
          k = [],
          l = "";
        return (
          c.forEach(function (i, m) {
            if ("i-m-l-1" == i.name.toLowerCase())
              (l = 1),
                (e = !0),
                (b.requestsSeriesData.popupRequestId = i.value),
                (b.requestsSeriesData.firstRequestId = a.requestId),
                c.splice(m, 1),
                (k = ["origin", "cookie", "referer"]),
                c.forEach(b.removeHeaders(k)),
                c.push({
                  name: "cookie",
                  value: "csrftoken=" + d.csrftoken,
                });
            else if ("i-m-l-2" == i.name.toLowerCase()) {
              if (
                ((l = 2),
                (e = !0),
                c.splice(m, 1),
                b.requestsSeriesData.popupRequestId != i.value)
              )
                return;
              if (
                ((b.requestsSeriesData.secondRequestId = a.requestId),
                !b.requestsSeriesData.cookies.csrftoken)
              )
                return;
              for (var n in b.requestsSeriesData.cookies)
                b.requestsSeriesData.cookies[n] &&
                  (j += n + "=" + b.requestsSeriesData.cookies[n] + "; ");
              c.forEach(function (a, b) {
                "origin" == a.name.toLowerCase() && (a.value = f),
                  "referer" == a.name.toLowerCase() &&
                    ((h = !0), (a.value = f)),
                  "cookie" == a.name.toLowerCase() && ((g = !0), (a.value = j));
              }),
                c.push({
                  name: "X-CSRFToken",
                  value: b.requestsSeriesData.cookies.csrftoken,
                }),
                g ||
                  c.push({
                    name: "cookie",
                    value: j,
                  }),
                h ||
                  c.push({
                    name: "referer",
                    value: f,
                  });
            } else if ("i-m-l-3" == i.name.toLowerCase()) {
              if (
                ((l = 3),
                (e = !0),
                c.splice(m, 1),
                b.requestsSeriesData.popupRequestId != i.value)
              )
                return;
              if (
                ((b.requestsSeriesData.thirdRequestId = a.requestId),
                !b.requestsSeriesData.cookies.csrftoken)
              )
                return;
              for (n in b.requestsSeriesData.cookies)
                b.requestsSeriesData.cookies[n] &&
                  (j += n + "=" + b.requestsSeriesData.cookies[n] + "; ");
              c.forEach(function (a, b) {
                "origin" == a.name.toLowerCase() && (a.value = f),
                  "referer" == a.name.toLowerCase() &&
                    ((h = !0), (a.value = f)),
                  "cookie" == a.name.toLowerCase() && ((g = !0), (a.value = j));
              }),
                g ||
                  c.push({
                    name: "cookie",
                    value: j,
                  }),
                h ||
                  c.push({
                    name: "referer",
                    value: f,
                  });
            }
          }),
          e
            ? {
                requestHeaders: c,
              }
            : void 0
        );
      },
      onHeadersReceivedListener: function (a) {
        var b = i,
          c = a.responseHeaders;
        return [
          b.requestsSeriesData.firstRequestId,
          b.requestsSeriesData.secondRequestId,
          b.requestsSeriesData.thirdRequestId,
        ].indexOf(a.requestId) > -1
          ? ((b.requestsSeriesData.cookies = {}),
            c.forEach(i.saveAndRemoveCookie(b.requestsSeriesData.cookies)),
            {
              responseHeaders: c,
            })
          : void 0;
      },
      addOnBeforeSendHeadersListener: function () {
        var a = ["blocking", "requestHeaders"];
        e && a.push("extraHeaders"),
          chrome.webRequest.onBeforeSendHeaders.addListener(
            i.onBeforeSendHeadersListener,
            {
              urls: [
                "https://www.instagram.com/accounts/login/ajax/",
                "https://www.instagram.com/",
              ],
              types: ["xmlhttprequest"],
            },
            a
          );
      },
      addOnHeadersReceivedListener: function () {
        var a = ["blocking", "responseHeaders"];
        e && a.push("extraHeaders"),
          chrome.webRequest.onHeadersReceived.addListener(
            i.onHeadersReceivedListener,
            {
              urls: [
                "https://www.instagram.com/accounts/login/ajax/",
                "https://www.instagram.com/",
              ],
              types: ["xmlhttprequest"],
            },
            a
          );
      },
      removeOnBeforeSendHeadersListener: function () {
        chrome.webRequest.onBeforeSendHeaders.removeListener(
          i.onBeforeSendHeadersListener
        );
      },
      removeOnHeadersReceivedListener: function () {
        chrome.webRequest.onHeadersReceived.removeListener(
          i.onHeadersReceivedListener
        );
      },
      removeHeaders: function (a) {
        return function (b, c, d) {
          -1 != a.indexOf(b.name.toLowerCase()) &&
            (d.splice(c, 1), d.forEach(i.removeHeaders(a)));
        };
      },
      saveAndRemoveCookie: function (a) {
        return function (b, c, d) {
          if ("set-cookie" == b.name.toLowerCase()) {
            if (a) {
              var e = b.value,
                f = e.split(";"),
                g = f[0],
                h = g.split("=");
              a[h[0].toLowerCase()] = h[1];
            }
            d.splice(c, 1), d.forEach(i.saveAndRemoveCookie(a));
          }
        };
      },
    };
  setInterval(function () {
    g = !0;
  }, 36e5),
    chrome.runtime.onMessage.addListener(function (a, d, e) {
      if (a)
        if ("auth" == a.action)
          chrome.storage.sync.get("usersData", function (b) {
            if (b && b.usersData && b.usersData.length) {
              var d, e;
              b.usersData.forEach(function (b) {
                b.username == a.username &&
                  ((d = b.username), (e = b.password));
              }),
                d &&
                  e &&
                  ((h.username = d),
                  (h.pass = e),
                  c(null, function () {
                    chrome.tabs.query(
                      {
                        active: !0,
                        currentWindow: !0,
                      },
                      function (a) {
                        var b = a[0];
                        -1 != b.url.indexOf("instagram.com")
                          ? ((h.tabId = b.id),
                            chrome.tabs.executeScript(b.id, {
                              code: 'window.location = "' + f + '";',
                            }))
                          : chrome.tabs.create(
                              {
                                url: f,
                              },
                              function (a) {
                                h.tabId = a.id;
                              }
                            ),
                          setTimeout(function () {
                            h = {};
                          }, 1e4);
                      }
                    );
                  }));
            }
          });
        else if ("needLoginAskBg" == a) {
          if (!h.tabId) return;
          d.tab &&
            d.tab.id == h.tabId &&
            (e({
              username: h.username,
              pass: h.pass,
            }),
            (h.tabId = void 0));
        } else {
          if ("getCookies" == a) return b(e), !0;
          "reloadAnotherTabs" == a
            ? chrome.tabs.query(
                {
                  url: "*://*.instagram.com/*",
                },
                function (a) {
                  a.forEach(function (a) {
                    a.id != d.tab.id &&
                      chrome.tabs.sendMessage(a.id, "reloadTab", function (b) {
                        b ||
                          chrome.tabs.executeScript(a.id, {
                            code: 'window.location = "' + f + '";',
                          });
                      });
                  });
                }
              )
            : "addRequestsListener" == a
            ? (i.addRequestsListener(), e())
            : "removeRequestsListeners" == a
            ? i.removeAllListeners()
            : "isTimeUpdateImages" == a && e(g);
        }
    }),
    b(function (a) {
      d = a;
    });
})();
