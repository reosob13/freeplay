import {_decorator, Collider, ICollisionEvent} from 'cc';
import {PooledComponent} from '../core/Pool/PooledComponent';
import CarController from './CarController';
import GameEvent from '../enum/GameEvent';
import GlobalEventTarget from '../core/GlobalEventTarget';

const {ccclass, property} = _decorator;

@ccclass('Coin')
export default class Coin extends PooledComponent {
    @property(Collider) private collider!: Collider;

    protected onEnable(): void {
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected onDisable(): void {
        this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }

    public disable(): void {
        this.returnToPool();
    }

    private onTriggerEnter(event: ICollisionEvent): void {
        const car = event.otherCollider.getComponent(CarController);

        if (!car) {
            return;
        }

        GlobalEventTarget.emit(GameEvent[GameEvent.COIN_ADDED], this);

        this.disable();
    }
}
