import {_decorator, Component, warn} from 'cc';

const {ccclass} = _decorator;

@ccclass('Singleton')
export default abstract class Singleton<T extends Singleton<T>> extends Component {
    protected static instance: any = null;

    protected onLoad(): void {
        this.checkSingle();
    }

    private checkSingle(): void {
        const staticThis = this.constructor as typeof Singleton;

        if (staticThis.instance !== null) {
            warn(`Multiple instances of ${this.constructor.name} detected. Destroying duplicate.`);
            this.destroy();

            return;
        }

        staticThis.instance = this;
    }

    protected onDestroy(): void {
        const staticThis = this.constructor as typeof Singleton;

        if (staticThis.instance === this) {
            staticThis.instance = null;
        }
    }

    public static getInstance<T extends Singleton<T>>(this: new () => T): T | null {
        return (this as any).instance as T || null;
    }
}