# 한 발 앞선 생각 - Don Touch

<img src = "https://github.com/user-attachments/assets/8046a260-25a0-47ca-a176-3a646355573b" width=150px>

<br/>
<br/>

> 주최 : 신한투자증권
> <br/><br/>
> 주제 : 개인화된 금융 서비스를 제공하기 위한 클라우드 MSA 환경 구축 및 서비스 개발
> <br/><br/>
> 서비스 : 웹앱
> <br/><br/>
> 성과 : 최우수 프로젝트 수상

<br/>
<br/>

## Team. DonTouch
| 신의진 | 박유진 | 이한슬 |
|:----:|:----:|:-----:|
|<img src = "https://avatars.githubusercontent.com/Tomk2d" width=150px>|<img src = "https://avatars.githubusercontent.com/yjp8842" width=150px>|<img src = "https://avatars.githubusercontent.com/eehanseul" width=150px>|
| 백엔드 테크리더 | 프론트엔드 테크리더 | PM |


| 허상진 | 박진언 | 이승택 |
|:----:|:----:|:----:|
|<img src = "https://avatars.githubusercontent.com/bookeers" width=150px>|<img src = "https://avatars.githubusercontent.com/parkjineon" width=150px>|<img src = "https://avatars.githubusercontent.com/seungtoctoc" width=150px>|
| 서기 | 팀원 | 팀원 |

<br/>
<br/>

## My Role (신의진)
* 백엔드 테크리더 및 프로젝트 리딩
* 배당주, 개별주식, 부동산, 에너지 거래체결
* 실시간 소켓 통신
* 비동기 객체 통신
* MSA 설계 및 AWS 인프라 설계
* 배포

<br/>
<br/>

## Contents
### 1. [About](#About)
### 2. [Tech Stacks](#Tech-Stacks)
### 3. [Project Architecture](#Project-Architecture)
### 4. [ERD](#ERD)
### 5. [Main Features](#Main-Features)
### 6. [Project Structure](#Project-Structure)


<br/>

## About


donTouch 는 투자 상품 추천 및 모의투자, 배당 일정 관리 등의 __통합형 자산관리 서비스__ 입니다. <br /> <br />
' _제 2의 월급 만들기_ ' 라는 목표로 유저를 개인화하고 배당주, p2p 상품 등의 조합을 추천합니다. <br /> 
유저의 __마이데이터(투자 성향, 총 자산, 투자 자산, 보유 주식)__ 를 통하여 유저를 개인화하고, <br />
이에 적합한 상품들을 조합하여 __모든 월에 수익을 창출__ 할 수 있게 합니다. <br /> <br />

### 메인 기능
* 주식 개별 종목 매매(한국/미국)
* 배당주 조합 추천 및 조합 생성 구매
* 부동산 p2p 종목 매매 및 추천
* 에너지 p2p 종목 매매 및 추천
* 캘린더를 통한 배당 일정 관리
* 마이데이터를 활용한 개인화 및 통합적 자산 관리


<br />
<br />

## Tech Stacks
![Spring Boot](https://img.shields.io/badge/Java/SpringBoot-6DB33F?style=flat&logo=SpringBoot&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js/Express-339933?style=flat&logo=Node.js&logoColor=white)

![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=flat&logo=MariaDB&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=MongoDB&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat&logo=Redis&logoColor=white)

![Apache Kafka](https://img.shields.io/badge/Kafka-231F20?style=flat-square&logo=ApacheKafka&logoColor=white)
![socket](https://img.shields.io/badge/WebSocket/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white)

![AWS EC2](https://img.shields.io/badge/EC2-F24E1E?style=flat-square&logo=AmazonEC2&logoColor=white)
![AWS RDS](https://img.shields.io/badge/RDS-527FFF?style=flat-square&logo=AmazonRDS&logoColor=white)
![AWS S3](https://img.shields.io/badge/S3Bucket-569A31?style=flat-square&logo=AmazonS3&logoColor=white)

<br />
<br />

## Project Architecture 
<img width="800" alt="user" src="https://github.com/PDA-Dontouch/.github/assets/128025654/4f1d5e14-5bc1-40e8-ad3a-2c17bbd851b0">
<img width="400" alt="user" src="https://github.com/user-attachments/assets/eef48b20-8ef8-4d14-9e4b-6c4b2f760095">

<br />
<br />

### MSA 구조
* __도메인 별 5개의 서버(Spring boot)와 5개의 데이터베이스(Maria DB)__ [(repository)](https://github.com/Tomk2d/DonTouch-app-server) : 유저, 주식, 부동산p2p, 에너지p2p, 오더 서버
* __소켓 서버(NodeJs)와 체결 및 거래 DB(Mongo DB)__ [(repository)](https://github.com/Tomk2d/DonTouch-app-data-socket): 실시간 데이터 통신, 이벤트 핸들링 최적화
* __Kafka 서버__ : __비동기 통신__. kafka 2.8.0, Zookeeper 등

### 서버 라우팅 & 로드 밸런싱
* ELB : 서버의 탄력적인 확장성과 안정적인 운영을 위하여  **서로 다른 AZ의 서버로 로드밸런싱**. *트래픽 분산*
* PM2 : **클러스터 모드**를 활용하여 **서버 클러스터링** (scale out 전략)
* NginX : 로드밸런싱 configuration 을 활용하여 **클러스터링 된 서버 로드 밸런싱**. **클라이언트 - 서버,** **서버 - 서버** 라우팅

### 서버 간 결합도 감소
* 일부 유저 정보 __반정규화__
* __Spring Security__ 를 활용한 __인증/인가__

### 통신
* __동기적 통신(HTTP)__ : 신뢰성이 보장되어야 하는 로직 및 인증/검사 등의 선순위 로직
* __비동기 통신(Kafka 메세지 큐잉)__ : 인증/검사 등의 순서가 완료된 단방향 로직
* __socket 통신(webSocket, Socket.io)__ : 실시간 렌더링, 실시간 호가 매매, 미체결 주문에 대한 체결

<br />
<br />

## ERD

MSA 환경 구축을 위해 도메인 별로 DB를 나누어 구축하였습니다.

<img width="800" alt="user" src="https://github.com/PDA-Dontouch/.github/assets/128025654/78e08049-a483-4b75-8fb5-ae8fc40e2beb">
<img width="800" alt="stock" src="https://github.com/PDA-Dontouch/.github/assets/128025654/d3378834-aabb-45d2-93ef-d5ef7c8f067c">
<img width="800" alt="order" src="https://github.com/PDA-Dontouch/.github/assets/128025654/942bcd2f-8e37-4711-9dc3-c20b39dc8e5f">
<img width="800" alt="estate" src="https://github.com/PDA-Dontouch/.github/assets/128025654/f603ca4a-3aec-49be-a028-b57d5419f646">
<img width="800" alt="energy" src="https://github.com/PDA-Dontouch/.github/assets/128025654/90de9cd7-3e52-436b-aaf7-3d2df4ffab4f">

<br />
<br />

## Main Features

### 배당주 조합 추천 및 매매

<img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/b818a9f5-79d1-41da-b9d1-286b4c61f1a4"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/ffd2365c-efb5-42b7-8d0f-12ab4dd7f55b"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/3675ab2a-4d85-409a-8928-60ebc7fafa4b">

### 개별 주식 조회 및 매매

<img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/7add7cff-093c-4441-8733-d8d07eac080d"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/50bf325c-5066-41e9-83fd-cc4f7fbcbaff"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/8ffb7b04-ff4d-4406-be3d-7429b73aaf32">


### P2P 조회 및 매매

<img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/7d597cd5-404b-4758-8f98-08826568d445"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/46eeb282-d5e8-40e3-ac26-c3fc4b746f47"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/ddf1c300-5de8-490d-ad4b-d679ac841b03">

### 캘린더 및 메인 페이지
<img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/0d46444f-e3c2-412b-9c8b-c22fb6587878"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/b216a35e-e5f6-4ff8-8822-5fbb5dc36610"><img width="300" height="650" alt="image" src="https://github.com/user-attachments/assets/1f3aef7e-bf7f-4efe-9c45-4ba1c265369b">


<br />


## Project Structure


Backend:
```

├─energy-server
│      └─src
│      ├─main
│      │  ├─java
│      │  │  └─donTouch
│      │  │      └─energy_server
│      │  │          ├─energy
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─kafka
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          └─utils
│      │  └─resources
│      └─test
│          └─java
│              └─donTouch
│                  └─energy_server
├─estate-server
│      └─src
│      ├─main
│      │  ├─java
│      │  │  └─donTouch
│      │  │      └─estate_server
│      │  │          ├─estate
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  ├─service
│      │  │          │  └─utils
│      │  │          ├─kafka
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          └─utils
│      │  └─resources
│      └─test
│          └─java
│              └─donTouch
│                  └─estate_server
├─order-server
│      └─src
│      ├─main
│      │  ├─java
│      │  │  └─donTouch
│      │  │      └─order_server
│      │  │          ├─bankAccount
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─holding
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─kafka
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─log
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          └─utils
│      │  └─resources
│      └─test
│          └─java
│              └─donTouch
│                  └─order_server
├─src
│  ├─main
│  │  └─java
│  │      └─donTouch
│  │          └─backend_server
│  └─test
│      └─java
│          └─donTouch
│              └─backend_server
├─stock-server
│  └─src
│      ├─main
│      │  ├─java
│      │  │  └─donTouch
│      │  │      └─stock_server
│      │  │          ├─dividend
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─kafka
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─krStock
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─stock
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─usStock
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          └─web
│      │  │              └─dto
│      │  └─resources
│      └─test
│          └─java
│              └─donTouch
│                  └─stock_server
├─user-server
│  └─src
│      ├─main
│      │  ├─java
│      │  │  └─donTouch
│      │  │      └─user_server
│      │  │          ├─kafka
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─like
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─oauth
│      │  │          │  ├─config
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─user
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  ├─service
│      │  │          │  └─utils
│      │  │          ├─userEnergy
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          ├─userEstate
│      │  │          │  ├─domain
│      │  │          │  ├─dto
│      │  │          │  └─service
│      │  │          └─userStock
│      │  │              ├─domain
│      │  │              ├─dto
│      │  │              └─service
│      │  └─resources
│      └─test
│          └─java
│              └─donTouch
│                  └─user_server

```
