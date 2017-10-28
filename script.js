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
// TODO: load these at start of script if they are not loaded
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
    el = el.nextSibling; // text is close by
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
  var formEl = document.createElement('form');
  formEl.setAttribute('action', 'options.php');
  formEl.setAttribute('method', 'post');

  var tableEl = document.createElement('table');
  tableEl.setAttribute('style', 'background:url("http://static.pardus.at/img/stdhq/bgd.gif")');
  tableEl.setAttribute('width', '100%');
  tableEl.setAttribute('align', 'center');
  tableEl.setAttribute('cellpadding', '3');
  formEl.appendChild(tableEl);

  var tbodyEl = document.createElement('tbody');
  tableEl.appendChild(tbodyEl);

  var headerTrEl = document.createElement('tr');
  headerTrEl.innerHTML = '<th>Private Void Options</th>';
  tbodyEl.appendChild(headerTrEl);

  for (var i = 0; i < pilotRepls.length; i++) {
    var row = document.createElement('tr');
    row.setAttribute('pv_selector', 'pv');
    var def = document.createElement('table');

    if (i % 2) {
      def.setAttribute('style', 'background:url("http://static.pardus.at/img/stdhq/bg_yellow.gif")');
    } else {
      def.setAttribute('style', 'background:url("http://static.pardus.at/img/stdhq/bg_red.gif")');
    }
    def.setAttribute('width', '100%');
    def.setAttribute('align', 'center');
    def.setAttribute('cellpadding', '3');

    var name = document.createElement('tr');
    var nameLbl = document.createElement('td');
    nameLbl.innerHTML = 'Name of pilot to alter:';
    name.appendChild(nameLbl);
    var nameInputField = document.createElement('td');
    var nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('name', 'pv_name');
    nameInput.setAttribute('value', pilotRepls[i].name);
    nameInput.setAttribute('maxlength', '20');
    nameInput.setAttribute('size', '20');
    nameInput.setAttribute('style', 'vertical-align:middle');
    nameInput.setAttribute('title', 'Enter name of pilot to alter');
    nameInputField.appendChild(nameInput);
    name.appendChild(nameInputField);
    def.appendChild(name);

    var newName = document.createElement('tr');
    var newNameLbl = document.createElement('td');
    newNameLbl.innerHTML = 'New name of pilot:';
    newName.appendChild(newNameLbl);
    var newNameInputField = document.createElement('td');
    var newNameInput = document.createElement('input');
    newNameInput.setAttribute('type', 'text');
    newNameInput.setAttribute('name', 'pv_repl_name');
    newNameInput.setAttribute('value', pilotRepls[i].rname);
    newNameInput.setAttribute('maxlength', '20');
    newNameInput.setAttribute('size', '20');
    newNameInput.setAttribute('style', 'vertical-align:middle');
    newNameInput.setAttribute('title', 'Enter altered name of pilot');
    newNameInputField.appendChild(newNameInput);
    newName.appendChild(newNameInputField);
    def.appendChild(newName);

    var newLinesLbl = document.createElement('tr');
    var newLinesLblField = document.createElement('td');
    newLinesLblField.setAttribute('colspan', '2');
    newLinesLblField.innerHTML = 'Replace the text of pilot with one of the following lines:';
    newLinesLbl.appendChild(newLinesLblField);
    def.appendChild(newLinesLbl);

    var newLinesInputField = document.createElement('td');
    newLinesInputField.setAttribute('colspan', '2');
    var newLinesInput = document.createElement('textarea');
    newLinesInput.setAttribute('name', 'pv_repl_lines');
    newLinesInput.setAttribute('cols', '70');
    newLinesInput.setAttribute('rows', '3');
    newLinesInput.setAttribute('style', 'font-family: Helvetica, Arial, sans-serif;background-color:#00001C; color:#D0D1D9; font-size:11px; width:320px');
    newLinesInput.setAttribute('title', 'Enter replacement lines for pilot');
    var s = "";
    for (var j = 0; j < pilotRepls[i].replacements.length; j++) {
      s += pilotRepls[i].replacements[j] + '\n';
    }
    var txt = document.createTextNode(s);
    newLinesInput.appendChild(txt);
    newLinesInputField.appendChild(newLinesInput);
    def.appendChild(newLinesInputField);

    row.appendChild(def);
    tbodyEl.appendChild(row);
  }
  alert('ok');

  // TODO: this can get removed soon
  var tmp = document.createElement('tr');
  tmp.innerHTML = '<td>TMP: Remove me and adapt me</td>';
  tbodyEl.appendChild(tmp);

  var ptr = document.querySelector('form');
  ptr.parentNode.nextSibling.nextSibling.appendChild(document.createElement('br'));
  ptr.parentNode.nextSibling.nextSibling.appendChild(document.createElement('br'));
  ptr.parentNode.nextSibling.nextSibling.appendChild(formEl);
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
