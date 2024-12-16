// ** Router Import
import Router from './router/Router'
import { useEffect } from 'react'
import { messaging } from '../src/views/components/firebase/firebase-messaging-sw';
import { onMessage } from 'firebase/messaging';
const App = props => {

    // useEffect(() => {
    //     onMessage(messaging, (payload) => {
    //         if ('serviceWorker' in navigator) {
    //             navigator.serviceWorker.register('../firebase-messaging-sw.js')
    //                 .then(function (registration) {
    //                     const notificationTitle = payload.notification.title;
    //                     const notificationOptions = {
    //                         body: payload.notification.body,
    //                         icon: payload.notification.image,
    //                     };

    //                     registration.showNotification(notificationTitle, notificationOptions);
    //                 }).catch(function (err) {
    //                     console.log('Service worker registration failed, error:', err);
    //                 });
    //         }

    //     });
    // }, [])

    return (
        <>
            <Router />
        </>
    )
}

export default App
