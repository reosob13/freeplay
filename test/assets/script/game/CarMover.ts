import {_decorator, CCFloat, Component, RigidBody, Vec3} from 'cc';
import GlobalEventTarget from '../core/GlobalEventTarget';
import GameEvent from '../enum/GameEvent';

const {ccclass, property} = _decorator;

@ccclass('CarMover')
export default class CarMover extends Component {
    @property(CCFloat) private speed: number = 50;
    @property(RigidBody) private rb!: RigidBody;

    private canMove: boolean = false;
    private leverValue: number = 0;
    private velocity: Vec3 = new Vec3();

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.LEVER_CHANGED], this.onLeverChanged, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.LEVER_CHANGED], this.onLeverChanged, this);
    }

    protected update(dt: number): void {
        if (this.canMove) {
            this.move(dt);
        }
    }

    private move(dt: number): void {
        this.rb.getLinearVelocity(this.velocity);

        this.velocity.x = this.speed * this.leverValue * dt;
        this.rb.setLinearVelocity(this.velocity);
    }

    private onLeverChanged(leverValue: number): void {
        if (leverValue <= 0) {
            this.canMove = false;
            this.rb.setLinearVelocity(Vec3.ZERO);

            return;
        }

        this.leverValue = leverValue;
        this.canMove = true;
    }
}