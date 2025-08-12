import {_decorator, Node, Vec3, Prefab, instantiate, error, warn} from 'cc';
import {PoolConfig} from './PoolConfig';
import {PooledComponent} from './PooledComponent';
import Singleton from '../Singleton';
import PooledType from './PooledType';

const {ccclass, property, menu} = _decorator;

@ccclass('PoolManager')
@menu('Pool/PoolManager')
export class PoolManager extends Singleton<PoolManager> {
    @property({type: PoolConfig})
    public poolConfigs: PoolConfig[] = [];

    private pooledDictionary: Map<PooledType, Node[]> = new Map();

    protected onLoad(): void {
        super.onLoad();

        this.preparePooledDictionary();
    }

    public getObject<T extends PooledComponent>(pooledType: PooledType, position: Vec3, parent?: Node): T | null {
        const pooledNodes = this.pooledDictionary.get(pooledType);

        if (!pooledNodes) {
            error(`No pooled objects of type ${PooledType[pooledType]} found.`);

            return null;
        }

        let freeNode = pooledNodes.find((node) => node.getComponent(PooledComponent)?.isFree);

        if (!freeNode) {
            warn(`No free objects of type ${PooledType[pooledType]} available. Creating new one.`);

            const poolConfig = this.poolConfigs.find((config) => config.pooledType === pooledType);

            if (!poolConfig) {
                error(`No PoolConfig found for type ${PooledType[pooledType]}`);

                return null;
            }

            freeNode = this.createPoolNode(poolConfig.pooledObject);
            pooledNodes.push(freeNode);
        }

        if (parent) {
            freeNode.setParent(parent);
        }

        freeNode.setPosition(position);
        freeNode.active = true;

        const pooledComponent = freeNode.getComponent(PooledComponent);
        pooledComponent?.spawnFromPool();

        return pooledComponent as T;
    }

    private preparePooledDictionary(): void {
        this.poolConfigs.forEach((poolConfig) => {
            if (!poolConfig.pooledObject) {
                error(`PoolConfig for ${PooledType[poolConfig.pooledType]} has no prefab!`);

                return;
            }

            this.pooledDictionary.set(poolConfig.pooledType, this.prepareObjects(poolConfig));
        });
    }

    private prepareObjects(poolConfig: PoolConfig): Node[] {
        const pooledList: Node[] = [];

        for (let i = 0; i < poolConfig.count; i++) {
            pooledList.push(this.createPoolNode(poolConfig.pooledObject));
        }

        return pooledList;
    }

    private createPoolNode(pooledPrefab: Prefab): Node {
        const newNode = instantiate(pooledPrefab);
        const pooledComponent = newNode.getComponent(PooledComponent) as PooledComponent;

        if (pooledComponent) {
            pooledComponent.returnToPool();
        } else {
            error(`PooledComponent not found on prefab: ${pooledPrefab.name}`);
        }

        newNode.active = false;
        newNode.setParent(this.node);

        return newNode;
    }
}