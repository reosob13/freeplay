import {_decorator, AudioClip, AudioSource, Node, warn, Enum, CCFloat, CCInteger, CCBoolean} from 'cc';
import Singleton from '../Singleton';
import GlobalEventTarget from '../GlobalEventTarget';
import PlayableEvent from '../../enum/PlayableEvent';
import AudioName from './AudioName';

const {ccclass, property} = _decorator;

@ccclass('SoundPlaybackOptions')
export class SoundPlaybackOptions {
    @property(CCFloat) public volume: number = 1;
    @property(CCInteger) public maxCount: number = 3;
    @property(CCBoolean) public isLoop: boolean = false;

    public currentCount: number = 0;
}

@ccclass('SoundDefinition')
export class AudioDefinition {
    @property({type: Enum(AudioName)}) public name: AudioName = AudioName.None;
    @property({type: AudioClip}) public clip: AudioClip | null = null;
    @property({type: SoundPlaybackOptions}) public options: SoundPlaybackOptions = new SoundPlaybackOptions();
}

@ccclass()
export default class AudioSystem extends Singleton<AudioSystem> {
    @property(AudioDefinition) private audioDefinitions: AudioDefinition[] = [];

    private audioNodes: Map<number, AudioSource> = new Map();
    private idCounter: number = 0;

    protected onLoad(): void {
        super.onLoad();

        GlobalEventTarget.on(PlayableEvent[PlayableEvent.AUDIO_PLAY], this.onAudioPlay, this);
    }

    public play(name: AudioName, options: SoundPlaybackOptions | {} = {}): number | null {
        const config = this.audioDefinitions.find(s => s.name === name);

        if (!config) {
            warn(`Can't find sound: ${name}`);

            return null;
        }

        if (!config.clip) {
            warn(`No audio clip for sound: ${name}`);

            return null;
        }

        if (config.options.currentCount < config.options.maxCount) {
            config.options.currentCount += 1;

            const opt = Object.assign({}, config.options, options);
            const audioId = this.playSound(config.clip, opt.isLoop, opt.volume, () => {
                config.options.currentCount -= 1;
            });

            return audioId;
        }

        return null;
    }

    public playSound(clip: AudioClip, isLoop: boolean, volume: number, onFinish?: () => void): number {
        const audioSourceNode = new Node('AudioSource_' + this.idCounter);
        audioSourceNode.parent = this.node;

        const audioSource = audioSourceNode.addComponent(AudioSource);
        audioSource.clip = clip;
        audioSource.loop = isLoop;
        audioSource.volume = volume;

        const id = this.idCounter++;
        this.audioNodes.set(id, audioSource);

        audioSource.play();

        if (!isLoop) {
            audioSource.node.once(AudioSource.EventType.ENDED, () => {
                onFinish?.();
                audioSourceNode.destroy();
                this.audioNodes.delete(id);
            });
        }

        return id;
    }

    public stop(id: number): void {
        const source = this.audioNodes.get(id);
        if (source) {
            source.stop();
            source.node.destroy();
            this.audioNodes.delete(id);
        }
    }

    private onAudioPlay(name: AudioName, optionsOrClip: SoundPlaybackOptions | AudioClip, isLoop: boolean = false, volume: number = 1): void {
        if (optionsOrClip instanceof AudioClip) {
            this.playSound(optionsOrClip, isLoop, volume);
        } else {
            this.play(name, optionsOrClip);
        }
    }
}