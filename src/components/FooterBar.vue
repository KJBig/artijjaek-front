<template>
  <footer class="footer">
    <div class="inner">
      <!-- 왼쪽 브랜드 영역 -->
      <div class="brand" aria-label="브랜드 정보">
        <div class="row brand-row">
          <strong class="name">아티짹</strong>
          <span class="copy">© {{ year }} Artijjaek. All rights reserved.</span>
        </div>
      </div>

      <!-- 오른쪽 링크 영역 -->
      <nav class="links" aria-label="푸터 링크">
        <!-- Contact -->
        <div class="row contact">
          <span
            v-if="copied"
            class="copied-msg"
            role="status"
            aria-live="polite"
          >
            📋 복사되었습니다!
          </span>

          <strong class="group">Contact</strong>
          <a
            href="#"
            class="link"
            @click.prevent="copyEmail"
            :aria-label="`이메일 복사: ${email}`"
          >
            {{ email }}
          </a>
        </div>

        <!-- ETC -->
        <div class="row">
          <strong class="group">ETC</strong>
          <a href="https://forms.gle/jBLyotpvuaXweZbe7" class="link">서비스 피드백</a>
        </div>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const year = new Date().getFullYear();
const email = "artijjaek.dev@gmail.com";
const copied = ref(false);

const copyEmail = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1000);
  } catch (err) {
    alert("복사에 실패했습니다 😢");
  }
};
</script>

<style scoped>
/* Footer는 화이트 베이스 + 보라 악센트 */
.footer {
  width: 100%;
  background: #ffffff;
  border-top: 1px solid rgba(118, 82, 201, 0.18);
  color: #433d53;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

/* 브랜드 영역 */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.brand-row {
  gap: 6px;
}
.name {
  font-weight: 800;
  letter-spacing: 0.2px;
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.copy {
  font-size: 13px;
  color: #6c6a78;
  opacity: 0.9;
}

/* 오른쪽 링크 전체 */
.links {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 40px;
}

/* 각 블럭 내부 세로 정렬 */
.row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

/* Contact 블록 기준점 */
.contact {
  position: relative;
}

.group {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #5746c7;
}

/* 복사 완료 메시지 */
.copied-msg {
  position: absolute;
  top: -8px;
  left: 0;
  transform: translateY(-100%);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  box-shadow: 0 6px 16px rgba(102, 117, 224, 0.25);
}

/* 링크 스타일 */
.link {
  font-size: 14px;
  text-decoration: none;
  padding: 4px 6px;
  border-radius: 8px;
  color: #4b3ec2;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease, box-shadow 0.2s ease;
}
.link:hover {
  background: linear-gradient(
    135deg,
    rgba(102, 117, 224, 0.08) 0%,
    rgba(118, 82, 201, 0.1) 100%
  );
  color: #3e34b6;
  border-color: rgba(118, 82, 201, 0.35);
}
.link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(118, 82, 201, 0.22);
  border-color: rgba(118, 82, 201, 0.55);
}

/* 반응형 */
@media (max-width: 768px) {
  .inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .links {
    gap: 24px;
  }
}
</style>
