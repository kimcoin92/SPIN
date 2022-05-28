// 즉시 호출 함수
(() => {



    //  ########################################################
    //  #                     초기화 세팅                      #
    //  ########################################################


    
    let yOffset                     = 0;
    let sectionYOffset              = 0;
    let currentSection              = 0;

    let introFadeOutTimer           = null;
    let introTransTimer             = null;

    let introTransLength            = 0;
    let introTranslateValue1        = 0;
    let introTranslateValue2        = 0;

    let introOpacityValue           = 0;



    //  ########################################################
    //  #                       세팅 값                        #
    //  ########################################################


    
    // 메뉴 섹션

    let sectionSet = [

        // 인트로 섹션
        {

            height           : 0,
            heightMultiply   : 1.5,

            objects: {

                container          : document.querySelector('#section-0'),
                introElement1_text : document.querySelector('#section-0 #box1'),
                introElement2_text : document.querySelector('#section-0 #box2'),
                videoElement       : document.querySelector('.background-video')

            }

        },

        // 번호 조회 섹션
        {

            height         : 0,
            heightMultiply : 1.5,

            objects: {

                container           : document.querySelector('#section-1'),

                resultElement1_text : document.querySelector('#section-1 #text1'),
                resultElement2_text : document.querySelector('#section-1 #text2'),
                resultElement3_box  : document.querySelector('#section-1 #box1'),

            },

            values: {

                resultElement1_OpacityOut    : [0, 1, {start: 0.05, end: 0.15}],
                resultElement1_TranslateOut  : [0, -10, {start: 0.05, end: 0.15}],
 
            }

        },

        // 번호 생성 섹션
        {

            height         : 0,
            heightMultiply : 1.5,

            objects: {

                container               : document.querySelector('#section-2'),
                generateElement1_text   : document.querySelector('#section-2 #text1'),
                generateElement2_text   : document.querySelector('#section-2 #text2'),
                generateElement3_button : document.querySelector('#section-2 #button-Generate'),
                generateElement4_list   : document.querySelector('#section-2 #number-List')

            },

            values: {

                generateElement1_OpacityOut    : [0, 1, {start: 0.1, end: 0.15}],
                generateElement1_TranslateOut  : [0, -10, {start: 0.1, end: 0.15}],
                generateElement2_OpacityOut    : [0, 1, {start: 0.1, end: 0.2}],
                generateElement2_TranslateOut  : [0, -10, {start: 0.1, end: 0.2}],
                generateElement3_OpacityOut    : [0, 1, {start: 0.2, end: 0.25}],
                generateElement3_TranslateOut  : [0, -10, {start: 0.2, end: 0.25}],
                generateElement4_OpacityOut    : [0, 1, {start: 0.25, end: 0.2}],
                generateElement4_TranslateOut  : [0, -10, {start: 0.25, end: 0.2}],
 
            }

        },

        // 문의 섹션
        {

            height         : 0,
            heightMultiply : 1.5,

            objects: {

                container  : document.querySelector('#section-3')

            },

            values: {

                generateElement1_OpacityOut    : [0, 1, {start: 0.1, end: 0.2}],
                generateElement1_TranslateOut  : [0, -10, {start: 0.1, end: 0.2}],
 
            }

        }

    ];



    //  ########################################################
    //  #                        함 수                         #
    //  ########################################################



    // 페이지 시작 호출
    const initHTMLPage = function() {

        initSectionSet();
        getCurrentSection();

        playIntro();

    }

    // 섹션 별 페이지 길이 보정
    const initSectionSet = function() {

        for (let i = 0; i < sectionSet.length; i++) {

            sectionSet[i].height = window.innerHeight * sectionSet[i].heightMultiply; 
            sectionSet[i].objects.container.style.height = `${sectionSet[i].height}px`;

        }

    }

    // 현재 화면 상 표시된 섹션을 도출
    const getCurrentSection = function() {

        let result = 0;

        if (yOffset <= sectionSet[0].height) {

            result = 0;

        } else if ((yOffset > sectionSet[0].height) && (yOffset <= sectionSet[0].height + sectionSet[1].height)) {

            result = 1;

        } else if ((yOffset > sectionSet[0].height + sectionSet[1].height) && (yOffset <= sectionSet[0].height + sectionSet[1].height + sectionSet[2].height)) {

            result = 2;

        } else if (yOffset > sectionSet[0].height + sectionSet[1].height + sectionSet[2].height) {

            result = 3;

        }

        return result;
        
    }

    // 이전 세션의 높이 도출
    const getPrevSectionHeight = function() {

        let result = 0;

        for (let i = 0; i < currentSection; i++) {

            result = result + sectionSet[i].height;

        }

        return result;

    };

    // 반응형 애니메이션을 위한 범위 계산
    const calcValue = function(values) {
        
        let result         = 0;
        let rate           = 0;
        
        let partStart      = 0;
        let partEnd        = 0;
        let partHeight     = 0;

        const range = values[1] - values[0];
        const sectionHeight = sectionSet[currentSection].height;

        if (values.length === 3) {

            partStart = sectionHeight * values[2].start;
            partEnd = sectionHeight * values[2].end;
            partHeight = partEnd - partStart;

            if ((sectionYOffset >= partStart) && (sectionYOffset <= partEnd)) {

                rate = (sectionYOffset - partStart) / partHeight;
                result = (rate * range) + values[0];               

            } else if (sectionYOffset < partStart) {

                result = values[0];

            } else if (sectionYOffset > partEnd) {

                result = values[1];

            }
            
        } else {
            
            rate = sectionYOffset / sectionHeight;
            result = (range * rate) + values[0];
      
        }

        return result;

    }

    // 생성 버튼을 누르면 1개씩 짧은 시간동안 무작위 번호 출력, 생성버튼이 정지버튼으로 변경
    // 정지 버튼을 누르면 무작위 번호 정지, 다음 번호 무작위 출력 6번 반복

    let ball      = [];
    let result    = [];
    let remainIdx = 44;

    // 번호 무작위 생성
    const getBallNumber = function() {

        for (let i = 0; i < 45; i++) {

            ball[i] = (i + 1);

        }

        idx = Math.floor(Math.random() * remainIdx)

        result = ball[idx];

        // for (let k = 0; k < 6; k++) {



        //     result.push(sectionSet[2].balls[idx]);

        //     ball.splice(idx, 1);
        //     remainIdx--;

        // };

        // result.sort(function (a, b) {

        //     return a - b;

        // });

        return result;

    };



    // 인트로 텍스트 등장 효과
    const playIntroOpacity = function() {

        if (introOpacityValue < 1) {

            sectionSet[0].objects.introElement1_text.style.opacity = `${introOpacityValue}`;
            sectionSet[0].objects.introElement2_text.style.opacity = `${introOpacityValue}`;
            sectionSet[0].objects.videoElement.style.opacity       = `${introOpacityValue}`;

            introOpacityValue += 0.025;

        } else {

            introOpacityValue = 1;

            sectionSet[0].objects.introElement1_text.style.opacity = `${introOpacityValue}`;
            sectionSet[0].objects.introElement2_text.style.opacity = `${introOpacityValue}`;
            sectionSet[0].objects.videoElement.style.opacity       = `${introOpacityValue}`;

            clearInterval(introFadeOutTimer);

            introFadeOutTimer = null;

            introOpacityValue = 0;

            return;

        };

    };

    // 인트로 텍스트 이동 효과
    const playIntroTranslate = function() {

        if (introTransLength < 1) {

            sectionSet[0].objects.introElement1_text.style.transform = `translateX(${introTranslateValue1}px)`
            sectionSet[0].objects.introElement2_text.style.transform = `translateX(${introTranslateValue2}px)`

            introTransLength += 0.025;

            introTranslateValue1 -= 0.5;
            introTranslateValue2 += 0.5;

        } else {

            sectionSet[0].objects.introElement1_text.style.transform = `translateX(${introTranslateValue1}px)`
            sectionSet[0].objects.introElement2_text.style.transform = `translateX(${introTranslateValue2}px)`

            clearInterval(introTransTimer);

            introTransTimer = null;

            introTransLength = 0;
            introTranslateValue1 = 0;
            introTranslateValue2 = 0;

            return;

        };

    };

    // 인트로 애니메이션 트리거
    const playIntro = function() {

        introFadeOutTimer                = setInterval(playIntroOpacity, 20);
        introTransTimer                  = setInterval(playIntroTranslate, 20);

    };

    // 스크롤 반응 애니메이션
    const playScroll = function() {

        let opacityValue = 0;
        let translateValue = 0;

        let that = sectionSet[currentSection];

        const offsetRate = sectionYOffset / that.height;

        switch(currentSection)
        {
            case 0 :
                
            break;

            case 1 :

                if (offsetRate > 0.05 && offsetRate < 0.15) {

                    opacityValue = calcValue(that.values.resultElement1_OpacityOut);
                    translateValue = calcValue(that.values.resultElement1_TranslateOut);

                    that.objects.resultElement3_box.style.opacity = `${opacityValue}`;
                    that.objects.resultElement3_box.style.transform = `translateY(${translateValue}px)`;

                } else if (offsetRate > 0.15) {

                    that.objects.resultElement3_box.style.opacity = `1`;

                } else {

                    that.objects.resultElement3_box.style.opacity = `0`;

                };
                
            break;
    
            case 2 :
                
            break;

            case 3 :

            break;
    
        }
        
    }



    //  ########################################################
    //  #                    이벤트 핸들러                     #
    //  ########################################################



    const numberItem      = document.createElement('div');
    const numberText      = document.createElement('span');
    const buttonStop      = document.createElement('button');
    const buttonDelete    = document.createElement('button');

    // 생성 버튼
    sectionSet[2].objects.generateElement3_button.addEventListener('click', () => {

        numberText.textContent = setInterval(getBallNumber, 100);

        sectionSet[2].objects.generateElement4_list.appendChild(numberItem);
        sectionSet[2].objects.generateElement4_list.appendChild(numberText);

        buttonStop.textContent = '정지';
        sectionSet[2].objects.generateElement4_list.appendChild(buttonStop);

        buttonDelete.textContent = '삭제';
        sectionSet[2].objects.generateElement4_list.appendChild(buttonDelete);

    });

    buttonStop.addEventListener('click', () => {

        clearInterval(numberText);

    });

    const scrollLoop = function() {

        playScroll();

    }

    // 스크롤 반응
    window.addEventListener('scroll', () => {

        scrollLoop();

        currentSection    = getCurrentSection();
        prevSectionHeight = getPrevSectionHeight();

        yOffset           = window.scrollY + (window.innerHeight / 2);
        sectionYOffset    = yOffset - prevSectionHeight;

    });



    //  ########################################################
    //  #                        호 출                         #
    //  ########################################################

    window.addEventListener('load', () => {

        initHTMLPage();

    });

})();