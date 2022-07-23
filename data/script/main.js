(() =>
{
    // 윈도우의 가운데를 맞춘 y축 기준 높이
    let yOffset                     = 0

    // 섹션 별 y축 높이
    let sectionYOffset              = 0

    // 현재 섹션의 위치 번호
    let currentSection              = 0

    // 인트로 밝기 조절 인터벌 참조
    let introFadeOutTimer           = null

    // 인트로 위치 조절 인터벌 참조
    let introTransTimer             = null

    // 인트로 이동 효과 시간
    let introTransLength            = 0

    // 인트로 이동 좌표값 시점
    let introTranslateValue1        = 0
    
    // 인트로 이동 좌표값 종점
    let introTranslateValue2        = 0

    // 인트로 밝기값
    let introOpacityValue           = 0

    // 스크롤형 효과를 위한 섹션 분할
    let sectionSet = [

        // 인트로
        {
            height           : 0,
            heightMultiply   : 1.5,
            objects:
            {
                container          : document.querySelector('#section-0'),
                introElement1_text : document.querySelector('#section-0 #box1'),
                introElement2_text : document.querySelector('#section-0 #box2'),
                videoElement       : document.querySelector('.background-video')
            }
        },

        // 번호 조회
        {
            height         : 0,
            heightMultiply : 1.5,
            objects:
            {
                container           : document.querySelector('#section-1'),
                resultElement1_text : document.querySelector('#section-1 #text1'),
                resultElement2_text : document.querySelector('#section-1 #text2'),
                resultElement3_box  : document.querySelector('#section-1 #box1'),
            },
            values:
            {
                resultElement1_OpacityOut    : [0, 1, {start: 0.05, end: 0.15}],
                resultElement1_TranslateOut  : [0, -10, {start: 0.05, end: 0.15}],
            }
        },

        // 번호 생성
        {
            height         : 0,
            heightMultiply : 1.5,
            objects:
            {
                container               : document.querySelector('#section-2'),
                generateElement1_text   : document.querySelector('#section-2 #text1'),
                generateElement2_text   : document.querySelector('#section-2 #text2'),
                generateElement3_button : document.querySelector('#section-2 #button-Generate'),
                generateElement4_result : document.querySelector('#section-2 #number-Result'),
                generateElement5_list   : document.querySelector('#section-2 #number-List'),
            },
            values:
            {
                generateElement1_OpacityOut    : [0, 1, {start: 0.1, end: 0.15}],
                generateElement1_TranslateOut  : [0, -10, {start: 0.1, end: 0.15}],
                generateElement2_OpacityOut    : [0, 1, {start: 0.1, end: 0.2}],
                generateElement2_TranslateOut  : [0, -10, {start: 0.1, end: 0.2}],
                generateElement3_OpacityOut    : [0, 1, {start: 0.2, end: 0.25}],
                generateElement3_TranslateOut  : [0, -10, {start: 0.2, end: 0.25}],
                generateElement4_OpacityOut    : [0, 1, {start: 0.25, end: 0.2}],
                generateElement4_TranslateOut  : [0, -10, {start: 0.25, end: 0.2}],

                ball            : [],
                wonBall         : [],
                wonIdx          : 0,
                ballCount       : 45,
                spinFlag        : false
            }
        },
        {
            height         : 0,
            heightMultiply : 1.5,
            objects:
            {
                container  : document.querySelector('#section-3')
            },
            values:
            {
                generateElement1_OpacityOut    : [0, 1, {start: 0.1, end: 0.2}],
                generateElement1_TranslateOut  : [0, -10, {start: 0.1, end: 0.2}]
            }
        }
    ]
    const initHTMLPage = function()
    {
        initSectionSet()
        getCurrentSection()
        playIntro()
    }
    const initSectionSet = function()
    {
        for (let i = 0; i < sectionSet.length; i++)
        {
            sectionSet[i].height = window.innerHeight * sectionSet[i].heightMultiply
            sectionSet[i].objects.container.style.height = `${sectionSet[i].height}px`
        }
    }
    const getCurrentSection = function() {

        let result = 0

        if (yOffset <= sectionSet[0].height)
        {
            result = 0
        }
        else if ((yOffset > sectionSet[0].height) && (yOffset <= sectionSet[0].height + sectionSet[1].height))
        {
            result = 1
        }
        else if ((yOffset > sectionSet[0].height + sectionSet[1].height) && (yOffset <= sectionSet[0].height + sectionSet[1].height + sectionSet[2].height))
        {
            result = 2
        }
        else if (yOffset > sectionSet[0].height + sectionSet[1].height + sectionSet[2].height)
        {
            result = 3
        }
        return result
    }
    const getPrevSectionHeight = function()
    {
        let result = 0
        for (let i = 0; i < currentSection; i++)
        {
            result = result + sectionSet[i].height;
        }
        return result
    }
    const calcValue = function(values)
    {
        let result          = 0
        let rate            = 0
        let partStart       = 0
        let partEnd         = 0
        let partHeight      = 0
        const range         = values[1] - values[0]
        const sectionHeight = sectionSet[currentSection].height

        if (values.length === 3)
        {
            partStart = sectionHeight * values[2].start
            partEnd = sectionHeight * values[2].end
            partHeight = partEnd - partStart

            if ((sectionYOffset >= partStart) && (sectionYOffset <= partEnd))
            {
                rate = (sectionYOffset - partStart) / partHeight
                result = (rate * range) + values[0]         
            }
            else if (sectionYOffset < partStart)
            {
                result = values[0]
            }
            else if (sectionYOffset > partEnd)
            {
                result = values[1]
            }
        }
        else
        {
            rate = sectionYOffset / sectionHeight
            result = (range * rate) + values[0]
        }
        return result
    }

    const playIntroOpacity = function()
    {
        if (introOpacityValue < 1)
        {
            sectionSet[0].objects.introElement1_text.style.opacity = `${introOpacityValue}`
            sectionSet[0].objects.introElement2_text.style.opacity = `${introOpacityValue}`
            sectionSet[0].objects.videoElement.style.opacity       = `${introOpacityValue}`
            introOpacityValue += 0.025
        }
        else
        {
            introOpacityValue = 1
            sectionSet[0].objects.introElement1_text.style.opacity = `${introOpacityValue}`
            sectionSet[0].objects.introElement2_text.style.opacity = `${introOpacityValue}`
            sectionSet[0].objects.videoElement.style.opacity       = `${introOpacityValue}`
            clearInterval(introFadeOutTimer)
            introFadeOutTimer = null
            introOpacityValue = 0
            return
        }
    }
    const playIntroTranslate = function()
    {
        if (introTransLength < 1)
        {
            sectionSet[0].objects.introElement1_text.style.transform = `translateX(${introTranslateValue1}px)`
            sectionSet[0].objects.introElement2_text.style.transform = `translateX(${introTranslateValue2}px)`
            introTransLength += 0.025
            introTranslateValue1 -= 0.5
            introTranslateValue2 += 0.5
        }
        else
        {
            sectionSet[0].objects.introElement1_text.style.transform = `translateX(${introTranslateValue1}px)`
            sectionSet[0].objects.introElement2_text.style.transform = `translateX(${introTranslateValue2}px)`
            clearInterval(introTransTimer)
            introTransTimer = null
            introTransLength = 0
            introTranslateValue1 = 0
            introTranslateValue2 = 0
            return
        }
    }
    const playIntro = function()
    {
        introFadeOutTimer        = setInterval(playIntroOpacity, 20)
        introTransTimer          = setInterval(playIntroTranslate, 20)
    }

    const playScroll = function()
    {
        let opacityValue = 0
        let translateValue = 0
        let that = sectionSet[currentSection]
        const offsetRate = sectionYOffset / that.height
        switch(currentSection)
        {
            case 0 :
            break

            case 1 :
                if (offsetRate > 0.05 && offsetRate < 0.15)
                {
                    opacityValue = calcValue(that.values.resultElement1_OpacityOut)
                    translateValue = calcValue(that.values.resultElement1_TranslateOut)
                    that.objects.resultElement3_box.style.opacity = `${opacityValue}`
                    that.objects.resultElement3_box.style.transform = `translateY(${translateValue}px)`
                }
                else if (offsetRate > 0.15)
                {
                    that.objects.resultElement3_box.style.opacity = `1`
                }
                else
                {
                    that.objects.resultElement3_box.style.opacity = `0`
                }
            break

            case 2 :
            break

            case 3 :
            break
        }
    }

    // 무작위 효과를 적용한 수정 버전
    const getSpin = function()
    {
        sectionSet[2].values.spinFlag = true;
        sectionSet[2].values.wonBall = new Array(6);

        sectionSet[2].objects.generateElement3_button.textContent = '정지'

        effSpinFlag = setInterval(effectSpin, 25);
    }

    // Interval 무작위 효과
    const effectSpin = function()
    {
        sectionSet[2].values.ballCount = 45;
        sectionSet[2].values.wonBall = [];

        for (let i = 0; i < sectionSet[2].values.ballCount; i++)
        {
            sectionSet[2].values.ball[i] = (i + 1)
        };

        for (let i = 0; i < 6; i++)
        {
            sectionSet[2].values.wonIdx = Math.floor(Math.random() * sectionSet[2].values.ballCount);

            sectionSet[2].values.wonBall.push(sectionSet[2].values.ball[sectionSet[2].values.wonIdx]);

            sectionSet[2].values.ball.splice(sectionSet[2].values.ball.indexOf(sectionSet[2].values.ball[sectionSet[2].values.wonIdx]), 1);

            sectionSet[2].values.ballCount--;
        };

        sectionSet[2].values.wonBall.sort(function (a, b)
        {
            return a - b
        });

        numberResultText.textContent = sectionSet[2].values.wonBall;
    }

    // 무작위 효과를 종료한다.
    const stopSpin = function()
    {
        clearInterval(effSpinFlag);

        sectionSet[2].objects.generateElement3_button.textContent = '생성'

        sectionSet[2].values.spinFlag = false;

        return sectionSet[2].values.wonBall;
    }

    /*

    // 번호 전체가 일괄적으로 출력되는 일반 버전
    const getSpin = function()
    {
        let spinFlag = null;

        // 45개의 공을 만든다
        for (let i = 0; i < sectionSet[2].values.ballCount; i++)
        {
            sectionSet[2].values.ball[i] = (i + 1)
        }

        for (let k = 0; k < 6; k++)
        {
            sectionSet[2].values.wonIdx = Math.floor(Math.random() * sectionSet[2].values.ballCount)
            
            sectionSet[2].values.wonBall.push(sectionSet[2].values.ball[sectionSet[2].values.wonIdx])

            // 무작위로 선택된 45개의 공의 배열에서 무작위로 선택된 45개의 공의 배열 index 안에 있는 숫자값과 일치하면 제외시킨다.
            sectionSet[2].values.ball.splice(sectionSet[2].values.ball.indexOf(sectionSet[2].values.ball[sectionSet[2].values.wonIdx]), 1)

            sectionSet[2].values.ballCount--
        }

        sectionSet[2].values.wonBall.sort(function (a, b)
        {
            return a - b
        })

        numberItem.textContent = sectionSet[2].values.wonBall
    }

    */

    const numberResultItem      = document.createElement('div');
    const numberResultText      = document.createElement('span');

    sectionSet[2].objects.generateElement3_button.addEventListener('click', () =>
    {
        let result = []

        if (sectionSet[2].values.spinFlag == false)
        {
            getSpin();
        }
        else
        {
            result = stopSpin();
        };

        sectionSet[2].objects.generateElement4_result.appendChild(numberResultItem);
        sectionSet[2].objects.generateElement4_result.appendChild(numberResultText);

        const numberPrevItem        = document.createElement('div');
        const numberPrevText        = document.createElement('span');

        numberResultText.textContent = result;
        numberPrevText.textContent = result;

        sectionSet[2].objects.generateElement5_list.appendChild(numberPrevItem);
        sectionSet[2].objects.generateElement5_list.appendChild(numberPrevText);
    })
    const scrollLoop = function()
    {
        playScroll()
    }
    window.addEventListener('scroll', () =>
    {
        scrollLoop()
        currentSection    = getCurrentSection()
        prevSectionHeight = getPrevSectionHeight()
        yOffset           = window.scrollY + (window.innerHeight / 2)
        sectionYOffset    = yOffset - prevSectionHeight
    })
    window.addEventListener('load', () =>
    {
        initHTMLPage()
    })
})()