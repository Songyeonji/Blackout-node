[![Frame1_title]](https://github.com/Songyeonji/Blackout-node/assets/104824428/ad933f6b-33ef-4172-a3c9-17f3c3367958)

<br><br>
### 개발 배경

---

이 프로젝트의 목적은 사용자들이 자신의 음주 습관을 기록하고 관리할 수 있는 플랫폼을 제공하는 것입니다. 음주 기록 달력, 맞춤형 술 추천, 술 정보 공유 기능을 통해, 사용자들이 자신의 음주 패턴을 파악하고, 술에 대한 유용한 정보를 얻으며, 술과 관련된 추억을 보관할 수 있도록 하기 위해 Node.js를 활용하여 개발되었습니다. 이는 기존에 없던 술에 대한 통합적인 어플리케이션을 통해, 술을 둘러싼 커뮤니티 형성과 긍정적인 음주 문화 조성에 기여하고자 합니다.

 이미 개발된 프론트엔드와의 원활한 통합과 JavaScript 기반의 효율적인 개발 환경을 위해 Node.js를 선택하였습니다. 이를 통해 하나의 언어로 전체 스택을 구성함으로써 개발 과정을 간소화하고, 술에 대한 어플리케이션이 부족한 현 상황에서 사용자에게 새로운 가치를 제공하고자 합니다.

- 술을 좋아하는 애주가들, 주변 술 맛집, 안주, 정보을 알고 싶은 사람들 등
<br><br>

### 사용한 도구(Tool)

---

- scss : 메인페이지와 기본 로고를  제작할 때 사용하였으며, 술취한 듯한 느낌을 주기위해 반복값을 주어 사용하였습니다.
- NAVER API : 음주 선택 후 블로그 크롤링 검색을 할 때 NAVER에서 제공하는  API 및 SDK를 사용하였습니다.
- weather API : 사용자 위치기반으로 날씨를 이용해 술 추천을 하기 위해 사용하였습니다. 
- react : 전반적인 페이지들을 제작할 때 사용하였스며, mui ui, daisy ui, icon, slick 등 다양한 리액트 모듈을 사용하여 시각적인 효과를 주었습니다.
- mysql : 데이터 저장을 위해 mysql를 사용하였습니다.
- node.js : JavaScript 기반의 효율적인 개발 환경을 위해 Node.js로 백엔드 서버를 구현하였습니다.
- jsx : 다양한 언어를 사용해보고 싶어, 로그인 페이지와 마이페이지, 회원가입 페이지등 member에 관련된 페이지는 jsx를 사용하였습니다.
    <br><br>
### 문제 해결 과정
    
---
    
**문제. mysql-node / mysql 과부화 오류**
    
클라이언트가 데이터베이스에 접근하기 위해 필요한 connection 생성은 비용이 많이 드는 작업입니다. 이를 해결하기 위해, connection pool을 사용하여 여러 개의 connection을 미리 생성하고 필요할 때 사용한 후 반환하는 기법을 도입했습니다. 이 방법은 매 연결마다 새로운 connection을 만들고 종료시키는 비용을 줄이고, 데이터베이스 접근 시간을 단축시키며, 과부하를 방지하는 효과가 있습니다. 특히, MySQL과 같은 무료 DBMS에서 connection pool을 사용하면 auto release 기능을 통해 퍼포먼스가 극대화됩니다.

MySQL에서의 connection pool 사용은 mysql.createPool을 통해 구현되며, promise 기반의 쿼리 실행을 위해 pool.promise()를 활용합니다. 이는 controller에서 DB를 사용할 때 .then, .catch, async/await를 사용할 수 있게 해줍니다. 만약 pool.promise()를 사용하지 않을 경우, promise가 아닌 데이터에 .then, .catch, 또는 async/await를 사용했을 때 에러가 발생합니다. 이는 con.promise().query() 형태로 사용하거나, mysql2/promise를 사용하거나, pool.promise() 형태를 export하여 해결할 수 있습니다. 이러한 접근 방식을 통해, 비효율적인 데이터베이스 connection 관리 문제를 성공적으로 해결하였습니다.
    
<br><br>
### 구현 기능

---

1. 음주 기록 달력
    
![KakaoTalk_20240321_180434548](https://github.com/Songyeonji/Blackout-node/assets/104824428/de0e3957-e22e-4600-b97c-f4f67ce2fed6)

    
    - 달력에 주류 소비 기록을 프로그래스 바로 시각적으로 표시하였습니다. 총 음주량이 20%가 넘으면 notice바가 나오도록 제작했습니다.
    - 해당 날짜를 클릭했을 때 별점, 소비한 병 수, 주류 종류, 추가 텍스트, 그날의 별점 및 컬러 나타날 수 있도록 제작하였습니다.
    - 리액트 캘린더 모듈을 사용하여 전년도, 전 월 등 다양한 년도와 월의 데이터를 local저장소에서 확인할수 있도록 제작하였습니다.
<br><br>
2. 오늘의 술추천
    
![KakaoTalk_20240321_180434548_01](https://github.com/Songyeonji/Blackout-node/assets/104824428/6401355b-6b14-4baf-aae8-da1e476f97d0)

    
    - 날씨, 주류 종류바탕으로 맞춤형 술을 추천,  다양한 기준에 따른 술 추천을 하도록 제작하였습니다.
    - 술 주류를 클릭하면 해당 술에 관련된 블로그를 크롤링하였고 링크로 연결되고 , 슬릭으로 다양하게 볼 수 있도록 제작하였습니다.
<br><br>    
3. 술 정보 공유
    
![KakaoTalk_20240321_180550788](https://github.com/Songyeonji/Blackout-node/assets/104824428/79b199db-2367-4133-ac22-edd4794e5d18)


    
    - NAVER API의 Directions15를 이용하여 출발지 정보와 목적지 정보를 서버에 보내고 현재 교통 상황에 따라서 가장 빠른 경로를 결과물로 받아와서 이를 어플리케이션에서 출력하는 기능을 제작하였습니다.
    - 이때, 해당 경로를 지도 위에 path를 사용하여 표시하였고, 출발지에서 목적지까지 걸리는 시간, 거리를 출력하였습니다.
    - 경로 미리보기 페이지에서 ‘경로 안내’ 버튼을 클릭하면 주행모드 페이지로 넘어가고, 해당 페이지에서 사용자의 실시간 위치 정보를 받아와서 사용자의 위치에 따라 경로 안내를 진행합니다. 이때, 모든 경로 안내는 음성으로 출력되며, 현재 안내 내용과 그 다음 안내 내용을 왼쪽 상단에 시각적으로 출력되도록 제작하였습니다.
    - 각각 음성 안내는 300m, 100m, 50m 순으로 진입했을 때 ‘~m 앞에서 ~하세요’라고 출력되도록 제작하였습니다.
    
<br><br>    
3. 로그인 및 멤버 페이
![KakaoTalk_20240321_180434548_02](https://github.com/Songyeonji/Blackout-node/assets/104824428/8e33b40b-383c-42e5-bcda-e7329952c9a0)
![KakaoTalk_20240321_180434548_03](https://github.com/Songyeonji/Blackout-node/assets/104824428/4b22d5dc-576c-475e-a07d-6f1de95ae4cf)

    - NAVER API의 Directions15를 이용하여 출발지 정보와 목적지 정보를 서버에 보내고 현재 교통 상황에 따라서 가장 빠른 경로를 결과물로 받아와서 이를 어플리케이션에서 출력하는 기능을 제작하였습니다.
    - 이때, 해당 경로를 지도 위에 path를 사용하여 표시하였고, 출발지에서 목적지까지 걸리는 시간, 거리를 출력하였습니다.
    - 경로 미리보기 페이지에서 ‘경로 안내’ 버튼을 클릭하면 주행모드 페이지로 넘어가고, 해당 페이지에서 사용자의 실시간 위치 정보를 받아와서 사용자의 위치에 따라 경로 안내를 진행합니다. 이때, 모든 경로 안내는 음성으로 출력되며, 현재 안내 내용과 그 다음 안내 내용을 왼쪽 상단에 시각적으로 출력되도록 제작하였습니다.
    - 각각 음성 안내는 300m, 100m, 50m 순으로 진입했을 때 ‘~m 앞에서 ~하세요’라고 출력되도록 제작하였습니다.
<br><br>
### 추후 계획
------------------------------------------
- **이미지 파일 업로드**: image 파일 라이브러리를 활용해 게시물 이미지 활용 능력 향상
- **지도 표시 기능**: 각 컨텐츠 위치를 지도에 표시하여 사용자 경험 향상
- **회원 , 비회원 등급 표시*: 사용자의 프로그래스 바 형태를 활용하여 등급표시
- **사용자 댓글 및 리뷰 기능**: 커뮤니티 활성화를 댓글 및 리뷰 기능 도입
- **맞춤형 알림 서비스**: 사용자의 관심사에 맞는 정보를 제공하기 위한 알람 기능 구현
- 
<br><br>
### 시연 영상
------------------------------------------
(https://www.youtube.com/watch?v=QCXTLq9ZMbY)https://www.youtube.com/watch?v=QCXTLq9ZMbY)
