// ==UserScript==
// @name        Private Void
// @namespace   PardusPrivateVoidMathman
// @description Script to ignore and/or poke fun at Pardus spammers
// @author      Mathman
// @include     *://chat.pardus.at/chattext.php*
// @include     *://forum.pardus.at/index.php?showtopic*
// @include     *://*.pardus.at/options.php
// @version     0.0.4.2
// @grant       none
// ==/UserScript==

// TODO: don't forget to trim() each field before storing here
// TODO: load these at start of script if they are not loaded
// TODO: how to check them? maybe cookies?
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

function createPilotReplacementFormTable(ix) {
  var def = document.createElement('table');

  if (ix % 2) {
    def.setAttribute('style', 'background:url("http://static.pardus.at/img/stdhq/bg_yellow.gif")');
  } else {
    def.setAttribute('style', 'background:url("http://static.pardus.at/img/stdhq/bg_red.gif")');
  }
  def.setAttribute('width', '100%');
  def.setAttribute('align', 'center');
  def.setAttribute('cellpadding', '3');
  return def;
}

function createSimpleNamedField(labelText, inputName, inputValue) {
  var tr = document.createElement('tr');
  var label = document.createElement('td');
  label.innerHTML = labelText;
  tr.appendChild(label);
  var inputField = document.createElement('td');
  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', inputName);
  input.setAttribute('value', inputValue);
  input.setAttribute('size', '20');
  input.setAttribute('style', 'vertical-align:middle');
  input.setAttribute('title', 'Enter altered name of pilot');
  inputField.appendChild(input);
  tr.appendChild(inputField);
  return tr;
}

function createPilotReplacementFormNameField(ix) {
  return createSimpleNamedField('Name of pilot to alter:',
      'pv_name', pilotRepls[ix].name);
}

function createPilotReplacementFormNewNameField(ix) {
  return createSimpleNamedField('New name of pilot:',
      'pv_repl_name', pilotRepls[ix].rname);
}

function setupPilotReplacementNewLinesField(def, ix) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.setAttribute('colspan', '2');
  td.innerHTML = 'Replace the text of pilot with one of the following lines:';
  tr.appendChild(td);
  def.appendChild(tr);

  var inpField = document.createElement('td');
  inpField.setAttribute('colspan', '2');
  var ta = document.createElement('textarea');
  ta.setAttribute('name', 'pv_repl_lines');
  ta.setAttribute('cols', '70');
  ta.setAttribute('rows', '3');
  ta.setAttribute('style', 'font-family: Helvetica, Arial, sans-serif;background-color:#00001C; color:#D0D1D9; font-size:11px; width:320px');
  ta.setAttribute('title', 'Enter replacement lines for pilot');
  var s = "";
  for (var i = 0; i < pilotRepls[ix].replacements.length; i++) {
    s += pilotRepls[ix].replacements[i] + '\n';
  }
  var txt = document.createTextNode(s);
  ta.appendChild(txt);
  inpField.appendChild(ta);
  def.appendChild(inpField);
}

function createPilotReplacementForm(ix) {
  var row = document.createElement('tr');
  row.setAttribute('pv_selector', 'pv');
  var def = createPilotReplacementFormTable(ix);
  def.appendChild(createPilotReplacementFormNameField(ix));
  def.appendChild(createPilotReplacementFormNewNameField(ix));
  setupPilotReplacementNewLinesField(def, ix);
  row.appendChild(def);
  return row;
}

function createDeleteNote() {
  var tr = document.createElement('tr');
  var label = document.createElement('td');
  label.innerHTML = "Note: To delete an entry, leave all of its fields blank";
  tr.appendChild(label);
  return tr;
}

function createSaveButton() {
  var tr = document.createElement('tr');
  var saveField = document.createElement('td');
  var save = document.createElement('input');
  save.setAttribute('type', 'submit');
  save.setAttribute('name', 'pv_save');
  save.setAttribute('value', 'Save');
  saveField.appendChild(save);
  tr.appendChild(saveField);
  return tr;
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
    tbodyEl.appendChild(createPilotReplacementForm(i));
  }

  tbodyEl.appendChild(createDeleteNote());
  tbodyEl.appendChild(createSaveButton());

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
