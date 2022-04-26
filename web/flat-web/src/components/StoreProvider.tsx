import React, { createContext, FC } from "react";
import { configStore, globalStore, roomStore } from "@netless/flat-stores";
import { pageStore } from "../stores/page-store";

export const GlobalStoreContext = createContext(globalStore);

export const RoomStoreContext = createContext(roomStore);

export const ConfigStoreContext = createContext(configStore);

export const PageStoreContext = createContext(pageStore);

export const StoreProvider: FC = ({ children }) => (
    <GlobalStoreContext.Provider value={globalStore}>
        <ConfigStoreContext.Provider value={configStore}>
            <RoomStoreContext.Provider value={roomStore}>
                <PageStoreContext.Provider value={pageStore}>{children}</PageStoreContext.Provider>
            </RoomStoreContext.Provider>
        </ConfigStoreContext.Provider>
    </GlobalStoreContext.Provider>
);
