// src/constants/withdrawReasons.ts
export enum UnsubscriptionReasonId {
  NO_COMPANY = "NO_COMPANY",
  TOO_MANY_EMAILS = "TOO_MANY_EMAILS",
  INCONVENIENCE = "INCONVENIENCE",
  ERROR = "ERROR",
  ETC = "ETC",
}

export type WithdrawReason = {
  id: UnsubscriptionReasonId;
  label: string;   // 화면 표기용
};

// ✅ 화면에 보여줄 고정 리스트
export const UNSUBSCRIPTION_REASONS: ReadonlyArray<WithdrawReason> = [
  { id: UnsubscriptionReasonId.NO_COMPANY, label: "원하는 기업이 없어요" },
  { id: UnsubscriptionReasonId.TOO_MANY_EMAILS, label: "매일 오는 이메일이 번거로워요" },
  { id: UnsubscriptionReasonId.INCONVENIENCE, label: "불필요함을 느껴요" },
  { id: UnsubscriptionReasonId.ERROR, label: "서비스 장애가 발생했어요" },
  { id: UnsubscriptionReasonId.ETC, label: "기타" },
];

// 선택 항목 라벨 헬퍼 (옵션)
export const getReasonLabel = (id: UnsubscriptionReasonId | string) =>
  UNSUBSCRIPTION_REASONS.find(r => r.id === id)?.label ?? "";
