import React from 'react';
import { Layout } from 'antd';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase, AuthGate } from '@kbase/ui-lib';

import './App.css';
import HomeRedux from './pages/HomeRedux';

const { Content } = Layout;
const store = createReduxStore();
interface AppProps {}
interface AppState {}

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AppBase>
                <AuthGate required={true}>
                    <div className="App">
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
};

export default App;
