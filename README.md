 
## Dooribon Server
 
<div>  
  
<img src = "https://user-images.githubusercontent.com/20807197/124384313-8921bb00-dd0b-11eb-8fea-71ad08e884be.png" width="200px" height="280px"/> 

</div>      

### 작은 움직임이 만드는 우리다운 여행 두리번   

> **두리번** 의 핵심 기능은 다음과 같습니다.   
> #### 그룹성향파악, 위시리스트, 여행보드, 일정관리
> 두리번을 통해 함께 여행하는 사람들의 성향을 파악하고, 즐거운 여행을 만들어 가세요.   

> SOPT 28th APPJAM </b>
>
> 프로젝트 기간: 2021.06.26 ~ 2021.07.17

### 📋 IA  
![DooribonIA](https://user-images.githubusercontent.com/20807197/124385082-3b0eb680-dd0f-11eb-9462-ee8f02ff981b.png)   

### 💡 API 명세서
[API 명세서 최종](https://github.com/TeamDooRiBon/DooRi-Server/wiki)

### 🛠 Development Environment

<img src="https://img.shields.io/badge/Node.js-v14-green"/> <img src="https://img.shields.io/badge/Mongoose-v5.12.10-blue"/> <img src="https://img.shields.io/badge/Express-v4.17.1-green"/> <img src="https://img.shields.io/badge/Typescript-v4.2.4-blue"/>  

### 🛠 Server Architecture
![image](https://user-images.githubusercontent.com/20807197/124567491-0457ae00-de7f-11eb-8a40-b67ee7382f9c.png)

### ⚙️ Dependencies Module
```
"devDependencies": {
    "@types/express": "^4.17.11",
    "@types/mongoose": "^5.10.5",
    "@types/node": "^15.6.0",
    "nodemon": "^2.0.7",
    "ts-node": "^9.1.1",
    "typescript": "^4.2.4"
  },
  "dependencies": {
    "axios": "^0.21.1",
    "bcryptjs": "^2.4.3",
    "dotenv": "^9.0.2",
    "express": "^4.17.1",
    "express-validator": "^6.12.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.13.2",
    "nanoid": "^3.1.23",
    "qs": "^6.10.1"
  }
  ```
### 📌 Branch Strategy

<details>
<summary>Git Workflow</summary>
<div markdown="1">       

```
 1. local - feature에서 각자 기능 작업
 2. 작업 완료 후 local - develop (ex. xxeol) 에 PR 후 Merge
 3. 이후 remote - develop 으로 PR
 4. 코드 리뷰 후 Confirm 받고 Merge
 5. remote - develop 에 Merge 될 때 마다 모든 팀원 remote - develop pull 받아 최신 상태 유지
 ```

</div>
</details>

| Branch Name | 설명 |
| :---: | :-----: |
| main | 초기 세팅 존재 |
| develop | 로컬 develop merge 브랜치 |
| jobchae | 정아 로컬 develop 브랜치 |
| xxeol | 설희 로컬 develop 브랜치 |
| judy | 주현 로컬 develop 브랜치 |
| localdevelop_feature/#issue | 각자 기능 추가 브랜치 |

### 📌 Commit Convention

**태그: 제목의 형태**

| 태그 이름| 설명 |
| :--: | :-----: |
| feat | 새로운 기능을 추가할 경우 |
| fix | 버그를 고친 경우 |
| !BREAKING CHANGE | 커다란 API 변경의 경우 |
| !HOTFIX | 급하게 치명적인 버그를 고쳐야 하는 경우 |
| style | 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우 |
| comment | 필요한 주석 추가 및 변경 |
| docs | 문서를 수정한 경우 (ex. README 수정) |
| rename | 파일 혹은 폴더명을 수정하거나 옮기는 작업인 경우 |
| remove | 파일을 삭제하는 작업만 수행한 경우 |
| chore | 빌드 태스크 업데이트, 패키지 매니저를 설정하는 경우 |

### 📌 Coding Convention

<details>
<summary>변수명</summary>   
<div markdown="1">       
      
 
 1. Camel Case 사용 
   - lower Camel Case
 2. 함수의 경우 동사+명사 사용 
   - ex) getInformation()
 3. 길이는 20자로 제한한다. 
   - 부득이한 경우 팀원과의 상의를 거친다.
 4. flag로 사용 되는 변수는 조동사 + flag 종류로 구성 
   - ex) isNum
 5. 약어는 되도록 사용하지 않는다.
 
</div>
</details>

<details>
<summary>주석</summary>
<div markdown="1">       

 1. 한줄 주석은 // 를 사용한다.
 2. 그 이상은 /** */ 를 사용한다.
 3. 함수 설명 주석은 2번을 사용한다.
 
</div>
</details>

<details>
<summary>Bracket</summary>
<div markdown="1">       

 ``` javascript
 // 한줄 if 문 - 여러 줄로 작성
  if(trigger) {
    return;
  }
 ```
 ``` javascript 
 // 괄호 사용 한칸 띄우고 사용한다.
  if (left == true) {
     return;
  }
 ```
 ``` javascript 
 // 띄어쓰기
  if (a == 5) { // 양쪽 사이로 띄어쓰기
     return;  
  }
 ```
 
</div>
</details>

<details>
<summary>비동기 함수의 사용</summary>
<div markdown="1">       

 1. async, await 함수 사용을 지향한다.
 2. Promise 사용은 지양한다.
 
</div>
</details>

<details>
<summary>DataBase</summary>
<div markdown="1">       

 1. Model 파일명은 대문자
 2. 필드명은 CamelCase 사용
 
</div>
</details>


### 👩🏻‍💻 Developers   
| 채정아 | 정설희 | 변주현 |
| :---: | :---: | :---: |
|<img src="https://user-images.githubusercontent.com/20807197/122161395-9ab23880-ceac-11eb-9498-bed403daa960.png" width="150px" height="150px" />|<img src ="https://user-images.githubusercontent.com/20807197/124384875-457c8080-dd0e-11eb-8308-137003b9c77a.png" width = "150px" height="150px" />|<img src ="https://user-images.githubusercontent.com/20807197/124384900-66dd6c80-dd0e-11eb-82bd-662ad808e6df.png" width = "150px" height="150px" />|
|[jokj624](https://github.com/jokj624)|[xxeol2](https://github.com/xxeol2)|[wngus4296](https://github.com/wngus4296)| 
