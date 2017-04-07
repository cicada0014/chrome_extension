import { Router } from '@angular/router';
import { KeymapService, ShortKey } from '../../shared/keymap/keymap.service';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';

declare var Materialize:any;
@Component({
    selector: 'key-set',
    template: `
    <div class="row">
            <div class="col s2">{{keyName}}:</div>
            <div class="col s1"></div>
            <div class="col s3">
                <input id="{{keyAlias}}" maxlength="1" (keydown)="covertKeyCode($event)" type="text" class="validate" [(ngModel)]="keyAlias">
                
            </div>
            <div class="col s1">
                <input type="checkbox" id="alt+{{keyName}}" checked="checked" />
                <label for="alt+{{keyName}}">Alt</label></div>
            <div class="col s1">
                <input type="checkbox" id="ctr+{{keyName}}"   />
                <label for="ctr+{{keyName}}">Ctr</label>
            </div>
            <div class="col s1">
                <input type="checkbox" id="shift+{{keyName}}"  />
                <label for="shift+{{keyName}}">Shift</label>
            </div>

        </div>
    
    `
})
export class KeySetting {
    @Input() shortkey: ShortKey;
     keyName: string
    keyCode: string
     keyAlias: string;
    
    constructor() {

    }
    ngAfterContentInit() {
        this.keyName = this.shortkey.getKeyName();
        this.keyCode = this.shortkey.getKeyCode();
        this.keyAlias = this.shortkey.getKeyAlias();
    }

    covertKeyCode($event: KeyboardEvent) {

        this.keyAlias = $event.key;
        this.keyCode = $event.keyCode + "";
    }

    getKeyCode() {
        return this.keyCode;
    }

    getKeyAlias(){
        return this.keyAlias;
    }
    getKeyName(){
        return this.keyName;
    }

}

//

@Component({
    selector: 'setting-keymap',
    templateUrl: 'setting-keymap.component.html'

})
export class SettingKeymapComponent implements OnInit {

    shortkeys: ShortKey[];
    constructor(private keymapService: KeymapService,private router:Router) {
        this.shortkeys = this.keymapService.getKeymap();

    }

    ngOnInit() {

    }


    @ViewChildren(KeySetting) keySettings: QueryList<KeySetting>
    keymapChange() {
        this.keySettings.toArray().forEach((keySetting, index, keySettings) => {
            if (keySetting.getKeyCode() === this.shortkeys[index].getKeyCode()) {
            } else {
                this.shortkeys[index].setKeyCode(keySetting.getKeyCode());
                this.shortkeys[index].setKeyAlias(keySetting.getKeyAlias())
                Materialize.toast('[' +keySetting.getKeyName()+'] '+ 'Change Complete!', 2500);
            }
        }, this);
        

    };
    toEdtior(){
        this.router.navigateByUrl('');
    }

}