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
