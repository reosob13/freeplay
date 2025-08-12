import {EventTouch} from 'cc';
import InputType from './InputType';
import InputSource from './InputSource';

type InputEventData = {
    eventTouch: EventTouch,
    touchSource: InputSource,
    type: InputType,
};

export default InputEventData;