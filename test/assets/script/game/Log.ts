import {_decorator, Collider, ERigidBodyType, ICollisionEvent, RigidBody} from 'cc';
import {PooledComponent} from '../core/Pool/PooledComponent';
import CarController from './CarController';
import PlayableEvent from '../enum/PlayableEvent';
import GameEvent from '../enum/GameEvent';

const {ccclass, property} = _decorator;

@ccclass('Log')
export default class Log extends PooledComponent {
    @property(RigidBody) private rb!: RigidBody;
    @property(Collider) private collider!: Collider;

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
    }

    private onCollisionEnter(event: ICollisionEvent): void {
        const other = event.otherCollider;

        if (other.node.getComponent(CarController)) {
            this.node.emit(GameEvent[GameEvent.LOG_FALLING], this);
        }
    }
}
