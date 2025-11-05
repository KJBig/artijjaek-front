// src/composables/useAuthGuard.ts
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * ✅ 공통 인증 가드 (throw 방식)
 * - 쿼리의 email/token 유무 확인
 * - loadFn에서 throw 발생 시 fatal=true로 처리
 * - 인증 검증 실패 시 화면에 AuthErrorPanel 노출 가능
 */
export function useAuthGuard() {
  const route = useRoute()

  // --- 파라미터 검증 ---
  const hasValidParams = computed(() => !!email.value && !!token.value)
  const email = computed(() => (route.query.email as string | undefined)?.trim())
  const token = computed(() => (route.query.token as string | undefined)?.trim())

  // --- 상태 관리 ---
  const isLoading = ref(false)
  const fatal = ref(false)
  const error = ref<string | undefined>(undefined)

  /**
   * load:
   * 인증 검증 로직을 감싸는 헬퍼
   * @param loadFn (email, token)을 받아 Promise를 반환하는 함수
   * @returns loadFn의 결과 (오류 발생 시 undefined 반환)
   */
  async function load<T>(loadFn: (email: string, token: string) => Promise<T>) {
    // 1️⃣ 파라미터 누락 시 즉시 fatal
    if (!hasValidParams.value) {
      fatal.value = true
      error.value = '필수 파라미터(email, token) 누락'
      return undefined
    }

    isLoading.value = true
    error.value = undefined

    try {
      // 2️⃣ 호출부에서 throw 하면 여기로 캐치됨
      const data = await loadFn(email.value!, token.value!)
      return data
    } catch (e: any) {
      fatal.value = true
      error.value = e?.message ?? '인증 검증에 실패했습니다.'
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  /** fatal 상태 초기화 (ex. 재시도 버튼 클릭 시) */
  function reset() {
    fatal.value = false
    error.value = undefined
  }

  // --- 외부 노출 ---
  return {
    email,
    token,
    hasValidParams,
    isLoading,
    fatal,
    error,
    load,
    reset,
  }
}
