import React from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase, AuthGate } from '@kbase/ui-components';

import './App.css';
import './antd.css';
import HomeRedux from './pages/HomeRedux';

const store = createReduxStore();

export interface AppProps {
}

interface AppState {
}

export default class App extends React.Component<AppProps, AppState> {
    render() {
        return (
            <Provider store={store}>
                <AppBase>
                    <AuthGate required={true}>
                        <div className='App ReactProfileView'>
                            <HomeRedux />
                        </div>
                    </AuthGate>
                </AppBase>
            </Provider>
        );
    }
}
