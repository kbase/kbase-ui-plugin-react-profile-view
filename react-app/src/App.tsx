import React from 'react';
import { Layout } from 'antd';
import { Provider } from 'react-redux';
import { createReduxStore } from "./redux/store";
import { AppBase, DevWrapper } from "@kbase/ui-lib";
// import store from './redux/store_basic';
import './App.css';
import HomeRedux from './pages/HomeRedux';
const { Content } = Layout;
const store = createReduxStore();
interface AppProps {}
interface AppState {}

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <DevWrapper>
                <AppBase>
                    <div className="App">
                        <Layout style={{ minHeight: '100vh' }}>
                            <Content style={{ backgroundColor: 'white' }}>
                                <HomeRedux />
                            </Content>
                        </Layout>
                    </div>
                </AppBase>
            </DevWrapper>
        </Provider>
    );
}

export default App;
