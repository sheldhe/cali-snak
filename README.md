[캘리 스낵 키오스크]

실행 방법: npm run start

- front -> rest

1. 요청메세지 : creditsale/sell/request
2. 구매요청 : creditsale/sell/아이템번호1/판매수량1/아이템번호2/판매수량2/아이템번호3/판매수량3..
3. 재고요청 : creditsale/stock/request
4. 재고변경 : creditsale/stock/아이템번호1/재고수량1/아이템번호2/재고수량2/아이템번호3/재고수량3..
5. 로그인확인 : creditsale/login/이름/비밀번호
6. 구매내역요청 : creditsale/history/request
7. 구매내역삭제 : creditsale/history/delete/seq/수량(기존)
8. 구매내역수정 : creditsale/history/update/seq/수량(변경)
9. 대기전환 : creditsale/wait

- rest -> front

0. 로그인확인 응답
   {
   "status":"success",
   "title": "login",
   "data":
   [
   {
   "result" : "true" //false -> "아이디, 패스워드가 알치하지 않습니다."
   }
   ]
   }

1. 데이터 변화 없을때
   {
   "status":"success",
   "title": "nochange",  
    "data":
   [
   ]
   }

2. 사용자 정보
   {
   "status":"success",
   "title": "userinfo",
   "data":
   [
   {
   "username" : "홍길동",
   "tagvalue" : "0101234567",
   "parentname" : "홍길동아부지",
   "phonenumber" : "0101234567",
   "itemtype" : ["coffee", "drink", "snack"],  
    "itemnumber" : ["1", "2", "3"],
   "itemname" : ["뽀로로 딸기", "뽀로로 밀크", "파워오투 아이스베리"],
   "itemstock" : ["10", "5", "0"],
   "itemprice" : ["2000", "2000", "3000"]
   }
   ]
   }

3. 재고 정보
   {
   "status":"success",
   "title": "stockinfo",
   "data":
   [
   {
   "itemtype" : ["coffee", "drink", "snack"],  
    "itemnumber" : ["1", "2", "3"],
   "itemname" : ["뽀로로 딸기", "뽀로로 밀크", "파워오투 아이스베리"],
   "itemstock" : ["10", "5", "0"],
   "itemprice" : ["2000", "2000", "3000"]
   }
   ]
   }

4. 구매 정보
   {
   "status":"success",
   "title": "historyinfo",
   "data":
   [
   {
   "seq" : ["81", "82", "85"],
   "regdate" : ["hhmmss", "hhmmss", "hhmmss"],  
    "itemnumber" : ["0001", "0002", "0003"],
   "itemname" : ["뽀로로 딸기", "뽀로로 밀크", "파워오투 아이스베리"],
   "itemquentity" : ["10", "5", "0"]
   }
   ]
   }

5. 저장 성공
   {
   "status":"success",
   "title": "saveok",
   "data":
   [
   ]
   }

$ 에러처리 6) 저장처리 실패 -> "정상 처리되지 않았습니다. 다시 시도해 주세요."
{
"status":"success",
"title": "savefail",  
 "data":
[
]
}

7. 유저데이터가 없을때 -> "정상 발급된 팔지인지 확인해 주세요"
   {
   "status":"success",
   "title": "norentalid",  
    "data":
   [
   ]
   }

8. 대기상태
   {
   "status":"success",
   "title": "wait",  
    "data":
   [
   ]
   }
