import {_decorator, Component, Enum} from 'cc';
import ZoneType from '../enum/ZoneType';

const {ccclass, property} = _decorator;

@ccclass('ActionZone')
export default class ActionZone extends Component {
    @property({type: Enum(ZoneType)}) private type!: ZoneType;

    public get typeValue(): ZoneType {
        return this.type;
    }
}
