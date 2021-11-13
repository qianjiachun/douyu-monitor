import { ref, computed } from "vue";
import { Ex_WebSocket_UnLogin } from "@/global/utils/websocket.js"
import { STT } from "@/global/utils/stt.js"
import { getStrMiddle } from "@/global/utils"

export function useWebsocket() {
    let ws = null;

    const connectWs = (rid) => {
        if (rid === "") {
            return;
        }
        ws = new Ex_WebSocket_UnLogin(rid, (msg) => {
            handleMsg(msg);
        }, () => {
            // 重连
            ws.close();
            ws = null;
            connectWs();
        });
    }

    const handleMsg = (msg) => {
        const MSG_TYPE = [
            "chatmsg",
            "dgb",
            "uenter"
        ]
        let msgType = getStrMiddle(msg, "type@=", "/");
        if (msgType && MSG_TYPE.includes(msgType)) {
            let data = new STT().deserialize(msg);
        }

    }

    return { connectWs }
}