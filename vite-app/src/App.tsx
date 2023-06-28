import { AppBase, AuthGate } from '@kbase/ui-components';
import { ConfigProvider } from 'antd';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';

import './App.css';
import './antd.css';
import HomeRedux from './pages/HomeRedux';

const store = createReduxStore();

/*
 '@primary-color': '#1064b3',           // primary color for all components
'@link-color': '@primary-color',                     // link color
//    '@success-color': '#3c763',                         // success state color
//    '@warning-color': '#fcf8e3',                         // warning state color
//    '@error-color': '#a94442',              // error state color
'@font-size-base': '14px',                           // major text font size
'@heading-color': 'rgba(0,0,0,0.85)',                // heading text color
'@text-color': 'rgba(0, 0, 0, 1.0)',                 // major text color
'@text-color-secondary': 'rgba(0, 0, 0. 0.45)',      // secondary text color
'@disabled-color': 'rgba(0, 0, 0, 0.25)',            // disable state color
'@border-radius-base': '4px',                        // major border radius
'@border-color-base': '#d9d9d9',                     // major border color
'@box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',  // major shadow for layers
'@border-color-split': 'hsv(0, 0, 80%)'
*/
export default class App extends Component {
    render() {
        return (
            <ConfigProvider theme={{ token: { colorPrimary: "#1064b3", fontSize: 14 } }}>
                <Provider store={store}>
                    <AppBase>
                        <AuthGate required={true}>
                            <div className='App ReactProfileView'>
                                <HomeRedux />
                            </div>
                        </AuthGate>
                    </AppBase>
                </Provider>
            </ConfigProvider>
        );
    }
}
