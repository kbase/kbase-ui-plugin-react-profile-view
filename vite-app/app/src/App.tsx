import { AppBase, AuthGate } from '@kbase/ui-components';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';

import './App.css';
import './antd.css';
import HomeRedux from './pages/HomeRedux';

const store = createReduxStore();


export default class App extends Component {
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
