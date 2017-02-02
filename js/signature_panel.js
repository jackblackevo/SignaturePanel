window.addEventListener('DOMContentLoaded', function () {
  'use strict'
  var mainCanvas = document.getElementById('mainCanvas');
  var mainCanvasContext = mainCanvas.getContext('2d');
  /** 是否繪圖的 flag */
  var isDrawing = false;

  var cleanCanvasBtn = document.getElementById('cleanCanvasBtn');
  var getCanvasImgBtn = document.getElementById('getCanvasImgBtn');

  /**
   * 開始繪圖
   * @param {Object} event 事件物件
   */
  function startDrawing(event) {
    event.preventDefault();

    if (checkPopupOpen()) {
      return;

    }

    isDrawing = true;

    var targetCanvas = event.target;
    var targetCanvasContext = targetCanvas.getContext('2d');

    targetCanvasContext.beginPath();

    var eventType = event.type;

    if (eventType === 'touchstart') {
      targetCanvasContext.moveTo(event.touches.item(0).pageX - targetCanvas.offsetLeft, event.touches.item(0).pageY - targetCanvas.offsetTop);
    } else {
      targetCanvasContext.moveTo(event.pageX - targetCanvas.offsetLeft, event.pageY - targetCanvas.offsetTop);

    }

  }

  /**
   * 檢查是否超出 Canvas 範圍
   * @param {Object} event 事件物件
   */
  function checkIsOverRegion(event) {
    var targetCanvas = event.target;
    var targetCanvasRect = event.target.getBoundingClientRect();

    var eventClientX = !isNaN(event.clientX) ? event.clientX : event.touches.item(0).clientX;
    var eventClientY = !isNaN(event.clientY) ? event.clientY : event.touches.item(0).clientY;

    var nowUserPositionX = eventClientX - targetCanvasRect.left;
    var nowUserPositionY = eventClientY - targetCanvasRect.top;

    return ((nowUserPositionX < 0 || nowUserPositionX > targetCanvas.width) || (nowUserPositionY < 0 ||
      nowUserPositionY > targetCanvas.height));

  }

  /**
   * 清除 Canvas
   * @param {Object} targetCanvas 目標 Canvas
   */
  function cleanCanvas(targetCanvas) {
    var targetCanvasContext = targetCanvas.getContext('2d');
    targetCanvasContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  }

  /**
   * 停止繪圖
   */
  function stopDrawing() {
    isDrawing = false;

  }

  /**
   * 清除並停止繪圖
   * @param {Object} event 事件物件
   */
  function cleanAndStopDrawing(event) {
    event.preventDefault();

    var targetCanvas = event.target;

    if (checkIsOverRegion(event) && isDrawing) {
      alert('請於白色方框內簽名！');
      cleanCanvas(targetCanvas);
      stopDrawing();

    }


  }

  /**
   * 執行繪圖
   * @param {Object} event 事件物件
   */
  function draw(event) {
    cleanAndStopDrawing(event);

    if (isDrawing) {
      var targetCanvas = event.target;
      var targetCanvasContext = targetCanvas.getContext('2d');

      var eventType = event.type;
      var x;
      var y;

      if (eventType === 'touchmove') {
        x = event.touches.item(0).pageX - targetCanvas.offsetLeft;
        y = event.touches.item(0).pageY - targetCanvas.offsetTop;

      } else {
        x = event.pageX - targetCanvas.offsetLeft;
        y = event.pageY - targetCanvas.offsetTop;

      }


      targetCanvasContext.lineTo(x, y);
      targetCanvasContext.stroke();

    }

  }

  /**
   * 檢查 fancybox 是否開啟
   */
  function checkPopupOpen() {
    return $.fancybox.isOpen;

  }

  /**
   * 顯示提示 fancybox
   */
  function showPopup() {
    if (!checkPopupOpen()) {
      // if (screen.orientation.type === 'portrait-primary') {
      $.fancybox.open({
        href: '#msg',
        type: 'inline',
        height: '30',
        width: '30',
        autoSize: false,
        closeBtn: false,
        scrollOutside: false,
        helpers: {
          overlay: {
            closeClick: false
          }
        }
      });

    } else {
      $.fancybox.close();

    }

  }

  /**
   * 檢查是否為橫式螢幕
   */
  function checkIsLandscape() {
    var query = window.matchMedia('(orientation:landscape)');
    return query.matches;

  }

  // 加入事件處理
  mainCanvas.addEventListener('mousedown', startDrawing);
  mainCanvas.addEventListener('mouseup', stopDrawing);
  mainCanvas.addEventListener('mouseout', cleanAndStopDrawing);
  mainCanvas.addEventListener('mousemove', draw);

  mainCanvas.addEventListener('touchstart', startDrawing);
  mainCanvas.addEventListener('touchend', stopDrawing);
  mainCanvas.addEventListener('touchmove', draw);

  cleanCanvasBtn.addEventListener('click', function () {
    cleanCanvas(mainCanvas);

  });
  getCanvasImgBtn.addEventListener('click', function () {
    var downloadUrl = mainCanvas.toDataURL("image/png");

    var downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'signature.png';

    downloadLink.click();


  });

  window.addEventListener('orientationchange', function () {
    if (!checkIsLandscape()) {
      showPopup();

    } else {
      $.fancybox.close();

    }

  });

  // 頁面載入完畢即檢查螢幕方向
  if (!checkIsLandscape()) {
    showPopup();

  }

  // 將 Canvas 背景填滿白色
  mainCanvasContext.fillStyle = 'white';
  mainCanvasContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

});