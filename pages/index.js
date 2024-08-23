import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { styleReset } from "react95";
import { ZIndexProvider, useZIndex } from "../contexts/ZIndexContext";
import candy from "react95/dist/themes/candy";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import styled from "styled-components";
import { ScrollView, Window } from "react95";
import { IsMobileProvider, useIsMobile } from "@/contexts/isMobileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import AudioPlayer from "@/components/AudioPlayer";
import SongHistory from "@/components/SongHistory";
import NextSong from "@/components/NextSong";
import ListenerCount from "@/components/ListenerCount";
import SubmitSong from "@/components/SubmitSong";
import TopBar from "@/components/TopBar";

// Global Styles with scanline effect
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
    background-color: ${({ theme }) => theme.headerBackground};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

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
    z-index: 1000;
    pointer-events: none;
  }
`;

const RadioTitle = styled.h1`
  font-size: 5rem;
  margin: 0;
  text-align: right;
  flex-grow: 1;
  color: ${({ theme }) => theme.tooltip};
  text-shadow:
    1px 1px 0 #fff,
    2px 2px 0 #ccc,
    3px 3px 0 #999,
    4px 4px 0 #666;
  width: 100%;
  margin-right: 20px;
`;

const ContentContainer = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 40px);
  box-sizing: border-box;
`;

const MobileScrollView = styled(ScrollView)`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
`;

const TopBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

export default function Home() {
  const isMobile = useIsMobile();

  const Content = () => (
    <>
      <TopBarContainer>
        <TopBar />
      </TopBarContainer>
      <ContentContainer>
        <RadioTitle>AL Radio</RadioTitle>
        <ListenerCount />
        <AudioPlayer />
        <NextSong />
        <SubmitSong />
        <SongHistory />
      </ContentContainer>
    </>
  );

  return (
    <>
      <ThemeProvider>
        <GlobalStyles />
        <IsMobileProvider>
          <ZIndexProvider>
            {isMobile ? (
              <Window>
                <MobileScrollView>
                  <Content />
                </MobileScrollView>
              </Window>
            ) : (
              <Content />
            )}
          </ZIndexProvider>
        </IsMobileProvider>{" "}
      </ThemeProvider>
    </>
  );
}
