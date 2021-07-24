import 'wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppProviders } from 'context';
import reportWebVitals from './reportWebVitals';
import { loadServer, DevTools } from 'jira-dev-tool';
// 必须在 jira-dev-tool 后引入
import 'antd/dist/antd.less';
import { Profiler } from 'components/profiler';

loadServer(() =>
  ReactDOM.render(
    <React.StrictMode>
      <Profiler id={'RootApp'} phases={['mount']}>
        <AppProviders>
          <DevTools />
          <App />
        </AppProviders>
      </Profiler>
    </React.StrictMode>,
    document.getElementById('root')
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
