import React from 'react';
import { Layout } from 'antd';
import { Provider } from 'react-redux';
import store from './redux/store_basic';
import './App.css';
import HomeRedux from './pages/HomeRedux';
const { Content } = Layout;


const App: React.FC = () => {
    return (
        <Provider store={store}>
            <div className="App">
                <Layout style={{ minHeight: '100vh' }}>
                    <Content style={{ backgroundColor: 'white' }}>
                        <HomeRedux />
                    </Content>
                </Layout>
            </div>
        </Provider>
    );
}

export default App;
