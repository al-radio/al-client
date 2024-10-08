import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { styleReset } from "react95";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import styled from "styled-components";
import { ScrollView, Window } from "react95";
import { IsMobileProvider, useIsMobile } from "@/contexts/isMobileContext";
import { fetchServerStatus } from "@/services/api";
import { AuthProvider } from "@/contexts/AuthContext";

import AudioPlayer from "@/components/windows/AudioPlayer";
import SongHistory from "@/components/windows/SongHistory";
import NextSong from "@/components/windows/NextSong";
import ListenerCount from "@/components/windows/ListenerCount";
import SubmitSong from "@/components/windows/SubmitSong";
import TopBar from "@/components/foundational/TopBar";
import Customize from "@/components/windows/Customize";
import RadioOffline from "@/components/modals/RadioOffline";
import Social from "@/components/windows/Social";
import { LiveDataProvider } from "@/contexts/LiveDataContext";
import { MusicKitProvider } from "@/contexts/MusicKitContext";
import { ProfileProvider } from "@/contexts/ProfilesContext";
import { CustomizationProvider } from "@/contexts/CustomizationContext";

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

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Prevent horizontal scroll */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }

  body {
    background-color: ${({ theme }) => theme.headerBackground};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box; /* Ensure padding and borders are included in width and height */
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
    z-index: 9999;
    pointer-events: none;
  }

  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: ${({ theme }) => theme.materialText};
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

const MobileScrollView = styled(ScrollView)`
  width: 100%; /* Ensure it takes the full width */
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll */
  padding: 0;
  margin: 0;
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
  const [isServerRunning, setIsServerRunning] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await fetchServerStatus();
        setIsServerRunning(true);
      } catch (error) {
        setIsServerRunning(false);
      }
    };
    checkServer();

    const interval = setInterval(async () => {
      checkServer();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const Content = () => (
    <>
      {!isServerRunning ? (
        <RadioOffline />
      ) : (
        <>
          <TopBarContainer>
            <TopBar />
          </TopBarContainer>
          <ContentContainer>
            <RadioTitle>AL Radio</RadioTitle>
            <Social />
            <Customize />
            <ListenerCount />
            <AudioPlayer />
            <NextSong />
            <SubmitSong />
            <SongHistory />
          </ContentContainer>
        </>
      )}
    </>
  );

  return (
    <>
      <ThemeProvider>
        <GlobalStyles />
        <IsMobileProvider>
          <MusicKitProvider>
            <AuthProvider>
              <CustomizationProvider>
                <ProfileProvider>
                  <LiveDataProvider>
                    {isMobile ? (
                      <Window>
                        <MobileScrollView>
                          <Content />
                        </MobileScrollView>
                      </Window>
                    ) : (
                      <Content />
                    )}
                  </LiveDataProvider>
                </ProfileProvider>
              </CustomizationProvider>
            </AuthProvider>
          </MusicKitProvider>
        </IsMobileProvider>
      </ThemeProvider>
    </>
  );
}
