import {_decorator, BoxCollider, CCFloat, ERigidBodyType, ICollisionEvent, RigidBody} from 'cc';
import {PooledComponent} from '../core/Pool/PooledComponent';
import CarController from './CarController';
import GameEvent from '../enum/GameEvent';

const {ccclass, property} = _decorator;

@ccclass('Log')
export default class Log extends PooledComponent {
    @property(RigidBody) private rb!: RigidBody;
    @property(BoxCollider) private collider!: BoxCollider;

    @property(CCFloat) private delayToDisable: number = 5;

    protected onEnable(): void {
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    protected onDisable(): void {
        this.collider.off('onCollisionEnter', this.onCollisionEnter, this);
    }

    protected start(): void {
        this.rb.type = ERigidBodyType.STATIC;
    }

    public fall(): void {
        this.rb.type = ERigidBodyType.DYNAMIC;

        this.scheduleOnce(() => this.disable(), this.delayToDisable);
    }

    private disable(): void {
        this.rb.type = ERigidBodyType.STATIC;

        this.returnToPool();
    }

    private onCollisionEnter(event: ICollisionEvent): void {
        const other = event.otherCollider;

        if (other.node.getComponent(CarController)) {
            this.node.emit(GameEvent[GameEvent.LOG_FALLING], this);
        }
    }
}
