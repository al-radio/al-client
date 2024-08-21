import React from "react";
import {
  styleReset,
  ScrollView,
  WindowHeader,
  WindowContent,
  Window,
} from "react95";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import styled from "styled-components";
import candy from "react95/dist/themes/candy";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

import AudioPlayer from "@/components/AudioPlayer";
import SongHistory from "@/components/SongHistory";
import NextSong from "@/components/NextSong";
import ListenerCount from "@/components/ListenerCount";
import SubmitSong from "@/components/SubmitSong";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }

  body {
    background-color: #C25F9C;
  }

    /* Scanline effect */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05) 1px,
      rgba(255, 255, 255, 0.1) 1px,
      rgba(255, 255, 255, 0.1) 2px
    );
    z-index: 10; /* Ensure it is above the body but below the content */
    pointer-events: none; /* Allow interaction with underlying content */
  }
`;

const Container = styled(Window)`
  width: 500px;
  height: 750px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  @media (max-height: 750px) {
    height: 100%;
  }

  @media (max-width: 500px) {
    width: 100%;
    height: 100%;
  }
`;

// prevent horizontal scrolling, even when the content is too wide
const StyledScrollView = styled(ScrollView)`
  height: calc(100% - 30px);
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export default function Home() {
  return (
    <div>
      <GlobalStyles />
      <ThemeProvider theme={candy}>
        <Container>
          <WindowHeader>AL Radio</WindowHeader>
          <StyledScrollView>
            <ListenerCount />
            <AudioPlayer />
            <NextSong />
            <SubmitSong />
            <SongHistory />
          </StyledScrollView>
        </Container>
      </ThemeProvider>
    </div>
  );
}
