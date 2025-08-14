import {_decorator, CCFloat, CCInteger, Component, Node, Vec3} from 'cc';
import {PoolManager} from '../core/Pool/PoolManager';
import Log from './Log';
import PooledType from '../core/Pool/PooledType';
import GameEvent from '../enum/GameEvent';
import GlobalEventTarget from '../core/GlobalEventTarget';

const {ccclass, property} = _decorator;

@ccclass('LogManager')
export default class LogManager extends Component {
    @property(CCInteger) private count: number = 72;
    @property(CCFloat) private offset: number = 0.55;
    @property(Node) private spawnPoint!: Node;

    private poolManager: PoolManager;
    private logs: Log[] = [];

    protected onLoad(): void {
        this.poolManager = PoolManager.getInstance<PoolManager>();
    }

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.TOUCHED_FALL_ZONE], this.onTouchedFallZone, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.TOUCHED_FALL_ZONE], this.onTouchedFallZone, this);
    }

    protected start(): void {
        this.spawn();
    }

    private spawn(): void {
        for (let i = 0; i < this.count; i++) {
            const pos = new Vec3(i * this.offset);

            const log = this.poolManager.getObject<Log>(PooledType.Log, pos, this.spawnPoint);

            this.logs.push(log);

            log.node.on(GameEvent[GameEvent.LOG_FALLING], this.onLogFalling, this);
        }
    }

    private onLogFalling(log: Log): void {
        const triggeredIndex = this.logs.indexOf(log);

        if (triggeredIndex === -1) {
            return;
        }

        for (let i = 0; i <= triggeredIndex; i++) {
            this.logs[i].fall();
        }

        this.logs.splice(0, triggeredIndex + 1);
    }

    private onTouchedFallZone(): void {
        for (let i = 0; i < this.logs.length; i++) {
            this.logs[i].fall();
        }

        this.logs = [];
    }
}
