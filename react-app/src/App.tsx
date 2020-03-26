import React from 'react';
import { Layout } from 'antd';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase, AuthGate } from '@kbase/ui-components';

import './App.css';
import HomeRedux from './pages/HomeRedux';

const { Content } = Layout;
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
                            <Layout style={{ minHeight: '100vh' }}>
                                <Content style={{ backgroundColor: 'white' }}>
                                    <HomeRedux />
                                </Content>
                            </Layout>
                        </div>
                    </AuthGate>
                </AppBase>
            </Provider>
        );
    }
}

