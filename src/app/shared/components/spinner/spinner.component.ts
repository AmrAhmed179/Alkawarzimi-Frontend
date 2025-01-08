import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  template: `
    <div class="spinnerContainer">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .spinnerContainer {
        position: fixed;
        z-index: 10000;
        width: 100%;
        height: 100%;
        background-color: #0000003b;
        top: 0px;
        left: 0px;
      }
      .spinner {
        margin: 50vh auto;
        width: 150px;
        height: 100px;
        text-align: center;
        font-size: 10px;
      }

      .spinner > div {
        background-color: #c36310;
        height: 100%;
        width: 15px;
        display: inline-block;

        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
      }

      .spinner .rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
      }

      .spinner .rect3 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
      }

      .spinner .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
      }

      .spinner .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
      }

      @-webkit-keyframes sk-stretchdelay {
        0%,
        40%,
        100% {
          -webkit-transform: scaleY(0.4);
        }
        20% {
          -webkit-transform: scaleY(1);
        }
      }

      @keyframes sk-stretchdelay {
        0%,
        40%,
        100% {
          transform: scaleY(0.4);
          -webkit-transform: scaleY(0.4);
        }
        20% {
          transform: scaleY(1);
          -webkit-transform: scaleY(1);
        }
      }
    `,
  ],
})
export class SpinnerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
