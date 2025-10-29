<template>
  <section class="fatal-panel" role="alert" aria-labelledby="fatal-title">
    <div class="fatal-hero" aria-hidden="true">
      <slot name="icon">
        <img src="/401_logo.png" alt="인증 오류 아이콘" class="fatal-img" />
      </slot>
    </div>

    <h1 id="fatal-title" class="fatal-title">{{ title }}</h1>
    <p class="fatal-desc" v-if="message" v-html="message" />

    <div class="fatal-actions">
      <button v-if="primaryText" class="btn-primary" type="button" @click="$emit('primary')">
        {{ primaryText }}
      </button>
      <button v-if="secondaryText" class="btn-ghost" type="button" @click="$emit('secondary')">
        {{ secondaryText }}
      </button>
    </div>

  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  message?: string
  primaryText?: string
  secondaryText?: string
  error?: unknown
}>()

defineEmits<{
  (e: 'primary'): void
  (e: 'secondary'): void
}>()

/** 에러를 사람이 읽기 좋은 문자열로 정규화 */
const errorText = computed(() => {
  const e = props.error
  if (!e) return undefined
  if (typeof e === 'string') return e
  if (e instanceof Error) return e.message || String(e)
  try {
    return JSON.stringify(e, null, 2)
  } catch {
    return String(e)
  }
})
</script>

<style scoped>
.fatal-panel{
  width:min(640px,100%);
  background:#fff;
  border:1px solid #eeeaf6;
  border-radius:16px;
  box-shadow:0 10px 30px rgba(20,20,33,.06);
  padding:28px 24px 24px;
  text-align:center;
}
.fatal-img{ width:72px; height:auto; margin-bottom:8px; user-select:none; }
.fatal-hero{ display:flex; align-items:center; justify-content:center; margin-bottom:8px; }
.fatal-title{ margin:8px 0 6px; font-size:22px; font-weight:800; color:#251f35; }
.fatal-desc{ color:#6e6a7e; font-size:14px; line-height:1.6; margin-bottom:16px; }
.fatal-actions{ display:flex; gap:8px; justify-content:center; margin-bottom:8px; }
.btn-primary{
  color:#fff; border:1px solid rgba(118,82,201,0);
  background:linear-gradient(135deg,#6675E0 0%,#7652C9 100%);
  box-shadow:0 4px 10px rgba(102,117,224,.25);
  border-radius:10px; padding:10px 20px; font-weight:700; cursor:pointer;
  transition:transform .15s, box-shadow .2s;
}
.btn-primary:hover{ transform:translateY(-1px); box-shadow:0 6px 14px rgba(102,117,224,.32); }
.btn-ghost{
  background:#fff; color:#5746c7; border:1px solid rgba(118,82,201,.35);
  border-radius:10px; padding:10px 20px; font-weight:700; cursor:pointer;
  transition:background .2s, border-color .2s, color .2s;
}
.btn-ghost:hover{
  background:linear-gradient(135deg,rgba(102,117,224,.08),rgba(118,82,201,.10));
  border-color:rgba(118,82,201,.55); color:#4b3ec2;
}

</style>
