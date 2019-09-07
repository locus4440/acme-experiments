
/*
  Activities Button Set Text Gnome Shell Extension

  Copyright (c) 2019 Norman L. Smith

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

const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;
const Convenience = Me.imports.convenience;
const GioSSS = Gio.SettingsSchemaSource;
const COMMIT = "Commit: 33c1b33a3038188d0cfb690ee14ed6f641605371";

function init() {
    Convenience.initTranslations();
}

const SettingsWidget = GObject.registerClass(
class SettingsWidget extends Gtk.Grid {

    _init(params) {
        super._init(params)
        let version = '[ v' + Me.metadata.version.toString() + ' GS ' +
            Me.metadata["shell-version"].toString() + ' ]';
        this.margin = 5;
        this.row_spacing = 20;
        this.column_spacing = 5;
        this.set_column_homogeneous(true);
	    this._settings = Convenience.getSettings()
	    this.attach(new Gtk.Label({label: _("New Text"), wrap: true, xalign: 0.5}), 0,  2, 8, 1);
	    this._entry = new Gtk.Entry({hexpand: true, xalign: 0.5})
	    let text = this._settings.get_string("activities-text");
        this._entry.set_text(text);;
        this.attach(this._entry, 0, 3, 8, 2);
        this.attach(new Gtk.Label({label: _("Scale") , wrap: true, xalign: 0.5}), 0, 6, 8, 1);
        this._scaleBtn = Gtk.SpinButton.new_with_range(1, 3, 0.1);
        let scaleBtnBox = new Gtk.Box({visible: true});
        scaleBtnBox.pack_start(this._scaleBtn, true, true, 200);
        this._scaleBtn.connect('value-changed', this._onTextScalingChanged.bind(this));
        this._scaleBtn.set_value(this._settings.get_double("activities-text-scale-factor"));
        this.attach(scaleBtnBox, 0, 8, 8, 1);
        this._applyBtn = new Gtk.Button({label: _("Apply")});
        this._applyBtn.connect('clicked', this._setActivitiesText.bind(this));
        let applyBtnBox = new Gtk.Box({sensitive: true, homogeneous:true});
        let f1 = new Gtk.Label({label: ""});
        applyBtnBox.pack_start(f1, false, false, 1);
        applyBtnBox.pack_start(this._applyBtn, false, false, 1);
        let f2 = new Gtk.Label({label: ""})
        applyBtnBox.pack_start(f2, false, false, 1);
        this.attach(applyBtnBox, 0, 10, 8, 2);
        this.attach(new Gtk.Label({label: COMMIT, wrap: true, xalign: 0.5}), 0, 24, 8, 1);
	    this.attach(new Gtk.Label({label: version, wrap: true, xalign: 0.5}), 0, 28, 8, 1);
        let linkBtn = new Gtk.LinkButton({uri: "https://github.com/wyqydsyq/dash-to-panel-activities-text",
                                          label: _("Website"), xalign: 0.5});
        this.attach(linkBtn, 0, 32, 8, 1);
    }

    _setActivitiesText() {
        let text = this._entry.get_text();
        let size = this._scaleBtn.get_value();
        if(text != '') {
            this._settings.set_string("activities-text", text);
            this._entry.set_text(text);
            this._settings.set_double("activities-text-scale-factor");  
        }
    }
    
    _onTextScalingChanged() {
        this._settings.set_double("activities-text-scale-factor", this._scaleBtn.get_value());
    }

    _completePrefsWidget() {
        let scollingWindow = new Gtk.ScrolledWindow({
                                 'hscrollbar-policy': Gtk.PolicyType.AUTOMATIC,
                                 'vscrollbar-policy': Gtk.PolicyType.AUTOMATIC,
                                 'hexpand': true, 'vexpand': true});
        scollingWindow.add_with_viewport(this);
        scollingWindow.width_request = 100;
        scollingWindow.height_request = 60;
        scollingWindow.show_all();
        return scollingWindow;
    }
});

function buildPrefsWidget() {
    let widget = new SettingsWidget();
    return widget._completePrefsWidget();
}
