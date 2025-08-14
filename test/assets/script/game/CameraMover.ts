import {_decorator, Component, Vec3} from 'cc';
import CarController from './CarController';
import GlobalEventTarget from '../core/GlobalEventTarget';
import PlayableEvent from '../enum/PlayableEvent';
import ScreenInfo from '../core/ScreenInfo';
import CameraAdjuster from '../core/CameraAdjuster';

const {ccclass, property} = _decorator;

@ccclass('CameraMover')
export default class CameraMover extends Component {
    @property(CarController) private carController!: CarController;
    @property(CameraAdjuster) private cameraAdjuster!: CameraAdjuster;

    private offset: Vec3 = new Vec3();
    private lastCarPosX: number = 0;

    protected onEnable(): void {
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.onWindowResized, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.onWindowResized, this);
    }

    protected start(): void {
        this.setOffset();

        this.lastCarPosX = this.carController.node.worldPosition.x;
    }

    protected update(dt: number): void {
        const currentCarPosX = this.carController.node.worldPosition.x;

        if (currentCarPosX === this.lastCarPosX) {
            return;
        }

        this.lastCarPosX = currentCarPosX;

        const currentPos = this.node.worldPosition.clone();
        currentPos.x = currentCarPosX + this.offset.x;

        this.node.setWorldPosition(currentPos);
    }

    private setOffset(): void {
        this.offset.set(this.node.worldPosition);
        this.offset.subtract(this.carController.node.worldPosition);
    }

    private onWindowResized(screenInfo: ScreenInfo): void {
        this.cameraAdjuster.applyAdjustment(screenInfo);

        this.setOffset();

        this.lastCarPosX = this.carController.node.worldPosition.x;
    }
}
