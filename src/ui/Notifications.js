import notifee, { IOSAuthorizationStatus, EventType } from '@notifee/react-native';

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
    notifee.onBackgroundEvent(({ type }) => {
        if (type === EventType.PRESS) {
            notifee.cancelNotification('progressNotification');
        }
    });
};

export const displayNotification = async (notificationTitle, notificationText, type, progress) => {
    const channelId = await notifee.createChannel({
        id: 'uploadChannel',
        name: 'Upload channel',
    });
    if (progress !== 100) {
        if (type === 'PROGRESS') {
            console.log('displaying upload progress');
            await notifee.displayNotification({
                title: notificationTitle,
                id: 'progressNotification',
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
            await notifee.displayNotification({
                title: notificationTitle,
                id: 'progressNotification',
                android: {
                    channelId,
                    progress: {
                        max: 100,
                        current: 100,
                    },
                },
            });
            await notifee.displayNotification({
                id: 'progressNotification',
                title: notificationTitle,
                body: notificationText,
                android: {
                    channelId,
                },
            });
            console.log('displaying upload complete #2');
        }
    }
};