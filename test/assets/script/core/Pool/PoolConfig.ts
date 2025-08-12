import {_decorator, Prefab, Enum, CCInteger, } from 'cc';
import PooledType from './PooledType';

const {ccclass, property} = _decorator;

@ccclass('PoolConfig')
export class PoolConfig {
    @property({type: Enum(PooledType)}) public pooledType: PooledType = PooledType.None;

    @property({type: Prefab}) public pooledObject!: Prefab;

    @property(CCInteger) public count: number = 0;
}