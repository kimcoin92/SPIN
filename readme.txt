2022년 07월 23일
- index.html : section-1
  로또 공식 api를 참조한 자동 번호조회 업데이트를 위해 수동 작성 중단

<<<<<<< HEAD
- index.html : section-2
  이전 생성번호 기록을 남기기 위한 리스트 생성

- main.js : getSpin(), effectSpin(), stopSpin()
  번호 생성 기능 재조정 (Spinning 효과 1차 작업)

=======
>>>>>>> 80cefa79ff959c2337982ea5f4299f4d3d7e6ffc
2022년 06월 18일
- main.js : getSpin()
  번호 중복 & 0번 출력 문제 해결 중

2022년 06월 11일
- main.css : section-2
  1019회 당첨 번호 업데이트
- main.js : getBallNumber
  번호 생성 기능 재조정 (Spinning 효과 정지작업)

2022년 05월 28일
- main.js : getBallNumber
  번호 생성 Spinning 효과 (작업 중)

2022년 05월 27일
- main.css : html
  스크롤링 효과 변경, 마우스 커서 링크 접촉 시, 텍스트 입력 아이콘으로 출력되는 버그 수정 (EventHandler → scroll-behavior)
- index.html : background-video
  상세 : 배경영상의 속도를 줄여 시각적 안정성을 확보
         playbackRate를 낯출 시, 30fps 이하의 저 프레임 원본소스는 끊김현상으로 시각적 불편함 발생
         인코딩 문제 해결중 (SVP : SmoothVideo Project - 유료, 기술적 문제)


2022년 05월 26일
- index.html : background-video
  밝은 영상으로 대체
- main.css : html (text-shadow)
  폰트 외곽선 효과 적용


2022년 05월 23일
- main.css : button-Generate
  버튼 디자인 적용 (Source : https://copy-paste-css.com - forem)
- main.css : section-2
  1016회 당첨 번호 업데이트
  번호 색채 적용 (Source : https://dhlottery.co.kr/gameResult.do?method=byWin)


2022년 05월 22일
- main.js
  스크롤형 애니메이션 적용 중 (섹션 별 비율 값 조정 중)


2022년 05월 21일
- index.html : section, div, h1, h2
- main.css : section, div, h1, h2
  id와 class 정리, 가독성 향상
- main.css : global-nav (z-index)
  메뉴바의 블러 이펙트가 인트로 텍스트에 적용되지 않는 버그 수정
- main.css : global-nav
  메뉴바 상부 간격 추가
- main.js : loadCanvasImages
  main.js : drawCanvas
  CanvasContext에 페이드 아웃 애니메이션 적용 실패로 영상형 배경화면으로 변경


2022년 05월 20일
- index.html : background-canvas
- main.js : loadCanvasImages
  main.js : drawCanvas
  배경 캔버스 스크롤형 애니메이션 효과
- index.html : iframe
  iframe의 보안 문제로 인해 Vanilla Javascript를 통한 공식 사이트와의 데이터 연계 문제점 확인
  임시로 매주 수동 업데이트하도록 조치


2022년 05월 19일
- index.html : section-0 (class message-1 → id intro-text1)
  index.html : section-0 (class message-2 → id intro-text2)
  index.html : section-0 (class message)
  main.js : objects
  Opacity 적용 위치 변경. 페이지 시작 시, 텍스트 Stutting 버그 수정


2022년 05월 18일
- index.html : html
  (IBM Plex Sans KR 500 → SF-Pro-Rounded-Black)
  폰트 업데이트


2022년 05월 17일

- index.html : video
  영상 삽입
  
- main.css : background-video
  영상을 페이지 배경으로 고정
  블러 효과 설정

- main.css : background-color
  (background-color : white → black)
  페이지 흰색 테두리 제거를 위해 배경화면 색상 변경

- index.html : global-nav-logo
  (photoshop text color : black → white)
  배경색에 맞춘 로고 텍스트 색상 변경


2022년 05월 16일

- 코드 정리 분류 & 주석 추가


2022년 05월 15일

- global-nav
  메뉴바에 블러 효과 추가

- index.html : head
  (IBM Plex Sans KR 500)
  폰트 변경


2022년 05월 14일

- main.js : playIntro
  main.js : introFadeOut
  인트로 애니메이션 추가 (Interval형 Fade-Out효과)


2022년 05월 13일

- index.html : section-2
  main.js : getLottoNumber
  main.js : inputGenNum.addEventListener
  기본적인 번호 생성 기능을 추가

- 코드 정리 분류 & 주석 추가


2022년 05월 11일

- main.css : section-0
  (flex-direction : default → column)
  크기 변화에 따른 유동적인 수평 조절 업데이트
  
- main.css : global-nav-item
  (margin-right : em → %)
  메뉴 간격 단위를 변경


2022년 05월 09일

- main.css : global-nav
  메뉴바를 고정하여 스크롤에도 이동하지 않도록 적용

- index.html : section-0 ~ section-3
  main.js : sectionSet
  스크롤 반응형 애니메이션 제작을 위해 목적별 섹션을 분류

- index.html : section-0
  인트로 문구 삽입


2022년 05월 07일

- index.html : global-nav-logo
  메뉴 좌측에 로고 삽입

- main.css : global-nav-item
  메뉴 링크 우측으로 정렬

2022년 05월 06일
- 프로젝트 시작
- 초기 계획안 샘플
  Kakao Oven (https://ovenapp.io/project/DBr1y8DhfN2krCxEEoxoFDqvk70yptr2)