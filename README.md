# 바닐라 JS 커뮤니티 👾

순수 바닐라 자바스크립트로 구현한 커뮤니티 웹 애플리케이션입니다.

## 배포 링크
[https://2-suzy-kang-community-fe.vercel.app](https://2-suzy-kang-community-fe.vercel.app)

## 화면 스크린샷
![화면](https://github.com/user-attachments/assets/7d96d5fb-4612-447c-b862-c6a7a8765f37)

## 주요 기능

### 인증
- 회원가입 (이메일, 비밀번호, 닉네임, 프로필 이미지)
- 로그인/로그아웃
- 회원정보 수정 (프로필 이미지, 닉네임)
- 비밀번호 변경
- 회원탈퇴

### 게시글
- 게시글 목록 조회
- 게시글 작성 (제목, 내용, 이미지 첨부)
- 게시글 상세 조회
- 게시글 수정/삭제
- 조회수 확인
- 좋아요 기능

### 댓글
- 댓글 작성
- 댓글 수정/삭제
- 댓글 수 확인

## 기술 스택
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage (데이터 저장)

## 특징
- 외부 라이브러리나 프레임워크 없이 순수 자바스크립트로 구현
- LocalStorage를 활용한 데이터 관리
- 실시간 폼 유효성 검사
- 모달, 토스트 메시지 등 UI 컴포넌트 구현

## 실행 방법
1. 저장소 클론
```
bash
git clone [repository-url]
```

2. Live Server 등을 사용하여 로컬 서버 실행

3. 브라우저에서 접속
```
http://localhost:[port]
```

## 프로젝트 구조
```
.
├── components/ # 재사용 가능한 컴포넌트
├── features/ # 주요 기능별 모듈
│ ├── auth/ # 인증 관련
│ └── posts/ # 게시글 관련
├── styles/ # 공통 스타일
└── utils/ # 유틸리티 함수
```

## TODO
- 모달, 토스트 공통 컴포넌트 분리
- 페이지 당, JS 이벤트 한 곳에 모아두기