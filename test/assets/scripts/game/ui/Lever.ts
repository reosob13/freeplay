import {_decorator, Component, Sprite, Node, Vec3, Vec2} from 'cc';
import InputSystem from '../../core/Input/InputSystem';
import InputType from '../../core/Input/InputType';
import InputEventData from '../../core/Input/InputEventData';
import InputSource from '../../core/Input/InputSource';

const {ccclass, property} = _decorator;

@ccclass('Lever')
export default class Lever extends Component {
    @property(Sprite) private render!: Sprite;
    @property(Node) private hightPoint!: Node;
    @property(Node) private lowPoint!: Node;

    private inputSystem!: InputSystem;

    private isActive = false;
    private minY = 0;
    private maxY = 0;

    protected onLoad(): void {
        this.inputSystem = InputSystem.getInstance<InputSystem>();
        this.cacheBounds();
    }

    protected onEnable(): void {
        this.inputSystem.on(InputType[InputType.None], this.onInput, this);
    }

    protected onDisable(): void {
        this.inputSystem.off(InputType[InputType.None], this.onInput, this);
    }

    private cacheBounds(): void {
        const parent = this.render.node.parent!;
        const lowLocal = new Vec3();
        const highLocal = new Vec3();

        parent.inverseTransformPoint(lowLocal, this.lowPoint.worldPosition);
        parent.inverseTransformPoint(highLocal, this.hightPoint.worldPosition);

        this.minY = Math.min(lowLocal.y, highLocal.y);
        this.maxY = Math.max(lowLocal.y, highLocal.y);
    }

    private down(data: InputEventData): void {
        this.isActive = true;

        this.moveToTouch(data.eventTouch.getUILocation());
    }

    private up(): void {
        this.isActive = false;
    }

    private drag(data: InputEventData): void {
        if (!this.isActive) {
            return;
        }

        this.moveToTouch(data.eventTouch.getUILocation());
    }

    private moveToTouch(uiLocation: Vec2): void {
        const parent = this.render.node.parent!;
        const localTouch = new Vec3();

        parent.inverseTransformPoint(localTouch, new Vec3(uiLocation.x, uiLocation.y));

        const newPosY = Math.min(Math.max(localTouch.y, this.minY), this.maxY);
        this.render.node.setPosition(new Vec3(this.render.node.position.x, newPosY));

        const normalized = (newPosY - this.minY) / (this.maxY - this.minY);
        console.log('Lever value:', normalized);
    }

    private onInput(data: InputEventData): void {
        if (data.touchSource !== InputSource.Lever) {
            return;
        }

        switch (data.type) {
            case InputType.Down:
                this.down(data);
                break;

            case InputType.Up:
                this.up();
                break;

            case InputType.Drag:
                this.drag(data);
                break;
        }
    }
}
