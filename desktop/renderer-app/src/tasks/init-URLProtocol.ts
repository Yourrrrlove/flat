import { ipcReceive } from "../utils/ipc";
import { configure } from "mobx";
import { urlProtocolStore } from "../stores/URLProtocolStore";

configure({
    isolateGlobalState: true,
});

const requestJoinRoom = (): void => {
    ipcReceive("request-join-room", ({ roomUUID }) => {
        urlProtocolStore.updateToJoinRoomUUID(roomUUID);
    });
};

export const initURLProtocol = (): void => {
    requestJoinRoom();
};
