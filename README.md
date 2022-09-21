# Boss Raid system 서비스

<div align="center">
  <img src="https://img.shields.io/badge/node-16.17.0-339933?logo=node.js"> 
  <img src="https://img.shields.io/badge/NestJS-9.0.0-E0234E?logo=NestJS"> 
  <img src="https://img.shields.io/badge/TypeScript-4.4.5-3178C6?logo=typescript"> 
  <img src="https://img.shields.io/badge/Postgres-14-4479A1?logo=Postgresql"> 
  <img src="https://img.shields.io/badge/Swagger-6.1.0-DC382D?logo=swagger"> 
  <img src="https://img.shields.io/badge/TypeORM-0.3.9-010101"> 
</div>

## 소개

> 보스레이드 컨텐츠 관련 기능을 제공하는 백엔드 서비스입니다.

---

| 👉 목차                        |                                                                         |
| ------------------------------ | ----------------------------------------------------------------------- |
| [1. 서비스 개요](#서비스-개요) | 서비스 기능 설명 및 고려사항                                            |
| [2. 구현 사항](#구현-사항)     | API 구현 사항 간단 설명 (자세한 정보를 원하시면 넘어가셔도 무방합니다.) |
| [3. To Do](#to-do)             | 아직 구현 못 한 기능                                                    |
| [4. ERD](#erd)                 | 서비스 ERD 모델                                                         |
| [5. 참조 문서](#참조-문서)     | 서비스 전반적인 문서 확인                                               |

---

# 서비스 개요

- 본 서비스는 `유저 생성`, `유저 정보 조회`, `보스레이드 생성 / 종료`, `보스레이드 상태 조회`, `랭킹 조회 기능`을 제공합니다.
- 한 번에 한 명의 유저만 보스레이드를 돌릴 수 있게 하기 위해서 동시성을 고려하여 서비스를 구현하였습니다.
- static(일정 시간동안 변함이 없는)데이터는 레디스를 사용하여 요청에 대한 응답을 효율적으로 처리하도록 구현하였습니다.

# 구현 사항

<details>
<summary>간단 명세</summary>
<div markdown="1">

### 유저

- 유저 생성

  - 중복되지 않는 userId를 생성
  - 생성된 userId를 응답

- 유저 조회
  - 해당 유저의 보스레이드 총 점수와 참여기록 응답

### 보스 레이드

- 보스레이드 상태 조회

  - 보스레이드 현재 상태 응답
    - canEnter: 입장 가능 여부
    - enteredUserId: 현재 진행중인 유저가 있다면, 해당 유저의 id
  - 입장 가능 조건: 한 번에 한 명의 유저만 보스레이드를 진행할 수 있음.
    - 아무도 보스레이드를 시작한 기록이 없다면 시작 가능
    - 시작한 기록이 있다면 마지막으로 시작한 유저가 보스레이드를 종료했거나 마지막으로 시작한 시간으로부터 **레이드 제한 시간**만큼 경과되었어야 함

- 보스레이드 시작

  - 레이드 시작 가능: 중복되지 않는 raidRecordId를 생성하여 `{ isEntered:true }`와 함께 응답
  - 레이드 시작 불가: `{ isEntered: false }`응답

- 보스레이드 종료
  - raidRecordId 종료 처리
    - 레이드 level에 따른 score 반영
  - 유효성 검사
    - 저장된 userId와 raidRecordId 일치하지 않다면 예외 처리
    - 시작한 시간으로부터 **레이드 제한 시간**이 지났다면 예외 처리
- 보스레이드 랭킹 조회

  - 보스레이드 **totalScore 내림차순**으로 랭킹을 조회\.

    </div>

</details>

# TO DO

### 동시성 고려

- Redis lock을 이용한 동시성 고려

# ERD

<img width="785" alt="스크린샷 2022-09-01 오후 10 44 18" src="https://user-images.githubusercontent.com/54757435/191417502-00de0298-09d5-4df5-9049-ae3b8041cd62.png">
</br>

## 5. Swagger

- API를 테스트는 Swagger를 이용해 가능합니다.
- URL: localhost:3000/docs

# 참조문서

## 📒 [노션](https://www.notion.so/raid-service-e0373b47ad9f4a59959606304abda17b) - 아래의 내용을 한번에 보실 수 있습니다.

## 📒 [API 명세서](https://www.notion.so/4-API-89b65a63a31a488e951a7a723de8c840)

자세한 내용은 스웨거 페이지에서 가능하니 스웨거를 이용해주시면 매우 감사하겠습니다.🙇🏻‍♂️

## 📌 [개발 컨벤션](https://www.notion.so/2-Convention-Code-a22bd5aebcbc4116bf7d88107b13af13)

## 🥵 [이슈 & 회고](https://www.notion.so/61ab86aa557d47c6a394d62fd813cf50)
