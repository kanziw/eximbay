# eximbay
> eximbay module for Node.js.

- eximbay 개발사와 저는 전혀 상관 없으며, 이용 중 발생한 문제에 대해 책임지지 않습니다.
- Backend (Server) 작업을 위해 생성한 패키지 이므로, Frontend (Client) 쪽은 크게 고려하지 않고 만들었습니다.



## Remark

아래 Sequence 도식을 가정하고 작업합니다.

```sequence
Title: Eximbay payment scenario

participant Server
participant Client
participant Exmibay

Client->Server: 1)구입 가능한 아이템 리스트 요청
Server->Client: 2)활성화 되어 있는 ProductID 리스트 반환
Client->Server: 3)구입하고자 하는 ProductId 전달 (결제 시작)
Server->Client: 4)OrderId, statusurl 및 returnurl 전달
Client->Exmibay: 5)결제 진행
Exmibay->Server: 6)statusurl로 결제 되었음을 알림
Server->Exmibay: 7)OrdierId 가 정상 결제되었는지 확인
Exmibay->Server: 8)정상 처리 되었음을 반환
Server->Server: 9)결제 진행 (중복 확인 필수)
Exmibay->Client: 10)결제 완료 되었음 알림
Client->Server: 11)결제 확인 요청
Server->Client: 12)결제 확인 및 프로필 등의 정보 반환
Client->Client: 13)확인버튼을 누르면 returnurl 로 redirecet 됨
```

* 이 모듈은 아래의 순서와 관련된 **일부** 내용만 구현합니다.
  * Client :  5)
  * Server : 7)



## 설치
```bash
npm i --save eximbay
```



## 기능

### Client

1. 결제

### Server

1. 유효한 결제인지 검증
