/*
  wyqydsyq/dash-to-panel-activities-text

  Copyright (c) 2019 Damon Poole

  This extension is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.

  This extension is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see
  < https://www.gnu.org/licenses/old-licenses/gpl-2.0.html >.

  This extension is a derived work of the Gnome Shell.
*/

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

var activitiesIndicator = null;
var savedText = null;
var savedStyle = null;
var settings = null;
var textChangedSignal = 0;

function set_text() {
    let text = settings.get_string("activities-text");
    activitiesIndicator._label.set_text(text);
    let size = settings.get_double("activities-text-scale-factor");
    let textStyle = 'font-size: %fem;'.format(size);
    activitiesIndicator._label.set_style(textStyle);
}

function init(metadata) {
    settings = Convenience.getSettings();
    activitiesIndicator = Main.panel.statusArea['activities'];
    savedText = activitiesIndicator._label.get_text();
    savedStyle = activitiesIndicator._label.get_style();
}

function enable() {
    if(textChangedSignal == 0)
        textChangedSignal = settings.connect('changed::activities-text', set_text);
    set_text();
}

function disable() {
    if(textChangedSignal > 0) {
        settings.disconnect(textChangedSignal);
        textChangedSignal = 0;
    }
    activitiesIndicator._label.set_text(savedText);
    activitiesIndicator._label.set_style(savedStyle);
}
