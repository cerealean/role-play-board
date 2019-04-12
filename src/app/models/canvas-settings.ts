import { EventEmitter } from '@angular/core';

export class CanvasSettings {
    public changes = new EventEmitter<CanvasSettings>();

    // tslint:disable-next-line:variable-name
    private _backgroundColor: string;
    public get backgroundColor(): string {
        return this._backgroundColor;
    }

    public set backgroundColor(value: string) {
        this._backgroundColor = value;
        this.changes.emit(Object.assign({}, this));
    }

    public get onChanges() {
        return this.changes.subscribe;
    }
}
