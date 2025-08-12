import {_decorator, CCFloat, CCInteger, Component, Node, Vec3} from 'cc';
import {PoolManager} from '../core/Pool/PoolManager';
import Log from './Log';
import PooledType from '../core/Pool/PooledType';

const {ccclass, property} = _decorator;

@ccclass('LogSpawner')
export default class LogSpawner extends Component {
    @property(CCInteger) private count: number = 40;
    @property(CCFloat) private offset: number = 0.55;
    @property(Node) private spawnPoint!: Node;

    private poolManager: PoolManager;

    protected onLoad(): void {
        this.poolManager = PoolManager.getInstance<PoolManager>();
    }

    protected start(): void {
        this.spawn();
    }

    private spawn(): void {
        for (let i = 0; i < this.count; i++) {
            const pos = new Vec3(i * this.offset);
            this.poolManager.getObject<Log>(PooledType.Log, pos, this.spawnPoint);
        }
    }
}
