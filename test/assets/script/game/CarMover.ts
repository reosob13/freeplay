import {_decorator, CCFloat, Component, RigidBody, Vec3} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('CarMover')
export default class CarMover extends Component {
    private readonly MAX_VELOSITY_Y: number = 1;

    @property(CCFloat) private speed: number = 50;
    @property(RigidBody) private rb!: RigidBody;

    private canMove: boolean = false;
    private leverValue: number = 0;

    private velocity: Vec3 = new Vec3();
    private angVel: Vec3 = new Vec3();

    protected update(dt: number): void {
        if (this.canMove) {
            this.move(dt);
        }
    }

    public getLeverValue(leverValue: number): void {
        if (leverValue <= 0) {
            this.canMove = false;
            this.rb.setLinearVelocity(Vec3.ZERO);
            return;
        }

        this.leverValue = leverValue;
        this.canMove = true;
    }

    public stop(): void {
        this.canMove = false;
        this.leverValue = 0;
        this.rb.setLinearVelocity(Vec3.ZERO);
    }


    private move(dt: number): void {
        this.rb.getLinearVelocity(this.velocity);
        this.rb.getAngularVelocity(this.angVel);

        if (this.angVel.z < 0) {
            this.angVel.z = 0;
            this.rb.setAngularVelocity(this.angVel);
        }

        this.velocity.x = this.speed * this.leverValue * dt;
        this.velocity.y = Math.min(this.velocity.y, this.MAX_VELOSITY_Y);

        this.rb.setLinearVelocity(this.velocity);
    }

}
