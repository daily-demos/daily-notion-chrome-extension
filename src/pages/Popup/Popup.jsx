import React from 'react';
import logo from '../../assets/img/logo.svg';
import theme from '../Content/theme';

const Popup = () => {
  return (
    <div className="container">
      <header>
        <h1>About this extension</h1>
        <a
          href="https://www.daily.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} alt="logo" />
        </a>
      </header>
      <p>
        Use this demo extension from <span>Daily</span> to start video and
        audio-only calls right in your Notion workspace.
      </p>
      <p>
        Authorize the Notion API to enable the transcription feature.
        Transcriptions are added to the bottom of the Notion page being
        currently viewed when transcription is in progress.
      </p>
      <p>
        If you installed the extension after opening the Notion doc, be sure to
        refresh your page.
      </p>
      <style jsx>{`
        .container {
          width: 290px;
          padding: 16px;
        }
        .container header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .container header img {
          width: 40px;
        }
        .container h1,
        .container h2 {
          font-size: ${theme.fontSize.base};
          color: ${theme.colors.darkOrange};
          line-height: 17px;
          margin: 0;
          font-weight: 500;
        }
        span {
          font-weight: bold;
          text-decoration: none;
          color: ${theme.colors.darkOrange};
        }
      `}</style>
    </div>
  );
};

export default Popup;
