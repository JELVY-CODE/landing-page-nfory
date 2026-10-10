import type { Locale } from "@/lib/i18n/config";

export const notFoundCopy: Record<Locale, { title: string; text: string; back: string }> = {
  es: { title: "Este nodo no existe", text: "La página que buscas no existe o se ha movido. Volvamos a la red principal.", back: "Volver al inicio" },
  en: { title: "This node doesn't exist", text: "The page you're looking for doesn't exist or has moved. Let's head back to the main network.", back: "Back to home" },
  ko: { title: "존재하지 않는 노드입니다", text: "찾으시는 페이지가 없거나 이동되었습니다. 메인 네트워크로 돌아가세요.", back: "홈으로 돌아가기" },
  ja: { title: "このノードは存在しません", text: "お探しのページは存在しないか、移動した可能性があります。メインネットワークに戻りましょう。", back: "ホームに戻る" },
  zh: { title: "该节点不存在", text: "您访问的页面不存在或已被移动。返回主网络吧。", back: "返回首页" },
  de: { title: "Dieser Knoten existiert nicht", text: "Die gesuchte Seite existiert nicht oder wurde verschoben. Zurück zum Hauptnetzwerk.", back: "Zur Startseite" },
  ru: { title: "Такого узла нет", text: "Страница, которую вы ищете, не существует или была перемещена. Вернёмся в основную сеть.", back: "На главную" },
};
