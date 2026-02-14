<template>
  <div class="policy-page">
    <main class="policy-main">
      <section class="policy-card" aria-labelledby="policy-title">
        <h1 id="policy-title" class="policy-title">개인정보처리방침</h1>
        <p class="policy-intro">
          아티짹(이하 "서비스")은 이용자의 개인정보를 안전하게 보호하기 위해 다음과 같이 개인정보 처리방침을 수립하고 공개합니다.
        </p>

        <details class="policy-item">
          <summary>1. 개인정보 처리자 정보</summary>
          <div class="policy-content">
            <p>서비스명: 아티짹</p>
            <p>운영자: 개인 개발자</p>
            <p>
              문의 이메일:
              <a href="mailto:artijjaek.dev@gmail.com">artijjaek.dev@gmail.com</a>
            </p>
          </div>
        </details>

        <details class="policy-item">
          <summary>2. 수집하는 개인정보 항목</summary>
          <div class="policy-content">
            <p>서비스는 다음의 개인정보를 수집합니다.</p>
            <ul>
              <li>이메일 주소</li>
            </ul>
          </div>
        </details>

        <details class="policy-item">
          <summary>3. 개인정보의 처리 목적</summary>
          <div class="policy-content">
            <p>수집된 개인정보는 다음 목적에 한하여 사용됩니다.</p>
            <ol>
              <li>기술 아티클 메일 발송</li>
              <li>구독 상태 관리 및 중복 발송 방지</li>
              <li>구독 해지 처리</li>
              <li>문의 응대 및 답변 발송</li>
              <li>서비스 운영 및 오류 대응</li>
            </ol>
          </div>
        </details>

        <details class="policy-item">
          <summary>4. 개인정보의 보유 및 이용 기간</summary>
          <div class="policy-content">
            <p>이메일 정보는 구독 유지 기간 동안 보관됩니다.</p>
            <p>이용자가 구독 해지를 요청한 경우:</p>
            <ul>
              <li>관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관 후 파기합니다.</li>
            </ul>
          </div>
        </details>

        <details class="policy-item">
          <summary>5. 개인정보의 제3자 제공</summary>
          <div class="policy-content">
            <p>서비스는 이용자의 개인정보를 외부에 제공하지 않습니다.</p>
          </div>
        </details>

        <details class="policy-item">
          <summary>6. 개인정보 처리 위탁</summary>
          <div class="policy-content">
            <p>서비스는 원활한 이메일 발송을 위해 아래와 같이 개인정보 처리를 위탁할 수 있습니다.</p>
            <ul>
              <li>수탁자: 이메일 발송 서비스 제공자(예: AWS SES, SendGrid, Gmail SMTP 등)</li>
              <li>위탁 업무 내용: 이메일 발송 처리</li>
            </ul>
            <p>서비스는 위탁 계약 시 개인정보 보호법에 따라 안전하게 처리되도록 관리·감독합니다.</p>
          </div>
        </details>

        <details class="policy-item">
          <summary>7. 개인정보 파기 절차 및 방법</summary>
          <div class="policy-content">
            <p>개인정보는 보유기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다.</p>
            <ul>
              <li>복구 불가능한 방식으로 영구 삭제</li>
            </ul>
          </div>
        </details>

        <details class="policy-item">
          <summary>8. 이용자의 권리와 행사 방법</summary>
          <div class="policy-content">
            <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람 요청</li>
              <li>정정 요청</li>
              <li>삭제 요청</li>
              <li>처리정지 요청</li>
            </ul>
            <p>요청은 문의 이메일을 통해 가능하며, 확인 후 지체 없이 조치합니다.</p>
          </div>
        </details>

        <details class="policy-item">
          <summary>9. 개인정보 처리방침 변경</summary>
          <div class="policy-content">
            <p>본 방침은 변경될 수 있으며, 변경 시 서비스 공지 또는 이메일을 통해 사전 안내합니다.</p>
          </div>
        </details>

        <p class="policy-date">시행일: 2026년 2월 14일</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.policy-page {
  min-height: 90vh;
  background: #ffffff;
  padding: 40px 16px;
}

.policy-main {
  display: flex;
  justify-content: center;
}

.policy-card {
  width: min(860px, 100%);
  background: #fff;
  border: 1px solid #e9e9f1;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(20, 20, 33, 0.06);
  padding: 28px 24px;
}

.policy-title {
  margin: 0;
  font-size: 28px;
  color: #1f1f2b;
}

.policy-intro {
  margin: 10px 0 18px;
  color: #47445a;
  line-height: 1.6;
  font-size: 15px;
}

.policy-item {
  border: 1px solid #ecebf6;
  border-radius: 10px;
  background: #fcfcff;
}

.policy-item + .policy-item {
  margin-top: 10px;
}

.policy-item summary {
  cursor: pointer;
  list-style: none;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 700;
  color: #2a2733;
}

.policy-item summary::-webkit-details-marker {
  display: none;
}

.policy-content {
  border-top: 1px solid #efeff7;
  padding: 12px 14px 14px;
  color: #47445a;
  line-height: 1.6;
  font-size: 14px;
}

.policy-content p {
  margin: 0;
}

.policy-content p + p {
  margin-top: 6px;
}

.policy-content ul,
.policy-content ol {
  margin: 8px 0 0;
  padding-left: 18px;
}

.policy-content li + li {
  margin-top: 4px;
}

.policy-content a {
  color: #4b42b9;
  text-decoration: underline;
}

.policy-date {
  margin: 16px 2px 0;
  color: #6e6a7e;
  font-size: 13px;
}
</style>
