import notifee, { IOSAuthorizationStatus, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

export const requestNotificationPermission = async () => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= IOSAuthorizationStatus.AUTHORIZED) {
        console.log('Permissions: IOSAuthorizationStatus.AUTHORIZED');
    } else {
        console.log('User declined permissions');
    }
};

export const setUpNotificationsEventListeners = () => {
    notifee.onForegroundEvent(({ type }) => {
        if (type === EventType.PRESS) {
            notifee.cancelNotification('progressNotification');
        }
    });
    notifee.onBackgroundEvent(async ({ type }) => {
        if (type === EventType.PRESS) {
            notifee.cancelNotification('progressNotification');
        }
    });
};

export const displayNotification = async ({
    title, text, type, progress,
}) => {
    const channelId = await notifee.createChannel({
        id: 'uploadChannel',
        name: 'Upload channel',
    });
    const id = 'progressNotification';
    if (progress !== 100) {
        if (type === 'PROGRESS') {
            console.log('displaying upload progress');
            await notifee.displayNotification({
                title,
                id,
                android: {
                    channelId,
                    progress: {
                        max: 100,
                        current: progress,
                    },
                },
            });
            console.log('displaying upload progress #2');
        } else {
            console.log('displaying upload complete');
            if (Platform.OS === 'android') {
                await notifee.displayNotification({
                    title,
                    id,
                    android: {
                        channelId,
                        progress: {
                            max: 100,
                            current: 100,
                        },
                    },
                });
            }
            await notifee.displayNotification({
                id,
                title,
                body: text,
                android: {
                    channelId,
                },
            });
            console.log('displaying upload complete #2');
        }
    }
};
