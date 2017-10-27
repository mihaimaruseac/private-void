// ==UserScript==
// @name        Private Void
// @namespace   NumbersMcGee
// @description Script to ignore and/or poke fun at Pardus spammers
// @author      Mith/Numbers Mc Gee
// @include     *://chat.pardus.at/chattext.php*
// @include     *://forum.pardus.at/index.php?showtopic*
// @include     *://*.pardus.at/options.php
// @version     0.0.4.2
// @grant       none
// ==/UserScript==

// TODO: don't forget to trim() each field before storing here
var pilotRepls = [
  {name: "Leona", rname: "", replacements: []},
  {name: "Ygramul The Many", rname: "", replacements: []},
  {name: "Sogno", rname: "Soggy", replacements: []},
  {name: "Kimber Tambo", rname: "", replacements: ["asdf"]},
  {name: "Fapi Lul", rname: "", replacements: ["x"]},
  {name: "Boots", rname: "Bootsies", replacements: ["x", "y", "z"]},
  {name: "Chesh", rname: "Cheese", replacements: []},
  {name: "Neferpitou", rname: "", replacements: ["asdf", "xyz"]},
];

function nameNode(el, chat, forum) {
  if (chat) {
    return el.parentNode.parentNode;
  } else if (forum) {
    return el.parentNode.parentNode.parentNode.parentNode.parentNode;
  }
}

function setName(name, chat, forum) {
  if (chat) {
    return '<b>' + name + '</b>';
  } else if (forum) {
    return name;
  }
}

function replaceText(el, text, chat, forum) {
  if (chat) {
    el = el.nextSibling; // text is close by;
    el.textContent = ':\n' + text;

    // cleanup in case there are emotes on the line
    do {
      el = el.nextSibling;
      if (el != null) {
        switch (el.nodeType) {
          case 3: el.textContent = ''; break;
          case 8: break;
          default: el.style.display = 'none';
        }
      }
    } while (el != null);
  } else if (forum) {
    el = el.parentNode.parentNode.parentNode; // go up to start of post
    el = el.nextSibling.nextSibling.childNodes[3]; // pick the proper tab
    el.innerHTML = '<div class="postcolor">' + text + '</div>';
  }
}

function doHidingUsers(isChat, isForum) {
  for (var i = 0; i < pilotRepls.length; i++) {
    var els = document.querySelectorAll('span a[href="' +
        "javascript:sendmsg('" +
        encodeURIComponent(pilotRepls[i].name) +
        "')" + '"]');

    if (pilotRepls[i].rname === "" && pilotRepls[i].replacements.length == 0) {
      // player wants this one hidden
      for (var loop = 0; loop < els.length; loop++) {
        var node = nameNode(els[loop], isChat, isForum);
        node.style.display = 'none';
      }
    } else {
      // player wants to replace parts of this pilots info:
      var rName = pilotRepls[i].rname || pilotRepls[i].name;
      for (var loop = 0; loop < els.length; loop++) {
        els[loop].innerHTML = setName(rName, isChat, isForum);
        if (pilotRepls[i].replacements.length > 0) {
          var ix = Math.floor(Math.random()*pilotRepls[i].replacements.length);
          replaceText(els[loop], pilotRepls[i].replacements[ix], isChat, isForum);
        }
      }
    }
  }
}

function doOptionsPage() {
  alert('options');
  var formEl = document.createElement("div"); // TODO: make it form
  var txt = document.createTextNode("MM was here"); // TODO: from here on we replace with actual content
  formEl.appendChild(txt);
  var ptr = document.querySelector('form');
  ptr.parentNode.nextSibling.nextSibling.appendChild(formEl);
  alert('done');
}

function main() {
  var isChat = window.location.href.indexOf("chat") !== -1;
  var isForum = window.location.href.indexOf("forum") !== -1;
  var isOptions = window.location.href.indexOf("options") !== -1;

  if (isOptions) {
    doOptionsPage();
  } else if (isChat || isForum) {
    doHidingUsers(isChat, isForum);
  }
}

main()
