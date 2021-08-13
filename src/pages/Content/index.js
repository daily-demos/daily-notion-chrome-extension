import React from 'react';
import ReactDOM from 'react-dom';
import { CallProvider } from './contexts/CallProvider';
import Main from './components/Main';

class App extends React.Component {
  render() {
    return (
      <CallProvider>
        <Main />
      </CallProvider>
    );
  }
}

const app = document.createElement('div');
app.id = 'daily-collab-root';
document.body.prepend(app);
ReactDOM.render(<App />, app);
