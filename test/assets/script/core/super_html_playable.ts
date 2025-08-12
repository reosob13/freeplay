export class super_html_playable {
    download() {
        console.log("download");
        //@ts-ignore
        window.super_html && super_html.download();
    }

    game_end() {
        console.log("game end");
        //@ts-ignore
        window.super_html && super_html.game_end();
    }

    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    is_hide_download() {
        //@ts-ignore
        if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
        }

        return false;
    }

    set_google_play_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    }

    set_app_store_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    }

    is_audio() {
        //@ts-ignore
        return (window.super_html && super_html.is_audio()) || true;
    }
}
export default new super_html_playable();