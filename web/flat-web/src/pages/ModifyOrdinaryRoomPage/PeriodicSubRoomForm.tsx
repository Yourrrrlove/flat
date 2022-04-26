import { message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import {
    EditRoomFormInitialValues,
    EditRoomFormValues,
    LoadingPage,
    errorTips,
} from "flat-components";
import { periodicSubRoomInfo, updatePeriodicSubRoom } from "@netless/flat-server-api";
import EditRoomPage from "../../components/EditRoomPage";
import { useSafePromise } from "../../utils/hooks/lifecycle";

/**
 * TODO: we forget set i18n in current file!!!
 */

export interface PeriodicSubRoomFormProps {
    roomUUID: string;
    periodicUUID: string;
}

export const PeriodicSubRoomForm = observer<PeriodicSubRoomFormProps>(function RoomForm({
    roomUUID,
    periodicUUID,
}) {
    const [isLoading, setLoading] = useState(false);

    const history = useHistory();
    const sp = useSafePromise();

    const [initialValues, setInitialValues] = useState<EditRoomFormInitialValues>();
    const [previousPeriodicRoomBeginTime, setPreviousPeriodicRoomBeginTime] = useState<
        number | null
    >(0);
    const [nextPeriodicRoomEndTime, setNextPeriodicRoomEndTime] = useState<number | null>(0);
    useEffect(() => {
        sp(
            periodicSubRoomInfo({
                roomUUID,
                periodicUUID,
                needOtherRoomTimeInfo: true,
            }),
        )
            .then(({ roomInfo, previousPeriodicRoomBeginTime, nextPeriodicRoomEndTime }) => {
                setInitialValues({
                    title: roomInfo.title,
                    type: roomInfo.roomType,
                    beginTime: new Date(roomInfo.beginTime),
                    endTime: new Date(roomInfo.endTime),
                    isPeriodic: false,
                    region: roomInfo.region,
                });
                setPreviousPeriodicRoomBeginTime(previousPeriodicRoomBeginTime);
                setNextPeriodicRoomEndTime(nextPeriodicRoomEndTime);
            })
            .catch(e => {
                console.error(e);
                errorTips(e);
                history.goBack();
            });
        // Only listen to roomUUID
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomUUID, periodicUUID]);

    if (!initialValues) {
        return <LoadingPage />;
    }

    return (
        <EditRoomPage
            initialValues={initialValues}
            loading={isLoading}
            nextPeriodicRoomEndTime={nextPeriodicRoomEndTime}
            previousPeriodicRoomBeginTime={previousPeriodicRoomBeginTime}
            type="periodicSub"
            onSubmit={editPeriodicSubRoom}
        />
    );

    async function editPeriodicSubRoom(values: EditRoomFormValues): Promise<void> {
        setLoading(true);

        try {
            await sp(
                updatePeriodicSubRoom({
                    roomUUID: roomUUID,
                    periodicUUID: periodicUUID,
                    beginTime: values.beginTime.valueOf(),
                    endTime: values.endTime.valueOf(),
                }),
            );
            void message.success("修改成功");
            history.goBack();
        } catch (e) {
            console.error(e);
            errorTips(e);
            setLoading(false);
        }
    }
});
