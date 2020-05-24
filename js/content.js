!(function () {
  function a(a) {
    return a.username && a.pass
      ? ($(document).ready(function () {
          d.showLoader();
        }),
        void setTimeout(function () {
          chrome.runtime.sendMessage("getCookies", function (b) {
            $.ajax({
              method: "POST",
              url: "https://www.instagram.com/accounts/login/ajax/",
              headers: {
                "X-Instagram-AJAX": "1",
                "X-CSRFToken": b.csrftoken,
              },
              data: {
                username: a.username,
                password: a.pass,
              },
            })
              .done(function (a) {
                return "object" != typeof a
                  ? void d.showError(
                      chrome.i18n.getMessage("login_unknown_error_msg")
                    )
                  : ("undefined" == typeof a.authenticated ||
                      "undefined" == typeof a.status ||
                      "undefined" == typeof a.user,
                    void (a.authenticated
                      ? (chrome.runtime.sendMessage("reloadAnotherTabs"),
                        (window.location = "https://www.instagram.com/"))
                      : d.showError(
                          chrome.i18n.getMessage("check_auth_data_msg")
                        )));
              })
              .fail(function (a) {
                a &&
                a.responseJSON &&
                "fail" == a.responseJSON.status &&
                a.responseJSON.checkpoint_url
                  ? setTimeout(function () {
                      window.location = a.responseJSON.checkpoint_url;
                    }, 2e3)
                  : d.showError(
                      chrome.i18n.getMessage("login_unknown_error_msg")
                    );
              });
          });
        }, 2e3))
      : void d.showError(chrome.i18n.getMessage("login_unknown_error_msg"));
  }

  function b() {
    chrome.storage.sync.get("usersData", function (a) {
      if (a.usersData && a.usersData.length) {
        var b = a.usersData;
        b.forEach(function (a) {
          var d = a.username;
          $.ajax({
            method: "GET",
            url: "https://www.instagram.com/" + d,
          }).done(function (d) {
            var e = c(d);
            e &&
              a.icon != e &&
              ((a.icon = e),
              chrome.storage.sync.set({
                usersData: b,
              }));
          });
        });
      }
    });
  }

  function c(a) {
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
          if (c)
            return (
              c.entry_data &&
              c.entry_data.ProfilePage &&
              c.entry_data.ProfilePage[0] &&
              c.entry_data.ProfilePage[0].user &&
              c.entry_data.ProfilePage[0].user.profile_pic_url
            );
        }
      }
    }
  }
  var d = {
    childContainer: null,
    parentContainer: null,
    createContainers: function () {
      if (!this.parentContainer) {
        var a = document.createElement("div"),
          b = document.createElement("div");
        b.className = "ext_login_process_wrap";
        var c = document.createElement("div");
        c.className = "ext_login_process_wrap2";
        var d = document.createElement("div");
        (d.className = "ext_login_process_wrap3"),
          c.appendChild(d),
          b.appendChild(c),
          a.appendChild(b),
          document.body.appendChild(a),
          (this.parentContainer = a),
          (this.childContainer = d);
      }
    },
    showLogOut: function () {
      this.createContainers(), (this.childContainer.innerHTML = "");
      var a = document.querySelector(".ext_login_process_wrap");
      a.classList.add("logged_off");
      var b = document.createElement("div");
      b.className = "ext_modal";
      var c = document.createElement("span");
      (c.className = "ext_modal_text"),
        (c.innerText = chrome.i18n.getMessage("logged_out")),
        b.appendChild(c),
        this.childContainer.appendChild(b),
        window.addEventListener("scroll", function () {
          window.location = "https://www.instagram.com/";
        }),
        a.addEventListener("click", function () {
          window.location.reload();
        });
    },
    showLoader: function () {
      this.createContainers(), (this.childContainer.innerHTML = "");
      var a = document.createElement("div");
      a.className = "ext_loader";
      var b = document.createElement("span");
      (b.className = "ext_icon"),
        a.appendChild(b),
        this.childContainer.appendChild(a);
    },
    showError: function (a) {
      this.createContainers(), (this.childContainer.innerHTML = "");
      var b = document.createElement("div");
      b.className = "ext_error_box";
      var c = document.createElement("span");
      (c.className = "ext_error_msg"),
        (c.innerText = a),
        b.appendChild(c),
        this.childContainer.appendChild(b),
        document
          .querySelector(".ext_login_process_wrap")
          .addEventListener("click", function () {
            d.remove();
          });
    },
    remove: function () {
      this.parentContainer &&
        this.parentContainer.parentNode &&
        this.parentContainer.parentNode.removeChild(this.parentContainer),
        (this.parentContainer = null),
        (this.childContainer = null);
    },
  };
  chrome.runtime.sendMessage("needLoginAskBg", function (b) {
    b && a(b);
  }),
    chrome.runtime.onMessage.addListener(function (a, b, c) {
      "reloadTab" == a && (c(!0), d.showLogOut());
    }),
    setTimeout(function () {
      chrome.runtime.sendMessage("isTimeUpdateImages", function (a) {
        a && b();
      });
    }, 6e3);
})();
