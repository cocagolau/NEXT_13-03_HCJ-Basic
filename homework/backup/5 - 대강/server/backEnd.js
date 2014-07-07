/*
  요구사항
  1. window onload시 객체 생성
  2. newsData 및 내부변수 외부 접근불가
  3. 외부에 데이터 반환시 json형식으로 반환

  4. 서버 생성시 0부터 (key-1)까지 난수표 생성
  5. 서버 생성시 init obj를 인자로 전달 필수
    - init: {date:'2013.10.10'}
    - init obj를 인자로 전달시 난수재생성 후 3개의 journal 데이터를 담은 obj를 반환
  6. 외부에서 next(key) 호출시 난수표에서 key다음 데이터 1개를 반환
  7. 외부에서 previous(key) 호출시 난수표에서 key이전 데이터 1개를 반환
*/


// server.js에서 자료 읽어내기
var Server = function (init) {
	// init obj가 없는 경우 return;
	// 나중에 init에 날짜데이터를 넣어서 해당 날짜만 출력하는 기능 필요
	if (typeof init === 'undefined' || typeof init !== 'object')
		return;

	var db = new DB();
	var dbKeys = db.getKeys('contents');
	return (function() {
		var initNum = 3;
		var keys
			= (function () {
				var randKeys = [];
				var range = dbKeys.length;
				var index = 0;

				do {
					var randNum = Math.round(Math.random() * (range-1));
					if (typeof(randKeys[randNum]) === "undefined")
						randKeys[randNum] = dbKeys[index++];
				} while(index < range);
				
				return randKeys;
			}());

		var initKeys
				= (function() {
					if (keys.length <= initNum)
						return keys;
					else
						return keys.slice(0, initNum);	
				}());
		
		function getIndex (key, offset) {
			for (var index in keys) {
				if (key === keys[index]) {
					var i = index;
					break;
				}
			}
			var maxIndex = dbKeys.length - 1;
			var index = parseInt(i);
			if (index + offset < 0)
				return maxIndex + index;
			else if (index + offset > maxIndex)
				return offset - 1;
			else
				return index + offset;
		}

		var methods = {
			next : function (key) {
				if (typeof key === 'undefined')
					return;
				return db.getValue('contents', keys[getIndex(key, 1)]); // getIndex가 null인 경우 처리 안함
			},
			previous : function (key) {
				if (typeof key === 'undefined')
					return;
				return db.getValue('contents', keys[getIndex(key, -1)]); // getIndex가 null인 경우 처리 안함	
			},
			getInit : function () {
				obj = {};
				for (var i in initKeys) {
					var key = keys[i];
					obj[key] = db.getValue('contents', key);
				}
				return obj;
			},
			getTemplate : function (key) {
				try {
					return db.getValue('template', key);
				} catch (error) {
					return db.getValue('template');
				}
			},
			getStyle : function (key) {
				try {
					return db.getValue('style', key);
				} catch (error) {
					return db.getValue('style');
				}
			}	
		};

		return methods;
	}());
};

// web DB로 변경예정
function DB () {
	this.template = {
		journal : '<div class="{ form } { position }"><div class="journal">{ section }</div></div>',
		section : '<section><h1>{ title }</h1>{ article }</section>',
		article : '<article class="{ importance }"><h1><span>{ title }</span></h1><h2>{ strapline }</h2><address>{ author }</address></article>'
	};

	this.style = {
		// condition: forward, backward, random, custom
		journal : { form:'jourForm', position:{forward: ['left', 'middle', 'right']} },
		article : { importance:{forward: ['a1', 'a2', 'a3']} }
	};

	this.contents = {
		"journal1": {
			"title" : "경향신문",
			"version" : "1판",
			"issue" : "0001호",
			"section1" : {
				"title" : "종합",
				"article1" : {
					"title":"김진태 의원 \"파리 시위자들 대가 치르게 할 것\"",
					"strapline":"박 대통령 수행 중 ‘대선개입 규탄’에 협박",
					"author":"유정인 기자 jeongin@kyunghyang.com",
					"data":"",
					"contents":"aid1-서동규-none",
					"ratio":"40%"
				},
				"article2":{
					"title":"이석채, 통신 공룡을 5년 동안 \"들었다 놨다\"",
					"strapline":"\'혁신의 아이콘\'에서 배임혐의 받는 이석채 회장 \'KT에 그동안 무슨 일이…\'",
					"author":"최영진 기자 cyj@kyunghyang.com",
					"data":"",
					"contents":"aid2-서동규-none",
					"ratio":"23%"
				},
				"article3":{
					"title":"50대 기러기 아빠 자살…유서에 \"모두 다 잃었다\"",
					"strapline":"",
					"author":"디지털뉴스팀",
					"data":"",
					"contents":"aid3-서동규-none",
					"ratio":"30%"
				},
				"article4":{
					"title":"김한길 \"대선 관련 모든 의혹, 특검에 맡겨야\"",
					"strapline":"민주, 상임위 일정 전면 중단, 의원 50여명 대검 항의방문, 새누리 거부 \"단독 국회 불사\"",
					"author":"구교형·정환보 기자 wassup01@kyunghyang.com",
					"data":"",
					"contents":"aid4-서동규-none",
					"ratio":"35%"
				},
				"article5":{
					"title":"트위터 상장 \'대박\'… \'IT 거품\'' 우려도",
					"strapline":"기업 자금 18억달러 성공적 조달, 공동창업자들도 억만장자 대열에, \"가능성 확인\" \"전망 불투명” 갈려\"",
					"author":"정유진 기자 sogun77@kyunghyang.com",
					"data":"",
					"contents":"aid5-서동규-none",
					"ratio":"18%"
				},
				"article6":{
					"title":"\'칠레 시인\'' 네루다 사인, 독살 아냐",
					"strapline":"",
					"author":"주영재 기자 jyj@kyunghyang.com",
					"data":"",
					"contents":"aid6-서동규-none",
					"ratio":"26%"
				}
			},
			"section2" : {
				"title" : "국제",
				"article1": {
					"title":"경향신문-journal1 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"경향신문-journal1 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section3" : {
				"title" : "사회",
				"article1": {
					"title":"경향신문-journal1 - section3 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"경향신문-journal1 - section3 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			}
		},


		"journal2": {
			"title" : "국민일보",
			"version" : "2판",
			"issue" : "0002호",
			"section1" : {
				"title" : "종합",
				"article1": {
					"title":"국민일보-journal1 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"국민일보-journal1 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section2" : {
				"title" : "국제",
				"article1": {
					"title":"국민일보-journal1 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"국민일보-journal1 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section3" : {
				"title" : "사회",
				"article1": {
					"title":"국민일보-journal1 - section3 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"국민일보-journal1 - section3 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			}
		},


		"journal3": {
			"title" : "한겨례",
			"version" : "3판",
			"issue" : "0003호",
			"section1" : {
				"title" : "종합",
				"article1": {
					"title":"한겨례-journal3 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"한겨례-journal3 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section2" : {
				"title" : "국제",
				"article1": {
					"title":"한겨례-journal3 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"한겨례-journal3 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section3" : {
				"title" : "사회",
				"article1": {
					"title":"한겨례-journal3 - section3 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"한겨례-journal3 - section3 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			}
		},


		"journal4": {
			"title" : "동아일보",
			"version" : "4판",
			"issue" : "0004호",
			"section1" : {
				"title" : "종합",
				"article1": {
					"title":"동아일보-journal4 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"동아일보-journal4 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section2" : {
				"title" : "국제",
				"article1": {
					"title":"동아일보-journal4 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"동아일보-journal4 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section3" : {
				"title" : "사회",
				"article1": {
					"title":"동아일보-journal4 - section3 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"동아일보-journal4 - section3 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			}
		},


		"journal5": {
			"title" : "중앙일보",
			"version" : "5판",
			"issue" : "0005호",
			"section1" : {
				"title" : "종합",
				"article1": {
					"title":"중앙일보-journal5 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"중앙일보-journal5 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section2" : {
				"title" : "국제",
				"article1": {
					"title":"중앙일보-journal5 - section2 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"중앙일보-journal5 - section2 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			},
			"section3" : {
				"title" : "사회",
				"article1": {
					"title":"중앙일보-journal5 - section3 - article1",
					"strapline":"article1",
					"author":"서동규",
					"data":"",
					"contents":"article1-서동규-none",
					"ratio":"40%"
				},
				"article2": {
					"title":"중앙일보-journal5 - section3 - article2",
					"strapline":"article2",
					"author":"서동규",
					"data":"",
					"contents":"article2-서동규-none",
					"ratio":"40%"
				}
			}
		}


	};
	this.getKeys = function (part) {
		return Object.keys(this[part]);
	};
	this.getValue = function (part, key) {
		if (typeof key === 'undefined') {
			return this[part];
		}
		return this[part][key];
	};
}
