import {PoolManager} from './core/Pool/PoolManager';
import {_decorator, CCInteger, Component, Vec3, Node} from 'cc';
import Coin from './game/Coin';
import PooledType from './core/Pool/PooledType';
import GeneralUtils from './core/GeneralUtils';

const {ccclass, property} = _decorator;

@ccclass('CoinManager')
export default class CoinManager extends Component {
    @property(Node) private startPoint!: Node;

    @property(CCInteger) private count: number = 10;
    @property(CCInteger) private minOffset: number = 3;
    @property(CCInteger) private maxOffset: number = 6;

    private poolManager: PoolManager | null = null;

    protected onLoad(): void {
        this.poolManager = PoolManager.getInstance<PoolManager>();
    }

    protected start(): void {
        this.spawn();
    }

    private spawn(): void {
        let stepX = GeneralUtils.randomFloat(this.minOffset, this.maxOffset);

        for (let i = 0; i < this.count; i++) {
            const coin = this.poolManager.getObject<Coin>(PooledType.Coin, new Vec3(), this.startPoint);

            coin.node.setPosition(stepX, 0, 0);

            stepX += GeneralUtils.randomFloat(this.minOffset, this.maxOffset);
        }
    }
}
