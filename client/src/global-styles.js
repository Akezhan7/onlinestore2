import { createGlobalStyle } from "styled-components";

import loadingimg from "./assets/svg/loading.svg";
import Bgimg from "./assets/acc0a5f66f51646bef80a30539a81411.jpg";

export default createGlobalStyle`

  :root{
    font-size:15px
  }

  * {
    margin:0;
    padding:0;
    box-sizing:border-box;
  }
  
  body {
      height:var(--vh);
      overflow:hidden;
      background: url(${Bgimg});
      background-repeat: no-repeat;
      background-size: cover;
    }
    html{
      overflow:hidden;
   
    }
  #root{
    height:100%
  }
  li {
      list-style:none
    }

  a {
      color:inherit;
      text-decoration:none;
    }

  .icon, .icon-label {
      display:flex;
      height:100%;
      align-items:center;
      justify-content:center;
    }
  
  button {
      outline:none;
      box-shadow:none;
      border:none;
      cursor:pointer;
      background:transparent;

      color:inherit;
      text-transform:inherit;
      font-size:inherit;
    }
    .button-muted{
      user-select:none
    }
  .button{  
      height:38px;
      display:flex;
      align-items:center;
      justify-content:center;
      width:fit-content;
      padding:0 20px;
      background:#000;
      color:#fff;
      font-weight:bold;
      font-size:0.8rem;
      text-transform:uppercase;
      font-variant:small-caps;
      cursor:pointer;
  
     position:relative;
    }
    .button.loading{
      text-indent:-9999px;
      background:#ccc !important;
    }
    .button:after{
      background:url(${loadingimg});
      background-size:contain;
      background-position:center;
      background-repeat:no-repeat;
      content:"";
      width:40%;
      height:100%;
      position:absolute;
      top:0;
      display:none;
    }
    .button.loading:after{
    display:block
    }

  .button:disabled{
    background:#ccc !important;
    color:#888;
    font-weight:bold;
  }

 .input-wrapper {
  position: relative;
 }
  .error {
    color: red;
    font-size: 13px;
    text-transform: capitalize;
  }

  input {
    width: 100%;
    height: 40px;
    padding: 10px;
    font-family: "Satoshi", sans-serif;
    border: 1px solid #ccc;
    border-radius: none;
    position: relative;
    box-shadow:none;
  }

  .input-wrapper input::placeholder {
    font-family: "Satoshi", sans-serif;
    text-transform: capitalize;
  }
    .fullscreen-video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.fullscreen-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  width: 100%;
  bottom: 0px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: white;
  font-size: 24px;
}
  .overlay2 {
  position: absolute;
  width: 100%;
  top: 50%;
  text-align: center;
  font-size: 24px;
  padding-bottom: 20px;
  color: black;
  font-family: "Noto Sans JP", sans-serif !important;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}
  .containernewed {
    max-width: 1412px;
    margin: 0 auto;
     padding: 110px 20px 0 20px;
  }
      .footer {
        width: 100% !important;
    }

  @media (min-width:1024px){
    :root{
      font-size:16px
    }
  }
      @media (max-width:500px){
     .containernewed {
     padding: 55px 20px 0 20px;
  }
  }
  `;
