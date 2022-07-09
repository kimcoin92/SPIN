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
                generateElement4_list   : document.querySelector('#section-2 #number-List')
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
                ballIdx         : 0,
                wonBall         : [],
                wonIdx          : 0,
                ballCount       : 45
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

    // 무작위 번호 출력

    // 1. 페이지에는 6개의 번호 슬롯이 있다.
    // 2. 생성 버튼을 누르면 생성 버튼이 정지 버튼으로 바뀐다.
    // 3. 1번 슬롯에 고속으로 무작위 숫자가 표시되도록 한다.
    // 4. 정지 버튼을 누르면 숫자 표시가 중지되며 그 번호는 첫번째 추천 번호로 결정된다.
    // 5. 2 ~ 6번 슬롯 또한 동일한 루틴으로 진행한다.
    //    단, 중복되는 번호가 출력되지 않도록 사전에 배열 형태의 번호 리스트를 구현한다.
    //    선택된 배열 위치의 번호를 각 번호 슬롯에 입력된 번호는 제외시킨다.
    // 6. 모든 슬롯에 번호가 입력되면 생성 리스트로 번호들을 이동시킨다.
    //    정지 버튼은 생성 버튼으로 바꾼다.

    /*
    const getSpin = function()
    {
        for (let i = 0; i < sectionSet[2].values.ballCount; i++)
        {
            sectionSet[2].values.ball[i] = (i + 1)
        }

        let spinArr = [];

        spinArr[0] = setInterval(spinEffect(), 50)
    }
    */

    
    /*
    const spinEffect = function()
    {
        sectionSet[2].values.wonIdx = Math.floor(Math.random() * sectionSet[2].values.ballCount)

        numberText.innerText = sectionSet[2].values.wonIdx;
    }
    */

    const getSpin = function()
    {
        // 공의 개수만큼 반복하면서 공의 배열에 숫자값을 입력한다.
        // 로또는 번호 45개 : 공도 (원래 45개이지만 무작위 수를 추첨할때 내림처리하여 하나가 부족하므로) 46개로 생성한다.

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

        return sectionSet[2].values.wonBall

    }

    const numberItem      = document.createElement('span')
    const numberText      = document.createElement('span')

    sectionSet[2].objects.generateElement3_button.addEventListener('click', () =>
    {
        sectionSet[2].objects.generateElement4_list.appendChild(numberItem)
        sectionSet[2].objects.generateElement4_list.appendChild(numberText)
        // sectionSet[2].objects.generateElement3_button.textContent = '정지'
        numberItem.textContent = getSpin()
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