!(function () {
  function a() {
    chrome.storage.sync.get("usersData", function (a) {
      return (
        p(z),
        k(),
        a && a.usersData && a.usersData.length
          ? ((w.style.display = "none"),
            (x.innerHTML = ""),
            void a.usersData.forEach(function (a) {
              i(a);
            }))
          : ((w.innerText = chrome.i18n.getMessage("accountNo")),
            void (w.style.display = "block"))
      );
    });
  }

  function b() {
    "undefined" == typeof NodeList.prototype.forEach &&
      (NodeList.prototype.forEach = Array.prototype.forEach),
      "undefined" == typeof HTMLCollection.prototype.forEach &&
        (HTMLCollection.prototype.forEach = Array.prototype.forEach);
  }

  function c() {
    var a = document.querySelector(".expand_popup");
    window.outerWidth < 400 &&
      ((a.style.display = "inline-block"),
      a.setAttribute("title", chrome.i18n.getMessage("expand")),
      a.addEventListener("click", function () {
        chrome.tabs.create({
          url: "chrome-extension://" + chrome.runtime.id + "/popup.html",
        });
      }));
  }

  function d() {
    C.addEventListener("input", function () {
      this.classList.remove("error_validation");
    }),
      D.addEventListener("input", function () {
        this.classList.remove("error_validation");
      }),
      B.addEventListener("click", function () {
        p(z);
      }),
      y.addEventListener("click", function () {
        o(z);
      }),
      A.addEventListener("click", e);
  }

  function e() {
    G.hide(z);
    var b = C.value,
      c = D.value;
    b || C.classList.add("error_validation"),
      c || D.classList.add("error_validation"),
      b &&
        c &&
        (j(),
        q(
          {
            username: c,
            password: b,
          },
          function (d, e) {
            if (
              d &&
              d.responseJSON &&
              "fail" == d.responseJSON.status &&
              d.responseJSON.checkpoint_url
            )
              return void g(
                {
                  username: c,
                  password: b,
                },
                function () {
                  k(), p(z), a();
                }
              );
            if (!d || "object" != typeof d || !d.status || d.always)
              return (
                k(),
                G.show(z, chrome.i18n.getMessage("login_unknown_error_msg")),
                void chrome.runtime.sendMessage("removeRequestsListeners")
              );
            if ("fail" == d.status && d.checkpoint_url)
              return void g(
                {
                  username: c,
                  password: b,
                },
                function () {
                  a();
                }
              );
            "undefined" == typeof d.authenticated ||
              "undefined" == typeof d.status ||
              "undefined" == typeof d.user;
            var f = !0;
            return (
              d.user
                ? d.authenticated ||
                  (k(),
                  G.show(z, chrome.i18n.getMessage("login_wrong_password_msg")),
                  (f = !1))
                : (k(),
                  G.show(z, chrome.i18n.getMessage("login_no_user_msg")),
                  (f = !1)),
              f
                ? void g(
                    {
                      username: c,
                      password: b,
                    },
                    function () {
                      r(e, 3, function (b) {
                        if (
                          (chrome.runtime.sendMessage(
                            "removeRequestsListeners"
                          ),
                          !b)
                        )
                          return void a();
                        var d = t(b);
                        d
                          ? g(
                              {
                                username: c,
                                icon: d,
                              },
                              a
                            )
                          : a();
                      });
                    }
                  )
                : void chrome.runtime.sendMessage("removeRequestsListeners")
            );
          }
        ));
  }

  function f() {
    var a = this,
      b = a.querySelector(".edit_pass_wrap");
    G.hide(b);
    var c = b.querySelector('input[type="password"]'),
      d = c.value;
    if (!d) return void c.classList.add("error_validation");
    var e = a.dataset.username;
    l(a),
      q(
        {
          username: e,
          password: d,
        },
        function (c, f) {
          return (
            chrome.runtime.sendMessage("removeRequestsListeners"),
            c &&
            c.responseJSON &&
            "fail" == c.responseJSON.status &&
            c.responseJSON.checkpoint_url
              ? void g(
                  {
                    username: e,
                    password: d,
                  },
                  function () {
                    m(a), p(b);
                  }
                )
              : c && "object" == typeof c && c.status && !c.always
              ? ("undefined" == typeof c.authenticated ||
                  "undefined" == typeof c.status ||
                  "undefined" == typeof c.user,
                m(a),
                n(b),
                void (c.user
                  ? c.authenticated
                    ? g(
                        {
                          username: e,
                          password: d,
                        },
                        function () {
                          p(b);
                        }
                      )
                    : G.show(
                        b,
                        chrome.i18n.getMessage("login_wrong_password_msg")
                      )
                  : G.show(b, chrome.i18n.getMessage("login_no_user_msg"))))
              : (m(a),
                n(b),
                G.show(b, chrome.i18n.getMessage("login_unknown_error_msg")),
                void chrome.runtime.sendMessage("removeRequestsListeners"))
          );
        }
      );
  }

  function g(a, b) {
    return a && a.username
      ? void chrome.storage.sync.get("usersData", function (c) {
          if (c.usersData && c.usersData.length) {
            var d = !1;
            if (
              ((e = c.usersData),
              e.forEach(function (b) {
                b.username == a.username && (u(b, a), (d = !0));
              }),
              !d)
            ) {
              if (!a.password) return void b();
              e.push(a);
            }
          } else {
            var e = [];
            if (!a.password) return void b();
            e.push(a);
          }
          chrome.storage.sync.set(
            {
              usersData: e,
            },
            b
          );
        })
      : void b();
  }

  function h(a, b) {
    chrome.storage.sync.get("usersData", function (c) {
      if (c.usersData && c.usersData.length) {
        var d = c.usersData;
        d.forEach(function (b, c) {
          b.username == a && d.splice(c, 1);
        }),
          chrome.storage.sync.set(
            {
              usersData: d,
            },
            b
          );
      }
    });
  }

  function i(b) {
    var c = document.querySelector(".user_item_wrap.template"),
      d = c.cloneNode(!0),
      e = b.username;
    d.dataset.username = e;
    var g = d.querySelector(".username");
    g.innerText = e;
    var i = d.querySelector(".user_icon");
    b.icon && i.setAttribute("src", b.icon);
    var j = d.querySelector(".edit_pass_btn"),
      k = d.querySelector(".edit_pass_wrap");
    j.setAttribute("title", chrome.i18n.getMessage("edit_pass")),
      j.addEventListener("click", function (a) {
        a.stopPropagation(), o(k);
      });
    var l = d.querySelector("input"),
      m = d.querySelector(".apply_pass"),
      n = d.querySelector(".cancel_pass");
    (m.innerText = chrome.i18n.getMessage("apply_add_acc_btn")),
      (n.innerText = chrome.i18n.getMessage("cancel")),
      l.setAttribute(
        "placeholder",
        chrome.i18n.getMessage("enter_new_password")
      ),
      m.addEventListener("click", f.bind(d)),
      n.addEventListener("click", function () {
        p(k);
      }),
      l.addEventListener("input", function () {
        this.classList.remove("error_validation");
      });
    var q = d.querySelector(".remove_user");
    q.setAttribute("title", chrome.i18n.getMessage("remove")),
      q.addEventListener("click", function () {
        h(e, function () {
          a();
        });
      }),
      d.classList.remove("template"),
      x.appendChild(d),
      g.addEventListener("click", function () {
        chrome.runtime.sendMessage({
          action: "auth",
          username: e,
        });
      }),
      i.addEventListener("click", function () {
        chrome.runtime.sendMessage({
          action: "auth",
          username: e,
        });
      });
  }

  function j() {
    C.setAttribute("disabled", "disabled"),
      D.setAttribute("disabled", "disabled"),
      A.setAttribute("disabled", "disabled"),
      B.setAttribute("disabled", "disabled"),
      (E.style.display = "block"),
      F.on();
  }

  function k() {
    C.removeAttribute("disabled"),
      D.removeAttribute("disabled"),
      A.removeAttribute("disabled"),
      B.removeAttribute("disabled"),
      (E.style.display = "none"),
      F.off();
  }

  function l(a) {
    a.querySelector("input").setAttribute("disabled", "disabled"),
      a.querySelector(".apply_pass").setAttribute("disabled", "disabled"),
      a.querySelector(".cancel_pass").setAttribute("disabled", "disabled"),
      a.querySelector(".edit_pass_btn").setAttribute("disabled", "disabled"),
      (a.querySelector(".edit_loader").style.display = "inline");
  }

  function m(a) {
    a.querySelector("input").removeAttribute("disabled"),
      a.querySelector(".apply_pass").removeAttribute("disabled"),
      a.querySelector(".cancel_pass").removeAttribute("disabled"),
      a.querySelector(".edit_pass_btn").removeAttribute("disabled"),
      (a.querySelector(".edit_loader").style.display = "none");
  }

  function n(a) {
    a.querySelectorAll("input").forEach(function (a) {
      a.value = "";
    });
  }

  function o(a) {
    a.style.display = "inline-block";
  }

  function p(a) {
    (a.style.display = "none"),
      n(a),
      a.querySelectorAll(".error_validation").forEach(function (a) {
        a.classList.remove("error_validation");
      }),
      G.hide(a);
  }

  function q(a, b) {
    chrome.runtime.sendMessage("addRequestsListener", function () {
      var c = parseInt(1e4 * Math.random());
      r(c, 1, function (d) {
        return d
          ? void setTimeout(function () {
              s(a, c, function (a) {
                return a ? void b(a, c) : void b(a);
              });
            }, 2e3)
          : void b();
      });
    });
  }

  function r(a, b, c) {
    var d = {};
    (d["i-m-l-" + b] = a),
      $.ajax({
        method: "GET",
        url: "https://www.instagram.com/",
        headers: d,
      })
        .done(function (a) {
          c(a);
        })
        .fail(function (a) {
          c();
        });
  }

  function s(a, b, c) {
    $.ajax({
      method: "POST",
      url: "https://www.instagram.com/accounts/login/ajax/",
      headers: {
        "X-Instagram-AJAX": "1",
        "i-m-l-2": b,
      },
      data: {
        username: a.username,
        password: a.password,
      },
    })
      .done(function (a) {
        c(a, b);
      })
      .fail(function (a) {
        c(a);
      });
  }

  function t(a) {
    var b, c;
    a = a.replace(/[\r\n\t\s]/g, "");
    var d = a.indexOf("window._sharedData");
    if (-1 != d) {
      var e = a.indexOf("</script>", d);
      if (-1 != e) {
        var f = a.substr(d, e - d);
        if (((b = f.match(/({.+);$/)), (b = b && b[1]))) {
          try {
            c = JSON.parse(b);
          } catch (g) {}
          if (c) {
            var h = c.config;
            return h && h.viewer && h.viewer.profile_pic_url;
          }
        }
      }
    }
  }

  function u(a, b) {
    for (var c in b) a[c] = b[c];
  }
  var v = document.querySelector("header.header"),
    w = document.querySelector(".no_users"),
    x = document.querySelector(".list_users_wrap"),
    y = document.querySelector(".add_btn_wrap a"),
    z = document.querySelector(".add_form_wrap"),
    A = z.querySelector(".add_send"),
    B = z.querySelector(".add_cancel"),
    C = z.querySelector('input[name="password"]'),
    D = z.querySelector('input[name="username"]'),
    E = document.querySelector(".add_form_loader");
  C.setAttribute("placeholder", chrome.i18n.getMessage("enter_password")),
    D.setAttribute("placeholder", chrome.i18n.getMessage("enter_username")),
    (y.querySelector("span:last-child").innerText = chrome.i18n.getMessage(
      "add_acc_btn"
    )),
    (A.innerText = chrome.i18n.getMessage("apply_add_acc_btn")),
    (B.innerText = chrome.i18n.getMessage("cancel")),
    (v.innerText = chrome.i18n.getMessage("extName")),
    (E.querySelector(".text").innerText = chrome.i18n.getMessage(
      "please_wait"
    ));
  var F = {
      el: E.querySelector(".gif"),
      interval: 0,
      on: function () {
        var a = this.el;
        (a.innerText = ""),
          (this.interval = setInterval(function () {
            var b = a.innerText.length;
            switch (b) {
              case 0:
                a.innerText = ".";
                break;
              case 1:
                a.innerText = "..";
                break;
              case 2:
                a.innerText = "...";
                break;
              case 3:
                a.innerText = "";
            }
          }, 300));
      },
      off: function () {
        clearInterval(this.interval), (this.el.innerText = "");
      },
    },
    G = {
      show: function (a, b) {
        if (b) {
          var c = a.querySelector(".error_message");
          (c.innerText = b), (c.style.display = "block");
        }
      },
      hide: function (a) {
        var b = a.querySelector(".error_message");
        (b.style.display = "none"), (b.innerText = "");
      },
    };
  !(function () {
    b(), a(), c(), d();
  })();
})(),
  !(function () {
    (document.body.style.opacity = 0),
      (document.body.style.transition = "opacity ease-out .4s"),
      requestAnimationFrame(function () {
        document.body.style.opacity = 1;
      });
    var a = function () {
        (document.body.style.border = "none"),
          setTimeout(function () {
            document.body.style.border = "1px solid transparent";
          }, 100),
          setTimeout(function () {
            document.body.style.border = "none";
          }, 300);
      },
      b = function (b) {
        setTimeout(function () {
          document.outerWidth < 100 && a();
        }, b);
      };
    a(), b(3e3), b(1e4), b(3e4), b(5e4);
  })();
